package com.licoreria.service;

import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.reporte.*;
import com.licoreria.entity.DetalleVenta;
import com.licoreria.entity.Producto;
import com.licoreria.entity.Venta;
import com.licoreria.repository.GastoRepository;
import com.licoreria.repository.ProductoRepository;
import com.licoreria.repository.VentaRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfTemplate;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final InventarioService inventarioService;
    private final GastoRepository gastoRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_DISPLAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Transactional(readOnly = true)
    public com.licoreria.dto.reporte.DashboardDTO obtenerDashboard() {
        LocalDate hoy = LocalDate.now();
        ReporteVentasDTO ventasHoy = obtenerReporteVentas(hoy, hoy, "DIA");
        ReporteInventarioDTO inventario = obtenerReporteInventario();

        Instant desde = hoy.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = hoy.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<Venta> ventasConDetalles = ventaRepository.findByFechaBetweenWithDetalles(desde, hasta);
        BigDecimal gananciasHoy = BigDecimal.ZERO;
        for (Venta v : ventasConDetalles) {
            if (v.getEstado() != Venta.Estado.COMPLETADA) continue;
            for (DetalleVenta d : v.getDetalles()) {
                if (d.getProducto() != null && d.getPrecioUnitario() != null && d.getCantidad() != null) {
                    BigDecimal costo = d.getProducto().getPrecioCompra() != null
                            ? d.getProducto().getPrecioCompra() : BigDecimal.ZERO;
                    BigDecimal margen = d.getPrecioUnitario().subtract(costo);
                    gananciasHoy = gananciasHoy.add(margen.multiply(BigDecimal.valueOf(d.getCantidad())));
                }
            }
        }

        com.licoreria.dto.reporte.DashboardDTO dto = new com.licoreria.dto.reporte.DashboardDTO();
        dto.setVentasHoy(ventasHoy.getTotalVentas() != null ? ventasHoy.getTotalVentas() : BigDecimal.ZERO);
        dto.setGananciasHoy(gananciasHoy != null ? gananciasHoy : BigDecimal.ZERO);
        dto.setTransaccionesHoy(ventasHoy.getTotalTransacciones());
        dto.setProductosActivos(inventario.getProductosActivos());
        dto.setProductosStockBajo(inventario.getProductosStockBajo());
        dto.setProductosProximosVencer(inventario.getProductosProximosVencer());
        return dto;
    }

    @Transactional(readOnly = true)
    public ReporteVentasDTO obtenerReporteVentas(LocalDate fechaInicio, LocalDate fechaFin, String agrupacion) {
        Instant desde = fechaInicio.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = fechaFin.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Venta> ventas = ventaRepository.findByFechaBetween(desde, hasta, org.springframework.data.domain.Pageable.unpaged())
                .getContent();
        ventas = ventas.stream().filter(v -> v.getEstado() == Venta.Estado.COMPLETADA).toList();

        BigDecimal totalVentas = ventas.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        long transacciones = ventas.size();
        BigDecimal ticketPromedio = transacciones > 0
                ? totalVentas.divide(BigDecimal.valueOf(transacciones), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Agrupar según agrupacion: DIA, SEMANA o MES
        String agrupacionNorm = (agrupacion != null && !agrupacion.isBlank()) ? agrupacion.toUpperCase(java.util.Locale.ROOT) : "DIA";
        Map<String, List<Venta>> porPeriodo;
        if ("SEMANA".equals(agrupacionNorm)) {
            WeekFields isoWeek = WeekFields.ISO;
            porPeriodo = ventas.stream()
                    .collect(Collectors.groupingBy(v -> {
                        LocalDate d = LocalDate.ofInstant(v.getFecha(), ZoneId.systemDefault());
                        LocalDate lunes = d.with(isoWeek.dayOfWeek(), 1);
                        return lunes.format(DATE_FMT);
                    }));
        } else if ("MES".equals(agrupacionNorm)) {
            porPeriodo = ventas.stream()
                    .collect(Collectors.groupingBy(v -> {
                        LocalDate d = LocalDate.ofInstant(v.getFecha(), ZoneId.systemDefault());
                        return d.withDayOfMonth(1).format(DATE_FMT);
                    }));
        } else {
            porPeriodo = ventas.stream()
                    .collect(Collectors.groupingBy(v -> LocalDate.ofInstant(v.getFecha(), ZoneId.systemDefault()).format(DATE_FMT)));
        }

        List<ReporteVentasDTO.VentaPorDiaDTO> ventasPorDia = new ArrayList<>();
        if ("SEMANA".equals(agrupacionNorm)) {
            LocalDate current = fechaInicio.with(WeekFields.ISO.dayOfWeek(), 1);
            while (!current.isAfter(fechaFin)) {
                String key = current.format(DATE_FMT);
                List<Venta> delPeriodo = porPeriodo.getOrDefault(key, List.of());
                BigDecimal totalPeriodo = delPeriodo.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                ventasPorDia.add(new ReporteVentasDTO.VentaPorDiaDTO() {{
                    setFecha(key);
                    setTotal(totalPeriodo);
                    setTransacciones(delPeriodo.size());
                }});
                current = current.plusWeeks(1);
            }
        } else if ("MES".equals(agrupacionNorm)) {
            LocalDate current = fechaInicio.withDayOfMonth(1);
            while (!current.isAfter(fechaFin)) {
                String key = current.format(DATE_FMT);
                List<Venta> delPeriodo = porPeriodo.getOrDefault(key, List.of());
                BigDecimal totalPeriodo = delPeriodo.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                ventasPorDia.add(new ReporteVentasDTO.VentaPorDiaDTO() {{
                    setFecha(key);
                    setTotal(totalPeriodo);
                    setTransacciones(delPeriodo.size());
                }});
                current = current.plusMonths(1);
            }
        } else {
            LocalDate current = fechaInicio;
            while (!current.isAfter(fechaFin)) {
                String key = current.format(DATE_FMT);
                List<Venta> delDia = porPeriodo.getOrDefault(key, List.of());
                BigDecimal totalDia = delDia.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                ventasPorDia.add(new ReporteVentasDTO.VentaPorDiaDTO() {{
                    setFecha(key);
                    setTotal(totalDia);
                    setTransacciones(delDia.size());
                }});
                current = current.plusDays(1);
            }
        }

        // Por forma de pago
        Map<String, List<Venta>> porForma = ventas.stream()
                .collect(Collectors.groupingBy(v -> v.getFormaPago().name()));
        List<ReporteVentasDTO.VentaPorFormaPagoDTO> porFormaPago = porForma.entrySet().stream()
                .map(e -> new ReporteVentasDTO.VentaPorFormaPagoDTO() {{
                    setFormaPago(e.getKey());
                    setTotal(e.getValue().stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
                    setCantidad(e.getValue().size());
                }})
                .collect(Collectors.toList());

        // Ganancias del período (venta − compra por unidad)
        List<Venta> ventasConDetalles = ventaRepository.findByFechaBetweenWithDetalles(desde, hasta);
        BigDecimal ganancias = BigDecimal.ZERO;
        for (Venta v : ventasConDetalles) {
            if (v.getEstado() != Venta.Estado.COMPLETADA) continue;
            for (DetalleVenta d : v.getDetalles()) {
                if (d.getProducto() != null && d.getPrecioUnitario() != null && d.getCantidad() != null) {
                    BigDecimal costo = d.getProducto().getPrecioCompra() != null
                            ? d.getProducto().getPrecioCompra() : BigDecimal.ZERO;
                    BigDecimal margen = d.getPrecioUnitario().subtract(costo);
                    ganancias = ganancias.add(margen.multiply(BigDecimal.valueOf(d.getCantidad())));
                }
            }
        }

        // Ventas por categoría
        Map<String, BigDecimal> totalPorCategoria = new HashMap<>();
        Map<String, Long> cantPorCategoria = new HashMap<>();
        for (Venta v : ventasConDetalles) {
            if (v.getEstado() != Venta.Estado.COMPLETADA) continue;
            for (DetalleVenta d : v.getDetalles()) {
                String cat;
                if (d.getPack() != null) {
                    cat = "Packs";
                } else if (d.getProducto() != null && d.getProducto().getCategoria() != null) {
                    cat = d.getProducto().getCategoria().getNombre();
                } else {
                    cat = "Sin categoría";
                }
                totalPorCategoria.merge(cat,
                        d.getSubtotal() != null ? d.getSubtotal() : BigDecimal.ZERO,
                        BigDecimal::add);
                cantPorCategoria.merge(cat,
                        (long) (d.getCantidad() != null ? d.getCantidad() : 0),
                        Long::sum);
            }
        }
        List<ReporteVentasDTO.VentasPorCategoriaDTO> ventasPorCategoria = totalPorCategoria.entrySet().stream()
                .map(e -> {
                    ReporteVentasDTO.VentasPorCategoriaDTO c = new ReporteVentasDTO.VentasPorCategoriaDTO();
                    c.setCategoria(e.getKey());
                    c.setTotal(e.getValue());
                    c.setCantidadVendida(cantPorCategoria.getOrDefault(e.getKey(), 0L));
                    return c;
                })
                .sorted(Comparator.comparing(ReporteVentasDTO.VentasPorCategoriaDTO::getTotal).reversed())
                .collect(Collectors.toList());

        // Ventas por vendedor
        Map<Long, List<Venta>> porVendedor = ventas.stream()
                .collect(Collectors.groupingBy(v -> v.getUsuario().getId()));
        List<ReporteVentasDTO.VentasPorVendedorDTO> ventasPorVendedor2 = porVendedor.entrySet().stream()
                .map(e -> {
                    List<Venta> vv = e.getValue();
                    BigDecimal totalV = vv.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    long trx = vv.size();
                    BigDecimal ticket = trx > 0 ? totalV.divide(BigDecimal.valueOf(trx), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                    ReporteVentasDTO.VentasPorVendedorDTO d = new ReporteVentasDTO.VentasPorVendedorDTO();
                    d.setVendedor(vv.get(0).getUsuario().getNombre());
                    d.setRol(vv.get(0).getUsuario().getRol().name());
                    d.setTotalVentas(totalV);
                    d.setTransacciones(trx);
                    d.setTicketPromedio(ticket);
                    return d;
                })
                .sorted(Comparator.comparing(ReporteVentasDTO.VentasPorVendedorDTO::getTotalVentas).reversed())
                .collect(Collectors.toList());

        BigDecimal totalGastos = gastoRepository.sumMontoByFechaBetween(fechaInicio, fechaFin);
        if (totalGastos == null) totalGastos = BigDecimal.ZERO;
        BigDecimal gananciaNeta = ganancias.subtract(totalGastos);

        ReporteVentasDTO dto = new ReporteVentasDTO();
        dto.setTotalVentas(totalVentas);
        dto.setTotalTransacciones(transacciones);
        dto.setTicketPromedio(ticketPromedio);
        dto.setGanancias(ganancias);
        dto.setTotalGastos(totalGastos);
        dto.setGananciaNeta(gananciaNeta);
        dto.setVentasPorDia(ventasPorDia);
        dto.setVentasPorFormaPago(porFormaPago);
        dto.setVentasPorCategoria(ventasPorCategoria);
        dto.setVentasPorVendedor(ventasPorVendedor2);
        return dto;
    }

    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(LocalDate fechaInicio, LocalDate fechaFin, int limite) {
        Instant desde = fechaInicio.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = fechaFin.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Venta> ventas = ventaRepository.findByFechaBetweenWithDetalles(desde, hasta);
        ventas = ventas.stream().filter(v -> v.getEstado() == Venta.Estado.COMPLETADA).toList();

        Map<Long, InfoProducto> mapa = new HashMap<>();
        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (Venta v : ventas) {
            for (var det : v.getDetalles()) {
                Producto p = det.getProducto();
                if (p == null) continue; // ignorar líneas de pack por ahora para simplificar
                Long pid = p.getId();
                InfoProducto info = mapa.computeIfAbsent(pid, k -> new InfoProducto(p.getNombre()));
                info.cantidad += det.getCantidad();
                info.total = info.total.add(det.getSubtotal());
                totalGeneral = totalGeneral.add(det.getSubtotal());
            }
        }

        if (totalGeneral.compareTo(BigDecimal.ZERO) == 0) return List.of();

        final BigDecimal totalFinal = totalGeneral;
        return mapa.entrySet().stream()
                .map(e -> {
                    ProductoMasVendidoDTO d = new ProductoMasVendidoDTO();
                    d.setProductoId(e.getKey());
                    d.setNombreProducto(e.getValue().nombre);
                    d.setCantidadVendida(e.getValue().cantidad);
                    d.setTotalVentas(e.getValue().total);
                    d.setPorcentajeDelTotal(e.getValue().total
                            .multiply(BigDecimal.valueOf(100))
                            .divide(totalFinal, 2, RoundingMode.HALF_UP));
                    return d;
                })
                .sorted(Comparator.comparing(ProductoMasVendidoDTO::getTotalVentas).reversed())
                .limit(limite)
                .collect(Collectors.toList());
    }

    private static class InfoProducto {
        String nombre;
        long cantidad;
        BigDecimal total = BigDecimal.ZERO;

        InfoProducto(String nombre) { this.nombre = nombre; }
    }

    public ReporteInventarioDTO obtenerReporteInventario() {
        var stockBajoRes = inventarioService.obtenerProductosStockBajo();
        var proximosRes = inventarioService.obtenerProductosProximosVencer(30);

        List<Producto> activos = productoRepository.findByActivoTrue();
        BigDecimal valorTotal = activos.stream()
                .map(p -> p.getPrecioCompra() != null
                        ? p.getPrecioCompra().multiply(BigDecimal.valueOf(p.getStockActual()))
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        ReporteInventarioDTO dto = new ReporteInventarioDTO();
        dto.setValorTotalInventario(valorTotal);
        dto.setProductosActivos(activos.size());
        dto.setStockBajo(stockBajoRes.getData() != null ? stockBajoRes.getData() : List.of());
        dto.setProximosVencer(proximosRes.getData() != null ? proximosRes.getData() : List.of());
        dto.setProductosStockBajo(dto.getStockBajo().size());
        dto.setProductosProximosVencer(dto.getProximosVencer().size());
        return dto;
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  REPORTE DE VENTAS PDF — versión mejorada con gráficos y detalle completo
    // ══════════════════════════════════════════════════════════════════════════

    // Paleta de colores
    private static final Color C_BLUE_D  = new Color(30,  58, 138);   // #1E3A8A
    private static final Color C_BLUE    = new Color(37,  99, 235);   // #2563EB
    private static final Color C_BLUE_L  = new Color(219,234, 254);   // #DBEAFE
    private static final Color C_GREEN   = new Color(22, 163,  74);   // #16A34A
    private static final Color C_GREEN_L = new Color(220,252, 231);   // #DCFCE7
    private static final Color C_ORANGE  = new Color(234, 88,  12);   // #EA580C
    private static final Color C_ORANGE_L= new Color(255,237, 213);   // #FFEDD5
    private static final Color C_RED     = new Color(220, 38,  38);   // #DC2626
    private static final Color C_RED_L   = new Color(254,226, 226);   // #FEE2E2
    private static final Color C_GRAY    = new Color(100,116, 139);   // #64748B
    private static final Color C_GRAY_L  = new Color(241,245, 249);   // #F1F5F9
    private static final Color C_TEXT    = new Color( 15, 23,  42);   // #0F172A
    private static final Color C_BORDER  = new Color(226,232, 240);   // #E2E8F0

    private static final Color[] PIE_COLORS = {
        C_BLUE, C_GREEN, C_ORANGE, new Color(124,58,237),
        new Color(6,182,212), C_RED, new Color(234,179,8)
    };

    @Transactional(readOnly = true)
    public byte[] generarReporteVentasPDF(LocalDate fechaInicio, LocalDate fechaFin) throws DocumentException {
        ReporteVentasDTO reporte = obtenerReporteVentas(fechaInicio, fechaFin, "DIA");
        List<ProductoMasVendidoDTO> top10 = obtenerProductosMasVendidos(fechaInicio, fechaFin, 10);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // top=85 para el header, bottom=55 para el footer
        Document doc = new Document(PageSize.A4, 40, 40, 85, 55);
        PdfWriter writer = PdfWriter.getInstance(doc, baos);

        // ── Page event: header y footer en cada página ──
        writer.setPageEvent(new PdfPageEventHelper() {
            @Override
            public void onStartPage(PdfWriter w, Document d) {
                try {
                    BaseFont bfB = BaseFont.createFont(BaseFont.HELVETICA_BOLD,  BaseFont.WINANSI, false);
                    BaseFont bfN = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, false);
                    PdfContentByte cb = w.getDirectContent();
                    float pw = PageSize.A4.getWidth();
                    float ph = PageSize.A4.getHeight();

                    // Franja azul oscuro
                    cb.saveState();
                    cb.setColorFill(C_BLUE_D);
                    cb.rectangle(0, ph - 62, pw, 62);
                    cb.fill();
                    // Acento inferior de la franja
                    cb.setColorFill(C_BLUE);
                    cb.rectangle(0, ph - 65, pw, 3);
                    cb.fill();
                    cb.restoreState();

                    // Título
                    cb.beginText();
                    cb.setFontAndSize(bfB, 13);
                    cb.setColorFill(Color.WHITE);
                    cb.showTextAligned(PdfContentByte.ALIGN_LEFT,
                        "REPORTE DE VENTAS — Licorería Chilalo Shot", 40, ph - 34, 0);
                    cb.setFontAndSize(bfN, 9);
                    cb.setColorFill(new Color(147, 197, 253));
                    cb.showTextAligned(PdfContentByte.ALIGN_LEFT,
                        "Período: " + fechaInicio.format(DATE_DISPLAY) + "  al  " + fechaFin.format(DATE_DISPLAY),
                        40, ph - 53, 0);
                    cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,
                        "Piura, Perú", pw - 40, ph - 53, 0);
                    cb.endText();
                } catch (Exception ignored) {}
            }

            @Override
            public void onEndPage(PdfWriter w, Document d) {
                try {
                    BaseFont bfN = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, false);
                    PdfContentByte cb = w.getDirectContent();
                    float pw = PageSize.A4.getWidth();

                    // Fondo del footer
                    cb.saveState();
                    cb.setColorFill(C_GRAY_L);
                    cb.rectangle(0, 0, pw, 43);
                    cb.fill();
                    cb.setColorStroke(C_BORDER);
                    cb.setLineWidth(0.5f);
                    cb.moveTo(0, 43); cb.lineTo(pw, 43); cb.stroke();
                    cb.restoreState();

                    cb.beginText();
                    cb.setFontAndSize(bfN, 8);
                    cb.setColorFill(C_GRAY);
                    cb.showTextAligned(PdfContentByte.ALIGN_LEFT,
                        "Generado el " + LocalDate.now().format(DATE_DISPLAY)
                        + "  •  Licorería Chilalo Shot, Piura  •  Documento confidencial",
                        40, 17, 0);
                    cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,
                        "Pág. " + w.getPageNumber(), pw - 40, 17, 0);
                    cb.endText();
                } catch (Exception ignored) {}
            }
        });

        doc.open();

        // ── Fuentes base ──────────────────────────────────────────────────────
        BaseFont bfBold, bfNorm;
        try {
            bfBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.WINANSI, false);
            bfNorm = BaseFont.createFont(BaseFont.HELVETICA,      BaseFont.WINANSI, false);
        } catch (IOException e) {
            throw new DocumentException("Error cargando fuentes: " + e.getMessage());
        }

        Font fSection  = new Font(bfBold, 11, Font.NORMAL, C_BLUE_D);
        Font fSubtitle = new Font(bfNorm,  8, Font.NORMAL, C_GRAY);
        Font fNorm     = new Font(bfNorm,  9, Font.NORMAL, C_TEXT);
        Font fBold     = new Font(bfBold,  9, Font.NORMAL, C_TEXT);
        Font fWhiteHdr = new Font(bfBold,  9, Font.NORMAL, Color.WHITE);
        Font fSmall    = new Font(bfNorm,  8, Font.NORMAL, C_GRAY);

        // ── 1. KPI ─────────────────────────────────────────────────────────────
        doc.add(spacer(4));
        doc.add(pdfSection("Resumen del Período", fSection));
        doc.add(spacer(4));

        PdfPTable kpiTable = new PdfPTable(4);
        kpiTable.setWidthPercentage(100);
        kpiTable.setSpacingAfter(14);
        kpiTable.addCell(kpiCell(bfBold, bfNorm, "Total en Ventas",
            "S/ " + fmt2(reporte.getTotalVentas()), C_BLUE_L, C_BLUE));
        kpiTable.addCell(kpiCell(bfBold, bfNorm, "Transacciones",
            String.valueOf(reporte.getTotalTransacciones()), C_GREEN_L, C_GREEN));
        kpiTable.addCell(kpiCell(bfBold, bfNorm, "Ticket Promedio",
            "S/ " + fmt2(reporte.getTicketPromedio()), C_ORANGE_L, C_ORANGE));
        boolean netaPos = reporte.getGananciaNeta() != null
            && reporte.getGananciaNeta().compareTo(BigDecimal.ZERO) >= 0;
        kpiTable.addCell(kpiCell(bfBold, bfNorm, "Ganancia Neta",
            "S/ " + fmt2(reporte.getGananciaNeta()),
            netaPos ? C_GREEN_L : C_RED_L, netaPos ? C_GREEN : C_RED));
        doc.add(kpiTable);

        // ── 2. GRÁFICO DE BARRAS: ventas por día ──────────────────────────────
        doc.add(pdfSection("Evolución Diaria de Ventas", fSection));
        doc.add(new Paragraph("Total de ventas completadas por día en el período seleccionado.", fSubtitle));
        doc.add(spacer(4));
        Image barChart = buildBarChart(writer, reporte.getVentasPorDia(), bfNorm);
        barChart.setSpacingAfter(8);
        doc.add(barChart);

        // ── 3. TABLA VENTAS POR DÍA ───────────────────────────────────────────
        List<ReporteVentasDTO.VentaPorDiaDTO> diasConVentas = reporte.getVentasPorDia().stream()
            .filter(v -> v.getTotal().compareTo(BigDecimal.ZERO) > 0)
            .collect(Collectors.toList());

        if (!diasConVentas.isEmpty()) {
            PdfPTable tDia = new PdfPTable(new float[]{2.5f, 1.5f, 2f, 2f});
            tDia.setWidthPercentage(100);
            tDia.setSpacingAfter(16);
            tblHeader(tDia, fWhiteHdr, C_BLUE_D, "Fecha", "Transacciones", "Total (S/)", "Ticket Prom. (S/)");
            boolean alt = false;
            for (ReporteVentasDTO.VentaPorDiaDTO v : diasConVentas) {
                Color bg = alt ? C_GRAY_L : Color.WHITE;
                BigDecimal ticket = v.getTransacciones() > 0
                    ? v.getTotal().divide(BigDecimal.valueOf(v.getTransacciones()), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
                tblRow(tDia, fNorm, bg, fmtFecha(v.getFecha()),
                    String.valueOf(v.getTransacciones()), fmt2(v.getTotal()), fmt2(ticket));
                alt = !alt;
            }
            // Fila de totales
            tblRow(tDia, fBold, C_BLUE_L,
                "TOTAL", String.valueOf(reporte.getTotalTransacciones()),
                fmt2(reporte.getTotalVentas()), fmt2(reporte.getTicketPromedio()));
            doc.add(tDia);
        }

        // ── 4. FORMAS DE PAGO: gráfico torta + tabla ──────────────────────────
        doc.add(pdfSection("Distribución por Forma de Pago", fSection));
        doc.add(spacer(4));

        if (reporte.getVentasPorFormaPago() != null && !reporte.getVentasPorFormaPago().isEmpty()) {
            PdfPTable layout = new PdfPTable(new float[]{5f, 5f});
            layout.setWidthPercentage(100);
            layout.setSpacingAfter(16);

            // Torta (izquierda)
            Image pie = buildPieChart(writer, reporte.getVentasPorFormaPago(), bfNorm);
            PdfPCell pieCell = new PdfPCell();
            pieCell.setBorder(Rectangle.NO_BORDER);
            pieCell.setPadding(0);
            pieCell.addElement(pie);
            layout.addCell(pieCell);

            // Tabla forma de pago (derecha)
            PdfPTable tFP = buildFormaPagoTable(reporte.getVentasPorFormaPago(),
                fWhiteHdr, fNorm, fBold, reporte.getTotalVentas());
            PdfPCell fpCell = new PdfPCell();
            fpCell.setBorder(Rectangle.NO_BORDER);
            fpCell.setPaddingLeft(8);
            fpCell.addElement(tFP);
            layout.addCell(fpCell);
            doc.add(layout);
        }

        // ── 5. TOP 10 PRODUCTOS ───────────────────────────────────────────────
        doc.add(pdfSection("Top 10 Productos Más Vendidos", fSection));
        doc.add(new Paragraph("Ordenados por monto total de ventas en el período.", fSubtitle));
        doc.add(spacer(4));

        if (!top10.isEmpty()) {
            // Mini gráfico de barras horizontal
            Image hBar = buildHorizontalBarChart(writer, top10, bfNorm);
            hBar.setSpacingAfter(8);
            doc.add(hBar);
        }

        PdfPTable tProd = new PdfPTable(new float[]{0.5f, 3.5f, 1.2f, 2f, 1.5f});
        tProd.setWidthPercentage(100);
        tProd.setSpacingAfter(16);
        tblHeader(tProd, fWhiteHdr, C_BLUE_D, "#", "Producto", "Unidades", "Total (S/)", "% Participación");
        if (top10.isEmpty()) {
            PdfPCell empty = new PdfPCell(new Phrase("Sin datos en el período", fSmall));
            empty.setColspan(5); empty.setPadding(10);
            empty.setHorizontalAlignment(Element.ALIGN_CENTER);
            empty.setBorderColor(C_BORDER);
            tProd.addCell(empty);
        } else {
            boolean alt = false;
            int rank = 1;
            for (ProductoMasVendidoDTO p : top10) {
                Color bg = alt ? C_GRAY_L : Color.WHITE;
                tblRow(tProd, fNorm, bg, String.valueOf(rank++), p.getNombreProducto(),
                    String.valueOf(p.getCantidadVendida()), fmt2(p.getTotalVentas()),
                    p.getPorcentajeDelTotal().setScale(1, RoundingMode.HALF_UP) + "%");
                alt = !alt;
            }
        }
        doc.add(tProd);

        // ── 6. VENTAS POR CATEGORÍA ────────────────────────────────────────────
        if (reporte.getVentasPorCategoria() != null && !reporte.getVentasPorCategoria().isEmpty()) {
            doc.add(pdfSection("Ventas por Categoría", fSection));
            doc.add(spacer(4));
            PdfPTable tCat = new PdfPTable(new float[]{3f, 1.5f, 2f, 1.5f});
            tCat.setWidthPercentage(100);
            tCat.setSpacingAfter(16);
            tblHeader(tCat, fWhiteHdr, C_BLUE_D, "Categoría", "Unidades", "Total (S/)", "Participación");
            BigDecimal totalCat = reporte.getVentasPorCategoria().stream()
                .map(ReporteVentasDTO.VentasPorCategoriaDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            boolean alt = false;
            for (ReporteVentasDTO.VentasPorCategoriaDTO c : reporte.getVentasPorCategoria()) {
                Color bg = alt ? C_GRAY_L : Color.WHITE;
                BigDecimal pct = totalCat.compareTo(BigDecimal.ZERO) > 0
                    ? c.getTotal().multiply(BigDecimal.valueOf(100)).divide(totalCat, 1, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
                tblRow(tCat, fNorm, bg, c.getCategoria(),
                    String.valueOf(c.getCantidadVendida()), fmt2(c.getTotal()), pct + "%");
                alt = !alt;
            }
            doc.add(tCat);
        }

        // ── 7. RENDIMIENTO POR VENDEDOR ────────────────────────────────────────
        if (reporte.getVentasPorVendedor() != null && !reporte.getVentasPorVendedor().isEmpty()) {
            doc.add(pdfSection("Rendimiento por Vendedor", fSection));
            doc.add(spacer(4));
            PdfPTable tVend = new PdfPTable(new float[]{2.5f, 1.5f, 1.8f, 2f, 2f});
            tVend.setWidthPercentage(100);
            tVend.setSpacingAfter(16);
            tblHeader(tVend, fWhiteHdr, C_BLUE_D, "Vendedor", "Rol", "Transacciones", "Total (S/)", "Ticket Prom. (S/)");
            boolean alt = false;
            for (ReporteVentasDTO.VentasPorVendedorDTO v : reporte.getVentasPorVendedor()) {
                Color bg = alt ? C_GRAY_L : Color.WHITE;
                tblRow(tVend, fNorm, bg, v.getVendedor(), v.getRol(),
                    String.valueOf(v.getTransacciones()),
                    fmt2(v.getTotalVentas()), fmt2(v.getTicketPromedio()));
                alt = !alt;
            }
            doc.add(tVend);
        }

        // ── 8. RESUMEN FINANCIERO ──────────────────────────────────────────────
        doc.add(pdfSection("Resumen Financiero", fSection));
        doc.add(spacer(4));
        PdfPTable tFin = new PdfPTable(new float[]{4f, 2f});
        tFin.setWidthPercentage(55);
        tFin.setHorizontalAlignment(Element.ALIGN_LEFT);
        tFin.setSpacingAfter(8);
        finRow(tFin, fNorm,  "Ingresos por Ventas",
            "S/ " + fmt2(reporte.getTotalVentas()), Color.WHITE);
        finRow(tFin, fNorm,  "Costo de Mercadería (est.)",
            "S/ " + fmt2(reporte.getGanancias() != null
                ? reporte.getTotalVentas().subtract(reporte.getGanancias()) : BigDecimal.ZERO),
            C_GRAY_L);
        finRow(tFin, fNorm,  "Ganancia Bruta",
            "S/ " + fmt2(reporte.getGanancias()), C_GREEN_L);
        finRow(tFin, fNorm,  "Gastos Operativos",
            "− S/ " + fmt2(reporte.getTotalGastos()), C_RED_L);
        finRow(tFin, fBold,  "GANANCIA NETA",
            "S/ " + fmt2(reporte.getGananciaNeta()),
            netaPos ? new Color(187, 247, 208) : new Color(254, 202, 202));
        doc.add(tFin);

        doc.close();
        return baos.toByteArray();
    }

    // ── Helpers de construcción PDF ───────────────────────────────────────────

    /** Párrafo de título de sección con línea separadora */
    private Paragraph pdfSection(String text, Font font) {
        Paragraph p = new Paragraph(text, font);
        p.setSpacingBefore(12);
        p.setSpacingAfter(2);
        return p;
    }

    /** Espacio en blanco */
    private Paragraph spacer(float size) {
        Paragraph p = new Paragraph(" ");
        p.setLeading(size);
        return p;
    }

    /** Caja KPI coloreada */
    private PdfPCell kpiCell(BaseFont bfBold, BaseFont bfNorm,
            String label, String value, Color bg, Color accent) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setPadding(10);
        cell.setBorderColor(accent);
        cell.setBorderWidth(1.5f);
        cell.setFixedHeight(62f);
        Paragraph lbl = new Paragraph(label,
            new Font(bfNorm, 8, Font.NORMAL, C_GRAY));
        lbl.setSpacingAfter(5);
        cell.addElement(lbl);
        cell.addElement(new Paragraph(value,
            new Font(bfBold, 14, Font.NORMAL, accent)));
        return cell;
    }

    /** Encabezado de tabla */
    private void tblHeader(PdfPTable t, Font font, Color bg, String... cols) {
        for (String col : cols) {
            PdfPCell c = new PdfPCell(new Phrase(col, font));
            c.setBackgroundColor(bg);
            c.setPadding(6);
            c.setHorizontalAlignment(Element.ALIGN_CENTER);
            c.setBorderColor(C_BORDER);
            t.addCell(c);
        }
    }

    /** Fila de tabla */
    private void tblRow(PdfPTable t, Font font, Color bg, String... vals) {
        for (String v : vals) {
            PdfPCell c = new PdfPCell(new Phrase(v != null ? v : "", font));
            c.setBackgroundColor(bg);
            c.setPadding(5);
            c.setHorizontalAlignment(Element.ALIGN_CENTER);
            c.setBorderColor(C_BORDER);
            t.addCell(c);
        }
    }

    /** Fila del resumen financiero (label izq. + valor der.) */
    private void finRow(PdfPTable t, Font font, String label, String value, Color bg) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, font));
        lCell.setBackgroundColor(bg); lCell.setPadding(6);
        lCell.setBorderColor(C_BORDER);
        t.addCell(lCell);

        PdfPCell vCell = new PdfPCell(new Phrase(value, font));
        vCell.setBackgroundColor(bg); vCell.setPadding(6);
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setBorderColor(C_BORDER);
        t.addCell(vCell);
    }

    /** Tabla de desglose por forma de pago */
    private PdfPTable buildFormaPagoTable(
            List<ReporteVentasDTO.VentaPorFormaPagoDTO> data,
            Font hFont, Font nFont, Font bFont, BigDecimal totalGeneral) {
        PdfPTable t = new PdfPTable(new float[]{2.5f, 1f, 2f, 1.5f});
        t.setWidthPercentage(100);
        tblHeader(t, hFont, C_BLUE_D, "Forma de Pago", "N°", "Total (S/)", "%");
        boolean alt = false;
        for (ReporteVentasDTO.VentaPorFormaPagoDTO fp : data) {
            Color bg = alt ? C_GRAY_L : Color.WHITE;
            BigDecimal pct = totalGeneral.compareTo(BigDecimal.ZERO) > 0
                ? fp.getTotal().multiply(BigDecimal.valueOf(100))
                    .divide(totalGeneral, 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
            tblRow(t, nFont, bg,
                fp.getFormaPago(), String.valueOf(fp.getCantidad()),
                fmt2(fp.getTotal()), pct + "%");
            alt = !alt;
        }
        return t;
    }

    // ── Gráficos con PdfTemplate (Java2D-free) ────────────────────────────────

    /** Gráfico de barras verticales: ventas por día */
    private Image buildBarChart(PdfWriter writer,
            List<ReporteVentasDTO.VentaPorDiaDTO> rawData, BaseFont bf) throws DocumentException {
        float W = 515f, H = 155f;
        PdfTemplate tpl = writer.getDirectContent().createTemplate(W, H);

        // Fondo
        tpl.setColorFill(C_GRAY_L);
        tpl.rectangle(0, 0, W, H); tpl.fill();
        tpl.setColorFill(Color.WHITE);
        tpl.rectangle(1, 1, W - 2, H - 2); tpl.fill();

        List<ReporteVentasDTO.VentaPorDiaDTO> data = rawData == null ? List.of()
            : rawData.stream().filter(d -> d.getTotal().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

        if (data.isEmpty()) {
            tpl.beginText();
            tpl.setFontAndSize(bf, 10);
            tpl.setColorFill(C_GRAY);
            tpl.showTextAligned(PdfContentByte.ALIGN_CENTER, "Sin datos en el período", W / 2f, H / 2f, 0);
            tpl.endText();
            return Image.getInstance(tpl);
        }

        BigDecimal maxVal = data.stream().map(ReporteVentasDTO.VentaPorDiaDTO::getTotal)
            .max(BigDecimal::compareTo).orElse(BigDecimal.ONE);
        if (maxVal.compareTo(BigDecimal.ZERO) == 0) maxVal = BigDecimal.ONE;

        float left = 58f, right = W - 15f, bottom = 35f, top = H - 18f;
        float cW = right - left, cH = top - bottom;

        // Líneas de cuadrícula horizontales
        int gridN = 4;
        tpl.setColorStroke(new Color(226, 232, 240));
        tpl.setLineWidth(0.5f);
        for (int i = 0; i <= gridN; i++) {
            float y = bottom + cH * i / gridN;
            tpl.moveTo(left, y); tpl.lineTo(right, y); tpl.stroke();
            BigDecimal labelVal = maxVal.multiply(BigDecimal.valueOf(i))
                .divide(BigDecimal.valueOf(gridN), 0, RoundingMode.HALF_UP);
            tpl.beginText();
            tpl.setFontAndSize(bf, 7);
            tpl.setColorFill(C_GRAY);
            tpl.showTextAligned(PdfContentByte.ALIGN_RIGHT,
                "S/" + fmtK(labelVal), left - 3, y - 3, 0);
            tpl.endText();
        }

        // Barras
        int n = data.size();
        float slotW = cW / n;
        float barW  = Math.min(slotW * 0.60f, 32f);

        for (int i = 0; i < n; i++) {
            ReporteVentasDTO.VentaPorDiaDTO v = data.get(i);
            float ratio = v.getTotal().divide(maxVal, 6, RoundingMode.HALF_UP).floatValue();
            float bH = cH * ratio;
            float x  = left + slotW * i + (slotW - barW) / 2f;

            // Sombra de la barra
            tpl.setColorFill(new Color(200, 220, 255));
            tpl.rectangle(x + 2, bottom, barW, bH); tpl.fill();
            // Barra principal
            tpl.setColorFill(C_BLUE);
            tpl.rectangle(x, bottom, barW, bH); tpl.fill();
            // Tope de la barra con color más claro
            if (bH > 6) {
                tpl.setColorFill(new Color(96, 165, 250));
                tpl.rectangle(x, bottom + bH - 4, barW, 4); tpl.fill();
            }

            // Valor encima de la barra
            if (bH > 12) {
                tpl.beginText();
                tpl.setFontAndSize(bf, 6.5f);
                tpl.setColorFill(C_BLUE_D);
                tpl.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    "S/" + fmtK(v.getTotal()), x + barW / 2f, bottom + bH + 3, 0);
                tpl.endText();
            }

            // Etiqueta del eje X
            tpl.beginText();
            tpl.setFontAndSize(bf, 6.5f);
            tpl.setColorFill(C_GRAY);
            tpl.showTextAligned(PdfContentByte.ALIGN_CENTER,
                fmtShort(v.getFecha()), x + barW / 2f, bottom - 14, 0);
            tpl.endText();
        }

        // Eje X
        tpl.setColorStroke(new Color(148, 163, 184));
        tpl.setLineWidth(1f);
        tpl.moveTo(left, bottom); tpl.lineTo(right, bottom); tpl.stroke();

        return Image.getInstance(tpl);
    }

    /** Gráfico de torta (pie chart): formas de pago */
    private Image buildPieChart(PdfWriter writer,
            List<ReporteVentasDTO.VentaPorFormaPagoDTO> data, BaseFont bf) throws DocumentException {
        float W = 257f, H = 165f;
        PdfTemplate tpl = writer.getDirectContent().createTemplate(W, H);

        tpl.setColorFill(C_GRAY_L);
        tpl.rectangle(0, 0, W, H); tpl.fill();
        tpl.setColorFill(Color.WHITE);
        tpl.rectangle(1, 1, W - 2, H - 2); tpl.fill();

        if (data == null || data.isEmpty()) return Image.getInstance(tpl);

        BigDecimal total = data.stream().map(ReporteVentasDTO.VentaPorFormaPagoDTO::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.compareTo(BigDecimal.ZERO) == 0) return Image.getInstance(tpl);

        float cx = 75f, cy = H / 2f, r = 58f;
        float startAngle = 90f; // comienza desde el tope

        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).getTotal().compareTo(BigDecimal.ZERO) == 0) continue;
            float extent = data.get(i).getTotal()
                .divide(total, 6, RoundingMode.HALF_UP).floatValue() * 360f;
            Color c = PIE_COLORS[i % PIE_COLORS.length];

            tpl.saveState();
            tpl.setColorFill(c);
            tpl.setColorStroke(Color.WHITE);
            tpl.setLineWidth(1.5f);
            tpl.moveTo(cx, cy);
            tpl.arc(cx - r, cy - r, cx + r, cy + r, startAngle, extent);
            tpl.closePath();
            tpl.fillStroke();
            tpl.restoreState();

            startAngle += extent;
        }

        // Círculo central blanco (efecto donut)
        tpl.setColorFill(Color.WHITE);
        float ri = r * 0.38f;
        tpl.arc(cx - ri, cy - ri, cx + ri, cy + ri, 0, 360);
        tpl.fill();

        // Leyenda a la derecha
        float lx = 148f, ly = H - 16f;
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).getTotal().compareTo(BigDecimal.ZERO) == 0) continue;
            Color c = PIE_COLORS[i % PIE_COLORS.length];
            // Cuadrado de color
            tpl.setColorFill(c);
            tpl.rectangle(lx, ly - 7, 9, 9); tpl.fill();
            // Texto
            float pct = data.get(i).getTotal().multiply(BigDecimal.valueOf(100))
                .divide(total, 1, RoundingMode.HALF_UP).floatValue();
            tpl.beginText();
            tpl.setFontAndSize(bf, 8f);
            tpl.setColorFill(C_TEXT);
            tpl.showTextAligned(PdfContentByte.ALIGN_LEFT,
                data.get(i).getFormaPago() + "  " + pct + "%", lx + 13, ly - 5, 0);
            tpl.endText();
            ly -= 19f;
        }

        return Image.getInstance(tpl);
    }

    /** Gráfico de barras horizontales: top productos */
    private Image buildHorizontalBarChart(PdfWriter writer,
            List<ProductoMasVendidoDTO> top, BaseFont bf) throws DocumentException {
        int n = Math.min(top.size(), 10);
        float rowH = 20f;
        float W = 515f, H = n * rowH + 20f;
        PdfTemplate tpl = writer.getDirectContent().createTemplate(W, H);

        tpl.setColorFill(Color.WHITE);
        tpl.rectangle(0, 0, W, H); tpl.fill();

        if (top.isEmpty()) return Image.getInstance(tpl);

        BigDecimal maxVal = top.stream().map(ProductoMasVendidoDTO::getTotalVentas)
            .max(BigDecimal::compareTo).orElse(BigDecimal.ONE);
        if (maxVal.compareTo(BigDecimal.ZERO) == 0) maxVal = BigDecimal.ONE;

        float labelW = 155f, barStart = labelW + 5f, barAreaW = W - barStart - 70f;

        for (int i = 0; i < n; i++) {
            ProductoMasVendidoDTO p = top.get(i);
            float y = H - (i + 1) * rowH + 4f;
            Color bg = i % 2 == 0 ? Color.WHITE : C_GRAY_L;
            tpl.setColorFill(bg);
            tpl.rectangle(0, y - 2, W, rowH); tpl.fill();

            // Nombre del producto (truncado)
            String nombre = p.getNombreProducto();
            if (nombre != null && nombre.length() > 22) nombre = nombre.substring(0, 20) + "…";
            tpl.beginText();
            tpl.setFontAndSize(bf, 8f);
            tpl.setColorFill(C_TEXT);
            tpl.showTextAligned(PdfContentByte.ALIGN_LEFT, nombre != null ? nombre : "", 5, y + 3, 0);
            tpl.endText();

            // Barra
            float ratio = p.getTotalVentas().divide(maxVal, 6, RoundingMode.HALF_UP).floatValue();
            float bW = barAreaW * ratio;
            // Sombra
            tpl.setColorFill(new Color(200, 220, 255));
            tpl.rectangle(barStart + 1, y + 1, bW, rowH - 6); tpl.fill();
            // Barra
            tpl.setColorFill(C_BLUE);
            tpl.rectangle(barStart, y + 2, bW, rowH - 7); tpl.fill();

            // Monto
            tpl.beginText();
            tpl.setFontAndSize(bf, 7.5f);
            tpl.setColorFill(C_BLUE_D);
            tpl.showTextAligned(PdfContentByte.ALIGN_LEFT,
                "S/ " + fmt2(p.getTotalVentas()), barStart + bW + 4, y + 3, 0);
            tpl.endText();
        }

        return Image.getInstance(tpl);
    }

    // ── Utilidades de formato ─────────────────────────────────────────────────

    private String fmt2(BigDecimal v) {
        return v != null ? v.setScale(2, RoundingMode.HALF_UP).toPlainString() : "0.00";
    }

    private String fmtK(BigDecimal v) {
        if (v == null) return "0";
        if (v.compareTo(BigDecimal.valueOf(1_000_000)) >= 0)
            return v.divide(BigDecimal.valueOf(1_000_000), 1, RoundingMode.HALF_UP) + "M";
        if (v.compareTo(BigDecimal.valueOf(1_000)) >= 0)
            return v.divide(BigDecimal.valueOf(1_000), 1, RoundingMode.HALF_UP) + "k";
        return v.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private String fmtFecha(String iso) {
        if (iso == null || iso.length() < 10) return iso != null ? iso : "";
        String[] p = iso.split("-");
        return p[2] + "/" + p[1] + "/" + p[0];
    }

    private String fmtShort(String iso) {
        if (iso == null || iso.length() < 10) return iso != null ? iso : "";
        String[] p = iso.split("-");
        return p[2] + "/" + p[1];
    }

    @Transactional(readOnly = true)
    public byte[] generarReporteInventarioPDF() throws DocumentException {
        ReporteInventarioDTO reporte = obtenerReporteInventario();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        doc.add(new Paragraph("REPORTE DE INVENTARIO", titleFont));
        doc.add(new Paragraph("Fecha: " + LocalDate.now().format(DATE_DISPLAY), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("Valor Total Inventario: S/ " + reporte.getValorTotalInventario().setScale(2, RoundingMode.HALF_UP), normalFont));
        doc.add(new Paragraph("Productos Activos: " + reporte.getProductosActivos(), normalFont));
        doc.add(new Paragraph("Productos con Stock Bajo: " + reporte.getProductosStockBajo(), normalFont));
        doc.add(new Paragraph("Productos Próximos a Vencer: " + reporte.getProductosProximosVencer(), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("PRODUCTOS CON STOCK BAJO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell(new PdfPCell(new Phrase("Producto", normalFont)));
        table.addCell(new PdfPCell(new Phrase("Stock Actual", normalFont)));
        table.addCell(new PdfPCell(new Phrase("Stock Mínimo", normalFont)));
        table.addCell(new PdfPCell(new Phrase("Faltante", normalFont)));

        for (ProductoDTO p : reporte.getStockBajo()) {
            table.addCell(p.getNombre());
            table.addCell(String.valueOf(p.getStockActual()));
            table.addCell(String.valueOf(p.getStockMinimo()));
            int faltante = (p.getStockMinimo() != null ? p.getStockMinimo() : 0) - (p.getStockActual() != null ? p.getStockActual() : 0);
            table.addCell(String.valueOf(faltante));
        }
        doc.add(table);
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("PRODUCTOS PRÓXIMOS A VENCER", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        PdfPTable table2 = new PdfPTable(3);
        table2.setWidthPercentage(100);
        table2.addCell(new PdfPCell(new Phrase("Producto", normalFont)));
        table2.addCell(new PdfPCell(new Phrase("Stock", normalFont)));
        table2.addCell(new PdfPCell(new Phrase("Fecha Vencimiento", normalFont)));

        for (ProductoDTO p : reporte.getProximosVencer()) {
            table2.addCell(p.getNombre());
            table2.addCell(String.valueOf(p.getStockActual()));
            table2.addCell(p.getFechaVencimiento() != null ? p.getFechaVencimiento().toString() : "-");
        }
        doc.add(table2);
        doc.close();

        return baos.toByteArray();
    }
}
