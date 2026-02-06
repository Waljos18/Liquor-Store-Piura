# PRESENTACIÓN / EXPOSICIÓN
## Sistema Web de Gestión de Ventas e Inventario con IA – Licorería Chilalo Shot

**Código del proyecto:** PROY-LICOR-PIURA-2025-001  
**Fecha:** 2025

---

# SLIDE 1: DESCRIPCIÓN DE LA EMPRESA

## Chilalo Shot

**Chilalo Shot** es una licorería de pequeño formato ubicada en la ciudad de **Piura, Perú**, que opera con un modelo de negocio familiar con **1 a 2 empleados**, donde frecuentemente el propietario es uno de ellos.

- **RUC:** 10028596796
- **En operación:** Desde abril de 2023 hasta la actualidad.
- **Actividad:** Comercialización de bebidas alcohólicas (cervezas, vinos, licores, whiskies) y productos complementarios.
- **Mercado:** Atención principalmente al mercado local mediante venta presencial en su establecimiento.
- **Ubicación:** Zona residencial de Piura.
- **Áreas principales:** Gerencia/Administración, Ventas/Caja, Almacén/Inventario, Contabilidad/Finanzas.

La organización enfrenta los desafíos típicos del sector: procesos manuales, ausencia de control de inventario en tiempo real e incumplimiento de obligaciones con SUNAT.

---

# SLIDE 2: REDACCión DEL PROBLEMA

## Situación actual y necesidad

La licorería **Chilalo Shot** opera con **procesos manuales obsoletos** que generan ineficiencias y pérdidas económicas:

1. **Ventas:** Registro en cuadernos, propenso a errores; tiempo de venta de 3 a 5 minutos por transacción.
2. **Inventario:** Sin control en tiempo real; desabastecimiento, exceso de stock y pérdidas por productos vencidos (aprox. S/. 800/mes).
3. **Normativa:** No se emiten comprobantes electrónicos; multas recurrentes de SUNAT (aprox. S/. 250/mes) y exclusión del mercado que requiere facturación electrónica.
4. **Decisiones:** Información dispersa; imposibilidad de análisis y decisiones basadas en datos.

**Pérdidas estimadas:** S/. 2,750/mes (S/. 33,000/año) por inventario, multas, ventas perdidas, ineficiencia y errores.

**Oportunidad:** La tecnología y la IA permiten hoy soluciones integrales a costos accesibles para negocios pequeños como Chilalo Shot.

---

# SLIDE 3: TÍTULO DEL PROYECTO

## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Nombre formal:**  
*Sistema Web de Gestión de Ventas e Inventario con IA aplicado a la licorería Chilalo Shot*

**Código:** PROY-LICOR-PIURA-2025-001

**En una frase:**  
Desarrollo e implementación de un sistema web (y opcional app móvil) con inteligencia artificial para gestionar de forma integral ventas, inventario, facturación electrónica SUNAT, promociones y reportes en licorerías pequeñas de Piura.

---

# SLIDE 4: ALCANCE PRELIMINAR DEL PROYECTO

## Qué incluye el proyecto

| Módulo / Área | Alcance preliminar |
|---------------|---------------------|
| **Punto de venta (POS)** | Sistema POS web y/o desktop (Electron); búsqueda por código, nombre o categoría; múltiples formas de pago; impresión de tickets; modo offline básico. |
| **Inventario** | Gestión de productos, stock mínimo/máximo; actualización automática con cada venta; alertas de stock bajo y productos próximos a vencer. |
| **Facturación electrónica** | Integración con SUNAT vía OSE; emisión de boletas y facturas electrónicas; generación de XML y PDF. |
| **Promociones y packs** | Creación de packs, descuentos por volumen (2x1, lleva 3 paga 2); aplicación automática en la venta. |
| **Reportes y dashboard** | Ventas por día/semana/mes; productos más vendidos; reportes de inventario; exportación Excel/PDF. |
| **Inteligencia artificial** | Recomendaciones de productos complementarios; predicción de demanda y sugerencias de compra. |
| **Programa de fidelización** | Registro de clientes; sistema de puntos; canje por descuentos (según prioridad). |
| **App móvil Android** | Opcional; fases posteriores según tiempo y recursos. |

**Duración estimada:** 14 semanas (3.5 meses). **Recursos:** desarrollador único (practicante); herramientas y servicios en tier gratuito.

---

# SLIDE 5: RESULTADOS ESPERADOS DEL PROYECTO (SMART)

## Objetivos SMART

