# Formato de retrospectiva de Sprint
## Sistema Web y Aplicación Móvil – Licorería Chilalo Shot

**Metodología:** Scrum — reunión al cierre de cada sprint (duración sugerida: 30–45 min).  
**Objetivo:** Identificar qué funcionó, qué ajustar y qué acciones concretas llevar al siguiente sprint.

---

## Cómo usar esta plantilla

1. Copia la sección **Plantilla vacía** al final de cada sprint y rellénala.
2. Si el equipo es una sola persona (TAA), indícalo en “Tipo de retrospectiva”.
3. Las **acciones** deben ser específicas y revisables en el planning del siguiente sprint.
4. Opcional: enlaza este documento con el **Sprint Review** correspondiente (`Integrador 2/SPRINT_REVIEW_N.md`).

---

# Plantilla vacía (copiar desde aquí)

---

## Retrospectiva del Sprint _[número]_

### Información general

| Campo | Contenido |
|--------|------------|
| **Sprint** | Sprint _ |
| **Período** | Semanas _ al _ |
| **Objetivo del sprint** | _ |
| **Fecha de la retrospectiva** | _ |
| **Facilita** | _ |
| **Asistentes** | _ |
| **Tipo de retrospectiva** | Individual / Equipo |

---

### ¿Qué salió bien?

_Listar logros, prácticas útiles, decisiones acertadas, herramientas que ayudaron._

- 
- 
- 

---

### ¿Qué se puede mejorar?

_Problemas, retrasos, malas estimaciones, deuda técnica, comunicación, riesgos no vistos._

- 
- 
- 

---

### Acciones para el siguiente sprint

_Cada acción debe ser concreta (qué, cómo, cuándo revisar)._

| # | Acción | Responsable | Revisión |
|---|--------|-------------|----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

### Elementos que pasan al backlog del siguiente sprint (opcional)

| # | Elemento | Origen (plan / cliente / retrospectiva) |
|---|----------|----------------------------------------|
| 1 | | |
| 2 | | |

---

### Conclusión breve

_Párrafo de cierre: cumplimiento del objetivo del sprint y enfoque para el siguiente._

---

*Trabajo Académico Aplicado (TAA) — Instituto de Educación Superior, Piura, Perú.*

---

# Ejemplo completado — Sprint 2 (referencia)

*Este bloque muestra el formato ya rellenado; puedes borrarlo o sustituirlo por tu sprint.*

### Información general

| Campo | Contenido |
|--------|------------|
| **Sprint** | Sprint 2 |
| **Período** | Semanas 5 al 9 |
| **Objetivo del sprint** | POS web, facturación SUNAT (pruebas), inventario, compras, caja, gastos, devoluciones, crédito y clientes |
| **Fecha de la retrospectiva** | _(fin de semana 9)_ |
| **Facilita** | Alumno desarrollador |
| **Asistentes** | Alumno desarrollador |
| **Tipo de retrospectiva** | Individual |

### ¿Qué salió bien?

- Objetivo cumplido: operación digital con POS, stock automático y comprobantes en ambiente de pruebas.
- La base del Sprint 1 (JWT, Flyway, capas) evitó rediseños grandes.
- Inventario con alertas, compras, proveedores y mermas; caja, gastos, devoluciones y crédito cerraron el flujo operativo.
- Demo al cliente: venta → inventario → comprobante → caja → crédito con pago parcial.

### ¿Qué se puede mejorar?

- Integración SUNAT/OSE: documentar incidencias (series, XML, correlativos).
- Pago mixto y casos borde: más tiempo del estimado; conviene trocear la historia antes del sprint.
- Poco margen para tests automatizados nuevos; priorizar tests en servicios críticos en el Sprint 3.

### Acciones para el siguiente sprint

| # | Acción | Responsable | Revisión |
|---|--------|-------------|----------|
| 1 | Partir historias complejas (promociones, IA, Android) en tareas pequeñas con criterios claros | Desarrollador | Planning Sprint 3 |
| 2 | Reservar colchón para integraciones externas e IA | Desarrollador | Inicio Sprint 3 |
| 3 | Aumentar tests en `VentaService`, facturación e inventario | Desarrollador | Durante Sprint 3 |

### Conclusión breve

El Sprint 2 cerró según plan operativo; el Sprint 3 concentrará promociones, fidelización, reportes, IA, Android y despliegue.

---

*Versión plantilla: 1.0 — compatible con `Integrador 2/SPRINT_REVIEW_*.md` y `Retrospectiva_Sprint2.md`.*
