package com.licoreria.chilalo.ui.productos

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.remote.CategoriaDto
import com.licoreria.chilalo.data.remote.CrearProductoRequestDto
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.data.repository.CategoriaRepository
import com.licoreria.chilalo.data.repository.ProductoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class ScannerTarget { BARCODE_FIELD, SEARCH }

data class ProductosUiState(
    val isLoading: Boolean = false,
    val productos: List<ProductoDto> = emptyList(),
    val categorias: List<CategoriaDto> = emptyList(),
    val search: String = "",
    val page: Int = 0,
    val totalPages: Int = 0,
    val totalElements: Long = 0,
    val error: String? = null,
    val successMessage: String? = null,
    // Editor (crear / editar)
    val showEditor: Boolean = false,
    val editingProducto: ProductoDto? = null,
    val isSaving: Boolean = false,
    val edCodigoBarras: String = "",
    val edNombre: String = "",
    val edMarca: String = "",
    val edCategoriaId: Long? = null,
    val edPrecioVenta: String = "",
    val edPrecioCompra: String = "",
    val edStock: String = "0",
    val edStockMinimo: String = "0",
    val edFechaVenc: String = "",
    // Scanner
    val showScanner: Boolean = false,
    val scannerTarget: ScannerTarget = ScannerTarget.BARCODE_FIELD
)

@OptIn(FlowPreview::class)
@HiltViewModel
class ProductosViewModel @Inject constructor(
    private val repository: ProductoRepository,
    private val categoriaRepository: CategoriaRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProductosUiState())
    val uiState = _uiState.asStateFlow()

    private val _searchFlow = MutableStateFlow("")

    init {
        cargarCategorias()
        load()
        viewModelScope.launch {
            _searchFlow.debounce(400).distinctUntilChanged().collect { load(page = 0) }
        }
    }

    private fun cargarCategorias() {
        viewModelScope.launch {
            categoriaRepository.getCategorias().onSuccess { cats ->
                _uiState.update { it.copy(categorias = cats) }
            }
        }
    }

    fun load(page: Int = 0) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            repository.getProductos(
                search = _uiState.value.search.takeIf { it.isNotBlank() },
                activo = null,
                page = page,
                size = 20
            ).onSuccess { data ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        productos = data.content,
                        page = data.number,
                        totalPages = data.totalPages,
                        totalElements = data.totalElements
                    )
                }
            }.onFailure { e ->
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun onSearchChange(query: String) {
        _uiState.update { it.copy(search = query) }
        _searchFlow.value = query
    }

    fun loadNextPage() {
        val s = _uiState.value
        if (!s.isLoading && s.page + 1 < s.totalPages) load(page = s.page + 1)
    }

    // ── Editor ─────────────────────────────────────────────────────────────────

    fun openCrear() {
        _uiState.update {
            it.copy(
                showEditor = true, editingProducto = null,
                edCodigoBarras = "", edNombre = "", edMarca = "",
                edCategoriaId = null, edPrecioVenta = "", edPrecioCompra = "",
                edStock = "0", edStockMinimo = "0", edFechaVenc = ""
            )
        }
    }

    fun openEditar(producto: ProductoDto) {
        _uiState.update {
            it.copy(
                showEditor = true,
                editingProducto = producto,
                edCodigoBarras = producto.codigoBarras ?: "",
                edNombre = producto.nombre,
                edMarca = producto.marca ?: "",
                edCategoriaId = producto.categoriaId,
                edPrecioVenta = producto.precioVenta.toString(),
                edPrecioCompra = "",
                edStock = producto.stockActual.toString(),
                edStockMinimo = (producto.stockMinimo ?: 0).toString(),
                edFechaVenc = producto.fechaVencimiento ?: ""
            )
        }
    }

    fun closeEditor() {
        _uiState.update { it.copy(showEditor = false, editingProducto = null) }
    }

    fun onEdCodigoBarrasChange(v: String) = _uiState.update { it.copy(edCodigoBarras = v) }
    fun onEdNombreChange(v: String) = _uiState.update { it.copy(edNombre = v) }
    fun onEdMarcaChange(v: String) = _uiState.update { it.copy(edMarca = v) }
    fun onEdCategoriaChange(id: Long?) = _uiState.update { it.copy(edCategoriaId = id) }
    fun onEdPrecioVentaChange(v: String) = _uiState.update { it.copy(edPrecioVenta = v) }
    fun onEdPrecioCompraChange(v: String) = _uiState.update { it.copy(edPrecioCompra = v) }
    fun onEdStockChange(v: String) = _uiState.update { it.copy(edStock = v) }
    fun onEdStockMinimoChange(v: String) = _uiState.update { it.copy(edStockMinimo = v) }
    fun onEdFechaVencChange(v: String) = _uiState.update { it.copy(edFechaVenc = v) }

    fun guardarProducto() {
        val s = _uiState.value
        if (s.edNombre.isBlank()) {
            _uiState.update { it.copy(error = "El nombre es obligatorio") }
            return
        }
        val precio = s.edPrecioVenta.toDoubleOrNull()
        if (precio == null || precio <= 0) {
            _uiState.update { it.copy(error = "Precio de venta inválido") }
            return
        }
        val dto = CrearProductoRequestDto(
            codigoBarras = s.edCodigoBarras.takeIf { it.isNotBlank() },
            nombre = s.edNombre.trim(),
            marca = s.edMarca.takeIf { it.isNotBlank() },
            categoriaId = s.edCategoriaId,
            precioVenta = precio,
            precioCompra = s.edPrecioCompra.toDoubleOrNull(),
            stockInicial = s.edStock.toIntOrNull() ?: 0,
            stockMinimo = s.edStockMinimo.toIntOrNull() ?: 0,
            fechaVencimiento = s.edFechaVenc.takeIf { it.isNotBlank() }
        )
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }
            val result = if (s.editingProducto != null)
                repository.actualizarProducto(s.editingProducto.id, dto)
            else
                repository.crearProducto(dto)

            result.onSuccess {
                _uiState.update {
                    it.copy(
                        isSaving = false, showEditor = false,
                        successMessage = if (s.editingProducto != null) "Producto actualizado" else "Producto creado"
                    )
                }
                load(page = 0)
            }.onFailure { e ->
                _uiState.update { it.copy(isSaving = false, error = e.message) }
            }
        }
    }

    // ── Scanner ─────────────────────────────────────────────────────────────────

    fun openScanner(target: ScannerTarget = ScannerTarget.BARCODE_FIELD) {
        _uiState.update { it.copy(showScanner = true, scannerTarget = target) }
    }

    fun closeScanner() {
        _uiState.update { it.copy(showScanner = false) }
    }

    fun onBarcodeScanned(codigo: String) {
        val target = _uiState.value.scannerTarget
        _uiState.update { it.copy(showScanner = false) }
        when (target) {
            ScannerTarget.SEARCH -> onSearchChange(codigo)
            ScannerTarget.BARCODE_FIELD -> {
                _uiState.update { it.copy(edCodigoBarras = codigo) }
                // Intentar auto-completar si el producto ya existe
                viewModelScope.launch {
                    repository.buscarPorBarcode(codigo).onSuccess { producto ->
                        openEditar(producto)
                        _uiState.update { it.copy(successMessage = "Producto encontrado: ${producto.nombre}") }
                    }
                    // Si no existe, solo el código queda en el campo
                }
            }
        }
    }

    fun dismissError() = _uiState.update { it.copy(error = null) }
    fun dismissSuccess() = _uiState.update { it.copy(successMessage = null) }
}
