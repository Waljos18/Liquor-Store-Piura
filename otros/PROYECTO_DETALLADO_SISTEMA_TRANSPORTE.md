# PROYECTO DE DESARROLLO DE SOFTWARE
## Sistema Web y App Móvil para Gestión de Transporte y Logística de Carga
### Para Empresas de Transporte en Piura, Perú

---

## 1. DESCRIPCIÓN DE LA ACTIVIDAD

### 1.1 Contexto del Proyecto

Nuestra empresa de soluciones informáticas ha sido contactada por **Transportes Piura S.A.C.**, una empresa de transporte de carga que opera en la región de Piura y necesita modernizar sus operaciones mediante un sistema informático integral.

### 1.2 Descripción del Problema

**Transportes Piura S.A.C.** actualmente gestiona sus operaciones mediante procesos manuales y sistemas obsoletos, lo que genera:

- **Ineficiencia en la planificación de rutas:** No existe optimización automática de rutas, generando mayores costos de combustible y tiempo
- **Falta de visibilidad en tiempo real:** No se puede rastrear la ubicación de los vehículos durante las entregas
- **Comunicación deficiente con clientes:** Los clientes no reciben actualizaciones automáticas sobre el estado de sus envíos
- **Gestión manual de documentación:** Control de mantenimientos, seguros y documentación vehicular en papel
- **Pérdida de información:** Dificultad para generar reportes y análisis de rendimiento
- **Errores en la asignación de pedidos:** Asignación manual propensa a errores

### 1.3 Necesidad del Cliente

La empresa requiere un **Sistema Web y App Móvil para Gestión Integral de Transporte y Logística** que permita:

1. Gestionar eficientemente la flota de vehículos
2. Optimizar rutas de entrega
3. Rastrear vehículos en tiempo real
4. Gestionar pedidos y entregas
5. Comunicarse automáticamente con clientes
6. Generar reportes y análisis de negocio
7. Operar desde cualquier dispositivo (web y móvil)

---

## 2. OBJETIVOS DEL PROYECTO

### 2.1 Objetivo General

Desarrollar e implementar un sistema web y aplicación móvil que permita a Transportes Piura S.A.C. gestionar de manera integral y eficiente sus operaciones de transporte y logística, mejorando la productividad, reduciendo costos operativos y elevando la satisfacción del cliente.

### 2.2 Objetivos Específicos

1. **Digitalizar la gestión de flota:** Implementar módulo completo para control de vehículos, mantenimientos y documentación
2. **Optimizar rutas de entrega:** Desarrollar sistema de planificación de rutas con algoritmos de optimización
3. **Implementar rastreo GPS:** Integrar sistema de geolocalización en tiempo real para todos los vehículos
4. **Automatizar gestión de pedidos:** Sistema completo de registro, asignación y seguimiento de órdenes
5. **Mejorar comunicación con clientes:** Notificaciones automáticas vía SMS y email sobre estado de envíos
6. **Generar reportes analíticos:** Dashboard con métricas clave de negocio
7. **Desarrollar app móvil:** Aplicación para conductores y administradores en campo

---

## 3. ALCANCE DEL SISTEMA

### 3.1 Módulos del Sistema

#### 3.1.1 Módulo de Gestión de Flota
- Registro de vehículos (camiones, furgones, motos)
- Control de mantenimientos preventivos y correctivos
- Gestión de seguros y documentación vehicular
- Alertas de vencimiento de documentos
- Historial de mantenimientos y reparaciones
- Control de combustible y kilometraje

#### 3.1.2 Módulo de Planificación de Rutas
- Optimización automática de rutas considerando:
  - Distancias
  - Tiempos estimados
  - Costos de combustible
  - Restricciones vehiculares
- Visualización de rutas en mapas interactivos
- Asignación de vehículos a rutas
- Edición manual de rutas optimizadas

#### 3.1.3 Módulo de Rastreo GPS
- Ubicación en tiempo real de todos los vehículos
- Historial de recorridos
- Geocercas (zonas virtuales) con alertas
- Velocidad y estado del vehículo
- Integración con dispositivos GPS/IoT

