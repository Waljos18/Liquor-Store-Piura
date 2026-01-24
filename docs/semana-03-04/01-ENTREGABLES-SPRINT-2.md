# Semana 3-4: Sprint 2 - Backend Core e Integración SUNAT

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Fase:** 2 - Desarrollo Backend  
**Fecha:** Enero 2025

---

## 1. Objetivos del Sprint

- Setup de proyecto Spring Boot
- Configuración de base de datos PostgreSQL y Flyway
- Autenticación y autorización JWT (simplificada para 1-2 usuarios)
- CRUD de usuarios y roles (Admin y Vendedor)
- CRUD de productos y categorías
- CRUD de clientes
- Integración SUNAT: generación de XML y PDF de comprobantes

---

## 2. Estructura del Backend

```
backend/
├── src/main/java/com/licoreria/
│   ├── config/           # Security, JWT, CORS, OpenAPI, DataInitializer
│   ├── controller/       # Auth, Usuarios, Categorías, Productos, Clientes, Facturación
│   ├── dto/              # DTOs y ApiResponse
│   ├── entity/           # Usuario, Categoria, Producto, Cliente, Venta, DetalleVenta, ComprobanteElectronico
│   ├── exception/        # GlobalExceptionHandler
│   ├── repository/       # JPA repositories
│   ├── security/         # JwtUtil, JwtAuthFilter
│   └── service/          # Auth, Usuario, Categoria, Producto, Cliente, Facturación, Demo
├── src/main/resources/
│   ├── application*.properties
│   └── db/migration/     # Flyway V1, V2, V3
└── pom.xml
```

---

## 3. Entregables

### 3.1 Autenticación (JWT)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | Login (username, password). Devuelve accessToken, refreshToken y user. |
| `/api/v1/auth/refresh` | POST | Renovar access token con refreshToken. |
| `/api/v1/auth/logout` | POST | Cerrar sesión (Bearer requerido). |

**Usuarios iniciales** (creados por `DataInitializer`):

- `admin` / `Admin123!` — Rol ADMIN  
- `vendedor` / `Admin123!` — Rol VENDEDOR  

### 3.2 CRUD Usuarios

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/usuarios` | GET | Listar usuarios (paginado). Solo ADMIN. |
| `/api/v1/usuarios/{id}` | GET | Obtener por ID. |
| `/api/v1/usuarios` | POST | Crear usuario. |
| `/api/v1/usuarios/{id}` | PUT | Actualizar usuario. |
| `/api/v1/usuarios/{id}` | DELETE | Eliminar usuario. |

### 3.3 CRUD Categorías

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/categorias` | GET | Listar (query `soloActivas`). |
| `/api/v1/categorias/{id}` | GET | Obtener por ID. |
| `/api/v1/categorias` | POST | Crear. |
| `/api/v1/categorias/{id}` | PUT | Actualizar. |
| `/api/v1/categorias/{id}` | DELETE | Eliminar. |

### 3.4 CRUD Productos

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/productos` | GET | Listar con filtros (search, categoriaId, activo, stockBajo) y paginación. |
| `/api/v1/productos/buscar?q=` | GET | Búsqueda rápida para POS (código o nombre). |
| `/api/v1/productos/{id}` | GET | Obtener por ID. |
| `/api/v1/productos` | POST | Crear. |
| `/api/v1/productos/{id}` | PUT | Actualizar. |
| `/api/v1/productos/{id}` | DELETE | Desactivar (eliminación lógica). |

### 3.5 CRUD Clientes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/clientes` | GET | Listar con búsqueda y paginación. |
| `/api/v1/clientes/{id}` | GET | Obtener por ID. |
| `/api/v1/clientes/documento/{numeroDocumento}` | GET | Obtener por número de documento. |
| `/api/v1/clientes` | POST | Crear. |
| `/api/v1/clientes/{id}` | PUT | Actualizar. |
| `/api/v1/clientes/{id}` | DELETE | Eliminar. |

### 3.6 Facturación electrónica (XML + PDF)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/facturacion/emitir-boleta` | POST | Emitir boleta (ventaId, cliente DNI/nombre). Genera XML UBL 2.1 y PDF. |
| `/api/v1/facturacion/emitir-factura` | POST | Emitir factura (ventaId, RUC, razón social). |
| `/api/v1/facturacion/comprobantes/{id}/pdf` | GET | Descargar PDF del comprobante. |
| `/api/v1/facturacion/comprobantes/{id}/xml` | GET | Obtener XML del comprobante. |
| `/api/v1/facturacion/demo` | POST | Demo: crea venta de prueba y genera boleta. Útil para validar flujo. |

**Nota:** El envío real a SUNAT vía OSE se implementará en Sprint 3. En este sprint solo se genera y almacena XML y PDF.

---

## 4. Cómo ejecutar

### 4.1 Base de datos

1. PostgreSQL 15+ en ejecución.
2. Crear BD y usuario:

```bash
psql -U postgres -f database/setup.sql
```

3. O manualmente:

```sql
CREATE DATABASE licoreria_db;
\c licoreria_db
CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';
GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;
GRANT ALL ON SCHEMA public TO licoreria_user;
```

### 4.2 Backend

```bash
cd backend
./mvnw spring-boot:run
```

- API: `http://localhost:8080`  
- Swagger UI: `http://localhost:8080/swagger-ui.html`  
- API Docs: `http://localhost:8080/v3/api-docs`  

### 4.3 Probar flujo

1. **Login:**  
   `POST /api/v1/auth/login`  
   Body: `{"username":"admin","password":"Admin123!"}`  

2. **Usar token:**  
   Header: `Authorization: Bearer <accessToken>` en el resto de peticiones.

3. **Demo facturación:**  
   `POST /api/v1/facturacion/demo` (con Bearer).  
   Luego descargar PDF: `GET /api/v1/facturacion/comprobantes/{id}/pdf`.

---

## 5. Próximos pasos (Sprint 3)

- Módulo de ventas (lógica de negocio).
- Módulo de inventario.
- Sistema de promociones y packs.
- Envío y consulta de comprobantes a SUNAT (OSE).
- Integración de IA básica (recomendaciones).

---

**Documento preparado por:** Equipo de Desarrollo  
**Versión:** 1.0
