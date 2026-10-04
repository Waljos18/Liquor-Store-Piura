package com.licoreria.chilalo.ui.pos

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.remote.CategoriaDto
import com.licoreria.chilalo.data.remote.ClienteDto
import com.licoreria.chilalo.data.remote.ComprobanteEmitidoDto
import com.licoreria.chilalo.data.remote.ConfigFidelizacionDto
import com.licoreria.chilalo.data.remote.CrearVentaRequestDto
import com.licoreria.chilalo.data.remote.PagoMixtoDto
import com.licoreria.chilalo.data.remote.EmitirBoletaRequestDto
import com.licoreria.chilalo.data.remote.EmitirFacturaRequestDto
import com.licoreria.chilalo.data.remote.FidelizacionApi
import com.licoreria.chilalo.data.remote.ItemVentaDto
import com.licoreria.chilalo.data.remote.PackDto
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.data.remote.PromocionDto
import com.licoreria.chilalo.data.remote.VentaDto
import com.licoreria.chilalo.data.repository.CategoriaRepository
import com.licoreria.chilalo.data.repository.FacturacionRepository
import com.licoreria.chilalo.data.repository.PackRepository
import com.licoreria.chilalo.data.repository.PosRepository
import com.licoreria.chilalo.data.repository.PromocionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

// ─── Modelos del carrito ──────────────────────────────────────────────────────

data class PackItemInfo(val nombre: String, val cantidad: Int)

/**
 * Un ítem del carrito: puede ser un producto normal o un pack.
 * - Producto: [producto] != null, [packId] == null
 * - Pack:     [packId] != null,  [producto] == null
 */
data class CartItem(
    val producto: ProductoDto? = null,
    val packId: Long? = null,
    val packNombre: String? = null,
    val packProductos: List<PackItemInfo> = emptyList(),
    val cantidad: Int,
    val precioUnitario: Double,
    val descuentoPromo: Double = 0.0
) {
    val subtotal: Double get() = cantidad * precioUnitario
    val subtotalConDescuento: Double get() = (subtotal - descuentoPromo).coerceAtLeast(0.0)
    val isPack: Boolean get() = packId != null
    val itemKey: String get() = if (isPack) "pack_$packId" else "prod_${producto?.id}"
    val nombreDisplay: String get() = if (isPack) packNombre ?: "" else producto?.nombre ?: ""
}

enum class FormaPago(val label: String) {
    EFECTIVO("Efectivo"),
    TARJETA("Tarjeta"),
    TRANSFERENCIA("Transferencia"),
    YAPE("Yape"),
    PLIN("Plin"),
    MIXTO("Mixto"),
    CREDITO("Crédito/Fiado")
}

enum class EmitirTipo { BOLETA, FACTURA }

// ─── UI State ─────────────────────────────────────────────────────────────────

