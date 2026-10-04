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
- **Capítulo II - Planificación del Proyecto:** Contiene el enfoque de gestión (Scrum) y ciclo de vida (Cascada para modelado), justificación del enfoque híbrido, arquitectura del software, modelos/artefactos a aplicar, y la planificación detallada: enunciado de alcance (EAP), objetivos, beneficios, cronograma, interesados, supuestos, restricciones, factores críticos de éxito, riesgos y matriz de comunicaciones.

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

## 12. FACTIBILIDAD DEL PROYECTO

La factibilidad del proyecto es la evaluación de si este puede ser llevado a cabo de manera exitosa. Se basa en tres pilares fundamentales: la disponibilidad de recursos tecnológicos (factibilidad técnica), la capacidad de las personas y la organización para asimilar la solución (factibilidad operativa) y la rentabilidad frente a costos y beneficios (factibilidad económica). A continuación se desarrolla cada pilar y, al final, una conclusión integral que sustenta la toma de decisiones estratégicas.

---

### 12.1 Recursos tecnológicos actuales y factibilidad técnica

**Evaluación de los recursos tecnológicos**

Se analiza si la organización cuenta con las herramientas, software, hardware e infraestructura tecnológica necesarias para ejecutar el proyecto:

| Recurso / Aspecto | Estado actual en Chilalo Shot | ¿Permite ejecutar el proyecto? |
|-------------------|-------------------------------|--------------------------------|
| **Herramientas (software de usuario)** | Uso de Windows; sin sistema de gestión actual. | **Sí.** Cliente web y POS con Electron son compatibles con Windows; no se requieren licencias adicionales de oficina. |
| **Software (plataforma)** | Sin servidores ni infraestructura propia. | **Sí.** Solución en la nube (Render, Supabase/Neon) elimina necesidad de servidores locales; stack React, Spring Boot, PostgreSQL y FastAPI se alojan en servicios cloud de tier gratuito. |
| **Hardware** | 1 PC o laptop en el establecimiento; posibilidad de tablet. | **Sí.** El sistema corre en equipo estándar; opcional: lector de código de barras (USD 30) e impresora térmica (USD 80). |
| **Infraestructura tecnológica** | Conectividad internet en zona urbana de Piura (residencial o comercial). | **Sí.** Suficiente para sistema web y sincronización con SUNAT; el POS incluye modo offline para cortes breves. |
| **Integración con terceros** | Requiere OSE para facturación electrónica SUNAT. | **Sí.** OSE disponibles en el mercado (Nubefact, Fact, etc.) con APIs documentadas; integración técnica estándar. |

**Identificación de riesgos tecnológicos**

Se anticipan posibles dificultades o limitaciones tecnológicas durante la ejecución del proyecto:

| Riesgo tecnológico | Descripción | Mitigación |
|--------------------|-------------|------------|
| **Cortes de internet prolongados** | Sin conexión, la facturación electrónica y la sincronización se retrasan. | Modo offline en POS; cola de comprobantes para emitir al restablecer conexión; uso de datos móviles como respaldo. |
| **Cambios en APIs de SUNAT o OSE** | Actualizaciones normativas o del proveedor OSE pueden requerir ajustes en el sistema. | Diseño modular de integración; documentación de APIs; plan de pruebas ante actualizaciones. |
| **Límites de tier gratuito en cloud** | Servicios gratuitos pueden tener cuotas de uso o disponibilidad limitada. | Monitoreo de uso; plan de migración a plan de pago bajo si crece el volumen; alternativas (Railway, Neon) ya identificadas. |
| **Falla de equipo en punto de venta** | PC o laptop dañada impide operar el POS. | Sistema accesible desde navegador; posibilidad de usar otro dispositivo temporalmente; respaldo de datos en la nube. |

**Conclusión técnica:** La organización cuenta con los recursos tecnológicos necesarios para ejecutar el proyecto, y los riesgos tecnológicos identificados son manejables con las mitigaciones propuestas. La factibilidad técnica es **alta**.

---

### 12.2 Recursos humanos y factibilidad operativa

**Evaluación de las habilidades de los colaboradores**

Se analiza si el personal posee las habilidades y conocimientos técnicos necesarios para asimilar la solución:

