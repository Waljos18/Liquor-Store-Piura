package com.licoreria.chilalo.data.remote

// ── Paginación ──────────────────────────────────────────────────────────────
data class PagedData<T>(
    val content: List<T> = emptyList(),
    val totalElements: Long = 0,
    val totalPages: Int = 0,
    val number: Int = 0,
    val size: Int = 0
)

// ── Categoría ────────────────────────────────────────────────────────────────
data class CategoriaDto(
    val id: Long = 0,
    val nombre: String = "",
    val activa: Boolean = true
)

// ── Producto ─────────────────────────────────────────────────────────────────
data class ProductoDto(
    val id: Long = 0,
    val codigoBarras: String? = null,
    val nombre: String = "",
    val marca: String? = null,
    val categoriaId: Long? = null,
    val categoria: CategoriaDto? = null,
    val precioVenta: Double = 0.0,
    val stockActual: Int = 0,
    val stockMinimo: Int? = null,
    val stockMaximo: Int? = null,
    val activo: Boolean = true,
    val fechaVencimiento: String? = null
)

// ── Cliente ──────────────────────────────────────────────────────────────────
data class ClienteDto(
    val id: Long = 0,
    val tipoDocumento: String = "",
    val numeroDocumento: String = "",
    val nombre: String = "",
    val telefono: String? = null,
    val email: String? = null,
    val puntosFidelizacion: Int = 0
)

// ── Detalle de Venta ─────────────────────────────────────────────────────────
data class ProductoSimpleDto(
    val id: Long = 0,
    val nombre: String = "",
    val marca: String? = null,
    val codigoBarras: String? = null
)

data class DetalleVentaDto(
    val id: Long = 0,
    val producto: ProductoSimpleDto? = null,
    val packId: Long? = null,
    val packNombre: String? = null,
    val cantidad: Int = 0,
    val precioUnitario: Double = 0.0,
    val descuento: Double = 0.0,
    val subtotal: Double = 0.0
)

// ── Venta ────────────────────────────────────────────────────────────────────
data class VentaDto(
    val id: Long = 0,
    val numeroVenta: String = "",
    val fecha: String? = null,
    val subtotal: Double = 0.0,
    val descuento: Double = 0.0,
    val impuesto: Double = 0.0,
    val total: Double = 0.0,
    val vuelto: Double = 0.0,
    val formaPago: String = "",
    val estado: String = "",
    val observaciones: String? = null,
    val cliente: ClienteDto? = null,
    val detalles: List<DetalleVentaDto>? = null
)

// ── Dashboard ─────────────────────────────────────────────────────────────────
data class DashboardDto(
    val ventasHoy: Double = 0.0,
    val gananciasHoy: Double = 0.0,
    val transaccionesHoy: Long = 0,
    val productosActivos: Long = 0,
    val productosStockBajo: Long = 0,
    val productosProximosVencer: Long = 0
)

// ── Movimiento de inventario ──────────────────────────────────────────────────
data class MovimientoDto(
    val id: Long = 0,
    val tipoMovimiento: String = "",
    val cantidad: Int = 0,
    val motivo: String? = null,
    val fecha: String? = null
)

// ── Producto - Crear / Actualizar ────────────────────────────────────────────
data class CrearProductoRequestDto(
    val codigoBarras: String? = null,
    val nombre: String,
    val marca: String? = null,
    val categoriaId: Long? = null,
    val precioVenta: Double,
    val precioCompra: Double? = null,
    val stockInicial: Int = 0,
    val stockMinimo: Int = 0,
    val stockMaximo: Int? = null,
    val fechaVencimiento: String? = null,
    val activo: Boolean = true
)

// ── POS - Crear Venta ─────────────────────────────────────────────────────────
// NOTA: el campo se llama "items" para coincidir con CrearVentaRequest del backend
// productoId y packId son mutuamente excluyentes (null = no aplica)
data class ItemVentaDto(
    val productoId: Long? = null,
    val packId: Long? = null,
    val cantidad: Int,
    val precioUnitario: Double,
    val descuento: Double = 0.0
)

data class PagoMixtoDto(
    val metodo: String,    // EFECTIVO, TARJETA, YAPE, PLIN, TRANSFERENCIA
    val monto: Double,
    val referencia: String? = null
)

data class CrearVentaRequestDto(
    val clienteId: Long? = null,
    val items: List<ItemVentaDto>,
    val descuento: Double = 0.0,
    val formaPago: String,
    val montoRecibido: Double? = null,
    val pagosMixtos: List<PagoMixtoDto>? = null,
    val observaciones: String? = null,
    val aplicarIgv: Boolean = false,
    val referencia: String? = null,
    val fechaVencimientoCredito: String? = null,
    val puntosCanjeados: Int? = null
)

// ── Fidelización ───────────────────────────────────────────────────────────────
data class ConfigFidelizacionDto(
    val activo: Boolean = true,
    val solesPorPunto: Double = 5.0,
    val puntosPorSolDescuento: Double = 20.0,
    val maxPuntosCanjeporVenta: Int = 500,
    val minCompraParaCanje: Double = 20.0
)

// ── Facturación ───────────────────────────────────────────────────────────────
data class ComprobanteDto(
    val id: Long = 0,
    val ventaId: Long = 0,
    val tipoComprobante: String = "",
    val serie: String = "",
    val numero: String = "",
    val estadoSunat: String = "",
    val fechaEmision: String? = null
)

// El backend devuelve Map<String,Object> — capturamos los campos útiles
data class ComprobanteEmitidoDto(
    val comprobanteId: Long? = null,
    val tipo: String? = null,
    val serie: String? = null,
    val numero: String? = null
)

data class EmitirBoletaRequestDto(
    val ventaId: Long,
    val tipoDocumento: String,
    val numeroDocumento: String,
    val nombre: String
)

data class EmitirFacturaRequestDto(
    val ventaId: Long,
    val numeroDocumento: String,
    val razonSocial: String
)

// ── Pack ──────────────────────────────────────────────────────────────────────
data class PackProductoItemDto(
    val id: Long = 0,
    val nombre: String = "",
    val codigoBarras: String? = null,
    val precioVenta: Double = 0.0,
    val stockActual: Int = 0
)

data class PackProductoDto(
    val id: Long = 0,
    val producto: PackProductoItemDto = PackProductoItemDto(),
    val cantidad: Int = 0
)

data class PackDto(
    val id: Long = 0,
    val nombre: String = "",
    val precioPack: Double = 0.0,
    val activo: Boolean = true,
    val productos: List<PackProductoDto> = emptyList()
)

// ── Promoción ─────────────────────────────────────────────────────────────────
data class PromocionProductoItemDto(
    val id: Long = 0,
    val nombre: String = "",
    val codigoBarras: String? = null,
    val precioVenta: Double = 0.0
)

data class PromocionProductoDetailDto(
    val id: Long = 0,
    val producto: PromocionProductoItemDto = PromocionProductoItemDto(),
    val cantidadMinima: Int = 1,
    val cantidadGratis: Int = 0
)

data class PromocionDto(
    val id: Long = 0,
    val nombre: String = "",
    val tipo: String = "",  // DESCUENTO_PORCENTAJE, DESCUENTO_MONTO, CANTIDAD, VOLUMEN
    val descuentoPorcentaje: Double? = null,
    val descuentoMonto: Double? = null,
    val fechaInicio: String? = null,
    val fechaFin: String? = null,
    val activa: Boolean = true,
    val productos: List<PromocionProductoDetailDto> = emptyList()
)
