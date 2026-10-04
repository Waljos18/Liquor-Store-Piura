package com.licoreria.dto.devolucion;

import com.licoreria.dto.UsuarioDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class DevolucionDTO {
    private Long id;
    private String numeroDevolucion;
    private Long ventaId;
    private String numeroVenta;
    private Instant fecha;
    private UsuarioDTO usuario;
    private String motivo;
    private String estado;
    private String observaciones;
    private BigDecimal total;
    private Instant fechaCreacion;
    private List<DetalleDevolucionDTO> detalles;
}
