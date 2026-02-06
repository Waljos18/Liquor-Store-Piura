# TRABAJO ACADÉMICO APLICADO (TAA)

## Sistema Web de Gestión de Ventas e Inventario con IA aplicado a la licorería Chilalo Shot

**Proyecto:** Chilalo Shot  
**Código:** PROY-LICOR-PIURA-2025-001  
**Fecha:** Enero 2025

---

# INTRODUCCIÓN

El presente documento constituye el Trabajo Académico Aplicado (TAA) que documenta la investigación y el diseño de una solución tecnológica integral para la licorería **Chilalo Shot**, ubicada en Piura, Perú. Esta investigación surge de la necesidad identificada en las licorerías pequeñas (1-2 empleados) de la región de contar con sistemas de gestión modernos que optimicen sus operaciones, cumplan con normativas fiscales y mejoren su competitividad en el mercado.

**¿Qué se ha investigado?** Se ha realizado un análisis exhaustivo del contexto operativo de las licorerías pequeñas en Piura, identificando los problemas críticos en los procesos de venta manual, control de inventario inexistente, incumplimiento normativo con SUNAT y la ausencia de herramientas tecnológicas adecuadas para su escala de negocio.

**¿Por qué este trabajo?** Las licorerías como Chilalo Shot enfrentan pérdidas estimadas de S/. 33,000 anuales debido a procesos manuales obsoletos, multas por no emitir comprobantes electrónicos, descontrol de inventario y ventas perdidas por desabastecimiento. Existe una oportunidad estratégica de transformar estas operaciones mediante tecnología e inteligencia artificial.

**Objetivos:** El trabajo tiene como objetivo general desarrollar e implementar un sistema web y aplicación móvil con inteligencia artificial que permita gestionar de manera integral las operaciones de venta, inventario, facturación electrónica y promociones, mejorando la eficiencia operativa y cumpliendo normativas fiscales.

**¿Cómo se realizó?** La investigación se ejecutó mediante análisis de documentos del negocio, revisión de normativas SUNAT, identificación de stakeholders, elicitación de requisitos funcionales y no funcionales, análisis de causas raíz del problema y evaluación de alternativas de solución desde las perspectivas de procesos, personas e infraestructura tecnológica.

**Contenido de los capítulos:**

- **Capítulo I - Análisis del Negocio:** Contiene la descripción de la organización Chilalo Shot, su historia, visión, misión, organigrama, análisis FODA, identificación de necesidades, elicitación de requisitos, análisis del problema y propuesta de solución con sus alternativas.

---

# CAPÍTULO I: ANÁLISIS DEL NEGOCIO

## 1. GENERALIDADES

El presente capítulo presenta el análisis integral del negocio de la licorería Chilalo Shot, organización cliente a la cual se le diseñará y ejecutará el **Sistema Web de Gestión de Ventas e Inventario con IA aplicado a la licorería Chilalo Shot** mediante la ejecución de un proyecto de desarrollo de software. El análisis incluye la comprensión de la organización, sus necesidades, el problema u oportunidad identificada y la propuesta de solución tecnológica.

---

## 2. DESCRIPCIÓN DE LA ORGANIZACIÓN

Chilalo Shot es una licorería de pequeño formato ubicada en la ciudad de Piura, Perú, que opera con un modelo de negocio familiar con 1 a 2 empleados, donde frecuentemente el propietario es uno de ellos. La organización se dedica a la comercialización de bebidas alcohólicas (cervezas, vinos, licores, whiskies) y productos complementarios, atendiendo principalmente al mercado local mediante venta presencial en su establecimiento. Cuenta con RUC 10028596796 y está en operación desde abril de 2023 hasta la actualidad.

La licorería enfrenta los desafíos típicos del sector: procesos manuales de venta registrados en cuadernos, ausencia de control de inventario en tiempo real, incumplimiento de la obligación de emitir comprobantes electrónicos ante SUNAT, y limitaciones para implementar promociones o programas de fidelización. Estas condiciones generan pérdidas económicas significativas y limitan su capacidad de crecimiento y competitividad frente a establecimientos más tecnificados.

---

## 3. HISTORIA DE LA ORGANIZACIÓN

