package com.licoreria.service;

import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.reporte.*;
import com.licoreria.entity.Producto;
import com.licoreria.entity.Venta;
import com.licoreria.repository.ProductoRepository;
import com.licoreria.repository.VentaRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final InventarioService inventarioService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_DISPLAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public com.licoreria.dto.reporte.DashboardDTO obtenerDashboard() {
        LocalDate hoy = LocalDate.now();
        ReporteVentasDTO ventasHoy = obtenerReporteVentas(hoy, hoy, "DIA");
        ReporteInventarioDTO inventario = obtenerReporteInventario();

        com.licoreria.dto.reporte.DashboardDTO dto = new com.licoreria.dto.reporte.DashboardDTO();
        dto.setVentasHoy(ventasHoy.getTotalVentas());
        dto.setTransaccionesHoy(ventasHoy.getTotalTransacciones());
        dto.setProductosActivos(inventario.getProductosActivos());
        dto.setProductosStockBajo(inventario.getProductosStockBajo());
        dto.setProductosProximosVencer(inventario.getProductosProximosVencer());
        return dto;
    }

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

        // Agrupar por fecha
        Map<String, List<Venta>> porFecha = ventas.stream()
                .collect(Collectors.groupingBy(v -> LocalDate.ofInstant(v.getFecha(), ZoneId.systemDefault()).format(DATE_FMT)));

        List<ReporteVentasDTO.VentaPorDiaDTO> ventasPorDia = new ArrayList<>();
        LocalDate current = fechaInicio;
        while (!current.isAfter(fechaFin)) {
            String key = current.format(DATE_FMT);
            List<Venta> delDia = porFecha.getOrDefault(key, List.of());
            BigDecimal totalDia = delDia.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
            ventasPorDia.add(new ReporteVentasDTO.VentaPorDiaDTO() {{
                setFecha(key);
                setTotal(totalDia);
                setTransacciones(delDia.size());
            }});
            current = current.plusDays(1);
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

        ReporteVentasDTO dto = new ReporteVentasDTO();
        dto.setTotalVentas(totalVentas);
        dto.setTotalTransacciones(transacciones);
        dto.setTicketPromedio(ticketPromedio);
        dto.setVentasPorDia(ventasPorDia);
        dto.setVentasPorFormaPago(porFormaPago);
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
        var proximosRes = inventarioService.obtenerProductosProximosVencer();

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

    public byte[] generarReporteVentasPDF(LocalDate fechaInicio, LocalDate fechaFin) throws DocumentException {
        ReporteVentasDTO reporte = obtenerReporteVentas(fechaInicio, fechaFin, "DIA");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        doc.add(new Paragraph("REPORTE DE VENTAS", titleFont));
        doc.add(new Paragraph("Período: " + fechaInicio.format(DATE_DISPLAY) + " - " + fechaFin.format(DATE_DISPLAY), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("Total Ventas: S/ " + reporte.getTotalVentas().setScale(2, RoundingMode.HALF_UP), normalFont));
        doc.add(new Paragraph("Transacciones: " + reporte.getTotalTransacciones(), normalFont));
        doc.add(new Paragraph("Ticket Promedio: S/ " + reporte.getTicketPromedio().setScale(2, RoundingMode.HALF_UP), normalFont));
        doc.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.addCell(new PdfPCell(new Phrase("Fecha", normalFont)));
        table.addCell(new PdfPCell(new Phrase("Total", normalFont)));
        table.addCell(new PdfPCell(new Phrase("Transacciones", normalFont)));

        for (var v : reporte.getVentasPorDia()) {
            table.addCell(v.getFecha());
            table.addCell("S/ " + v.getTotal().setScale(2, RoundingMode.HALF_UP));
            table.addCell(String.valueOf(v.getTransacciones()));
        }
        doc.add(table);
        doc.close();

        return baos.toByteArray();
    }

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
