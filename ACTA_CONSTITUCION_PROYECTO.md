# Acta de Constitución de Proyecto

**Empresa:** [Nombre de la Empresa]  
**Nombre del proyecto:** Sistema Web y App Móvil con Inteligencia Artificial para Gestión Integral de Licorería  
**Tipo de proyecto:** Desarrollo de Software / Sistema de Gestión Empresarial  
**Patrocinador:** [Nombre del Patrocinador]  
**Gerente de Proyecto:** [Nombre del Gerente de Proyecto]  
**Fecha de Constitución:** [Fecha]  
**Versión:** 1.0

---

## Propósito del documento

Este documento define la descripción general, los objetivos y los participantes del proyecto. Se relaciona principalmente con la autorización del inicio del proyecto.

Así mismo, este documento brinda una descripción de la situación actual, los requisitos de alto nivel, criterios de éxito, riesgos y oportunidades.

---

## Propósito / Justificación

Implementar un Sistema Web y App Móvil con Inteligencia Artificial para Gestión Integral de Licorería que centralice y automatice los procesos clave de las licorerías pequeñas en Piura (ventas, inventario, facturación electrónica, promociones y reportes), reduciendo tiempos operativos (de 3-5 minutos a 30-45 segundos por venta), errores de registro y pérdidas económicas estimadas en S/. 33,000 anuales; a la vez que mejora el cumplimiento normativo con SUNAT, la precisión de inventario (de 70% a >98%), la disponibilidad de información para la toma de decisiones y la experiencia de dueños, empleados y clientes mediante recomendaciones inteligentes y predicciones automatizadas.

---

## Breve descripción del proyecto

El proyecto desarrollará, configurará y pondrá en producción un Sistema Web y App Móvil con Inteligencia Artificial como solución integral para licorerías pequeñas, con perfiles y permisos por rol (Administrador/Vendedor). Incluirá levantamiento de requerimientos, diseño, desarrollo, pruebas, migración/carga inicial de datos, capacitación y acompañamiento post-implementación. La solución se desplegará en infraestructura en la nube o local, según decisión del cliente, con respaldos y medidas de seguridad acordes a la protección de datos personales. Tecnologías: React.js + Spring Boot + PostgreSQL + Python/ML. Duración estimada: 14 semanas.

---

## Alcance preliminar del proyecto

**Incluye (alto nivel):**
- Gestión de productos: registro, categorías, precios, código de barras, stock mínimo/máximo, fechas de vencimiento.
- Punto de venta (POS): ventas rápidas, búsqueda de productos, aplicación automática de promociones, múltiples formas de pago, historial de ventas.
- Facturación electrónica: emisión de boletas y facturas electrónicas, integración con API de SUNAT, generación de XML y PDF, resumen diario de boletas (RCB).
- Control de inventario: actualización automática, alertas de stock bajo y productos próximos a vencer, gestión de compras y proveedores, movimientos de inventario.
- Promociones y packs: creación de packs, descuentos por porcentaje/monto/volumen, promociones temporales y por categoría.
- Clientes y fidelización: registro de clientes, historial de compras, sistema de puntos y programa de fidelización.
- Reportes y analytics: dashboard ejecutivo, reportes de ventas/inventario/rentabilidad, exportación a Excel/PDF, insights automáticos de IA.
- Inteligencia artificial: recomendaciones de productos, predicción de demanda, optimización de inventario, sugerencias de promociones, análisis de patrones, asistente virtual (chatbot).
- Administración: usuarios, roles, permisos, configuración de facturación, parámetros del sistema.
- Plataformas: Sistema Web (principal) y Aplicación POS (Electron). Integraciones: SUNAT, lectores de código de barras, impresoras térmicas.

**No incluye (salvo aprobación expresa):** Sistema contable completo, gestión de nómina, integración con sistemas bancarios para pagos, e-commerce (venta online), app para clientes finales, sistema de delivery, integración con redes sociales, o aplicación móvil completa (prioridad: Web + POS en fase 1).

---

## Objetivos del proyecto

### Objetivo General

Desarrollar e implementar un sistema web y aplicación móvil con inteligencia artificial que permita a las licorerías pequeñas en Piura (1-2 empleados) gestionar de manera integral y automatizada sus operaciones de venta, inventario, facturación y promociones, mejorando la eficiencia operativa, cumpliendo normativas fiscales y elevando la satisfacción del cliente mediante recomendaciones inteligentes y predicciones automatizadas.

