package com.licoreria.service;

import com.licoreria.entity.*;
import com.licoreria.repository.ClienteRepository;
import com.licoreria.repository.ComprobanteElectronicoRepository;
import com.licoreria.repository.VentaRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de facturación electrónica.
 * Genera XML (UBL 2.1 simplificado) y PDF de comprobantes.
 * Envío a SUNAT vía OSE se implementará en Sprint 3.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FacturacionService {

    private final VentaRepository ventaRepository;
    private final ComprobanteElectronicoRepository comprobanteRepository;
    private final ClienteRepository clienteRepository;

    private static final String SERIE_BOLETA = "B001";
    private static final String SERIE_FACTURA = "F001";

    @Transactional(readOnly = true)
    public Venta getVentaConDetalles(Long ventaId) {
        return ventaRepository.findByIdWithDetalles(ventaId).orElse(null);
    }

    @Transactional
    public Map<String, Object> generarComprobanteBoleta(Long ventaId, String tipoDoc, String numDoc, String nombreCliente) {
        Venta v = getVentaConDetalles(ventaId);
        if (v == null) {
            throw new IllegalArgumentException("Venta no encontrada");
        }
        return generarComprobante(v, ComprobanteElectronico.TipoComprobante.BOLETA, SERIE_BOLETA, tipoDoc, numDoc, nombreCliente, null);
    }

    @Transactional
    public Map<String, Object> generarComprobanteFactura(Long ventaId, String ruc, String razonSocial) {
        Venta v = getVentaConDetalles(ventaId);
        if (v == null) {
            throw new IllegalArgumentException("Venta no encontrada");
        }
        return generarComprobante(v, ComprobanteElectronico.TipoComprobante.FACTURA, SERIE_FACTURA, "6", ruc, razonSocial, razonSocial);
    }

    private Map<String, Object> generarComprobante(Venta v, ComprobanteElectronico.TipoComprobante tipo, String serie,
                                                   String tipoDocCliente, String numDocCliente, String nombreCliente, String razonSocial) {
        long num = comprobanteRepository.siguienteNumeroPorSerie(serie);
        String numero = String.format("%06d", num);

        String xml = generarXmlComprobante(v, tipo, serie, numero, tipoDocCliente, numDocCliente, nombreCliente, razonSocial);
        byte[] pdf = generarPdfComprobante(v, tipo, serie, numero, nombreCliente != null ? nombreCliente : razonSocial);

        ComprobanteElectronico c = ComprobanteElectronico.builder()
                .venta(v)
                .tipoComprobante(tipo)
                .serie(serie)
                .numero(numero)
                .xmlEnviado(xml)
                .pdfGenerado(pdf)
                .estadoSunat(ComprobanteElectronico.EstadoSunat.PENDIENTE)
                .fechaEmision(Instant.now())
                .build();
        c = comprobanteRepository.save(c);

        Map<String, Object> result = new HashMap<>();
        result.put("id", c.getId());
        result.put("ventaId", v.getId());
        result.put("tipoComprobante", tipo.name());
        result.put("serie", serie);
        result.put("numero", numero);
        result.put("estadoSunat", c.getEstadoSunat().name());
        result.put("xmlLength", xml != null ? xml.length() : 0);
        result.put("pdfLength", pdf != null ? pdf.length : 0);
        return result;
    }

    private String generarXmlComprobante(Venta v, ComprobanteElectronico.TipoComprobante tipo, String serie, String numero,
                                         String tipoDoc, String numDoc, String nombre, String razonSocial) {
        // UBL 2.1 Invoice simplificado (estructura básica para SUNAT)
        StringBuilder sb = new StringBuilder();
        String ns = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2";
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<Invoice xmlns=\"").append(ns).append("\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" ")
          .append("xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\">\n");

        sb.append("  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>\n");
        sb.append("  <cbc:CustomizationID>2.0</cbc:CustomizationID>\n");
        sb.append("  <cbc:ID>").append(serie).append("-").append(numero).append("</cbc:ID>\n");
        sb.append("  <cbc:IssueDate>").append(v.getFecha().atZone(ZoneId.of("America/Lima")).toLocalDate()).append("</cbc:IssueDate>\n");
        sb.append("  <cbc:IssueTime>").append(v.getFecha().atZone(ZoneId.of("America/Lima")).toLocalTime()).append("</cbc:IssueTime>\n");
        sb.append("  <cbc:InvoiceTypeCode listAgencyName=\"PE:SUNAT\" listName=\"Tipo de Documento\" listURI=\"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01\">");
        sb.append(tipo == ComprobanteElectronico.TipoComprobante.BOLETA ? "03" : "01");
        sb.append("</cbc:InvoiceTypeCode>\n");

        sb.append("  <cac:AccountingSupplierParty>\n");
        sb.append("    <cbc:CustomerAssignedAccountID>20100070970</cbc:CustomerAssignedAccountID>\n");
        sb.append("    <cac:Party><cac:PartyLegalEntity><cbc:RegistrationName>LICORERIA PIURA S.A.C.</cbc:RegistrationName></cac:PartyLegalEntity></cac:Party>\n");
        sb.append("  </cac:AccountingSupplierParty>\n");

        sb.append("  <cac:AccountingCustomerParty>\n");
        sb.append("    <cbc:CustomerAssignedAccountID>").append(escapeXml(numDoc)).append("</cbc:CustomerAssignedAccountID>\n");
        sb.append("    <cbc:AdditionalAccountID>").append(escapeXml(tipoDoc)).append("</cbc:AdditionalAccountID>\n");
        sb.append("    <cac:Party><cac:PartyLegalEntity><cbc:RegistrationName>").append(escapeXml(razonSocial != null ? razonSocial : nombre)).append("</cbc:RegistrationName></cac:PartyLegalEntity></cac:Party>\n");
        sb.append("  </cac:AccountingCustomerParty>\n");

        BigDecimal subtotal = v.getSubtotal() != null ? v.getSubtotal() : BigDecimal.ZERO;
        BigDecimal igv = v.getImpuesto() != null ? v.getImpuesto() : BigDecimal.ZERO;
        BigDecimal total = v.getTotal() != null ? v.getTotal() : BigDecimal.ZERO;

        int line = 1;
        for (DetalleVenta d : v.getDetalles()) {
            sb.append("  <cac:InvoiceLine>\n");
            sb.append("    <cbc:ID>").append(line++).append("</cbc:ID>\n");
            sb.append("    <cbc:InvoicedQuantity unitCode=\"NIU\">").append(d.getCantidad()).append("</cbc:InvoicedQuantity>\n");
            sb.append("    <cbc:LineExtensionAmount currencyID=\"PEN\">").append(d.getSubtotal().setScale(2, RoundingMode.HALF_UP)).append("</cbc:LineExtensionAmount>\n");
            sb.append("    <cac:Item><cbc:Description>").append(escapeXml(d.getProducto().getNombre())).append("</cbc:Description></cac:Item>\n");
            sb.append("    <cac:Price><cbc:PriceAmount currencyID=\"PEN\">").append(d.getPrecioUnitario().setScale(2, RoundingMode.HALF_UP)).append("</cbc:PriceAmount></cac:Price>\n");
            sb.append("  </cac:InvoiceLine>\n");
        }

        sb.append("  <cac:TaxTotal>\n");
        sb.append("    <cbc:TaxAmount currencyID=\"PEN\">").append(igv.setScale(2, RoundingMode.HALF_UP)).append("</cbc:TaxAmount>\n");
        sb.append("  </cac:TaxTotal>\n");
        sb.append("  <cac:LegalMonetaryTotal>\n");
        sb.append("    <cbc:PayableAmount currencyID=\"PEN\">").append(total.setScale(2, RoundingMode.HALF_UP)).append("</cbc:PayableAmount>\n");
        sb.append("  </cac:LegalMonetaryTotal>\n");
        sb.append("</Invoice>");
        return sb.toString();
    }

    private static String escapeXml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&apos;");
    }

    private byte[] generarPdfComprobante(Venta v, ComprobanteElectronico.TipoComprobante tipo, String serie, String numero, String clienteNombre) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10);

            doc.add(new Paragraph("LICORERÍA PIURA", titulo));
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph(tipo == ComprobanteElectronico.TipoComprobante.BOLETA ? "BOLETA DE VENTA ELECTRÓNICA" : "FACTURA ELECTRÓNICA", titulo));
            doc.add(new Paragraph(serie + "-" + numero, normal));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Cliente: " + (clienteNombre != null ? clienteNombre : "PÚBLICO GENERAL"), normal));
            doc.add(new Paragraph("Fecha: " + v.getFecha().atZone(ZoneId.of("America/Lima")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME), normal));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 3f, 2f, 2f});
            table.addCell(cell("Cant.", true));
            table.addCell(cell("Descripción", true));
            table.addCell(cell("P. Unit.", true));
            table.addCell(cell("Subtotal", true));

            for (DetalleVenta d : v.getDetalles()) {
                table.addCell(cell(String.valueOf(d.getCantidad()), false));
                table.addCell(cell(d.getProducto().getNombre(), false));
                table.addCell(cell("S/ " + d.getPrecioUnitario().setScale(2, RoundingMode.HALF_UP), false));
                table.addCell(cell("S/ " + d.getSubtotal().setScale(2, RoundingMode.HALF_UP), false));
            }
            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Total: S/ " + (v.getTotal() != null ? v.getTotal().setScale(2, RoundingMode.HALF_UP) : "0.00"), titulo));

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generando PDF", e);
            throw new RuntimeException("Error al generar PDF del comprobante", e);
        }
    }

    private static PdfPCell cell(String text, boolean header) {
        PdfPCell c = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, header ? 10 : 9)));
        if (header) c.setBackgroundColor(new java.awt.Color(0.9f, 0.9f, 0.9f));
        return c;
    }

    public byte[] obtenerPdf(Long comprobanteId) {
        return comprobanteRepository.findById(comprobanteId)
                .map(ComprobanteElectronico::getPdfGenerado)
                .orElse(null);
    }

    public String obtenerXml(Long comprobanteId) {
        return comprobanteRepository.findById(comprobanteId)
                .map(ComprobanteElectronico::getXmlEnviado)
                .orElse(null);
    }
}
