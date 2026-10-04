"""Añade hoja '5. Ejemplos VENTAS (0FN-3FN)' a Ficha_107_Normalizacion_BD.xlsx"""
from openpyxl import load_workbook
from openpyxl.styles import Font, Alignment
from openpyxl.utils import get_column_letter

path = r"c:\Users\Usuario\Desktop\Liquor-Store-Piura-master\Liquor-Store-Piura-master\Ficha_107_Normalizacion_BD.xlsx"
wb = load_workbook(path)

sheet_name = "5. Ejemplos VENTAS 0FN-3FN"
if sheet_name in wb.sheetnames:
    del wb[sheet_name]
ws = wb.create_sheet(sheet_name)

bold = Font(bold=True)
row = 1

def title(text):
    global row
    ws.cell(row=row, column=1, value=text)
    ws.cell(row=row, column=1).font = bold
    row += 1

def blank():
    global row
    row += 1

def table(headers, rows):
    global row
    for c, h in enumerate(headers, 1):
        cell = ws.cell(row=row, column=c, value=h)
        cell.font = bold
    row += 1
    for r in rows:
        for c, v in enumerate(r, 1):
            ws.cell(row=row, column=c, value=v)
        row += 1

# Intro
title("Ejemplos de datos — Licorería Chilalo (misma venta en 0FN, 1FN, 2FN y 3FN)")
ws.cell(row=row, column=1, value="Venta de referencia: VENT-20250325-0001 | Cliente María López (DNI) | Vendedor Carlos Ruiz | 2× Cristal 650ml + 1× Ron Cartavio 1L")
row += 1
blank()

# 0FN
title("0FN — FORMA PLANA (una tabla ancha; grupos repetitivos cod_prod1, cod_prod2…)")
table(
    [
        "num_venta",
        "fecha",
        "nombre_vend",
        "email_vend",
        "nombre_cli",
        "doc_cli",
        "cod_prod1",
        "nombre_prod1",
        "categ1",
        "precio1",
        "cant1",
        "cod_prod2",
        "nombre_prod2",
        "categ2",
        "precio2",
        "cant2",
        "subtotal",
        "igv",
        "total",
        "forma_pago",
    ],
    [
        [
            "VENT-20250325-0001",
            "2025-03-25 14:30",
            "Carlos Ruiz",
            "vendedor1@chilalo.pe",
            "María López",
            "45678901",
            "P-CRIS-650",
            "Cerveza Cristal 650 ml",
            "Cervezas",
            5.5,
            2,
            "P-CART-1L",
            "Ron Cartavio 1L",
            "Ron",
            32.2,
            1,
            43.2,
            2.6,
            45.8,
            "EFECTIVO",
        ],
    ],
)
blank()

# 1FN
title("1FN — Cabecera + detalle por filas (clave compuesta lógica num_venta + cod_producto)")
title("VENTA_1FN")
table(
    [
        "num_venta",
        "fecha",
        "nombre_vend",
        "email_vend",
        "nombre_cli",
        "doc_cli",
        "subtotal",
        "impuesto",
        "total",
        "forma_pago",
    ],
    [
        [
            "VENT-20250325-0001",
            "2025-03-25 14:30",
            "Carlos Ruiz",
            "vendedor1@chilalo.pe",
            "María López",
            "45678901",
            43.2,
            2.6,
            45.8,
            "EFECTIVO",
        ],
    ],
)
blank()
title("DETALLE_VENTA_1FN")
table(
    [
        "num_venta",
        "cod_producto",
        "nombre_producto",
        "nombre_categoria",
        "precio_venta",
        "cantidad",
        "subtotal_item",
    ],
    [
        [
            "VENT-20250325-0001",
            "P-CRIS-650",
            "Cerveza Cristal 650 ml",
            "Cervezas",
            5.5,
            2,
            11.0,
        ],
        [
            "VENT-20250325-0001",
            "P-CART-1L",
            "Ron Cartavio 1L",
            "Ron",
            32.2,
            1,
            32.2,
        ],
    ],
)
blank()

