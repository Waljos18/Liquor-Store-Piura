# Guía de pruebas QA y despliegue en servidor

Última etapa del proyecto **Licorería Chilalo** (backend Spring Boot, frontend React, app Android, servicio de IA opcional).

---

## 1. Alcance y documentación existente

| Recurso | Contenido |
|---------|-----------|
| `PRUEBAS_RAPIDAS.md` | Swagger, login, flujos básicos en local |
| `TEST_PROYECTO.md` | Pruebas por módulo con `curl` |
| `GUIA_PRUEBAS_POSTMAN.md` | Colección Postman (si está en el repo) |
| `LICORERIA_BACKEND.postman_collection.json` | Requests listos para importar |

Esta guía **no sustituye** esos archivos; los **ordena** en un proceso de QA y añade **despliegue**.

---

## 2. Entorno de pruebas (antes de QA)

1. **PostgreSQL** con base `licoreria_db` y usuario con permisos (ver `database/setup.sql` o `PRUEBAS_RAPIDAS.md`).
2. **Backend** en `http://localhost:8080` — Flyway debe aplicar migraciones sin error al arrancar.
3. **Frontend** — `cd frontend && npm install && npm run dev` (Vite suele usar puerto **5173**).
4. **Variables del frontend** (opcional, crear `frontend/.env`):
   - `VITE_API_URL=http://localhost:8080` — API backend.
   - `VITE_AI_URL=http://localhost:8001` — solo si pruebas el módulo IA (debe coincidir con el puerto del `ai-service`).
5. **Servicio IA** (opcional): `cd ai-service`, entorno virtual, `pip install -r requirements.txt`, copiar `.env.example` → `.env` con `GROQ_API_KEY` y `BACKEND_URL`. Arranque en **puerto 8001** (según `main.py`).

---

## 3. Plan de pruebas QA (manuales)

### 3.1 Regresión rápida (smoke test)

Ejecutar en orden; si algo falla, anotar ID y no avanzar hasta corregir o documentar.

| # | Área | Qué verificar |
|---|------|----------------|
| S1 | API viva | `GET http://localhost:8080/swagger-ui.html` carga |
| S2 | Login | Usuario `admin` / contraseña configurada; token en respuesta |
| S3 | Web — POS | Una venta simple, stock baja |
| S4 | Web — roles | Usuario `VENDEDOR` no accede a rutas solo admin (p. ej. reportes, compras) |
| S5 | Android | Login, una venta de prueba contra el **mismo** backend (IP o túnel HTTPS) |

### 3.2 Matriz por módulo (web)

Marca ✓/✗ en una hoja de pruebas. Prioridad sugerida:

1. **Autenticación** — login, refresh, logout, recuperación de contraseña (requiere SMTP configurado en `application.properties`).
2. **Catálogo** — categorías, productos, importación si la usan.
3. **POS** — carrito, descuento, MIXTO, cliente opcional, comprobante (SUNAT en **pruebas** hasta pasar a producción).
4. **Inventario** — alertas, movimientos, mermas (admin).
5. **Compras y proveedores** (admin).
6. **Caja** — apertura/cierre, coherencia con ventas en efectivo.
7. **Clientes y fidelización** — puntos, canje si aplica.
8. **Créditos / cuentas por cobrar** — venta crédito, pago parcial.
9. **Devoluciones** — si la pantalla está enlazada en rutas.
10. **Reportes** (admin).
11. **IA** — chat/insights solo si el servicio Python está arriba y la API key es válida.

### 3.3 Pruebas automatizadas (backend)

```bash
cd backend
mvn test
```

Si el proyecto tiene pocos tests, complementa con Postman/curl según `TEST_PROYECTO.md`.

### 3.4 Frontend

```bash
cd frontend
npm run build
npm run lint
```

El build debe terminar sin errores de TypeScript ni ESLint (según reglas del proyecto).

### 3.5 SUNAT / facturación

- En **desarrollo** suele usarse `sunat.ose.ambiente=pruebas` en `application.properties`.
- Antes de **producción**: credenciales OSE reales, prueba de emisión en ambiente de certificación que exija SUNAT, y respaldo de política de **anulaciones**.

### 3.6 Entregable de QA

- Lista de casos ejecutados (puede ser tabla en Excel o Markdown).
- Bugs **críticos** (pérdida de datos, seguridad, facturación incorrecta) bloquean el despliegue.
- Bugs **menores** documentados para post-release.

---

## 4. Checklist pre-producción (seguridad y configuración)