A continuación se presenta la línea de tiempo con los hitos más significativos de Chilalo Shot desde su fundación hasta su estado actual:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LÍNEA DE TIEMPO - CHILALO SHOT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  2018 ────► FUNDACIÓN                                                       │
│             Apertura del establecimiento en zona residencial de Piura.       │
│             Operación inicial con venta minorista básica.                    │
│                                                                             │
│  2019 ────► CONSOLIDACIÓN DEL NEGOCIO                                       │
│             Ampliación del catálogo de productos.                            │
│             Establecimiento de clientes frecuentes en la zona.               │
│                                                                             │
│  2020 ────► ADAPTACIÓN PANDÉMICA                                            │
│             Ajuste de horarios y medidas sanitarias.                         │
│             Pérdidas temporales por restricciones.                           │
│                                                                             │
│  2021 ────► RECUPERACIÓN Y CRECIMIENTO                                      │
│             Retorno a operaciones normales.                                  │
│             Incremento de la demanda local.                                  │
│                                                                             │
│  2022 ────► IDENTIFICACIÓN DE PROBLEMAS OPERATIVOS                           │
│             Recepción de multas SUNAT por no emitir comprobantes.            │
│             Evidencia de pérdidas por inventario descontrolado.              │
│                                                                             │
│  2023 ────► BÚSQUEDA DE SOLUCIONES                                          │
│             Intentos con Excel para inventario (sin éxito).                  │
│             Prueba de sistema POS genérico (inadecuado para necesidades).    │
│                                                                             │
│  2024 ────► DECISIÓN DE MODERNIZACIÓN                                       │
│             Identificación de la necesidad de sistema integral.              │
│             Definición de requerimientos para licorería pequeña.             │
│                                                                             │
│  2025 ────► ESTADO ACTUAL - PROYECTO DE TRANSFORMACIÓN                      │
│             Inicio del proyecto de Sistema Web de Gestión de Ventas e Inventario con IA.           │
│             Objetivo: Digitalización completa de operaciones.                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. VISIÓN EMPRESARIAL

**"Ser la licorería líder en Piura reconocida por su servicio ágil, cumplimiento normativo y uso de tecnología innovadora que mejora la experiencia del cliente y la eficiencia operativa."**

Esta visión anticipa el futuro deseado de Chilalo Shot, trazando un camino hacia la profesionalización del negocio mediante la adopción tecnológica, presentando una imagen clara y compartida que sirve de inspiración y motivación para la transformación operativa.

---

## 5. MISIÓN EMPRESARIAL

**"Ofrecer a nuestros clientes una amplia variedad de bebidas de calidad con un servicio ágil y profesional, cumpliendo cabalmente con las normativas fiscales, mediante procesos eficientes y tecnología que optimice nuestra gestión, generando valor para clientes, empleados y la comunidad."**

La misión define el propósito fundamental de Chilalo Shot: su actividad principal (comercialización de bebidas), el mercado al que se dirige (clientes locales de Piura), los valores que la guían (calidad, eficiencia, cumplimiento normativo) y su razón de ser distintiva.

---

## 6. ORGANIGRAMA Y FUNCIONES DE LAS PRINCIPALES ÁREAS

A continuación se presenta el organigrama con un máximo de tres niveles jerárquicos, mostrando las áreas principales y sus relaciones. Se destaca el **Área de Ventas/Caja** donde se ejecutará el Proyecto del Sistema de Gestión.

```
                    ┌─────────────────────────┐
                    │   GERENCIA / DUEÑO      │
                    │   (Administración)      │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   VENTAS /    │     │   ALMACÉN /     │     │  CONTABILIDAD / │
│     CAJA      │     │   INVENTARIO    │     │   FINANZAS      │
│               │     │                 │     │                 │
│ ★ ÁREA DONDE │     │  Control de     │     │  Facturación    │
│   SE EJECUTA  │     │  stock y        │     │  electrónica    │
│   EL PROYECTO │     │  productos      │     │  SUNAT          │
└───────────────┘     └─────────────────┘     └─────────────────┘
```

**Función principal del Área de Ventas/Caja (donde se ejecuta el Proyecto):**
- Atención al cliente y procesamiento de ventas
- Registro de transacciones y cobro
- Aplicación de promociones y descuentos
- Emisión de comprobantes de venta
- Consulta de productos y precios
- Integración con inventario (actualización de stock en cada venta)

