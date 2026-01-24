# SETUP INICIAL DE REPOSITORIOS Y CONFIGURACIÓN
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 2

---

## 1. ESTRUCTURA DE REPOSITORIOS

### 1.1 Estructura de Carpetas del Proyecto

```
CHILALO-IA/
├── backend/                 # Backend Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/                # Frontend React
│   ├── src/
│   ├── package.json
│   └── README.md
├── pos/                     # Aplicación POS (Electron)
│   ├── src/
│   ├── package.json
│   └── README.md
├── ai-service/              # Servicio de IA (Python/FastAPI)
│   ├── app/
│   ├── requirements.txt
│   └── README.md
├── database/                # Scripts de base de datos
│   ├── migrations/
│   ├── seeds/
│   └── README.md
├── docs/                    # Documentación
│   ├── semana-01/
│   ├── semana-02/
│   └── ...
├── scripts/                 # Scripts de utilidad
│   ├── setup.sh
│   └── deploy.sh
└── README.md                # README principal del proyecto
```

---

## 2. CONFIGURACIÓN DEL BACKEND (Spring Boot)

### 2.1 Estructura del Proyecto Spring Boot

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── licoreria/
│   │   │           ├── LicoreriaApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   │   ├── JwtConfig.java
│   │   │           │   │   └── CorsConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── ProductoController.java
│   │   │           │   ├── VentaController.java
│   │   │           │   └── ...
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── ProductoService.java
│   │   │           │   └── ...
│   │   │           ├── repository/
│   │   │           │   ├── ProductoRepository.java
│   │   │           │   └── ...
│   │   │           ├── entity/
│   │   │           │   ├── Producto.java
│   │   │           │   ├── Venta.java
│   │   │           │   └── ...
│   │   │           ├── dto/
│   │   │           │   ├── ProductoDTO.java
│   │   │           │   └── ...
│   │   │           ├── exception/
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           └── integration/
│   │   │               └── SunatClient.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/
│   │           └── migration/
│   └── test/
│       └── java/
├── pom.xml
└── README.md
```

### 2.2 Archivo pom.xml (Maven)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.licoreria</groupId>
    <artifactId>licoreria-backend</artifactId>
    <version>1.0.0</version>
    <name>Licoreria Backend</name>
    <description>Sistema de Gestión de Licorería - Backend</description>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>

        <!-- Flyway (Migraciones) -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.3 application.properties

```properties
# Server
server.port=8080
spring.application.name=licoreria-backend

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/licoreria_db
spring.datasource.username=licoreria_user
spring.datasource.password=licoreria_pass
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# JWT
jwt.secret=your-secret-key-change-in-production
jwt.expiration=3600000
jwt.refresh-expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173

# Logging
logging.level.com.licoreria=DEBUG
logging.level.org.springframework.web=INFO
```

---

## 3. CONFIGURACIÓN DEL FRONTEND (React)

### 3.1 Estructura del Proyecto React

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── productos/
│   │   ├── ventas/
│   │   └── ...
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductosPage.tsx
│   │   └── ...
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── ...
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 3.2 package.json

```json
{
  "name": "licoreria-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "axios": "^1.6.2",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "recharts": "^2.10.3",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 3.3 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

---

## 4. CONFIGURACIÓN DEL SERVICIO DE IA (Python/FastAPI)

### 4.1 Estructura del Proyecto

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── recomendaciones.py
│   │   ├── prediccion.py
│   │   └── ...
│   ├── services/
│   │   ├── ml_service.py
│   │   └── ...
│   └── utils/
├── requirements.txt
├── .env
└── README.md
```

### 4.2 requirements.txt

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pandas==2.1.3
numpy==1.26.2
scikit-learn==1.3.2
joblib==1.3.2
python-dotenv==1.0.0
```

### 4.3 app/main.py (Estructura básica)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Licoreria IA Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Licoreria IA Service"}

@app.get("/api/v1/ia/recomendaciones")
def get_recomendaciones(producto_id: int, cliente_id: int = None):
    # Implementación
    pass
```

---

## 5. CONFIGURACIÓN DE BASE DE DATOS

### 5.1 Script de Creación de Base de Datos

```sql
-- database/setup.sql
CREATE DATABASE licoreria_db;

CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';

GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;

\c licoreria_db

GRANT ALL ON SCHEMA public TO licoreria_user;
```

### 5.2 Script de Migración Inicial (Flyway)

```sql
-- database/migrations/V1__Initial_schema.sql
-- (Contenido del modelo de datos del documento anterior)
```

---

## 6. CONFIGURACIÓN DE GIT

### 6.1 .gitignore

```
# Backend
backend/target/
backend/.idea/
backend/*.iml

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.vite/

# AI Service
ai-service/__pycache__/
ai-service/.venv/
ai-service/*.pyc

# Database
database/*.sql.backup

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
```

### 6.2 README.md Principal

```markdown
# Sistema Web y App Móvil con IA para Gestión Integral de Licorería

## Descripción
Sistema completo para gestión de licorerías pequeñas con integración SUNAT e IA.

## Estructura del Proyecto
- `backend/`: API REST Spring Boot
- `frontend/`: Interfaz web React
- `pos/`: Aplicación POS Electron
- `ai-service/`: Servicio de IA Python/FastAPI
- `database/`: Scripts de base de datos

## Requisitos
- Java 17+
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+

## Instalación
Ver README.md de cada módulo.

## Desarrollo
```bash
# Backend
cd backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm run dev

# IA Service
cd ai-service && uvicorn app.main:app --reload
```
```

---

## 7. SCRIPTS DE UTILIDAD

### 7.1 scripts/setup.sh

```bash
#!/bin/bash

echo "Configurando proyecto Licoreria..."

# Crear base de datos
psql -U postgres -c "CREATE DATABASE licoreria_db;"
psql -U postgres -c "CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';"

# Backend
cd backend
./mvnw clean install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "Configuración completada!"
```

---

## 8. CHECKLIST DE SETUP

### 8.1 Semana 2 - Setup Inicial

- [ ] Crear estructura de carpetas
- [ ] Configurar repositorio Git
- [ ] Inicializar proyecto Spring Boot
- [ ] Inicializar proyecto React
- [ ] Inicializar proyecto Python/FastAPI
- [ ] Configurar base de datos PostgreSQL
- [ ] Crear scripts de migración
- [ ] Configurar variables de entorno
- [ ] Documentar proceso de instalación
- [ ] Verificar que todos los servicios inician correctamente

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