| Ítem | Acción |
|------|--------|
| JWT | Sustituir `jwt.secret` por una cadena **larga y aleatoria** (mínimo lo que exija el algoritmo; no commitear secretos). |
| Base de datos | Usuario dedicado, contraseña fuerte; **no** usar `postgres/123456` en producción. |
| CORS | En `cors.allowed-origins` incluir **solo** el dominio HTTPS del frontend (ej. `https://pos.tudominio.com`). |
| `app.frontend-url` | URL pública del frontend (enlaces de recuperación de contraseña). |
| Correo SMTP | Credenciales reales para “olvidé mi contraseña”. |
| Logs | Reducir `logging.level.com.licoreria` de `DEBUG` a `INFO` en producción si aplica. |
| HTTPS | Certificado TLS (Let’s Encrypt u otro) delante del backend y del frontend. |
| Respaldo BD | Política de backup automático de PostgreSQL. |

---

## 5. Despliegue en servidor (visión general)

No hay `Dockerfile` en el repositorio; el despliegue típico es **VPS Linux** con:

- **PostgreSQL** (misma versión compatible que en desarrollo).
- **Java 17** para ejecutar el JAR del backend.
- **Nginx** (o Caddy) como reverse proxy con TLS para:
  - Frontend: archivos estáticos del `npm run build` (`frontend/dist`).
  - Backend: proxy a `http://127.0.0.1:8080`.
- **Opcional**: servicio IA con **systemd** o proceso supervisado en puerto interno (solo accesible desde localhost o con autenticación).

### 5.1 Compilar backend

```bash
cd backend
mvn clean package -DskipTests
# JAR típico: target/licoreria-backend-*.jar
```

### 5.2 Compilar frontend para producción

```bash
cd frontend
set VITE_API_URL=https://api.tudominio.com
set VITE_AI_URL=https://ia.tudominio.com
npm run build
```

Sube el contenido de `frontend/dist` al servidor (por ejemplo `/var/www/licoreria`).

**Importante:** `VITE_*` se **congela en build time**. Cada cambio de URL obliga a **volver a ejecutar** `npm run build`.

### 5.3 Ejemplo de variables de entorno del backend (producción)

En lugar de guardar secretos en el JAR, usar variables de entorno o un `application-prod.properties` **fuera del repositorio**:

- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS=https://app.tudominio.com`

Spring Boot 3.x mapea nombres en mayúsculas con guiones a propiedades (consulta documentación de *relaxed binding*).

### 5.4 Servicio systemd (esquema)

Ejemplo conceptual — ajusta rutas y usuario Linux:

```ini
[Unit]
Description=Licoreria Backend
After=network.target postgresql.service

[Service]
User=licoreria
WorkingDirectory=/opt/licoreria
ExecStart=/usr/bin/java -jar /opt/licoreria/licoreria-backend.jar --spring.profiles.active=prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 5.5 Nginx (esquema)

- `server_name` con tu dominio.
- `location /` → raíz de `dist` del frontend.
- `location /api/` → `proxy_pass http://127.0.0.1:8080/api/;` (ajusta si tu API no lleva prefijo `/api`).

Asegura cabeceras `X-Forwarded-Proto` y `X-Forwarded-For` si Spring necesita URLs correctas.

### 5.6 App Android

1. En **Release**, firma el APK/AAB con un keystore propio (no subas el keystore al Git público).
2. Actualiza la **URL base** por defecto o documenta que el usuario configura servidor en la app (pantalla existente de configuración).
3. Para publicar en **Google Play**: política de privacidad, iconos, pruebas internas cerradas.

---

## 6. Orden recomendado el día del “go-live”

1. Congelar versión en Git (tag `v1.0.0`).
2. Backup de base de datos de **staging** o última prueba.
3. Desplegar backend → verificar `/swagger-ui.html` o health detrás de HTTPS.
4. Desplegar frontend con `VITE_API_URL` apuntando al API público.
5. Prueba smoke S1–S5 contra el **entorno real**.
6. Monitorear logs las primeras horas.

---

## 7. Referencias internas del proyecto

- Backend: `backend/src/main/resources/application.properties`
- CORS: `backend/src/main/java/com/licoreria/config/CorsConfig.java`
- Frontend API: `frontend/src/api/api.ts` (`VITE_API_URL`, `VITE_AI_URL`)

---

*Documento generado para cierre de proyecto. Ajusta dominios, usuarios de sistema operativo y rutas según tu proveedor de VPS (AWS, DigitalOcean, Hetzner, etc.).*
