# -*- coding: utf-8 -*-
"""
Genera el Capítulo IV del TAAP en Microsoft Word (.docx) a partir de
CAPITULO_IV_PROGRAMACION.md, aplicando indicaciones de formato tipo APA 7
(márgenes carta, Times New Roman, doble espacio, sangría de párrafo, etc.).
"""
from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_LINE_SPACING, WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt

MD_FILE = Path(__file__).resolve().parent / "CAPITULO_IV_PROGRAMACION.md"
OUT_FILE = Path(__file__).resolve().parent / "CAPITULO_IV_TAAP_APA7.docx"

KEEP_UPPER = {"IV", "III", "II", "API", "JWT", "SQL", "CRUD", "POS", "PDF", "DTO", "SUNAT", "JPQL", "HTTP", "REST", "JPA", "JDK", "CSV", "XML", "CDR", "OSE", "SMTP", "BOM", "KPI", "SPA", "UI", "MVVM"}


def set_run_font(run, name: str = "Times New Roman", size: int = 12, bold: bool = False, italic: bool = False) -> None:
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic


def configure_section(section) -> None:
    section.page_height = Inches(11)
    section.page_width = Inches(8.5)
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)


def strip_heading_number(s: str) -> str:
    return re.sub(r"^\d+(\.\d+)*\s*", "", s).strip()


def apa_title_case(s: str) -> str:
    """Título con estilo solicitado (palabras significativas capitalizadas; siglas respetadas)."""
    s = strip_heading_number(s)
    roman = {"ii": "II", "iii": "III", "iv": "IV"}

    def one_word(raw: str) -> str:
        trailing = ""
        if raw.endswith(":"):
            raw, trailing = raw[:-1], ":"
        core = re.sub(r"^\W+|\W+$", "", raw)
        if not core:
            return raw + trailing
        low = core.lower()
        if low in roman:
            return roman[low] + trailing
        if core.upper() in KEEP_UPPER:
            return core.upper() + trailing
        return core[:1].upper() + core[1:].lower() + trailing

    return " ".join(one_word(w) for w in s.split())


def add_heading_centered(doc: Document, text: str, size: int = 14) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Cm(0)
    run = p.add_run(text)
    set_run_font(run, size=size, bold=True)


