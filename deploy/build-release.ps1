# Genera el paquete de producción de Licorería Chilalo (se ejecuta en la PC de desarrollo).
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1 -ServerIp 192.168.1.10
#
# Resultado: deploy\release\Chilalo\ y deploy\release\Chilalo-<fecha>.zip
# Copia el .zip a la PC servidor de la tienda y ejecuta instalar.ps1 (ver LEEME.md).

param(
    [Parameter(Mandatory = $true)][string]$ServerIp,
    [int]$Puerto = 8080
)

$ErrorActionPreference = 'Stop'
$raiz     = Split-Path -Parent $PSScriptRoot
$deploy   = $PSScriptRoot
$salida   = Join-Path $deploy 'release\Chilalo'
$winswUrl = 'https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe'

function Paso($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

# Ejecuta un programa externo sin que sus avisos por stderr aborten el script (PowerShell 5.1)
function Ejecutar([scriptblock]$Comando, [string]$MsgError) {
    $ErrorActionPreference = 'Continue'
    & $Comando
    if ($LASTEXITCODE -ne 0) { throw $MsgError }
}

# 1. Frontend: build apuntando al backend del servidor
Paso "Compilando frontend (API = http://${ServerIp}:$Puerto)"
Push-Location (Join-Path $raiz 'frontend')
try {
    if (-not (Test-Path node_modules)) { Ejecutar { npm ci } 'npm ci falló' }
    $env:VITE_API_URL = "http://${ServerIp}:$Puerto"
    Ejecutar { npm run build } 'El build del frontend falló'
} finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
}

# 2. Backend: jar ejecutable
Paso 'Compilando backend (mvn package)'
Push-Location (Join-Path $raiz 'backend')
try {
    Ejecutar { mvn -q -B -DskipTests clean package } 'El build del backend falló'
} finally { Pop-Location }

# 3. Armar la carpeta del release
Paso "Armando release en $salida"
if (Test-Path $salida) { Remove-Item $salida -Recurse -Force }
New-Item -ItemType Directory -Force (Join-Path $salida 'app'), (Join-Path $salida 'web'), (Join-Path $salida 'scripts') | Out-Null

$jar = Get-ChildItem (Join-Path $raiz 'backend\target') -Filter 'licoreria-backend-*.jar' |
       Where-Object { $_.Name -notlike '*.original' } | Select-Object -First 1
if (-not $jar) { throw 'No se encontró el jar en backend\target' }
Copy-Item $jar.FullName (Join-Path $salida 'app\licoreria-backend.jar')
Copy-Item (Join-Path $raiz 'frontend\dist\*') (Join-Path $salida 'web') -Recurse

$cacheWinsw = Join-Path $deploy '.cache\WinSW-x64.exe'
if (-not (Test-Path $cacheWinsw)) {
    Paso 'Descargando WinSW (servicio de Windows)'
    New-Item -ItemType Directory -Force (Split-Path $cacheWinsw) | Out-Null
    Invoke-WebRequest -Uri $winswUrl -OutFile $cacheWinsw -UseBasicParsing
}
Copy-Item $cacheWinsw (Join-Path $salida 'app\chilalo-backend.exe')

Copy-Item (Join-Path $deploy 'instalar.ps1'), (Join-Path $deploy 'LEEME.md') $salida
Copy-Item (Join-Path $deploy 'backup.ps1'), (Join-Path $deploy 'desinstalar.ps1') (Join-Path $salida 'scripts')
Set-Content -Path (Join-Path $salida 'VERSION.txt') -Encoding UTF8 -Value @(
    "Compilado: $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    "Servidor:  http://${ServerIp}:$Puerto",
    "Commit:    $(try { Ejecutar { git -C $raiz rev-parse --short HEAD } '' } catch { '?' })"
)

# 4. Zip
$zip = Join-Path $deploy "release\Chilalo-$(Get-Date -Format 'yyyyMMdd-HHmm').zip"
Compress-Archive -Path $salida -DestinationPath $zip -Force
Paso "Listo: $zip"
