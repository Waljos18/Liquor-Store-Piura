package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.pack.CrearPackRequest;
import com.licoreria.dto.pack.PackDTO;
import com.licoreria.dto.pack.PackProductoDTO;
import com.licoreria.entity.*;
import com.licoreria.repository.PackRepository;
import com.licoreria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackService {

    private final PackRepository packRepository;
    private final ProductoRepository productoRepository;

    public ApiResponse<Page<PackDTO>> listar(Boolean soloActivos, Pageable pageable) {
        Page<Pack> page;
        if (soloActivos != null && soloActivos) {
            page = packRepository.findByActivoTrue(pageable);
        } else {
            page = packRepository.findAll(pageable);
        }
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<PackDTO> obtenerPorId(Long id) {
        return packRepository.findById(id)
                .map(p -> ApiResponse.ok(toDto(p)))
                .orElse(ApiResponse.error("NOT_FOUND", "Pack no encontrado"));
    }

    @Transactional
    public ApiResponse<PackDTO> crear(CrearPackRequest request) {
        // Validar productos
        List<PackProducto> productos = new ArrayList<>();
        BigDecimal precioTotalProductos = BigDecimal.ZERO;

        for (CrearPackRequest.ProductoPackRequest item : request.getProductos()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            if (!producto.getActivo()) {
                return ApiResponse.error("INVALID", "El producto " + producto.getNombre() + " está inactivo");
            }

            BigDecimal subtotal = producto.getPrecioVenta()
                    .multiply(new BigDecimal(item.getCantidad()));
            precioTotalProductos = precioTotalProductos.add(subtotal);

            PackProducto packProducto = PackProducto.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .build();

            productos.add(packProducto);
        }

        // Crear pack
        Pack pack = Pack.builder()
                .nombre(request.getNombre())
                .precioPack(request.getPrecioPack())
                .activo(true)
                .build();

        // Asignar pack a productos
        final Pack packFinal = pack;
        productos.forEach(p -> p.setPack(packFinal));
        packFinal.setProductos(productos);

        Pack packGuardado = packRepository.save(packFinal);
        return ApiResponse.ok(toDto(packGuardado), "Pack creado exitosamente");
    }

    @Transactional
    public ApiResponse<PackDTO> actualizar(Long id, CrearPackRequest request) {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        if (request.getNombre() != null) pack.setNombre(request.getNombre());
        if (request.getPrecioPack() != null) pack.setPrecioPack(request.getPrecioPack());

        // Actualizar productos si se proporcionan
        if (request.getProductos() != null) {
            pack.getProductos().clear();
            for (CrearPackRequest.ProductoPackRequest item : request.getProductos()) {
                Producto producto = productoRepository.findById(item.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

                PackProducto packProducto = PackProducto.builder()
                        .pack(pack)
                        .producto(producto)
                        .cantidad(item.getCantidad())
                        .build();

                pack.getProductos().add(packProducto);
            }
        }

        pack = packRepository.save(pack);
        return ApiResponse.ok(toDto(pack), "Pack actualizado exitosamente");
    }

    @Transactional
    public ApiResponse<Void> desactivar(Long id) {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        pack.setActivo(false);
        packRepository.save(pack);
        return ApiResponse.ok(null, "Pack desactivado exitosamente");
    }

    public ApiResponse<BigDecimal> calcularPrecioSugerido(Long id) {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        BigDecimal precioTotal = BigDecimal.ZERO;
        for (PackProducto packProducto : pack.getProductos()) {
            BigDecimal subtotal = packProducto.getProducto().getPrecioVenta()
                    .multiply(new BigDecimal(packProducto.getCantidad()));
            precioTotal = precioTotal.add(subtotal);
        }

        // Precio sugerido: 10% de descuento sobre el total
        BigDecimal precioSugerido = precioTotal.multiply(new BigDecimal("0.90"))
                .setScale(2, java.math.RoundingMode.HALF_UP);

        return ApiResponse.ok(precioSugerido, 
            "Precio sugerido (10% descuento): " + precioSugerido + 
            " | Precio total sin descuento: " + precioTotal);
    }

    private PackDTO toDto(Pack pack) {
        PackDTO dto = new PackDTO();
        dto.setId(pack.getId());
        dto.setNombre(pack.getNombre());
        dto.setPrecioPack(pack.getPrecioPack());
        dto.setActivo(pack.getActivo());
        dto.setFechaCreacion(pack.getFechaCreacion());

        if (pack.getProductos() != null) {
            dto.setProductos(pack.getProductos().stream()
                    .map(this::toProductoDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private PackProductoDTO toProductoDto(PackProducto packProducto) {
        PackProductoDTO dto = new PackProductoDTO();
        dto.setId(packProducto.getId());
        dto.setProducto(toProductoDto(packProducto.getProducto()));
        dto.setCantidad(packProducto.getCantidad());
        return dto;
    }

    private ProductoDTO toProductoDto(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setCodigoBarras(producto.getCodigoBarras());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setStockActual(producto.getStockActual());
        return dto;
    }
}
