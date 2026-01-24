# PROYECTO DE DESARROLLO DE SOFTWARE
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería
### Para Licorerías Pequeñas en Piura, Perú (1-2 empleados)

---

## 1. DESCRIPCIÓN DE LA ACTIVIDAD

### 1.1 Contexto del Proyecto

Las licorerías pequeñas en Piura (con 1-2 empleados, donde frecuentemente el dueño es uno de ellos) operan principalmente con procesos manuales que generan ineficiencias significativas. La falta de un sistema informático integrado limita su capacidad de crecimiento, control y servicio al cliente. Estas licorerías requieren soluciones simples, intuitivas y que funcionen con personal mínimo, pero que incorporen tecnologías modernas como inteligencia artificial para automatizar decisiones y mejorar la gestión.

### 1.2 Descripción del Problema

Una licorería típica en Piura enfrenta los siguientes problemas:

- **Gestión manual de ventas:** Registro de ventas en cuadernos o hojas de cálculo, propenso a errores
- **Falta de emisión de boletas:** No se emiten comprobantes de pago electrónicos, incumpliendo normativas de SUNAT
- **Control de inventario inexistente:** No hay visibilidad real del stock, generando:
  - Desabastecimiento de productos populares
  - Exceso de inventario de productos de baja rotación
  - Pérdidas por productos vencidos o dañados
  - Dificultad para identificar productos faltantes
- **Ausencia de sistema de promociones:** No se pueden gestionar packs, descuentos por volumen o promociones especiales
- **Falta de reportes:** Imposibilidad de generar reportes de ventas, productos más vendidos, rentabilidad
- **Gestión de clientes limitada:** No hay registro de clientes frecuentes ni programas de fidelización
- **Control de precios manual:** Dificultad para actualizar precios y aplicar descuentos

### 1.3 Necesidad del Cliente

La licorería requiere un **Sistema Web y App Móvil con Inteligencia Artificial para Gestión Integral** que permita:

1. Gestionar ventas de manera eficiente y rápida (optimizado para 1-2 personas)
2. Emitir boletas y facturas electrónicas cumpliendo normativas SUNAT
3. Controlar inventario en tiempo real con alertas inteligentes de stock bajo
4. Gestionar promociones y packs de productos con sugerencias automáticas de IA
5. Generar reportes de ventas, inventario y rentabilidad
6. Registrar clientes y gestionar programas de fidelización
7. Operar desde punto de venta (POS) y dispositivos móviles
8. **Recomendaciones inteligentes de productos** basadas en historial de compras
9. **Predicción de demanda** para optimizar compras y evitar desabastecimiento
10. **Sugerencias automáticas de promociones** basadas en patrones de venta

### 1.4 Preguntas Antisesgo a la Solución

**Guía para entrevistas y talleres con stakeholders:**

Estas preguntas deben ser utilizadas durante las fases de análisis y recopilación de requerimientos para validar que los problemas identificados son reales y no percepciones, y para asegurar que la solución propuesta realmente resolverá el problema de manera efectiva.

#### 1.4.1 Validación del Problema

- **¿Qué evidencia muestra que esto es un problema y no una percepción?**
  - Ejemplos de evidencia: registros de errores, pérdidas documentadas, quejas de clientes, multas recibidas, tiempo medido en procesos actuales
  - Objetivo: Distinguir entre problemas reales y percepciones o suposiciones
  
  **Respuesta supuesta:** 
  - Evidencia documentada: 3 multas de SUNAT por no emitir boletas (total 1,500 soles en últimos 6 meses)
  - Pérdidas por inventario: 800 soles/mes en productos vencidos no detectados
  - Tiempo medido: 3-5 minutos por venta (vs. 30 segundos esperados)
  - Quejas de clientes: 2-3 clientes/semana piden productos que no tenemos en stock

#### 1.4.2 Identificación del Punto de Dolor

- **¿Dónde duele exactamente (proceso, paso, rol, cliente, canal)?**
  - Identificar el proceso específico que falla
  - Determinar en qué paso del proceso ocurre el problema
  - Identificar qué rol o persona se ve más afectado
  - Determinar qué tipo de cliente o canal se ve más impactado
  - Objetivo: Precisar la ubicación exacta del problema para una solución focalizada
  
  **Respuesta supuesta:**
  - **Proceso:** Registro de ventas y control de inventario
  - **Paso crítico:** Al momento de la venta (búsqueda manual de precios) y al final del día (conteo manual de stock)
  - **Rol afectado:** Dueño/empleado único que debe hacer todo (ventas + inventario + facturación)
  - **Cliente afectado:** Clientes frecuentes que esperan productos específicos que a menudo no están disponibles
  - **Canal:** Presencial en tienda física (único canal actual)

#### 1.4.3 Cuantificación del Problema

- **¿Cuánto ocurre (frecuencia) y cuánto cuesta (impacto)?**
  - Frecuencia: ¿Cuántas veces al día/semana/mes ocurre el problema?
  - Impacto económico: ¿Cuánto dinero se pierde por este problema?
  - Impacto en tiempo: ¿Cuánto tiempo se pierde?
  - Impacto en clientes: ¿Cuántos clientes se ven afectados?
  - Objetivo: Priorizar problemas según su impacto real y justificar la inversión en la solución
  
  **Respuesta supuesta:**
  - **Frecuencia:** 
    - Ventas lentas: 50-80 ventas/día (cada una toma 3-5 min vs. 30 seg esperados)
    - Productos faltantes: 5-8 veces/semana
    - Errores en inventario: 2-3 veces/mes
  - **Impacto económico:** 
    - Pérdidas por inventario: 800 soles/mes
    - Multas SUNAT: 250 soles/mes promedio
    - Ventas perdidas por desabastecimiento: ~1,200 soles/mes
    - **Total estimado: 2,250 soles/mes (27,000 soles/año)**
  - **Impacto en tiempo:** 2-3 horas/día en tareas manuales (conteo, registro, búsqueda)
  - **Clientes afectados:** ~30% de clientes frecuentes (15-20 clientes/semana)

#### 1.4.4 Definición de Éxito

- **Si mañana tuviéramos la "solución X", ¿qué indicador cambiaría y en cuánto?**
  - Definir métricas específicas y medibles (KPIs)
  - Establecer valores objetivo (ej: reducir tiempo de venta de 3 min a 30 seg)
  - Determinar cómo se medirá el éxito
  - Objetivo: Establecer criterios claros de éxito y expectativas realistas
  
  **Respuesta supuesta:**
  - **Tiempo de venta:** Reducir de 3-5 minutos a 30-45 segundos (reducción del 85%)
  - **Pérdidas por inventario:** Reducir de 800 a 160 soles/mes (reducción del 80%)
  - **Precisión de inventario:** Aumentar de 70% a 98% de precisión
  - **Cumplimiento SUNAT:** 100% de boletas emitidas correctamente (vs. 0% actual)
  - **Ventas perdidas por desabastecimiento:** Reducir de 1,200 a 300 soles/mes (reducción del 75%)
  - **Tiempo en gestión diaria:** Reducir de 2-3 horas a 30 minutos/día
  - **ROI esperado:** Recuperar inversión en 12-15 meses

#### 1.4.5 Análisis de Intentos Previos

- **¿Qué intentaron antes? ¿Qué funcionó y qué no?**
  - Identificar soluciones anteriores (sistemas, procesos, herramientas)
  - Analizar por qué no funcionaron
  - Identificar qué aspectos sí funcionaron y pueden aprovecharse
  - Objetivo: Aprender de experiencias pasadas y evitar repetir errores
  
  **Respuesta supuesta:**
  - **Excel para inventario:** Intentaron usar Excel pero era muy lento actualizarlo manualmente y propenso a errores. **No funcionó:** Requería demasiado tiempo y disciplina.
  - **Sistema POS genérico:** Probaron un sistema POS básico pero no tenía facturación electrónica ni control de inventario adecuado. **No funcionó:** No cumplía con necesidades específicas de licorería y normativas SUNAT.
  - **Cuaderno manual:** Siguen usando cuaderno para ventas. **Funcionó parcialmente:** Es simple pero genera errores y no escala.
  - **Lecciones aprendidas:** Necesitan algo simple pero completo, que funcione offline, y que cumpla con SUNAT desde el inicio.

#### 1.4.6 Validación de Supuestos

- **¿Qué hipótesis estamos asumiendo como cierta sin verificar?**
  - Identificar supuestos sobre el problema
  - Identificar supuestos sobre la solución
  - Identificar supuestos sobre los usuarios
  - Identificar supuestos sobre el contexto del negocio
  - Objetivo: Hacer explícitos los supuestos y validarlos antes de diseñar la solución
  
  **Respuesta supuesta:**
  - **Supuestos sobre el problema:** Asumimos que el problema principal es la falta de sistema, pero podría ser falta de tiempo o capacitación.
  - **Supuestos sobre la solución:** Asumimos que el dueño usará el sistema diariamente, pero podría necesitar ser más automático o requerir menos interacción.
  - **Supuestos sobre usuarios:** Asumimos que el dueño tiene conocimientos básicos de tecnología, pero podría necesitar capacitación más extensa.
  - **Supuestos sobre negocio:** Asumimos que tienen internet estable, pero podría ser intermitente (requiere modo offline).
  - **Supuestos sobre SUNAT:** Asumimos que tienen certificado digital y OSE configurado, pero podría necesitar ayuda con el proceso.
  - **Validaciones necesarias:** Confirmar conectividad, nivel tecnológico del usuario, estado de certificados SUNAT, y tiempo disponible para capacitación.

#### 1.4.7 Aplicación Práctica

**Ejemplo de uso en entrevista con dueño de licorería:**

1. **Problema identificado:** "No tenemos control de inventario"
   - **Pregunta antisesgo:** "¿Qué evidencia muestra que esto es un problema?"
   - **Respuesta esperada:** "Perdimos 500 soles el mes pasado por productos vencidos que no detectamos a tiempo"

2. **Solución propuesta:** "Sistema de control de inventario con alertas"
   - **Pregunta antisesgo:** "Si mañana tuviéramos este sistema, ¿qué indicador cambiaría?"
   - **Respuesta esperada:** "Reduciríamos pérdidas por productos vencidos en 80% y sabríamos exactamente qué comprar cada semana"

3. **Supuesto:** "El dueño usará el sistema diariamente"
   - **Pregunta antisesgo:** "¿Qué hipótesis estamos asumiendo sin verificar?"
   - **Validación:** Confirmar que el dueño tiene tiempo y disposición para usar el sistema, o si necesita ser más automático

**Nota:** Estas preguntas deben aplicarse sistemáticamente durante las fases de análisis (Fase 1) y en reuniones de refinamiento de requerimientos para asegurar que el proyecto se basa en problemas reales y soluciones efectivas.

---

## 2. ANÁLISIS DEL PROBLEMA U OPORTUNIDAD

El análisis del problema u oportunidad es fundamental para comprender a fondo la situación actual de las licorerías pequeñas en Piura, identificando tanto los problemas que las aquejan como las oportunidades que pueden ser aprovechadas mediante la implementación de un sistema integral de gestión.

### 2.0 Diagnóstico del Problema Específico (Nivel Micro - Método del Embudo)

**Institución específica:** Licorerías pequeñas en Piura, Perú, con 1-2 empleados (donde frecuentemente el dueño es uno de ellos).

