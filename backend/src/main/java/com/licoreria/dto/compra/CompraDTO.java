package com.licoreria.dto.compra;

import com.licoreria.dto.ProveedorDTO;
import com.licoreria.dto.UsuarioDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class CompraDTO {

    private Long id;
    private String numeroCompra;
    private ProveedorDTO proveedor;
    private LocalDate fechaCompra;
    private BigDecimal total;
    private UsuarioDTO usuario;
    private String estado;
    private String observaciones;
    private Instant fechaCreacion;
    private List<DetalleCompraDTO> detalles;
}