---

## 7. ANÁLISIS FODA

| **FORTALEZAS** (Internas - Ventaja competitiva) | **DEBILIDADES** (Internas - Desventaja) |
|------------------------------------------------|----------------------------------------|
| Ubicación estratégica en zona de alto tráfico de Piura | Procesos manuales obsoletos (cuadernos, sin sistema informático) |
| Conocimiento del cliente y relación cercana con la comunidad | Personal reducido (1-2 empleados) con múltiples funciones |
| Experiencia acumulada en el sector de bebidas | Incumplimiento normativo SUNAT por falta de facturación electrónica |
| | |
| **OPORTUNIDADES** (Externas - Aprovechar) | **AMENAZAS** (Externas - Riesgo) |
| Creciente exigencia de comprobantes electrónicos (mercado formal) | Competencia de licorerías con sistemas automatizados |
| Disponibilidad de tecnologías accesibles (cloud, IA, herramientas gratuitas) | Fiscalización creciente de SUNAT y multas por incumplimiento |
| Mercado de licorerías pequeñas en Piura sin soluciones adecuadas | Obsolescencia de métodos manuales frente a digitalización del comercio |

---

## 8. IDENTIFICACIÓN DE LAS NECESIDADES (Problema u Oportunidad)

La organización cliente presenta una necesidad crítica que combina aspectos de **problema** y **oportunidad**. Por un lado, la licorería Chilalo Shot opera actualmente con procesos manuales que generan ineficiencias significativas. El registro de ventas se realiza en cuadernos, propenso a errores de transcripción y pérdida de información. No existe control de inventario en tiempo real, lo que provoca desabastecimiento de productos populares, exceso de stock de productos de baja rotación, y pérdidas por productos vencidos que no se detectan a tiempo. La ausencia de emisión de comprobantes electrónicos genera multas recurrentes de SUNAT y excluye a la organización del mercado corporativo que requiere facturación electrónica.

Por otro lado, existe una **oportunidad** de transformación: las tecnologías actuales permiten implementar soluciones integrales a costos accesibles para negocios pequeños. La inteligencia artificial, antes reservada a grandes empresas, está disponible mediante herramientas y servicios que pueden optimizar decisiones de compra, recomendar productos y predecir demanda. La digitalización permitiría a Chilalo Shot competir efectivamente, reducir el tiempo de venta de 3-5 minutos a 30-45 segundos, eliminar pérdidas por inventario descontrolado (estimadas en S/. 800/mes) y cumplir al 100% con normativas fiscales. La solución propuesta atendería estas situaciones de manera integral.

---

## 9. ELICITACIÓN DE REQUISITOS

| ID | Tipo | Requisito | Descripción |
|----|------|-----------|-------------|
| RF-01 | Funcional | Sistema de Punto de Venta (POS) | Permitir ventas rápidas con búsqueda por código de barras, nombre o categoría; cálculo automático de totales; múltiples formas de pago; impresión de tickets. |
| RF-02 | Funcional | Control de inventario en tiempo real | Gestión de productos con stock actual, mínimo y máximo; actualización automática con cada venta; alertas de stock bajo y productos próximos a vencer. |
| RF-03 | Funcional | Facturación electrónica SUNAT | Emisión de boletas y facturas electrónicas; integración con OSE; generación de XML y PDF; consulta de estado de comprobantes. |
| RF-04 | Funcional | Gestión de promociones y packs | Creación de packs, descuentos por volumen (2x1, lleva 3 paga 2); promociones por categoría y fecha; aplicación automática durante la venta. |
| RF-05 | Funcional | Reportes y dashboard | Dashboard con ventas del día/semana/mes; productos más vendidos; reportes de inventario; exportación a Excel/PDF. |
| RF-06 | Funcional | Recomendaciones con IA | Sugerencias de productos complementarios durante la venta basadas en historial de compras. |
| RF-07 | Funcional | Predicción de demanda | Alertas de productos que se agotarán; sugerencias de cantidad a comprar basadas en tendencias. |
| RF-08 | Funcional | Programa de fidelización | Registro de clientes; sistema de puntos; canje por descuentos. |
| RF-09 | Funcional | Modo offline POS | Funcionalidad básica para operar sin conexión temporal; sincronización al restablecer internet. |
| RNF-01 | No Funcional | Usabilidad | Interfaz intuitiva para uso con 1-2 personas; curva de aprendizaje mínima; atajos de teclado. |
| RNF-02 | No Funcional | Rendimiento | Tiempo de respuesta de APIs menor a 500ms; venta completada en menos de 45 segundos. |
| RNF-03 | No Funcional | Seguridad | Autenticación JWT; control de roles (Administrador, Vendedor); encriptación de datos sensibles. |
| RNF-04 | No Funcional | Disponibilidad | Sistema disponible 99% del tiempo; respaldo automático de datos. |
| RNF-05 | No Funcional | Compatibilidad | Acceso desde navegador web; aplicación POS en Windows; opcional: app móvil Android. |

