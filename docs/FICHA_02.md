# FICHA 02 - PERFIL DEL PROYECTO
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería
### Proyecto: Chilalo Shot

---

## 1. INTRODUCCIÓN

El presente documento describe el perfil del proyecto de desarrollo e implementación de un **Sistema Web y Aplicación Móvil con Inteligencia Artificial** para la gestión integral de la licorería **"Chilalo Shot"**, ubicada en Piura, Perú. Este sistema está diseñado específicamente para licorerías pequeñas que operan con 1-2 empleados, donde frecuentemente el dueño es uno de ellos.

El proyecto busca transformar las operaciones manuales actuales de "Chilalo Shot" mediante la implementación de una solución tecnológica integral que combine digitalización de procesos, cumplimiento normativo con SUNAT, control inteligente de inventario y herramientas de inteligencia artificial para automatizar decisiones de negocio y optimizar operaciones.

La solución propuesta permitirá a "Chilalo Shot" competir de manera más efectiva en el mercado, reducir pérdidas operativas, cumplir con normativas fiscales y mejorar significativamente la experiencia tanto del dueño/empleado como de los clientes.

---

## 2. VISTA GENERAL DEL PROYECTO

### 2.1. Propósito

El propósito principal de este proyecto es **desarrollar e implementar un sistema web y aplicación móvil con inteligencia artificial** que permita a la licorería "Chilalo Shot" gestionar de manera integral, automatizada y eficiente todas sus operaciones de negocio, incluyendo:

- **Gestión de ventas:** Sistema de punto de venta (POS) rápido e intuitivo que reduzca el tiempo de atención al cliente
- **Control de inventario:** Sistema en tiempo real con alertas inteligentes y predicción de demanda mediante IA
- **Facturación electrónica:** Integración con SUNAT para emisión automática de boletas y facturas electrónicas
- **Gestión de promociones:** Sistema flexible de promociones y packs con sugerencias automáticas de IA
- **Reportes analíticos:** Dashboard con métricas clave e insights automatizados para toma de decisiones
- **Inteligencia artificial:** Recomendaciones de productos, predicción de demanda y optimización automática de inventario

El sistema está diseñado específicamente para operar con personal mínimo (1-2 personas), siendo intuitivo, fácil de usar y optimizado para licorerías pequeñas con presupuestos limitados.

### 2.2. Alcance

#### 2.2.1. Alcance Incluido

**Módulos Core del Sistema:**
- **Módulo de Ventas (POS):** Interfaz de venta rápida, búsqueda de productos, cálculo automático, múltiples formas de pago, impresión de tickets
- **Módulo de Facturación Electrónica:** Emisión de boletas y facturas electrónicas integradas con SUNAT, generación de XML y PDF
- **Módulo de Control de Inventario:** Gestión de productos, control de stock en tiempo real, alertas de stock bajo y productos próximos a vencer
- **Módulo de Promociones y Packs:** Creación y gestión de promociones, descuentos, packs de productos con aplicación automática
- **Módulo de Clientes y Fidelización:** Registro de clientes, historial de compras, programa de puntos y fidelización
- **Módulo de Reportes y Analytics:** Dashboard ejecutivo, reportes de ventas, inventario y rentabilidad con visualización de datos
- **Módulo de Inteligencia Artificial:**
  - Recomendaciones inteligentes de productos durante la venta
  - Predicción de demanda para optimizar compras
  - Optimización automática de inventario
  - Sugerencias automáticas de promociones
  - Análisis de patrones de compra

**Plataformas:**
- Sistema Web (React.js) - Plataforma principal de gestión
- Aplicación POS (Electron) - Punto de venta optimizado
- Aplicación Móvil (Android Studio + Kotlin + Firebase) - Gestión desde dispositivos Android (opcional para fases posteriores)

**Integraciones:**
- Integración con SUNAT mediante OSE (Operador de Servicios Electrónicos)
- Servicio de IA (Python/FastAPI) para modelos de machine learning

#### 2.2.2. Alcance Excluido

- Sistema contable completo
- Gestión de nómina de empleados
- Integración con sistemas bancarios para pagos
- E-commerce (venta online)
- App para clientes finales
- Sistema de delivery
- Integración con redes sociales
- Sistema de gestión de proveedores avanzado