def add_subtitle_centered(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.first_line_indent = Cm(0)
    run = p.add_run(text)
    set_run_font(run, size=12, bold=True)


def add_heading_h2(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Cm(0)
    run = p.add_run(text)
    set_run_font(run, size=14, bold=True)


def add_heading_h3(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Cm(0)
    run = p.add_run(text)
    set_run_font(run, size=12, bold=True, italic=True)


def add_normal_paragraph(doc: Document, text: str) -> None:
    text = text.strip()
    if not text:
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Inches(0.5)
    p.paragraph_format.widow_control = True
    _add_inline_bold(p, text)


def _add_inline_bold(paragraph, text: str) -> None:
    parts = re.split(r"(\*\*[^*]+\*\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            run = paragraph.add_run(part[2:-2])
            set_run_font(run, bold=True)
        else:
            run = paragraph.add_run(part)
            set_run_font(run)


def add_code_block(doc: Document, code: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(code.rstrip("\n"))
    set_run_font(run, name="Consolas", size=9)


def add_table_caption(doc: Document, n: int, title: str | None = None) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.first_line_indent = Cm(0)
    cap = f"Tabla {n}"
    if title:
        cap += f". {title}"
    run = p.add_run(cap)
    set_run_font(run, size=12, bold=True)


def add_markdown_table(doc: Document, lines: list[str]) -> None:
    rows: list[list[str]] = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        if re.match(r"^\|\s*[-:]+\s*\|", line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
    if not rows:
        return
    ncols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=ncols)
    table.style = "Table Grid"
    for i, row in enumerate(rows):
        for j in range(ncols):
            txt = row[j] if j < len(row) else ""
            txt = re.sub(r"\*\*([^*]+)\*\*", r"\1", txt)
            cell = table.rows[i].cells[j]
            cell.text = ""
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
            cp.paragraph_format.space_after = Pt(0)
            run = cp.add_run(txt)
            set_run_font(run, size=12)
    doc.add_paragraph()


def add_bullet_list(doc: Document, items: list[str]) -> None:
    for item in items:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
        p.paragraph_format.left_indent = Inches(0.5)
        p.paragraph_format.first_line_indent = Inches(-0.25)
        _add_inline_bold(p, "• " + item)


def add_referencias(doc: Document) -> None:
    add_heading_h2(doc, "Referencias")
    refs = [
        "American Psychological Association. (2020). Manual de publicaciones de la American Psychological Association (7.ª ed.). American Psychological Association.",
        "Spring. (s. f.). Spring Boot Reference Documentation. https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/",
        "Meta Open Source. (s. f.). React. https://react.dev/",
        "PostgreSQL Global Development Group. (s. f.). PostgreSQL 15 Documentation. https://www.postgresql.org/docs/15/index.html/",
    ]
    for r in refs:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        p.paragraph_format.first_line_indent = Cm(-1.27)
        p.paragraph_format.left_indent = Cm(1.27)
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(r)
        set_run_font(run, size=12)


def humanize(text: str) -> str:
    swaps = [
        (
            "El sistema sigue una **arquitectura de tres capas** distribuida en tres componentes independientes que se comunican entre sí a través de una API REST:",
            "En conjunto, el sistema adopta una **arquitectura de tres capas**; esto significa que tres bloques técnicos bien delimitados comparten responsabilidades y conversan a través de una API REST estable y predecible.",
        ),
        (
            "El backend sigue estrictamente el patrón **Controller → Service → Repository → Entity**:",
            "En el servidor, el código respeta de manera estricta el patrón **Controller → Service → Repository → Entity**, una decisión que concentra la lógica de negocio en los servicios y mantiene los controladores delgados.",
        ),
        (
            "La seguridad se implementa mediante **JWT stateless**:",
            "La seguridad se apoya en **tokens JWT en modo stateless**, de modo que no se mantienen sesiones de servidor y cada solicitud puede validarse de forma autónoma.",
        ),
        (
            "El esquema se construye de forma incremental mediante 18 migraciones versionadas:",
            "El esquema relacional se fue construyendo de manera incremental con **18 migraciones Flyway versionadas**, lo que deja constancia ordenada de cada cambio y simplifica ambientes de prueba y producción.",
        ),
        (
            "Todas las respuestas del backend siguen un formato estándar `ApiResponse<T>`:",
            "Para que el cliente siempre interprete bien el resultado, las respuestas del backend se encapsulan en un formato estándar `ApiResponse<T>`.",
        ),
        (
            "El método `crear()` del `VentaService` implementa la lógica completa de una venta:",
            "El método `crear()` de `VentaService` concentra la lógica completa de una venta, desde la validación de stock hasta el cálculo de impuestos y la fidelización.",
        ),
        (
            "El controlador `ProductoController` expone operaciones completas con eliminación lógica:",
            "Mediante `ProductoController` se exponen operaciones completas de catálogo, incluyendo una **eliminación lógica** que preserva el historial.",
        ),
        (
            "La anulación de una venta restaura el stock de todos los productos involucrados:",
            "Cuando se anula una venta, el sistema **restituye el stock** de cada producto involucrado y deja rastro en movimientos de inventario.",
        ),
    ]
    for old, new in swaps:
        if old in text:
            text = text.replace(old, new)
    return text


def is_ascii_art_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    box = "\u2502\u2500\u250c\u2510\u2514\u2518\u252c\u2534\u2550\u2551"
    return any(c in s for c in box)


def parse_build(doc: Document, md_text: str) -> int:
    lines = md_text.splitlines()
    i = 0
    table_counter = 1
    in_code = False
    code_buf: list[str] = []
    code_lang = ""

    while i < len(lines):
        line = lines[i]

        if line.strip() == "---":
            i += 1
            continue

        if line.startswith("```"):
            if not in_code:
                in_code = True
                code_lang = line[3:].strip().lower()
                code_buf = []
            else:
                in_code = False
                if code_lang == "plantuml":
                    add_normal_paragraph(
                        doc,
                        "Para reproducir el diagrama en herramientas de modelado, el proyecto incluye el código **PlantUML** correspondiente en la carpeta `docs`; aquí se omite el listado por extensión y se mantiene el esquema ASCII equivalente.",
                    )
                else:
                    add_code_block(doc, "".join(code_buf))
                code_buf = []
            i += 1
            continue

        if in_code:
            code_buf.append(line + "\n")
            i += 1
            continue

        if line.strip().startswith("|") and "|" in line:
            tbl: list[str] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                tbl.append(lines[i])
                i += 1
            title_guess = None
            add_table_caption(doc, table_counter, title_guess)
            add_markdown_table(doc, tbl)
            table_counter += 1
            continue

        if line.startswith("# ") and not line.startswith("##"):
            add_heading_centered(doc, apa_title_case(line[2:].strip()))
            i += 1
            continue

        if line.startswith("## ") and not line.startswith("###"):
            raw = line[3:].strip()
            if re.match(r"^\d", raw):
                add_heading_h2(doc, apa_title_case(raw))
            else:
                add_subtitle_centered(doc, apa_title_case(raw))
            i += 1
            continue

        if line.startswith("### "):
            add_heading_h3(doc, apa_title_case(line[4:].strip()))
            i += 1
            continue

        if line.strip().startswith("- "):
            items: list[str] = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append(lines[i].strip()[2:].strip())
                i += 1
            add_bullet_list(doc, items)
            continue

        if line.strip() == "":
            i += 1
            continue

        if is_ascii_art_line(line):
            ascii_buf: list[str] = []
            while i < len(lines) and lines[i].strip():
                if lines[i].startswith("#"):
                    break
                if lines[i].strip().startswith("|") or lines[i].startswith("```"):
                    break
                if lines[i].strip().startswith("- "):
                    break
                ascii_buf.append(lines[i])
                i += 1
            add_code_block(doc, "\n".join(ascii_buf))
            continue

        if line.strip().startswith("*") and line.strip().endswith("*") and line.count("*") >= 2:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
            p.paragraph_format.first_line_indent = Cm(0)
            txt = line.strip().strip("*").strip()
            run = p.add_run(txt)
            set_run_font(run, size=10, italic=True)
            i += 1
            continue

        buf = [line.strip()]
        i += 1
        while i < len(lines):
            nxt = lines[i]
            if not nxt.strip():
                break
            if nxt.startswith("#") or nxt.startswith("```") or nxt.strip().startswith("|"):
                break
            if nxt.strip().startswith("- "):
                break
            if is_ascii_art_line(nxt):
                break
            buf.append(nxt.strip())
            i += 1
        text = " ".join(buf)
        if text.startswith("Equivalente en **PlantUML**"):
            text = (
                "El mismo esquema puede generarse en **PlantUML** a partir del archivo incluido en `docs/ARQUITECTURA_TRES_CAPAS_CAPITULO_IV.puml`, útil si se desea exportar la figura a PNG o SVG para el anexo del trabajo."
            )
        text = humanize(text)
        add_normal_paragraph(doc, text)

    return table_counter


def main() -> None:
    text = MD_FILE.read_text(encoding="utf-8")
    doc = Document()
    for section in doc.sections:
        configure_section(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(12)
    normal.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT

    parse_build(doc, text)
    add_referencias(doc)

    doc.save(OUT_FILE)
    print(f"Guardado: {OUT_FILE}")


if __name__ == "__main__":
    main()
