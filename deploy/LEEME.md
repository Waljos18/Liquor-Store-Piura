# Licorería Chilalo — Puesta en producción (red local)

Un solo servicio de Windows (`ChilaloBackend`) sirve la API **y** el sistema web en el puerto **8080**.
Las cajas, tablets y la app Android se conectan a `http://<IP-del-servidor>:8080`.

```
C:\Chilalo\
  app\       licoreria-backend.jar + chilalo-backend.exe/.xml (servicio)
  web\       sistema web (React)
  config\    application-prod.properties  ← BD, JWT secret, IP (solo Administradores)
  logs\      backend.log, backup.log, logs del servicio
  backups\   respaldos diarios de la BD (30 días)
  scripts\   backup.ps1, desinstalar.ps1
```

## 1. Preparar la PC servidor (una sola vez)

1. **IP fija**: reserva una IP para esta PC en el router (reserva DHCP) o configúrala fija en Windows.
   Todo el sistema (web y Android) depende de esa IP.
2. **Java 17 o superior** (JDK o JRE) instalado.
3. **PostgreSQL** instalado, con la base de datos creada (`licoreria_db`). Las tablas las crea el sistema al arrancar (Flyway).
4. Red de Windows marcada como **Privada** (Configuración > Red > propiedades de la red).
5. Configurar la PC para que **no se suspenda** (Energía > Suspender: Nunca).

## 2. Generar el paquete (en la PC de desarrollo)

```powershell
powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1 -ServerIp 192.168.1.10
```
Usa la IP fija del paso 1. Genera `deploy\release\Chilalo-<fecha>.zip`.

## 3. Instalar (en la PC servidor)

1. Copiar y descomprimir el `.zip`.
2. PowerShell **como Administrador**, dentro de la carpeta `Chilalo` descomprimida:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\instalar.ps1
   ```
3. La primera vez pide: nombre de BD, usuario y contraseña de PostgreSQL, e IP del servidor.
4. Abrir `http://localhost:8080` e iniciar sesión.
5. **Cambiar la contraseña del usuario `admin`** si todavía es la de fábrica.

## 4. Actualizar a una nueva versión

Generar un nuevo `.zip` (paso 2) y volver a ejecutar `instalar.ps1`. Detiene el servicio,
reemplaza `app\` y `web\`, y lo reinicia. **No toca** `config\`, `logs\` ni `backups\`.
Las migraciones nuevas de la BD se aplican solas al arrancar.

## 5. Operación diaria

| Tarea | Comando (PowerShell como Administrador) |
|---|---|
| Ver estado | `Get-Service ChilaloBackend` |
| Reiniciar | `Restart-Service ChilaloBackend` |
| Ver log en vivo | `Get-Content C:\Chilalo\logs\backend.log -Tail 50 -Wait` |
| Respaldo manual | `powershell -ExecutionPolicy Bypass -File C:\Chilalo\scripts\backup.ps1` |
| Desinstalar (conserva datos) | `powershell -ExecutionPolicy Bypass -File C:\Chilalo\scripts\desinstalar.ps1` |

- El servicio arranca solo con Windows (después de PostgreSQL) y se reinicia si se cae.
- El respaldo corre todos los días a las 04:00; si la PC estaba apagada, corre al encenderla.
- **Copia periódicamente `C:\Chilalo\backups` a un USB o a la nube.** Si el disco falla, los respaldos locales se pierden con él.

### Restaurar un respaldo

```powershell
Stop-Service ChilaloBackend
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" -h localhost -U postgres -d licoreria_db --clean --if-exists C:\Chilalo\backups\<archivo>.dump
Start-Service ChilaloBackend
```

## 6. App Android

La app trae una IP por defecto en `data/local/ServerConfig.kt` (`DEFAULT_BASE_URL`). Cámbiala a
`http://<IP-del-servidor>:8080/api/v1/` y recompila el APK antes de instalarlo en los celulares.
Hay un diálogo para cambiar el servidor desde la app, pero está en el Dashboard, o sea, **después**
de iniciar sesión: con una IP por defecto incorrecta no se llega a él.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| Otras PCs no abren el sistema | Red marcada como Pública, o IP del servidor cambió (usar IP fija) |
| Carga la página pero no inicia sesión | El paquete se generó con otra IP → regenerar con `-ServerIp` correcta |
| El servicio no arranca | Ver `logs\backend.log` y `logs\ChilaloBackend.err.log` (contraseña de BD, PostgreSQL detenido) |
| "Sesión expirada" cada hora | Comportamiento actual del frontend: el token dura 1 hora y no se renueva solo |