#### 2.2.3. Alcance Opcional (Fases Posteriores)

- App móvil completa para gestión (prioridad: sistema web + POS)
- Funcionalidades avanzadas de IA (modelos más complejos)
- Integraciones adicionales (delivery, redes sociales)
- Sistema de gestión de múltiples sucursales

### 2.3. Objetivos

#### 2.3.1. Objetivo General

Desarrollar e implementar un sistema web y aplicación móvil con inteligencia artificial que permita a la licorería "Chilalo Shot" gestionar de manera integral y automatizada sus operaciones de venta, inventario, facturación y promociones, mejorando la eficiencia operativa, cumpliendo normativas fiscales y elevando la satisfacción del cliente mediante recomendaciones inteligentes y predicciones automatizadas.

#### 2.3.2. Objetivos Específicos

1. **Digitalizar el proceso de ventas:** Implementar sistema de punto de venta (POS) rápido e intuitivo que reduzca el tiempo de venta de 3-5 minutos a 30-45 segundos
2. **Automatizar emisión de comprobantes:** Integración con SUNAT para emisión automática de boletas y facturas electrónicas, garantizando 100% de cumplimiento normativo
3. **Controlar inventario en tiempo real:** Sistema de gestión de stock con alertas inteligentes y predicción de demanda mediante IA, reduciendo pérdidas por inventario en 80%
4. **Gestionar promociones y packs:** Módulo flexible con sugerencias automáticas de IA basadas en patrones de venta
5. **Generar reportes analíticos:** Dashboard con métricas clave de negocio e insights automatizados para toma de decisiones informadas
6. **Desarrollar app móvil:** Aplicación Android (Android Studio + Kotlin + Firebase) para gestión desde dispositivos móviles (opcional para fases posteriores)
7. **Implementar programa de fidelización:** Sistema de puntos y descuentos para clientes frecuentes
8. **Integrar inteligencia artificial:** Sistema de recomendaciones de productos, predicción de demanda y optimización automática de inventario
9. **Simplificar operaciones:** Interfaz intuitiva que minimice la curva de aprendizaje para uso con 1-2 personas

### 2.4. Definiciones, Acrónimos y Abreviaturas

| Término | Definición |
|---------|------------|
| **POS** | Point of Sale (Punto de Venta). Sistema terminal utilizado para procesar transacciones de venta |
| **SUNAT** | Superintendencia Nacional de Aduanas y de la Administración Tributaria del Perú |
| **OSE** | Operador de Servicios Electrónicos. Empresa privada autorizada por SUNAT para intermediar en la emisión de comprobantes electrónicos |
| **IA/ML** | Inteligencia Artificial / Machine Learning. Tecnologías que permiten a sistemas aprender y tomar decisiones automáticas |
| **API** | Application Programming Interface (Interfaz de Programación de Aplicaciones) |
| **CRUD** | Create, Read, Update, Delete (Crear, Leer, Actualizar, Eliminar). Operaciones básicas de gestión de datos |
| **JWT** | JSON Web Token. Estándar para autenticación y autorización |
| **REST** | Representational State Transfer. Estilo arquitectónico para servicios web |
| **XML** | eXtensible Markup Language. Formato de archivo requerido por SUNAT para comprobantes electrónicos |
| **PDF** | Portable Document Format. Formato de documento para comprobantes electrónicos |
| **CDR** | Constancia de Recepción. Documento que SUNAT emite al recibir un comprobante electrónico |
| **ROI** | Return on Investment (Retorno de Inversión) |
| **KPI** | Key Performance Indicator (Indicador Clave de Rendimiento) |
| **MVP** | Minimum Viable Product (Producto Mínimo Viable) |
| **UI/UX** | User Interface / User Experience (Interfaz de Usuario / Experiencia de Usuario) |
| **RBAC** | Role-Based Access Control (Control de Acceso Basado en Roles) |
| **Firebase** | Plataforma de Google para apps móviles y web: Authentication, Firestore, Realtime Database, Cloud Messaging (FCM), Storage |
| **FCM** | Firebase Cloud Messaging. Servicio para envío de notificaciones push a dispositivos Android |
| **Kotlin** | Lenguaje de programación moderno para Android, oficialmente soportado por Google |
| **MVVM** | Model-View-ViewModel. Patrón de arquitectura para separar UI, lógica y datos en apps Android |

