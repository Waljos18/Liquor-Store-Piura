# DIAGRAMAS DE ARQUITECTURA DEL SISTEMA
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 1

---

## 1. ARQUITECTURA GENERAL DEL SISTEMA

### 1.1 Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Web Frontend   │  Mobile App     │  POS Terminal               │
│   (React.js)    │ (React Native)  │  (Electron)                 │
│                 │   [Opcional]    │                             │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         └─────────────────┼───────────────────────┘
                           │
         ┌─────────────────▼───────────────────────┐
         │         API REST Backend                 │
         │         (Spring Boot 3.x)                │
         │  ┌───────────────────────────────────┐ │
         │  │  - Autenticación (JWT)            │ │
         │  │  - Módulo de Ventas               │ │
         │  │  - Módulo de Inventario           │ │
         │  │  - Módulo de Facturación          │ │
         │  │  - Módulo de Promociones          │ │
         │  │  - Módulo de Reportes             │ │
         │  └───────────────────────────────────┘ │
         └─────────────┬───────────────────────────┘
                       │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
┌───▼──────┐    ┌───────▼──────┐   ┌────────▼────────┐
│PostgreSQL│    │    Redis     │   │  SUNAT API      │
│ Database │    │   (Cache)    │   │  Integration    │
└──────────┘    └──────────────┘   └─────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   Servicio de IA          │
         │   (Python/FastAPI)        │
         │  ┌─────────────────────┐ │
         │  │ - Recomendaciones   │ │
         │  │ - Predicción Demanda │ │
         │  │ - Optimización Inv.  │ │
         │  │ - ML Models          │ │
         │  └─────────────────────┘ │
         └───────────────────────────┘
```

### 1.2 Descripción de Componentes

#### Capa de Presentación
- **Web Frontend (React.js):** Interfaz web principal para gestión administrativa
- **Mobile App (React Native):** Aplicación móvil opcional para gestión desde dispositivos móviles
- **POS Terminal (Electron):** Aplicación de escritorio optimizada para punto de venta

#### Capa de Aplicación
- **API REST Backend (Spring Boot):** Servicios backend que exponen APIs REST
- **Módulos principales:**
  - Autenticación y autorización
  - Gestión de ventas
  - Control de inventario
  - Facturación electrónica
  - Promociones y packs
  - Reportes y analytics

#### Capa de Datos
- **PostgreSQL:** Base de datos principal relacional
- **Redis:** Caché para sesiones y datos frecuentes

#### Servicios Externos
- **SUNAT API:** Integración para facturación electrónica
- **Servicio de IA (Python/FastAPI):** Servicio independiente para modelos de ML

---

## 2. ARQUITECTURA DE CAPAS DEL BACKEND

### 2.1 Estructura en Capas (Spring Boot)

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE CONTROL                      │
│              (Controllers / REST Controllers)            │
│  - ProductoController                                    │
│  - VentaController                                      │
│  - InventarioController                                 │
│  - FacturacionController                                │
│  - PromocionController                                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   CAPA DE SERVICIO                       │
│              (Service Layer / Business Logic)             │
│  - ProductoService                                       │
│  - VentaService                                         │
│  - InventarioService                                    │
│  - FacturacionService                                   │
│  - PromocionService                                     │
│  - IARecoService (Integración IA)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  CAPA DE REPOSITORIO                     │
│              (Repository / Data Access)                 │
│  - ProductoRepository                                   │
│  - VentaRepository                                     │
│  - InventarioRepository                                │
│  - ComprobanteRepository                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    CAPA DE DATOS                        │
│              (Entities / Database)                       │
│  - Producto                                             │
│  - Venta                                               │
│  - DetalleVenta                                        │
│  - Inventario                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

1. **Request HTTP** → Controller recibe petición
2. **Controller** → Valida entrada y delega a Service
3. **Service** → Ejecuta lógica de negocio
4. **Service** → Llama a Repository para acceso a datos
5. **Repository** → Consulta/actualiza base de datos
6. **Response** → Datos retornan por las capas hasta Controller
7. **Controller** → Retorna respuesta HTTP

---

## 3. ARQUITECTURA DE INTEGRACIÓN CON SUNAT

### 3.1 Flujo de Facturación Electrónica

```
┌──────────────┐
│   POS/Web    │
│   (Venta)    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ VentaService     │
│ - Crea Venta     │
│ - Actualiza Stock│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ FacturacionService│
│ - Genera XML     │
│ - Firma Digital  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ SUNATClient      │
│ - Envía a OSE    │
│ - Consulta Estado│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   OSE (SUNAT)    │
│ - Valida XML     │
│ - Retorna CDR    │
└──────────────────┘
```

### 3.2 Componentes de Integración SUNAT

- **SUNATClient:** Cliente HTTP para comunicación con OSE
- **XMLGenerator:** Generador de XML según formato SUNAT
- **DigitalSignature:** Firma digital de comprobantes
- **CDRProcessor:** Procesador de Constancia de Recepción

---

## 4. ARQUITECTURA DE INTELIGENCIA ARTIFICIAL

### 4.1 Servicio de IA Independiente

```
┌─────────────────────────────────────┐
│     Backend Spring Boot              │
│  ┌───────────────────────────────┐   │
│  │  VentaService                 │   │
│  │  - Necesita recomendaciones   │   │
│  └───────────┬───────────────────┘   │
│              │ HTTP REST             │
└──────────────┼───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Servicio IA (Python/FastAPI)      │
│  ┌───────────────────────────────┐  │
│  │  /api/ia/recomendaciones      │  │
│  │  /api/ia/prediccion-demanda   │  │
│  │  /api/ia/optimizacion-inv      │  │
│  └───────────┬───────────────────┘  │
│              │                      │
│  ┌───────────▼───────────────────┐  │
│  │  Modelos ML                   │  │
│  │  - Filtrado Colaborativo      │  │
│  │  - Series Temporales          │  │
│  │  - Clustering                 │  │
│  └───────────────────────────────┘  │
│              │                      │
│  ┌───────────▼───────────────────┐  │
│  │  Base de Datos (PostgreSQL)   │  │
│  │  - Datos históricos de ventas  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 4.2 Modelos de IA

