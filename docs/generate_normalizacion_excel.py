"""
Genera Excel de Normalización de BD — Sistema POS/ERP Licorería Chilalo
4 tablas con datos reales en cada forma normal (0FN → 1FN → 2FN → 3FN)
"""

from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# ── Paleta ───────────────────────────────────────────────────────────
C_TITLE_BG  = "1E3A5F"
C_FN0       = "C0392B"
C_FN1       = "E67E22"
C_FN2       = "2471A3"
C_FN3       = "1E8449"
C_REAL      = "6C3483"
C_DEP_OK    = "D5F5E3"
C_DEP_PARC  = "FADBD8"
C_ALT       = "F2F3F4"

def fill(h): return PatternFill("solid", fgColor=h)
def fnt(bold=False, color="000000", size=9, italic=False, name="Calibri"):
    return Font(bold=bold, color=color, size=size, italic=italic, name=name)
def aln(h="left", v="center", wrap=True):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)
def brd():
    s = Side(style="thin")
    return Border(left=s, right=s, top=s, bottom=s)

def wc(ws, r, c, v, bg=None, fg="000000", bold=False, ha="left",
       italic=False, sz=9, wrap=True, mono=False):
    cell = ws.cell(row=r, column=c, value=v)
    if bg: cell.fill = fill(bg)
    name = "Courier New" if mono else "Calibri"
    cell.font = Font(bold=bold, color=fg, size=sz, italic=italic, name=name)
    cell.alignment = aln(h=ha, wrap=wrap)
    cell.border = brd()
    return cell

def mtitle(ws, r, c1, c2, v, bg, fg="FFFFFF", sz=11):
    ws.merge_cells(start_row=r, start_column=c1, end_row=r, end_column=c2)
    cell = ws.cell(row=r, column=c1, value=v)
    cell.fill = fill(bg); cell.font = fnt(bold=True, color=fg, size=sz)
    cell.alignment = aln(h="center"); cell.border = brd()

