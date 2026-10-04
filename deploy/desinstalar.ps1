# Quita el servicio, la tarea de respaldo y la regla de firewall de Licorería Chilalo.
# NO borra C:\Chilalo (configuración, logs, respaldos) ni la base de datos.
# Ejecutar como Administrador:
#   powershell -ExecutionPolicy Bypass -File C:\Chilalo\scripts\desinstalar.ps1

$ErrorActionPreference = 'Continue'
$base = Split-Path -Parent $PSScriptRoot
$exe  = Join-Path $base 'app\chilalo-backend.exe'

if (Get-Service ChilaloBackend -ErrorAction SilentlyContinue) {
    Stop-Service ChilaloBackend -Force
    & $exe uninstall
}
Unregister-ScheduledTask -TaskName 'Chilalo - Respaldo diario BD' -Confirm:$false -ErrorAction SilentlyContinue
Get-NetFirewallRule -DisplayName 'Chilalo Backend' -ErrorAction SilentlyContinue | Remove-NetFirewallRule

Write-Host "Servicio, tarea de respaldo y regla de firewall eliminados. Los datos en $base y la base de datos se conservan."