---

## 3. PERFIL DEL PROYECTO

### 3.1. Oportunidad de Negocio

La licorería "Chilalo Shot" opera actualmente con procesos manuales que generan ineficiencias significativas y limitan su capacidad de crecimiento. Existe una **oportunidad estratégica** de transformar las operaciones mediante la implementación de un sistema integral que combine:

1. **Digitalización de procesos:** Automatización de ventas, inventario y facturación que elimine procesos manuales propensos a errores
2. **Cumplimiento normativo:** Integración nativa con SUNAT que garantice emisión de comprobantes electrónicos y elimine multas
3. **Inteligencia artificial:** Herramientas avanzadas de recomendación, predicción y optimización que normalmente solo están disponibles para grandes empresas
4. **Competitividad mejorada:** Capacidad de competir con establecimientos más grandes mediante herramientas tecnológicas modernas
5. **Escalabilidad:** Sistema que crece con el negocio, desde operación pequeña hasta mediana

**Oportunidad de mercado:** En Piura existen cientos de licorerías pequeñas con necesidades similares, lo que representa un mercado potencial significativo. La solución desarrollada para "Chilalo Shot" puede servir como base para un producto estandarizado pero personalizable.

**Impacto esperado:**
- Reducción de pérdidas operativas de S/. 33,000 anuales a menos de S/. 5,000 anuales
- Aumento de ventas del 20-30% por mejor atención y disponibilidad de productos
- Eliminación completa de multas por incumplimiento normativo
- Mejora en satisfacción del cliente y competitividad en el mercado

### 3.2. Enunciado del Problema

#### El Problema

La licorería "Chilalo Shot" opera con **procesos manuales obsoletos** que generan ineficiencias significativas, pérdidas económicas y limitan su capacidad de crecimiento y servicio al cliente. La falta de un sistema informático integrado provoca múltiples problemas críticos en las operaciones diarias.

#### Afecta a

**Afecta directamente a:**
- **Dueño/Propietario de "Chilalo Shot":** Debe realizar múltiples tareas manuales (ventas, inventario, facturación) que consumen tiempo valioso y generan estrés. Toma decisiones sin datos reales del negocio.
- **Empleado/Vendedor (si existe):** Debe buscar precios manualmente, calcular totales, registrar ventas en cuadernos, generando lentitud y errores en el servicio.
- **Clientes de "Chilalo Shot":** Experimentan tiempos de espera prolongados (3-5 minutos por venta), productos no disponibles, falta de comprobantes cuando los requieren, y ausencia de promociones o programas de fidelización.

**Afecta indirectamente a:**
- **Competitividad del negocio:** No puede competir efectivamente con establecimientos que tienen sistemas automatizados
- **Crecimiento del negocio:** La ineficiencia impide expandir operaciones o atender más clientes
- **Cumplimiento normativo:** Riesgo constante de multas y sanciones por incumplimiento con SUNAT

#### Impacto

**Impacto Financiero:**
- **Pérdidas por inventario descontrolado:** S/. 800/mes (S/. 9,600/año) por productos vencidos no detectados, exceso de stock de baja rotación
- **Multas y sanciones SUNAT:** S/. 250/mes promedio (S/. 3,000/año) por no emitir comprobantes electrónicos
- **Ventas perdidas por desabastecimiento:** S/. 1,200/mes (S/. 14,400/año) por productos no disponibles cuando los clientes los buscan
- **Ineficiencia en tiempo de venta:** S/. 300/mes (S/. 3,600/año) por tiempo adicional que limita capacidad de atender más clientes
- **Errores en cálculos y registros:** S/. 200/mes (S/. 2,400/año) por errores en precios, totales y cambio
- **TOTAL: S/. 2,750/mes (S/. 33,000/año)** en pérdidas directas

**Impacto Operativo:**
- **Tiempo perdido:** 2-3 horas diarias (15-20 horas semanales) en tareas manuales
- **Velocidad de atención:** Tiempo actual de 3-5 minutos por venta vs. tiempo óptimo de 30-45 segundos
- **Precisión de inventario:** ~70% de precisión actual vs. >98% objetivo
- **Capacidad de atención:** Solo 4-6 clientes por hora vs. potencial de 20-30 clientes/hora

