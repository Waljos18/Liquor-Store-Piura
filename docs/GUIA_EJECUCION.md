# Guía de Ejecución del Proyecto - Sistema de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** Sprint 3 (Semana 5-6)

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

1. **Java 17 o superior**
   ```bash
   java -version
   ```
   Debe mostrar versión 17 o superior.

2. **Maven 3.8+** (o usar el wrapper incluido)
   ```bash
   mvn -version
   ```

3. **PostgreSQL 15+**
   ```bash
   psql --version
   ```

4. **PostgreSQL en ejecución**
   - En Windows: Verificar que el servicio PostgreSQL esté corriendo
   - En Linux/Mac: `sudo systemctl status postgresql` o `brew services list`

---

## 🗄️ Configuración de Base de Datos

### Paso 1: Crear Base de Datos y Usuario

Ejecuta el script de configuración:

**En Windows (PowerShell o CMD):**
```bash
cd database
psql -U postgres -f setup.sql
```

**En Linux/Mac:**
```bash
cd database
sudo -u postgres psql -f setup.sql
```

O manualmente en `psql`:
```sql
CREATE DATABASE licoreria_db;

\c licoreria_db

CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';

GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;
GRANT ALL ON SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO licoreria_user;

-- Para Flyway
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO licoreria_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO licoreria_user;
```

### Paso 2: Verificar Conexión

```bash
psql -U licoreria_user -d licoreria_db -h localhost
```

Si te pide contraseña, ingresa: `licoreria_pass`

---

## 🔧 Configuración del Proyecto

### Verificar Configuración

Revisa el archivo `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/licoreria_db
spring.datasource.username=licoreria_user
spring.datasource.password=licoreria_pass
```

Si tu PostgreSQL está en otro host o puerto, ajusta la URL.

---

## 🚀 Compilación y Ejecución

### Opción 1: Usando Maven Wrapper (Recomendado)

**En Windows:**
```bash
cd backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

**En Linux/Mac:**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Opción 2: Usando Maven Instalado

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Opción 3: Ejecutar JAR Compilado

```bash
cd backend
mvn clean package
java -jar target/licoreria-backend-1.0.0.jar
```

---

## ✅ Verificación

### 1. Verificar que el servidor esté corriendo

Abre tu navegador y visita:

- **API Base:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs (JSON):** http://localhost:8080/api-docs

### 2. Probar Autenticación

**Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"Admin123!\"}"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "username": "admin",
      "rol": "ADMIN"
    }
  }
}
```

### 3. Probar Endpoint Protegido

```bash
# Reemplaza <TOKEN> con el accessToken obtenido
curl -X GET http://localhost:8080/api/v1/productos \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📝 Usuarios Iniciales

El sistema crea automáticamente estos usuarios al iniciar (mediante `DataInitializer`):

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `Admin123!` | ADMIN |
| `vendedor` | `Admin123!` | VENDEDOR |

---

## 🔍 Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Cerrar sesión

### Productos
- `GET /api/v1/productos` - Listar productos
- `GET /api/v1/productos/{id}` - Obtener producto
- `POST /api/v1/productos` - Crear producto
- `PUT /api/v1/productos/{id}` - Actualizar producto
- `DELETE /api/v1/productos/{id}` - Desactivar producto

### Categorías
- `GET /api/v1/categorias` - Listar categorías
- `POST /api/v1/categorias` - Crear categoría
- `PUT /api/v1/categorias/{id}` - Actualizar categoría
- `DELETE /api/v1/categorias/{id}` - Eliminar categoría

### Clientes
- `GET /api/v1/clientes` - Listar clientes
- `POST /api/v1/clientes` - Crear cliente
- `GET /api/v1/clientes/documento/{numeroDocumento}` - Buscar por documento

### Ventas (Sprint 3)
- `POST /api/v1/ventas` - Crear venta
- `GET /api/v1/ventas` - Listar ventas
- `GET /api/v1/ventas/{id}` - Obtener venta
- `PUT /api/v1/ventas/{id}/anular` - Anular venta

### Inventario (Sprint 3)
- `GET /api/v1/inventario/movimientos` - Listar movimientos
- `POST /api/v1/inventario/movimientos` - Crear movimiento manual
- `GET /api/v1/inventario/alertas/stock-bajo` - Productos con stock bajo
- `GET /api/v1/inventario/alertas/vencimiento` - Productos próximos a vencer
- `POST /api/v1/inventario/ajustar` - Ajustar inventario

### Proveedores (Sprint 3)
- `GET /api/v1/proveedores` - Listar proveedores
- `POST /api/v1/proveedores` - Crear proveedor
- `PUT /api/v1/proveedores/{id}` - Actualizar proveedor
- `DELETE /api/v1/proveedores/{id}` - Eliminar proveedor

### Compras (Sprint 3)
- `POST /api/v1/compras` - Registrar compra
- `GET /api/v1/compras` - Listar compras
- `GET /api/v1/compras/{id}` - Obtener compra
- `PUT /api/v1/compras/{id}/anular` - Anular compra

### Facturación
- `POST /api/v1/facturacion/emitir-boleta` - Emitir boleta
- `POST /api/v1/facturacion/emitir-factura` - Emitir factura
- `GET /api/v1/facturacion/comprobantes/{id}/pdf` - Descargar PDF
- `POST /api/v1/facturacion/demo` - Demo de facturación

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verifica las credenciales en `application.properties`

3. Prueba la conexión manualmente:
   ```bash
   psql -U licoreria_user -d licoreria_db -h localhost
   ```

### Error: "Puerto 8080 ya está en uso"

1. Cambia el puerto en `application.properties`:
   ```properties
   server.port=8081
   ```

2. O detén el proceso que usa el puerto 8080

### Error: "Flyway migration failed"

1. Verifica que las migraciones estén en `backend/src/main/resources/db/migration/`

2. Si necesitas resetear, elimina las tablas de Flyway:
   ```sql
   DROP TABLE IF EXISTS flyway_schema_history;
   ```

### Error de Compilación: "Cannot find symbol"

1. Limpia y recompila:
   ```bash
   mvn clean install
   ```

2. Verifica que todas las dependencias estén descargadas:
   ```bash
   mvn dependency:resolve
   ```

---

## 📦 Estructura del Proyecto

```
CHILALO-IA/
├── backend/                    # Backend Spring Boot
│   ├── src/main/java/         # Código fuente
│   ├── src/main/resources/    # Configuración y migraciones
│   └── pom.xml                 # Dependencias Maven
├── database/                   # Scripts de base de datos
│   └── setup.sql              # Script de configuración inicial
└── docs/                       # Documentación
    └── semana-05-06/          # Documentación Sprint 3
```

---

## 🔄 Próximos Pasos

Una vez que el backend esté corriendo:

1. **Probar endpoints** usando Swagger UI o Postman
2. **Crear datos de prueba** (productos, categorías, clientes)
3. **Probar flujo completo**: Compra → Venta → Facturación
4. **Desarrollar frontend** (Sprint 4)

---

## 📚 Documentación Adicional

- **Documentación del Sprint 2:** `docs/semana-03-04/01-ENTREGABLES-SPRINT-2.md`
- **Documentación del Sprint 3:** `docs/semana-05-06/01-ENTREGABLES-SPRINT-3.md`
- **Swagger UI:** http://localhost:8080/swagger-ui.html

---

**¿Problemas?** Revisa los logs en la consola o en `logs/` (si está configurado).