De manera específica, en las licorerías pequeñas de Piura se evidencian dificultades críticas en la gestión operativa y administrativa. Los propietarios y empleados han reportado problemas sistemáticos en los procesos de venta, control de inventario y cumplimiento normativo. La gestión completamente manual o con herramientas obsoletas (cuadernos, hojas de cálculo) genera duplicidad de tareas, errores frecuentes, pérdidas económicas significativas y desinformación sobre el estado real del negocio.

#### Síntomas Negativos Observados

**1. Síntomas en el Proceso de Ventas:**
- **Lentitud extrema en atención:** Cada venta toma entre 3-5 minutos cuando debería tomar 30-45 segundos, generando colas y frustración en los clientes
- **Errores recurrentes en cálculos:** Discrepancias en precios, totales y cambio que generan conflictos con clientes y pérdidas económicas
- **Búsqueda manual de precios:** El vendedor debe buscar precios en listas físicas o en su memoria, causando demoras y posibles errores
- **Registro manual en cuadernos:** Las ventas se registran manualmente en cuadernos, propenso a pérdida de información, errores de transcripción y dificultad para consultar historial

**2. Síntomas en el Control de Inventario:**
- **Desabastecimiento frecuente:** Productos populares se agotan sin previo aviso, perdiendo ventas estimadas en S/. 1,200 mensuales
- **Pérdidas por productos vencidos:** No se detectan productos próximos a vencer, generando pérdidas de S/. 800 mensuales
- **Exceso de inventario:** Productos de baja rotación ocupan espacio y capital sin generar ingresos
- **Conteo manual inexacto:** El inventario físico se realiza manualmente de forma esporádica, con precisión estimada del 70%, generando discrepancias constantes
- **Falta de visibilidad:** El dueño no sabe en tiempo real qué productos tiene, cuántos hay, ni cuáles necesitan reposición

**3. Síntomas en el Cumplimiento Normativo:**
- **Incumplimiento de SUNAT:** No se emiten boletas ni facturas electrónicas, generando multas de S/. 1,000-3,000 por incumplimiento
- **Pérdida de clientes corporativos:** Empresas que requieren facturas electrónicas no pueden comprar, perdiendo ventas recurrentes
- **Riesgo legal constante:** Amenaza de sanciones mayores o clausura por incumplimiento repetido
- **Falta de trazabilidad:** No hay registro electrónico de transacciones para cumplir con normativas fiscales

**4. Síntomas en la Gestión Administrativa:**
- **Ausencia de reportes:** Imposibilidad de generar reportes de ventas, productos más vendidos, rentabilidad o análisis de tendencias
- **Decisiones basadas en intuición:** El dueño toma decisiones de compra, precios y promociones sin datos reales del negocio
- **Tiempo excesivo en tareas manuales:** 2-3 horas diarias dedicadas a conteo, registro, búsqueda de información y cálculos manuales
- **Falta de análisis:** No se puede identificar qué productos son más rentables, cuáles tienen mejor rotación, ni cuándo hacer promociones efectivas

**5. Síntomas en la Experiencia del Cliente:**
- **Tiempos de espera prolongados:** Clientes esperan 3-5 minutos por venta, generando colas y abandono de compra
- **Productos no disponibles:** 15-20 clientes semanales buscan productos que no están en stock, perdiendo ventas y generando insatisfacción
- **Falta de comprobantes:** Clientes que requieren boletas o facturas no pueden obtenerlas, perdiendo ventas y generando quejas
- **Ausencia de promociones:** No se pueden implementar packs, descuentos por volumen o programas de fidelización, perdiendo competitividad

#### Quejas y Fallas Reportadas

**Quejas de Propietarios/Empleados:**
- "Perdemos mucho tiempo buscando precios y calculando totales manualmente"
- "No sabemos qué productos comprar porque no tenemos control de lo que se vende más"
- "Hemos recibido multas de SUNAT por no emitir boletas, pero no sabemos cómo hacerlo"
- "Productos se nos vencen porque no los detectamos a tiempo, perdiendo dinero"
- "Los clientes se van porque no tenemos el producto que buscan"
- "No podemos competir con otras licorerías que tienen promociones y programas de fidelización"

**Quejas de Clientes:**
- "Tardan mucho en atender, siempre hay cola"
- "Muchas veces no tienen el producto que busco"
- "No me pueden dar boleta cuando la necesito"
- "No tienen promociones ni descuentos como otras licorerías"
- "A veces me cobran precios diferentes, no hay consistencia"

**Fallas Observadas en la Operación:**
- **Errores en inventario:** Discrepancias entre inventario físico y real, con pérdidas no detectadas
- **Pérdida de información:** Registros en cuadernos que se pierden, se dañan o son ilegibles
- **Ineficiencia operativa:** Capacidad de atender solo 4-6 clientes por hora cuando podría ser 20-30 con sistema adecuado
- **Falta de trazabilidad:** Imposibilidad de rastrear ventas, productos o clientes para análisis o auditorías
- **Sobrecarga del personal:** El dueño/empleado está constantemente estresado por la cantidad de tareas manuales que debe realizar

#### Impacto Crítico en la Unidad de Análisis

La combinación de estos síntomas genera un **impacto crítico** en las licorerías pequeñas:

- **Pérdidas económicas directas:** S/. 2,750 mensuales (S/. 33,000 anuales) por inventario descontrolado, multas, ventas perdidas e ineficiencias
- **Limitación de crecimiento:** La ineficiencia impide expandir operaciones o atender más clientes
- **Riesgo legal:** Exposición constante a multas y sanciones por incumplimiento normativo
- **Pérdida de competitividad:** Establecimientos con tecnología pueden ofrecer mejor servicio y atraer clientes
- **Agotamiento del personal:** Sobrecarga constante que genera estrés, errores y posible abandono del negocio

Este diagnóstico específico revela que las licorerías pequeñas en Piura enfrentan un **problema sistémico** que requiere una solución integral que aborde simultáneamente la digitalización de procesos, el cumplimiento normativo y la optimización operativa mediante tecnología e inteligencia artificial.

#### 2.0.1 Causas y Pronóstico - Análisis Crítico

**Análisis de las Causas (¿Por qué pasa?)**

Esta problemática surge por la **carencia de una plataforma tecnológica integral** que centralice y automatice la información y procesos operativos de las licorerías pequeñas. Las causas específicas que originan este problema son:

1. **Ausencia de sistemas informáticos adecuados:** Las licorerías pequeñas no cuentan con sistemas POS o de gestión diseñados para su tamaño y presupuesto. Los sistemas comerciales existentes están orientados a negocios medianos/grandes, tienen costos prohibitivos (S/. 5,000-15,000 iniciales más mensualidades altas) y requieren personal capacitado y múltiples usuarios, lo cual no es viable para establecimientos con 1-2 empleados.

2. **Limitaciones de recursos humanos:** El personal mínimo (1-2 personas) debe realizar múltiples funciones simultáneamente (ventas, inventario, facturación, atención al cliente), generando sobrecarga cognitiva y operativa. La cantidad de información a manejar (precios, stock, promociones) excede la capacidad de una persona trabajando de forma manual.

3. **Desconocimiento y complejidad normativa:** Los dueños de licorerías pequeñas no tienen conocimiento suficiente sobre los requisitos de SUNAT para facturación electrónica, y los sistemas tradicionales requieren certificados digitales, OSE (Operador de Servicios Electrónicos) y configuración compleja que genera resistencia al cambio y preferencia por continuar con métodos tradicionales.

4. **Dispersión de información:** Los datos del negocio están fragmentados en cuadernos, hojas de cálculo y en la memoria del dueño, sin posibilidad de análisis, consulta rápida o toma de decisiones informadas. No existe un sistema centralizado que integre ventas, inventario, facturación y reportes.

5. **Limitaciones financieras:** Las licorerías operan con márgenes ajustados que limitan la capacidad de inversión en tecnología. No tienen certeza del retorno de inversión (ROI) y priorizan gastos en inventario y operaciones básicas, dejando la tecnología como un "nice to have" en lugar de una necesidad estratégica.

6. **Barrera tecnológica:** Los propietarios pueden tener conocimientos limitados de tecnología, generando temor a sistemas complejos y preferencia por métodos manuales conocidos, aunque sean ineficientes.

**Pronóstico (¿Qué pasará si no se soluciona?)**

El pronóstico es **altamente negativo y crítico**: de continuar con esta desarticulación operativa y falta de tecnología hacia el 2026-2027, las licorerías pequeñas en Piura enfrentarán consecuencias severas:

**Pronóstico Financiero:**
- **Pérdidas acumuladas:** Si no se implementa una solución, las pérdidas estimadas de S/. 33,000 anuales se acumularán, resultando en **S/. 99,000-132,000 en pérdidas en 3-4 años**, lo que puede llevar a la quiebra de muchas licorerías pequeñas.
- **Reducción de rentabilidad:** Los márgenes ya ajustados se reducirán aún más debido a pérdidas por inventario, multas y ventas perdidas, haciendo inviable la operación a mediano plazo.
- **Imposibilidad de crecimiento:** Sin sistemas eficientes, será imposible expandir operaciones, abrir nuevas ubicaciones o aumentar la capacidad de atención, limitando permanentemente el potencial del negocio.

**Pronóstico Operativo:**
- **Colapso operativo:** La sobrecarga del personal y los errores constantes llevarán a un deterioro progresivo de la calidad del servicio, generando más pérdidas de clientes y reducción de ventas.
- **Pérdida de competitividad:** Los establecimientos que implementen tecnología (competidores más grandes o pequeños que se modernicen) capturarán la mayor parte del mercado, dejando a las licorerías manuales con solo clientes ocasionales o de emergencia.
- **Agotamiento del personal:** El estrés constante y la sobrecarga de trabajo pueden llevar al abandono del negocio por parte del dueño o empleados, resultando en cierre definitivo.

**Pronóstico Legal y Normativo:**
- **Sanciones crecientes:** SUNAT está incrementando la fiscalización y las multas por incumplimiento. De continuar sin emitir comprobantes electrónicos, las licorerías enfrentarán multas acumulativas que pueden llegar a S/. 10,000-20,000 en 2-3 años, además del riesgo de clausura temporal o permanente.
- **Exclusión del mercado formal:** La imposibilidad de emitir facturas electrónicas excluirá permanentemente a estas licorerías del mercado corporativo (empresas, restaurantes, hoteles) que requieren comprobantes, perdiendo una fuente importante de ingresos recurrentes.

**Pronóstico de Mercado:**
- **Pérdida de participación de mercado:** Hacia 2026-2027, se estima que las licorerías sin tecnología perderán entre 30-40% de su participación de mercado frente a competidores tecnificados.
- **Deterioro de imagen:** La percepción de los clientes sobre establecimientos obsoletos, lentos y sin capacidad de emitir comprobantes generará pérdida de reputación y migración hacia competidores más modernos.
- **Cierre masivo:** Se proyecta que entre 20-30% de las licorerías pequeñas en Piura cerrarán en los próximos 3-5 años si no se modernizan, debido a la combinación de pérdidas económicas, sanciones legales y pérdida de competitividad.

**Pronóstico Tecnológico:**
- **Brecha digital creciente:** La brecha tecnológica entre licorerías manuales y tecnificadas se ampliará exponencialmente, haciendo cada vez más difícil y costoso implementar soluciones en el futuro.
- **Obsolescencia permanente:** Los métodos manuales se volverán completamente obsoletos, y las licorerías que no se adapten quedarán fuera del mercado moderno.

**Control del Pronóstico (La Solución Propuesta)**

Para evitar este pronóstico negativo y revertir la tendencia, **se requiere implementar urgentemente una solución tecnológica integral** que aborde todas las causas identificadas:

**Solución Propuesta: Sistema Web y App Móvil con Inteligencia Artificial para Gestión Integral de Licorería**

Esta solución controla el pronóstico negativo mediante:

1. **Digitalización completa:** Sistema integral que centraliza toda la información (ventas, inventario, facturación, clientes) en una plataforma única, eliminando la dispersión de datos y automatizando procesos manuales.

2. **Cumplimiento normativo automatizado:** Integración nativa con SUNAT que automatiza la emisión de comprobantes electrónicos, eliminando multas y permitiendo acceso al mercado corporativo.

3. **Optimización operativa:** Reducción del tiempo de venta de 3-5 minutos a 30-45 segundos, aumentando la capacidad de atención y eliminando errores manuales.

4. **Control de inventario inteligente:** Sistema en tiempo real con alertas automáticas que previene desabastecimiento, detecta productos próximos a vencer y optimiza las compras mediante predicción de demanda con IA.

5. **Inteligencia artificial para decisiones:** Herramientas de IA que automatizan decisiones de compra, sugieren promociones efectivas y optimizan inventario, reduciendo la carga cognitiva del personal.

6. **Accesibilidad económica:** Solución diseñada específicamente para licorerías pequeñas, con costos accesibles y ROI demostrable que justifica la inversión.

7. **Facilidad de uso:** Interfaz intuitiva diseñada para personal con conocimientos tecnológicos básicos, minimizando la barrera de adopción.

**Impacto Esperado de la Solución:**
- **Reducción de pérdidas:** De S/. 33,000/año a menos de S/. 5,000/año (ahorro de S/. 28,000 anuales)
- **Aumento de ventas:** 20-30% de incremento por mejor atención, disponibilidad de productos y acceso a mercado corporativo
- **Cumplimiento normativo:** 100% de comprobantes emitidos correctamente, eliminando multas
- **Competitividad:** Capacidad de competir efectivamente con establecimientos más grandes
- **Crecimiento sostenible:** Base tecnológica que permite escalar el negocio

**Urgencia de Implementación:** Dada la gravedad del pronóstico y la acumulación progresiva de pérdidas, sanciones y pérdida de competitividad, **la implementación de esta solución es urgente y debe realizarse en el corto plazo (12-18 meses)** para evitar que el pronóstico negativo se materialice y las licorerías pequeñas enfrenten consecuencias irreversibles.

#### 2.0.2 Formulación del Problema - La Pregunta de Investigación

La pregunta de investigación es la **punta final del embudo**, que convierte todo el análisis previo (diagnóstico, síntomas, causas y pronóstico) en una pregunta clara, precisa y medible que guía el desarrollo del proyecto.

**Pregunta Principal de Investigación:**

¿De qué manera la implementación de un sistema web y aplicación móvil con inteligencia artificial para gestión integral optimizará los procesos operativos, administrativos y de cumplimiento normativo en las licorerías pequeñas (1-2 empleados) en Piura, Perú, en el periodo 2025-2026?

**Desglose de la Pregunta de Investigación:**

**Variable Independiente (VI):**
- **Sistema web y aplicación móvil con inteligencia artificial para gestión integral**
  - Componentes: Sistema POS, control de inventario, facturación electrónica, promociones, reportes analíticos, recomendaciones de IA, predicción de demanda

**Variable Dependiente (VD):**
- **Optimización de procesos operativos, administrativos y de cumplimiento normativo**
  - Indicadores medibles:
    - **Procesos operativos:** Tiempo de venta (reducción de 3-5 min a 30-45 seg), precisión de inventario (aumento de 70% a >98%), reducción de errores en cálculos
    - **Procesos administrativos:** Reducción de tiempo en tareas manuales (de 2-3 horas/día a 30 min/día), generación de reportes automáticos, toma de decisiones basada en datos
    - **Cumplimiento normativo:** Emisión de 100% de comprobantes electrónicos, eliminación de multas SUNAT, acceso al mercado corporativo

**Población:**
- **Licorerías pequeñas en Piura, Perú, con 1-2 empleados**
  - Características: Establecimientos donde frecuentemente el dueño es uno de los empleados, operan con procesos manuales, tienen presupuestos limitados, requieren soluciones simples e intuitivas

**Delimitación Espacial:**
- **Piura, Perú:** Región específica donde se implementará y evaluará el sistema
- **Contexto:** Licorerías pequeñas del sector comercial minorista de bebidas alcohólicas

**Delimitación Temporal:**
- **Periodo 2025-2026:** 
  - **2025:** Desarrollo, implementación piloto y validación del sistema
  - **2026:** Implementación completa, evaluación de resultados y medición de impacto

**Preguntas Secundarias de Investigación:**

Para profundizar en aspectos específicos, se formulan las siguientes preguntas secundarias:

1. **¿Cómo el sistema de punto de venta (POS) optimizado reducirá el tiempo de atención al cliente y eliminará errores en el proceso de venta?**

2. **¿De qué manera el control de inventario en tiempo real con inteligencia artificial reducirá las pérdidas por desabastecimiento y productos vencidos?**

3. **¿Cómo la integración con SUNAT para facturación electrónica garantizará el cumplimiento normativo y eliminará multas?**

4. **¿De qué forma las herramientas de inteligencia artificial (recomendaciones, predicción de demanda) mejorarán la toma de decisiones y optimizarán la gestión del negocio?**

5. **¿Cómo la generación automática de reportes y analytics proporcionará visibilidad del negocio y facilitará decisiones estratégicas basadas en datos?**

**Justificación de la Pregunta:**

Esta pregunta de investigación es relevante porque:
- **Aborda un problema real:** Las licorerías pequeñas enfrentan pérdidas de S/. 33,000 anuales y riesgos de cierre
- **Es medible:** Todos los indicadores pueden cuantificarse antes y después de la implementación
- **Es viable:** La tecnología propuesta es factible y accesible para el contexto
- **Tiene impacto:** La solución transformará operaciones y mejorará la competitividad
- **Es urgente:** El pronóstico negativo requiere implementación en el corto plazo

**Alcance de la Investigación:**

La investigación se enfocará en:
- Desarrollo e implementación del sistema integral
- Medición de indicadores de optimización (tiempo, precisión, cumplimiento)
- Evaluación de impacto en eficiencia operativa y rentabilidad
- Validación de cumplimiento normativo con SUNAT
- Análisis de adopción y satisfacción de usuarios

### 2.1 Definición del Problema u Oportunidad

#### 2.1.1 Problema Principal

Las licorerías pequeñas en Piura (con 1-2 empleados, donde frecuentemente el dueño es uno de ellos) operan con **procesos manuales obsoletos** que generan ineficiencias significativas y limitan su capacidad de crecimiento, control y servicio al cliente. La falta de un sistema informático integrado provoca:

- **Ineficiencia operativa:** Procesos de venta lentos y propensos a errores
- **Incumplimiento normativo:** Falta de emisión de comprobantes electrónicos requeridos por SUNAT
- **Pérdidas económicas:** Descontrol de inventario que genera pérdidas por productos vencidos, desabastecimiento y exceso de stock
- **Limitación competitiva:** Imposibilidad de implementar estrategias de marketing, promociones y fidelización de clientes
- **Sobrecarga del personal:** El dueño/empleado debe realizar múltiples tareas manuales que consumen tiempo valioso

#### 2.1.2 Oportunidad Identificada

Existe una **oportunidad estratégica** de transformar estas licorerías pequeñas mediante la implementación de un sistema integral que combine:

1. **Digitalización de procesos:** Automatización de ventas, inventario y facturación
2. **Cumplimiento normativo:** Integración nativa con SUNAT para emisión de comprobantes electrónicos
3. **Inteligencia artificial:** Herramientas avanzadas de recomendación, predicción y optimización que normalmente solo están disponibles para grandes empresas
4. **Competitividad mejorada:** Capacidad de competir con establecimientos más grandes mediante herramientas tecnológicas modernas
5. **Escalabilidad:** Sistema que crece con el negocio, desde operación pequeña hasta mediana

**Oportunidad de mercado:** En Piura existen cientos de licorerías pequeñas con necesidades similares, lo que representa un mercado potencial significativo para una solución estandarizada pero personalizable.

### 2.2 Comprensión de las Causas Raíz

El análisis de las causas raíz revela que los problemas identificados no son aislados, sino que están interconectados y tienen orígenes comunes:

#### 2.2.1 Causa Raíz 1: Ausencia de Tecnología Apropiada

**Problema:** Las licorerías pequeñas no cuentan con sistemas informáticos adecuados para su tamaño y presupuesto.

**Causas específicas:**
- **Costo percibido alto:** Los sistemas POS comerciales están diseñados para negocios medianos/grandes y tienen costos prohibitivos
- **Complejidad excesiva:** Los sistemas existentes requieren personal capacitado y múltiples usuarios, no son adecuados para 1-2 personas
- **Falta de integración:** No existe una solución integral que combine ventas, inventario, facturación y promociones en un solo sistema
- **Barrera tecnológica:** Los dueños de licorerías pequeñas pueden tener conocimientos limitados de tecnología

**Impacto:** Sin tecnología adecuada, los negocios se ven forzados a usar métodos manuales (cuadernos, hojas de cálculo) que son lentos, propensos a errores y no escalables.

#### 2.2.2 Causa Raíz 2: Limitaciones de Recursos Humanos

**Problema:** Las licorerías operan con personal mínimo (1-2 personas) que debe realizar múltiples funciones simultáneamente.

**Causas específicas:**
- **Multitarea excesiva:** El dueño/empleado debe atender clientes, buscar productos, calcular precios, registrar ventas y controlar inventario simultáneamente
- **Falta de especialización:** No hay personal dedicado a tareas administrativas (inventario, reportes, facturación)
- **Sobrecarga cognitiva:** La cantidad de información a manejar (precios, stock, promociones) excede la capacidad de una persona
- **Ausencia de respaldo:** Si el dueño está ausente, el negocio puede detenerse o funcionar con limitaciones severas

**Impacto:** El personal está constantemente sobrecargado, lo que genera errores, lentitud en el servicio y agotamiento.

#### 2.2.3 Causa Raíz 3: Desconocimiento de Normativas y Requisitos Legales

**Problema:** Falta de conocimiento o capacidad para cumplir con normativas de SUNAT sobre emisión de comprobantes electrónicos.

**Causas específicas:**
- **Complejidad normativa:** Los requisitos de SUNAT para facturación electrónica son complejos y cambian frecuentemente
- **Falta de asesoría:** No tienen acceso a asesores contables o fiscales que les guíen
- **Costo de implementación:** Los sistemas de facturación electrónica tradicionales requieren certificados digitales, OSE y configuración compleja
- **Resistencia al cambio:** Prefieren continuar con métodos tradicionales por temor a la complejidad

**Impacto:** Multas por incumplimiento, pérdida de clientes que requieren comprobantes, y riesgo de sanciones legales.

#### 2.2.4 Causa Raíz 4: Falta de Visibilidad y Control de Datos

**Problema:** No existe visibilidad real sobre el estado del negocio (ventas, inventario, rentabilidad) en tiempo real.

**Causas específicas:**
- **Datos dispersos:** La información está en cuadernos, hojas de cálculo, y en la memoria del dueño
- **Análisis manual imposible:** No tienen tiempo ni herramientas para analizar datos y tomar decisiones informadas
- **Falta de métricas:** No conocen sus KPIs (productos más vendidos, margen de ganancia, rotación de inventario)
- **Decisiones reactivas:** Solo reaccionan a problemas cuando ya ocurrieron (productos agotados, pérdidas por vencimiento)