data class PosUiState(
    val isLoadingProductos: Boolean = false,
    val productos: List<ProductoDto> = emptyList(),
    val categorias: List<CategoriaDto> = emptyList(),
    val selectedCategoriaId: Long? = null,
    val searchQuery: String = "",
    val cart: List<CartItem> = emptyList(),
    val selectedCliente: ClienteDto? = null,
    val descuentoPct: String = "",
    val formaPago: FormaPago = FormaPago.EFECTIVO,
    val formaPago1: FormaPago = FormaPago.EFECTIVO,  // primer método al usar MIXTO
    val formaPago2: FormaPago = FormaPago.YAPE,
    val montoPago1: String = "",
    val isProcessing: Boolean = false,
    val ventaExitosa: VentaDto? = null,
    val error: String? = null,
    val showCart: Boolean = false,
    val showClienteSearch: Boolean = false,
    val clienteSearch: String = "",
    val clientes: List<ClienteDto> = emptyList(),
    val isLoadingClientes: Boolean = false,
    // Packs
    val packs: List<PackDto> = emptyList(),
    val isLoadingPacks: Boolean = false,
    // Promociones
    val promociones: List<PromocionDto> = emptyList(),
    val isLoadingPromociones: Boolean = false,
    val showPromociones: Boolean = false,
    // Scanner
    val showScanner: Boolean = false,
    val scannerMessage: String? = null,
    // Crédito / Fiado
    val fechaVencimientoCredito: String = "",
    // Referencia (Yape / Plin)
    val referencia: String = "",
    // IGV
    val aplicarIgv: Boolean = false,
    // Fidelización / Puntos
    val configFidelizacion: ConfigFidelizacionDto? = null,
    val puntosInput: String = "",
    val puntosCanjeados: Int = 0,
    // Comprobante
    val showEmitirDialog: EmitirTipo? = null,
    val isEmitiendo: Boolean = false,
    val comprobanteEmitido: ComprobanteEmitidoDto? = null,
    val emitirError: String? = null,
    val emitirTipoDoc: String = "DNI",
    val emitirNumDoc: String = "",
    val emitirNombre: String = "",
    val emitirRuc: String = "",
    val emitirRazonSocial: String = ""
) {
    val subtotalBruto: Double get() = cart.sumOf { it.subtotal }
    val descuentoPromoTotal: Double get() = cart.sumOf { it.descuentoPromo }
    val subtotal: Double get() = subtotalBruto
    val descuentoAmount: Double get() {
        val pct = descuentoPct.toDoubleOrNull() ?: 0.0
        return if (pct in 0.01..100.0) subtotalBruto * pct / 100.0 else 0.0
    }
    val descuentoPuntos: Double get() {
        val cfg = configFidelizacion ?: return 0.0
        return if (puntosCanjeados > 0) puntosCanjeados / cfg.puntosPorSolDescuento else 0.0
    }
    val baseTotal: Double get() = subtotalBruto - descuentoPromoTotal - descuentoAmount - descuentoPuntos
    val igvAmount: Double get() = if (aplicarIgv) baseTotal * 0.18 else 0.0
    val total: Double get() = (baseTotal + igvAmount).coerceAtLeast(0.0)
    val cartItemCount: Int get() = cart.sumOf { it.cantidad }
    val montoPago1Num: Double get() = montoPago1.toDoubleOrNull() ?: 0.0
    val montoPago2: Double get() = (total - montoPago1Num).coerceAtLeast(0.0)
    val puntosDisponibles: Int get() = selectedCliente?.puntosFidelizacion ?: 0
    val canCanjearPuntos: Boolean get() =
        configFidelizacion?.activo == true && puntosDisponibles > 0 && formaPago != FormaPago.CREDITO
}

// ─── ViewModel ────────────────────────────────────────────────────────────────