#### 3.1.4 Módulo de Gestión de Pedidos
- Registro de órdenes de transporte
- Asignación de pedidos a vehículos y conductores
- Estados de pedido: Pendiente, En Ruta, En Entrega, Entregado, Cancelado
- Documentos digitales (guías de remisión, comprobantes)
- Firma digital del receptor

#### 3.1.5 Módulo de Clientes
- Base de datos de clientes
- Historial de envíos por cliente
- Portal del cliente para consultar estado de envíos
- Notificaciones automáticas (SMS/Email)

#### 3.1.6 Módulo de Conductores
- Perfiles de conductores
- Asignación de vehículos
- Historial de viajes
- App móvil para conductores

#### 3.1.7 Módulo de Reportes y Analytics
- Dashboard ejecutivo con KPIs:
  - Vehículos activos
  - Pedidos del día
  - Tasa de entregas exitosas
  - Costos operativos
  - Rutas más utilizadas
- Reportes de:
  - Rendimiento de flota
  - Análisis de costos
  - Satisfacción de clientes
  - Eficiencia de rutas

### 3.2 Usuarios del Sistema

1. **Administrador General:** Acceso completo al sistema
2. **Gerente de Operaciones:** Gestión de rutas, pedidos y flota
3. **Despachador:** Asignación de pedidos y rutas
4. **Conductor:** App móvil para recibir pedidos y actualizar estados
5. **Cliente:** Portal web para consultar estado de envíos

### 3.3 Funcionalidades Excluidas (Fuera del Alcance)

- Sistema de facturación completo (solo integración básica)
- Gestión de nómina de empleados
- Sistema contable
- Integración con sistemas bancarios para pagos
- App para clientes (solo portal web)

---

## 4. ARQUITECTURA Y TECNOLOGÍAS

### 4.1 Arquitectura del Sistema

**Arquitectura:** Cliente-Servidor con API REST y servicios en la nube

```
┌─────────────────┐     ┌─────────────────┐
│  Web Frontend   │     │  Mobile App     │
│   (React.js)    │     │ (React Native)  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   API REST Backend    │
         │   (Node.js/Express)   │
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐  ┌─────▼─────┐
│PostgreSQL│  │    Redis    │  │   AWS S3  │
│ Database │  │   (Cache)   │  │  (Files)  │
└──────────┘  └─────────────┘  └───────────┘
```

### 4.2 Stack Tecnológico

#### 4.2.1 Frontend Web
- **Framework:** React.js 18+ con TypeScript
- **UI Library:** Material-UI (MUI) v5
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Mapas:** Google Maps API / Mapbox GL JS
- **Gráficos:** Chart.js / Recharts

#### 4.2.2 Backend
- **Runtime:** Node.js 18+ LTS
- **Framework:** Express.js con TypeScript
- **ORM:** Prisma ORM
- **Validación:** Zod
- **Autenticación:** JWT (JSON Web Tokens)
- **WebSockets:** Socket.io para tiempo real

#### 4.2.3 Base de Datos
- **Principal:** PostgreSQL 15+
- **Caché:** Redis 7+
- **Migraciones:** Prisma Migrate

#### 4.2.4 App Móvil
- **Framework:** React Native 0.72+
- **Navegación:** React Navigation
- **State Management:** Redux Toolkit
- **Geolocalización:** React Native Geolocation / react-native-maps
- **Notificaciones:** React Native Firebase (FCM)

#### 4.2.5 Servicios y APIs Externas
- **Mapas y Geocodificación:** Google Maps API
- **Notificaciones SMS:** Twilio API
- **Notificaciones Email:** SendGrid / AWS SES
- **Notificaciones Push:** Firebase Cloud Messaging (FCM)
- **Almacenamiento de Archivos:** AWS S3
- **Hosting:** AWS EC2 / AWS Elastic Beanstalk

