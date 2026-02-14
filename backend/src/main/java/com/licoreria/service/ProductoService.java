package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.CategoriaDTO;
import com.licoreria.dto.ImportarProductosResultDTO;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.entity.Categoria;
import com.licoreria.entity.Producto;
import com.licoreria.repository.CategoriaRepository;
import com.licoreria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public ApiResponse<Page<ProductoDTO>> listar(String search, Long categoriaId, Boolean activo, Boolean stockBajo, Pageable pageable) {
        Page<Producto> page = productoRepository.buscarConFiltros(search, categoriaId, activo, stockBajo, pageable);
        return ApiResponse.ok(page.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ApiResponse<ProductoDTO> obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .map(p -> ApiResponse.ok(toDto(p)))
                .orElse(ApiResponse.error("NOT_FOUND", "Producto no encontrado"));
    }

    @Transactional(readOnly = true)
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
    public ApiResponse<ImportarProductosResultDTO> importarDesdeCsv(String csvContent) {
        int creados = 0;
        int omitidos = 0;
        int errores = 0;
        int totalProcesados = 0;
        List<String> mensajesError = new ArrayList<>();
        List<String> productosCreados = new ArrayList<>();
        Map<String, Categoria> categoriaCache = new ConcurrentHashMap<>();

        String[] lines = csvContent.split("\r?\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            List<String> cols = parseCsvLine(line);
            if (cols.size() < 6) continue;

            String empresa = safe(cols, 0);
            String categoriaNombre = safe(cols, 1).trim();
            String marca = safe(cols, 2).trim();
            String descripcion = safe(cols, 3).trim();
            String costoStr = safe(cols, 4);
            String precioVentaStr = safe(cols, 5);
            String stockStr = cols.size() > 7 ? safe(cols, 7) : "";

            if (categoriaNombre.isEmpty() && marca.isEmpty() && descripcion.isEmpty()) continue;
            if ("EMPRESA".equals(empresa) && "VINOS".equals(categoriaNombre)) continue;

            if (categoriaNombre.isEmpty()) categoriaNombre = marca;
            if (marca.isEmpty() && !descripcion.isEmpty()) marca = descripcion;
            if (descripcion.isEmpty() && !marca.isEmpty()) descripcion = marca;

            String nombre = buildNombre(marca, descripcion);
            if (nombre.isBlank()) {
                omitidos++;
                totalProcesados++;
                continue;
            }

            BigDecimal precioVenta = parsePrecio(precioVentaStr);
            if (precioVenta == null || precioVenta.compareTo(BigDecimal.ZERO) <= 0) {
                omitidos++;
                totalProcesados++;
                continue;
            }

            BigDecimal precioCompra = parsePrecio(costoStr);
            int stock = parseStock(stockStr);
            String codigoBarras = parseCodigoBarras(empresa);

            try {
                Categoria cat = obtenerOCrearCategoria(categoriaNombre.trim(), categoriaCache);
                ProductoDTO dto = new ProductoDTO();
                dto.setNombre(nombre.length() > 200 ? nombre.substring(0, 200) : nombre);
                dto.setMarca(marca.length() > 100 ? marca.substring(0, 100) : marca);
                dto.setCategoriaId(cat != null ? cat.getId() : null);
                dto.setPrecioCompra(precioCompra);
                dto.setPrecioVenta(precioVenta);
                dto.setStockInicial(stock);
                dto.setCodigoBarras(codigoBarras.isEmpty() ? null : codigoBarras);

                ApiResponse<ProductoDTO> crearRes = crear(dto);
                if (crearRes.isSuccess()) {
                    creados++;
                    productosCreados.add(nombre);
                } else {
                    omitidos++;
                    if (crearRes.getError() != null) {
                        mensajesError.add("Fila " + (i + 1) + " " + nombre + ": " + crearRes.getError().getMessage());
                    }
                }
            } catch (Exception e) {
                errores++;
                mensajesError.add("Fila " + (i + 1) + " " + nombre + ": " + e.getMessage());
                log.warn("Error importando producto: {}", e.getMessage());
            }
            totalProcesados++;
        }

        ImportarProductosResultDTO result = ImportarProductosResultDTO.builder()
                .totalProcesados(totalProcesados)
                .creados(creados)
                .omitidos(omitidos)
                .errores(errores)
                .mensajesError(mensajesError)
                .productosCreados(productosCreados)
                .build();
        return ApiResponse.ok(result, "Importación completada");
    }

    private List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim().replace("\"", ""));
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString().trim().replace("\"", ""));
        return result;
    }

    private String safe(List<String> list, int idx) {
        return idx < list.size() ? (list.get(idx) != null ? list.get(idx) : "") : "";
    }

    private String buildNombre(String marca, String descripcion) {
        if (marca.isBlank() && descripcion.isBlank()) return "";
        if (marca.equals(descripcion)) return marca;
        if (marca.isBlank()) return descripcion;
        if (descripcion.isBlank()) return marca;
        return marca + " " + descripcion;
    }

    private BigDecimal parsePrecio(String s) {
        if (s == null || s.isBlank() || "-".equals(s)) return null;
        String num = s.replaceAll("[^\\d.]", "").replace(",", "");
        if (num.isEmpty()) return null;
        try {
            return new BigDecimal(num);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private int parseStock(String s) {
        if (s == null || s.isBlank()) return 0;
        String num = s.replaceAll("[^\\d]", "");
        if (num.isEmpty()) return 0;
        try {
            return Integer.parseInt(num);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private String parseCodigoBarras(String empresa) {
        if (empresa == null || empresa.isBlank()) return "";
        String cleaned = empresa.replaceAll("[^\\d]", "");
        return cleaned.length() >= 8 && cleaned.length() <= 20 ? cleaned : "";
    }

    private Categoria obtenerOCrearCategoria(String nombre, Map<String, Categoria> cache) {
        if (nombre == null || nombre.isBlank()) return null;
        return cache.computeIfAbsent(nombre, n -> {
            Categoria c = categoriaRepository.findByNombre(n).orElse(null);
            if (c == null) {
                c = Categoria.builder().nombre(n).activa(true).build();
                c = categoriaRepository.save(c);
            }
            return c;
        });
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