| Colaborador | Habilidades actuales | Necesidad para el sistema | Valoración |
|-------------|----------------------|---------------------------|------------|
| **Dueño / Administrador** | Gestión del negocio, venta, manejo básico de PC/celular. | Uso del POS, reportes, configuración básica, emisión de comprobantes. | **Adecuada.** La interfaz se diseña para usuarios no técnicos; capacitación corta y documentación permiten asimilar la solución. |
| **Empleado / Vendedor** | Atención al cliente, venta presencial, uso de cuaderno o calculadora. | Registro de ventas en POS, consulta de precios y stock, aplicación de promociones. | **Adecuada.** Tareas acotadas; curva de aprendizaje mínima (RNF-01); soporte en puesta en marcha. |

No se requieren conocimientos de programación ni administración de sistemas; el equipo de desarrollo asume el despliegue y el soporte técnico inicial.

**Análisis de la estructura organizacional**

Se evalúa si la estructura actual de la empresa es adecuada para el desarrollo e implementación del proyecto:

| Aspecto estructural | Situación en Chilalo Shot | Adecuación al proyecto |
|--------------------|---------------------------|-------------------------|
| **Tamaño** | 1–2 personas (Gerencia/Dueño y Ventas/Caja). | **Adecuada.** El sistema está dimensionado para pocos usuarios; no se requieren múltiples áreas ni jerarquías complejas. |
| **Roles** | Dueño asume administración y supervisión; vendedor atiende caja y ventas. | **Adecuada.** Los roles del sistema (Administrador, Vendedor) se alinean con la estructura actual; no exige reestructuración. |
| **Área de impacto** | Ventas/Caja como área donde se ejecuta el proyecto (según organigrama, §6). | **Adecuada.** La intervención se concentra en una sola área, lo que facilita la coordinación y el seguimiento. |
| **Toma de decisiones** | Centralizada en el dueño. | **Adecuada.** Facilita la aprobación del proyecto, la asignación de tiempo a capacitación y la adopción del cambio. |

**Evaluación de procesos, actividades y tareas impactadas por la solución**

| Proceso / Actividad / Tarea | Situación actual | Impacto de la solución |
|-----------------------------|------------------|-------------------------|
| **Registro de ventas** | Anotación manual en cuaderno; cálculo manual de totales. | Sustituido por POS digital; registro automático; tiempo de venta reducido de 3–5 min a 30–45 s. |
| **Consulta de precios y stock** | Memoria o búsqueda manual; sin visibilidad en tiempo real. | Consulta inmediata en POS; alertas de stock bajo; sugerencias de productos (IA). |
| **Emisión de comprobantes** | No se emiten o se hace de forma irregular; multas SUNAT. | Emisión electrónica integrada; cumplimiento normativo automático. |
| **Control de inventario** | Inexistente o en Excel disperso; sin alertas. | Inventario en tiempo real; alertas y predicción de demanda; reportes de productos próximos a vencer. |
| **Aplicación de promociones** | Manual o inexistente. | Módulo de promociones y packs; aplicación automática en la venta. |
| **Reportes y análisis** | No hay reportes sistemáticos; decisiones por intuición. | Dashboard y reportes exportables; insights para compras y ventas. |

Las tareas impactadas son las que hoy generan mayor carga y error; la solución las simplifica o automatiza, lo que favorece la adopción por parte del personal.

**Conclusión operativa:** Los colaboradores tienen el perfil adecuado para asimilar la solución con capacitación y soporte acotados; la estructura organizacional es adecuada para el proyecto y no requiere cambios; los procesos impactados son precisamente los que se buscan mejorar. La factibilidad operativa es **alta**.

---

### 12.3 Análisis costo-beneficio y factibilidad económica

**¿El proyecto es rentable según el diseño de la solución?**

Sí. Con el diseño de solución propuesto (desarrollo a medida, stack en la nube con tiers gratuitos e integración SUNAT), el proyecto es **rentable**: los beneficios esperados superan ampliamente los costos y el retorno de la inversión se produce en un plazo muy corto.

**Análisis de costos**

Presupuesto detallado de todos los costos asociados al proyecto:

