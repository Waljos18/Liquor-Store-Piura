# Respaldo de la base de datos de Licorería Chilalo.
# Lo ejecuta la tarea programada "Chilalo - Respaldo diario BD"; también se puede correr a mano:
#   powershell -ExecutionPolicy Bypass -File C:\Chilalo\scripts\backup.ps1
#
# Restaurar un respaldo (con el servicio detenido):
#   pg_restore -h localhost -U postgres -d licoreria_db --clean --if-exists C:\Chilalo\backups\<archivo>.dump

param([int]$DiasRetencion = 30)

$ErrorActionPreference = 'Stop'
$base    = Split-Path -Parent $PSScriptRoot
$config  = Join-Path $base 'config\application-prod.properties'
$destino = Join-Path $base 'backups'
$log     = Join-Path $base 'logs\backup.log'

function Log($msg) { Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" -Encoding UTF8 }

try {
    $props = @{}
    Get-Content $config -Encoding UTF8 | Where-Object { $_ -match '^\s*([^#=\s][^=]*)=(.*)$' } |
        ForEach-Object { $props[$Matches[1].Trim()] = $Matches[2].Trim() }

    if ($props['spring.datasource.url'] -notmatch '^jdbc:postgresql://([^:/]+)(?::(\d+))?/([^?]+)') {
        throw 'No se pudo leer spring.datasource.url de la configuración'
    }
    $pgHost = $Matches[1]; $pgPort = if ($Matches[2]) { $Matches[2] } else { '5432' }; $bd = $Matches[3]

    $pgDump = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\pg_dump.exe' -ErrorAction SilentlyContinue |
              Sort-Object { [int]($_.Directory.Parent.Name -replace '\D', '') } -Descending | Select-Object -First 1
    if (-not $pgDump) { throw 'No se encontró pg_dump.exe en C:\Program Files\PostgreSQL' }

    New-Item -ItemType Directory -Force $destino | Out-Null
    $archivo = Join-Path $destino "${bd}_$(Get-Date -Format 'yyyyMMdd_HHmm').dump"

    $env:PGPASSWORD = $props['spring.datasource.password']
    # En PowerShell 5.1 el stderr de un .exe se vuelve error: con 'Stop' abortaría ante un simple aviso
    $ErrorActionPreference = 'Continue'
    & $pgDump.FullName -h $pgHost -p $pgPort -U $props['spring.datasource.username'] -F c -f $archivo $bd 2>&1 |
        ForEach-Object { Log "pg_dump: $_" }
    $codigo = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    if ($codigo -ne 0) { throw "pg_dump terminó con código $codigo" }

    $mb = [math]::Round((Get-Item $archivo).Length / 1MB, 2)
    Log "OK  $archivo ($mb MB)"

    Get-ChildItem $destino -Filter '*.dump' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$DiasRetencion) } |
        ForEach-Object { Remove-Item $_.FullName -Force; Log "Eliminado (más de $DiasRetencion días): $($_.Name)" }
} catch {
    Log "ERROR  $_"
    exit 1
} finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