**Impacto en Cumplimiento Normativo:**
- **Riesgo legal:** Multas de S/. 1,000-3,000 por incumplimiento, riesgo de clausura
- **Pérdida de clientes corporativos:** Empresas que requieren facturas electrónicas no pueden comprar
- **Limitación de crecimiento:** No pueden participar en licitaciones o contratos que requieren facturación electrónica

**Impacto en Satisfacción del Cliente:**
- **Tiempo de espera:** Clientes esperan 3-5 minutos por venta, generando colas y frustración
- **Productos no disponibles:** 15-20 clientes/semana buscan productos que no están en stock
- **Falta de comprobantes:** Clientes que necesitan boletas o facturas no pueden obtenerlas
- **Ausencia de promociones:** No pueden aprovechar ofertas o programas de fidelización

#### Solución

La solución propuesta es el desarrollo e implementación de un **Sistema Web y Aplicación Móvil con Inteligencia Artificial** que:

1. **Digitaliza completamente las operaciones:**
   - Sistema POS rápido que reduce tiempo de venta a 30-45 segundos
   - Control de inventario en tiempo real con actualización automática
   - Eliminación de procesos manuales propensos a errores

2. **Garantiza cumplimiento normativo:**
   - Integración automática con SUNAT para emisión de comprobantes electrónicos
   - Eliminación de multas por incumplimiento
   - Acceso al mercado corporativo que requiere facturación electrónica

3. **Optimiza inventario mediante IA:**
   - Alertas inteligentes de stock bajo y productos próximos a vencer
   - Predicción de demanda para optimizar compras
   - Reducción de pérdidas por inventario en 80%

4. **Mejora experiencia del cliente:**
   - Atención más rápida y eficiente
   - Recomendaciones inteligentes de productos durante la venta
   - Promociones y programas de fidelización

5. **Proporciona insights para decisiones:**
   - Dashboard con métricas clave en tiempo real
   - Reportes analíticos automatizados
   - Sugerencias de IA para optimización del negocio

**Resultado esperado:** Transformación completa de las operaciones de "Chilalo Shot", reduciendo pérdidas de S/. 33,000/año a menos de S/. 5,000/año, aumentando ventas en 20-30%, y mejorando significativamente la eficiencia operativa y satisfacción del cliente.

---

## 4. INTERESADOS (PARTICIPANTES DEL PROYECTO Y USUARIOS)

### 4.1. Resumen de Interesados

| Ítem | Interesado | Descripción | Responsabilidad |
|------|------------|-------------|------------------|
| 1 | **Dueño/Propietario de "Chilalo Shot"** | Persona que toma las decisiones estratégicas del negocio y es usuario principal del sistema | - Definir requerimientos y prioridades<br>- Validar funcionalidades<br>- Participar en pruebas y capacitación<br>- Aprobar entregas del proyecto<br>- Usar el sistema diariamente para gestión del negocio |
| 2 | **Empleado/Vendedor de "Chilalo Shot"** | Persona que atiende a clientes y realiza ventas en el establecimiento | - Usar el sistema POS para ventas<br>- Registrar productos y consultar inventario<br>- Aplicar promociones y descuentos<br>- Proporcionar feedback sobre usabilidad |
| 3 | **Equipo de Desarrollo (Practicante)** | Desarrollador Full Stack responsable de diseñar, desarrollar e implementar el sistema | - Analizar requerimientos<br>- Diseñar arquitectura y base de datos<br>- Desarrollar backend, frontend y módulos de IA<br>- Integrar con SUNAT<br>- Realizar pruebas y corrección de bugs<br>- Desplegar y capacitar usuarios |
| 4 | **Asesor/Tutor Académico** | Profesional que supervisa y guía el proyecto desde el punto de vista académico | - Revisar avances del proyecto<br>- Proporcionar orientación técnica y metodológica<br>- Validar calidad de entregables<br>- Asegurar cumplimiento de objetivos académicos |
| 5 | **SUNAT (Superintendencia Nacional de Aduanas y de la Administración Tributaria)** | Entidad gubernamental que regula la emisión de comprobantes electrónicos | - Proporcionar normativas y estándares técnicos<br>- Validar comprobantes electrónicos emitidos<br>- Fiscalizar cumplimiento normativo |
| 6 | **OSE (Operador de Servicios Electrónicos)** | Empresa privada autorizada por SUNAT que intermedia en la emisión de comprobantes | - Proporcionar API para integración con SUNAT<br>- Gestionar certificados digitales<br>- Transmitir comprobantes a SUNAT<br>- Proporcionar soporte técnico para facturación |
| 7 | **Clientes de "Chilalo Shot"** | Personas que compran productos en la licorería | - Utilizar el servicio mejorado<br>- Solicitar comprobantes electrónicos cuando los requieren<br>- Participar en programas de fidelización<br>- Proporcionar feedback sobre experiencia de compra |