| Rubro | Concepto | Costo estimado (USD) | Notas |
|-------|----------|----------------------|-------|
| **Software** | Licencias de desarrollo y producción | 0 | React, Spring Boot, PostgreSQL, FastAPI; código abierto. |
| **Software** | Hosting y base de datos cloud | 0 | Tier gratuito (Render, Supabase/Neon). |
| **Software** | OSE / facturación electrónica SUNAT | 0–30/mes | Según proveedor; existen opciones gratuitas o de bajo costo. |
| **Equipos** | Uso de PC/laptop existente | 0 | No se exige equipo nuevo. |
| **Equipos** | Lector de código de barras (opcional) | 30 | Una sola vez. |
| **Equipos** | Impresora térmica (opcional) | 80 | Una sola vez. |
| **Otros** | Dominio, certificado (opcional) | 10–20 | Una sola vez. |
| **Mano de obra** | Desarrollo | 0 | Proyecto académico. |
| **Capacitación** | Tiempo del personal | In kind | 1–2 sesiones cortas; asumido por el negocio. |
| **Total inicial (escenario típico)** | | **30–150** | Aprox. S/. 120–600. |
| **Total recurrente (mensual)** | | **0–30** | Según OSE elegido. |

**Análisis de beneficios**

Estimación de los beneficios esperados, tangibles e intangibles:

| Tipo | Beneficio | Estimación (anual) / Descripción |
|------|-----------|-----------------------------------|
| **Tangible** | Reducción de pérdidas por inventario descontrolado | S/. 9,600 |
| **Tangible** | Evitar multas SUNAT por falta de comprobantes | S/. 3,000 |
| **Tangible** | Ventas recuperadas por menor desabastecimiento | S/. 14,400 |
| **Tangible** | Ganancia por mayor eficiencia y menos errores | S/. 6,000 |
| **Tangible** | **Total beneficios tangibles estimados** | **S/. 33,000/año** |
| **Intangible** | Cumplimiento normativo y menor estrés fiscal | Mejor relación con SUNAT; tranquilidad operativa. |
| **Intangible** | Imagen de negocio formal y tecnificado | Atractivo para clientes corporativos y exigentes. |
| **Intangible** | Decisiones basadas en datos (reportes, IA) | Mejor compra y surtido; menor desperdicio. |
| **Intangible** | Experiencia del cliente (menor tiempo de espera) | Mayor satisfacción y posible fidelización. |

**Cálculo costo-beneficio y viabilidad financiera**

| Indicador | Cálculo | Resultado |
|-----------|---------|-----------|
| **Costo total de implementación (máximo)** | USD 150 ≈ S/. 600 | Inversión única acotada. |
| **Beneficios anuales (tangibles)** | Según análisis de impacto (§10.3) | S/. 33,000/año |
| **Relación beneficio/costo (año 1)** | 33,000 / 600 | **55:1** (los beneficios son 55 veces el costo inicial en el primer año). |
| **Periodo de recuperación (payback)** | 600 / (33,000/12) | **Menos de 1 mes**. |
| **Viabilidad financiera** | Beneficios > Costos; payback muy corto | **Viable.** El proyecto es financieramente rentable. |

**Conclusión económica:** El análisis de costos, beneficios y la relación costo-beneficio demuestran que el proyecto es **rentable** y **financieramente viable**. La inversión es baja y los beneficios tangibles e intangibles justifican la implementación desde el punto de vista económico.

---

### Conclusión de la factibilidad del proyecto

En conjunto, la factibilidad del proyecto es un análisis integral que permite determinar si es **posible** (recursos tecnológicos suficientes y riesgos manejables), **viable** (personas y estructura organizacional adecuadas, procesos impactados de forma positiva) y **rentable** (beneficios que superan claramente los costos). Para el Sistema de Gestión de Ventas e Inventario con IA de Chilalo Shot, las tres dimensiones —técnica, operativa y económica— son favorables. Por tanto, **el proyecto es factible** y esta evaluación constituye una herramienta fundamental para la toma de decisiones estratégicas en la gestión del proyecto.

---

## 13. ALTERNATIVAS A SOLUCIÓN PROPUESTA

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

# CAPÍTULO II: PLANIFICACIÓN DEL PROYECTO

