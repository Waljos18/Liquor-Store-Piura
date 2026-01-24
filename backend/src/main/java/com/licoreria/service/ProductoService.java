package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.CategoriaDTO;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.entity.Categoria;
import com.licoreria.entity.Producto;
import com.licoreria.repository.CategoriaRepository;
import com.licoreria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ApiResponse<Page<ProductoDTO>> listar(String search, Long categoriaId, Boolean activo, Boolean stockBajo, Pageable pageable) {
        Page<Producto> page = productoRepository.buscarConFiltros(search, categoriaId, activo, stockBajo, pageable);
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<ProductoDTO> obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .map(p -> ApiResponse.ok(toDto(p)))
                .orElse(ApiResponse.error("NOT_FOUND", "Producto no encontrado"));
    }

    public ApiResponse<List<ProductoDTO>> buscarParaPos(String q) {
        if (q == null || q.isBlank()) {
            return ApiResponse.ok(List.of());
        }
        List<Producto> list = productoRepository.buscarParaPos(q.trim());
        return ApiResponse.ok(list.stream().map(this::toDtoPos).collect(Collectors.toList()));
    }

    @Transactional
    public ApiResponse<ProductoDTO> crear(ProductoDTO dto) {
        if (dto.getCodigoBarras() != null && !dto.getCodigoBarras().isBlank() && productoRepository.existsByCodigoBarras(dto.getCodigoBarras())) {
            return ApiResponse.error("CONFLICT", "Ya existe un producto con ese código de barras");
        }
        Categoria cat = null;
        if (dto.getCategoriaId() != null) {
            cat = categoriaRepository.findById(dto.getCategoriaId()).orElse(null);
        }
        int stockInicial = dto.getStockInicial() != null ? dto.getStockInicial() : 0;
        Producto p = Producto.builder()
                .codigoBarras(dto.getCodigoBarras())
                .nombre(dto.getNombre())
                .marca(dto.getMarca())
                .categoria(cat)
                .precioCompra(dto.getPrecioCompra())
                .precioVenta(dto.getPrecioVenta() != null ? dto.getPrecioVenta() : BigDecimal.ZERO)
                .stockActual(stockInicial)
                .stockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 0)
                .stockMaximo(dto.getStockMaximo())
                .fechaVencimiento(dto.getFechaVencimiento())
                .imagen(dto.getImagen())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        p = productoRepository.save(p);
        return ApiResponse.ok(toDto(p), "Producto creado exitosamente");
    }

    @Transactional
    public ApiResponse<ProductoDTO> actualizar(Long id, ProductoDTO dto) {
        Producto p = productoRepository.findById(id).orElse(null);
        if (p == null) {
            return ApiResponse.error("NOT_FOUND", "Producto no encontrado");
        }
        if (dto.getCodigoBarras() != null && !dto.getCodigoBarras().equals(p.getCodigoBarras()) && productoRepository.existsByCodigoBarras(dto.getCodigoBarras())) {
            return ApiResponse.error("CONFLICT", "Ya existe un producto con ese código de barras");
        }
        if (dto.getCodigoBarras() != null) p.setCodigoBarras(dto.getCodigoBarras());
        if (dto.getNombre() != null) p.setNombre(dto.getNombre());
        if (dto.getMarca() != null) p.setMarca(dto.getMarca());
        if (dto.getCategoriaId() != null) {
            p.setCategoria(categoriaRepository.findById(dto.getCategoriaId()).orElse(null));
        }
        if (dto.getPrecioCompra() != null) p.setPrecioCompra(dto.getPrecioCompra());
        if (dto.getPrecioVenta() != null) p.setPrecioVenta(dto.getPrecioVenta());
        if (dto.getStockMinimo() != null) p.setStockMinimo(dto.getStockMinimo());
        if (dto.getStockMaximo() != null) p.setStockMaximo(dto.getStockMaximo());
        if (dto.getFechaVencimiento() != null) p.setFechaVencimiento(dto.getFechaVencimiento());
        if (dto.getImagen() != null) p.setImagen(dto.getImagen());
        if (dto.getActivo() != null) p.setActivo(dto.getActivo());
        p = productoRepository.save(p);
        return ApiResponse.ok(toDto(p), "Producto actualizado exitosamente");
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        Producto p = productoRepository.findById(id).orElse(null);
        if (p == null) {
            return ApiResponse.error("NOT_FOUND", "Producto no encontrado");
        }
        p.setActivo(false);
        productoRepository.save(p);
        return ApiResponse.ok(null, "Producto desactivado exitosamente");
    }

    private ProductoDTO toDto(Producto p) {
        ProductoDTO d = new ProductoDTO();
        d.setId(p.getId());
        d.setCodigoBarras(p.getCodigoBarras());
        d.setNombre(p.getNombre());
        d.setMarca(p.getMarca());
        if (p.getCategoria() != null) {
            d.setCategoriaId(p.getCategoria().getId());
            CategoriaDTO catDto = new CategoriaDTO();
            catDto.setId(p.getCategoria().getId());
            catDto.setNombre(p.getCategoria().getNombre());
            d.setCategoria(catDto);
        }
        d.setPrecioCompra(p.getPrecioCompra());
        d.setPrecioVenta(p.getPrecioVenta());
        d.setStockActual(p.getStockActual());
        d.setStockMinimo(p.getStockMinimo());
        d.setStockMaximo(p.getStockMaximo());
        d.setFechaVencimiento(p.getFechaVencimiento());
        d.setImagen(p.getImagen());
        d.setActivo(p.getActivo());
        return d;
    }

    private ProductoDTO toDtoPos(Producto p) {
        ProductoDTO d = new ProductoDTO();
        d.setId(p.getId());
        d.setCodigoBarras(p.getCodigoBarras());
        d.setNombre(p.getNombre());
        d.setPrecioVenta(p.getPrecioVenta());
        d.setStockActual(p.getStockActual());
        d.setImagen(p.getImagen());
        return d;
    }
}
