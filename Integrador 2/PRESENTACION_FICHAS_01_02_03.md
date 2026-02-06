# Presentación resumida: Fichas 01, 02 y 03
## Proyecto Chilalo Shot — Sistema de Gestión Integral de Licorería

---

## FICHA 01 — Cartera de Proyectos

**Código:** PROY-LICOR-PIURA-2025-001  

**Objetivo:** Registrar el proyecto en la cartera y definir su viabilidad inicial.

### Resumen

- **Proyecto:** Sistema web y app móvil con IA para gestión integral de licorería.
- **Destinatario:** Licorerías pequeñas en Piura (1–2 empleados).

### Objetivos estratégicos

1. **Digitalización:** Reducir tiempo de venta de 3–5 min a 30–45 s.
2. **Cumplimiento normativo:** Integración con SUNAT y facturación electrónica.
3. **Optimización con IA:** Recomendaciones, predicción de demanda y optimización de inventario.

### Beneficios esperados

| Cuantitativo                         | Cualitativo                           |
|-------------------------------------|---------------------------------------|
| -80% pérdidas por inventario        | Mejor toma de decisiones             |
| -85% tiempo de venta                | Mayor competitividad                 |
| Cero multas SUNAT                   | Automatización y menos carga de trabajo |

### Datos clave

- **Duración:** 14 semanas (metodología incremental).
- **Presupuesto:** ~USD 30–122.
- **Gestor:** Practicante / desarrollador full stack.
- **Prioridad:** Alta.

---

## FICHA 02 — Perfil del Proyecto

**Objetivo:** Detallar el perfil del proyecto y la solución propuesta.

### Oportunidad de negocio

Licorería “Chilalo Shot” opera con procesos manuales que generan:

- Pérdidas de **S/. 33,000/año** por inventario, multas, ventas perdidas y errores.
- Tiempos de atención lentos (3–5 min por venta).
- Riesgo normativo (SUNAT).

### Solución propuesta

| Componente                  | Tecnología principal     |
|----------------------------|--------------------------|
| Sistema web                | React.js                 |
| Punto de venta (POS)       | Electron                 |
| Backend                    | Spring Boot + PostgreSQL |
| Inteligencia artificial    | Python + FastAPI         |
| App móvil (opcional)       | Kotlin + Firebase        |

### Alcance

**Incluido:** POS, inventario, facturación electrónica, promociones, clientes, reportes, IA.

**Excluido:** Contabilidad completa, nómina, e-commerce, delivery, app para clientes.

### Actores principales

- Dueño/administrador.
- Vendedor/empleado.
- Cliente.
- SUNAT / OSE.
- Sistema de IA.

---

## FICHA 03 — Análisis de Casos de Uso de Negocio

**Objetivo:** Definir los procesos de negocio que el sistema debe soportar.

### Actores de negocio

- Dueño/administrador.
- Vendedor/empleado.
- Cliente.
- SUNAT (sistema externo).
- Sistema de IA.

### Casos de uso de negocio (7 CUN)

| # | Caso de uso                              | Categoría           |
|---|------------------------------------------|---------------------|
| 1 | Realizar venta en POS                    | Operaciones         |
| 2 | Gestionar inventario                     | Operaciones         |
| 3 | Emitir comprobantes electrónicos         | Operaciones         |
| 4 | Gestionar promociones y packs            | Gestión comercial   |
| 5 | Gestionar clientes y fidelización        | Gestión comercial   |
| 6 | Consultar reportes y analytics           | Análisis e IA       |
| 7 | Obtener recomendaciones y predicciones IA| Análisis e IA       |

### Vista lógica — Trabajadores

- Cajero/vendedor.
- Administrador de inventario.
- Responsable de facturación.
- Responsable de promociones y clientes.
- Analista de negocio.
- Motor de IA (recomendaciones y predicción).

### Entidades principales

Producto, Venta, Cliente, Promoción/Pack, Comprobante electrónico, Movimiento de inventario.

---

## Resumen transversal

| Ficha | Rol principal                         |
|-------|--------------------------------------|
| **01** | Identificar proyecto, objetivos, costos, riesgos y planificación |
| **02** | Describir problema, solución, alcance, necesidades y estándares |
| **03** | Especificar casos de uso de negocio, actores, flujos y vista lógica |

**Proyecto:** Chilalo Shot — Sistema Web y App Móvil con IA para Gestión Integral de Licorería  

**Fecha:** Febrero 2025 | **Versión:** 1.0