### 4.2. Resumen de Usuarios

| Ítem | Rol | Descripción | Usuario |
|------|-----|-------------|---------|
| 1 | **Administrador/Dueño** | Usuario con acceso completo al sistema. Puede configurar parámetros, gestionar inventario, crear promociones, visualizar reportes y analytics, configurar facturación electrónica, y acceder a todas las funcionalidades de IA | Dueño/Propietario de "Chilalo Shot" |
| 2 | **Vendedor/Empleado** | Usuario con acceso a funcionalidades operativas. Puede realizar ventas mediante POS, consultar productos y precios, aplicar promociones, registrar clientes básicos, consultar stock disponible, y visualizar recomendaciones de productos | Empleado/Vendedor de "Chilalo Shot" (si existe) |
| 3 | **Sistema de IA** | Entidad no humana que procesa datos y genera recomendaciones, predicciones y optimizaciones automáticas | Servicio de Machine Learning (Python/FastAPI) |

**Nota:** En licorerías con solo 1 persona (el dueño), este usuario tendrá ambos roles (Administrador y Vendedor). El sistema está diseñado para ser simple e intuitivo, permitiendo que una sola persona gestione todas las operaciones eficientemente con ayuda de la IA.

---

## 5. LA SOLUCIÓN

### 5.1. Perspectivas de la Solución

La solución propuesta es un **Sistema Web y Aplicación Móvil con Inteligencia Artificial** diseñado específicamente para licorerías pequeñas como "Chilalo Shot". La solución se compone de:

**1. Sistema Web (React.js):**
- Plataforma principal de gestión administrativa
- Accesible desde cualquier navegador
- Interfaz completa para gestión de inventario, promociones, reportes y configuración
- Dashboard ejecutivo con métricas clave y visualización de insights de IA

**2. Aplicación POS (Electron):**
- Punto de venta optimizado para ventas rápidas
- Interfaz táctil diseñada para uso en tienda
- Integración con lectores de código de barras e impresoras térmicas
- Funcionalidad offline básica para operar sin conexión temporal

**3. Aplicación Móvil (Android - Kotlin + Firebase - Opcional):**
- Desarrollo en **Android Studio** con **Kotlin**
- **Firebase:** Authentication, Firestore/Realtime Database, Cloud Messaging (notificaciones push), Storage
- Gestión desde smartphones y tablets Android
- Consultas rápidas, ventas móviles, control de inventario básico
- Sincronización en tiempo real con backend y sistema web

**4. Backend (Spring Boot):**
- API REST para todas las funcionalidades
- Integración con SUNAT mediante OSE
- Gestión de base de datos PostgreSQL
- Autenticación y autorización mediante JWT

**5. Servicio de Inteligencia Artificial (Python/FastAPI):**
- Modelos de machine learning para recomendaciones
- Predicción de demanda mediante series temporales
- Optimización automática de inventario
- Análisis de patrones de compra

**Arquitectura:** Cliente-Servidor con API REST, servicios en la nube y modelos de IA integrados.

### 5.2. Necesidades

