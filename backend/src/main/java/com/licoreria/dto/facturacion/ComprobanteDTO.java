package com.licoreria.dto.facturacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComprobanteDTO {

    private Long id;
    private Long ventaId;
    private String tipoComprobante; // BOLETA, FACTURA, etc.
    private String serie;
    private String numero;
    private String estadoSunat;     // PENDIENTE, ACEPTADO, RECHAZADO, ERROR
    private Instant fechaEmision;
}