#### 4.2.6 Herramientas de Desarrollo
- **Control de Versiones:** Git / GitHub
- **CI/CD:** GitHub Actions
- **Testing:**
  - Jest (Unit tests)
  - Supertest (API tests)
  - React Testing Library (Component tests)
  - Detox (E2E mobile tests)
- **Linting:** ESLint, Prettier
- **Documentación API:** Swagger/OpenAPI

### 4.3 Modelo de Datos (Entidades Principales)

```
Usuario
├── id, email, password, rol, nombre, telefono

Vehiculo
├── id, placa, marca, modelo, año, tipo, estado, conductor_id

Mantenimiento
├── id, vehiculo_id, tipo, fecha, costo, descripcion, kilometraje

Ruta
├── id, nombre, origen, destino, distancia, tiempo_estimado, vehiculo_id

Pedido
├── id, cliente_id, origen, destino, estado, fecha_creacion, fecha_entrega, ruta_id

Cliente
├── id, razon_social, ruc, direccion, telefono, email

Conductor
├── id, usuario_id, licencia, vehiculo_asignado_id

UbicacionGPS
├── id, vehiculo_id, latitud, longitud, velocidad, timestamp
```

### 4.4 Seguridad

- **Autenticación:** JWT con refresh tokens
- **Autorización:** Role-Based Access Control (RBAC)
- **Encriptación:** HTTPS/TLS para todas las comunicaciones
- **Validación:** Validación de entrada en backend y frontend
- **SQL Injection:** Prevención mediante ORM (Prisma)
- **XSS:** Sanitización de inputs
- **CORS:** Configuración restrictiva

---

## 5. METODOLOGÍA DE DESARROLLO

### 5.1 Metodología Principal

**Metodología Ágil - Scrum**

Se utilizará Scrum como metodología principal debido a:
- Necesidad de adaptación a cambios en requerimientos
- Entrega incremental de valor
- Feedback continuo del cliente
- Mejora continua del proceso

### 5.2 Roles del Equipo

1. **Product Owner (PO):** Representante del cliente, define prioridades
2. **Scrum Master (SM):** Facilita el proceso Scrum, elimina impedimentos
3. **Desarrolladores Backend (2):** Desarrollo de APIs y lógica de negocio
4. **Desarrollador Frontend Web (1):** Desarrollo de interfaz web
5. **Desarrollador Mobile (1):** Desarrollo de app móvil
6. **QA/Tester (1):** Pruebas y aseguramiento de calidad
7. **Diseñador UX/UI (1):** Diseño de interfaces (part-time)

### 5.3 Eventos Scrum

- **Sprint Planning:** Inicio de cada sprint (2 horas)
- **Daily Standup:** Reunión diaria de 15 minutos
- **Sprint Review:** Demostración al cliente (2 horas)
- **Sprint Retrospective:** Mejora del proceso (1 hora)
- **Sprint Duration:** 2 semanas

### 5.4 Artefactos Scrum

- **Product Backlog:** Lista priorizada de funcionalidades
- **Sprint Backlog:** Tareas del sprint actual
- **Incremento:** Software funcional al final de cada sprint

### 5.5 Prácticas de Desarrollo

#### 5.5.1 Control de Versiones
- **Git Flow:** Estrategia de ramas
  - `main`: Código en producción
  - `develop`: Código en desarrollo
  - `feature/*`: Nuevas funcionalidades
  - `hotfix/*`: Correcciones urgentes
- **Commits:** Mensajes descriptivos siguiendo Conventional Commits

#### 5.5.2 Code Review
- Todas las pull requests requieren aprobación de al menos 1 revisor
- Revisión de código antes de merge a `develop` o `main`

#### 5.5.3 Testing
- **Unit Tests:** Cobertura mínima del 70%
- **Integration Tests:** Para APIs críticas
- **E2E Tests:** Para flujos principales
- **Testing Manual:** Para UX y casos edge

#### 5.5.4 CI/CD
- **Continuous Integration:** Tests automáticos en cada push
- **Continuous Deployment:** Deploy automático a staging
- **Deploy Manual:** A producción con aprobación