1. **Modelo de Recomendaciones:**
   - Filtrado colaborativo basado en productos comprados juntos
   - Entrenado con historial de ventas

2. **Modelo de Predicción de Demanda:**
   - Series temporales (ARIMA simplificado)
   - Predice ventas futuras por producto

3. **Modelo de Optimización:**
   - Sugerencias de stock mínimo/máximo
   - Identificación de productos de baja rotación

---

## 5. ARQUITECTURA DE SEGURIDAD

### 5.1 Flujo de Autenticación

```
┌──────────┐
│  Cliente │
└────┬─────┘
     │ POST /api/auth/login
     ▼
┌──────────────────┐
│ AuthController   │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ AuthService      │
│ - Valida cred.   │
│ - Genera JWT     │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ JWT Token        │
│ - Access Token   │
│ - Refresh Token  │
└──────────────────┘
```

### 5.2 Autorización por Roles

```
Request con JWT
       │
       ▼
┌──────────────────┐
│ JWT Filter       │
│ - Valida token   │
│ - Extrae roles   │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Security Config  │
│ - Verifica roles │
│ - Permisos       │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Controller       │
│ (Autorizado)     │
└──────────────────┘
```

---

## 6. ARQUITECTURA DE DATOS

### 6.1 Modelo de Datos Relacional

```
Usuario ──┐
          │
          ├──► Venta ──► DetalleVenta ──► Producto
          │                │
          │                └──► ComprobanteElectronico
          │
          └──► MovimientoInventario ──► Producto
                         │
                         └──► Compra ──► Proveedor

Producto ──► Categoria
    │
    ├──► PromocionProducto ──► Promocion
    │
    └──► PackProducto ──► Pack

Cliente ──► Venta
```

### 6.2 Estrategia de Caché

- **Redis Cache:**
  - Lista de productos (actualización cada 5 min)
  - Promociones activas
  - Precios de productos

---

## 7. ARQUITECTURA DE DESPLIEGUE

### 7.1 Arquitectura de Producción

```
┌─────────────────────────────────────────┐
│         Load Balancer / Nginx            │
└──────────────┬───────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│ Web   │  │ Web   │  │ Web   │
│ App 1 │  │ App 2 │  │ App 3 │
└───┬───┘  └───┬───┘  └───┬───┘
    │          │          │
    └──────────┼──────────┘
               │
    ┌──────────▼──────────┐
    │   Spring Boot API    │
    │   (Backend)          │
    └──────────┬───────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│PostgreSQL│ │ Redis │ │ IA    │
│Primary  │ │ Cache  │ │Service│
└─────────┘ └────────┘ └───────┘
```

### 7.2 Consideraciones de Despliegue

- **Backend:** Contenedor Docker en servidor cloud
- **Base de Datos:** PostgreSQL en servidor dedicado o RDS
- **Caché:** Redis en servidor dedicado o servicio gestionado
- **Frontend:** Servido por Nginx o CDN
- **IA Service:** Contenedor Docker independiente

---

## 8. TECNOLOGÍAS Y HERRAMIENTAS

### 8.1 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend Web | React.js 18+ con TypeScript |
| POS | Electron + React |
| Backend | Spring Boot 3.x (Java 17+) |
| Base de Datos | PostgreSQL 15+ |
| Caché | Redis 7+ |
| IA Service | Python 3.10+ con FastAPI |
| Autenticación | JWT (Spring Security) |
| Integración SUNAT | Librerías Java para facturación |

### 8.2 Herramientas de Desarrollo

- **Control de Versiones:** Git / GitHub
- **CI/CD:** GitHub Actions
- **Testing:** JUnit, Jest, React Testing Library
- **Documentación API:** Swagger/OpenAPI
- **Monitoreo:** Logging estructurado

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
