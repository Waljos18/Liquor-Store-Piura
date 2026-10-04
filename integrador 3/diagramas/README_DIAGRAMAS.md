# Diagramas de Casos de Uso - Sistema Chilalo Shot

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Sistema:** Gestión de Ventas e Inventario con IA – Licorería Chilalo Shot

---

## Archivos PlantUML

| Archivo | Descripción |
|---------|-------------|
| `casos_de_uso_sistema.puml` | Diagrama completo con todos los actores, paquetes y casos de uso detallados. |
| `casos_de_uso_resumido.puml` | Vista resumida por módulos (un caso de uso por área). |
| `casos_de_uso_pos.puml` | Detalle del módulo Punto de Venta (POS). |
| `casos_de_uso_inventario.puml` | Detalle del módulo Inventario. |
| `casos_de_uso_facturacion_fidelizacion.puml` | Facturación electrónica SUNAT y programa de fidelización. |

### Diagramas de flujo

| Archivo | Descripción |
|---------|-------------|
| `flujo_sistema_completo.puml` | Flujo principal de una venta: login, POS, facturación SUNAT, inventario, fidelización (con decisiones). |
| `flujo_todos_procesos.puml` | Flujo general por módulos: venta, inventario, fin. |
| `flujo_entrada_inventario.puml` | Flujo de entrada de inventario (unidades y packs) y alertas. |

---

## Cómo generar las imágenes

### Opción 1: PlantUML online
1. Ir a [PlantUML Online](https://www.plantuml.com/plantuml/uml).
2. Copiar el contenido del archivo `.puml`.
3. Pegar en el editor y se generará el diagrama.
4. Descargar como PNG o SVG.

### Opción 2: Extensión en VS Code / Cursor
1. Instalar la extensión **PlantUML** (jebbs.plantuml).
2. Abrir el archivo `.puml`.
3. Pulsar `Alt+D` (o clic derecho → "Preview Current Diagram") para ver el diagrama.
4. Exportar desde la vista previa a PNG/SVG.

### Opción 3: Línea de comandos (Java + PlantUML jar)
```bash
java -jar plantuml.jar casos_de_uso_sistema.puml -tpng
```

### Opción 4: Docker
```bash
docker run -v "%CD%":/data plantuml/plantuml casos_de_uso_sistema.puml
```

---

## Actores del sistema

- **Administrador:** Gestión completa (usuarios, productos, inventario, reportes, promociones, configuración).
- **Vendedor:** Ventas, consulta de stock, emisión de comprobantes, recomendaciones IA, fidelización.
- **Cliente (registrado):** Consulta de puntos y canje en programa de fidelización.
- **Sistema SUNAT:** Actor externo; recibe comprobantes electrónicos.

---

## Módulos y casos de uso principales

Los casos de uso se alinean con los requerimientos funcionales RF-01 a RF-09 del proyecto.

- **Autenticación:** Iniciar sesión, cerrar sesión, gestionar usuarios.
- **POS:** Registrar venta, buscar producto, aplicar pago, imprimir ticket, modo offline.
- **Inventario:** Productos, entradas (unidades y packs), stock, alertas, movimientos.
- **Facturación:** Boletas y facturas electrónicas, estado, PDF/XML.
- **Promociones y packs:** Crear packs/promociones, aplicar en venta.
- **Reportes:** Dashboard, reportes de ventas e inventario, exportar.
- **IA:** Recomendaciones, predicción de demanda, sugerencias de compra.
- **Fidelización:** Registrar cliente, puntos, canje.