# 2FN
title("2FN — Detalle sin datos parciales del producto; catálogo en PRODUCTO_2FN")
title("VENTA_2FN (cabecera)")
table(
    ["num_venta", "fecha", "subtotal", "impuesto", "total", "forma_pago"],
    [
        [
            "VENT-20250325-0001",
            "2025-03-25 14:30",
            43.2,
            2.6,
            45.8,
            "EFECTIVO",
        ],
    ],
)
blank()
title("DETALLE_VENTA_2FN")
table(
    ["num_venta", "cod_producto", "cantidad", "precio_unitario", "subtotal_item"],
    [
        ["VENT-20250325-0001", "P-CRIS-650", 2, 5.5, 11.0],
        ["VENT-20250325-0001", "P-CART-1L", 1, 32.2, 32.2],
    ],
)
blank()
title("PRODUCTO_2FN")
table(
    ["cod_producto", "nombre_producto", "nombre_categoria", "precio_venta"],
    [
        ["P-CRIS-650", "Cerveza Cristal 650 ml", "Cervezas", 5.5],
        ["P-CART-1L", "Ron Cartavio 1L", "Ron", 32.2],
    ],
)
blank()

# 3FN
title("3FN — Esquema real PostgreSQL (tablas del sistema; id BIGSERIAL)")
title("usuarios")
table(
    ["id", "username", "email", "nombre", "rol"],
    [[2, "vendedor1", "vendedor1@chilalo.pe", "Carlos Ruiz", "VENDEDOR"]],
)
blank()
title("clientes")
table(
    ["id", "tipo_documento", "numero_documento", "nombre"],
    [[5, "DNI", "45678901", "María López"]],
)
blank()
title("categorias (ej. seed V3__Seed_data.sql)")
table(["id", "nombre"], [[1, "Cervezas"], [5, "Ron"]])
blank()
title("productos")
table(
    [
        "id",
        "codigo_barras",
        "nombre",
        "categoria_id",
        "precio_venta",
    ],
    [
        [10, "7751234567890", "Cerveza Cristal 650 ml", 1, 5.5],
        [25, "7759876543210", "Ron Cartavio 1L", 5, 32.2],
    ],
)
blank()
title("ventas")
table(
    [
        "id",
        "numero_venta",
        "fecha",
        "usuario_id",
        "cliente_id",
        "subtotal",
        "impuesto",
        "total",
        "forma_pago",
        "estado",
    ],
    [
        [
            100,
            "VENT-20250325-0001",
            "2025-03-25 14:30:00",
            2,
            5,
            43.2,
            2.6,
            45.8,
            "EFECTIVO",
            "COMPLETADA",
        ],
    ],
)
blank()
title("detalle_ventas")
table(
    ["id", "venta_id", "producto_id", "cantidad", "precio_unitario", "subtotal"],
    [
        [1001, 100, 10, 2, 5.5, 11.0],
        [1002, 100, 25, 1, 32.2, 32.2],
    ],
)
blank()
ws.cell(row=row, column=1, value="Nota: Los id son ejemplos ilustrativos; en BD los genera BIGSERIAL.")
row += 1

# Ajustar anchos aproximados
for col in range(1, 22):
    ws.column_dimensions[get_column_letter(col)].width = 14

# Portada: entrada en el índice (fila 19 estaba vacía entre ítem 4 y LEYENDA)
portada = wb["Portada"]
portada.cell(row=19, column=2, value="5")
portada.cell(row=19, column=3, value="5. Ejemplos VENTAS 0FN-3FN")
portada.cell(
    row=19,
    column=4,
    value="Misma venta en 0FN, 1FN, 2FN y tablas reales 3FN (usuarios, clientes, categorías, productos, ventas, detalle_ventas)",
)

try:
    wb.save(path)
    print("OK:", sheet_name, "->", path)
except PermissionError:
    alt = path.replace(".xlsx", "_con_ejemplos_ventas.xlsx")
    wb.save(alt)
    print("OK:", sheet_name, "->", alt)
    print("(Cierra Excel y vuelve a ejecutar el script para guardar sobre Ficha_107_Normalizacion_BD.xlsx)")
