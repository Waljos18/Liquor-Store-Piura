package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.facturacion.EmitirBoletaRequest;
import com.licoreria.dto.facturacion.EmitirFacturaRequest;
import com.licoreria.service.FacturacionDemoService;
import com.licoreria.service.FacturacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/facturacion")
@RequiredArgsConstructor
@Tag(name = "Facturación electrónica", description = "Emisión de boletas/facturas, generación XML y PDF")
public class FacturacionController {

    private final FacturacionService facturacionService;

    @PostMapping("/emitir-boleta")
    @Operation(summary = "Emitir boleta electrónica")
    public ResponseEntity<ApiResponse<Map<String, Object>>> emitirBoleta(@Valid @RequestBody EmitirBoletaRequest req) {
        try {
            String tipoDoc = "1".equals(req.getTipoDocumento()) || "DNI".equalsIgnoreCase(req.getTipoDocumento()) ? "1" : "4";
            Map<String, Object> data = facturacionService.generarComprobanteBoleta(
                    req.getVentaId(), tipoDoc, req.getNumeroDocumento(), req.getNombre());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "Boleta generada. XML y PDF listos. Envío a SUNAT en Sprint 3."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @PostMapping("/emitir-factura")
    @Operation(summary = "Emitir factura electrónica")
    public ResponseEntity<ApiResponse<Map<String, Object>>> emitirFactura(@Valid @RequestBody EmitirFacturaRequest req) {
        try {
            Map<String, Object> data = facturacionService.generarComprobanteFactura(
                    req.getVentaId(), req.getNumeroDocumento(), req.getRazonSocial());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "Factura generada. XML y PDF listos. Envío a SUNAT en Sprint 3."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @GetMapping("/comprobantes/{id}/pdf")
    @Operation(summary = "Descargar PDF del comprobante")
    public ResponseEntity<byte[]> obtenerPdf(@PathVariable Long id) {
        byte[] pdf = facturacionService.obtenerPdf(id);
        if (pdf == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "comprobante-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping(value = "/comprobantes/{id}/xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "Obtener XML del comprobante")
    public ResponseEntity<String> obtenerXml(@PathVariable Long id) {
        String xml = facturacionService.obtenerXml(id);
        if (xml == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(xml);
    }

    @PostMapping("/demo")
    @Operation(summary = "Demo: crea venta de prueba y genera boleta (XML+PDF)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> demo() {
        Map<String, Object> data = facturacionDemoService.ejecutarDemo();
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "Demo facturación OK"));
    }
}