#### 5.5.5 Documentación
- **Código:** Comentarios en funciones complejas
- **API:** Documentación Swagger/OpenAPI
- **Manual de Usuario:** Guías para cada tipo de usuario
- **Manual Técnico:** Arquitectura y decisiones técnicas

### 5.6 Definición de "Done"

Una tarea se considera "Done" cuando:
- ✅ Código desarrollado y revisado
- ✅ Tests escritos y pasando
- ✅ Documentación actualizada
- ✅ Code review aprobado
- ✅ Desplegado en ambiente de staging
- ✅ Probado manualmente
- ✅ Aceptado por el Product Owner

---

## 6. PLAN DE TRABAJO Y CRONOGRAMA

### 6.1 Fases del Proyecto

#### FASE 1: Análisis y Diseño (2 semanas)
**Sprint 1 (Semana 1-2)**
- Reuniones con stakeholders para refinar requerimientos
- Análisis de procesos actuales
- Diseño de arquitectura técnica
- Diseño de base de datos
- Creación de mockups y prototipos UI/UX
- Definición de APIs (OpenAPI spec)
- Setup de repositorios y herramientas

**Entregables:**
- Documento de requerimientos detallado
- Diagramas de arquitectura
- Modelo de datos (ERD)
- Mockups de interfaces
- Especificación de APIs

#### FASE 2: Desarrollo Backend (4 semanas)
**Sprint 2 (Semana 3-4): Backend Core**
- Setup de proyecto Node.js/Express
- Configuración de base de datos PostgreSQL
- Implementación de autenticación y autorización
- CRUD de usuarios y roles
- CRUD de vehículos
- CRUD de clientes

**Sprint 3 (Semana 5-6): Módulos Principales**
- CRUD de pedidos
- CRUD de rutas
- Módulo de conductores
- Integración con Google Maps API
- Sistema de notificaciones (email)

#### FASE 3: Desarrollo Frontend Web (3 semanas)
**Sprint 4 (Semana 7-8): Interfaces Principales**
- Setup de proyecto React
- Login y autenticación
- Dashboard principal
- Módulo de gestión de flota (UI)
- Módulo de gestión de pedidos (UI)

**Sprint 5 (Semana 9): Interfaces Avanzadas**
- Módulo de planificación de rutas con mapas
- Módulo de reportes y analytics
- Integración completa frontend-backend
- Optimización de rendimiento

#### FASE 4: Desarrollo App Móvil (4 semanas)
**Sprint 6 (Semana 10-11): App Core**
- Setup de proyecto React Native
- Autenticación en app
- Pantalla de pedidos asignados
- Actualización de estado de pedidos
- Integración con GPS

**Sprint 7 (Semana 12-13): Funcionalidades Avanzadas**
- Rastreo GPS en tiempo real
- Notificaciones push
- Firma digital de entregas
- Sincronización offline

#### FASE 5: Testing y QA (2 semanas)
**Sprint 8 (Semana 14-15)**
- Testing de todos los módulos
- Pruebas de integración
- Pruebas de rendimiento
- Pruebas de seguridad
- Corrección de bugs
- Testing de usabilidad

#### FASE 6: Despliegue y Capacitación (1 semana)
**Semana 16**
- Configuración de servidores de producción
- Migración de datos (si aplica)
- Deploy a producción
- Pruebas en producción
- Capacitación a usuarios
- Entrega de documentación

### 6.2 Hitos del Proyecto

| Hito | Fecha | Entregable |
|------|-------|------------|
| Hito 1 | Semana 2 | Diseño y arquitectura aprobados |
| Hito 2 | Semana 6 | Backend completo y probado |
| Hito 3 | Semana 9 | Sistema web funcional |
| Hito 4 | Semana 13 | App móvil funcional |
| Hito 5 | Semana 15 | Sistema completo probado |
| Hito 6 | Semana 16 | Sistema en producción |

### 6.3 Diagrama de Gantt (Resumen)