## 2.1 Enfoque de Gestión del Proyecto y del Ciclo de Vida a Aplicar

Para el éxito del **Sistema Web de Gestión de Ventas e Inventario con IA aplicado a la licorería Chilalo Shot**, se ha determinado una estrategia dual que separa claramente la capa de administración del proyecto de la capa de ingeniería del producto.

### A. Gestión del Proyecto: Marco de Trabajo Scrum

La administración de los recursos, el control del cronograma y la interacción con los interesados se regirá estrictamente bajo Scrum. Este marco gestionará la incertidumbre de los tiempos y la priorización de entregables.

- **Ciclo de Trabajo:** Se operará en iteraciones fijas (Sprints) de 2 semanas.
- **Control de Avance:** Se utilizarán los artefactos de gestión Product Backlog (Pila de Producto) y Sprint Backlog para monitorear el progreso de las tareas.
- **Roles de Gestión:**
  - **Product Owner:** Representante del Dueño/Propietario de Chilalo Shot, encargado de maximizar el valor del negocio y priorizar funcionalidades (POS, inventario, facturación SUNAT, promociones, IA).
  - **Scrum Master:** Facilitador encargado de eliminar impedimentos administrativos y asegurar el flujo del equipo de desarrollo.

### B. Modelado e Ingeniería del Software: Metodología en Cascada (Waterfall)

La construcción técnica del software, específicamente el análisis, diseño y arquitectura de datos, seguirá un enfoque lineal y secuencial (Cascada). Dado que el sistema maneja transacciones de venta, integración con SUNAT y reglas de negocio críticas (precios, descuentos, stock), no se permite la improvisación en la estructura de datos.

- **Secuencialidad del Modelado:** No se iniciará la programación (fase de Codificación) de ningún módulo hasta que su Modelo de Base de Datos y Diagrama de Clases hayan sido finalizados y validados.
- **Ciclo de Ingeniería:** Requisitos → Análisis → Diseño (Modelado) → Implementación → Pruebas.

---

## 2.2 Justificación del Enfoque del Proyecto a Aplicar

La selección de este enfoque híbrido responde directamente a la necesidad de satisfacer los objetivos estratégicos del negocio de Chilalo Shot. La metodología no es un fin, sino el medio para asegurar la rentabilidad y la sostenibilidad de la licorería.

### 1. Alineación con la Sostenibilidad Financiera (Reducción de Pérdidas y Cumplimiento SUNAT)

El negocio requiere flujo de caja constante; las multas SUNAT y las pérdidas por inventario impactan la operatividad.

- **Justificación de Negocio:** El uso de Scrum permite priorizar en los primeros Sprints el desarrollo del **Módulo de Punto de Venta (POS)** y del **Módulo de Facturación Electrónica SUNAT**. En lugar de esperar varios meses por un sistema completo (como en un enfoque 100% Cascada), el Dueño tendrá en un plazo acotado una herramienta funcional para registrar ventas y emitir comprobantes, acelerando el Retorno de Inversión (ROI) y reduciendo el riesgo de multas tempranamente.

### 2. Alineación con la Integridad de Datos y Cumplimiento Normativo

La relación con SUNAT y la trazabilidad de ventas e inventario dependen de la precisión de la información. Un error en comprobantes o en stock puede derivar en sanciones o pérdidas.

- **Justificación de Negocio:** El uso de Waterfall para el Modelado garantiza la integridad de los datos. Al diseñar la base de datos de manera secuencial y rigurosa antes de programar, se asegura que las transacciones de venta, el stock y la facturación electrónica sean coherentes y cumplan con la normativa. Esto protege la imagen del negocio frente a clientes y SUNAT, evitando sanciones y rechazos de comprobantes.

### 3. Alineación con la Eficiencia Operativa (Reducción de Costos y Carga Administrativa)

La licorería busca optimizar márgenes reduciendo la carga manual y el tiempo de venta.

- **Justificación de Negocio:** La gestión por Sprints (Scrum) permite identificar rápidamente qué procesos consumen más tiempo (ej. registro de ventas, consulta de precios, inventario) y enfocar los esfuerzos de desarrollo en automatizarlos primero. El modelado robusto (Waterfall) asegura que esta automatización sea escalable y no requiera correcciones costosas en el futuro, protegiendo la inversión (CapEx) y el tiempo de mantenimiento.