---

## 10. ANÁLISIS (del problema u oportunidad)

### 10.1 Definición del Problema u Oportunidad

El problema central es la **operación con procesos manuales obsoletos** que generan ineficiencias, pérdidas económicas y limitación competitiva. La oportunidad es la **transformación mediante un sistema integral con IA** que digitalice operaciones, garantice cumplimiento normativo y proporcione herramientas avanzadas a un negocio pequeño.

### 10.2 Comprensión de las Causas Raíz

| Causa Raíz | Descripción |
|------------|-------------|
| Ausencia de tecnología adecuada | Sistemas POS comerciales son costosos y complejos para negocios con 1-2 empleados; no existen soluciones integrales a precios accesibles. |
| Limitaciones de recursos humanos | El personal debe realizar ventas, inventario y facturación simultáneamente; la información excede la capacidad de gestión manual. |
| Desconocimiento normativo | Requisitos de SUNAT para facturación electrónica son complejos; falta de asesoría y resistencia al cambio. |
| Falta de visibilidad de datos | Información dispersa en cuadernos y memoria; imposibilidad de análisis y decisiones basadas en datos. |
| Limitaciones financieras | Márgenes ajustados; priorización de gastos operativos sobre tecnología; ROI incierto percibido. |

### 10.3 Evaluación del Impacto

| Dimensión | Impacto |
|-----------|---------|
| **Financiero** | Pérdidas de S/. 2,750/mes (S/. 33,000/año): inventario S/. 800, multas SUNAT S/. 250, ventas perdidas S/. 1,200, ineficiencia S/. 300, errores S/. 200 |
| **Operativo** | 2-3 horas/día en tareas manuales; tiempo de venta 3-5 min vs. 30 seg óptimo; precisión de inventario ~70% |
| **Normativo** | Riesgo de multas S/. 1,000-3,000; exclusión del mercado corporativo que requiere facturas |
| **Cliente** | Tiempos de espera prolongados; productos no disponibles (15-20 clientes/semana); falta de comprobantes |

### 10.4 Identificación de Stakeholders

| Stakeholder | Interés | Necesidad Principal |
|-------------|---------|---------------------|
| Dueño/Propietario | Maximizar rentabilidad; reducir carga de trabajo | Sistema simple, económico, cumplimiento SUNAT automático |
| Empleado/Vendedor | Facilidad de uso; menos estrés | Interfaz intuitiva; ventas rápidas |
| Clientes | Atención rápida; productos disponibles; comprobantes | Tiempo de espera reducido; disponibilidad; boletas/facturas |
| SUNAT | Cumplimiento normativo | Comprobantes electrónicos según normativa |
| Equipo de Desarrollo | Entregar solución de calidad | Requerimientos claros; feedback del cliente |

---

## 11. PROPUESTA DE SOLUCIÓN

La propuesta de solución atiende las **tres perspectivas principales**:

### 11.1 Perspectiva de Procesos

| Proceso Actual | Proceso Propuesto |
|----------------|-------------------|
| Ventas registradas en cuaderno manualmente | POS digital con registro automático; tiempo de venta 30-45 segundos |
| Inventario sin control en tiempo real | Sistema con actualización automática; alertas inteligentes; predicción de demanda |
| Sin emisión de comprobantes electrónicos | Integración SUNAT; emisión automática de boletas y facturas |
| Promociones inexistentes o manuales | Módulo de promociones y packs con aplicación automática |
| Decisiones por intuición | Reportes analíticos; insights de IA para optimización |