@OptIn(FlowPreview::class)
@HiltViewModel
class POSViewModel @Inject constructor(
    private val posRepository: PosRepository,
    private val categoriaRepository: CategoriaRepository,
    private val facturacionRepository: FacturacionRepository,
    private val packRepository: PackRepository,
    private val promocionRepository: PromocionRepository,
    private val fidelizacionApi: FidelizacionApi
) : ViewModel() {

    private val _uiState = MutableStateFlow(PosUiState())
    val uiState = _uiState.asStateFlow()

    private val _searchFlow = MutableStateFlow("")
    private val _clienteSearchFlow = MutableStateFlow("")
    private var productoJob: Job? = null

    init {
        cargarCategorias()
        cargarProductos()
        cargarPromociones()
        cargarConfigFidelizacion()
        observeSearch()
        observeClienteSearch()
    }

    // ── Carga inicial ──────────────────────────────────────────────────────────

    private fun cargarCategorias() {
        viewModelScope.launch {
            categoriaRepository.getCategorias().onSuccess { cats ->
                _uiState.update { it.copy(categorias = cats.filter { c -> c.activa }) }
            }
        }
    }

    private fun cargarConfigFidelizacion() {
        viewModelScope.launch {
            try {
                val resp = fidelizacionApi.getConfig()
                if (resp.success && resp.data != null) {
                    _uiState.update { it.copy(configFidelizacion = resp.data) }
                }
            } catch (_: Exception) { /* silencioso: puntos simplemente no se muestran */ }
        }
    }

    private fun cargarPromociones() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingPromociones = true) }
            promocionRepository.getPromocionesActivas().onSuccess { lista ->
                _uiState.update { it.copy(promociones = lista, isLoadingPromociones = false) }
                recalcularDescuentosPromo()
            }.onFailure {
                _uiState.update { it.copy(isLoadingPromociones = false) }
            }
        }
    }

    // ── Búsqueda ──────────────────────────────────────────────────────────────

    private fun observeSearch() {
        viewModelScope.launch {
            _searchFlow
                .debounce(350)
                .distinctUntilChanged()
                .collect { query ->
                    cargarProductos(search = query, categoriaId = _uiState.value.selectedCategoriaId)
                    if (query.length >= 2) buscarPacks(query)
                    else _uiState.update { it.copy(packs = emptyList()) }
                }
        }
    }

    private fun observeClienteSearch() {
        viewModelScope.launch {
            _clienteSearchFlow
                .debounce(350)
                .distinctUntilChanged()
                .collect { query ->
                    if (query.length >= 2) buscarClientes(query)
                    else _uiState.update { it.copy(clientes = emptyList()) }
                }
        }
    }

    private fun cargarProductos(search: String? = null, categoriaId: Long? = null) {
        productoJob?.cancel()
        productoJob = viewModelScope.launch {
            _uiState.update { it.copy(isLoadingProductos = true, error = null) }
            posRepository.getProductos(search = search, categoriaId = categoriaId)
                .onSuccess { productos ->
                    _uiState.update { it.copy(productos = productos, isLoadingProductos = false) }
                }.onFailure { e ->
                    _uiState.update { it.copy(isLoadingProductos = false, error = e.message) }
                }
        }
    }

    private fun buscarPacks(query: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingPacks = true) }
            packRepository.buscarPacks(query).onSuccess { lista ->
                _uiState.update { it.copy(packs = lista.filter { p -> p.activo }, isLoadingPacks = false) }
            }.onFailure {
                _uiState.update { it.copy(packs = emptyList(), isLoadingPacks = false) }
            }
        }
    }

    private fun buscarClientes(query: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingClientes = true) }
            posRepository.buscarClientes(query).onSuccess { lista ->
                _uiState.update { it.copy(clientes = lista, isLoadingClientes = false) }
            }.onFailure {
                _uiState.update { it.copy(isLoadingClientes = false) }
            }
        }
    }

    // ── Eventos de búsqueda ────────────────────────────────────────────────────

    fun onSearchChange(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        _searchFlow.value = query
    }

    fun onCategoriaSelect(id: Long?) {
        _uiState.update { it.copy(selectedCategoriaId = id, packs = emptyList()) }
        cargarProductos(search = _uiState.value.searchQuery, categoriaId = id)
    }

    // ── Carrito - Productos ────────────────────────────────────────────────────

    fun addToCart(producto: ProductoDto) {
        if (producto.stockActual <= 0) return
        _uiState.update { state ->
            val existing = state.cart.find { it.producto?.id == producto.id }
            val newCart = if (existing != null) {
                if (existing.cantidad >= producto.stockActual) return@update state
                state.cart.map {
                    if (it.producto?.id == producto.id) it.copy(cantidad = it.cantidad + 1) else it
                }
            } else {
                state.cart + CartItem(producto = producto, cantidad = 1, precioUnitario = producto.precioVenta)
            }
            state.copy(cart = newCart)
        }
        recalcularDescuentosPromo()
    }

    // ── Carrito - Packs ────────────────────────────────────────────────────────

    fun addPackToCart(pack: PackDto) {
        val packInfos = pack.productos.map { PackItemInfo(it.producto.nombre, it.cantidad) }
        _uiState.update { state ->
            val existing = state.cart.find { it.packId == pack.id }
            val newCart = if (existing != null) {
                state.cart.map {
                    if (it.packId == pack.id) it.copy(cantidad = it.cantidad + 1) else it
                }
            } else {
                state.cart + CartItem(
                    packId = pack.id,
                    packNombre = pack.nombre,
                    packProductos = packInfos,
                    cantidad = 1,
                    precioUnitario = pack.precioPack
                )
            }
            state.copy(cart = newCart)
        }
    }

    // ── Carrito - Operaciones generales por itemKey ────────────────────────────

    fun updateCantidadByKey(itemKey: String, cantidad: Int) {
        _uiState.update { state ->
            val newCart = if (cantidad <= 0) {
                state.cart.filter { it.itemKey != itemKey }
            } else {
                state.cart.map {
                    if (it.itemKey == itemKey) {
                        if (it.isPack) it.copy(cantidad = cantidad)
                        else {
                            val max = it.producto?.stockActual ?: Int.MAX_VALUE
                            it.copy(cantidad = cantidad.coerceAtMost(max))
                        }
                    } else it
                }
            }
            state.copy(cart = newCart)
        }
        recalcularDescuentosPromo()
    }

    fun removeFromCartByKey(itemKey: String) {
        _uiState.update { state ->
            state.copy(cart = state.cart.filter { it.itemKey != itemKey })
        }
    }

    // ── Descuentos por Promoción ───────────────────────────────────────────────

    private fun recalcularDescuentosPromo() {
        val promociones = _uiState.value.promociones
        _uiState.update { state ->
            val newCart = state.cart.map { item ->
                item.copy(descuentoPromo = calcularDescuentoPromo(item, promociones))
            }
            state.copy(cart = newCart)
        }
    }

    private fun calcularDescuentoPromo(item: CartItem, promociones: List<PromocionDto>): Double {
        if (item.isPack) return 0.0
        val productoId = item.producto?.id ?: return 0.0
        return promociones
            .filter { promo ->
                promo.activa && promo.productos.any { pp ->
                    pp.producto.id == productoId && item.cantidad >= pp.cantidadMinima
                }
            }
            .maxOfOrNull { promo ->
                when (promo.tipo) {
                    "DESCUENTO_PORCENTAJE" -> item.subtotal * (promo.descuentoPorcentaje ?: 0.0) / 100.0
                    "DESCUENTO_MONTO" -> (promo.descuentoMonto ?: 0.0)
                    else -> 0.0
                }
            } ?: 0.0
    }

    // ── Promociones panel ──────────────────────────────────────────────────────

    fun togglePromociones() {
        _uiState.update { it.copy(showPromociones = !it.showPromociones) }
    }

    // ── Descuento manual ──────────────────────────────────────────────────────

    fun onDescuentoChange(value: String) {
        if (value.isEmpty() || value.toDoubleOrNull() != null) {
            _uiState.update { it.copy(descuentoPct = value) }
        }
    }

    // ── Crédito ────────────────────────────────────────────────────────────────

    fun onFechaVencimientoChange(value: String) {
        _uiState.update { it.copy(fechaVencimientoCredito = value) }
    }

    // ── Referencia (Yape / Plin) ───────────────────────────────────────────────

    fun onReferenciaChange(value: String) {
        _uiState.update { it.copy(referencia = value) }
    }

    // ── IGV ────────────────────────────────────────────────────────────────────

    fun onAplicarIgvChange(value: Boolean) {
        _uiState.update { it.copy(aplicarIgv = value) }
    }

    // ── Puntos / Fidelización ──────────────────────────────────────────────────

    fun onPuntosInputChange(value: String) {
        if (value.isEmpty() || value.toIntOrNull() != null) {
            _uiState.update { it.copy(puntosInput = value, puntosCanjeados = 0) }
        }
    }

    fun aplicarPuntos() {
        val state = _uiState.value
        val cfg = state.configFidelizacion ?: return
        val pts = state.puntosInput.toIntOrNull() ?: return
        val max = minOf(state.puntosDisponibles, cfg.maxPuntosCanjeporVenta)
        _uiState.update { it.copy(puntosCanjeados = pts.coerceIn(0, max)) }
    }

    fun quitarPuntos() {
        _uiState.update { it.copy(puntosCanjeados = 0, puntosInput = "") }
    }

    // ── Forma de pago ──────────────────────────────────────────────────────────

    fun onFormaPagoChange(forma: FormaPago) {
        // Al cambiar a CREDITO quitamos puntos (no se pueden canjear en fiado)
        val clearPuntos = forma == FormaPago.CREDITO
        _uiState.update {
            it.copy(
                formaPago = forma,
                puntosCanjeados = if (clearPuntos) 0 else it.puntosCanjeados,
                puntosInput = if (clearPuntos) "" else it.puntosInput
            )
        }
    }

    fun onFormaPago1Change(forma: FormaPago) {
        _uiState.update { it.copy(formaPago1 = forma) }
    }

    fun onFormaPago2Change(forma: FormaPago) {
        _uiState.update { it.copy(formaPago2 = forma) }
    }

    fun onMontoPago1Change(value: String) {
        if (value.isEmpty() || value.toDoubleOrNull() != null) {
            _uiState.update { it.copy(montoPago1 = value) }
        }
    }

    // ── Cliente ────────────────────────────────────────────────────────────────

    fun onClienteSelect(cliente: ClienteDto?) {
        _uiState.update {
            it.copy(selectedCliente = cliente, showClienteSearch = false, clienteSearch = "", clientes = emptyList())
        }
    }

    fun onClienteSearchChange(query: String) {
        _uiState.update { it.copy(clienteSearch = query) }
        _clienteSearchFlow.value = query
    }

    fun toggleCart() {
        _uiState.update { it.copy(showCart = !it.showCart) }
    }

    fun setShowClienteSearch(show: Boolean) {
        _uiState.update { it.copy(showClienteSearch = show) }
    }

    // ── Confirmar venta ────────────────────────────────────────────────────────

    fun confirmarVenta() {
        val state = _uiState.value
        if (state.cart.isEmpty() || state.isProcessing) return

        // Validaciones extra
        if (state.formaPago == FormaPago.CREDITO && state.selectedCliente == null) {
            _uiState.update { it.copy(error = "La venta a crédito requiere seleccionar un cliente") }
            return
        }
        if (state.puntosCanjeados > 0 && state.selectedCliente == null) {
            _uiState.update { it.copy(error = "Se requiere cliente para canjear puntos") }
            return
        }

        val pagosMixtos = if (state.formaPago == FormaPago.MIXTO) {
            listOf(
                PagoMixtoDto(metodo = state.formaPago1.name, monto = state.montoPago1Num),
                PagoMixtoDto(metodo = state.formaPago2.name, monto = state.montoPago2)
            )
        } else null

        val montoRecibido = if (state.formaPago == FormaPago.EFECTIVO) {
            state.montoPago1.toDoubleOrNull()?.takeIf { it > 0 }
        } else null

        val referencia = state.referencia.trim().takeIf {
            it.isNotBlank() && (state.formaPago == FormaPago.YAPE || state.formaPago == FormaPago.PLIN)
        }

        val fechaCredito = state.fechaVencimientoCredito.trim().takeIf {
            it.isNotBlank() && state.formaPago == FormaPago.CREDITO
        }

        val request = CrearVentaRequestDto(
            clienteId = state.selectedCliente?.id,
            items = state.cart.map { item ->
                if (item.isPack) {
                    ItemVentaDto(packId = item.packId, cantidad = item.cantidad, precioUnitario = item.precioUnitario)
                } else {
                    ItemVentaDto(productoId = item.producto!!.id, cantidad = item.cantidad, precioUnitario = item.precioUnitario)
                }
            },
            descuento = state.descuentoPromoTotal + state.descuentoAmount,
            formaPago = state.formaPago.name,
            montoRecibido = montoRecibido,
            pagosMixtos = pagosMixtos,
            aplicarIgv = state.aplicarIgv,
            referencia = referencia,
            fechaVencimientoCredito = fechaCredito,
            puntosCanjeados = state.puntosCanjeados.takeIf { it > 0 }
        )

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, error = null) }
            posRepository.crearVenta(request).onSuccess { venta ->
                val cliente = state.selectedCliente
                _uiState.update {
                    it.copy(
                        isProcessing = false,
                        ventaExitosa = venta,
                        showCart = false,
                        emitirTipoDoc = cliente?.tipoDocumento?.takeIf { t -> t.isNotBlank() } ?: "DNI",
                        emitirNumDoc = cliente?.numeroDocumento ?: "",
                        emitirNombre = cliente?.nombre ?: "",
                        emitirRuc = if (cliente?.tipoDocumento == "RUC") cliente.numeroDocumento else "",
                        emitirRazonSocial = if (cliente?.tipoDocumento == "RUC") cliente.nombre else ""
                    )
                }
            }.onFailure { e ->
                _uiState.update { it.copy(isProcessing = false, error = e.message) }
            }
        }
    }

    // ── Comprobante ────────────────────────────────────────────────────────────

    fun showEmitirBoleta() {
        _uiState.update { it.copy(showEmitirDialog = EmitirTipo.BOLETA, emitirError = null) }
    }

    fun showEmitirFactura() {
        _uiState.update { it.copy(showEmitirDialog = EmitirTipo.FACTURA, emitirError = null) }
    }

    fun dismissEmitirDialog() {
        _uiState.update { it.copy(showEmitirDialog = null, emitirError = null) }
    }

    fun onEmitirTipoDocChange(value: String) { _uiState.update { it.copy(emitirTipoDoc = value) } }
    fun onEmitirNumDocChange(value: String) { _uiState.update { it.copy(emitirNumDoc = value) } }
    fun onEmitirNombreChange(value: String) { _uiState.update { it.copy(emitirNombre = value) } }
    fun onEmitirRucChange(value: String) { _uiState.update { it.copy(emitirRuc = value) } }
    fun onEmitirRazonSocialChange(value: String) { _uiState.update { it.copy(emitirRazonSocial = value) } }

    fun emitirBoleta() {
        val state = _uiState.value
        val ventaId = state.ventaExitosa?.id ?: return
        if (state.emitirNumDoc.isBlank() || state.emitirNombre.isBlank()) {
            _uiState.update { it.copy(emitirError = "Completa todos los campos") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isEmitiendo = true, emitirError = null) }
            facturacionRepository.emitirBoleta(
                EmitirBoletaRequestDto(ventaId = ventaId, tipoDocumento = state.emitirTipoDoc, numeroDocumento = state.emitirNumDoc, nombre = state.emitirNombre)
            ).onSuccess { comp ->
                _uiState.update { it.copy(isEmitiendo = false, showEmitirDialog = null, comprobanteEmitido = comp) }
            }.onFailure { e ->
                _uiState.update { it.copy(isEmitiendo = false, emitirError = e.message) }
            }
        }
    }

    fun emitirFactura() {
        val state = _uiState.value
        val ventaId = state.ventaExitosa?.id ?: return
        if (state.emitirRuc.isBlank() || state.emitirRazonSocial.isBlank()) {
            _uiState.update { it.copy(emitirError = "Completa todos los campos") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isEmitiendo = true, emitirError = null) }
            facturacionRepository.emitirFactura(
                EmitirFacturaRequestDto(ventaId = ventaId, numeroDocumento = state.emitirRuc, razonSocial = state.emitirRazonSocial)
            ).onSuccess { comp ->
                _uiState.update { it.copy(isEmitiendo = false, showEmitirDialog = null, comprobanteEmitido = comp) }
            }.onFailure { e ->
                _uiState.update { it.copy(isEmitiendo = false, emitirError = e.message) }
            }
        }
    }

    fun resetVenta() {
        _uiState.update {
            it.copy(
                cart = emptyList(),
                selectedCliente = null,
                descuentoPct = "",
                formaPago = FormaPago.EFECTIVO,
                formaPago1 = FormaPago.EFECTIVO,
                formaPago2 = FormaPago.YAPE,
                montoPago1 = "",
                fechaVencimientoCredito = "",
                referencia = "",
                aplicarIgv = false,
                puntosInput = "",
                puntosCanjeados = 0,
                ventaExitosa = null,
                error = null,
                showCart = false,
                showEmitirDialog = null,
                comprobanteEmitido = null,
                emitirError = null,
                emitirNumDoc = "",
                emitirNombre = "",
                emitirRuc = "",
                emitirRazonSocial = ""
            )
        }
        cargarProductos(categoriaId = _uiState.value.selectedCategoriaId)
    }

    fun dismissError() {
        _uiState.update { it.copy(error = null) }
    }

    // ── Scanner ────────────────────────────────────────────────────────────────

    fun openScanner() {
        _uiState.update { it.copy(showScanner = true, scannerMessage = null) }
    }

    fun closeScanner() {
        _uiState.update { it.copy(showScanner = false) }
    }

    fun onBarcodeScanned(codigo: String) {
        _uiState.update { it.copy(showScanner = false) }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingProductos = true, scannerMessage = null) }
            posRepository.buscarPorBarcode(codigo).onSuccess { producto ->
                _uiState.update { it.copy(isLoadingProductos = false) }
                if (producto.activo && producto.stockActual > 0) {
                    addToCart(producto)
                    _uiState.update { it.copy(scannerMessage = "✓ ${producto.nombre} agregado al carrito") }
                } else {
                    _uiState.update { it.copy(scannerMessage = "Sin stock: ${producto.nombre}") }
                }
            }.onFailure {
                _uiState.update { it.copy(isLoadingProductos = false, scannerMessage = "Código no encontrado: $codigo") }
            }
        }
    }

    fun clearScannerMessage() {
        _uiState.update { it.copy(scannerMessage = null) }
    }
}
