package com.licoreria.dto.cuenta;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class PagoCuentaDTO {
    private Long id;
    private BigDecimal monto;
    private Instant fecha;
    private String usuarioNombre;
    private String formaPago;
    private String observaciones;
}
