# Instala o actualiza Licorería Chilalo en la PC servidor de la tienda.
# Ejecutar como Administrador desde la carpeta del release descomprimido:
#   powershell -ExecutionPolicy Bypass -File .\instalar.ps1
#
# - Primera vez: crea C:\Chilalo, la configuración, el servicio, el firewall y el respaldo diario.
# - Actualización: detiene el servicio, reemplaza app\ y web\, y lo vuelve a iniciar.
#   Nunca toca config\, logs\ ni backups\.

param(
    [string]$Destino = 'C:\Chilalo',
    [int]$Puerto = 8080
)

$ErrorActionPreference = 'Stop'
$origen    = $PSScriptRoot
$servicio  = 'ChilaloBackend'
$tareaBkp  = 'Chilalo - Respaldo diario BD'

function Paso($msg)  { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Aviso($msg) { Write-Host "    AVISO: $msg" -ForegroundColor Yellow }

# Ejecuta un programa externo sin que sus avisos por stderr aborten el script (PowerShell 5.1)
function Ejecutar([scriptblock]$Comando, [string]$MsgError) {
    $ErrorActionPreference = 'Continue'
    & $Comando
    if ($LASTEXITCODE -ne 0) { throw $MsgError }
}

# ── Requisitos ───────────────────────────────────────────────────────────────
$esAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $esAdmin) { throw 'Ejecuta este script como Administrador (clic derecho > Ejecutar como administrador).' }

