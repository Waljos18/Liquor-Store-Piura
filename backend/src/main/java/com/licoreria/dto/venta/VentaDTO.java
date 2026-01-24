package com.licoreria.dto.venta;

import com.licoreria.dto.ClienteDTO;
import com.licoreria.dto.UsuarioDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class VentaDTO {

    private Long id;
    private String numeroVenta;
    private Instant fecha;
    private UsuarioDTO usuario;
    private ClienteDTO cliente;
    private BigDecimal subtotal;
    private BigDecimal descuento;
    private BigDecimal impuesto;
    private BigDecimal total;
    private String formaPago;
    private String estado;
    private String observaciones;
    private Instant fechaCreacion;
    private List<DetalleVentaDTO> detalles;
}
