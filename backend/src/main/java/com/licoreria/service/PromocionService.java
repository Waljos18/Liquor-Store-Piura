package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.promocion.CrearPromocionRequest;
import com.licoreria.dto.promocion.PromocionDTO;
import com.licoreria.dto.promocion.PromocionProductoDTO;
import com.licoreria.entity.*;
import com.licoreria.repository.PromocionRepository;
import com.licoreria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;

    public ApiResponse<Page<PromocionDTO>> listar(Boolean soloActivas, Pageable pageable) {
        Page<Promocion> page;
        if (soloActivas != null && soloActivas) {
            page = promocionRepository.findByActivaTrue(pageable);
        } else {
            page = promocionRepository.findAll(pageable);
        }
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<PromocionDTO> obtenerPorId(Long id) {
        return promocionRepository.findById(id)
                .map(p -> ApiResponse.ok(toDto(p)))
                .orElse(ApiResponse.error("NOT_FOUND", "Promoción no encontrada"));
    }

    public ApiResponse<List<PromocionDTO>> obtenerPromocionesActivasPorProducto(Long productoId) {
        List<Promocion> promociones = promocionRepository.findPromocionesActivasByProducto(
                productoId, 
                LocalDateTime.now()
        );
        return ApiResponse.ok(promociones.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @Transactional
    public ApiResponse<PromocionDTO> crear(CrearPromocionRequest request) {
        // Validar fechas
        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            return ApiResponse.error("INVALID", "La fecha de fin debe ser posterior a la fecha de inicio");
        }

        // Validar tipo de promoción
        Promocion.TipoPromocion tipo;
        try {
            tipo = Promocion.TipoPromocion.valueOf(request.getTipo());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("INVALID", "Tipo de promoción inválido: " + request.getTipo());
        }

        // Validar que tenga descuento según el tipo
        if (tipo == Promocion.TipoPromocion.DESCUENTO_PORCENTAJE && request.getDescuentoPorcentaje() == null) {
            return ApiResponse.error("INVALID", "Descuento porcentaje es requerido para este tipo de promoción");
        }
        if (tipo == Promocion.TipoPromocion.DESCUENTO_MONTO && request.getDescuentoMonto() == null) {
            return ApiResponse.error("INVALID", "Descuento monto es requerido para este tipo de promoción");
        }

        // Crear promoción
        Promocion promocion = Promocion.builder()
                .nombre(request.getNombre())
                .tipo(tipo)
                .descuentoPorcentaje(request.getDescuentoPorcentaje())
                .descuentoMonto(request.getDescuentoMonto())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .activa(true)
                .build();

        // Agregar productos si existen
        if (request.getProductos() != null && !request.getProductos().isEmpty()) {
            List<PromocionProducto> productos = new ArrayList<>();
            for (CrearPromocionRequest.ProductoPromocionRequest item : request.getProductos()) {
                Producto producto = productoRepository.findById(item.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

                PromocionProducto promocionProducto = PromocionProducto.builder()
                        .promocion(promocion)
                        .producto(producto)
                        .cantidadMinima(item.getCantidadMinima() != null ? item.getCantidadMinima() : 1)
                        .cantidadGratis(item.getCantidadGratis() != null ? item.getCantidadGratis() : 0)
                        .build();

                productos.add(promocionProducto);
            }
            promocion.setProductos(productos);
        }

        promocion = promocionRepository.save(promocion);
        return ApiResponse.ok(toDto(promocion), "Promoción creada exitosamente");
    }

    @Transactional
    public ApiResponse<PromocionDTO> actualizar(Long id, CrearPromocionRequest request) {
        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        // Validar fechas
        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            return ApiResponse.error("INVALID", "La fecha de fin debe ser posterior a la fecha de inicio");
        }

        // Actualizar campos
        if (request.getNombre() != null) promocion.setNombre(request.getNombre());
        if (request.getTipo() != null) {
            try {
                promocion.setTipo(Promocion.TipoPromocion.valueOf(request.getTipo()));
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("INVALID", "Tipo de promoción inválido");
            }
        }
        if (request.getDescuentoPorcentaje() != null) promocion.setDescuentoPorcentaje(request.getDescuentoPorcentaje());
        if (request.getDescuentoMonto() != null) promocion.setDescuentoMonto(request.getDescuentoMonto());
        if (request.getFechaInicio() != null) promocion.setFechaInicio(request.getFechaInicio());
        if (request.getFechaFin() != null) promocion.setFechaFin(request.getFechaFin());

        // Actualizar productos si se proporcionan
        if (request.getProductos() != null) {
            promocion.getProductos().clear();
            for (CrearPromocionRequest.ProductoPromocionRequest item : request.getProductos()) {
                Producto producto = productoRepository.findById(item.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

                PromocionProducto promocionProducto = PromocionProducto.builder()
                        .promocion(promocion)
                        .producto(producto)
                        .cantidadMinima(item.getCantidadMinima() != null ? item.getCantidadMinima() : 1)
                        .cantidadGratis(item.getCantidadGratis() != null ? item.getCantidadGratis() : 0)
                        .build();

                promocion.getProductos().add(promocionProducto);
            }
        }

        promocion = promocionRepository.save(promocion);
        return ApiResponse.ok(toDto(promocion), "Promoción actualizada exitosamente");
    }

    @Transactional
    public ApiResponse<Void> desactivar(Long id) {
        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        promocion.setActiva(false);
        promocionRepository.save(promocion);
        return ApiResponse.ok(null, "Promoción desactivada exitosamente");
    }

    public ApiResponse<PromocionDTO> aplicarPromocion(Long promocionId, Long productoId, Integer cantidad) {
        Promocion promocion = promocionRepository.findById(promocionId)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        // Validar que la promoción esté activa y en rango de fechas
        LocalDateTime ahora = LocalDateTime.now();
        if (!promocion.getActiva() || 
            ahora.isBefore(promocion.getFechaInicio()) || 
            ahora.isAfter(promocion.getFechaFin())) {
            return ApiResponse.error("INVALID", "La promoción no está activa o está fuera de rango de fechas");
        }

        // Validar que el producto esté en la promoción
        boolean productoEnPromocion = promocion.getProductos().stream()
                .anyMatch(pp -> pp.getProducto().getId().equals(productoId));

        if (!productoEnPromocion) {
            return ApiResponse.error("INVALID", "El producto no está incluido en esta promoción");
        }

        // Validar cantidad mínima
        PromocionProducto promocionProducto = promocion.getProductos().stream()
                .filter(pp -> pp.getProducto().getId().equals(productoId))
                .findFirst()
                .orElse(null);

        if (promocionProducto != null && cantidad < promocionProducto.getCantidadMinima()) {
            return ApiResponse.error("INVALID", 
                "La cantidad mínima para esta promoción es: " + promocionProducto.getCantidadMinima());
        }

        return ApiResponse.ok(toDto(promocion), "Promoción aplicable");
    }

    private PromocionDTO toDto(Promocion promocion) {
        PromocionDTO dto = new PromocionDTO();
        dto.setId(promocion.getId());
        dto.setNombre(promocion.getNombre());
        dto.setTipo(promocion.getTipo().name());
        dto.setDescuentoPorcentaje(promocion.getDescuentoPorcentaje());
        dto.setDescuentoMonto(promocion.getDescuentoMonto());
        dto.setFechaInicio(promocion.getFechaInicio());
        dto.setFechaFin(promocion.getFechaFin());
        dto.setActiva(promocion.getActiva());
        dto.setFechaCreacion(promocion.getFechaCreacion());

        if (promocion.getProductos() != null) {
            dto.setProductos(promocion.getProductos().stream()
                    .map(this::toProductoDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private PromocionProductoDTO toProductoDto(PromocionProducto promocionProducto) {
        PromocionProductoDTO dto = new PromocionProductoDTO();
        dto.setId(promocionProducto.getId());
        dto.setProducto(toProductoDto(promocionProducto.getProducto()));
        dto.setCantidadMinima(promocionProducto.getCantidadMinima());
        dto.setCantidadGratis(promocionProducto.getCantidadGratis());
        return dto;
    }

    private ProductoDTO toProductoDto(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setCodigoBarras(producto.getCodigoBarras());
        dto.setPrecioVenta(producto.getPrecioVenta());
        return dto;
    }
}
