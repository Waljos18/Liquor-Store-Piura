package com.licoreria.chilalo.ui.ventas

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.remote.ComprobanteDto
import com.licoreria.chilalo.data.remote.EmitirBoletaRequestDto
import com.licoreria.chilalo.data.remote.EmitirFacturaRequestDto
import com.licoreria.chilalo.data.remote.VentaDto
import com.licoreria.chilalo.data.repository.FacturacionRepository
import com.licoreria.chilalo.data.repository.VentaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

enum class VentasFiltro(val label: String, val days: Long?) {
    HOY("Hoy", 0),
    SIETE("7 días", 7),
    TREINTA("30 días", 30),
    TODO("Todos", null)
}

enum class ComprobanteDialogTipo { BOLETA, FACTURA }

data class VentasUiState(
    val isLoading: Boolean = false,
    val ventas: List<VentaDto> = emptyList(),
    val filtro: VentasFiltro = VentasFiltro.HOY,
    val page: Int = 0,
    val totalPages: Int = 0,
    val error: String? = null,
    // Detalle de venta seleccionada
    val ventaSeleccionada: VentaDto? = null,
    val showDetalle: Boolean = false,
    val isLoadingDetalle: Boolean = false,
    // Comprobante
    val comprobanteExistente: ComprobanteDto? = null,
    val isLoadingComprobante: Boolean = false,
    val showComprobanteDialog: ComprobanteDialogTipo? = null,
    val isEmitiendo: Boolean = false,
    val emitirError: String? = null,
    val emitirSuccess: String? = null,
    // Campos formulario
    val emitirTipoDoc: String = "DNI",
    val emitirNumDoc: String = "",
    val emitirNombre: String = "",
    val emitirRuc: String = "",
    val emitirRazonSocial: String = ""
)

