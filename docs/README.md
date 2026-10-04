# Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2026-001  
**Versión:** 1.0  
**Fecha:** Enero 2026

---

## 📋 Descripción del Proyecto

Sistema completo para gestión integral de licorerías pequeñas en Piura (1-2 empleados) que incluye:

- ✅ **Punto de Venta (POS)** rápido e intuitivo
- ✅ **Control de Inventario** en tiempo real con alertas
- ✅ **Facturación Electrónica** integrada con SUNAT
- ✅ **Gestión de Promociones** y packs
- ✅ **Reportes y Analytics** con dashboard ejecutivo
- ✅ **Inteligencia Artificial** para recomendaciones y predicciones

---

## 🏗️ Estructura del Proyecto

```
CHILALO-IA/
├── backend/                 # API REST Spring Boot
├── frontend/                # Interfaz web React
├── pos/                     # Aplicación POS (Electron)
├── ai-service/              # Servicio de IA (Python/FastAPI)
├── database/                # Scripts de base de datos
├── docs/                    # Documentación del proyecto
│   ├── semana-01/          # Documentos Semana 1
│   └── semana-02/          # Documentos Semana 2
├── scripts/                 # Scripts de utilidad
└── README.md               # Este archivo
```

---

## 📚 Documentación

### Semana 1 - Análisis y Diseño
- [Requerimientos Detallados](docs/semana-01/01-REQUERIMIENTOS-DETALLADOS.md)
- [Diagramas de Arquitectura](docs/semana-01/02-DIAGRAMA-ARQUITECTURA.md)

### Semana 2 - Diseño de Base de Datos y APIs
- [Modelo de Datos](docs/semana-02/01-MODELO-DATOS.md)
- [Mockups de Interfaces](docs/semana-02/02-MOCKUPS-INTERFACES.md)
- [Especificación de APIs](docs/semana-02/03-ESPECIFICACION-APIS.md)
- [Setup de Repositorios](docs/semana-02/04-SETUP-REPOSITORIOS.md)

---

## 🛠️ Tecnologías

### Backend
- **Framework:** Spring Boot 3.x (Java 17+)
- **Base de Datos:** PostgreSQL 15+
- **Caché:** Redis 7+
- **Autenticación:** JWT (Spring Security)
- **Documentación API:** Swagger/OpenAPI

### Frontend
- **Framework:** React.js 18+ con TypeScript
- **UI Library:** Material-UI (MUI) v5
- **State Management:** Redux Toolkit
- **Build Tool:** Vite

### POS
- **Framework:** Electron + React
- **Integración:** Lectores de código de barras, impresoras térmicas

### Inteligencia Artificial
- **Framework:** Python 3.10+ con FastAPI
- **ML Libraries:** Scikit-learn, Pandas, NumPy
- **Algoritmos:** Filtrado colaborativo, Series temporales

---

## 📋 Requisitos Previos

- **Java 17+**
- **Node.js 18+**
- **Python 3.10+**
- **PostgreSQL 15+**
- **Git**

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd CHILALO-IA
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE licoreria_db;"
psql -U postgres -c "CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';"
```

### 3. Backend (Spring Boot)

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### 5. Servicio de IA (Python/FastAPI)

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

El servicio de IA estará disponible en: `http://localhost:8000`

---

## 📖 Uso del Sistema

### Acceso Inicial

1. Iniciar todos los servicios (Backend, Frontend, IA)
2. Acceder a `http://localhost:3000`
3. Usar credenciales por defecto:
   - **Usuario:** admin
   - **Contraseña:** (configurar en base de datos)

### Funcionalidades Principales

- **Dashboard:** Visualización de métricas y alertas
- **POS:** Realizar ventas rápidas
- **Productos:** Gestión de inventario
- **Promociones:** Crear y gestionar promociones
- **Reportes:** Análisis de ventas e inventario
- **IA:** Recomendaciones y predicciones

---

## 🧪 Testing

### Backend

```bash
cd backend
./mvnw test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 📝 Desarrollo

### Estructura de Ramas Git

- `main`: Código en producción
- `develop`: Código en desarrollo
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes

### Convenciones de Código

- **Backend:** Seguir convenciones de Java y Spring Boot
- **Frontend:** Seguir convenciones de React y TypeScript
- **Commits:** Usar mensajes descriptivos en español

---

## 📅 Cronograma del Proyecto

- **Semana 1-2:** Análisis y Diseño ✅
- **Semana 3-4:** Desarrollo Backend Core
- **Semana 5-6:** Módulos Principales e IA Básica
- **Semana 7-8:** Desarrollo Frontend Web
- **Semana 9:** Módulos Finales Frontend
- **Semana 10-11:** Desarrollo POS
- **Semana 12:** IA Avanzada y Optimización
- **Semana 13:** Testing y QA
- **Semana 14:** Despliegue y Capacitación

---

## 👥 Equipo

- **Desarrollador Full Stack:** [Tu nombre]
- **Asesor/Tutor Académico:** [Nombre]
- **Cliente:** Dueño de Licorería

---

## 📄 Licencia

Este es un proyecto académico desarrollado como parte de prácticas pre-profesionales.

---

## 🔗 Enlaces Útiles

- [Documentación del Proyecto](PROYECTO_SISTEMA_LICORERIA_PIURA.md)
- [Ficha del Proyecto](FICHA_01.md)
- [Swagger API Docs](http://localhost:8080/swagger-ui.html) (cuando backend esté corriendo)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0