def rh(ws, r, h): ws.row_dimensions[r].height = h
def cw(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

def write_data_table(ws, start_row, col_start, col_end, headers, rows,
                     hdr_bg="1A5276", alt1="FFFFFF", alt2=None):
    """Escribe una tabla de datos con encabezados y filas alternadas."""
    if alt2 is None: alt2 = C_ALT
    r = start_row
    ncols = col_end - col_start + 1
    for ci, h in enumerate(headers):
        wc(ws, r, col_start + ci, h, bg=hdr_bg, fg="FFFFFF", bold=True, ha="center", sz=8)
    rh(ws, r, 16); r += 1
    for ri, row in enumerate(rows):
        bg = alt2 if ri % 2 else alt1
        for ci, val in enumerate(row):
            if col_start + ci <= col_end:
                wc(ws, r, col_start + ci, val, bg=bg, sz=8)
        # rellenar columnas vacías
        for extra in range(len(row), ncols):
            wc(ws, r, col_start + extra, "", bg=bg, sz=8)
        rh(ws, r, 15); r += 1
    return r  # siguiente fila libre

def section_label(ws, r, c1, c2, text, bg, fg="FFFFFF"):
    mtitle(ws, r, c1, c2, text, bg, fg, sz=9)
    rh(ws, r, 16); return r + 1

# ════════════════════════════════════════════════════════════════════
#  PORTADA
# ════════════════════════════════════════════════════════════════════
ws0 = wb.active; ws0.title = "Portada"
ws0.sheet_view.showGridLines = False
cw(ws0, [4, 22, 32, 22, 18, 4])

ws0.merge_cells("B2:E2")
c = ws0["B2"]; c.value = "FICHA 107 — NORMALIZACIÓN DE BASE DE DATOS"
c.fill = fill(C_TITLE_BG); c.font = fnt(bold=True, color="FFFFFF", size=15)
c.alignment = aln(h="center"); rh(ws0, 2, 38)

ws0.merge_cells("B3:E3")
c = ws0["B3"]; c.value = "Sistema POS/ERP — Licorería Chilalo, Piura"
c.fill = fill("2C3E50"); c.font = fnt(color="ECF0F1", size=12)
c.alignment = aln(h="center"); rh(ws0, 3, 26)

info = [("Proyecto","Sistema POS/ERP — Licorería Chilalo"),
        ("Versión","1.2"),("Fecha","25/03/2026"),
        ("Base de datos","PostgreSQL 15"),("ORM","Spring Data JPA / Hibernate"),
        ("Migraciones Flyway","V1 – V18")]
r = 5
for lbl, val in info:
    wc(ws0, r, 2, lbl, bg="D6EAF8", bold=True, sz=10)
    wc(ws0, r, 3, val, sz=10); ws0.merge_cells(start_row=r,start_column=3,end_row=r,end_column=5)
    rh(ws0, r, 18); r += 1

r += 1
mtitle(ws0, r, 2, 5, "TABLAS NORMALIZADAS", C_TITLE_BG, sz=11); rh(ws0, r, 22); r += 1
tablas = [("1","COMPRAS / DETALLE_COMPRAS","Compras a proveedores con ítems"),
          ("2","DEVOLUCIONES / DETALLE_DEVOLUCIONES","Devoluciones de ventas con ítems"),
          ("3","CUENTAS_POR_COBRAR / PAGOS_CUENTA","Crédito/fiado con historial de abonos"),
          ("4","MERMAS","Pérdidas por deterioro, rotura, robo, vencimiento")]
for col, bg in [(2,"2C3E50"),(3,"2C3E50"),(4,"2C3E50"),(5,"2C3E50")]:
    labels = ["#","Tabla(s)","Descripción",""]
    wc(ws0, r, col, labels[col-2], bg=bg, fg="FFFFFF", bold=True, ha="center", sz=10)
ws0.merge_cells(start_row=r,start_column=4,end_row=r,end_column=5); rh(ws0, r, 18); r += 1
for num, tbl, desc in tablas:
    bg = C_ALT if int(num)%2==0 else "FFFFFF"
    wc(ws0, r, 2, num, bg=bg, ha="center", bold=True)
    wc(ws0, r, 3, tbl, bg=bg, bold=True, sz=9)
    wc(ws0, r, 4, desc, bg=bg, sz=9)
    ws0.merge_cells(start_row=r,start_column=4,end_row=r,end_column=5)
    rh(ws0, r, 18); r += 1

r += 1
mtitle(ws0, r, 2, 5, "LEYENDA DE COLORES", C_TITLE_BG, sz=11); rh(ws0, r, 22); r += 1
legend = [(C_FN0,"Forma Plana / 0FN — Sin normalizar"),
          (C_FN1,"Primera Forma Normal (1FN)"),
          (C_FN2,"Segunda Forma Normal (2FN)"),
          (C_FN3,"Tercera Forma Normal (3FN)"),
          (C_REAL,"Esquema real en Base de Datos"),
          (C_DEP_OK,"Dependencia completa ✓"),
          (C_DEP_PARC,"Dependencia parcial ✗")]
for col, lbl in legend:
    ws0.merge_cells(start_row=r,start_column=2,end_row=r,end_column=2)
    c2 = ws0.cell(row=r, column=2, value="   ")
    c2.fill = fill(col); c2.border = brd()
    ws0.merge_cells(start_row=r,start_column=3,end_row=r,end_column=5)
    c3 = ws0.cell(row=r, column=3, value=lbl)
    c3.alignment = aln(); c3.border = brd(); c3.font = fnt(size=9)
    rh(ws0, r, 16); r += 1


# ════════════════════════════════════════════════════════════════════
#  FUNCIÓN PRINCIPAL DE HOJA
# ════════════════════════════════════════════════════════════════════
def make_sheet(name, title, color,
               data_0fn, hdrs_0fn,
               tables_1fn, data_1fn_list, note_1fn,
               dep_hdrs, dep_rows,
               tables_2fn, data_2fn_list, note_2fn,
               trans_list,
               tables_3fn, data_3fn_list, note_3fn,
               sql_lines, real_note):
    """
    data_XfN_list: lista de (subtitulo, headers, rows)
    tables_XfN:    lista de (nombre_tabla, [attrs])
    """
    ws = wb.create_sheet(title=name)
    ws.sheet_view.showGridLines = False
    cw(ws, [3, 20, 20, 18, 18, 18, 18, 3])
    C1, C2 = 2, 7   # columnas de contenido

    r = 2
    ws.merge_cells(start_row=r, start_column=C1, end_row=r, end_column=C2)
    c = ws.cell(row=r, column=C1, value=title)
    c.fill = fill(color); c.font = fnt(bold=True, color="FFFFFF", size=13)
    c.alignment = aln(h="center"); rh(ws, r, 34); r += 2

    # ── helper local ─────────────────────────────────────────────
    def sec(text, bg, fg="FFFFFF", sz=10):
        nonlocal r
        mtitle(ws, r, C1, C2, text, bg, fg, sz); rh(ws, r, 20); r += 1

    def subtitulo(text, bg):
        nonlocal r
        mtitle(ws, r, C1, C2, text, bg, sz=9); rh(ws, r, 16); r += 1

    def schema_box(attrs, bg_row, bg_hdr):
        nonlocal r
        cols = 3
        chunk = [attrs[i:i+cols] for i in range(0, len(attrs), cols)]
        for row_chunk in chunk:
            for ci, attr in enumerate(row_chunk):
                wc(ws, r, C1+ci, attr, bg=bg_row, sz=8)
            for ci in range(len(row_chunk), cols):
                wc(ws, r, C1+ci, "", bg=bg_row, sz=8)
            # merge remaining cols
            if C1+cols <= C2:
                ws.merge_cells(start_row=r,start_column=C1+cols,
                               end_row=r,end_column=C2)
                wc(ws, r, C1+cols, "", bg=bg_row, sz=8)
            rh(ws, r, 14); r += 1
        rh(ws, r, 5); r += 1

    def data_section(subtit, hdrs, rows, hdr_bg):
        nonlocal r
        subtitulo(f"  Datos de ejemplo — {subtit}", hdr_bg)
        r = write_data_table(ws, r, C1, C2, hdrs, rows, hdr_bg=hdr_bg)
        rh(ws, r, 6); r += 1

    # ════════════════════════════════════
    #  0FN
    # ════════════════════════════════════
    sec("FORMA PLANA — SIN NORMALIZAR (0FN)", C_FN0)
    subtitulo("  Problema: datos repetidos, grupos repetitivos, dependencias transitivas", C_FN0)
    r = write_data_table(ws, r, C1, C2, hdrs_0fn, data_0fn,
                         hdr_bg=C_FN0, alt1="FFFFFF", alt2="FEF9E7")
    rh(ws, r, 8); r += 1
    # marcar redundancias
    subtitulo("  ▲ Filas resaltadas = datos duplicados / grupos repetitivos", "922B21")
    rh(ws, r, 6); r += 1

    # ════════════════════════════════════
    #  1FN
    # ════════════════════════════════════
    sec("PRIMERA FORMA NORMAL (1FN) — Eliminar grupos repetitivos", C_FN1)
    subtitulo("  Regla: cada celda = un único valor atómico. Sin columnas ni filas repetidas.", C_FN1)
    for tname, tattrs in tables_1fn:
        mtitle(ws, r, C1, C1+2, f"Estructura: {tname}", C_FN1, sz=9)
        mtitle(ws, r, C1+3, C2, "← clave subrayada", "E67E22", sz=8)
        rh(ws, r, 16); r += 1
        schema_box(tattrs, "FEF5E7", C_FN1)
    for subtit, hdrs, rows in data_1fn_list:
        data_section(subtit, hdrs, rows, C_FN1)
    subtitulo(f"  Resultado: {note_1fn}", C_FN1)
    rh(ws, r, 8); r += 1

    # ════════════════════════════════════
    #  2FN
    # ════════════════════════════════════
    sec("SEGUNDA FORMA NORMAL (2FN) — Eliminar dependencias parciales", C_FN2)
    subtitulo("  Regla: aplica sólo a clave compuesta. Cada atributo no clave depende de TODA la clave.", C_FN2)
    if dep_rows:
        subtitulo("  Análisis de dependencias funcionales:", "1A5276")
        r = write_data_table(ws, r, C1, C2, dep_hdrs, dep_rows,
                             hdr_bg="1A5276", alt1="FFFFFF", alt2=C_ALT)
        # colorear ✓ / ✗ parcial
        rh(ws, r, 6); r += 1
    for tname, tattrs in tables_2fn:
        mtitle(ws, r, C1, C1+2, f"Estructura: {tname}", C_FN2, sz=9)
        ws.merge_cells(start_row=r,start_column=C1+3,end_row=r,end_column=C2)
        rh(ws, r, 16); r += 1
        schema_box(tattrs, "EBF5FB", C_FN2)
    for subtit, hdrs, rows in data_2fn_list:
        data_section(subtit, hdrs, rows, C_FN2)
    subtitulo(f"  Resultado: {note_2fn}", C_FN2)
    rh(ws, r, 8); r += 1

    # ════════════════════════════════════
    #  3FN
    # ════════════════════════════════════
    sec("TERCERA FORMA NORMAL (3FN) — Eliminar dependencias transitivas", C_FN3)
    subtitulo("  Regla: ningún atributo no clave depende de otro atributo no clave.", C_FN3)
    subtitulo("  Dependencias transitivas detectadas:", "1E8449")
    for dep in trans_list:
        ws.merge_cells(start_row=r,start_column=C1,end_row=r,end_column=C2)
        wc(ws, r, C1, dep, bg="EAFAF1" if dep.strip() else "FFFFFF",
           italic=True, sz=8)
        rh(ws, r, 15); r += 1
    rh(ws, r, 6); r += 1
    for tname, tattrs in tables_3fn:
        mtitle(ws, r, C1, C1+2, f"Estructura: {tname}", C_FN3, sz=9)
        ws.merge_cells(start_row=r,start_column=C1+3,end_row=r,end_column=C2)
        rh(ws, r, 16); r += 1
        schema_box(tattrs, "EAFAF1", C_FN3)
    for subtit, hdrs, rows in data_3fn_list:
        data_section(subtit, hdrs, rows, C_FN3)
    subtitulo(f"  Resultado: {note_3fn}", C_FN3)
    rh(ws, r, 8); r += 1

    # ════════════════════════════════════
    #  ESQUEMA REAL
    # ════════════════════════════════════
    sec("ESQUEMA REAL EN BASE DE DATOS — PostgreSQL 15", C_REAL)
    for line in sql_lines:
        ws.merge_cells(start_row=r,start_column=C1,end_row=r,end_column=C2)
        c2 = ws.cell(row=r, column=C1, value=line)
        c2.fill = fill("F4ECF7")
        c2.font = Font(name="Courier New", size=8, color="4A235A")
        c2.alignment = Alignment(horizontal="left", vertical="center", wrap_text=False)
        c2.border = brd(); rh(ws, r, 14); r += 1
    rh(ws, r, 6); r += 1
    ws.merge_cells(start_row=r,start_column=C1,end_row=r,end_column=C2)
    wc(ws, r, C1, f"✅  {real_note}", bg="E8DAEF", bold=True, sz=9)
    rh(ws, r, 18)
    return ws


# ════════════════════════════════════════════════════════════════════
#  TABLA 1 — COMPRAS / DETALLE_COMPRAS
# ════════════════════════════════════════════════════════════════════
make_sheet(
  name="1. COMPRAS", title="TABLA 1 — COMPRAS / DETALLE_COMPRAS", color="1A5276",

  # ── 0FN ──────────────────────────────────────────────────────
  hdrs_0fn=["num_compra","fecha","ruc_prov","nombre_prov","dir_prov",
            "username","rol_usr","cod_prod","nombre_prod","categ_prod",
            "cantidad","precio_unit","subtotal_item","total"],
  data_0fn=[
    ["C-001","10/01/2024","20123456789","Backus SAC","Av. Brasil 123, Lima",
     "admin","ADMIN","P001","Cerveza Cristal 650ml","Cervezas",100,2.50,250.00,474.00],
    ["C-001","10/01/2024","20123456789","Backus SAC","Av. Brasil 123, Lima",
     "admin","ADMIN","P002","Cerveza Pilsen 650ml","Cervezas",80,2.80,224.00,474.00],
    ["C-002","15/01/2024","20987654321","Diageo Peru SAC","Av. J.Prado 456, Lima",
     "admin","ADMIN","P005","Johnnie Walker Red 750ml","Whiskies",12,80.00,960.00,960.00],
    ["C-003","20/01/2024","20456789123","Peña Falcón SAC","Jr. Callao 89, Piura",
     "cruzv","VENDEDOR","P004","Ron Cartavio 1L","Ron",24,35.00,840.00,840.00],
  ],

  # ── 1FN ──────────────────────────────────────────────────────
  tables_1fn=[
    ("COMPRA_1FN",["num_compra (PK)","fecha","ruc_proveedor","nombre_proveedor",
                   "dir_proveedor","tel_proveedor","username_usuario",
                   "nombre_usuario","email_usuario","rol_usuario","total"]),
    ("DETALLE_COMPRAS_1FN",["num_compra (PK parte 1)","cod_producto (PK parte 2)",
                             "nombre_producto","nombre_categoria",
                             "cantidad","precio_unitario","subtotal"]),
  ],
  data_1fn_list=[
    ("COMPRA_1FN",
     ["num_compra","fecha","ruc_prov","nombre_prov","dir_prov","username","rol_usr","total"],
     [["C-001","10/01/2024","20123456789","Backus SAC","Av. Brasil 123, Lima","admin","ADMIN",474.00],
      ["C-002","15/01/2024","20987654321","Diageo Peru SAC","Av. J.Prado 456, Lima","admin","ADMIN",960.00],
      ["C-003","20/01/2024","20456789123","Peña Falcón SAC","Jr. Callao 89, Piura","cruzv","VENDEDOR",840.00]]),
    ("DETALLE_COMPRAS_1FN",
     ["num_compra","cod_producto","nombre_producto","categ","cantidad","precio_unit","subtotal"],
     [["C-001","P001","Cerveza Cristal 650ml","Cervezas",100,2.50,250.00],
      ["C-001","P002","Cerveza Pilsen 650ml","Cervezas",80,2.80,224.00],
      ["C-002","P005","Johnnie Walker Red 750ml","Whiskies",12,80.00,960.00],
      ["C-003","P004","Ron Cartavio 1L","Ron",24,35.00,840.00]]),
  ],
  note_1fn="Eliminados grupos repetitivos. Clave compuesta en DETALLE_COMPRAS_1FN: (num_compra, cod_producto).",

  # ── 2FN ──────────────────────────────────────────────────────
  dep_hdrs=["Columna","Depende de num_compra","Depende de cod_producto","Depende de AMBAS"],
  dep_rows=[
    ["nombre_producto","✗","✓","✗ parcial"],
    ["nombre_categoria","✗","✓","✗ parcial"],
    ["cantidad","✓","✓","✓"],
    ["precio_unitario","✓","✓","✓"],
    ["subtotal","✓","✓","✓"],
  ],
  tables_2fn=[
    ("DETALLE_COMPRAS_2FN",["num_compra (FK)","cod_producto (FK→PRODUCTOS)",
                             "cantidad","precio_unitario","subtotal"]),
    ("PRODUCTO_2FN (extraída)",["cod_producto (PK)","nombre_producto",
                                 "nombre_categoria","precio_compra"]),
  ],
  data_2fn_list=[
    ("DETALLE_COMPRAS_2FN",
     ["num_compra","cod_producto","cantidad","precio_unitario","subtotal"],
     [["C-001","P001",100,2.50,250.00],
      ["C-001","P002",80,2.80,224.00],
      ["C-002","P005",12,80.00,960.00],
      ["C-003","P004",24,35.00,840.00]]),
    ("PRODUCTO_2FN",
     ["cod_producto","nombre_producto","nombre_categoria","precio_compra"],
     [["P001","Cerveza Cristal 650ml","Cervezas",2.50],
      ["P002","Cerveza Pilsen 650ml","Cervezas",2.80],
      ["P004","Ron Cartavio 1L","Ron",35.00],
      ["P005","Johnnie Walker Red 750ml","Whiskies",80.00]]),
  ],
  note_2fn="Eliminadas dependencias parciales. nombre_producto y nombre_categoria se mueven a PRODUCTOS.",

  # ── 3FN ──────────────────────────────────────────────────────
  trans_list=[
    "num_compra → ruc_proveedor → nombre_proveedor, dir_proveedor, tel_proveedor",
    "  ↳ Los datos del proveedor dependen del proveedor, NO de la compra.",
    "num_compra → username_usuario → nombre_usuario, email_usuario, rol_usuario",
    "  ↳ Los datos del usuario dependen del usuario, NO de la compra.",
    "cod_producto → nombre_categoria → descripcion_categoria",
    "  ↳ Los datos de categoría dependen de la categoría, NO del producto.",
  ],
  tables_3fn=[
    ("PROVEEDORES",["id (PK)","ruc","razon_social","direccion","telefono","activo"]),
    ("USUARIOS",["id (PK)","username","nombre","email","rol","activo"]),
    ("CATEGORIAS",["id (PK)","nombre","descripcion","activa"]),
    ("PRODUCTOS",["id (PK)","codigo_barras","nombre","marca","categoria_id (FK)","precio_compra","precio_venta","stock_actual"]),
    ("COMPRAS — 3FN final",["id (PK)","numero_compra","fecha","proveedor_id (FK)","usuario_id (FK)","total","estado"]),
    ("DETALLE_COMPRAS — 3FN final",["id (PK)","compra_id (FK)","producto_id (FK)","cantidad","precio_unitario","subtotal"]),
  ],
  data_3fn_list=[
    ("PROVEEDORES",
     ["id","ruc","razon_social","direccion","telefono","activo"],
     [[1,"20123456789","Backus SAC","Av. Brasil 123, Lima","014123456",True],
      [2,"20987654321","Diageo Peru SAC","Av. J.Prado 456, Lima","016123456",True],
      [3,"20456789123","Peña Falcón SAC","Jr. Callao 89, Piura","073123456",True]]),
    ("USUARIOS",
     ["id","username","nombre","email","rol","activo"],
     [[1,"admin","Administrador","admin@chilalo.com","ADMIN",True],
      [2,"cruzv","Carlos Ruiz","c.ruiz@chilalo.com","VENDEDOR",True]]),
    ("COMPRAS — final",
     ["id","numero_compra","fecha","proveedor_id","usuario_id","total","estado"],
     [[1,"C-001","10/01/2024",1,1,474.00,"COMPLETADA"],
      [2,"C-002","15/01/2024",2,1,960.00,"COMPLETADA"],
      [3,"C-003","20/01/2024",3,2,840.00,"COMPLETADA"]]),
    ("DETALLE_COMPRAS — final",
     ["id","compra_id","producto_id","cantidad","precio_unitario","subtotal"],
     [[1,1,1,100,2.50,250.00],
      [2,1,2,80,2.80,224.00],
      [3,2,5,12,80.00,960.00],
      [4,3,4,24,35.00,840.00]]),
  ],
  note_3fn="Esquema en 3FN. Cada atributo no clave depende únicamente de la PK de su tabla.",

  # ── SQL real ─────────────────────────────────────────────────
  sql_lines=[
    "CREATE TABLE compras (",
    "    id              BIGSERIAL PRIMARY KEY,",
    "    numero_compra   VARCHAR(20) UNIQUE NOT NULL,",
    "    proveedor_id    BIGINT REFERENCES proveedores(id),",
    "    usuario_id      BIGINT REFERENCES usuarios(id),",
    "    fecha           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,",
    "    total           DECIMAL(10,2) NOT NULL,",
    "    estado          VARCHAR(20) DEFAULT 'COMPLETADA' NOT NULL,",
    "    observaciones   TEXT",
    ");",
    "",
    "CREATE TABLE detalle_compras (",
    "    id              BIGSERIAL PRIMARY KEY,",
    "    compra_id       BIGINT REFERENCES compras(id) ON DELETE CASCADE,",
    "    producto_id     BIGINT REFERENCES productos(id),",
    "    cantidad        INTEGER NOT NULL CHECK (cantidad > 0),",
    "    precio_unitario DECIMAL(10,2) NOT NULL,",
    "    subtotal        DECIMAL(10,2) NOT NULL",
    ");",
  ],
  real_note="Esquema en 3FN. Flyway: V1__Initial_schema.sql",
)


# ════════════════════════════════════════════════════════════════════
#  TABLA 2 — DEVOLUCIONES / DETALLE_DEVOLUCIONES
# ════════════════════════════════════════════════════════════════════
make_sheet(
  name="2. DEVOLUCIONES", title="TABLA 2 — DEVOLUCIONES / DETALLE_DEVOLUCIONES", color="922B21",

  hdrs_0fn=["num_dev","fecha","motivo","num_venta","doc_cliente","nombre_cliente",
            "tel_cliente","username","rol_usr","cod_prod","nombre_prod","cant",
            "precio_unit","subtotal","total_dev"],
  data_0fn=[
    ["D-001","12/01/2024","PRODUCTO_DEFECTUOSO","V-001","12345678","Juan Pérez","987654321",
     "cruzv","VENDEDOR","P001","Cerveza Cristal 650ml",2,3.50,7.00,52.00],
    ["D-001","12/01/2024","PRODUCTO_DEFECTUOSO","V-001","12345678","Juan Pérez","987654321",
     "cruzv","VENDEDOR","P004","Ron Cartavio 1L",1,45.00,45.00,52.00],
    ["D-002","18/01/2024","CAMBIO_PRODUCTO","V-008","87654321","María López","976543210",
     "cruzv","VENDEDOR","P003","Vino Tacama Tinto 750ml",1,28.00,28.00,28.00],
    ["D-003","25/01/2024","PRODUCTO_INCORRECTO","V-015","12345678","Juan Pérez","987654321",
     "admin","ADMIN","P004","Ron Cartavio 1L",1,45.00,45.00,45.00],
  ],

  tables_1fn=[
    ("DEVOLUCION_1FN",["num_devolucion (PK)","fecha","motivo","estado","observaciones",
                       "num_venta_origen","fecha_venta","total_venta","forma_pago_venta",
                       "doc_cliente","nombre_cliente","tel_cliente",
                       "username_usuario","nombre_usuario","rol_usuario","total_devolucion"]),
    ("DETALLE_DEVOLUCIONES_1FN",["num_devolucion (PK parte 1)","cod_producto (PK parte 2)",
                                  "nombre_producto","cantidad","precio_unitario","subtotal"]),
  ],
  data_1fn_list=[
    ("DEVOLUCION_1FN",
     ["num_dev","fecha","motivo","num_venta","doc_cliente","nombre_cliente","username","rol","total"],
     [["D-001","12/01/2024","PRODUCTO_DEFECTUOSO","V-001","12345678","Juan Pérez","cruzv","VENDEDOR",52.00],
      ["D-002","18/01/2024","CAMBIO_PRODUCTO","V-008","87654321","María López","cruzv","VENDEDOR",28.00],
      ["D-003","25/01/2024","PRODUCTO_INCORRECTO","V-015","12345678","Juan Pérez","admin","ADMIN",45.00]]),
    ("DETALLE_DEVOLUCIONES_1FN",
     ["num_devolucion","cod_producto","nombre_producto","cantidad","precio_unit","subtotal"],
     [["D-001","P001","Cerveza Cristal 650ml",2,3.50,7.00],
      ["D-001","P004","Ron Cartavio 1L",1,45.00,45.00],
      ["D-002","P003","Vino Tacama Tinto 750ml",1,28.00,28.00],
      ["D-003","P004","Ron Cartavio 1L",1,45.00,45.00]]),
  ],
  note_1fn="Eliminados grupos repetitivos. Clave compuesta: (num_devolucion, cod_producto).",

  dep_hdrs=["Columna","Dep. de num_devolucion","Dep. de cod_producto","Dep. de AMBAS"],
  dep_rows=[
    ["nombre_producto","✗","✓","✗ parcial"],
    ["cantidad","✓","✓","✓"],
    ["precio_unitario","✓","✓","✓"],
    ["subtotal","✓","✓","✓"],
  ],
  tables_2fn=[
    ("DETALLE_DEVOLUCIONES_2FN",["num_devolucion (FK)","cod_producto (FK→PRODUCTOS)",
                                  "cantidad","precio_unitario","subtotal"]),
  ],
  data_2fn_list=[
    ("DETALLE_DEVOLUCIONES_2FN",
     ["num_devolucion","cod_producto","cantidad","precio_unitario","subtotal"],
     [["D-001","P001",2,3.50,7.00],
      ["D-001","P004",1,45.00,45.00],
      ["D-002","P003",1,28.00,28.00],
      ["D-003","P004",1,45.00,45.00]]),
  ],
  note_2fn="Eliminada dependencia parcial: nombre_producto ya existe en tabla PRODUCTOS.",

  trans_list=[
    "num_devolucion → num_venta_origen → fecha_venta, total_venta, forma_pago_venta",
    "  ↳ Datos de la venta dependen de la venta, NO de la devolución.",
    "num_devolucion → doc_cliente → nombre_cliente, tel_cliente",
    "  ↳ Datos del cliente dependen del cliente, NO de la devolución.",
    "  ↳ DECISIÓN: cliente NO se agrega como FK directa → se accede vía VENTAS.cliente_id (sin redundancia).",
    "num_devolucion → username_usuario → nombre_usuario, rol_usuario",
    "  ↳ Datos del usuario dependen del usuario, NO de la devolución.",
  ],
  tables_3fn=[
    ("DEVOLUCIONES — 3FN final",["id (PK)","numero_devolucion","venta_id (FK→VENTAS)",
                                  "usuario_id (FK→USUARIOS)","fecha","motivo","estado",
                                  "observaciones","total"]),
    ("DETALLE_DEVOLUCIONES — 3FN final",["id (PK)","devolucion_id (FK→DEVOLUCIONES)",
                                          "producto_id (FK→PRODUCTOS)","cantidad",
                                          "precio_unitario","subtotal"]),
  ],
  data_3fn_list=[
    ("VENTAS (referenciada — cliente se accede aquí)",
     ["id","numero_venta","fecha","usuario_id","cliente_id","total","forma_pago"],
     [[1,"V-001","10/01/2024",2,1,61.50,"EFECTIVO"],
      [8,"V-008","15/01/2024",2,2,28.00,"YAPE"],
      [15,"V-015","20/01/2024",1,1,45.00,"EFECTIVO"]]),
    ("DEVOLUCIONES — final",
     ["id","numero_devolucion","venta_id","usuario_id","fecha","motivo","estado","total"],
     [[1,"D-001",1,2,"12/01/2024","PRODUCTO_DEFECTUOSO","COMPLETADA",52.00],
      [2,"D-002",8,2,"18/01/2024","CAMBIO_PRODUCTO","COMPLETADA",28.00],
      [3,"D-003",15,1,"25/01/2024","PRODUCTO_INCORRECTO","COMPLETADA",45.00]]),
    ("DETALLE_DEVOLUCIONES — final",
     ["id","devolucion_id","producto_id","cantidad","precio_unitario","subtotal"],
     [[1,1,1,2,3.50,7.00],
      [2,1,4,1,45.00,45.00],
      [3,2,3,1,28.00,28.00],
      [4,3,4,1,45.00,45.00]]),
  ],
  note_3fn="Esquema en 3FN. El cliente se accede vía VENTAS.cliente_id, sin redundancia.",

  sql_lines=[
    "CREATE TABLE devoluciones (",
    "    id                 BIGSERIAL PRIMARY KEY,",
    "    numero_devolucion  VARCHAR(20) UNIQUE NOT NULL,",
    "    venta_id           BIGINT REFERENCES ventas(id),",
    "    usuario_id         BIGINT REFERENCES usuarios(id) NOT NULL,",
    "    fecha              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,",
    "    motivo             VARCHAR(50) NOT NULL CHECK (motivo IN",
    "                       ('PRODUCTO_DEFECTUOSO','PRODUCTO_INCORRECTO','CAMBIO_PRODUCTO','OTRO')),",
    "    estado             VARCHAR(20) DEFAULT 'COMPLETADA',",
    "    observaciones      TEXT,",
    "    total              DECIMAL(10,2) NOT NULL DEFAULT 0",
    ");",
    "",
    "CREATE TABLE detalle_devoluciones (",
    "    id              BIGSERIAL PRIMARY KEY,",
    "    devolucion_id   BIGINT REFERENCES devoluciones(id) ON DELETE CASCADE,",
    "    producto_id     BIGINT REFERENCES productos(id),",
    "    cantidad        INTEGER NOT NULL CHECK (cantidad > 0),",
    "    precio_unitario DECIMAL(10,2) NOT NULL,",
    "    subtotal        DECIMAL(10,2) NOT NULL",
    ");",
  ],
  real_note="Esquema en 3FN. Flyway: V12__Devoluciones.sql",
)


# ════════════════════════════════════════════════════════════════════
#  TABLA 3 — CUENTAS_POR_COBRAR / PAGOS_CUENTA
# ════════════════════════════════════════════════════════════════════
make_sheet(
  name="3. CUENTAS POR COBRAR", title="TABLA 3 — CUENTAS_POR_COBRAR / PAGOS_CUENTA (Crédito/Fiado)", color="1E8449",

  hdrs_0fn=["id_deuda","fecha_aper","monto_total","saldo_pend","estado",
            "doc_cliente","nombre_cliente","tel_cliente","num_venta","username_cob",
            "rol_cob","fec_pago1","monto_pago1","forma1","fec_pago2","monto_pago2","forma2"],
  data_0fn=[
    [1,"05/01/2024",150.00,50.00,"PENDIENTE","87654321","María López","976543210","V-003",
     "cruzv","VENDEDOR","10/01/2024",50.00,"EFECTIVO","20/01/2024",50.00,"YAPE"],
    [2,"12/01/2024",80.00,0.00,"PAGADO","20345678901","Carlos Ríos","965432109","V-007",
     "admin","ADMIN","12/01/2024",80.00,"EFECTIVO","—","—","—"],
    [3,"20/01/2024",200.00,200.00,"PENDIENTE","12345678","Juan Pérez","987654321","V-014",
     "cruzv","VENDEDOR","—","—","—","—","—","—"],
  ],

  tables_1fn=[
    ("CUENTA_COBRAR_1FN",["id_deuda (PK)","fecha_apertura","monto_total","monto_pagado",
                          "saldo_pendiente","estado","fecha_vencimiento","observaciones",
                          "doc_cliente","nombre_cliente","tel_cliente","email_cliente",
                          "num_venta","fecha_venta","total_venta",
                          "username_cobrador","nombre_cobrador","rol_cobrador"]),
    ("PAGOS_CUENTA_1FN",["id_deuda (PK parte 1)","num_pago (PK parte 2)",
                          "fecha","monto","forma_pago",
                          "username_cobrador","nombre_cobrador","rol_cobrador","observaciones"]),
  ],
  data_1fn_list=[
    ("CUENTA_COBRAR_1FN",
     ["id_deuda","fecha_aper","monto_total","monto_pag","saldo_pend","estado","doc_cliente","nombre_cliente","num_venta"],
     [[1,"05/01/2024",150.00,100.00,50.00,"PENDIENTE","87654321","María López","V-003"],
      [2,"12/01/2024",80.00,80.00,0.00,"PAGADO","20345678901","Carlos Ríos","V-007"],
      [3,"20/01/2024",200.00,0.00,200.00,"PENDIENTE","12345678","Juan Pérez","V-014"]]),
    ("PAGOS_CUENTA_1FN",
     ["id_deuda","num_pago","fecha","monto","forma_pago","username_cob","nombre_cob"],
     [[1,1,"10/01/2024",50.00,"EFECTIVO","cruzv","Carlos Ruiz"],
      [1,2,"20/01/2024",50.00,"YAPE","cruzv","Carlos Ruiz"],
      [2,1,"12/01/2024",80.00,"EFECTIVO","admin","Administrador"]]),
  ],
  note_1fn="Eliminados grupos repetitivos (pago1…pagoN). Clave compuesta en PAGOS_CUENTA_1FN: (id_deuda, num_pago).",

  dep_hdrs=["Columna en PAGOS_CUENTA_1FN","Dep. de id_deuda","Dep. de num_pago","Dep. de AMBAS"],
  dep_rows=[
    ["fecha","✗","✓","✗ parcial"],
    ["monto","✗","✓","✗ parcial"],
    ["forma_pago","✗","✓","✗ parcial"],
    ["username_cobrador","✗","✓","✗ parcial"],
    ["observaciones","✗","✓","✗ parcial"],
  ],
  tables_2fn=[
    ("PAGOS_CUENTA_2FN",["id_pago (PK surrogate)","id_deuda (FK→CUENTAS_POR_COBRAR)",
                          "fecha","monto","forma_pago",
                          "username_cobrador","nombre_cobrador","rol_cobrador","observaciones"]),
  ],
  data_2fn_list=[
    ("PAGOS_CUENTA_2FN — con PK surrogate",
     ["id_pago","id_deuda","fecha","monto","forma_pago","username_cob","nombre_cob"],
     [[1,1,"10/01/2024",50.00,"EFECTIVO","cruzv","Carlos Ruiz"],
      [2,1,"20/01/2024",50.00,"YAPE","cruzv","Carlos Ruiz"],
      [3,2,"12/01/2024",80.00,"EFECTIVO","admin","Administrador"]]),
  ],
  note_2fn="Todos los atributos del pago dependen solo del pago. Se asigna PK surrogate id_pago.",

  trans_list=[
    "id_deuda → doc_cliente → nombre_cliente, tel_cliente, email_cliente",
    "  ↳ Datos del cliente dependen del cliente, NO de la deuda.",
    "id_deuda → num_venta → fecha_venta, total_venta",
    "  ↳ Datos de la venta dependen de la venta, NO de la deuda.",
    "id_pago → username_cobrador → nombre_cobrador, rol_cobrador",
    "  ↳ Datos del usuario dependen del usuario, NO del pago.",
    "NOTA: monto_pagado y saldo_pendiente son calculados — desnorm. controlada por performance.",
    "NOTA: cliente_id se mantiene como FK directa (además de venta_id) — consultas eficientes sin JOIN.",
  ],
  tables_3fn=[
    ("CLIENTES",["id (PK)","tipo_documento","numero_documento","nombre","telefono","puntos_fidelizacion"]),
    ("CUENTAS_POR_COBRAR — 3FN final",["id (PK)","venta_id (FK→VENTAS UNIQUE)",
                                        "cliente_id (FK→CLIENTES)",
                                        "monto_total","monto_pagado","saldo_pendiente",
                                        "estado","fecha_vencimiento","observaciones"]),
    ("PAGOS_CUENTA — 3FN final",["id (PK)","cuenta_id (FK→CUENTAS_POR_COBRAR)",
                                  "usuario_id (FK→USUARIOS)",
                                  "monto","fecha","forma_pago","observaciones"]),
  ],
  data_3fn_list=[
    ("CLIENTES",
     ["id","tipo_doc","num_doc","nombre","telefono","puntos_fidel"],
     [[1,"DNI","12345678","Juan Pérez","987654321",15],
      [2,"DNI","87654321","María López","976543210",8],
      [3,"RUC","20345678901","Carlos Ríos","965432109",0]]),
    ("CUENTAS_POR_COBRAR — final",
     ["id","venta_id","cliente_id","monto_total","monto_pagado","saldo_pendiente","estado","fec_vencimiento"],
     [[1,3,2,150.00,100.00,50.00,"PENDIENTE","05/02/2024"],
      [2,7,3,80.00,80.00,0.00,"PAGADO","12/02/2024"],
      [3,14,1,200.00,0.00,200.00,"PENDIENTE","20/02/2024"]]),
    ("PAGOS_CUENTA — final",
     ["id","cuenta_id","usuario_id","monto","fecha","forma_pago"],
     [[1,1,2,50.00,"10/01/2024","EFECTIVO"],
      [2,1,2,50.00,"20/01/2024","YAPE"],
      [3,2,1,80.00,"12/01/2024","EFECTIVO"]]),
  ],
  note_3fn="Esquema en 3FN. monto_pagado/saldo_pendiente: desnorm. controlada justificada por rendimiento.",

  sql_lines=[
    "CREATE TABLE cuentas_por_cobrar (",
    "    id                BIGSERIAL PRIMARY KEY,",
    "    venta_id          BIGINT REFERENCES ventas(id) UNIQUE,",
    "    cliente_id        BIGINT REFERENCES clientes(id) NOT NULL,",
    "    monto_total       DECIMAL(10,2) NOT NULL,",
    "    monto_pagado      DECIMAL(10,2) DEFAULT 0,",
    "    saldo_pendiente   DECIMAL(10,2) NOT NULL,",
    "    estado            VARCHAR(20) DEFAULT 'PENDIENTE'",
    "        CHECK (estado IN ('PENDIENTE','PAGADO','VENCIDO')),",
    "    fecha_vencimiento DATE,",
    "    observaciones     TEXT",
    ");",
    "",
    "CREATE TABLE pagos_cuenta (",
    "    id          BIGSERIAL PRIMARY KEY,",
    "    cuenta_id   BIGINT REFERENCES cuentas_por_cobrar(id) ON DELETE CASCADE,",
    "    monto       DECIMAL(10,2) NOT NULL CHECK (monto > 0),",
    "    fecha       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,",
    "    usuario_id  BIGINT REFERENCES usuarios(id) NOT NULL,",
    "    forma_pago  VARCHAR(20) NOT NULL CHECK (forma_pago IN",
    "                ('EFECTIVO','TARJETA','TRANSFERENCIA','YAPE','PLIN')),",
    "    observaciones TEXT",
    ");",
  ],
  real_note="Esquema en 3FN con desnormalizaciones controladas documentadas. Flyway: V13__Credito_fiado.sql",
)


# ════════════════════════════════════════════════════════════════════
#  TABLA 4 — MERMAS
# ════════════════════════════════════════════════════════════════════
make_sheet(
  name="4. MERMAS", title="TABLA 4 — MERMAS (Pérdidas operativas)", color="784212",

  hdrs_0fn=["id_merma","fecha","motivo","cod_prod","nombre_prod","marca","categ",
            "precio_compra","stock_antes*","cantidad","valor_perdida",
            "username","nombre_usr","email_usr","rol_usr"],
  data_0fn=[
    [1,"15/01/2024","ROTURA","P001","Cerveza Cristal 650ml","Backus","Cervezas",
     2.50,180,12,30.00,"cruzv","Carlos Ruiz","c.ruiz@chilalo.com","VENDEDOR"],
    [2,"20/01/2024","VENCIMIENTO","P003","Vino Tacama Tinto 750ml","Tacama","Vinos",
     22.00,30,5,110.00,"admin","Administrador","admin@chilalo.com","ADMIN"],
    [3,"25/01/2024","ROBO","P004","Ron Cartavio 1L","Cartavio","Ron",
     35.00,60,3,105.00,"admin","Administrador","admin@chilalo.com","ADMIN"],
    [4,"28/01/2024","DETERIORO","P002","Cerveza Pilsen 650ml","Backus","Cervezas",
     2.80,150,6,16.80,"cruzv","Carlos Ruiz","c.ruiz@chilalo.com","VENDEDOR"],
  ],

  tables_1fn=[
    ("MERMA_1FN — eliminado stock_antes (dato derivado)",
     ["id_merma (PK)","fecha","motivo","descripcion",
      "cod_producto","nombre_producto","marca_producto",
      "categ_producto","precio_compra","cantidad_perdida",
      "valor_perdida","username_responsable","nombre_responsable",
      "email_responsable","rol_responsable",
      "✗ ELIMINADO: stock_antes_merma (calculable desde movimientos_inventario)"]),
  ],
  data_1fn_list=[
    ("MERMA_1FN — stock_antes removido",
     ["id_merma","fecha","motivo","cod_prod","nombre_prod","categ","precio_compra","cant","valor","username","rol"],
     [[1,"15/01/2024","ROTURA","P001","Cerveza Cristal 650ml","Cervezas",2.50,12,30.00,"cruzv","VENDEDOR"],
      [2,"20/01/2024","VENCIMIENTO","P003","Vino Tacama Tinto 750ml","Vinos",22.00,5,110.00,"admin","ADMIN"],
      [3,"25/01/2024","ROBO","P004","Ron Cartavio 1L","Ron",35.00,3,105.00,"admin","ADMIN"],
      [4,"28/01/2024","DETERIORO","P002","Cerveza Pilsen 650ml","Cervezas",2.80,6,16.80,"cruzv","VENDEDOR"]]),
  ],
  note_1fn="Sin grupos repetitivos. Se elimina stock_antes_merma (dato derivado). Sin cambios estructurales.",

  dep_hdrs=["Observación 2FN","","",""],
  dep_rows=[
    ["MERMA_1FN tiene clave primaria SIMPLE (id_merma).","","",""],
    ["Todos los atributos no clave dependen de id_merma → 2FN se cumple AUTOMÁTICAMENTE.","","",""],
    ["No se requiere ninguna acción estructural adicional.","","",""],
  ],
  tables_2fn=[
    ("MERMA_2FN — sin cambios (PK simple → 2FN automática)",
     ["id_merma (PK)","fecha","motivo","descripcion",
      "cod_producto","nombre_producto","marca_producto","categ_producto",
      "precio_compra","cantidad_perdida","valor_perdida",
      "username_responsable","nombre_responsable","rol_responsable"]),
  ],
  data_2fn_list=[
    ("MERMA_2FN — idéntica a 1FN (ya en 2FN)",
     ["id_merma","fecha","motivo","cod_prod","nombre_prod","categ","precio_compra","cant","valor","username","rol"],
     [[1,"15/01/2024","ROTURA","P001","Cerveza Cristal 650ml","Cervezas",2.50,12,30.00,"cruzv","VENDEDOR"],
      [2,"20/01/2024","VENCIMIENTO","P003","Vino Tacama Tinto 750ml","Vinos",22.00,5,110.00,"admin","ADMIN"],
      [3,"25/01/2024","ROBO","P004","Ron Cartavio 1L","Ron",35.00,3,105.00,"admin","ADMIN"],
      [4,"28/01/2024","DETERIORO","P002","Cerveza Pilsen 650ml","Cervezas",2.80,6,16.80,"cruzv","VENDEDOR"]]),
  ],
  note_2fn="PK simple → 2FN automática. La tabla ya está en 2FN sin cambios estructurales.",

  trans_list=[
    "id_merma → cod_producto → nombre_producto, marca_producto, categ_producto, precio_compra",
    "  ↳ Datos del producto dependen del producto (tabla PRODUCTOS), NO de la merma.",
    "id_merma → username_responsable → nombre_responsable, email_responsable, rol_responsable",
    "  ↳ Datos del usuario dependen del usuario (tabla USUARIOS), NO de la merma.",
    "EXCEPCIÓN DOCUMENTADA: valor_perdida",
    "  ↳ Aunque valor_perdida ≈ cantidad × precio_compra, el precio cambia con el tiempo.",
    "  ↳ Se persiste para conservar el valor HISTÓRICO correcto al momento del evento.",
    "DATO ELIMINADO: stock_antes_merma → calculable desde movimientos_inventario.",
  ],
  tables_3fn=[
    ("PRODUCTOS (referenciada)",["id (PK)","codigo_barras","nombre","marca",
                                  "categoria_id (FK)","precio_compra","precio_venta","stock_actual"]),
    ("USUARIOS (referenciada)",["id (PK)","username","nombre","email","rol","activo"]),
    ("MERMAS — 3FN final",["id (PK)","producto_id (FK→PRODUCTOS)",
                            "usuario_id (FK→USUARIOS)",
                            "cantidad","motivo","descripcion",
                            "valor_perdida  ← excepción documentada (dato histórico)","fecha"]),
  ],
  data_3fn_list=[
    ("PRODUCTOS (datos referenciados en mermas)",
     ["id","codigo_barras","nombre","marca","categ_id","precio_compra","precio_venta","stock_actual"],
     [[1,"7751010001","Cerveza Cristal 650ml","Backus",1,2.50,3.50,168],
      [2,"7751010002","Cerveza Pilsen 650ml","Backus",1,2.80,3.50,144],
      [3,"7750000003","Vino Tacama Tinto 750ml","Tacama",2,22.00,28.00,25],
      [4,"7752000004","Ron Cartavio 1L","Cartavio",5,35.00,45.00,57]]),
    ("USUARIOS (datos referenciados en mermas)",
     ["id","username","nombre","email","rol","activo"],
     [[1,"admin","Administrador","admin@chilalo.com","ADMIN",True],
      [2,"cruzv","Carlos Ruiz","c.ruiz@chilalo.com","VENDEDOR",True]]),
    ("MERMAS — final 3FN",
     ["id","producto_id","usuario_id","cantidad","motivo","descripcion","valor_perdida","fecha"],
     [[1,1,2,12,"ROTURA","Caída en almacén",30.00,"15/01/2024"],
      [2,3,1,5,"VENCIMIENTO","Lote nov-2023 vencido",110.00,"20/01/2024"],
      [3,4,1,3,"ROBO","Hurto en tienda",105.00,"25/01/2024"],
      [4,2,2,6,"DETERIORO","Etiquetas dañadas",16.80,"28/01/2024"]]),
  ],
  note_3fn="Esquema en 3FN. valor_perdida conservado como excepción documentada (integridad histórica).",

  sql_lines=[
    "CREATE TABLE mermas (",
    "    id            BIGSERIAL PRIMARY KEY,",
    "    producto_id   BIGINT REFERENCES productos(id) NOT NULL,",
    "    cantidad      INTEGER NOT NULL CHECK (cantidad > 0),",
    "    motivo        VARCHAR(50) NOT NULL CHECK (motivo IN",
    "                  ('VENCIMIENTO','ROTURA','DETERIORO','ROBO','DIFERENCIA_INVENTARIO','OTRO')),",
    "    descripcion   TEXT,",
    "    valor_perdida DECIMAL(10,2) NOT NULL DEFAULT 0,",
    "    fecha         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,",
    "    usuario_id    BIGINT REFERENCES usuarios(id) NOT NULL",
    ");",
  ],
  real_note="Esquema en 3FN. valor_perdida: excepción documentada por integridad histórica. Flyway: V16__Mermas.sql",
)


# ════════════════════════════════════════════════════════════════════
#  HOJA RESUMEN
# ════════════════════════════════════════════════════════════════════
ws_r = wb.create_sheet(title="Resumen")
ws_r.sheet_view.showGridLines = False
cw(ws_r, [3, 18, 26, 24, 24, 24, 3])

r = 2
ws_r.merge_cells("B2:F2")
c = ws_r["B2"]; c.value = "RESUMEN — NORMALIZACIÓN DE 4 TABLAS"
c.fill = fill(C_TITLE_BG); c.font = fnt(bold=True, color="FFFFFF", size=14)
c.alignment = aln(h="center"); rh(ws_r, 2, 34)

ws_r.merge_cells("B3:F3")
c = ws_r["B3"]; c.value = "Licorería Chilalo, Piura  |  PostgreSQL 15  |  Flyway V1–V18"
c.fill = fill("2C3E50"); c.font = fnt(color="ECF0F1", size=11)
c.alignment = aln(h="center"); rh(ws_r, 3, 22)

r = 5
for ci, h in enumerate(["Tabla","Problema 0FN","Acción 1FN","Acción 2FN","Acción 3FN"]):
    wc(ws_r, r, 2+ci, h, bg="1A5276", fg="FFFFFF", bold=True, ha="center", sz=10)
rh(ws_r, r, 22); r += 1

rows_res = [
  ("1A5276","COMPRAS /\nDETALLE_COMPRAS",
   "Grupos repetitivos (ítems)\nDatos proveedor y usuario\nrepetidos en cada fila",
   "Separar DETALLE_COMPRAS\nClave compuesta:\n(num_compra, cod_producto)",
   "Mover nombre_producto\ny nombre_categoria\na tabla PRODUCTOS",
   "FK a PROVEEDORES, USUARIOS\nFK a CATEGORIAS vía PRODUCTOS\nEliminar transitivas"),
  ("922B21","DEVOLUCIONES /\nDETALLE_DEVOLUCIONES",
   "Grupos repetitivos (ítems)\nDatos venta, cliente\ny usuario repetidos",
   "Separar DETALLE_DEVOLUCIONES\nClave compuesta:\n(num_devolucion, cod_producto)",
   "Mover nombre_producto\na tabla PRODUCTOS\n(dep. parcial de cod_producto)",
   "FK a VENTAS y USUARIOS\nCliente vía VENTAS.cliente_id\nSin redundancia"),
  ("1E8449","CUENTAS_POR_COBRAR /\nPAGOS_CUENTA",
   "Grupos repetitivos (abonos)\nDatos cliente, venta\ny usuario repetidos",
   "Separar PAGOS_CUENTA\nClave compuesta:\n(id_deuda, num_pago)",
   "Todos atributos pago\ndependen solo del pago\n→ PK surrogate id_pago",
   "FK a CLIENTES, VENTAS, USUARIOS\nmonto_pagado: desnorm. controlada\ncliente_id: FK directa justificada"),
  ("784212","MERMAS",
   "Datos producto y usuario\nrepetidos (transitivos)\nstock_antes: dato derivado",
   "Sin grupos repetitivos\nEliminar stock_antes_merma\n(calculable desde movimientos)",
   "PK simple → 2FN\nautomática\nSin cambios estructurales",
   "FK a PRODUCTOS y USUARIOS\nvalor_perdida: excepción\ndocumentada (histórico)"),
]
for color, tabla, p0, p1, p2, p3 in rows_res:
    for ci, val in enumerate([tabla, p0, p1, p2, p3]):
        bg = color if ci == 0 else ("EAF2FF" if rows_res.index((color,tabla,p0,p1,p2,p3))%2==0 else "FDFEFE")
        fg = "FFFFFF" if ci == 0 else "000000"
        wc(ws_r, r, 2+ci, val, bg=bg, fg=fg, bold=(ci==0), sz=9, ha="center" if ci==0 else "left")
    rh(ws_r, r, 60); r += 1
    rh(ws_r, r, 4); r += 1

r += 1
mtitle(ws_r, r, 2, 6, "NOTAS DE DISEÑO — DECISIONES DOCUMENTADAS", C_TITLE_BG, sz=11)
rh(ws_r, r, 22); r += 1
notas = [
    "① valor_perdida en MERMAS: persiste aunque ≈ cantidad × precio_compra porque el precio cambia. Garantiza valor histórico.",
    "② monto_pagado / saldo_pendiente en CUENTAS_POR_COBRAR: desnorm. por performance. CuentaPorCobrarService los actualiza en cada pago.",
    "③ cliente_id en CUENTAS_POR_COBRAR: FK directa además de venta_id. Permite consultas por cliente sin JOIN adicional.",
    "④ stock_antes_merma: eliminado. Dato derivado calculable desde movimientos_inventario.",
    "⑤ Todas las tablas cumplen 3FN en producción. Las excepciones son desnormalizaciones justificadas y controladas por la capa de servicio (Spring/Java).",
]
for i, nota in enumerate(notas):
    bg = "EBF5FB" if i%2==0 else "FDFEFE"
    ws_r.merge_cells(start_row=r,start_column=2,end_row=r,end_column=6)
    wc(ws_r, r, 2, nota, bg=bg, sz=9)
    rh(ws_r, r, 22); r += 1

# ── Guardar ──────────────────────────────────────────────────────────
out = r"C:\Users\Usuario\Desktop\Liquor-Store-Piura-master\Liquor-Store-Piura-master\Ficha_107_Normalizacion_BD.xlsx"
wb.save(out)
print(f"Excel generado: {out}")