---

## 2.3 Arquitectura del Software a Utilizar

La arquitectura se define bajo el principio de diseño robusto (Waterfall) para soportar la gestión evolutiva (Scrum). Se utilizará una **Arquitectura en N-Capas** con el patrón **MVC (Modelo-Vista-Controlador)**.

| Capa del Sistema | Responsabilidad en la Ingeniería (Waterfall) | Tecnologías |
|------------------|----------------------------------------------|-------------|
| **Capa de Presentación (Vista)** | Interfaz de usuario. Se diseña al final del flujo de modelado. Debe ser intuitiva para garantizar la adopción del usuario (1-2 empleados). | React (Web responsive); POS con Electron |
| **Capa de Servicios (Controlador)** | Orquestación de peticiones. Valida la seguridad y formato de los datos antes de procesarlos. | API REST con Spring Boot (Java) |
| **Capa de Lógica de Negocio (Modelo)** | Núcleo del Modelado. Aquí residen las reglas de negocio (cálculo de totales, promociones, validación de stock). Se define estrictamente en la fase de diseño. | Java (Backend Spring Boot) |
| **Capa de Datos (Persistencia)** | Base del Sistema. El Modelo Entidad-Relación se congela antes de programar para asegurar integridad referencial (ACID). | PostgreSQL (cloud: Supabase/Neon) |
| **Capa de Servicios de IA (opcional)** | Recomendaciones y predicción de demanda. Se integra vía API. | Python / FastAPI (servicio desacoplado) |

---

## 2.4 Modelos y Artefactos a Aplicar

Se distinguen los artefactos según su propósito: **Gestión (Scrum)** o **Ingeniería (Waterfall)**.

### Artefactos de Ingeniería y Modelado (Waterfall)

Estos documentos definen la estructura inamovible del software.

1. **Diagrama de Clases (UML):** Plano técnico estático. Define las entidades (Producto, Venta, Cliente, Promoción, Comprobante, etc.) y sus relaciones estrictas. Es el "plano de construcción".
2. **Modelo Entidad-Relación (MER):** Diseño normalizado de la base de datos. Garantiza que no existan duplicidad de ventas, inconsistencias en el stock ni errores en la facturación electrónica.
3. **Diccionario de Datos:** Especificación detallada de cada campo (tipo de dato, longitud, restricciones) para asegurar la calidad de la información y la compatibilidad con SUNAT (tipos de documento, series, numeración).

### Artefactos de Gestión y Control (Scrum)

Estos documentos gestionan el avance del proyecto.

1. **Product Backlog (Pila de Producto):** Lista priorizada de necesidades del negocio (Historias de Usuario). Ej.: *"Como Dueño, quiero ver un reporte diario de ventas e ingresos"*; *"Como Vendedor, quiero registrar una venta en menos de 45 segundos"*.
2. **Sprint Backlog:** Lista de tareas técnicas a realizar en las próximas 2 semanas.
3. **Incremento:** La funcionalidad terminada y operativa entregada al final de cada Sprint (ej. POS básico, integración con OSE SUNAT).
4. **Burndown Chart:** Gráfico para medir la velocidad del equipo y proyectar el cumplimiento de fechas clave (entrega de módulos, go-live).

---

## 2.5 Planificación del Proyecto

La planificación del proyecto define cómo se ejecutará, controlará y cerrará el proyecto: alcance, objetivos, cronograma, beneficios, interesados, supuestos, factores críticos de éxito, riesgos y matriz de comunicaciones.

---

### 2.5.1 Enunciado de Alcance del Proyecto (EAP)

#### Descripción del Proyecto

El **Sistema Web de Gestión de Ventas e Inventario con IA aplicado a la licorería Chilalo Shot** es un producto de software que permitirá:

- Registrar ventas en un punto de venta (POS) digital con búsqueda por código de barras, nombre o categoría, cálculo automático de totales y múltiples formas de pago.
- Gestionar inventario en tiempo real: entradas y salidas, stock actual por producto, alertas de stock bajo y productos próximos a vencer; manejo de packs (sixpack, twelvepack) descomponiendo y registrando en unidades.
- Emitir boletas y facturas electrónicas integradas con SUNAT mediante OSE.
- Configurar y aplicar promociones, packs y descuentos por volumen de forma automática en la venta.
- Generar reportes y dashboard (ventas del día/semana/mes, productos más vendidos, inventario) con exportación a PDF y Excel.
- Ofrecer recomendaciones con IA (productos complementarios) y predicción de demanda para optimizar compras.
- Gestionar clientes y programa de fidelización (puntos, canje por descuentos).
- Operar en modo offline básico en el POS con sincronización al restablecer conexión.

#### Entregables

| Entregable | Descripción |
|------------|-------------|
| **Sitio web / aplicación** | Interfaz web adaptable (React); POS con Electron; gestión completa de inventario (unidades y packs); módulo de ventas; facturación electrónica; promociones; reportes; seguridad (JWT, roles). |
| **Documentación** | Manual de usuario para Dueño y Vendedor; guía técnica de despliegue; documentación de APIs. |
| **Base de datos** | Esquema en PostgreSQL (cloud); datos migrados o cargados iniciales según catálogo de Chilalo Shot. |

#### Exclusiones del Proyecto

- Diseño gráfico o identidad visual personalizada más allá de una interfaz limpia y usable.
- Integración con sistemas contables o ERP de terceros (fuera del alcance inicial).
- Soporte técnico post-lanzamiento más allá de 30 días desde la puesta en producción.
- Desarrollo de aplicación móvil para clientes finales (opcional en fases posteriores; el POS puede usarse en tablet/navegador).

#### Criterios de Aceptación

- Cumplimiento de los requisitos funcionales (RF-01 a RF-09) y no funcionales (RNF-01 a RNF-05) definidos en el Capítulo I.
- Compatibilidad con navegadores modernos (Chrome, Edge, Firefox) y con Windows para el POS.
- Seguridad: autenticación JWT, roles Administrador y Vendedor, encriptación de datos sensibles.
- Facilidad de uso validada por el Dueño y el empleado (curva de aprendizaje mínima).
- Documentación de usuario y técnica entregada y revisada.

#### Restricciones del Proyecto

- **Presupuesto:** Inversión acotada (aprox. USD 30–150 en escenario típico; proyecto académico con herramientas en tier gratuito).
- **Duración:** 14–15 semanas desde el inicio del desarrollo hasta la puesta en producción.
- **Equipo:** Equipo de desarrollo reducido (1–3 desarrolladores); el cliente (Chilalo Shot) aporta 1–2 usuarios para validación y capacitación.

---

### 2.5.2 Objetivos del Proyecto

#### Objetivo general

Desarrollar e implementar un sistema web y punto de venta con inteligencia artificial que permita a la licorería Chilalo Shot gestionar de manera integral las operaciones de venta, inventario y facturación electrónica, reduciendo pérdidas estimadas (S/. 33,000/año), cumpliendo normativas SUNAT y mejorando la eficiencia operativa en un plazo de 15 semanas.

#### Objetivos específicos

- Diseñar e implementar una interfaz de usuario intuitiva para el POS y el panel de administración, orientada a 1–2 usuarios con curva de aprendizaje mínima.
- Implementar el control de inventario en tiempo real con registro en unidades, soporte de packs (sixpack, twelvepack) y alertas de stock bajo y productos próximos a vencer.
- Integrar la emisión de boletas y facturas electrónicas con SUNAT mediante un OSE, garantizando cumplimiento normativo.
- Desarrollar el módulo de promociones y packs con aplicación automática en la venta y sugerencias de IA para productos complementarios.
- Entregar reportes y dashboard de ventas e inventario con exportación a PDF y Excel, y documentación de usuario y técnica.

---

### 2.5.3 Beneficios del Proyecto