**Impacto:** Decisiones de negocio basadas en intuición en lugar de datos, pérdida de oportunidades y problemas detectados demasiado tarde.

#### 2.2.5 Causa Raíz 5: Limitaciones Financieras y de Escala

**Problema:** Las licorerías pequeñas tienen presupuestos limitados y no pueden invertir en soluciones costosas.

**Causas específicas:**
- **Margen reducido:** Operan con márgenes ajustados que limitan la capacidad de inversión
- **ROI incierto:** No tienen certeza de que una inversión en tecnología generará retorno
- **Falta de financiamiento:** No tienen acceso fácil a créditos o financiamiento para tecnología
- **Priorización:** Invierten primero en inventario y operaciones básicas, la tecnología queda como "nice to have"

**Impacto:** Se mantienen en métodos manuales por años, perdiendo competitividad y eficiencia progresivamente.

### 2.3 Evaluación del Impacto

La evaluación del impacto permite cuantificar el efecto del problema en la organización, tanto en términos financieros como en otros aspectos operativos y estratégicos.

#### 2.3.1 Impacto Financiero

**Pérdidas directas mensuales estimadas por licorería pequeña:**

| Concepto | Pérdida Mensual (S/.) | Pérdida Anual (S/.) | Justificación |
|----------|----------------------|-------------------|---------------|
| **Pérdidas por inventario descontrolado** | 800 | 9,600 | Productos vencidos no detectados, exceso de stock de baja rotación, productos dañados |
| **Multas y sanciones SUNAT** | 250 | 3,000 | Multas por no emitir comprobantes electrónicos (promedio 3 multas/año de S/. 1,000 c/u) |
| **Ventas perdidas por desabastecimiento** | 1,200 | 14,400 | Clientes que buscan productos no disponibles, pérdida de ventas recurrentes |
| **Ineficiencia en tiempo de venta** | 300 | 3,600 | Tiempo adicional en cada venta (3-5 min vs. 30 seg) que limita capacidad de atender más clientes |
| **Errores en cálculos y registros** | 200 | 2,400 | Errores en precios, totales, cambio que generan pérdidas o conflictos |
| **TOTAL IMPACTO FINANCIERO** | **2,750** | **33,000** | Pérdida anual significativa que limita crecimiento |

**Costo de oportunidad:**
- **Ventas adicionales no capturadas:** Estimado en S/. 2,000-3,000/mes por falta de promociones efectivas y programa de fidelización
- **Crecimiento limitado:** La ineficiencia impide expandir operaciones o abrir nuevas ubicaciones

#### 2.3.2 Impacto Operativo

**Eficiencia y productividad:**

- **Tiempo perdido en tareas manuales:** 2-3 horas diarias (15-20 horas semanales) en:
  - Conteo manual de inventario
  - Búsqueda de precios en listas
  - Registro manual de ventas
  - Cálculos manuales de totales y descuentos
  - Preparación de reportes básicos

- **Velocidad de atención al cliente:**
  - **Tiempo actual por venta:** 3-5 minutos
  - **Tiempo óptimo:** 30-45 segundos
  - **Impacto:** Capacidad de atender 4-6 veces más clientes con el mismo personal

- **Precisión de inventario:**
  - **Precisión actual:** ~70% (estimado)
  - **Precisión objetivo:** >98%
  - **Impacto:** Reducción drástica de productos faltantes y exceso de inventario

#### 2.3.3 Impacto en Cumplimiento Normativo

**Riesgos legales y regulatorios:**

- **Multas SUNAT:** S/. 1,000-3,000 por incumplimiento de emisión de comprobantes
- **Riesgo de clausura:** En casos extremos de incumplimiento repetido
- **Pérdida de clientes corporativos:** Empresas que requieren facturas electrónicas no pueden comprar
- **Limitación de crecimiento:** No pueden participar en licitaciones o contratos que requieren facturación electrónica

#### 2.3.4 Impacto en Satisfacción del Cliente

**Experiencia del cliente afectada:**

- **Tiempo de espera:** Clientes esperan 3-5 minutos por venta, generando colas y frustración
- **Productos no disponibles:** 15-20 clientes/semana buscan productos que no están en stock
- **Errores en precios:** Conflictos por discrepancias en precios o cálculos incorrectos
- **Falta de comprobantes:** Clientes que necesitan boletas o facturas no pueden obtenerlas
- **Ausencia de promociones:** No pueden aprovechar ofertas o programas de fidelización

**Impacto en reputación:**
- Clientes insatisfechos pueden cambiar a la competencia
- Pérdida de clientes frecuentes por falta de programa de fidelización
- Reputación negativa por lentitud o errores

#### 2.3.5 Impacto Estratégico y Competitivo

**Limitaciones para el crecimiento:**

- **Escalabilidad limitada:** Los procesos manuales no permiten crecer sin contratar más personal
- **Competitividad reducida:** No pueden competir con establecimientos más grandes que tienen sistemas automatizados
- **Falta de insights:** No pueden tomar decisiones estratégicas basadas en datos
- **Oportunidades perdidas:** No pueden implementar estrategias de marketing, promociones inteligentes o análisis de tendencias

**Ventaja competitiva perdida:**
- Establecimientos con tecnología pueden ofrecer mejor servicio, más rápido y con más opciones
- Competidores pueden implementar programas de fidelización y promociones que atraen clientes

### 2.4 Identificación de Stakeholders

Los stakeholders son las personas o grupos que se ven afectados por el problema u oportunidad, y cuyos intereses y necesidades deben ser comprendidos para el éxito del proyecto.

#### 2.4.1 Stakeholders Primarios (Directamente Afectados)

**1. Dueño/Propietario de la Licorería**

- **Intereses:**
  - Maximizar rentabilidad del negocio
  - Reducir pérdidas y costos operativos
  - Cumplir con normativas legales
  - Crecer y expandir el negocio
  - Reducir carga de trabajo personal

- **Necesidades:**
  - Sistema simple y fácil de usar (no tiene tiempo para capacitación extensa)
  - Solución económica que justifique la inversión
  - Sistema que funcione con 1-2 personas
  - Cumplimiento automático con SUNAT
  - Visibilidad de estado del negocio en tiempo real
  - Reducción de errores y pérdidas

- **Influencia:** Alta (toma la decisión de implementar el sistema)
- **Impacto:** Alto (es quien usa el sistema diariamente)

**2. Empleado/Vendedor (si existe)**

- **Intereses:**
  - Facilidad de uso del sistema
  - Reducción de errores en su trabajo
  - Menor estrés y carga de trabajo
  - Mejor atención al cliente

- **Necesidades:**
  - Interfaz intuitiva que no requiera capacitación extensa
  - Sistema rápido que no retrase las ventas
  - Herramientas que faciliten su trabajo (búsqueda rápida, cálculo automático)
  - Soporte cuando tenga dudas

- **Influencia:** Media (puede influir en la decisión del dueño)
- **Impacto:** Alto (usa el sistema constantemente)

#### 2.4.2 Stakeholders Secundarios (Indirectamente Afectados)

**3. Clientes de la Licorería**

- **Intereses:**
  - Atención rápida y eficiente
  - Productos disponibles cuando los necesitan
  - Precios correctos y transparentes
  - Comprobantes de pago cuando los requieren
  - Promociones y ofertas atractivas
  - Programa de fidelización con beneficios

- **Necesidades:**
  - Tiempo de espera reducido
  - Disponibilidad de productos
  - Precisión en precios y cálculos
  - Acceso a comprobantes electrónicos
  - Beneficios por ser cliente frecuente

- **Influencia:** Media (su satisfacción afecta el éxito del negocio)
- **Impacto:** Medio (se benefician indirectamente de un sistema eficiente)

**4. SUNAT (Superintendencia Nacional de Aduanas y de la Administración Tributaria)**

- **Intereses:**
  - Cumplimiento de normativas fiscales
  - Emisión correcta de comprobantes electrónicos
  - Control y fiscalización efectiva
  - Reducción de evasión tributaria

- **Necesidades:**
  - Sistemas que emitan comprobantes según normativa vigente
  - Integración con sus sistemas (OSE)
  - Trazabilidad de transacciones
  - Reportes y resúmenes según requerimientos

- **Influencia:** Alta (puede sancionar por incumplimiento)
- **Impacto:** Alto (normativas que deben cumplirse obligatoriamente)

**5. Proveedores**

- **Intereses:**
  - Ventas consistentes y crecientes
  - Pagos puntuales
  - Relación comercial estable

- **Necesidades:**
  - Información sobre demanda y rotación de productos
  - Órdenes de compra organizadas
  - Comunicación eficiente

- **Influencia:** Baja
- **Impacto:** Bajo (se benefician indirectamente de un negocio más eficiente)

#### 2.4.3 Stakeholders del Proyecto (Equipo de Desarrollo)

**6. Equipo de Desarrollo**

- **Intereses:**
  - Entregar un sistema de calidad
  - Cumplir con plazos y presupuesto
  - Satisfacer necesidades del cliente
  - Aplicar mejores prácticas técnicas

- **Necesidades:**
  - Requerimientos claros y validados
  - Acceso a información del negocio
  - Feedback continuo del cliente
  - Recursos adecuados para el desarrollo

- **Influencia:** Alta (diseñan e implementan la solución)
- **Impacto:** Alto (calidad de la solución depende de ellos)

**7. Product Owner / Representante del Cliente**

- **Intereses:**
  - Asegurar que el sistema cumple con necesidades reales
  - Priorizar funcionalidades según valor de negocio
  - Validar que la solución resuelve los problemas identificados

- **Necesidades:**
  - Comunicación constante con stakeholders primarios
  - Validación de requerimientos
  - Aprobación de entregas incrementales

- **Influencia:** Alta (define prioridades y valida entregas)
- **Impacto:** Alto (asegura alineación con necesidades del negocio)

#### 2.4.4 Análisis de Intereses y Conflictos Potenciales

**Conflictos potenciales y cómo resolverlos:**

1. **Dueño vs. Complejidad del Sistema:**
   - **Conflicto:** Dueño quiere funcionalidades completas pero sistema simple
   - **Resolución:** Diseño de UI/UX intuitivo, capacitación adecuada, funcionalidades progresivas

2. **Cumplimiento SUNAT vs. Facilidad de Uso:**
   - **Conflicto:** Normativas complejas vs. necesidad de simplicidad
   - **Resolución:** Automatización máxima de procesos SUNAT, configuración guiada, soporte técnico

3. **Costo vs. Funcionalidades:**
   - **Conflicto:** Presupuesto limitado vs. necesidad de sistema completo
   - **Resolución:** Priorización de funcionalidades core, modelo de precios accesible, ROI demostrable

4. **Tiempo de Implementación vs. Necesidad Inmediata:**
   - **Conflicto:** Necesidad urgente vs. tiempo de desarrollo adecuado
   - **Resolución:** Entregas incrementales, funcionalidades críticas primero, MVP funcional temprano

#### 2.4.5 Matriz de Poder e Interés

| Stakeholder | Poder | Interés | Estrategia |
|-------------|-------|---------|------------|
| Dueño/Propietario | Alto | Alto | **Gestionar de cerca** - Comunicación constante, involucramiento en decisiones |
| Empleado/Vendedor | Medio | Alto | **Mantener satisfecho** - Capacitación, soporte, considerar feedback |
| Clientes | Medio | Medio | **Mantener informado** - Comunicar beneficios, recopilar feedback |
| SUNAT | Alto | Medio | **Cumplir requerimientos** - Asegurar conformidad normativa, pruebas tempranas |
| Equipo de Desarrollo | Alto | Alto | **Gestionar de cerca** - Recursos adecuados, comunicación clara |
| Product Owner | Alto | Alto | **Gestionar de cerca** - Alineación constante, validación continua |