@HiltViewModel
class VentasViewModel @Inject constructor(
    private val repository: VentaRepository,
    private val facturacionRepository: FacturacionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(VentasUiState())
    val uiState = _uiState.asStateFlow()

    private val fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    init {
        load()
    }

    fun setFiltro(filtro: VentasFiltro) {
        _uiState.update { it.copy(filtro = filtro) }
        load(page = 0)
    }

    fun load(page: Int = 0) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val filtro = _uiState.value.filtro
            val hoy = LocalDate.now()
            val fechaDesde = when {
                filtro.days == null -> null
                filtro.days == 0L -> "${hoy.format(fmt)}T00:00:00Z"
                else -> "${hoy.minusDays(filtro.days).format(fmt)}T00:00:00Z"
            }
            val fechaHasta = if (filtro.days != null) "${hoy.format(fmt)}T23:59:59Z" else null

            repository.getVentas(
                fechaDesde = fechaDesde,
                fechaHasta = fechaHasta,
                page = page
            )
                .onSuccess { data ->
                    val ventas = if (page == 0) data.content
                    else _uiState.value.ventas + data.content
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            ventas = ventas,
                            page = page,
                            totalPages = data.totalPages
                        )
                    }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun loadNextPage() {
        val state = _uiState.value
        if (!state.isLoading && state.page + 1 < state.totalPages) {
            load(page = state.page + 1)
        }
    }

    // ── Detalle de venta ────────────────────────────────────────────────────────

    fun onVentaClick(venta: VentaDto) {
        val cliente = venta.cliente
        _uiState.update {
            it.copy(
                ventaSeleccionada = venta,
                showDetalle = true,
                comprobanteExistente = null,
                emitirSuccess = null,
                emitirError = null,
                showComprobanteDialog = null,
                emitirTipoDoc = cliente?.tipoDocumento?.takeIf { t -> t.isNotBlank() } ?: "DNI",
                emitirNumDoc = cliente?.numeroDocumento ?: "",
                emitirNombre = cliente?.nombre ?: "",
                emitirRuc = if (cliente?.tipoDocumento == "RUC") cliente.numeroDocumento else "",
                emitirRazonSocial = if (cliente?.tipoDocumento == "RUC") cliente.nombre else ""
            )
        }
        // Cargar detalles si no están cargados aún
        if (venta.detalles.isNullOrEmpty()) {
            cargarDetalle(venta.id)
        }
        cargarComprobante(venta.id)
    }

    fun dismissDetalle() {
        _uiState.update { it.copy(showDetalle = false, ventaSeleccionada = null) }
    }

    private fun cargarDetalle(ventaId: Long) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingDetalle = true) }
            repository.getVentaDetalle(ventaId).onSuccess { ventaDetallada ->
                _uiState.update { it.copy(ventaSeleccionada = ventaDetallada, isLoadingDetalle = false) }
            }.onFailure {
                _uiState.update { it.copy(isLoadingDetalle = false) }
            }
        }
    }

    private fun cargarComprobante(ventaId: Long) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingComprobante = true) }
            facturacionRepository.getComprobantePorVenta(ventaId).onSuccess { comp ->
                _uiState.update { it.copy(comprobanteExistente = comp, isLoadingComprobante = false) }
            }.onFailure {
                _uiState.update { it.copy(isLoadingComprobante = false) }
            }
        }
    }

    // ── Comprobante ─────────────────────────────────────────────────────────────

    fun showEmitirBoleta() {
        _uiState.update { it.copy(showComprobanteDialog = ComprobanteDialogTipo.BOLETA, emitirError = null) }
    }

    fun showEmitirFactura() {
        _uiState.update { it.copy(showComprobanteDialog = ComprobanteDialogTipo.FACTURA, emitirError = null) }
    }

    fun dismissComprobanteDialog() {
        _uiState.update { it.copy(showComprobanteDialog = null, emitirError = null) }
    }

    fun onEmitirTipoDocChange(v: String) { _uiState.update { it.copy(emitirTipoDoc = v) } }
    fun onEmitirNumDocChange(v: String) { _uiState.update { it.copy(emitirNumDoc = v) } }
    fun onEmitirNombreChange(v: String) { _uiState.update { it.copy(emitirNombre = v) } }
    fun onEmitirRucChange(v: String) { _uiState.update { it.copy(emitirRuc = v) } }
    fun onEmitirRazonSocialChange(v: String) { _uiState.update { it.copy(emitirRazonSocial = v) } }

    fun emitirBoleta() {
        val state = _uiState.value
        val ventaId = state.ventaSeleccionada?.id ?: return
        if (state.emitirNumDoc.isBlank() || state.emitirNombre.isBlank()) {
            _uiState.update { it.copy(emitirError = "Completa todos los campos") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isEmitiendo = true, emitirError = null) }
            facturacionRepository.emitirBoleta(
                EmitirBoletaRequestDto(
                    ventaId = ventaId,
                    tipoDocumento = state.emitirTipoDoc,
                    numeroDocumento = state.emitirNumDoc,
                    nombre = state.emitirNombre
                )
            ).onSuccess { comp ->
                val numComp = listOfNotNull(comp.serie, comp.numero).joinToString("-").takeIf { it.isNotBlank() }
                _uiState.update {
                    it.copy(
                        isEmitiendo = false,
                        showComprobanteDialog = null,
                        emitirSuccess = "Boleta emitida${if (numComp != null) ": $numComp" else ""}"
                    )
                }
                // Recargar comprobante
                cargarComprobante(ventaId)
            }.onFailure { e ->
                _uiState.update { it.copy(isEmitiendo = false, emitirError = e.message) }
            }
        }
    }

    fun emitirFactura() {
        val state = _uiState.value
        val ventaId = state.ventaSeleccionada?.id ?: return
        if (state.emitirRuc.isBlank() || state.emitirRazonSocial.isBlank()) {
            _uiState.update { it.copy(emitirError = "Completa todos los campos") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isEmitiendo = true, emitirError = null) }
            facturacionRepository.emitirFactura(
                EmitirFacturaRequestDto(
                    ventaId = ventaId,
                    numeroDocumento = state.emitirRuc,
                    razonSocial = state.emitirRazonSocial
                )
            ).onSuccess { comp ->
                val numComp = listOfNotNull(comp.serie, comp.numero).joinToString("-").takeIf { it.isNotBlank() }
                _uiState.update {
                    it.copy(
                        isEmitiendo = false,
                        showComprobanteDialog = null,
                        emitirSuccess = "Factura emitida${if (numComp != null) ": $numComp" else ""}"
                    )
                }
                cargarComprobante(ventaId)
            }.onFailure { e ->
                _uiState.update { it.copy(isEmitiendo = false, emitirError = e.message) }
            }
        }
    }
}