1. **Reducción de tiempos:** Tiempo de venta reducido de 3–5 minutos a 30–45 segundos; reducción del tiempo diario en gestión manual (de 2–3 horas a aproximadamente 30 minutos).
2. **Reducción de costos y pérdidas:** Disminución de pérdidas por inventario descontrolado (objetivo: de S/. 800/mes a ~S/. 160/mes); eliminación o reducción drástica de multas SUNAT por falta de comprobantes electrónicos.
3. **Incremento de la capacidad operativa:** Mayor precisión del inventario (objetivo: de ~70% a 98%); ventas recuperadas por menor desabastecimiento (reducción estimada de S/. 1,200/mes a ~S/. 300/mes en ventas perdidas).
4. **Incremento de la calidad y satisfacción:** Cumplimiento normativo sostenido; imagen de negocio formal; mejor experiencia del cliente por menor espera y disponibilidad de comprobantes.
5. **Decisiones basadas en datos:** Reportes y predicción de demanda que permiten optimizar compras y surtido, reduciendo desperdicio y mejorando la rentabilidad.

---

### 2.5.4 Cronograma

A continuación se presenta una representación gráfica del tiempo estimado para las fases y hitos principales del proyecto. Las actividades se ejecutan en Sprints de 2 semanas, alineados con la gestión Scrum, manteniendo el modelado en cascada por módulo antes de la codificación.

```
CRONOGRAMA DEL PROYECTO — Sistema Chilalo Shot (14–15 semanas)
================================================================

Fase / Hito                          Semanas  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
------------------------------------------------------------------------------------------
Inicio y definición (alcance, EAP)    1      [==]
Modelado y diseño (BD, clases)        2      [======]
Sprint 1–2: POS básico + inventario   4            [================]
Sprint 3–4: Facturación SUNAT        4                  [================]
Sprint 5–6: Promociones + reportes   4                        [================]
Sprint 7:  IA, fidelización, ajustes  2                              [====]
Pruebas integradas y UAT              2                                    [====]
Despliegue y capacitación             1                                          [==]
Cierre y documentación               1                                            [==]
------------------------------------------------------------------------------------------
Hitos: ● Inicio  ● Diseño aprobado  ● POS operativo  ● SUNAT integrado  ● Go-live  ● Cierre
```

*Figura 1. Cronograma de alto nivel del proyecto (semanas). Cada bloque representa la duración estimada de la fase o del conjunto de Sprints indicados.*

---

### 2.5.5 Interesados (Stakeholders)

| Interesado | Rol en el proyecto | Interés principal |
|------------|-------------------|-------------------|
| **Dueño / Propietario (Chilalo Shot)** | Cliente y patrocinador; Product Owner en Scrum | Maximizar rentabilidad; cumplimiento SUNAT; sistema simple y útil |
| **Empleado / Vendedor** | Usuario final del POS y consultas de inventario | Facilidad de uso; ventas rápidas; menos carga manual |
| **Clientes de la licorería** | Beneficiarios indirectos | Atención ágil; productos disponibles; comprobantes cuando los requieran |
| **SUNAT** | Ente regulador | Cumplimiento de facturación electrónica según normativa |
| **Equipo de desarrollo** | Construcción del producto | Requerimientos claros; feedback oportuno; entregas en tiempo |

---

### 2.5.6 Supuestos

- El Dueño o un representante de Chilalo Shot tendrá disponibilidad para reuniones de seguimiento (al menos semanales) y para validar entregables en los plazos acordados.
- La conectividad a internet en el establecimiento será suficiente para el uso del sistema web y la comunicación con el OSE de SUNAT; los cortes serán esporádicos y cubiertos por el modo offline del POS.
- El proveedor OSE (Nubefact, Fact u otro) mantendrá APIs estables y compatibles con la normativa SUNAT vigente durante el periodo del proyecto.
- Los recursos de cloud en tier gratuito (Render, Supabase/Neon) serán suficientes para el volumen de transacciones esperado de Chilalo Shot (1–2 usuarios, ventas minoristas).
- El equipo de desarrollo dispondrá del tiempo y los recursos necesarios para cumplir los Sprints en 2 semanas según el plan.

---

### 2.5.7 Restricciones

- **Presupuesto:** Limitado a un rango aproximado de USD 30–150 (hardware opcional adicional); uso prioritario de software y servicios en tier gratuito.
- **Plazo:** 14–15 semanas desde el inicio del desarrollo hasta el go-live; no se contemplan extensiones significativas.
- **Recursos humanos:** Equipo de desarrollo reducido (1–3 personas); cliente con 1–2 personas para operación y validación.
- **Alcance técnico:** No se incluyen integraciones con contabilidad o ERP externos ni aplicación móvil nativa para clientes en la primera entrega.

