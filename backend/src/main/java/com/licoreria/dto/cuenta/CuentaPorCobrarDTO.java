package com.licoreria.dto.cuenta;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class CuentaPorCobrarDTO {
    private Long id;
    private Long ventaId;
    private String numeroVenta;
    private Long clienteId;
    private String clienteNombre;
    private String clienteDocumento;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;
    private String estado;
    private LocalDate fechaVencimiento;
    private String observaciones;
    private Instant fechaCreacion;
    private List<PagoCuentaDTO> pagos;
}