### 2.5 Síntesis del Análisis

El análisis revela que las licorerías pequeñas en Piura enfrentan un **problema sistémico** que combina:

1. **Ausencia de tecnología adecuada** para su tamaño y presupuesto
2. **Limitaciones de recursos humanos** (1-2 personas para múltiples funciones)
3. **Desconocimiento de normativas** y complejidad de cumplimiento
4. **Falta de visibilidad** sobre el estado real del negocio
5. **Limitaciones financieras** que impiden inversión en soluciones costosas

**El impacto es significativo:**
- Pérdidas financieras estimadas de **S/. 33,000 anuales** por licorería
- Ineficiencia operativa que limita crecimiento
- Riesgos legales por incumplimiento normativo
- Insatisfacción de clientes y pérdida de competitividad

**La oportunidad es clara:**
- Implementar un sistema integral, económico y diseñado específicamente para licorerías pequeñas
- Combinar digitalización, cumplimiento normativo e inteligencia artificial
- Transformar operaciones manuales en procesos automatizados e inteligentes
- Proporcionar herramientas avanzadas normalmente disponibles solo para grandes empresas

**Los stakeholders clave son:**
- **Dueño/Propietario:** Principal tomador de decisiones y usuario diario
- **Empleado/Vendedor:** Usuario constante que necesita simplicidad
- **Clientes:** Beneficiarios indirectos de mejor servicio
- **SUNAT:** Requisitos normativos que deben cumplirse obligatoriamente

Este análisis fundamenta la necesidad y viabilidad del proyecto, proporcionando una base sólida para el diseño de la solución y la gestión de stakeholders durante el desarrollo e implementación.

---

## 3. OBJETIVOS DEL PROYECTO

### 2.1 Objetivo General

Desarrollar e implementar un sistema web y aplicación móvil con inteligencia artificial que permita a las licorerías pequeñas en Piura (1-2 empleados) gestionar de manera integral y automatizada sus operaciones de venta, inventario, facturación y promociones, mejorando la eficiencia operativa, cumpliendo normativas fiscales y elevando la satisfacción del cliente mediante recomendaciones inteligentes y predicciones automatizadas.

### 2.2 Objetivos Específicos

1. **Digitalizar el proceso de ventas:** Implementar sistema de punto de venta (POS) rápido e intuitivo optimizado para uso con personal mínimo
2. **Automatizar emisión de comprobantes:** Integración con SUNAT para boletas y facturas electrónicas
3. **Controlar inventario en tiempo real:** Sistema de gestión de stock con alertas inteligentes y predicción de demanda
4. **Gestionar promociones y packs:** Módulo flexible con sugerencias automáticas de IA basadas en patrones de venta
5. **Generar reportes analíticos:** Dashboard con métricas clave de negocio y insights automatizados
6. **Desarrollar app móvil:** Aplicación para gestión desde dispositivos móviles
7. **Implementar programa de fidelización:** Sistema de puntos y descuentos para clientes frecuentes
8. **Integrar inteligencia artificial:** Sistema de recomendaciones de productos, predicción de demanda y optimización automática de inventario
9. **Simplificar operaciones:** Interfaz intuitiva que minimice la curva de aprendizaje para negocios pequeños

---

## 4. ALCANCE DEL SISTEMA

### 3.1 Módulos del Sistema

#### 3.1.1 Módulo de Ventas (POS - Point of Sale)

- **Interfaz de venta rápida:**
  - Búsqueda de productos por código de barras, nombre o categoría
  - Carrito de compra con cálculo automático de totales
  - Aplicación automática de promociones y descuentos
  - Múltiples formas de pago (efectivo, tarjeta, transferencia)
  - Cálculo de vuelto automático
  - Impresión de tickets de venta
- **Gestión de ventas:**
  - Historial completo de ventas
  - Anulación de ventas (con autorización)
  - Devoluciones y cambios
  - Ventas a crédito (opcional)
  - Separación de ventas por vendedor

#### 3.1.2 Módulo de Facturación Electrónica

- **Emisión de comprobantes:**
  - Boletas de venta electrónicas
  - Facturas electrónicas (con RUC)
  - Notas de crédito y débito
  - Tickets de venta (sin comprobante)
- **Integración SUNAT:**
  - Conexión con API de SUNAT para envío de comprobantes
  - Generación de archivos XML y PDF
  - Consulta de estado de comprobantes
  - Resumen diario de boletas (RCB)
- **Configuración:**
  - Datos del establecimiento
  - Series y numeración de comprobantes
  - Impresoras fiscales (opcional)

#### 3.1.3 Módulo de Control de Inventario

- **Gestión de productos:**
  - Registro de productos con:
    - Código de barras
    - Nombre, marca, categoría
    - Precio de compra y venta
    - Stock mínimo y máximo
    - Fecha de vencimiento (para productos perecederos)
    - Ubicación en almacén
    - Imágenes del producto
  - Categorización (cervezas, vinos, licores, whiskies, etc.)
  - Unidades de medida (unidad, caja, pack)
- **Control de stock:**
  - Actualización automática con cada venta
  - Alertas de stock bajo
  - Alertas de productos próximos a vencer
  - Historial de movimientos de inventario
  - Ajustes de inventario (entradas y salidas manuales)
- **Compras y proveedores:**
  - Registro de compras a proveedores
  - Gestión de proveedores
  - Actualización de precios desde compras
  - Control de órdenes de compra

#### 3.1.4 Módulo de Promociones y Packs

- **Gestión de promociones:**
  - Creación de packs de productos (ej: "Pack Cerveza 6 unidades")
  - Descuentos por porcentaje o monto fijo
  - Descuentos por volumen (ej: "2x1", "Lleva 3 paga 2")
  - Promociones por categoría
  - Promociones por fecha (temporales)
  - Promociones combinadas
- **Aplicación automática:**
  - Detección automática de promociones aplicables
  - Cálculo de descuentos en tiempo real
  - Visualización de ahorro para el cliente
- **Reportes de promociones:**
  - Productos más vendidos en promoción
  - Efectividad de promociones
  - Rentabilidad de packs

#### 3.1.5 Módulo de Clientes y Fidelización

- **Gestión de clientes:**
  - Registro de clientes (nombre, DNI/RUC, teléfono, email)
  - Historial de compras por cliente
  - Clientes frecuentes
  - Segmentación de clientes
- **Programa de fidelización:**
  - Sistema de puntos por compra
  - Canje de puntos por descuentos o productos
  - Tarjetas de cliente frecuente
  - Descuentos especiales para clientes VIP

#### 3.1.6 Módulo de Reportes y Analytics

- **Dashboard ejecutivo:**
  - Ventas del día, semana, mes
  - Productos más vendidos
  - Categorías más vendidas
  - Comparativa de períodos
  - Insights automáticos generados por IA
- **Reportes de ventas:**
  - Reporte diario de ventas
  - Reporte por período
  - Reporte por forma de pago
  - Análisis de tendencias con predicciones
- **Reportes de inventario:**
  - Productos con stock bajo
  - Productos próximos a vencer
  - Rotación de productos
  - Valor de inventario
  - Productos sin movimiento
- **Reportes financieros:**
  - Ingresos vs. gastos
  - Margen de ganancia por producto
  - Rentabilidad por categoría
  - Flujo de caja
- **Exportación:**
  - Exportar reportes a Excel/PDF
  - Envío automático de reportes por email

#### 3.1.8 Módulo de Inteligencia Artificial

- **Recomendaciones inteligentes de productos:**
  - Sugerencias de productos complementarios durante la venta
  - "Clientes que compraron X también compraron Y"
  - Recomendaciones basadas en historial del cliente
  - Sugerencias de productos similares por categoría o precio
- **Predicción de demanda:**
  - Predicción de productos que se agotarán en los próximos días
  - Sugerencias de cantidad a comprar basadas en historial
  - Predicción de ventas por producto para próximas semanas
  - Alertas proactivas de productos que necesitan reposición
- **Optimización de inventario:**
  - Sugerencias de stock mínimo y máximo por producto
  - Identificación de productos de baja rotación
  - Recomendaciones de productos para promocionar
  - Análisis de productos estacionales
- **Sugerencias automáticas de promociones:**
  - Recomendaciones de packs basadas en productos frecuentemente comprados juntos
  - Sugerencias de descuentos para productos de baja rotación
  - Promociones inteligentes por temporada o fecha
  - Análisis de efectividad de promociones pasadas
- **Análisis de patrones de compra:**
  - Identificación de horarios pico de ventas
  - Patrones de compra por día de la semana
  - Productos más vendidos por temporada
  - Segmentación automática de clientes
- **Asistente virtual (Chatbot):**
  - Consultas rápidas sobre productos disponibles
  - Consultas de precios y promociones
  - Ayuda con el uso del sistema
  - Respuestas automáticas a preguntas frecuentes

#### 3.1.7 Módulo de Inteligencia Artificial (Detalle)

**Funcionalidades de IA específicas para licorerías pequeñas:**

##### 3.1.7.1 Recomendaciones Inteligentes de Productos

- **Durante la venta:**
  - Al agregar un producto al carrito, el sistema sugiere productos complementarios
  - Ejemplo: Si el cliente compra cerveza, sugiere snacks, hielo, o limones
  - Basado en análisis de productos frecuentemente comprados juntos
  - Muestra sugerencias con imagen y precio para facilitar la venta

- **Recomendaciones personalizadas:**
  - Para clientes frecuentes: "Basado en tus compras anteriores..."
  - Productos similares por categoría, precio o marca
  - Nuevos productos que podrían interesar según historial

##### 3.1.7.2 Predicción de Demanda

- **Alertas proactivas:**
  - Predice qué productos se agotarán en los próximos 3-7 días
  - Sugiere cantidad a comprar basada en historial y tendencias
  - Considera factores estacionales (fiestas, verano, etc.)
  - Ahorra tiempo al dueño al automatizar decisiones de compra

- **Análisis de tendencias:**
  - Identifica productos con demanda creciente
  - Detecta productos con demanda decreciente
  - Predicción de ventas semanales/mensuales por producto

##### 3.1.7.3 Optimización de Inventario

- **Sugerencias automáticas:**
  - Stock mínimo y máximo recomendado por producto
  - Identificación de productos con exceso de inventario
  - Productos que no se mueven y necesitan promoción
  - Análisis de rotación de inventario

- **Gestión inteligente:**
  - Priorización de productos a comprar
  - Sugerencias de productos para liquidar
  - Optimización del capital invertido en inventario

##### 3.1.7.4 Sugerencias Automáticas de Promociones

- **Packs inteligentes:**
  - Sugiere packs basados en productos frecuentemente comprados juntos
  - Calcula precio óptimo del pack para maximizar ganancias
  - Ejemplo: "Pack Fiesta" con cerveza, snacks y hielo

- **Promociones estratégicas:**
  - Sugiere descuentos para productos de baja rotación
  - Promociones por temporada (verano, fiestas, etc.)
  - Análisis de efectividad de promociones pasadas
  - Sugerencias de "combo del día" basado en stock disponible

##### 3.1.7.5 Análisis de Patrones y Insights

- **Patrones de venta:**
  - Horarios pico de ventas (para optimizar personal)
  - Días de la semana con más ventas
  - Productos más vendidos por temporada
  - Análisis de comportamiento de clientes