```
Fase 1: Análisis        [████]
Fase 2: Backend         [████████]
Fase 3: Frontend Web    [██████]
Fase 4: App Móvil       [████████]
Fase 5: Testing         [████]
Fase 6: Deploy          [██]

Semanas: 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
```

---

## 7. RECURSOS Y EQUIPO

### 7.1 Equipo de Desarrollo

| Rol | Cantidad | Responsabilidades |
|-----|----------|-------------------|
| Project Manager / Scrum Master | 1 | Gestión del proyecto, facilitación Scrum |
| Product Owner | 1 | Definición de requerimientos, priorización |
| Desarrollador Backend Senior | 1 | Arquitectura backend, APIs complejas |
| Desarrollador Backend | 1 | Desarrollo de módulos backend |
| Desarrollador Frontend Web | 1 | Desarrollo de interfaz web |
| Desarrollador Mobile | 1 | Desarrollo de app móvil |
| QA/Tester | 1 | Pruebas y aseguramiento de calidad |
| Diseñador UX/UI | 1 (part-time) | Diseño de interfaces |

### 7.2 Infraestructura y Herramientas

- **Servidores:** AWS EC2 o servidor dedicado
- **Base de Datos:** PostgreSQL en servidor dedicado o RDS
- **Almacenamiento:** AWS S3 para archivos
- **Dominio y SSL:** Certificado SSL para HTTPS
- **Herramientas de Desarrollo:** Licencias de IDE, herramientas de diseño
- **APIs Externas:** Google Maps API, Twilio, SendGrid

---

## 8. PRESUPUESTO ESTIMADO

### 8.1 Costos de Desarrollo (16 semanas)

| Concepto | Cantidad | Costo Unitario (USD) | Total (USD) |
|----------|----------|---------------------|-------------|
| Project Manager (16 semanas) | 1 | 2,500/semana | 40,000 |
| Desarrollador Backend Senior (16 semanas) | 1 | 2,000/semana | 32,000 |
| Desarrollador Backend (12 semanas) | 1 | 1,500/semana | 18,000 |
| Desarrollador Frontend (9 semanas) | 1 | 1,500/semana | 13,500 |
| Desarrollador Mobile (8 semanas) | 1 | 1,500/semana | 12,000 |
| QA/Tester (6 semanas) | 1 | 1,200/semana | 7,200 |
| Diseñador UX/UI (4 semanas part-time) | 1 | 1,000/semana | 4,000 |
| **Subtotal Recursos Humanos** | | | **126,700** |

### 8.2 Costos de Infraestructura (Anual)

| Concepto | Costo Mensual (USD) | Costo Anual (USD) |
|----------|---------------------|-------------------|
| Servidor Web (AWS EC2) | 150 | 1,800 |
| Base de Datos (RDS PostgreSQL) | 100 | 1,200 |
| Almacenamiento S3 | 50 | 600 |
| Google Maps API | 200 | 2,400 |
| Twilio (SMS) | 50 | 600 |
| SendGrid (Email) | 20 | 240 |
| Dominio y SSL | - | 50 |
| **Subtotal Infraestructura** | | **6,890** |

### 8.3 Costos Adicionales

| Concepto | Costo (USD) |
|----------|-------------|
| Licencias de software | 2,000 |
| Herramientas de desarrollo | 1,500 |
| Capacitación | 1,000 |
| Contingencias (10%) | 13,809 |
| **Subtotal Adicionales** | **18,309** |

### 8.4 Resumen de Presupuesto

| Concepto | Total (USD) |
|----------|-------------|
| Recursos Humanos | 126,700 |
| Infraestructura (primer año) | 6,890 |
| Costos Adicionales | 18,309 |
| **TOTAL PROYECTO** | **151,899** |

**Nota:** Los costos de infraestructura mensuales posteriores al primer año serían aproximadamente $570 USD/mes.

---

## 9. RIESGOS Y MITIGACIONES

