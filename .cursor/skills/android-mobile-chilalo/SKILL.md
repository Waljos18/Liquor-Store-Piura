---
name: android-mobile-chilalo
description: Guía el desarrollo de la app móvil Android (Kotlin) del proyecto CHILALO-IA (gestión de licorería). Usar cuando se trabaje en la app Android, Android Studio, Kotlin, o cuando se mencione la app móvil del proyecto.
---

# App Móvil Android - CHILALO-IA

Skill para desarrollar la aplicación Android del sistema de gestión de licorería (CHILALO-IA), en **Android Studio** con **Kotlin**, consumiendo la API REST del backend Spring Boot del proyecto.

---

## Contexto del Proyecto

- **Sistema:** Gestión integral de licorerías (POS, inventario, facturación SUNAT, promociones, reportes, IA).
- **Backend:** Spring Boot en `http://localhost:8080`, base path `/api/v1`.
- **Autenticación:** JWT. Login: `POST /api/v1/auth/login`; header: `Authorization: Bearer <token>`.
- **Documentación API:** `docs/semana-02/03-ESPECIFICACION-APIS.md` y Swagger en `http://localhost:8080/swagger-ui.html`.

---

## Stack Recomendado

| Área | Tecnología |
|------|------------|
| Lenguaje | Kotlin 1.9+ |
| UI | Jetpack Compose (preferido) o XML + ViewBinding |
| Arquitectura | MVVM |
| Red | Retrofit + OkHttp |
| Serialización | Kotlin Serialization o Gson |
| Inyección | Hilt |
| Navegación | Navigation Compose o Navigation Component |
| Estado/Async | Kotlin Coroutines + Flow, StateFlow en ViewModel |
| Persistencia local | Room (cache, datos offline si aplica) |

---

## Configuración de Red

- **Base URL desarrollo:** `http://10.0.2.2:8080` en emulador Android (equivale a `localhost` del host).
- **Base URL dispositivo físico:** usar la IP de la máquina (ej. `http://192.168.1.x:8080`) o configurar BuildConfig/`local.properties` para no hardcodear.
- **Base path API:** `/api/v1`.
- Añadir interceptor OkHttp que inyecte `Authorization: Bearer <token>` cuando exista sesión.
- CORS lo gestiona el backend; en Android no aplica CORS pero sí HTTPS en producción.

---

## Endpoints Principales a Consumir

Resumir según necesidad; detalle completo en `docs/semana-02/03-ESPECIFICACION-APIS.md`.

- **Auth:** `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- **Productos:** `GET /productos`, `GET /productos/buscar`, `GET /productos/{id}`
- **Ventas:** `POST /ventas`, `GET /ventas`, `GET /ventas/{id}`
- **Inventario:** `GET /inventario/alertas/stock-bajo`, `GET /inventario/movimientos`
- **Reportes:** `GET /reportes/dashboard`, `GET /reportes/ventas`
- **Promociones:** `GET /promociones`, `GET /promociones/productos/{productoId}`
- **Clientes:** `GET /clientes`, `GET /clientes/documento/{numeroDocumento}`, `POST /clientes`
- **Categorías:** `GET /categorias`

Formato de respuesta estándar del backend: `{ "success": true|false, "data": {...}, "message": "...", "error": {...} }`. Deserializar `data` en los DTOs de la app.

---

## Estructura de Módulos Sugerida

```
app/
├── data/
│   ├── remote/          # Retrofit API, DTOs
│   ├── repository/      # Repositorios
│   └── local/           # Room, DataStore (token, preferencias)
├── domain/              # Casos de uso opcionales, modelos de dominio
├── ui/
│   ├── theme/           # Material3, colores, tipografía
│   ├── navigation/
│   ├── login/
│   ├── dashboard/
│   ├── productos/
│   ├── ventas/
│   └── ...
├── di/                  # Módulo Hilt
└── util/                # Extensiones, Result wrappers
```

Cada feature en `ui/` puede seguir: `Screen`, `ViewModel`, `State/Events`, y si aplica `Repository` compartido.

---

## Convenciones de Código

- **Idioma:** Comentarios y mensajes de log en español; nombres de variables/funciones en inglés.
- **Nombres:** Paquetes en minúsculas; ViewModels con sufijo `ViewModel`; estados de UI con sufijo `UiState`/`UiEvent`.
- **Recursos:** Strings en `strings.xml` (o en Compose desde `stringResource`); no hardcodear textos visibles.
- **API:** Definir interfaces Retrofit en `data/remote`; DTOs separados de modelos de dominio si el proyecto crece.
- **Errores:** Mapear códigos HTTP y cuerpo de error del backend a mensajes de usuario o estados de error en la UI.

---

## Tareas Comunes

1. **Login:** Pantalla con usuario/contraseña → `POST /auth/login` → guardar tokens (DataStore/SecureSharedPreferences) → navegar a home.
2. **Listar productos:** `GET /productos` con paginación (`page`, `size`) o `GET /productos/buscar?q=` para POS.
3. **Dashboard:** `GET /reportes/dashboard` para métricas (ventas del día, alertas, etc.).
4. **Crear venta:** Construir payload según API (items, cliente opcional, promociones) → `POST /ventas`.
5. **Alertas de inventario:** `GET /inventario/alertas/stock-bajo` y opcionalmente `alertas/vencimiento`.

---

## Referencias en el Repositorio

- Especificación de APIs: `docs/semana-02/03-ESPECIFICACION-APIS.md`
- Modelo de datos: `docs/semana-02/01-MODELO-DATOS.md`
- README general: `README.md` (estructura backend, frontend, POS, ai-service)
- Backend (controladores): `backend/src/main/java/com/licoreria/controller/`

---

## Checklist de Inicio

- [ ] Proyecto Android con Kotlin y SDK mínimo coherente (ej. 24+).
- [ ] Dependencias: Retrofit, OkHttp, Hilt, Compose o ViewBinding, Navigation, Coroutines.
- [ ] Cliente Retrofit con base URL configurable e interceptor de JWT.
- [ ] Capa de repositorio para Auth y al menos un recurso (ej. productos o reportes).
- [ ] Pantalla de login y guardado de token; pantalla principal protegida.
- [ ] Manejo de errores de red y respuestas `success: false` del backend.