| Ítem | Descripción de la Necesidad | Procedencia |
|------|----------------------------|-------------|
| 1 | **Sistema de punto de venta rápido e intuitivo** que permita realizar ventas en menos de 30-45 segundos, con búsqueda rápida de productos, cálculo automático de totales, aplicación de promociones y múltiples formas de pago | Dueño/Propietario y Empleado/Vendedor - Necesidad operativa crítica para mejorar atención al cliente |
| 2 | **Control de inventario en tiempo real** con alertas automáticas de stock bajo y productos próximos a vencer, actualización automática con cada venta, y visibilidad completa del estado del inventario | Dueño/Propietario - Necesidad para reducir pérdidas por inventario descontrolado |
| 3 | **Emisión automática de comprobantes electrónicos** (boletas y facturas) integrados con SUNAT, que garantice cumplimiento normativo y elimine multas | SUNAT (normativa legal) y Clientes corporativos - Requisito legal obligatorio |
| 4 | **Sistema de promociones y packs flexible** que permita crear descuentos, packs de productos y promociones especiales, con aplicación automática durante la venta | Dueño/Propietario - Necesidad competitiva para atraer y retener clientes |
| 5 | **Reportes analíticos y dashboard** con métricas clave de negocio (ventas, productos más vendidos, rentabilidad) para toma de decisiones informadas | Dueño/Propietario - Necesidad estratégica para gestionar el negocio basado en datos |
| 6 | **Recomendaciones inteligentes de productos** durante la venta basadas en historial de compras, para aumentar el ticket promedio de venta | Dueño/Propietario - Necesidad para optimizar ventas mediante IA |
| 7 | **Predicción de demanda** que sugiera qué productos comprar y en qué cantidades, basándose en historial de ventas y tendencias | Dueño/Propietario - Necesidad para optimizar compras y evitar desabastecimiento |
| 8 | **Programa de fidelización** con sistema de puntos y descuentos para clientes frecuentes | Dueño/Propietario y Clientes - Necesidad competitiva para retener clientes |
| 9 | **Interfaz simple e intuitiva** diseñada para uso con 1-2 personas, con curva de aprendizaje mínima | Dueño/Propietario y Empleado/Vendedor - Necesidad de usabilidad para facilitar adopción del sistema |
| 10 | **Funcionalidad offline básica** en POS para operar sin conexión a internet temporal, con sincronización automática cuando se restablece la conexión | Empleado/Vendedor - Necesidad operativa para continuidad del servicio |

### 5.3. Características Principales

**1. Sistema de Punto de Venta (POS) Optimizado:**
- Búsqueda rápida de productos por código de barras, nombre o categoría
- Interfaz táctil intuitiva diseñada para ventas rápidas
- Cálculo automático de totales, descuentos e impuestos
- Aplicación automática de promociones y packs
- Múltiples formas de pago (efectivo, tarjeta, transferencia)
- Cálculo automático de vuelto
- Impresión de tickets de venta
- Funcionalidad offline básica

**2. Control de Inventario Inteligente:**
- Gestión completa de productos con categorías, precios, stock mínimo/máximo
- Actualización automática de stock con cada venta
- Alertas automáticas de stock bajo y productos próximos a vencer
- Historial completo de movimientos de inventario
- Registro de compras a proveedores
- Predicción de demanda mediante IA

**3. Facturación Electrónica Integrada con SUNAT:**
- Emisión automática de boletas y facturas electrónicas
- Integración con OSE para transmisión a SUNAT
- Generación automática de XML y PDF
- Consulta de estado de comprobantes
- Resumen diario de boletas (RCB)
- Almacenamiento seguro de comprobantes

**4. Sistema de Promociones y Packs:**
- Creación de packs de productos (ej: "Pack Cerveza 6 unidades")
- Descuentos por porcentaje o monto fijo
- Descuentos por volumen (2x1, lleva 3 paga 2)
- Promociones por categoría, fecha o temporada
- Aplicación automática durante la venta
- Sugerencias automáticas de promociones mediante IA

**5. Inteligencia Artificial Integrada:**
- **Recomendaciones de productos:** Sugerencias de productos complementarios durante la venta basadas en historial
- **Predicción de demanda:** Predicción de productos que se agotarán y sugerencias de cantidad a comprar
- **Optimización de inventario:** Sugerencias de stock mínimo/máximo y productos para promocionar
- **Análisis de patrones:** Identificación de horarios pico, productos estacionales, segmentación de clientes

**6. Reportes y Analytics:**
- Dashboard ejecutivo con métricas clave en tiempo real
- Reportes de ventas (diario, semanal, mensual)
- Reportes de inventario (stock bajo, rotación, valor)
- Reportes financieros (ingresos, gastos, rentabilidad)
- Visualización de datos mediante gráficos
- Exportación a Excel/PDF
- Insights automáticos generados por IA

