# App Android - CHILALO

Aplicación móvil Android (Kotlin + Jetpack Compose) del sistema de gestión de licorería CHILALO-IA.

## Requisitos

- Android Studio Hedgehog (2023.1.1) o superior
- JDK 17
- Backend Spring Boot corriendo en `http://localhost:8080`

## Cómo ejecutar

1. Abrir la carpeta `android` en Android Studio (File → Open → seleccionar `android`).
2. Esperar la sincronización de Gradle.
3. Iniciar el **emulador** o conectar un dispositivo.
4. Ejecutar la app (Run ▶).

**Importante:** En el emulador la base URL ya está configurada como `http://10.0.2.2:8080` (equivale a localhost del PC). En un **dispositivo físico** debes cambiar la IP en `di/NetworkModule.kt` por la IP de tu máquina en la red (ej. `http://192.168.1.100:8080`).

## Estructura

- `data/remote` – API Retrofit y DTOs
- `data/local` – DataStore (token)
- `data/repository` – AuthRepository
- `ui/login` – Pantalla y ViewModel de login
- `ui/dashboard` – Pantalla principal (Home)
- `ui/navigation` – Navegación por estado de sesión
- `di` – Módulos Hilt (Red, etc.)

## Credenciales

Usar las mismas credenciales configuradas en el backend (usuario/contraseña de la base de datos).

## Checklist (skill)

- [x] Proyecto Android con Kotlin, minSdk 24+
- [x] Retrofit, OkHttp, Hilt, Compose, Navigation, Coroutines
- [x] Cliente Retrofit con base URL e interceptor JWT
- [x] AuthRepository y pantalla de login con guardado de token
- [x] Pantalla principal protegida por sesión
- [x] Manejo de errores de red y `success: false`