### 9.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Problemas de integración con GPS | Media | Alto | Prototipo temprano, pruebas con dispositivos reales |
| Rendimiento de mapas con muchos vehículos | Media | Medio | Optimización, clustering de marcadores, paginación |
| Problemas de conectividad en campo | Alta | Medio | Modo offline en app móvil, sincronización diferida |
| Escalabilidad de base de datos | Baja | Alto | Diseño escalable desde inicio, índices optimizados |

### 9.2 Riesgos de Proyecto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en requerimientos | Alta | Medio | Metodología ágil, comunicación constante con cliente |
| Retrasos en entregas | Media | Alto | Buffer de tiempo, priorización, sprints cortos |
| Disponibilidad del equipo | Baja | Alto | Equipo dedicado, backup de conocimiento |
| Problemas con APIs externas | Media | Medio | Múltiples proveedores, fallbacks |

### 9.3 Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia al cambio de usuarios | Media | Medio | Capacitación adecuada, UI intuitiva, soporte post-lanzamiento |
| Costos de infraestructura mayores | Baja | Medio | Monitoreo de uso, optimización continua |

---

## 10. CRITERIOS DE ÉXITO

### 10.1 Criterios Técnicos

- ✅ Sistema disponible 99% del tiempo (uptime)
- ✅ Tiempo de respuesta de APIs < 500ms (p95)
- ✅ App móvil funciona en Android 8+ e iOS 12+
- ✅ Cobertura de tests > 70%
- ✅ Sin vulnerabilidades críticas de seguridad

### 10.2 Criterios Funcionales

- ✅ Todos los módulos principales implementados y funcionando
- ✅ Rastreo GPS en tiempo real con precisión < 50 metros
- ✅ Notificaciones automáticas funcionando (SMS y Email)
- ✅ Optimización de rutas reduce costos en al menos 15%
- ✅ Sistema genera reportes requeridos

### 10.3 Criterios de Negocio

- ✅ Reducción de tiempo de planificación de rutas en 60%
- ✅ Mejora en satisfacción de clientes (medido por encuestas)
- ✅ Reducción de errores en asignación de pedidos en 80%
- ✅ Usuarios capacitados y usando el sistema activamente
- ✅ ROI positivo en 12 meses

### 10.4 Métricas de Éxito (KPIs)

- **Eficiencia Operativa:**
  - Tiempo promedio de planificación de ruta: < 10 minutos (antes: 45 min)
  - Tasa de entregas exitosas: > 95%
  
- **Satisfacción del Cliente:**
  - Tiempo de respuesta a consultas: < 2 horas
  - Rating de satisfacción: > 4.5/5
  
- **Uso del Sistema:**
  - Usuarios activos diarios: > 80% del total
  - Pedidos gestionados por el sistema: 100%

---

## 11. PLAN DE MANTENIMIENTO Y SOPORTE

### 11.1 Mantenimiento Post-Lanzamiento

**Primeros 3 meses:**
- Soporte técnico prioritario
- Corrección de bugs críticos en 24 horas
- Corrección de bugs menores en 1 semana
- Monitoreo continuo del sistema

**Meses 4-12:**
- Soporte técnico estándar
- Actualizaciones de seguridad
- Mejoras menores basadas en feedback
- Reportes mensuales de rendimiento

### 11.2 Modelo de Soporte

- **Soporte Crítico (24/7):** Para problemas que afectan operaciones
- **Soporte Estándar:** Lunes a Viernes, 9am - 6pm
- **Canales:** Email, teléfono, sistema de tickets

---

## 12. CONCLUSIÓN

Este proyecto de **Sistema Web y App Móvil para Gestión de Transporte y Logística** representa una solución integral y moderna que transformará las operaciones de Transportes Piura S.A.C., mejorando significativamente su eficiencia, reduciendo costos y elevando la satisfacción de sus clientes.

La combinación de tecnologías modernas, metodología ágil probada y un equipo experimentado garantiza la entrega exitosa de un sistema robusto, escalable y de alta calidad que cumplirá con todos los objetivos establecidos.

---

**Documento elaborado por:** [Nombre de la Empresa]  
**Fecha:** [Fecha]  
**Versión:** 1.0