Paso 'Verificando Java 17+'
$java = (Get-Command java -ErrorAction SilentlyContinue).Source
if (-not $java) { throw 'No se encontró Java. Instala JDK 17 o superior y vuelve a ejecutar.' }
$verTxt = (& cmd /c "`"$java`" -version 2>&1") -join ' '
if ($verTxt -match 'version "(\d+)') { $verJava = [int]$Matches[1] } else { $verJava = 0 }
if ($verJava -lt 17) { throw "Se requiere Java 17 o superior (encontrado: $verTxt)" }
Write-Host "    $java (Java $verJava)"

Paso 'Verificando PostgreSQL'
$pgServicio = Get-Service | Where-Object { $_.Name -like 'postgresql*' } | Select-Object -First 1
if (-not $pgServicio) { throw 'No se encontró el servicio de PostgreSQL. Instálalo primero.' }
if ($pgServicio.StartType -ne 'Automatic') { Set-Service $pgServicio.Name -StartupType Automatic }
if ($pgServicio.Status -ne 'Running') { Start-Service $pgServicio.Name }
Write-Host "    Servicio: $($pgServicio.Name)"

# ── Copiar archivos ──────────────────────────────────────────────────────────
$existeServicio = [bool](Get-Service $servicio -ErrorAction SilentlyContinue)
if ($existeServicio) {
    Paso 'Deteniendo el servicio para actualizar'
    Stop-Service $servicio -Force -ErrorAction SilentlyContinue
    (Get-Service $servicio).WaitForStatus('Stopped', [TimeSpan]::FromSeconds(60))
}

Paso "Copiando archivos a $Destino"
foreach ($d in 'app', 'web', 'scripts', 'config', 'logs', 'backups') {
    New-Item -ItemType Directory -Force (Join-Path $Destino $d) | Out-Null
}
Remove-Item (Join-Path $Destino 'web\*') -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $origen 'app\*')     (Join-Path $Destino 'app')     -Recurse -Force
Copy-Item (Join-Path $origen 'web\*')     (Join-Path $Destino 'web')     -Recurse -Force
Copy-Item (Join-Path $origen 'scripts\*') (Join-Path $Destino 'scripts') -Recurse -Force
Copy-Item (Join-Path $origen 'LEEME.md'), (Join-Path $origen 'VERSION.txt') $Destino -Force

# ── Configuración (solo la primera vez) ──────────────────────────────────────
$config = Join-Path $Destino 'config\application-prod.properties'
if (-not (Test-Path $config)) {
    Paso 'Creando configuración de producción'
    $ipPorDefecto = ''
    $version = Get-Content (Join-Path $origen 'VERSION.txt') -ErrorAction SilentlyContinue
    if ("$version" -match 'http://([\d\.]+):') { $ipPorDefecto = $Matches[1] }

    $bd   = Read-Host 'Nombre de la base de datos [licoreria_db]';  if (-not $bd)   { $bd = 'licoreria_db' }
    $usr  = Read-Host 'Usuario de PostgreSQL [postgres]';           if (-not $usr)  { $usr = 'postgres' }
    $claveS = Read-Host 'Contraseña de PostgreSQL' -AsSecureString
    $clave = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($claveS))
    $ip   = Read-Host "IP fija de este servidor [$ipPorDefecto]";   if (-not $ip)   { $ip = $ipPorDefecto }

    $bytes = New-Object byte[] 64
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $jwt = [Convert]::ToBase64String($bytes)

    $contenido = @"
# Configuración de esta instalación (sobreescribe los valores del jar).
# Generado por instalar.ps1 el $(Get-Date -Format 'yyyy-MM-dd HH:mm'). Reinicia el servicio tras editar.
server.port=$Puerto
spring.datasource.url=jdbc:postgresql://localhost:5432/$bd
spring.datasource.username=$usr
spring.datasource.password=$clave

# Clave para firmar los tokens de sesión (única por instalación; si cambia, todos deben volver a iniciar sesión)
jwt.secret=$jwt

# Enlace de los correos de recuperación de contraseña
app.frontend-url=http://${ip}:$Puerto
"@
    # UTF-8 sin BOM (Spring lee .properties como ISO-8859-1/UTF-8)
    [IO.File]::WriteAllText($config, $contenido, (New-Object Text.UTF8Encoding $false))

    # Solo Administradores y SYSTEM pueden leer la configuración (contiene contraseñas)
    # (SIDs: S-1-5-32-544 = Administradores, S-1-5-18 = SYSTEM; funcionan en Windows en cualquier idioma)
    icacls (Join-Path $Destino 'config') /inheritance:r /grant:r '*S-1-5-32-544:(OI)(CI)F' '*S-1-5-18:(OI)(CI)F' | Out-Null
} else {
    Write-Host "    Se conserva la configuración existente: $config"
}

# ── Servicio de Windows (WinSW) ──────────────────────────────────────────────
Paso 'Configurando el servicio de Windows'
$xml = @"
<service>
  <id>$servicio</id>
  <name>Chilalo Backend</name>
  <description>Sistema POS/ERP Licorería Chilalo (API + frontend en el puerto $Puerto)</description>
  <executable>$java</executable>
  <arguments>-Xms256m -Xmx1024m -Dfile.encoding=UTF-8 -jar "%BASE%\licoreria-backend.jar" --spring.profiles.active=prod</arguments>
  <workingdirectory>$Destino</workingdirectory>
  <depend>$($pgServicio.Name)</depend>
  <startmode>Automatic</startmode>
  <onfailure action="restart" delay="10 sec"/>
  <onfailure action="restart" delay="30 sec"/>
  <onfailure action="restart" delay="60 sec"/>
  <resetfailure>1 hour</resetfailure>
  <stoptimeout>30 sec</stoptimeout>
  <logpath>$Destino\logs</logpath>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>5</keepFiles>
  </log>
</service>
"@
$exe = Join-Path $Destino 'app\chilalo-backend.exe'
[IO.File]::WriteAllText((Join-Path $Destino 'app\chilalo-backend.xml'), $xml, (New-Object Text.UTF8Encoding $false))
$accionSvc = if ($existeServicio) { 'refresh' } else { 'install' }
Ejecutar { & $exe $accionSvc } 'No se pudo registrar el servicio'

# ── Firewall ─────────────────────────────────────────────────────────────────
Paso "Abriendo el puerto $Puerto en el firewall (redes privadas)"
$regla = 'Chilalo Backend'
Get-NetFirewallRule -DisplayName $regla -ErrorAction SilentlyContinue | Remove-NetFirewallRule
New-NetFirewallRule -DisplayName $regla -Direction Inbound -Protocol TCP -LocalPort $Puerto `
    -Action Allow -Profile Private, Domain | Out-Null
$publicas = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Public' }
foreach ($p in $publicas) {
    Aviso "La red '$($p.Name)' está marcada como PÚBLICA: otras PCs no podrán conectarse."
    Aviso "Cámbiala a privada con:  Set-NetConnectionProfile -InterfaceIndex $($p.InterfaceIndex) -NetworkCategory Private"
}

# ── Respaldo diario ──────────────────────────────────────────────────────────
Paso 'Programando el respaldo diario de la base de datos (04:00)'
$accion = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Destino\scripts\backup.ps1`"" -WorkingDirectory $Destino
$disparador = New-ScheduledTaskTrigger -Daily -At '04:00'
# StartWhenAvailable: si la PC estaba apagada a las 04:00, se ejecuta al encenderla
$ajustes = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName $tareaBkp -Action $accion -Trigger $disparador -Settings $ajustes `
    -User 'SYSTEM' -RunLevel Highest -Force | Out-Null

# ── Iniciar y verificar ──────────────────────────────────────────────────────
Paso 'Iniciando el servicio'
Start-Service $servicio
$ok = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 3
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$Puerto/" -UseBasicParsing -TimeoutSec 5
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch { }
}
if ($ok) {
    Write-Host "`nInstalación completa." -ForegroundColor Green
    Write-Host "  Sistema:   http://localhost:$Puerto  (desde otras PCs: http://<IP-del-servidor>:$Puerto)"
    Write-Host "  Logs:      $Destino\logs\backend.log"
    Write-Host "  Respaldos: $Destino\backups"
} else {
    Write-Host "`nEl servicio no respondió a tiempo. Revisa $Destino\logs\backend.log y $Destino\logs\$servicio.err.log" -ForegroundColor Red
    exit 1
}
