package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.facturacion.ComprobanteDTO;
import com.licoreria.dto.facturacion.EmitirBoletaRequest;
import com.licoreria.dto.facturacion.EmitirFacturaRequest;
import com.licoreria.entity.ComprobanteElectronico;
import com.licoreria.service.FacturacionDemoService;
import com.licoreria.service.FacturacionService;
import com.licoreria.service.SunatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/facturacion")
@RequiredArgsConstructor
@Tag(name = "Facturación electrónica", description = "Emisión de boletas/facturas, generación XML y PDF, envío a SUNAT")
public class FacturacionController {

    private final FacturacionService facturacionService;
    private final FacturacionDemoService facturacionDemoService;
    private final SunatService sunatService;

    @PostMapping("/emitir-boleta")
    @Operation(summary = "Emitir boleta electrónica")
    public ResponseEntity<ApiResponse<Map<String, Object>>> emitirBoleta(@Valid @RequestBody EmitirBoletaRequest req) {
        try {
            String tipoDoc = "1".equals(req.getTipoDocumento()) || "DNI".equalsIgnoreCase(req.getTipoDocumento()) ? "1" : "4";
            Map<String, Object> data = facturacionService.generarComprobanteBoleta(
                    req.getVentaId(), tipoDoc, req.getNumeroDocumento(), req.getNombre());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "Boleta generada. XML y PDF listos. Usa /comprobantes/{id}/enviar para enviar a SUNAT."));
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
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "Factura generada. XML y PDF listos. Usa /comprobantes/{id}/enviar para enviar a SUNAT."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @GetMapping("/comprobantes/por-venta/{ventaId}")
    @Operation(summary = "Obtener comprobante asociado a una venta")
    public ResponseEntity<ApiResponse<ComprobanteDTO>> comprobantePorVenta(@PathVariable Long ventaId) {
        Optional<ComprobanteDTO> comp = facturacionService.obtenerComprobantePorVentaId(ventaId);
        if (comp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NOT_FOUND", "No hay comprobante para esta venta"));
        }
        return ResponseEntity.ok(ApiResponse.ok(comp.get()));
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

    // ========== Endpoints de Integración SUNAT ==========

    @PostMapping("/comprobantes/{id}/enviar")
    @Operation(summary = "Enviar comprobante a SUNAT", description = "Envía un comprobante a SUNAT vía OSE. El XML debe estar generado previamente.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enviarASunat(@PathVariable Long id) {
        try {
            Map<String, Object> resultado = sunatService.enviarComprobante(id);
            return ResponseEntity.ok(ApiResponse.ok(resultado, "Comprobante enviado a SUNAT"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }

    @GetMapping("/comprobantes/{id}/consultar")
    @Operation(summary = "Consultar estado en SUNAT", description = "Consulta el estado actual de un comprobante en SUNAT")
    public ResponseEntity<ApiResponse<Map<String, Object>>> consultarEstado(@PathVariable Long id) {
        try {
            Map<String, Object> resultado = sunatService.consultarEstado(id);
            return ResponseEntity.ok(ApiResponse.ok(resultado, "Estado consultado"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }

    @PostMapping("/comprobantes/{id}/reintentar")
    @Operation(summary = "Reintentar envío a SUNAT", description = "Reintenta el envío de un comprobante que falló anteriormente")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reintentarEnvio(@PathVariable Long id) {
        try {
            Map<String, Object> resultado = sunatService.reintentarEnvio(id);
            return ResponseEntity.ok(ApiResponse.ok(resultado, "Reintento de envío realizado"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }

    @GetMapping("/comprobantes/pendientes")
    @Operation(summary = "Listar comprobantes pendientes", description = "Lista todos los comprobantes pendientes de envío a SUNAT")
    public ResponseEntity<ApiResponse<List<ComprobanteElectronico>>> obtenerPendientes() {
        List<ComprobanteElectronico> pendientes = sunatService.obtenerPendientes();
        return ResponseEntity.ok(ApiResponse.ok(pendientes, 
                "Comprobantes pendientes: " + pendientes.size()));
    }

    @GetMapping("/comprobantes/errores")
    @Operation(summary = "Listar comprobantes con errores", description = "Lista todos los comprobantes que tuvieron errores al enviar a SUNAT")
    public ResponseEntity<ApiResponse<List<ComprobanteElectronico>>> obtenerConErrores() {
        List<ComprobanteElectronico> errores = sunatService.obtenerConErrores();
        return ResponseEntity.ok(ApiResponse.ok(errores, 
                "Comprobantes con errores: " + errores.size()));
    }
}