- **Insights automáticos:**
  - "Tu producto más rentable es..."
  - "Deberías promocionar estos productos..."
  - "Estos productos están generando pérdidas..."
  - Alertas de oportunidades de negocio

##### 3.1.7.6 Asistente Virtual (Chatbot)

- **Consultas rápidas:**
  - "¿Qué cervezas tienes disponibles?"
  - "¿Cuál es el precio de...?"
  - "¿Hay promociones activas?"
  - Ayuda con el uso del sistema

- **Beneficios para negocio pequeño:**
  - Reduce consultas repetitivas al dueño
  - Disponible 24/7 para clientes
  - Libera tiempo para otras tareas

**Ventajas de IA para licorerías pequeñas:**
- **Automatiza decisiones:** El dueño no necesita experiencia previa para tomar decisiones de compra o promociones
- **Ahorra tiempo:** Reduce tiempo en análisis manual de datos
- **Mejora ventas:** Recomendaciones aumentan el ticket promedio
- **Reduce pérdidas:** Predicción de demanda evita desabastecimiento y exceso de inventario
- **Competitividad:** Herramientas de IA normalmente disponibles solo para grandes empresas

#### 3.1.8 Módulo de Configuración

- **Configuración general:**
  - Datos del negocio
  - Configuración de impresoras
  - Configuración de moneda
  - Parámetros del sistema
- **Usuarios y permisos:**
  - Gestión de usuarios (administrador, vendedor, cajero)
  - Roles y permisos granulares
  - Control de acceso por módulo
- **Configuración de facturación:**
  - Datos para facturación electrónica
  - Certificados digitales
  - Configuración de series

### 3.2 Usuarios del Sistema

**Adaptado para licorerías pequeñas (1-2 personas):**

1. **Administrador/Dueño:** 
   - Acceso completo al sistema
   - Configuración general
   - Gestión de inventario y compras
   - Reportes y analytics con insights de IA
   - Gestión de promociones (con sugerencias automáticas)
   - Configuración de facturación electrónica
   - Visualización de recomendaciones y predicciones de IA
   - Configuración de parámetros de modelos de IA

2. **Vendedor/Empleado:**
   - Proceso de venta (POS) con recomendaciones en tiempo real
   - Consulta de productos y precios
   - Aplicación de promociones
   - Registro básico de clientes
   - Consulta de stock disponible
   - Visualización de recomendaciones de productos para clientes
   - Uso de chatbot para consultas rápidas

**Características especiales para uso con 1 persona:**
- **Interfaz simplificada:** Diseñada para que el dueño pueda hacer todo rápidamente
- **Modo rápido:** Atajos de teclado para operaciones comunes
- **Dashboard unificado:** Toda la información importante en una sola pantalla
- **Alertas inteligentes:** El sistema avisa proactivamente sobre acciones necesarias
- **Automatización:** La IA reduce la necesidad de decisiones manuales
- **Sincronización automática:** No requiere gestión manual de datos entre módulos

**Nota:** En licorerías con solo 1 persona (el dueño), este usuario tendrá ambos roles. El sistema está diseñado para ser simple e intuitivo, permitiendo que una sola persona gestione todas las operaciones eficientemente con ayuda de la IA.

### 3.3 Finalidad del Sistema Web y Aplicación Móvil

#### 3.3.1 Finalidad del Sistema Web

El **Sistema Web** es la plataforma principal de gestión administrativa y operativa de la licorería, diseñada para ser utilizada desde computadoras de escritorio, laptops o tablets en el establecimiento. Su finalidad principal es:

**Gestión Administrativa Integral:**
- **Control centralizado:** Administrar todos los aspectos del negocio desde una única plataforma web accesible desde cualquier navegador
- **Gestión de inventario:** Registrar productos, actualizar precios, controlar stock, gestionar categorías y proveedores
- **Configuración del sistema:** Configurar usuarios, permisos, parámetros de facturación electrónica, impresoras y preferencias del negocio
- **Gestión de promociones:** Crear y administrar packs, descuentos y promociones especiales con sugerencias automáticas de IA
- **Programa de fidelización:** Gestionar clientes, puntos de fidelización y programas de descuentos

**Análisis y Reportes:**
- **Dashboard ejecutivo:** Visualizar métricas clave del negocio en tiempo real (ventas del día, productos más vendidos, alertas de stock)
- **Reportes analíticos:** Generar reportes de ventas, inventario, rentabilidad y análisis de tendencias
- **Insights de IA:** Visualizar recomendaciones de productos, predicciones de demanda y sugerencias de optimización generadas por inteligencia artificial
- **Exportación de datos:** Exportar reportes a Excel/PDF para análisis externos o presentaciones

**Punto de Venta (POS Web):**
- **Ventas desde navegador:** Realizar ventas directamente desde el sistema web cuando no se dispone de la aplicación POS dedicada
- **Búsqueda rápida:** Buscar productos por código de barras, nombre o categoría
- **Aplicación automática de promociones:** El sistema detecta y aplica automáticamente promociones y descuentos
- **Emisión de comprobantes:** Generar boletas y facturas electrónicas integradas con SUNAT

**Ventajas del Sistema Web:**
- ✅ Accesible desde cualquier dispositivo con navegador (no requiere instalación)
- ✅ Interfaz completa y funcional para gestión administrativa
- ✅ Ideal para tareas que requieren pantalla grande (reportes, análisis, configuración)
- ✅ Sincronización en tiempo real con todos los módulos
- ✅ Acceso desde múltiples ubicaciones (casa, oficina, tienda)

#### 3.3.2 Finalidad de la Aplicación Móvil

La **Aplicación Móvil** es una plataforma complementaria diseñada específicamente para dispositivos móviles (smartphones y tablets), enfocada en operaciones rápidas y gestión desde cualquier ubicación. Su finalidad principal es:

**Gestión Móvil y Portabilidad:**
- **Acceso desde cualquier lugar:** Gestionar el negocio desde casa, en tránsito o en cualquier ubicación sin necesidad de estar físicamente en la tienda
- **Operaciones rápidas:** Realizar tareas comunes de forma rápida y eficiente desde el móvil
- **Sincronización en tiempo real:** Todos los datos se sincronizan automáticamente con el sistema web

**Funcionalidades Principales de la App Móvil:**

**1. Gestión de Ventas Móvil:**
- Realizar ventas rápidas desde el móvil cuando no se está en la tienda
- Consultar productos y precios en tiempo real
- Aplicar promociones y descuentos
- Emitir comprobantes electrónicos desde el móvil

**2. Control de Inventario Móvil:**
- Consultar stock disponible de cualquier producto
- Registrar entradas de inventario (compras) desde el móvil
- Visualizar alertas de stock bajo y productos próximos a vencer
- Realizar ajustes de inventario rápidos

**3. Consulta de Reportes:**
- Visualizar dashboard con métricas clave del negocio
- Consultar ventas del día, semana o mes
- Ver productos más vendidos
- Revisar alertas y notificaciones importantes

**4. Recomendaciones de IA:**
- Recibir notificaciones push con recomendaciones de productos a comprar
- Visualizar predicciones de demanda
- Consultar sugerencias de promociones inteligentes

**5. Gestión de Clientes:**
- Registrar nuevos clientes desde el móvil
- Consultar historial de compras de clientes
- Gestionar programa de fidelización

**Ventajas de la Aplicación Móvil:**
- ✅ Portabilidad: Gestión desde cualquier lugar con conexión a internet
- ✅ Rapidez: Operaciones rápidas optimizadas para pantallas táctiles
- ✅ Notificaciones: Alertas push sobre acciones importantes (stock bajo, promociones, etc.)
- ✅ Offline básico: Funcionalidad limitada sin conexión (consulta de productos, precios)
- ✅ Ideal para dueños que necesitan gestionar el negocio fuera de la tienda

#### 3.3.3 Complementariedad entre Sistema Web y App Móvil

**Arquitectura Complementaria:**
- Ambos sistemas comparten la misma base de datos y API backend
- Los cambios realizados en uno se reflejan inmediatamente en el otro
- Sincronización bidireccional en tiempo real

**Casos de Uso por Plataforma:**

**Sistema Web - Ideal para:**
- Configuración inicial del sistema
- Gestión detallada de inventario y productos
- Análisis de reportes y métricas
- Creación de promociones complejas
- Gestión administrativa completa
- Trabajo desde computadora en la tienda

**App Móvil - Ideal para:**
- Consultas rápidas mientras se está fuera de la tienda
- Ventas rápidas desde ubicaciones remotas
- Recepción de alertas y notificaciones
- Gestión básica de inventario en movimiento
- Consulta de reportes mientras se está fuera

**Sinergia:**
- El dueño puede configurar promociones complejas desde el sistema web y aplicarlas desde la app móvil
- Los reportes generados en el sistema web pueden consultarse desde la app móvil
- Las ventas realizadas desde cualquier plataforma se registran en el mismo sistema
- Las recomendaciones de IA generadas en el backend están disponibles en ambas plataformas

**Nota:** Para licorerías pequeñas (1-2 empleados), el sistema web es la plataforma principal y esencial, mientras que la app móvil es una funcionalidad complementaria que puede desarrollarse en fases posteriores si se requiere. El sistema web + POS cubre todas las necesidades core del negocio.

### 3.4 Funcionalidades Excluidas (Fuera del Alcance)

- Sistema contable completo
- Gestión de nómina de empleados
- Integración con sistemas bancarios para pagos
- E-commerce (venta online)
- App para clientes (solo portal web opcional)
- Sistema de delivery
- Integración con redes sociales

### 3.5 Funcionalidades Opcionales (Para Fases Posteriores)

**Para el proyecto de 14 semanas, las siguientes funcionalidades quedan como opcionales:**

- **App Móvil para gestión:** Se prioriza el sistema web y POS. La app móvil puede desarrollarse en una fase posterior (semanas 15-18) si se requiere.
- **Funcionalidades avanzadas de IA:** Modelos más complejos de IA pueden mejorarse continuamente después del lanzamiento.
- **Integraciones adicionales:** Sistemas de delivery, integraciones con redes sociales, etc.

**Nota:** El sistema está diseñado para funcionar completamente con web + POS, cubriendo todas las necesidades core de la licorería.

---

## 5. ARQUITECTURA Y TECNOLOGÍAS

### 4.1 Arquitectura del Sistema

**Arquitectura:** Cliente-Servidor con API REST, sistema POS y servicios en la nube

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Web Frontend   │     │  Mobile App      │     │  POS Terminal   │
│   (React.js)    │     │ (React Native)   │     │  (Electron)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   API REST Backend        │
                    │   (Spring Boot)           │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼──────┐         ┌────────▼────────┐      ┌────────▼────────┐
│  PostgreSQL  │         │      Redis       │      │   SUNAT API      │
│  Database    │         │     (Cache)      │      │   Integration    │
└──────────────┘         └──────────────────┘      └──────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Servicio de IA          │
                    │   (Python/FastAPI)        │
                    │   - ML Models             │
                    │   - Recomendaciones       │
                    │   - Predicciones          │
                    └───────────────────────────┘
