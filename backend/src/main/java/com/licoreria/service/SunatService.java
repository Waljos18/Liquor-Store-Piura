package com.licoreria.service;

import com.licoreria.entity.ComprobanteElectronico;
import com.licoreria.repository.ComprobanteElectronicoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Servicio para integración con SUNAT vía OSE (Operador de Servicios Electrónicos).
 * 
 * Nota: Este servicio es una implementación básica. En producción, se recomienda:
 * - Usar una librería especializada (ej: facturador-electronic-java)
 * - Implementar firma digital con certificado
 * - Usar un OSE real (Nubefact, Facturador Electrónico, etc.)
 * - Manejar errores y reintentos de forma más robusta
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SunatService {

    private final ComprobanteElectronicoRepository comprobanteRepository;

    @Value("${sunat.ose.url:https://ose.sunat.gob.pe/ol-ti-itcpfogem/billService}")
    private String sunatOseUrl;

    @Value("${sunat.ose.usuario:}")
    private String sunatOseUsuario;

    @Value("${sunat.ose.password:}")
    private String sunatOsePassword;

    @Value("${sunat.ose.ambiente:pruebas}")
    private String ambiente; // "pruebas" o "produccion"

    @Value("${sunat.ose.reintentos:3}")
    private int maxReintentos;

    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    /**
     * Envía un comprobante a SUNAT vía OSE.
     * El XML debe estar firmado digitalmente (en producción).
     */
    @Transactional
    public Map<String, Object> enviarComprobante(Long comprobanteId) {
        ComprobanteElectronico comprobante = comprobanteRepository.findById(comprobanteId)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        // Validar que tenga XML
        if (comprobante.getXmlEnviado() == null || comprobante.getXmlEnviado().isEmpty()) {
            throw new RuntimeException("El comprobante no tiene XML generado");
        }

        // Validar que no esté ya aceptado
        if (comprobante.getEstadoSunat() == ComprobanteElectronico.EstadoSunat.ACEPTADO) {
            return crearRespuesta("ACEPTADO", "El comprobante ya fue aceptado por SUNAT", comprobante);
        }

        try {
            // Comprimir XML en ZIP (requerimiento de SUNAT)
            byte[] zipXml = comprimirXml(comprobante.getXmlEnviado(), 
                    comprobante.getSerie() + "-" + comprobante.getNumero() + ".xml");

            // Enviar a SUNAT
            Map<String, Object> resultado = enviarASunat(zipXml, comprobante);

            // Actualizar estado del comprobante
            comprobante.setFechaEnvio(Instant.now());
            comprobante.setEstadoSunat(ComprobanteElectronico.EstadoSunat.valueOf(
                    (String) resultado.get("estado")));
            comprobanteRepository.save(comprobante);

            return resultado;

        } catch (Exception e) {
            log.error("Error enviando comprobante {} a SUNAT", comprobanteId, e);
            
            // Marcar como error
            comprobante.setEstadoSunat(ComprobanteElectronico.EstadoSunat.ERROR);
            comprobante.setFechaEnvio(Instant.now());
            comprobanteRepository.save(comprobante);

            return crearRespuesta("ERROR", "Error al enviar: " + e.getMessage(), comprobante);
        }
    }

    /**
     * Consulta el estado de un comprobante en SUNAT.
     */
    @Transactional
    public Map<String, Object> consultarEstado(Long comprobanteId) {
        ComprobanteElectronico comprobante = comprobanteRepository.findById(comprobanteId)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        try {
            // En producción, esto haría una consulta real a SUNAT
            // Por ahora, simulamos la consulta
            Map<String, Object> resultado = consultarEnSunat(comprobante);

            // Actualizar estado si cambió
            String nuevoEstado = (String) resultado.get("estado");
            if (nuevoEstado != null && !comprobante.getEstadoSunat().name().equals(nuevoEstado)) {
                comprobante.setEstadoSunat(ComprobanteElectronico.EstadoSunat.valueOf(nuevoEstado));
                comprobante.setFechaActualizacion(Instant.now());
                comprobanteRepository.save(comprobante);
            }

            return resultado;

        } catch (Exception e) {
            log.error("Error consultando estado del comprobante {}", comprobanteId, e);
            return crearRespuesta("ERROR", "Error al consultar: " + e.getMessage(), comprobante);
        }
    }

    /**
     * Reintenta el envío de un comprobante que falló.
     */
    @Transactional
    public Map<String, Object> reintentarEnvio(Long comprobanteId) {
        ComprobanteElectronico comprobante = comprobanteRepository.findById(comprobanteId)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        // Solo reintentar si está en estado ERROR o RECHAZADO
        if (comprobante.getEstadoSunat() != ComprobanteElectronico.EstadoSunat.ERROR 
                && comprobante.getEstadoSunat() != ComprobanteElectronico.EstadoSunat.RECHAZADO) {
            return crearRespuesta(comprobante.getEstadoSunat().name(), 
                    "El comprobante no está en estado de error para reintentar", comprobante);
        }

        // Resetear estado a PENDIENTE
        comprobante.setEstadoSunat(ComprobanteElectronico.EstadoSunat.PENDIENTE);
        comprobanteRepository.save(comprobante);

        // Intentar enviar nuevamente
        return enviarComprobante(comprobanteId);
    }

    /**
     * Lista comprobantes pendientes de envío.
     */
    public java.util.List<ComprobanteElectronico> obtenerPendientes() {
        return comprobanteRepository.findByEstadoSunat(ComprobanteElectronico.EstadoSunat.PENDIENTE);
    }

    /**
     * Lista comprobantes con errores.
     */
    public java.util.List<ComprobanteElectronico> obtenerConErrores() {
        return comprobanteRepository.findByEstadoSunat(ComprobanteElectronico.EstadoSunat.ERROR);
    }

    /**
     * Comprime el XML en formato ZIP (requerido por SUNAT).
     */
    private byte[] comprimirXml(String xml, String nombreArchivo) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            ZipEntry entry = new ZipEntry(nombreArchivo);
            zos.putNextEntry(entry);
            zos.write(xml.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }
        return baos.toByteArray();
    }

    /**
     * Envía el ZIP a SUNAT vía OSE.
     * 
     * NOTA: Esta es una implementación simplificada. En producción:
     * - Se debe usar autenticación real con certificado digital
     * - El XML debe estar firmado digitalmente
     * - Se debe usar un OSE real (Nubefact, Facturador Electrónico, etc.)
     */
    private Map<String, Object> enviarASunat(byte[] zipXml, ComprobanteElectronico comprobante) {
        try {
            // En ambiente de pruebas, simulamos el envío
            if ("pruebas".equals(ambiente)) {
                log.info("Simulando envío a SUNAT (ambiente pruebas) para comprobante {}", 
                        comprobante.getSerie() + "-" + comprobante.getNumero());
                
                // Simular respuesta exitosa después de un delay
                Thread.sleep(1000);
                
                return crearRespuesta("ACEPTADO", 
                        "Comprobante aceptado (simulación ambiente pruebas)", comprobante);
            }

            // En producción, hacer el envío real
            String auth = Base64.getEncoder().encodeToString(
                    (sunatOseUsuario + ":" + sunatOsePassword).getBytes());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(sunatOseUrl + "/sendBill"))
                    .header("Content-Type", "application/zip")
                    .header("Authorization", "Basic " + auth)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(zipXml))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, 
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parsear respuesta de SUNAT
                String respuesta = response.body();
                // En producción, parsear la respuesta XML de SUNAT
                return crearRespuesta("ACEPTADO", "Comprobante aceptado por SUNAT", comprobante);
            } else {
                return crearRespuesta("RECHAZADO", 
                        "SUNAT rechazó el comprobante: " + response.body(), comprobante);
            }

        } catch (Exception e) {
            log.error("Error en comunicación con SUNAT", e);
            throw new RuntimeException("Error al comunicarse con SUNAT: " + e.getMessage(), e);
        }
    }

    /**
     * Consulta el estado en SUNAT.
     */
    private Map<String, Object> consultarEnSunat(ComprobanteElectronico comprobante) {
        try {
            // En ambiente de pruebas, simulamos la consulta
            if ("pruebas".equals(ambiente)) {
                return crearRespuesta(comprobante.getEstadoSunat().name(), 
                        "Estado actual (simulación)", comprobante);
            }

            // En producción, hacer consulta real
            String auth = Base64.getEncoder().encodeToString(
                    (sunatOseUsuario + ":" + sunatOsePassword).getBytes());

            String ticket = comprobante.getSerie() + "-" + comprobante.getNumero();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(sunatOseUrl + "/getStatus?ticket=" + ticket))
                    .header("Authorization", "Basic " + auth)
                    .GET()
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, 
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parsear respuesta de SUNAT
                String respuesta = response.body();
                // En producción, parsear la respuesta XML
                return crearRespuesta(comprobante.getEstadoSunat().name(), 
                        "Estado consultado", comprobante);
            } else {
                return crearRespuesta("ERROR", 
                        "Error al consultar estado: " + response.statusCode(), comprobante);
            }

        } catch (Exception e) {
            log.error("Error consultando estado en SUNAT", e);
            throw new RuntimeException("Error al consultar estado: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> crearRespuesta(String estado, String mensaje, 
                                                ComprobanteElectronico comprobante) {
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("estado", estado);
        resultado.put("mensaje", mensaje);
        resultado.put("comprobanteId", comprobante.getId());
        resultado.put("serie", comprobante.getSerie());
        resultado.put("numero", comprobante.getNumero());
        resultado.put("fechaEnvio", comprobante.getFechaEnvio());
        resultado.put("fechaActualizacion", comprobante.getFechaActualizacion());
        return resultado;
    }
}
