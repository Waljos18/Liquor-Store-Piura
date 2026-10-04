# -*- coding: utf-8 -*-
"""Genera TAA_CAP_I_II_REESCRITO.docx con Capítulos I y II humanizados (tono estudiante último ciclo)."""
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH


def add_para(doc, text, style=None):
    p = doc.add_paragraph(text, style=style)
    return p


def add_table_rows(doc, headers, rows):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = str(h)
    for ri, row in enumerate(rows):
        for ci, cell in enumerate(row):
            t.rows[ri + 1].cells[ci].text = str(cell)
    doc.add_paragraph()


def main():
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)

    title = doc.add_heading(
        "Capítulos I y II — Versión reescrita (proyecto de fin de grado)",
        0,
    )
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_para(
        doc,
        "Trabajo de aplicación profesional — Desarrollo de sistemas de información. "
        "Licorería Chilalo Shot, Piura. Estudiante: Walter José Hidalgo Morales.",
    )
    doc.add_page_break()

    # ========== CAPÍTULO I ==========
    doc.add_heading("Capítulo I: Análisis del negocio", 1)

    doc.add_heading("1.1 Generalidades", 2)
    add_para(
        doc,
        "Este capítulo recoge lo que averigué sobre Chilalo Shot antes de proponer cualquier pantalla o base de datos. "
        "La idea no era llenar páginas por cumplir el formato, sino entender cómo se gana la plata en el local, "
        "dónde se pierde tiempo y en qué punto la informalidad empieza a salir cara. Con esa base se justifica "
        "el sistema web de ventas, inventario y facturación con apoyo de inteligencia artificial que desarrollo "
        "como trabajo de fin de grado.",
    )

    doc.add_heading("1.2 Descripción de la organización", 2)
    add_para(
        doc,
        "Chilalo Shot es una licorería pequeña en Piura. Es un negocio familiar: casi siempre hay una o dos personas "
        "en el mostrador y muchas veces el dueño mismo atiende. Venden cervezas, vinos, licores y afines, más algunos "
        "productos complementarios, todo al por menor y con atención directa al cliente del barrio. Está inscrita con "
        "RUC 10028596796 y, bajo la administración actual, viene operando desde abril de 2023.",
    )

    doc.add_heading("1.3 Historia de la organización", 2)
    add_para(
        doc,
        "El local ya existía antes: aproximadamente dos años con otra administración. En 2023 la familia actual "
        "asumió el negocio y siguió adelante con la misma línea de productos, pero con la presión típica de "
        "mejorar márgenes y no quedar mal con la sunat. En el periodo 2023–2025 se fueron notando los límites del "
        "cuaderno y las planillas sueltas: multas, inventario que no cuadraba y la búsqueda de una herramienta que "
        "sí se adapte a una licorería chica, no a una cadena. En 2026 planteamos este proyecto como paso concreto "
        "para ordenar la operación.",
    )
    add_para(
        doc,
        "Línea de tiempo resumida:",
    )
    add_para(
        doc,
        "• 2021: Apertura del establecimiento con la gestión anterior (unos dos años como licorería).\n"
        "• 2023: Compra por el dueño actual; continuidad del negocio.\n"
        "• 2023–2025: Consolidación con procesos manuales; aparición de problemas con SUNAT, stock y búsqueda de soluciones.\n"
        "• 2026: Diagnóstico actual y proyecto de sistema (web, POS e IA).",
    )

    doc.add_heading("1.4 Visión empresarial", 2)
    add_para(
        doc,
        'Texto acordado con el dueño: "Ser la licorería líder en Piura reconocida por su servicio ágil, cumplimiento '
        'normativo y uso de tecnología innovadora que mejora la experiencia del cliente y la eficiencia operativa."',
    )
    add_para(
        doc,
        "No es un slogan vacío: en un rubro donde muchos compiten solo por precio, la visión apunta a servicio rápido, "
        "trabajo formal frente a SUNAT y uso de herramientas digitales que un negocio mediano sí puede costear si se planea bien.",
    )

    doc.add_heading("1.5 Misión empresarial", 2)
    add_para(
        doc,
        '"Ofrecer a nuestros clientes una amplia variedad de bebidas de calidad con un servicio ágil y profesional, '
        "cumpliendo cabalmente con las normativas fiscales, mediante procesos eficientes y tecnología que optimice "
        'nuestra gestión, generando valor para clientes, empleados y la comunidad."',
    )
    add_para(
        doc,
        "En pocas palabras: vender bien, atender rápido y no darle vueltas al cumplimiento tributario. La misión encaja "
        "con lo que el sistema debe facilitar (venta ordenada, comprobantes y stock bajo control).",
    )

    doc.add_heading("1.6 Organigrama y funciones de las principales áreas", 2)
    add_para(
        doc,
        "Por el tamaño del negocio no hay departamentos grandes. En la práctica conviven dos frentes: dirección "
        "(decisiones de compra, precios, relación con proveedores y SUNAT) y operación de ventas/caja (atención, "
        "registro de ventas y cobro). El organigrama es plano: el dueño concentra la gestión y, según el turno, "
        "un empleado apoya en mostrador. Esa simplicidad ayuda a que el sistema solo requiera pocos roles (por ejemplo "
        "administrador y vendedor) sin inventar jerarquías que no existen en el local.",
    )

    doc.add_heading("1.7 Análisis FODA", 2)
    add_table_rows(
        doc,
        ["Factor", "Detalle"],
        [
            (
                "Fortalezas",
                "Buena ubicación y flujo de clientes en Piura; conocimiento del barrio; experiencia en el rubro de bebidas.",
            ),
            (
                "Debilidades",
                "Procesos manuales (cuaderno, sin sistema integrado); pocas personas haciendo muchas tareas; rezagos en facturación electrónica.",
            ),
            (
                "Oportunidades",
                "Clientes y empresas que piden comprobante formal; tecnología en la nube e IA más accesibles; nicho de licorerías pequeñas con poca oferta adecuada.",
            ),
            (
                "Amenazas",
                "Competencia con sistemas automáticos; fiscalización SUNAT; quedarse atrás si el comercio sigue digitalizándose.",
            ),
        ],
    )

    doc.add_heading("1.8 Mapa de procesos", 2)
    add_para(
        doc,
        "Los procesos centrales son: (1) compra y reposición de mercadería, (2) recepción y registro en inventario, "
        "(3) venta en mostrador con cobro, (4) emisión de comprobantes de pago según norma, (5) control de stock y "
        "vencimientos, (6) reportes para decidir qué traer y qué promocionar. Hoy varios de esos pasos se solapan en "
        "papel o memoria; el sistema propuesto los enlaza en un solo flujo digital.",
    )

    doc.add_heading("1.9 Identificación de las necesidades (problema u oportunidad)", 2)
    add_para(
        doc,
        "El problema es tangible: ventas anotadas a mano, inventario que no refleja la realidad, productos que se acaban "
        "sin que nadie avise y otros que se quedan quietos en estantería. A eso se suma la obligación de boletas y facturas "
        "electrónicas: si no se hace bien, entran multas y estrés. La oportunidad es al revés: con un POS y un backoffice "
        "razonables se puede bajar el tiempo por venta (de varios minutos a menos de un minuto en condiciones normales), "
        "recuperar ventas por desabastecimiento y dejar de pagar sanciones evitables. Los números que manejamos en el "
        "análisis (orden de magnitud de pérdidas anuales y de horas perdidas en tareas manuales) salieron de entrevistas "
        "con el dueño y de revisar multas y roturas de stock típicas del sector.",
    )

    doc.add_heading("1.10 Elicitación de requisitos", 2)
    add_para(
        doc,
        "A partir de visitas y listas de necesidades, dejé registrados los requisitos funcionales y no funcionales "
        "siguientes (son la brújula del desarrollo):",
    )
    add_table_rows(
        doc,
        ["ID", "Tipo", "Requisito", "Descripción"],
        [
            ("RF-01", "Funcional", "POS", "Ventas rápidas; búsqueda por código, nombre o categoría; totales automáticos; varias formas de pago; ticket."),
            ("RF-02", "Funcional", "Inventario", "Stock en tiempo real; mínimos/máximos; alertas; vencimientos; actualización con cada venta."),
            ("RF-03", "Funcional", "Facturación SUNAT", "Boletas/facturas electrónicas; OSE; XML/PDF; estado del comprobante."),
            ("RF-04", "Funcional", "Promociones", "Packs y descuentos por volumen; reglas por fecha/categoría; aplicación en venta."),
            ("RF-05", "Funcional", "Reportes", "Dashboard; ventas por periodo; más vendidos; inventario; exportación Excel/PDF."),
            ("RF-06", "Funcional", "IA — recomendaciones", "Sugerencias de productos complementarios según historial."),
            ("RF-07", "Funcional", "IA — demanda", "Alertas de quiebre; orientación de compra según tendencias."),
            ("RF-08", "Funcional", "Fidelización", "Clientes; puntos; canjes."),
            ("RF-09", "Funcional", "POS offline", "Operación básica sin internet; sincronización al volver la conexión."),
            ("RNF-01", "No funcional", "Usabilidad", "Interfaz clara para 1–2 usuarios; poca curva de aprendizaje."),
            ("RNF-02", "No funcional", "Rendimiento", "APIs ágiles; venta completa en menos de ~45 s en escenario típico."),
            ("RNF-03", "No funcional", "Seguridad", "JWT; roles admin/vendedor; protección de datos sensibles."),
            ("RNF-04", "No funcional", "Disponibilidad", "Alta disponibilidad esperada; respaldos."),
            ("RNF-05", "No funcional", "Compatibilidad", "Navegador web; POS en Windows; opcional app Android."),
        ],
    )

    doc.add_heading("1.11 Análisis del problema u oportunidad", 2)
    doc.add_heading("1.11.1 Definición", 3)
    add_para(
        doc,
        "El núcleo del problema es operar todavía como si el negocio fuera de bodega de barrio de hace veinte años, "
        "cuando la norma y la competencia ya piden otro ritmo. La oportunidad es usar tecnología disponible (incluida IA "
        "para recomendaciones y pronósticos simples) sin copiar un ERP caro pensado para cadenas.",
    )
    doc.add_heading("1.11.2 Causas raíz (resumen)", 3)
    add_para(
        doc,
        "• Soluciones comerciales cerradas son caras o complejas para un local chico.\n"
        "• Pocas personas cubren venta, stock y tema fiscal a la vez; el papel no da abasto.\n"
        "• La facturación electrónica tiene trámite y costo; sin asesoría clara se pospone.\n"
        "• Sin datos consolidados no hay buenas decisiones de compra.",
    )
    doc.add_heading("1.11.3 Impacto", 3)
    add_para(
        doc,
        "Económicamente se estiman pérdidas relevantes al año por inventario, multas, ventas no concretadas por falta de "
        "producto y tiempo mal empleado. Operativamente se pierden horas diarias en tareas repetitivas. A nivel cliente, "
        "se nota cola en el mostrador y falta de comprobante cuando lo piden.",
    )

    doc.add_heading("1.12 Stakeholders", 2)
    add_table_rows(
        doc,
        ["Stakeholder", "Interés", "Necesidad principal"],
        [
            ("Dueño", "Rentabilidad y tranquilidad fiscal", "Sistema simple, económico y cumplidor de SUNAT."),
            ("Vendedor", "Trabajar sin complicarse", "Pantalla clara; ventas en pocos pasos."),
            ("Clientes", "Rapidez y formalidad", "Menos espera; stock disponible; comprobante."),
            ("Equipo de desarrollo", "Entregar valor real", "Requisitos claros y retroalimentación oportuna."),
        ],
    )

    doc.add_heading("1.13 Propuesta de solución", 2)
    add_para(
        doc,
        "La propuesta se ve desde tres ángulos: procesos, personas e infraestructura. Abajo resumo el contraste entre "
        "lo que hace hoy el local y lo que haría el sistema.",
    )
    add_table_rows(
        doc,
        ["Proceso", "Hoy", "Propuesto"],
        [
            ("Ventas", "Cuaderno manual", "POS digital; venta típica en ~30–45 s"),
            ("Inventario", "Sin control en vivo", "Stock actualizado; alertas; apoyo a compra"),
            ("Comprobantes", "Sin FE o irregular", "Integración OSE / SUNAT"),
            ("Promociones", "Pocas o manuales", "Reglas y packs aplicados en caja"),
            ("Decisiones", "Por ojo", "Reportes e insights (IA donde aplique)"),
        ],
    )
    add_table_rows(
        doc,
        ["Aspecto (personas)", "Enfoque"],
        [
            ("Usuarios", "Capacitación breve; perfiles administrador y vendedor"),
            ("Carga de trabajo", "Menos cálculo manual; sugerencias donde haya IA"),
            ("Adopción", "UI simple; acompañamiento al inicio"),
        ],
    )
    add_table_rows(
        doc,
        ["Componente", "Especificación"],
        [
            ("Hardware", "PC existente; opcional lector ~USD 30 e impresora térmica ~USD 80"),
            ("Software", "React; POS Electron; Spring Boot; PostgreSQL"),
            ("Servicios", "Nube (p. ej. Render/Railway), BD cloud, OSE, servicio IA FastAPI si aplica"),
            ("Arquitectura", "Cliente-servidor REST; sincronización; offline básico en POS"),
        ],
    )

    doc.add_heading("1.14 Alternativas evaluadas", 2)
    add_para(
        doc,
        "Alternativa A — Software POS de marca: ventaja de que ya viene con soporte; contra es el costo inicial y la "
        "mensualidad, además de que no siempre trae IA ni se ajusta a licorería pequeña. Para Chilalo Shot resultó pesada.\n\n"
        "Alternativa B — Excel u hoja de cálculo más facturador aparte: barata al inicio pero no escala; los errores "
        "siguen y el tiempo de venta no mejora de fondo. Sirve como parche, no como solución.\n\n"
        "Alternativa C — Desarrollo a medida (la que elegimos): exige semanas de trabajo y acompañamiento, pero el costo "
        "para el negocio se mantiene bajo en el marco del proyecto académico, el código queda orientado al caso real y "
        "se pueden priorizar POS, SUNAT e inventario desde el primer sprint.",
    )

    doc.add_heading("1.15 Factibilidad", 2)
    doc.add_heading("1.15.1 Técnica", 3)
    add_para(
        doc,
        "Hay PC en el local y internet urbano; no se requiere servidor propio si usamos nube. El riesgo de cortes se "
        "mitiga con modo offline en POS y cola de comprobantes. Cambios en APIs SUNAT/OSE se atienden con módulo de "
        "integración documentado. En conjunto la factibilidad técnica la considero alta.",
    )
    doc.add_heading("1.15.2 Operativa", 3)
    add_para(
        doc,
        "El personal no necesita ser técnico: el diseño apunta a dueño y vendedor con tareas claras. El desarrollo aporta "
        "capacitación inicial y manuales. La estructura chica del local ayuda: no hay que convencer a cinco áreas distintas.",
    )
    doc.add_heading("1.15.3 Económica (síntesis)", 3)
    add_para(
        doc,
        "Los costos directos se mantienen acotados (proyecto académico, software libre, hosting en plan gratuito o barato, "
        "hardware opcional como lector e impresora). Los beneficios esperados incluyen menos pérdida por stock, menos "
        "multas y mejor uso del tiempo. La tabla siguiente resume el orden de magnitud (valores orientativos del análisis):",
    )
    add_table_rows(
        doc,
        ["Rubro", "Concepto", "Costo estimado (USD)", "Notas"],
        [
            ("Software", "Stack de desarrollo", "0", "React, Spring Boot, PostgreSQL, FastAPI — código abierto"),
            ("Software", "Hosting y BD cloud", "0", "Tiers gratuitos al inicio"),
            ("Software", "OSE / facturación", "0–30/mes", "Según proveedor"),
            ("Equipos", "PC existente", "0", ""),
            ("Equipos", "Lector opcional", "~30", "Una vez"),
            ("Equipos", "Impresora térmica opcional", "~80", "Una vez"),
            ("Otros", "Dominio, SSL opcional", "10–20", "Una vez"),
            ("Mano de obra", "Desarrollo", "0", "Proyecto académico"),
            ("—", "Total inicial típico", "30–150", "Aprox. S/. 120–600"),
        ],
    )
    add_table_rows(
        doc,
        ["Tipo", "Beneficio estimado", "Comentario"],
        [
            ("Tangible", "Menos pérdidas por inventario", "Orden de S/. 9 600/año en el análisis previo"),
            ("Tangible", "Menos multas por FE", "Orden de S/. 3 000/año"),
            ("Tangible", "Ventas recuperadas", "Menos stockouts"),
            ("Intangible", "Cumplimiento y tranquilidad", "Mejor relación con SUNAT"),
            ("Intangible", "Imagen formal", "Clientes que exigen factura"),
        ],
    )
    add_para(
        doc,
        "Conclusión: la inversión inicial es baja frente a los beneficios proyectados si el sistema se usa todos los días.",
    )

    doc.add_heading("1.15.4 Recursos y riesgos (detalle)", 3)
    add_table_rows(
        doc,
        ["Recurso", "Estado en Chilalo Shot", "¿Alcanza?"],
        [
            ("PC / Windows", "Hay al menos una máquina en el local", "Sí para web y POS"),
            ("Internet", "Zona urbana Piura", "Sí; offline cubre cortes"),
            ("Servidor propio", "No", "No hace falta al inicio (nube)"),
            ("OSE", "A contratar/configurar", "Sí con proveedor estándar"),
        ],
    )
    add_table_rows(
        doc,
        ["Riesgo tecnológico", "Mitigación"],
        [
            ("Cortes largos de internet", "POS offline; cola de comprobantes; datos móviles"),
            ("Cambios en API SUNAT/OSE", "Módulo de integración; pruebas en ambiente de pruebas"),
            ("Límites de hosting gratis", "Monitoreo; pasar a plan de pago bajo si crece el tráfico"),
            ("Falla de PC en caja", "Acceso web desde otro equipo; respaldo en nube"),
        ],
    )

    doc.add_heading("1.16 Acta de constitución del proyecto", 2)
    add_para(
        doc,
        "El siguiente documento sirve para dejar por escrito, de manera formal pero clara, el acuerdo entre el cliente "
        "y quien desarrolla el trabajo de aplicación profesional. Lo redacto yo, como estudiante del programa de "
        "Desarrollo de Sistemas de Información del instituto, para cumplir con lo que piden el manual del TAA y a la vez "
        "tener una referencia cuando haya dudas sobre qué entra y qué no entra en el proyecto.",
    )

    doc.add_heading("Datos generales", 3)
    add_para(
        doc,
        "Empresa u organización: Licorería «Chilalo Shot», ubicada en Piura.\n"
        "Nombre del proyecto: Desarrollo de un sistema web y aplicación de punto de venta con apoyo de inteligencia "
        "artificial para la gestión integral de ventas, inventario y facturación electrónica.\n"
        "Tipo de proyecto: desarrollo de software a medida / sistema de gestión para comercio minorista.\n"
        "Patrocinador del negocio: el dueño o representante de Chilalo Shot (firma al final si el instituto lo exige).\n"
        "Gerente de proyecto (lado académico): según designación del instituto o el propio estudiante, según norma interna.",
    )

    doc.add_heading("Para qué sirve este acta", 3)
    add_para(
        doc,
        "Con este acta quedamos todos alineados: qué problema vamos a atacar, qué vamos a construir en la primera etapa, "
        "quiénes participan y bajo qué condiciones de tiempo y recursos. No reemplaza el contrato comercial si en el futuro "
        "hubiera uno, pero sí documenta el alcance del TAA que presento para titularme como técnico profesional.",
    )

    doc.add_heading("Justificación (por qué hacemos el proyecto)", 3)
    add_para(
        doc,
        "En las visitas al local y en las conversaciones con el dueño se veía el mismo patrón: ventas en cuaderno o "
        "planillas sueltas, poco control de stock, demoras en la caja y riesgo de no cumplir bien con la facturación "
        "electrónica que exige la SUNAT. Eso no es solo un tema de «modernidad»: se traduce en multas, pérdida de "
        "clientes que piden comprobante y plata que se va por errores de inventario. La idea del sistema es juntar en "
        "un solo lugar el punto de venta, el inventario, los comprobantes por OSE y los reportes, con módulos de "
        "promociones y apoyo de IA donde tenga sentido (recomendaciones, ayuda para no quedarse sin producto de mayor "
        "rotación, etc.). Así se reduce el tiempo por venta, se ordena la información y el negocio deja de depender "
        "tanto de la memoria o del papel.",
    )

    doc.add_heading("Descripción breve de lo que voy a entregar", 3)
    add_para(
        doc,
        "En líneas generales voy a desarrollar, probar y dejar listo para uso un sistema que incluya: levantamiento de "
        "requisitos con el cliente, diseño de base de datos y de interfaces, programación del backend (por ejemplo "
        "Spring Boot), del frontend web (React), base PostgreSQL, y un servicio aparte para la parte de IA si el diseño "
        "lo requiere (por ejemplo Python/FastAPI). También contemplo la aplicación de escritorio para el POS con Electron "
        "o el enlace que acordemos con el cliente, pruebas, carga inicial de datos según su catálogo, capacitación corta "
        "y manuales sencillos. El despliegue puede ser en la nube (hay opciones gratuitas o de bajo costo para un "
        "proyecto de esta escala) o según lo que acordemos con Chilalo Shot, siempre respetando seguridad y respaldo de "
        "información.",
    )

    doc.add_heading("Alcance preliminar", 3)
    add_para(doc, "Lo que sí incluye esta primera versión del sistema (salvo que el instituto o el cliente acuerden cambios formales):")
    add_para(
        doc,
        "• Gestión de productos: categorías, precios, código de barras, stock mínimo y máximo, fechas de vencimiento.\n"
        "• Punto de venta: ventas rápidas, búsqueda de productos, formas de pago, historial.\n"
        "• Facturación electrónica: boletas y facturas según normativa, integración con un OSE autorizado.\n"
        "• Inventario: movimientos, alertas de stock bajo y de vencimiento, compras y proveedores según lo acordado.\n"
        "• Promociones y packs: reglas que se apliquen solas en la venta.\n"
        "• Clientes y programa de puntos o fidelización básica.\n"
        "• Reportes y tablero con indicadores; exportación cuando sea posible a Excel o PDF.\n"
        "• Inteligencia artificial: recomendaciones y/o apoyo a la predicción de demanda, según alcance validado en sprint.\n"
        "• Administración de usuarios, roles y parámetros del sistema.\n"
        "• Plataformas: sistema web y POS en el entorno acordado (Windows en el local).",
    )
    add_para(doc, "Lo que no incluye, salvo aprobación explícita y nueva planificación:")
    add_para(
        doc,
        "Contabilidad completa, planillas de personal, integración bancaria para pagos, tienda online para el público, "
        "delivery, redes sociales, ni una app móvil nativa para clientes finales. La app Android u otras mejoras pueden "
        "quedar para una segunda fase si el negocio y el tiempo del proyecto lo permiten.",
    )

    doc.add_heading("Resultados que esperamos", 3)
    add_para(
        doc,
        "A nivel operativo: menos tiempo en cada venta, menos errores en totales y precios, inventario más acertado y "
        "cumplimiento más ordenado con la SUNAT. A nivel económico: reducir pérdidas evitables (stock, multas, ventas "
        "perdidas por desabastecimiento). A nivel de imagen: un negocio que atiende más rápido y puede dar boleta o "
        "factura sin dramas cuando el cliente la pide.",
    )

    doc.add_heading("Requisitos de alto nivel y criterios de éxito", 3)
    add_para(
        doc,
        "Los requisitos detallados están en la tabla de RF/RNF de este mismo capítulo. En resumen, el éxito del proyecto "
        "será que el dueño y el vendedor puedan usar el POS y el panel sin necesitar un manual de cien páginas, que los "
        "comprobantes electrónicos se emitan correctamente en ambiente de pruebas y luego en producción, y que el stock "
        "refleje la realidad después de las ventas y las entradas de mercadería.",
    )

    doc.add_heading("Hitos principales (orden lógico)", 3)
    add_table_rows(
        doc,
        ["Hito", "Qué se espera"],
        [
            ("1", "Requisitos y diseño aprobados (MER, mockups, APIs de alto nivel)."),
            ("2", "Backend con APIs y pruebas de integración con SUNAT en ambiente de pruebas."),
            ("3", "Sistema web operativo con flujos principales."),
            ("4", "POS funcional, lector e impresora si el cliente dispone del hardware."),
            ("5", "IA básica integrada según lo priorizado."),
            ("6", "Pruebas integrales, corrección de fallas graves."),
            ("7", "Puesta en marcha, capacitación y entrega de documentación."),
        ],
    )

    doc.add_heading("Riesgos que tengo presentes", 3)
    add_para(
        doc,
        "Integración con la SUNAT u OSE (cambios de norma o de API), cortes de internet en el local, poca disponibilidad "
        "del cliente para probar, o retrasos propios por carga académica. Para cada uno tengo previsto: pruebas tempranas, "
        "modo offline en POS donde aplique, reuniones cortas pero fijas con el dueño, y comunicación honesta con mi asesor "
        "si el cronograma se aprieta.",
    )

    doc.add_heading("Presupuesto preliminar (marco realista)", 3)
    add_para(
        doc,
        "Como es un proyecto de fin de carrera, la mano de obra del desarrollo no se cobra al cliente en el sentido "
        "comercial; los gastos que puede haber son principalmente opcionales: lector de código de barras, impresora "
        "térmica, dominio, o un plan de pago bajo en hosting si el tier gratuito ya no alcanza. En conjunto se habla de "
        "un orden de decenas de dólares al inicio, no miles, salvo que el cliente quiera equipamiento adicional.",
    )

    doc.add_heading("Interesados", 3)
    add_table_rows(
        doc,
        ["Interesado", "Rol", "Contacto / nota"],
        [
            ("Dueño de Chilalo Shot", "Cliente y quien prioriza funciones", "A completar en el Word final"),
            ("Vendedor del local", "Usuario del día a día", "—"),
            ("Walter José Hidalgo Morales", "Desarrollo y documentación del TAA", "922164830 / Walterhidalgom1@gmail.com"),
            ("Asesor del instituto", "Seguimiento académico", "Según asignación"),
        ],
    )

    doc.add_heading("Supuestos", 3)
    add_para(
        doc,
        "Que el cliente tendrá tiempo para reunirse al menos una vez por semana o quincena para validar avances. Que "
        "compartirá información real del negocio (productos, precios aproximados, forma de trabajar) para no inventar "
        "datos. Que podrá tramitar o ya cuenta con lo necesario para facturación electrónica (certificado, RUC, OSE) "
        "o que buscaremos asesoría conjunta. Que en el local hay o habrá internet razonable y al menos una PC para el "
        "POS. Que yo podré dedicar horas semanales estables hasta cerrar el proyecto según el calendario del instituto.",
    )

    doc.add_heading("Restricciones", 3)
    add_para(
        doc,
        "Tiempo: el desarrollo fuerte está pensado en torno a 14 o 15 semanas, alineado al semestre o módulo del instituto. "
        "Presupuesto: no hay presupuesto empresarial grande; cualquier gasto se coordina con el cliente. Tecnología: el "
        "stack acordado es el descrito en este documento (React, Spring Boot, PostgreSQL, etc.); cambiarlo implica "
        "replanificar. Alcance: lo listado arriba; funciones nuevas entran solo con acuerdo escrito o acta de cambio. "
        "Normativa: el sistema debe respetar la legislación vigente en protección de datos personales (Ley N.º 29733 y "
        "normas relacionadas) y las reglas de la SUNAT para comprobantes de pago.",
    )

    doc.add_heading("Autorización", 3)
    add_para(
        doc,
        "Las firmas siguientes dan por iniciado el proyecto descrito, en los términos de este acta y del reglamento del "
        "instituto sobre el Trabajo de Aplicación Profesional.",
    )
    add_table_rows(
        doc,
        ["Nombre", "Cargo", "Firma", "Fecha"],
        [
            ("", "Patrocinador / Dueño (Chilalo Shot)", "", ""),
            ("Walter José Hidalgo Morales", "Estudiante y desarrollador del TAA", "", ""),
            ("", "Asesor académico", "", ""),
        ],
    )

    doc.add_page_break()

    # ========== CAPÍTULO II ==========
    doc.add_heading("Capítulo II: Planificación del proyecto", 1)

    doc.add_heading("2.1 Enfoque de gestión y ciclo de vida", 2)
    add_para(
        doc,
        "Para no mezclar churras con merinas, separé dos cosas: cómo organizo el trabajo (Scrum, con sprints de dos semanas, "
        "backlog y revisiones) y cómo cuido el diseño de datos (enfoque secuencial fuerte en modelo entidad-relación y "
        "reglas de negocio antes de tirar código a lo loco). Ventas, stock y comprobantes fiscales no perdonan un modelo "
        "mal armado; por eso no paso a programar un módulo hasta tener claro el MER y las validaciones.",
    )
    add_para(
        doc,
        "Roles: el dueño hace de Product Owner (prioriza qué va primero: POS, SUNAT, inventario). Yo asumo desarrollo y "
        "coordinación; si el instituto exige un «Scrum Master», ese rol es básicamente desbloquear temas administrativos "
        "y mantener el ritmo de sprint.",
    )

    doc.add_heading("2.2 Justificación del enfoque", 2)
    add_para(
        doc,
        "Scrum sirve para entregar valor pronto: en las primeras iteraciones ya puede haber venta registrada y camino "
        "a comprobante electrónico, en lugar de esperar un «big bang» al final. El modelado tipo cascada en diseño de "
        "base reduce el riesgo de retrabajo cuando SUNAT o el inventario exigen consistencia. Las dos ideas se refuerzan: "
        "iteración en funcionalidades, rigor en lo que va debajo (datos y reglas).",
    )

    doc.add_heading("2.3 Arquitectura de software", 2)
    add_table_rows(
        doc,
        ["Capa", "Responsabilidad", "Tecnología"],
        [
            ("Presentación", "UI web y POS", "React; Electron para escritorio"),
            ("API / control", "REST, seguridad, validación", "Spring Boot"),
            ("Lógica de negocio", "Reglas de ventas, promos, stock", "Java en backend"),
            ("Datos", "Persistencia consistente", "PostgreSQL (p. ej. Supabase/Neon)"),
            ("IA (opcional)", "Recomendaciones, pronósticos", "Python/FastAPI vía API"),
        ],
    )

    doc.add_heading("2.4 Modelos y artefactos", 2)
    add_para(
        doc,
        "Del lado «ingeniería»: diagrama de clases, MER, diccionario de datos alineado a lo que pide SUNAT en series y "
        "tipos de comprobante. Del lado «gestión»: product backlog con historias de usuario, sprint backlog, incremento "
        "demostrable al cerrar sprint y burndown para ver si el ritmo cuadra con el cronograma del instituto.",
    )

    doc.add_heading("2.5 Planificación — alcance del proyecto", 2)
    add_para(
        doc,
        "El producto permitirá: POS digital con búsqueda y cobro; inventario con packs y alertas; facturación electrónica "
        "con OSE; promociones; reportes y dashboard; IA para recomendaciones y apoyo a compras; clientes y puntos; modo "
        "offline básico en POS.",
    )
    add_para(
        doc,
        "Entregables: aplicación web y POS, documentación de usuario y despliegue, esquema de base y datos iniciales según "
        "catálogo del cliente. Excluido en la primera entrega: identidad gráfica premium, ERP contable, soporte indefinido "
        "más allá de lo acordado, app para clientes finales si no se prioriza.",
    )
    add_para(
        doc,
        "Criterios de aceptación: cumplimiento de RF/RNF del Capítulo I; navegadores modernos y Windows para POS; JWT y "
        "roles; validación con dueño y vendedor.",
    )

    doc.add_heading("2.6 Objetivos", 2)
    add_para(
        doc,
        "Objetivo general: desarrollar e implementar el sistema web y POS con IA para integrar ventas, inventario y "
        "facturación electrónica en Chilalo Shot, reduciendo pérdidas asociadas a desorden operativo y mejorando cumplimiento "
        "y eficiencia en el plazo previsto del proyecto.",
    )
    add_para(
        doc,
        "Objetivos específicos: (1) interfaz usable para admin y vendedor; (2) inventario en tiempo real con packs y alertas; "
        "(3) integración SUNAT vía OSE; (4) promociones con apoyo de IA; (5) reportes exportables y documentación.",
    )

    doc.add_heading("2.7 Beneficios esperados", 2)
    add_para(
        doc,
        "Menos tiempo por venta, menos errores de cálculo, inventario más confiable, menos exposición a multas, mejor imagen "
        "ante clientes que piden factura y decisiones de compra con información en pantalla en lugar de solo intuición.",
    )

    doc.add_heading("2.8 Cronograma", 2)
    add_para(
        doc,
        "El detalle en semanas/sprints va en el documento maestro y en el Capítulo III; aquí solo dejo fijado el orden "
        "lógico: levantamiento y diseño → núcleo backend e integración SUNAT → web funcional → POS → IA básica → pruebas "
        "y despliegue. Los sprints son de dos semanas para cuadrar con entregas revisables.",
    )

    doc.add_heading("2.9 Interesados", 2)
    add_table_rows(
        doc,
        ["Interesado", "Rol", "Interés principal"],
        [
            ("Dueño", "Cliente / Product Owner", "Que el sistema sirva de verdad y no sea un dolor de cabeza."),
            ("Vendedor", "Usuario POS", "Rapidez y pocas pantallas innecesarias."),
            ("Clientes", "Beneficiarios indirectos", "Atención ágil y comprobante cuando corresponda."),
            ("SUNAT", "Regulador", "Cumplimiento de facturación electrónica."),
            ("Equipo desarrollo", "Construcción", "Claridad y feedback."),
        ],
    )

    doc.add_heading("2.10 Supuestos y restricciones", 2)
    add_para(
        doc,
        "Supuestos: dueño disponible para validar; internet razonable en el local; OSE estable; tiers gratuitos suficientes "
        "para el volumen inicial; tiempo para cerrar sprints según plan.",
    )
    add_para(
        doc,
        "Restricciones: presupuesto de instituto; plazo de 14–15 semanas de desarrollo fuerte; equipo pequeño; sin integrar "
        "contabilidad externa ni app nativa de clientes en la primera entrega si no se acuerda.",
    )

    doc.add_heading("2.11 Factores críticos de éxito", 2)
    add_para(
        doc,
        "Entregar lo pactado sin desviarse a funciones infinitas; cumplir ritmo de sprints; comunicación semanal con el dueño; "
        "modelo de datos validado antes de codificar a fondo; capacitación suficiente para que el local use el sistema desde el día uno.",
    )

    doc.add_heading("2.12 Riesgos", 2)
    add_table_rows(
        doc,
        ["Causa", "Riesgo", "Impacto"],
        [
            ("Baja del desarrollador por enfermedad", "Atraso en sprint", "Correr fechas o reducir alcance temporal."),
            ("Cambios en API OSE/SUNAT", "Retrabajo en facturación", "Semanas extra en integración."),
            ("Dueño no valida a tiempo", "Feedback tarde", "Más iteraciones."),
            ("Internet inestable", "Comprobantes demorados", "Modo offline y respaldo móvil."),
            ("Límites de hosting gratis", "Caídas o cuotas", "Migrar a plan barato o otro proveedor."),
        ],
    )

    doc.add_heading("2.13 Matriz de comunicaciones", 2)
    add_table_rows(
        doc,
        ["Stakeholder", "Información", "Frecuencia", "Canal"],
        [
            ("Dueño", "Avance y decisiones", "Semanal", "Correo / reunión"),
            ("Equipo", "Tareas del sprint", "Diaria", "Chat / tablero"),
            ("Instituto / asesor", "Hitos", "Según cronograma académico", "Correo / aula"),
        ],
    )

    out = r"c:\Users\Usuario\Desktop\Liquor-Store-Piura-master\Liquor-Store-Piura-master\TAA-CAP_I_II_REESCRITO.docx"
    doc.save(out)
    print("Guardado:", out)


if __name__ == "__main__":
    main()