**7. Gestión de Clientes y Fidelización:**
- Registro de clientes con historial de compras
- Programa de puntos por compra
- Canje de puntos por descuentos o productos
- Segmentación automática de clientes mediante IA
- Descuentos especiales para clientes VIP

**8. Seguridad y Control de Acceso:**
- Autenticación mediante JWT
- Control de acceso basado en roles (Administrador, Vendedor)
- Encriptación de datos sensibles
- Logs de auditoría de operaciones
- Backup automático de datos

**9. Multiplataforma:**
- Sistema web accesible desde cualquier navegador
- Aplicación POS para escritorio (Electron)
- Aplicación móvil Android para smartphones y tablets (Kotlin + Firebase, opcional)
- Sincronización en tiempo real entre plataformas

**10. Facilidad de Uso:**
- Interfaz intuitiva diseñada para uso con 1-2 personas
- Curva de aprendizaje mínima
- Atajos de teclado para operaciones comunes
- Modo rápido para operaciones frecuentes
- Capacitación simplificada

---

## 6. OTROS REQUERIMIENTOS DE LA SOLUCIÓN

### 6.1. Estándares Tecnológicos

**Frontend:**
- **React.js 18+** con TypeScript para desarrollo web
- **Material-UI (MUI) v5** o **Ant Design** para componentes de interfaz
- **Redux Toolkit** para gestión de estado
- **React Router v6** para navegación
- **Axios** para peticiones HTTP
- **Chart.js / Recharts** para visualización de datos

**Backend:**
- **Spring Boot 3.x** con Java 17+ (LTS)
- **JPA/Hibernate** para ORM
- **Spring Security** con JWT para autenticación
- **PostgreSQL 15+** como base de datos principal
- **Redis 7+** para caché y sesiones
- **Swagger/OpenAPI** para documentación de API

**Inteligencia Artificial:**
- **Python 3.10+** con **FastAPI** para servicio de IA
- **Scikit-learn** para modelos de machine learning
- **Pandas** para análisis y procesamiento de datos
- **NumPy** para cálculos numéricos
- **Joblib** para persistencia de modelos

**POS:**
- **Electron** para aplicación de escritorio
- **React + TypeScript** (mismo código base que web)
- Integración con lectores de código de barras e impresoras térmicas

**App Móvil Android (Opcional):**
- **Android Studio** como IDE
- **Kotlin** como lenguaje principal
- **Firebase:** Authentication, Firestore o Realtime Database, Cloud Messaging (FCM), Storage
- **Arquitectura:** MVVM recomendada, Jetpack Compose o XML para UI
- **Retrofit/OkHttp** o **Ktor** para consumo de API REST del backend
- **Coroutines** para operaciones asíncronas

**Herramientas de Desarrollo:**
- **Git/GitHub** para control de versiones
- **IntelliJ IDEA Community** o **VS Code** para backend/web; **Android Studio** para app móvil
- **JUnit** para pruebas unitarias del backend
- **Jest + React Testing Library** para pruebas del frontend
- **Postman/Insomnia** para pruebas de APIs

**Servicios Cloud:**
- **Render, Railway o Vercel** (tier gratuito) para hosting
- **Supabase o Neon** (tier gratuito) para base de datos PostgreSQL
- **Firebase** (tier gratuito) para app móvil: Auth, Firestore/Realtime DB, FCM, Storage
- **GitHub Actions** para CI/CD

**Estándares de Código:**
- **ESLint** y **Prettier** para linting y formateo
- **Conventional Commits** para mensajes de commit
- **Code Review** obligatorio para pull requests
- **Cobertura de tests mínima del 70%**

### 6.2. Marco Legal

**Normativas Fiscales (SUNAT):**
- **Resolución de Superintendencia N° 097-2016/SUNAT:** Establece la obligatoriedad de emisión de comprobantes electrónicos
- **Resolución de Superintendencia N° 189-2016/SUNAT:** Norma técnica que establece el formato UBL 2.1 para comprobantes electrónicos
- **Resolución de Superintendencia N° 007-2017/SUNAT:** Establece plazos y procedimientos para emisión de comprobantes electrónicos
- **Cumplimiento obligatorio:** Todas las empresas deben emitir comprobantes electrónicos (boletas y facturas) según normativa vigente

