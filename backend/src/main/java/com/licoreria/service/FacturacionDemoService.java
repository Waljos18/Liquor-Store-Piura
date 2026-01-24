package com.licoreria.service;

import com.licoreria.entity.*;
import com.licoreria.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Crea una venta de prueba y genera boleta para demostrar generación XML/PDF.
 * Solo para desarrollo y pruebas (Sprint 2).
 */
@Service
@RequiredArgsConstructor
public class FacturacionDemoService {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;
    private final FacturacionService facturacionService;

    @Transactional
    public Map<String, Object> ejecutarDemo() {
        Usuario usuario = usuarioRepository.findByUsername("admin").orElse(usuarioRepository.findAll().stream().findFirst().orElseThrow());
        Categoria cat = categoriaRepository.findByNombre("Cervezas").orElseGet(() -> {
            Categoria c = new Categoria();
            c.setNombre("Cervezas");
            c.setDescripcion("Cervezas");
            c.setActiva(true);
            return categoriaRepository.save(c);
        });

        Producto prod = productoRepository.findByCodigoBarras("DEMO001").or(() -> productoRepository.findAll().stream().findFirst())
                .orElseGet(() -> {
                    Producto p = new Producto();
                    p.setCodigoBarras("DEMO001");
                    p.setNombre("Cerveza Demo 355ml");
                    p.setMarca("Demo");
                    p.setCategoria(cat);
                    p.setPrecioCompra(BigDecimal.valueOf(2.5));
                    p.setPrecioVenta(BigDecimal.valueOf(4.0));
                    p.setStockActual(100);
                    p.setStockMinimo(5);
                    p.setActivo(true);
                    return productoRepository.save(p);
                });

        Cliente cliente = clienteRepository.findByNumeroDocumento("12345678").orElseGet(() -> {
            Cliente c = new Cliente();
            c.setTipoDocumento(Cliente.TipoDocumento.DNI);
            c.setNumeroDocumento("12345678");
            c.setNombre("Juan Pérez Demo");
            c.setTelefono("999888777");
            return clienteRepository.save(c);
        });

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setCliente(cliente);
        venta.setSubtotal(BigDecimal.valueOf(8.0));
        venta.setDescuento(BigDecimal.ZERO);
        venta.setImpuesto(BigDecimal.valueOf(1.44));
        venta.setTotal(BigDecimal.valueOf(9.44));
        venta.setFormaPago(Venta.FormaPago.EFECTIVO);
        venta.setEstado(Venta.Estado.COMPLETADA);
        venta.setNumeroVenta(null);
        venta = ventaRepository.save(venta);

        DetalleVenta det = new DetalleVenta();
        det.setVenta(venta);
        det.setProducto(prod);
        det.setCantidad(2);
        det.setPrecioUnitario(BigDecimal.valueOf(4.0));
        det.setDescuento(BigDecimal.ZERO);
        det.setSubtotal(BigDecimal.valueOf(8.0));
        venta.getDetalles().add(det);
        ventaRepository.save(venta);

        Map<String, Object> comp = facturacionService.generarComprobanteBoleta(
                venta.getId(), "1", "12345678", "Juan Pérez Demo");

        Map<String, Object> result = new HashMap<>();
        result.put("ventaId", venta.getId());
        result.put("numeroVenta", venta.getNumeroVenta());
        result.put("comprobante", comp);
        result.put("message", "Demo OK. Descarga PDF: GET /api/v1/facturacion/comprobantes/" + comp.get("id") + "/pdf");
        return result;
    }
}