```

### 4.2 Stack Tecnológico

#### 4.2.1 Frontend Web
- **Framework:** React.js 18+ con TypeScript
- **UI Library:** Material-UI (MUI) v5 o Ant Design
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Gráficos:** Chart.js / Recharts
- **Impresión:** React-to-Print

#### 4.2.2 POS (Point of Sale)
- **Framework:** Electron (para aplicación de escritorio)
- **Tecnologías:** React + TypeScript (mismo código base que web)
- **Hardware:** Integración con lectores de código de barras, impresoras térmicas

#### 4.2.3 Backend
- **Framework:** Spring Boot 3.x (Java 17+)
- **ORM:** JPA/Hibernate
- **Validación:** Bean Validation
- **Autenticación:** Spring Security con JWT
- **Documentación API:** Swagger/OpenAPI
- **Integración SUNAT:** Librerías Java para facturación electrónica

#### 4.2.4 Base de Datos
- **Principal:** PostgreSQL 15+
- **Caché:** Redis 7+ (para sesiones y datos frecuentes)
- **Migraciones:** Flyway o Liquibase

#### 4.2.5 App Móvil
- **Framework:** React Native 0.72+
- **Navegación:** React Navigation
- **State Management:** Redux Toolkit
- **Código de barras:** react-native-vision-camera o react-native-barcode-scanner

#### 4.2.6 Servicio de Inteligencia Artificial
- **Framework:** Python 3.10+ con FastAPI
- **Machine Learning:**
  - **Scikit-learn:** Para modelos de predicción de demanda y clustering
  - **Pandas:** Para análisis de datos y procesamiento
  - **NumPy:** Para cálculos numéricos
  - **Joblib:** Para persistencia de modelos entrenados
- **Algoritmos de IA:**
  - **Filtrado colaborativo:** Para recomendaciones de productos
  - **Series temporales (ARIMA/Prophet):** Para predicción de demanda
  - **Clustering (K-means):** Para segmentación de clientes
  - **Regresión:** Para predicción de ventas
- **Integración:** API REST que se comunica con el backend Spring Boot

#### 4.2.7 Servicios y APIs Externas
- **Facturación Electrónica:** API de SUNAT (OSE - Operador de Servicios Electrónicos)
- **Almacenamiento de Archivos:** AWS S3 o local
- **Backup:** Backup automático de base de datos
- **Hosting:** AWS EC2 / DigitalOcean / servidor local

#### 4.2.7 Herramientas de Desarrollo
- **Control de Versiones:** Git / GitHub
- **CI/CD:** GitHub Actions o GitLab CI
- **Testing:**
  - JUnit (Backend)
  - Jest (Frontend)
  - React Testing Library
- **Linting:** ESLint, Prettier
- **Documentación API:** Swagger UI

### 4.3 Modelo de Datos (Entidades Principales)

```
Usuario
├── id, username, email, password, rol, nombre, activo

Producto
├── id, codigo_barras, nombre, marca, categoria_id, precio_compra, 
    precio_venta, stock_actual, stock_minimo, stock_maximo, 
    fecha_vencimiento, imagen, activo

Categoria
├── id, nombre, descripcion, activa

Venta
├── id, numero_venta, fecha, usuario_id, cliente_id, subtotal, 
    descuento, impuesto, total, forma_pago, estado

DetalleVenta
├── id, venta_id, producto_id, cantidad, precio_unitario, 
    descuento, subtotal

Cliente
├── id, tipo_documento, numero_documento, nombre, telefono, 
    email, puntos_fidelizacion

ComprobanteElectronico
├── id, venta_id, tipo_comprobante, serie, numero, 
    xml_enviado, pdf_generado, estado_sunat, fecha_emision

Promocion
├── id, nombre, tipo, descuento_porcentaje, descuento_monto, 
    fecha_inicio, fecha_fin, activa

PromocionProducto
├── id, promocion_id, producto_id, cantidad_minima, 
    cantidad_gratis (para 2x1, etc.)

Pack
├── id, nombre, precio_pack, activo

PackProducto
├── id, pack_id, producto_id, cantidad

MovimientoInventario
├── id, producto_id, tipo_movimiento, cantidad, motivo, 
    usuario_id, fecha

Proveedor
├── id, razon_social, ruc, direccion, telefono, email

Compra
├── id, proveedor_id, fecha, total, usuario_id

DetalleCompra
├── id, compra_id, producto_id, cantidad, precio_unitario, 
    subtotal