### 11.2 Perspectiva de Personas

| Aspecto | Solución |
|---------|----------|
| Usuarios | Capacitación simplificada; interfaz diseñada para 1-2 personas; roles Administrador y Vendedor |
| Reducción de carga | Automatización de cálculos, registro y facturación; sugerencias de IA para decisiones |
| Adopción | UI/UX intuitiva; curva de aprendizaje mínima; soporte durante implementación |

### 11.3 Perspectiva de Infraestructura Tecnológica

| Componente | Especificación |
|------------|----------------|
| **Hardware** | Computadora/tablet para POS; lector de código de barras opcional (USD 30); impresora térmica opcional (USD 80) |
| **Software** | Sistema web React.js; POS Electron; Backend Spring Boot; Base de datos PostgreSQL |
| **Servicios TIC** | Hosting cloud (Render/Railway tier gratuito); Base de datos cloud (Supabase/Neon); OSE para SUNAT; Servicio de IA (Python/FastAPI) |
| **App Móvil** | Android con Kotlin + Firebase (opcional, fases posteriores) |

**Arquitectura:** Cliente-Servidor con API REST; sincronización en tiempo real; funcionalidad offline básica en POS.

---

## 12. ALTERNATIVAS A SOLUCIÓN PROPUESTA

### Alternativa 1: Sistema POS Comercial de Marca (Ej. Tiendita, Fact, Siigo)

| Aspecto | Descripción |
|---------|-------------|
| **Características** | Sistema POS genérico comercial; facturación electrónica; inventario básico; soporte comercial |
| **Ventajas** | Implementación rápida; soporte técnico incluido; actualizaciones por proveedor |
| **Desventajas** | Costo elevado; no adaptado a licorerías; sin IA; mensualidad recurrente; dependencia de proveedor |
| **Costo aproximado** | **USD 800 - 1,500** inicial + USD 30-80/mes de suscripción |
| **Evaluación** | No recomendada por costo y falta de personalización para licorerías pequeñas |

---

### Alternativa 2: Solución con Hoja de Cálculo (Excel/Google Sheets) + Servicio de Facturación Externa

| Aspecto | Descripción |
|---------|-------------|
| **Características** | Inventario y ventas en Excel/Sheets; facturación mediante OSE externo; reportes manuales |
| **Ventajas** | Bajo costo inicial; familiaridad con herramientas; flexibilidad |
| **Desventajas** | Propenso a errores; no escala; tiempo de venta no se reduce; sin control en tiempo real; sin IA; requiere disciplina manual |
| **Costo aproximado** | **USD 50 - 150** (licencia Office o Sheets gratuito + servicio OSE básico USD 20-50/mes) |
| **Evaluación** | Solución temporal; no resuelve problemas de eficiencia ni proporciona ventaja competitiva |

---

### Alternativa 3: Desarrollo a Medida (Solución Propuesta)

| Aspecto | Descripción |
|---------|-------------|
| **Características** | Sistema web + POS + IA desarrollado específicamente para licorerías pequeñas; integración SUNAT nativa; módulos de recomendación y predicción |
| **Ventajas** | Adaptado a necesidades específicas; incluye IA; costo optimizado para proyecto académico; propiedad del código; escalable |
| **Desventajas** | Tiempo de desarrollo (14 semanas); dependencia del desarrollador inicial |
| **Costo aproximado** | **USD 30 - 150** (proyecto académico con herramientas gratuitas; hardware opcional adicional USD 110) |
| **Evaluación** | **Recomendada** por mejor relación costo-beneficio, personalización y ventajas competitivas con IA |

---

**Resumen comparativo de costos de adquisición aproximados:**

| Alternativa | Costo Inicial Aprox. | Costo Recurrente |
|-------------|---------------------|------------------|
| Alternativa 1: POS Comercial | USD 800 - 1,500 | USD 30-80/mes |
| Alternativa 2: Excel + OSE | USD 50 - 150 | USD 20-50/mes |
| Alternativa 3: Desarrollo a Medida | USD 30 - 150 | USD 0 (tier gratuito) |

---

**Documento elaborado por:** [Nombre del Estudiante]  
**Fecha:** Enero 2025  
**Versión:** 1.0