### Objetivos Específicos

1. **Digitalizar el proceso de ventas:** Implementar sistema de punto de venta (POS) rápido e intuitivo optimizado para uso con personal mínimo, reduciendo tiempo de venta de 3-5 minutos a 30-45 segundos
2. **Automatizar emisión de comprobantes:** Integración con SUNAT para boletas y facturas electrónicas, garantizando 100% de cumplimiento normativo
3. **Controlar inventario en tiempo real:** Sistema de gestión de stock con alertas inteligentes y predicción de demanda, aumentando precisión de inventario de 70% a >98%
4. **Gestionar promociones y packs:** Módulo flexible con sugerencias automáticas de IA basadas en patrones de venta
5. **Generar reportes analíticos:** Dashboard con métricas clave de negocio y insights automatizados
6. **Desarrollar app móvil:** Aplicación para gestión desde dispositivos móviles (opcional - fase posterior)
7. **Implementar programa de fidelización:** Sistema de puntos y descuentos para clientes frecuentes
8. **Integrar inteligencia artificial:** Sistema de recomendaciones de productos, predicción de demanda y optimización automática de inventario
9. **Simplificar operaciones:** Interfaz intuitiva que minimice la curva de aprendizaje para negocios pequeños

---

## Criterios de éxito

### Criterios Técnicos

- ✅ Sistema disponible 99% del tiempo (uptime)
- ✅ Tiempo de respuesta de APIs < 500ms (p95)
- ✅ POS funciona en modo offline
- ✅ Cobertura de tests > 70%
- ✅ Sin vulnerabilidades críticas de seguridad
- ✅ Integración exitosa con SUNAT (100% de comprobantes enviados)

### Criterios Funcionales

- ✅ Todos los módulos principales implementados y funcionando
- ✅ Emisión de boletas y facturas electrónicas funcionando
- ✅ Control de inventario en tiempo real con alertas
- ✅ Sistema de promociones y packs operativo
- ✅ Reportes generados correctamente
- ✅ POS permite ventas rápidas (< 30 segundos por venta)

### Criterios de Negocio

- ✅ Reducción de tiempo de proceso de venta en 85% (de 3-5 min a 30-45 seg)
- ✅ Eliminación de errores en cálculo de totales
- ✅ Reducción de pérdidas por inventario descontrolado en 80% (de S/. 9,600/año a S/. 1,920/año)
- ✅ Cumplimiento de normativas SUNAT (100% de comprobantes emitidos)
- ✅ Reducción de pérdidas totales de S/. 33,000/año a menos de S/. 5,000/año
- ✅ Usuarios capacitados y usando el sistema activamente
- ✅ ROI positivo en 12-15 meses

### Métricas de Éxito (KPIs)

- **Eficiencia Operativa:**
  - Tiempo promedio de venta: < 30 segundos (antes: 3-5 min)
  - Precisión de inventario: > 98% (antes: ~70%)
  - Tasa de comprobantes emitidos correctamente: > 99%
  
- **Satisfacción del Cliente:**
  - Tiempo de espera en cola: < 5 minutos
  - Errores en ventas: < 1%
  
- **Uso del Sistema:**
  - Usuarios activos diarios: > 90% del total
  - Ventas gestionadas por el sistema: 100%
  - Promociones aplicadas correctamente: > 95%

---

## Riesgos principales y oportunidades

### Riesgos Principales

#### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Problemas de integración con SUNAT | Media | Alto | Prototipo temprano, pruebas con ambiente de pruebas de SUNAT |
| Rendimiento del POS con muchos productos | Media | Medio | Optimización de consultas, índices, caché |
| Problemas de conectividad en POS | Alta | Medio | Modo offline, sincronización diferida |
| Escalabilidad de base de datos | Baja | Alto | Diseño escalable desde inicio, índices optimizados |

#### Riesgos de Proyecto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en requerimientos | Alta | Medio | Metodología ágil, comunicación constante |
| Retrasos en entregas | Media | Alto | Buffer de tiempo, priorización |
| Disponibilidad del equipo | Baja | Alto | Equipo dedicado, backup de conocimiento |
| Cambios en normativas SUNAT | Baja | Alto | Monitoreo de cambios, diseño flexible |

#### Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia al cambio de usuarios | Media | Medio | Capacitación adecuada, UI intuitiva |
| Costos de infraestructura mayores | Baja | Medio | Monitoreo de uso, optimización |
| Problemas con OSE de SUNAT | Media | Alto | Múltiples proveedores OSE, fallbacks |

### Oportunidades

1. **Mercado potencial:** En Piura existen cientos de licorerías pequeñas con necesidades similares, representando un mercado potencial significativo para una solución estandarizada pero personalizable

2. **Ventaja competitiva:** La integración de IA proporciona herramientas avanzadas normalmente disponibles solo para grandes empresas, permitiendo a licorerías pequeñas competir efectivamente

3. **Escalabilidad:** El sistema puede crecer con el negocio, desde operación pequeña hasta mediana, proporcionando valor a largo plazo

4. **Automatización inteligente:** La IA reduce la carga de trabajo del dueño/empleado al automatizar decisiones que normalmente requerirían experiencia o tiempo adicional

5. **Cumplimiento normativo:** La integración nativa con SUNAT elimina barreras legales y permite acceso al mercado corporativo (empresas, restaurantes, hoteles)

---

## Participantes del proyecto

### Stakeholders Primarios

1. **Dueño/Propietario de la Licorería**
   - Interés: Maximizar rentabilidad, reducir pérdidas, cumplir normativas, crecer el negocio
   - Influencia: Alta (toma la decisión de implementar)
   - Impacto: Alto (usuario diario del sistema)

2. **Empleado/Vendedor**
   - Interés: Facilidad de uso, reducción de errores, menor estrés
   - Influencia: Media
   - Impacto: Alto (usa el sistema constantemente)

### Stakeholders Secundarios

3. **Clientes de la Licorería**
   - Interés: Atención rápida, productos disponibles, precios correctos, comprobantes
   - Influencia: Media
   - Impacto: Medio

4. **SUNAT (Superintendencia Nacional de Aduanas y de la Administración Tributaria)**
   - Interés: Cumplimiento de normativas fiscales, emisión correcta de comprobantes
   - Influencia: Alta (puede sancionar por incumplimiento)
   - Impacto: Alto (normativas obligatorias)

5. **Proveedores**
   - Interés: Ventas consistentes, pagos puntuales
   - Influencia: Baja
   - Impacto: Bajo

### Equipo del Proyecto

- **Product Owner:** Representante del cliente, define prioridades
- **Scrum Master:** Facilita el proceso Scrum, elimina impedimentos
- **Desarrollador Full Stack Senior:** Desarrollo backend y frontend web
- **Desarrollador Backend/IA:** Desarrollo de APIs e integración de IA
- **Desarrollador POS:** Desarrollo de aplicación POS
- **QA/Tester:** Pruebas y aseguramiento de calidad
- **Diseñador UX/UI:** Diseño de interfaces

---

## Cronograma preliminar

**Duración total:** 14 semanas

- **Fase 1: Análisis y Diseño** (Semanas 1-2)
- **Fase 2: Desarrollo Backend** (Semanas 3-6)
- **Fase 3: Desarrollo Frontend Web** (Semanas 7-9)
- **Fase 4: Desarrollo POS** (Semanas 10-11)
- **Fase 5: IA Avanzada y Optimización** (Semana 12)
- **Fase 6: Testing y QA** (Semana 13)
- **Fase 7: Despliegue y Capacitación** (Semana 14)

---

## Presupuesto preliminar

**Presupuesto total estimado:** USD 99,230

- Recursos Humanos: USD 85,400
- Infraestructura (primer año): USD 1,610
- Hardware: USD 600
- Costos Adicionales: USD 11,620

**Nota:** Los costos de infraestructura mensuales posteriores al primer año serían aproximadamente $130 USD/mes.

---

## Metodología de desarrollo

**Metodología:** Scrum (Ágil)

- **Sprints:** 2 semanas cada uno
- **Eventos:** Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective
- **Entregas incrementales:** Funcionalidades entregadas en cada sprint
- **Feedback continuo:** Validación constante con stakeholders

---

## Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Patrocinador | [Nombre] | _______________ | ___/___/____ |
| Gerente de Proyecto | [Nombre] | _______________ | ___/___/____ |
| Product Owner | [Nombre] | _______________ | ___/___/____ |

---

**Documento elaborado por:** [Nombre de la Empresa]  
**Fecha:** [Fecha]  
**Versión:** 1.0