```

### 4.4 Seguridad

- **Autenticación:** JWT con refresh tokens
- **Autorización:** Role-Based Access Control (RBAC)
- **Encriptación:** HTTPS/TLS para todas las comunicaciones
- **Validación:** Validación de entrada en backend y frontend
- **SQL Injection:** Prevención mediante ORM (JPA/Hibernate)
- **XSS:** Sanitización de inputs
- **CORS:** Configuración restrictiva
- **Datos sensibles:** Encriptación de información de clientes y comprobantes

---

## 6. METODOLOGÍA DE DESARROLLO

### 5.1 Metodología Principal

**Metodología Ágil - Scrum**

Se utilizará Scrum debido a:
- Necesidad de adaptación a cambios en requerimientos
- Entrega incremental de valor
- Feedback continuo del cliente
- Mejora continua del proceso

### 5.2 Roles del Equipo

**Equipo optimizado para proyecto de 14 semanas:**

1. **Product Owner (PO):** Representante del cliente, define prioridades
2. **Scrum Master (SM):** Facilita el proceso Scrum, elimina impedimentos (puede ser el mismo PO)
3. **Desarrollador Full Stack Senior (1):** Desarrollo backend y frontend web (Spring Boot + React)
4. **Desarrollador Backend/IA (1):** Desarrollo de APIs e integración de IA (Python integrado en Spring Boot)
5. **Desarrollador POS (1):** Desarrollo de aplicación POS (app móvil opcional para fases posteriores)
6. **QA/Tester (1 part-time):** Pruebas y aseguramiento de calidad
7. **Diseñador UX/UI (1 part-time):** Diseño de interfaces (enfocado en simplicidad)

**Nota:** Equipo enfocado en entregar funcionalidades core (Web + POS + IA) en 14 semanas. App móvil queda como funcionalidad opcional para fases posteriores.

### 5.3 Eventos Scrum

- **Sprint Planning:** Inicio de cada sprint (2 horas)
- **Daily Standup:** Reunión diaria de 15 minutos
- **Sprint Review:** Demostración al cliente (2 horas)
- **Sprint Retrospective:** Mejora del proceso (1 hora)
- **Sprint Duration:** 2 semanas

### 5.4 Prácticas de Desarrollo

#### 5.4.1 Control de Versiones
- **Git Flow:** Estrategia de ramas
  - `main`: Código en producción
  - `develop`: Código en desarrollo
  - `feature/*`: Nuevas funcionalidades
  - `hotfix/*`: Correcciones urgentes

#### 5.4.2 Code Review
- Todas las pull requests requieren aprobación de al menos 1 revisor

#### 5.4.3 Testing
- **Unit Tests:** Cobertura mínima del 70%
- **Integration Tests:** Para APIs críticas
- **E2E Tests:** Para flujos principales

#### 5.4.4 CI/CD
- **Continuous Integration:** Tests automáticos en cada push
- **Continuous Deployment:** Deploy automático a staging

---

## 7. PLAN DE TRABAJO Y CRONOGRAMA

### 6.1 Fases del Proyecto

#### FASE 1: Análisis y Diseño (2 semanas)
**Sprint 1 (Semana 1-2)**
- Reuniones con stakeholders para refinar requerimientos
- Análisis de procesos actuales de la licorería
- Diseño de arquitectura técnica
- Diseño de base de datos
- Creación de mockups y prototipos UI/UX
- Definición de APIs (OpenAPI spec)
- Investigación de integración con SUNAT
- Setup de repositorios y herramientas

**Entregables:**
- Documento de requerimientos detallado
- Diagramas de arquitectura
- Modelo de datos (ERD)
- Mockups de interfaces
- Especificación de APIs

#### FASE 2: Desarrollo Backend (4 semanas)
**Sprint 2 (Semana 3-4): Backend Core e Integración SUNAT**
- Setup de proyecto Spring Boot
- Configuración de base de datos PostgreSQL
- Implementación de autenticación y autorización (simplificada para 1-2 usuarios)
- CRUD de usuarios y roles (solo Admin y Vendedor)
- CRUD de productos y categorías
- CRUD de clientes
- Integración con API de SUNAT (paralelo)
- Generación de XML y PDF de comprobantes

**Sprint 3 (Semana 5-6): Módulos Principales e IA Básica**
- Módulo de ventas (lógica de negocio)
- Módulo de inventario
- Sistema de promociones y packs
- Gestión de proveedores y compras
- Integración de IA: Modelos básicos de recomendaciones (Python integrado en Spring Boot)
- Envío y consulta de comprobantes SUNAT
- Manejo de errores y reintentos

**Nota:** Para optimizar tiempo, la IA se integra directamente en el backend Spring Boot usando Python subproceso o bibliotecas Java, en lugar de servicio separado.

#### FASE 3: Desarrollo Frontend Web (3 semanas)
**Sprint 4 (Semana 7-8): Interfaces Principales (Paralelo con Backend)**
- Setup de proyecto React
- Login y autenticación
- Dashboard principal
- Módulo de gestión de productos (UI)
- Módulo de gestión de inventario (UI)
- Interfaz de punto de venta (web)

**Sprint 5 (Semana 9): Módulos Finales**
- Módulo de promociones (UI)
- Módulo de reportes y analytics con visualización de IA
- Integración completa frontend-backend
- Integración de recomendaciones de IA en UI

#### FASE 4: Desarrollo POS (2 semanas)
**Sprint 6 (Semana 10-11): POS Completo**
- Setup de aplicación Electron
- Interfaz de venta optimizada para POS
- Integración con lectores de código de barras
- Integración con impresoras térmicas
- Funcionalidad offline básica
- Sincronización con servidor
- Manejo de múltiples formas de pago
- Impresión de tickets
- Optimizaciones de rendimiento

#### FASE 5: IA Avanzada y Optimización (1 semana)
**Sprint 7 (Semana 12): Modelos de IA y Optimización**
- Desarrollo completo de modelos de ML:
  - Modelo de recomendaciones (filtrado colaborativo)
  - Modelo de predicción de demanda (series temporales simplificado)
  - Modelo de clustering de clientes (opcional)
- Integración completa de recomendaciones de IA
- Dashboard de predicciones y sugerencias
- Entrenamiento inicial de modelos con datos de prueba
- Optimización de rendimiento general

**Nota:** App móvil se puede desarrollar en fase posterior o como opcional. Para 14 semanas, el enfoque está en web + POS.

#### FASE 6: Testing y QA (1 semana)
**Sprint 8 (Semana 13)**
- Testing de todos los módulos críticos
- Pruebas de integración con SUNAT
- Pruebas básicas de modelos de IA
- Pruebas de rendimiento
- Pruebas de seguridad
- Pruebas de usabilidad (especialmente para uso con 1 persona)
- Corrección de bugs críticos
- Ajustes finales

#### FASE 7: Despliegue y Capacitación (1 semana)
**Semana 14**
- Configuración de servidores de producción
- Migración de datos (si aplica)
- Deploy a producción
- Pruebas en producción
- Capacitación simplificada (optimizada para 1-2 personas)
- Entrega de documentación básica
- Entrenamiento inicial de modelos con datos reales

### 6.2 Hitos del Proyecto

| Hito | Fecha | Entregable |
|------|-------|------------|
| Hito 1 | Semana 2 | Diseño y arquitectura aprobados |
| Hito 2 | Semana 6 | Backend completo con integración SUNAT e IA básica |
| Hito 3 | Semana 9 | Sistema web funcional |
| Hito 4 | Semana 11 | POS funcional |
| Hito 5 | Semana 12 | Modelos de IA completos e integrados |
| Hito 6 | Semana 13 | Sistema completo probado |
| Hito 7 | Semana 14 | Sistema en producción |

### 6.3 Diagrama de Gantt (Resumen - 14 semanas)

```
Fase 1: Análisis        [████]
Fase 2: Backend+IA      [████████]
Fase 3: Frontend Web    [██████]
Fase 4: POS             [████]
Fase 5: IA Avanzada      [██]
Fase 6: Testing          [██]
Fase 7: Deploy           [██]

Semanas: 1  2  3  4  5  6  7  8  9  10 11 12 13 14
```

**Nota:** Desarrollo optimizado con trabajo paralelo donde sea posible. App móvil queda como funcionalidad opcional para fases posteriores.

---

## 8. RECURSOS Y EQUIPO

### 7.1 Equipo de Desarrollo

| Rol | Cantidad | Responsabilidades |
|-----|----------|-------------------|
| Project Manager / Scrum Master | 1 | Gestión del proyecto, facilitación Scrum |
| Product Owner | 1 | Definición de requerimientos, priorización |
| Desarrollador Backend Senior | 1 | Arquitectura backend, integración SUNAT |
| Desarrollador Backend | 1 | Desarrollo de módulos backend |
| Desarrollador Frontend Web | 1 | Desarrollo de interfaz web |
| Desarrollador POS | 1 | Desarrollo de aplicación POS |
| Desarrollador Mobile | 1 | Desarrollo de app móvil |
| QA/Tester | 1 | Pruebas y aseguramiento de calidad |
| Diseñador UX/UI | 1 (part-time) | Diseño de interfaces |

### 7.2 Infraestructura y Herramientas

- **Servidores:** AWS EC2, DigitalOcean o servidor dedicado
- **Base de Datos:** PostgreSQL en servidor dedicado o RDS
- **Almacenamiento:** AWS S3 o local para archivos
- **Dominio y SSL:** Certificado SSL para HTTPS
- **Hardware POS:** Computadoras/tablets, lectores de código de barras, impresoras térmicas
- **Herramientas de Desarrollo:** Licencias de IDE, herramientas de diseño
- **SUNAT:** Cuenta con OSE (Operador de Servicios Electrónicos) para facturación

---

## 9. PRESUPUESTO ESTIMADO

### 9.1 Costos de Desarrollo (14 semanas)

**Presupuesto optimizado para proyecto de 14 semanas:**

| Concepto | Cantidad | Costo Unitario (USD) | Total (USD) |
|----------|----------|---------------------|-------------|
| Project Manager (14 semanas) | 1 | 2,000/semana | 28,000 |
| Desarrollador Full Stack Senior (12 semanas) | 1 | 2,000/semana | 24,000 |
| Desarrollador Backend/IA (10 semanas) | 1 | 1,800/semana | 18,000 |
| Desarrollador POS (6 semanas) | 1 | 1,500/semana | 9,000 |
| QA/Tester (4 semanas part-time) | 1 | 1,000/semana | 4,000 |
| Diseñador UX/UI (3 semanas part-time) | 1 | 800/semana | 2,400 |
| **Subtotal Recursos Humanos** | | | **85,400** |

### 9.2 Costos de Infraestructura (Anual)

| Concepto | Costo Mensual (USD) | Costo Anual (USD) |
|----------|---------------------|-------------------|
| Servidor Web (AWS EC2 t3.small) | 30 | 360 |
| Servicio IA (AWS EC2 t3.micro) | 15 | 180 |
| Base de Datos (RDS PostgreSQL db.t3.micro) | 25 | 300 |
| Almacenamiento S3 | 10 | 120 |
| Dominio y SSL | - | 50 |
| OSE SUNAT (servicio facturación) | 50 | 600 |
| **Subtotal Infraestructura** | | **1,610** |

### 9.3 Costos de Hardware (Inicial)

**Hardware mínimo para licorería pequeña:**

| Concepto | Cantidad | Costo Unitario (USD) | Total (USD) |
|----------|----------|---------------------|-------------|
| Computadora POS/Tablet | 1 | 400 | 400 |
| Lector de código de barras | 1 | 50 | 50 |
| Impresora térmica | 1 | 150 | 150 |
| **Subtotal Hardware** | | | **600** |

### 9.4 Costos Adicionales

| Concepto | Costo (USD) |
|----------|-------------|
| Licencias de software | 1,000 |
| Herramientas de desarrollo | 1,000 |
| Capacitación (simplificada) | 800 |
| Contingencias (10%) | 8,820 |
| **Subtotal Adicionales** | **11,620** |

### 9.5 Resumen de Presupuesto

| Concepto | Total (USD) |
|----------|-------------|
| Recursos Humanos | 85,400 |
| Infraestructura (primer año) | 1,610 |
| Hardware | 600 |
| Costos Adicionales | 11,620 |
| **TOTAL PROYECTO** | **99,230** |

**Nota:** 
- Los costos de infraestructura mensuales posteriores al primer año serían aproximadamente $130 USD/mes (optimizado para negocio pequeño).
- Presupuesto reducido en 32% comparado con versión de 21 semanas, manteniendo funcionalidades core.
- App móvil queda como funcionalidad opcional para fases posteriores (no incluida en presupuesto).

---

## 10. RIESGOS Y MITIGACIONES

### 10.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Problemas de integración con SUNAT | Media | Alto | Prototipo temprano, pruebas con ambiente de pruebas de SUNAT |
| Rendimiento del POS con muchos productos | Media | Medio | Optimización de consultas, índices, caché |
| Problemas de conectividad en POS | Alta | Medio | Modo offline, sincronización diferida |
| Escalabilidad de base de datos | Baja | Alto | Diseño escalable desde inicio, índices optimizados |

### 10.2 Riesgos de Proyecto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en requerimientos | Alta | Medio | Metodología ágil, comunicación constante |
| Retrasos en entregas | Media | Alto | Buffer de tiempo, priorización |
| Disponibilidad del equipo | Baja | Alto | Equipo dedicado, backup de conocimiento |
| Cambios en normativas SUNAT | Baja | Alto | Monitoreo de cambios, diseño flexible |

### 10.3 Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia al cambio de usuarios | Media | Medio | Capacitación adecuada, UI intuitiva |
| Costos de infraestructura mayores | Baja | Medio | Monitoreo de uso, optimización |
| Problemas con OSE de SUNAT | Media | Alto | Múltiples proveedores OSE, fallbacks |

---

## 11. CRITERIOS DE ÉXITO

### 11.1 Criterios Técnicos

- ✅ Sistema disponible 99% del tiempo (uptime)
- ✅ Tiempo de respuesta de APIs < 500ms (p95)
- ✅ POS funciona en modo offline
- ✅ Cobertura de tests > 70%
- ✅ Sin vulnerabilidades críticas de seguridad
- ✅ Integración exitosa con SUNAT (100% de comprobantes enviados)

### 11.2 Criterios Funcionales

- ✅ Todos los módulos principales implementados y funcionando
- ✅ Emisión de boletas y facturas electrónicas funcionando
- ✅ Control de inventario en tiempo real con alertas
- ✅ Sistema de promociones y packs operativo
- ✅ Reportes generados correctamente
- ✅ POS permite ventas rápidas (< 30 segundos por venta)

### 11.3 Criterios de Negocio

- ✅ Reducción de tiempo de proceso de venta en 50%
- ✅ Eliminación de errores en cálculo de totales
- ✅ Reducción de pérdidas por inventario descontrolado en 30%
- ✅ Cumplimiento de normativas SUNAT
- ✅ Usuarios capacitados y usando el sistema activamente
- ✅ ROI positivo en 12 meses

### 11.4 Métricas de Éxito (KPIs)

- **Eficiencia Operativa:**
  - Tiempo promedio de venta: < 30 segundos (antes: 2-3 min)
  - Precisión de inventario: > 98%
  - Tasa de comprobantes emitidos correctamente: > 99%
  
- **Satisfacción del Cliente:**
  - Tiempo de espera en cola: < 5 minutos
  - Errores en ventas: < 1%
  
- **Uso del Sistema:**
  - Usuarios activos diarios: > 90% del total
  - Ventas gestionadas por el sistema: 100%
  - Promociones aplicadas correctamente: > 95%

---

## 12. PLAN DE MANTENIMIENTO Y SOPORTE

### 12.1 Mantenimiento Post-Lanzamiento

**Primeros 3 meses:**
- Soporte técnico prioritario
- Corrección de bugs críticos en 24 horas
- Corrección de bugs menores en 1 semana
- Monitoreo continuo del sistema
- Actualizaciones de seguridad

**Meses 4-12:**
- Soporte técnico estándar
- Actualizaciones de seguridad
- Mejoras menores basadas en feedback
- Reportes mensuales de rendimiento
- Actualizaciones por cambios en normativas SUNAT

### 12.2 Modelo de Soporte

- **Soporte Crítico (24/7):** Para problemas que afectan ventas
- **Soporte Estándar:** Lunes a Viernes, 9am - 6pm
- **Canales:** Email, teléfono, sistema de tickets

---

## 13. DIFERENCIALES DEL PROYECTO

### 13.1 Características Únicas

1. **Sistema integral:** Cubre todas las necesidades de una licorería en un solo sistema
2. **Integración nativa con SUNAT:** Emisión de comprobantes electrónicos sin intermediarios complejos
3. **POS optimizado:** Interfaz diseñada específicamente para ventas rápidas
4. **Sistema de promociones flexible:** Permite crear cualquier tipo de promoción o pack
5. **App móvil:** Gestión desde cualquier lugar
6. **Modo offline:** POS funciona sin internet, sincroniza después

### 13.2 Ventajas Competitivas

- **Costo-beneficio:** Solución completa con IA a precio optimizado para negocios pequeños
- **Facilidad de uso:** Interfaz intuitiva diseñada para uso con 1-2 personas, mínima capacitación
- **Inteligencia Artificial:** Ventaja competitiva con recomendaciones y predicciones automatizadas
- **Escalabilidad:** Crece con el negocio, desde pequeño hasta mediano
- **Soporte local:** Atención en Piura
- **Personalización:** Adaptable a necesidades específicas de cada licorería
- **Automatización inteligente:** Reduce la carga de trabajo del dueño/empleado

---

## 14. CONCLUSIÓN

Este proyecto de **Sistema Web y App Móvil con Inteligencia Artificial para Gestión Integral de Licorería** representa una solución completa, moderna e innovadora que transformará las operaciones de las licorerías pequeñas en Piura (1-2 empleados), mejorando significativamente su eficiencia, cumpliendo normativas fiscales y elevando la satisfacción tanto de los dueños como de los clientes.

La combinación de tecnologías modernas (incluyendo IA/ML), metodología ágil probada y un equipo optimizado garantiza la entrega exitosa de un sistema robusto, escalable y de alta calidad que cumplirá con todos los objetivos establecidos.

El sistema no solo resuelve los problemas actuales (ventas manuales, falta de boletas, control de inventario, promociones), sino que también proporciona herramientas avanzadas con inteligencia artificial (recomendaciones, predicciones, optimizaciones automáticas) que permitirán a las licorerías pequeñas competir de manera más efectiva, reduciendo la carga de trabajo del dueño/empleado y mejorando la toma de decisiones mediante insights automatizados.

**Diferencial clave:** La integración de IA hace que este sistema sea especialmente valioso para negocios pequeños, ya que automatiza decisiones que normalmente requerirían experiencia o tiempo adicional, permitiendo que 1-2 personas gestionen el negocio de manera más eficiente y profesional.

---

**Documento elaborado por:** [Nombre de la Empresa]  
**Fecha:** [Fecha]  
**Versión:** 1.0
