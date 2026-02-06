package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.inventario.StockEquivalenciaPacksDTO;
import com.licoreria.entity.MovimientoInventario;
import com.licoreria.entity.Pack;
import com.licoreria.entity.PackProducto;
import com.licoreria.entity.Producto;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.MovimientoInventarioRepository;
import com.licoreria.repository.PackRepository;
import com.licoreria.repository.ProductoRepository;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final PackRepository packRepository;
    private final UsuarioRepository usuarioRepository;

    public ApiResponse<Page<MovimientoInventario>> listarMovimientos(
            Long productoId,
            String tipoMovimiento,
            Instant fechaDesde,
            Instant fechaHasta,
            Pageable pageable
    ) {
        Page<MovimientoInventario> page;

        if (productoId != null) {
            page = movimientoRepository.findByProductoId(productoId, pageable);
        } else if (tipoMovimiento != null) {
            page = movimientoRepository.findByTipoMovimiento(
                    MovimientoInventario.TipoMovimiento.valueOf(tipoMovimiento), 
                    pageable
            );
        } else if (fechaDesde != null && fechaHasta != null) {
            page = movimientoRepository.findByFechaBetween(fechaDesde, fechaHasta, pageable);
        } else {
            page = movimientoRepository.findAll(pageable);
        }

        return ApiResponse.ok(page);
    }

    public ApiResponse<List<MovimientoInventario>> obtenerHistorialProducto(Long productoId) {
        List<MovimientoInventario> historial = movimientoRepository.findHistorialByProductoId(productoId);
        return ApiResponse.ok(historial);
    }

    @Transactional
    public ApiResponse<MovimientoInventario> crearMovimientoManual(
            Long productoId,
            String tipoMovimiento,
            Integer cantidad,
            String motivo
    ) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MovimientoInventario.TipoMovimiento tipo = MovimientoInventario.TipoMovimiento.valueOf(tipoMovimiento);

        // Validar stock para salidas
        if (tipo == MovimientoInventario.TipoMovimiento.SALIDA && producto.getStockActual() < cantidad) {
            return ApiResponse.error("INSUFFICIENT_STOCK", 
                "Stock insuficiente. Disponible: " + producto.getStockActual() + ", Solicitado: " + cantidad);
        }

        // Actualizar stock
        int stockAnterior = producto.getStockActual();
        if (tipo == MovimientoInventario.TipoMovimiento.ENTRADA) {
            producto.setStockActual(stockAnterior + cantidad);
        } else if (tipo == MovimientoInventario.TipoMovimiento.SALIDA) {
            producto.setStockActual(stockAnterior - cantidad);
        } else if (tipo == MovimientoInventario.TipoMovimiento.AJUSTE) {
            // Para ajustes, la cantidad puede ser positiva o negativa
            producto.setStockActual(stockAnterior + cantidad);
        }
        productoRepository.save(producto);

        // Crear movimiento
        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(tipo)
                .cantidad(Math.abs(cantidad))
                .motivo(motivo != null ? motivo : "Movimiento manual")
                .usuario(usuario)
                .build();

        movimiento = movimientoRepository.save(movimiento);
        return ApiResponse.ok(movimiento);
    }

    /**
     * Registra entrada de pack descomponiéndolo en unidades.
     * El inventario se maneja siempre en unidades; el pack es agrupación comercial.
     */
    @Transactional
    public ApiResponse<Void> registrarEntradaPack(Long packId, Integer cantidadPacks) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        if (!pack.getActivo()) {
            return ApiResponse.error("INVALID", "El pack está inactivo");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String motivo = "Compra: " + cantidadPacks + " " + pack.getNombre();

        for (PackProducto packProducto : pack.getProductos()) {
            Producto producto = packProducto.getProducto();
            int totalUnidades = cantidadPacks * packProducto.getCantidad();

            producto.setStockActual(producto.getStockActual() + totalUnidades);
            productoRepository.save(producto);

            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(totalUnidades)
                    .motivo(motivo)
                    .usuario(usuario)
                    .build();
            movimientoRepository.save(movimiento);
        }

        return ApiResponse.ok(null, "Entrada de pack registrada. Stock actualizado en unidades.");
    }

    public ApiResponse<List<ProductoDTO>> obtenerProductosStockBajo() {
        List<Producto> productos = productoRepository.buscarConFiltros(
                null, null, true, true, Pageable.unpaged()
        ).getContent();

        List<ProductoDTO> productosDTO = productos.stream()
                .filter(p -> p.getStockActual() <= p.getStockMinimo())
                .map(this::toProductoDto)
                .collect(Collectors.toList());

        return ApiResponse.ok(productosDTO);
    }

    public ApiResponse<List<ProductoDTO>> obtenerProductosProximosVencer() {
        LocalDate fechaLimite = LocalDate.now().plusDays(30);
        List<Producto> productos = productoRepository.findAll().stream()
                .filter(p -> p.getFechaVencimiento() != null 
                        && p.getFechaVencimiento().isBefore(fechaLimite)
                        && p.getFechaVencimiento().isAfter(LocalDate.now())
                        && p.getActivo())
                .collect(Collectors.toList());

        List<ProductoDTO> productosDTO = productos.stream()
                .map(this::toProductoDto)
                .collect(Collectors.toList());

        return ApiResponse.ok(productosDTO);
    }

    /**
     * Stock en unidades y equivalencia en packs (cuántos packs completos se pueden armar).
     */
    public ApiResponse<StockEquivalenciaPacksDTO> obtenerStockEquivalenciaPacks(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<Pack> packs = packRepository.findPacksContainingProducto(productoId);
        List<StockEquivalenciaPacksDTO.EquivalenciaPack> equivalencias = new ArrayList<>();
        for (Pack pack : packs) {
            int unidadesPorPack = pack.getProductos().stream()
                    .filter(pp -> pp.getProducto().getId().equals(productoId))
                    .mapToInt(PackProducto::getCantidad)
                    .findFirst()
                    .orElse(0);
            if (unidadesPorPack > 0) {
                int packsCompletos = producto.getStockActual() / unidadesPorPack;
                equivalencias.add(new StockEquivalenciaPacksDTO.EquivalenciaPack(
                        pack.getId(), pack.getNombre(), unidadesPorPack, packsCompletos));
            }
        }

        StockEquivalenciaPacksDTO dto = StockEquivalenciaPacksDTO.builder()
                .productoId(producto.getId())
                .productoNombre(producto.getNombre())
                .stockUnidades(producto.getStockActual())
                .stockMinimo(producto.getStockMinimo())
                .packsDisponibles(equivalencias)
                .build();
        return ApiResponse.ok(dto);
    }

    @Transactional
    public ApiResponse<Void> ajustarInventario(Long productoId, Integer stockFisico) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stockActual = producto.getStockActual();
        int diferencia = stockFisico - stockActual;

        if (diferencia == 0) {
            return ApiResponse.ok(null, "El stock físico coincide con el stock del sistema");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar stock
        producto.setStockActual(stockFisico);
        productoRepository.save(producto);

        // Crear movimiento de ajuste
        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(MovimientoInventario.TipoMovimiento.AJUSTE)
                .cantidad(Math.abs(diferencia))
                .motivo("Ajuste de inventario físico. Stock sistema: " + stockActual + ", Stock físico: " + stockFisico)
                .usuario(usuario)
                .build();

        movimientoRepository.save(movimiento);

        return ApiResponse.ok(null, "Inventario ajustado exitosamente");
    }

    private ProductoDTO toProductoDto(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setCodigoBarras(producto.getCodigoBarras());
        dto.setNombre(producto.getNombre());
        dto.setMarca(producto.getMarca());
        dto.setPrecioCompra(producto.getPrecioCompra());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setStockActual(producto.getStockActual());
        dto.setStockMinimo(producto.getStockMinimo());
        dto.setStockMaximo(producto.getStockMaximo());
        dto.setFechaVencimiento(producto.getFechaVencimiento());
        dto.setImagen(producto.getImagen());
        dto.setActivo(producto.getActivo());
        if (producto.getCategoria() != null) {
            dto.setCategoriaId(producto.getCategoria().getId());
        }
        return dto;
    }
}