| Objetivo | Específico (S) | Medible (M) | Alcanzable (A) | Relevante (R) | Temporal (T) |
|----------|----------------|-------------|----------------|---------------|--------------|
| **1. Digitalización de ventas** | Reducir tiempo y errores en el proceso de venta mediante POS digital. | Tiempo de venta de 3–5 min → **30–45 seg** (reducción ~85%). | Con sistema POS e inventario integrado. | Menos colas y mejor atención al cliente. | Al final de la Fase de Construcción (semana 11). |
| **2. Cumplimiento SUNAT** | Automatizar emisión de comprobantes electrónicos integrados con SUNAT. | **100%** de ventas con comprobante electrónico; **0** multas por no emisión. | Con OSE y certificado digital del cliente. | Elimina multas (~S/. 250/mes) y permite facturar a empresas. | Integrado en Fase de Elaboración (semana 6). |
| **3. Control de inventario** | Reducir pérdidas por inventario descontrolado. | Pérdidas por inventario de S/. 800/mes → **≤ S/. 160/mes** (reducción ~80%). | Alertas y control en tiempo real. | Ahorro directo y menos productos vencidos. | Operativo con módulo de inventario y alertas. |
| **4. Decisiones con IA** | Ofrecer recomendaciones y predicción de demanda. | Reportes analíticos y al menos 2 funcionalidades de IA (recomendaciones + predicción/alertas). | Con datos históricos y modelos básicos. | Mejora compras y surtido. | Modelos básicos en Fase de Transición (semana 12). |

**Resumen cuantitativo:** Reducción ~85% en tiempo de venta, ~80% en pérdidas por inventario, eliminación de multas SUNAT por no emisión de comprobantes.

---

# SLIDE 6: SOLUCIÓN (PROPUESTA)

## Enfoque de la solución

La solución propuesta es un **desarrollo a medida** que cubre tres perspectivas:

| Perspectiva | Solución |
|-------------|----------|
| **Procesos** | POS digital (30–45 seg/venta), inventario en tiempo real con alertas, facturación electrónica SUNAT automática, promociones y packs, reportes e insights de IA. |
| **Personas** | Interfaz intuitiva para 1–2 usuarios; roles Administrador y Vendedor; capacitación mínima; automatización de cálculos y tareas repetitivas. |
| **Tecnología** | Sistema web (React), POS (Electron), backend (Spring Boot), base de datos (PostgreSQL); hosting y BD en la nube (tier gratuito); integración con OSE/SUNAT; servicio de IA (p. ej. Python/FastAPI). |

**Por qué desarrollo a medida:** Mejor relación costo–beneficio para licorerías pequeñas, personalización, inclusión de IA y sin mensualidades de software comercial. **Costo estimado:** USD 30–150 (proyecto académico) vs. USD 800–1,500 + mensualidad de un POS comercial.

---

# SLIDE 7: REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES

## Requerimientos funcionales (RF)

| ID | Requisito | Descripción breve |
|----|-----------|-------------------|
| RF-01 | Punto de venta (POS) | Ventas rápidas con búsqueda por código/nombre/categoría; totales automáticos; múltiples formas de pago; impresión de tickets. |
| RF-02 | Control de inventario | Stock actual, mínimo y máximo; actualización automática por venta; alertas de stock bajo y productos por vencer. |
| RF-03 | Facturación electrónica SUNAT | Boletas y facturas electrónicas; integración OSE; XML y PDF; consulta de estado. |
| RF-04 | Promociones y packs | Packs, descuentos por volumen (2x1, 3x2); promociones por categoría y fecha; aplicación automática en venta. |
| RF-05 | Reportes y dashboard | Ventas día/semana/mes; productos más vendidos; reportes de inventario; exportación Excel/PDF. |
| RF-06 | Recomendaciones con IA | Sugerencias de productos complementarios según historial de compras. |
| RF-07 | Predicción de demanda | Alertas de productos que se agotarán; sugerencias de cantidad a comprar. |
| RF-08 | Programa de fidelización | Registro de clientes; puntos; canje por descuentos. |
| RF-09 | Modo offline POS | Operación básica sin internet; sincronización al reconectar. |

---

# SLIDE 8: REQUERIMIENTOS NO FUNCIONALES (RNF)

## Requerimientos no funcionales

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-01 | **Usabilidad** | Interfaz intuitiva para 1–2 usuarios; curva de aprendizaje mínima; atajos de teclado. |
| RNF-02 | **Rendimiento** | Tiempo de respuesta de APIs &lt; 500 ms; venta completada en &lt; 45 segundos. |
| RNF-03 | **Seguridad** | Autenticación JWT; roles (Administrador, Vendedor); encriptación de datos sensibles. |
| RNF-04 | **Disponibilidad** | Sistema disponible ~99% del tiempo; respaldos automáticos de datos. |
| RNF-05 | **Compatibilidad** | Acceso desde navegador web; aplicación POS en Windows; opcional: app móvil Android. |

---

# CIERRE

## Resumen

- **Empresa:** Chilalo Shot – licorería pequeña en Piura (1–2 empleados).
- **Problema:** Procesos manuales, sin inventario en tiempo real, sin facturación electrónica, pérdidas ~S/. 33,000/año.
- **Proyecto:** Sistema web y opcional app móvil con IA para gestión integral de licorería.
- **Alcance:** POS, inventario, SUNAT, promociones, reportes, IA (recomendaciones y predicción), fidelización.
- **Resultados SMART:** Menor tiempo de venta, 0 multas por comprobantes, menos pérdidas por inventario, decisiones apoyadas en IA.
- **Solución:** Desarrollo a medida (web + POS + backend + IA) con mejor costo–beneficio que POS comercial.
- **Requerimientos:** 9 funcionales (RF-01 a RF-09) y 5 no funcionales (RNF-01 a RNF-05).

**Gracias.**

---