**Protección de Datos Personales:**
- **Ley N° 29733 - Ley de Protección de Datos Personales:** Regula el tratamiento de datos personales de clientes
- **Decreto Supremo N° 003-2013-JUS:** Reglamento de la Ley de Protección de Datos Personales
- **Obligaciones:** Consentimiento informado, seguridad de datos, derecho de acceso y rectificación

**Propiedad Intelectual:**
- **Ley N° 27811 - Ley de Propiedad Intelectual:** Protección de código fuente y diseño del sistema
- **Licencias de software:** Uso de software open source según licencias (MIT, Apache 2.0, etc.)

**Contratos y Servicios:**
- **Contrato de desarrollo:** Define alcance, plazos, entregables y responsabilidades
- **Términos de servicio:** Para uso del sistema por parte de usuarios
- **Política de privacidad:** Para protección de datos de usuarios y clientes

**Certificados Digitales:**
- **Ley N° 27269 - Ley de Firmas y Certificados Digitales:** Regula el uso de certificados digitales para facturación electrónica
- **Requisito:** Certificado digital vigente para firma de comprobantes electrónicos

**Normativas de Comercio:**
- **Código de Protección y Defensa del Consumidor:** Regula relaciones comerciales con clientes
- **Obligaciones:** Emisión de comprobantes, información de productos, protección al consumidor

### 6.3. Restricciones

| Ítem | Descripción |
|------|-------------|
| 1 | **Tiempo de Desarrollo:** El proyecto debe completarse en 14 semanas (3.5 meses) trabajando como desarrollador único (practicante), lo que limita el alcance a funcionalidades core y requiere priorización estricta. La app móvil completa queda como funcionalidad opcional para fases posteriores. |
| 2 | **Presupuesto Mínimo:** Proyecto académico con presupuesto mínimo (aprox. USD 30), utilizando herramientas gratuitas/educativas, hardware propio y servicios cloud en tier gratuito. Requiere priorización de funcionalidades esenciales y uso eficiente de recursos gratuitos disponibles. |
| 3 | **Integración con SUNAT:** Dependencia de la disponibilidad y estabilidad de las APIs de SUNAT y del OSE seleccionado. Cualquier cambio en normativas o APIs de SUNAT puede requerir ajustes en el sistema. El cliente debe contar con certificado digital y cuenta con OSE configurada. |
| 4 | **Conectividad a Internet:** El sistema requiere conexión a internet estable para funcionamiento completo. El POS tendrá funcionalidad offline básica, pero la sincronización y emisión de comprobantes requiere conexión. |
| 5 | **Capacidad Tecnológica del Usuario:** Se asume que el dueño/empleado tiene conocimientos básicos de tecnología. El sistema está diseñado para ser intuitivo, pero requiere capacitación mínima. Si el usuario tiene limitaciones tecnológicas significativas, puede requerir soporte adicional. |
| 6 | **Datos Históricos para IA:** Los modelos de IA requieren datos históricos de ventas para funcionar óptimamente. Durante los primeros meses de operación, los modelos funcionarán con datos de prueba y mejorarán progresivamente con datos reales. |
| 7 | **Hardware Disponible:** El sistema requiere hardware mínimo (computadora/tablet para POS, lector de código de barras opcional, impresora térmica opcional). Si el cliente no cuenta con este hardware, debe adquirirlo por separado. |
| 8 | **Recursos Humanos:** Desarrollo realizado por un solo practicante/desarrollador, lo que puede extender tiempos comparado con un equipo. No hay recursos adicionales para diseño UX/UI profesional, QA dedicado, o soporte técnico 24/7. |
| 9 | **Alcance de Funcionalidades:** Dado el tiempo y presupuesto limitados, funcionalidades avanzadas (app móvil completa, modelos de IA complejos, integraciones adicionales) quedan como opcionales para fases posteriores. |
| 10 | **Estabilidad de Requerimientos:** Se asume que los requerimientos principales son estables. Cambios significativos durante el desarrollo pueden afectar los plazos. Cambios menores se gestionarán mediante metodología ágil. |

---

**Fecha de Actualización:** [Fecha]  
**Versión:** 1.0  
**Preparado por:** [Nombre del Practicante/Desarrollador]  
**Proyecto:** Chilalo Shot - Sistema Web y App Móvil con IA para Gestión Integral de Licorería