---

### 2.5.8 Factores Críticos de Éxito (FCE)

1. **Cumplimiento de requisitos:** Entregar las funcionalidades acordadas (POS, inventario en unidades y packs, facturación SUNAT, promociones, reportes, IA básica) dentro del alcance definido en el EAP.
2. **Gestión eficaz del tiempo:** Respetar los Sprints de 2 semanas y los hitos de cronograma (diseño aprobado, POS operativo, integración SUNAT, go-live) para no retrasar el retorno de inversión del cliente.
3. **Comunicación eficaz:** Reuniones regulares con el Product Owner (Dueño); uso de la matriz de comunicaciones para informes y decisiones.
4. **Calidad del modelado:** Completar y validar el modelo de datos y el diseño por módulo antes de codificar, para evitar retrabajos y asegurar integridad de ventas e inventario.
5. **Adopción por el usuario:** Capacitación y documentación suficientes para que el Dueño y el Vendedor utilicen el sistema con confianza desde el primer día en producción.

---

### 2.5.9 Riesgos

Se utiliza el metalenguaje **Causa – Riesgo – Impacto** para describir los riesgos principales:

| Causa | Riesgo | Impacto |
|-------|--------|---------|
| Enfermedad o indisponibilidad prolongada de un miembro del equipo de desarrollo | Retraso en uno o más Sprints; entregables del módulo afectado se atrasan | Fecha de go-live se desplaza; posible reducción temporal de alcance |
| Cambios en APIs del OSE o en requisitos SUNAT durante el proyecto | Necesidad de ajustar integración de facturación electrónica | Retrabajo en el módulo SUNAT; posible retraso de 1–2 semanas |
| Falta de disponibilidad del Dueño para validar entregables | Aceptación retrasada; feedback tardío sobre usabilidad o requisitos | Iteraciones adicionales; riesgo de desalineación entre producto y expectativas |
| Cortes de internet frecuentes o prolongados en el establecimiento | Imposibilidad de emitir comprobantes en tiempo real; desconfianza en el sistema | Mitigación: modo offline y cola de comprobantes; se documenta uso con datos móviles de respaldo |
| Límites o indisponibilidad del tier gratuito de hosting o base de datos | Caída del servicio o imposibilidad de desplegar actualizaciones | Migración a plan de pago bajo o cambio de proveedor; se mantienen alternativas (Railway, Neon) identificadas |

---

### 2.5.10 Matriz de Comunicaciones

Define quién recibe qué información, con qué frecuencia y por cuál canal.

| Interesado | Información | Formato | Frecuencia | Responsable | Canal |
|------------|-------------|---------|------------|-------------|--------|
| Dueño / Cliente (Chilalo Shot) | Informes de avance; estado de entregables | PDF / reunión | Semanal | Gerente de proyecto / Scrum Master | Correo electrónico; reunión virtual |
| Equipo del proyecto | Seguimiento de tareas; impedimentos | Reunión | Semanal (Daily/ Sprint) | Scrum Master | Presencial / virtual |
| Patrocinador (Dueño) | Informes de hitos; decisión de go-live | PDF | Al cierre de cada hito (aprox. mensual) | Gerente de proyecto | Email; reunión |
| Equipo de desarrollo | Tareas del Sprint; definición de “hecho” | Plataforma / tablero | Diario (Sprint) | Product Owner / Scrum Master | Gestor de proyectos (ej. Jira, Trello, Notion) |
| Usuario final (Vendedor) | Capacitación; novedades del POS | Sesión / guía | Al incorporar módulo; según necesidad | Equipo de desarrollo | Presencial / videollamada; manual de usuario |
| OSE / Proveedor SUNAT | Consultas técnicas de integración | Documentación / correo | Según necesidad | Desarrollador backend | Email; documentación API |

---

**Documento elaborado por:** [Nombre del Estudiante]  
**Fecha:** Enero 2026  
**Versión:** 1.0
