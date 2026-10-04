# Retrospectiva del Sprint 2
## Sistema Web y Aplicación Móvil – Licorería Chilalo Shot

---

## Información general

| | |
|---|---|
| **Sprint** | Sprint 2 |
| **Período** | Semanas 5 al 9 (5 semanas) |
| **Objetivo del sprint** | Operaciones del negocio: POS web, facturación electrónica con SUNAT, inventario, compras, caja, gastos, devoluciones, crédito y clientes |
| **Tipo de retrospectiva** | Individual (proyecto académico — un alumno desarrollador), en formato de mejora continua |

---

## Retrospectiva del Sprint (reflexión interna)

Como en el Sprint 1, la retrospectiva se realiza de forma individual como ejercicio de mejora continua, alineada a la revisión documentada en el Sprint Review 2.

### ¿Qué salió bien?

- Se cumplió el objetivo principal: el negocio puede operar de forma digital con venta en POS, descuento automático de stock y emisión de boletas/facturas en ambiente de pruebas SUNAT.
- La base técnica del Sprint 1 (entidades, JWT, Flyway, arquitectura en capas) facilitó construir la lógica de ventas e inventario sin rediseñar el modelo desde cero.
- El módulo de inventario quedó integrado con alertas (stock bajo y vencimiento), movimientos manuales, compras, proveedores y mermas, lo que da trazabilidad al stock.
- Los módulos complementarios (caja, gastos, devoluciones, crédito y clientes) cerraron el ciclo operativo que el planificador del proyecto esperaba para este sprint.
- La demostración al propietario pudo mostrar un flujo extremo a extremo: venta → inventario → comprobante → cierre de caja y caso de crédito con pago parcial.

### ¿Qué se puede mejorar?

- La integración con SUNAT/OSE en ambiente de pruebas exigió iteraciones y lectura fina de errores (series, correlativos, XML); conviene documentar cada incidencia y la solución aplicada para no repetir diagnósticos.
- El pago **mixto** y los casos borde (combinaciones de métodos, coherencia de montos) consumieron más tiempo del estimado; la complejidad de la UX y validaciones en frontend/backend fue mayor de lo previsto en la planificación inicial.
- La carga de trabajo concentrada en cinco semanas (POS + SUNAT + inventario + caja y módulos satélites) dejó poco margen para pruebas automatizadas nuevas; el tiempo se priorizó en funcionalidad y demostración con el cliente.
- Algunas estimaciones del Excel de revisión (~100 h) quedaron justas; historias “anchas” (p. ej. POS completo o facturación) habrían beneficiado un desglose en subtareas visibles día a día.

### Acciones para el Sprint 3

- **Desglose de historias complejas:** antes de iniciar el sprint, dividir promociones, fidelización, reportes e IA en tareas pequeñas con criterios de aceptación claros (similar a lo aprendido con el pago mixto).
- **Colchón para integraciones:** reservar tiempo explícito para integraciones externas (SUNAT en certificación, servicios de IA, app Android contra el mismo backend) y para correcciones tras pruebas en dispositivo real.
- **Pruebas del backend:** avanzar tests en los servicios críticos (`VentaService`, `FacturacionService`, inventario) para no acumular deuda técnica antes del cierre del proyecto.
- **Coordinación con el cliente:** agendar con anticipación la revisión de promociones, reportes y app Android según `PLANIFICACION_SPRINTS.md`.
- **Priorización:** abordar primero las historias de mayor riesgo (p. ej. app Android y módulo IA) para no comprimir la entrega en las últimas semanas.

---

## Elementos que entran al backlog del Sprint 3 (recordatorio)

Según la planificación del proyecto, el Sprint 3 incluye: promociones y packs, fidelización y puntos, reportes y dashboard, módulo de IA, aplicación Android, integraciones finales, pruebas y despliegue.

| # | Enfoque | Notas |
|---|---------|--------|
| 1 | Promociones y packs | Aplicación automática en POS |
| 2 | Clientes y fidelización | Puntos y canje |
| 3 | Reportes y analytics | PDF/Excel, gráficos |
| 4 | Inteligencia artificial | Recomendaciones y asistente |
| 5 | App Android | POS móvil e inventario |
| 6 | Cierre | Pruebas, producción, capacitación |

---

## Conclusión breve

El Sprint 2 cerró con el alcance planificado: el sistema soporta la operación diaria de la licorería con POS, facturación electrónica en pruebas y control de inventario y finanzas operativas. La retrospectiva deja acciones concretas para enfrentar el Sprint 3, el más denso en integraciones y valor agregado para el cliente.

---

*Documento elaborado como parte del Trabajo Académico Aplicado (TAA).*  
*Instituto de Educación Superior – Piura, Perú.*
