package com.licoreria.chilalo.ui.inventario

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.data.repository.InventarioRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class InventarioTab { STOCK_BAJO, VENCIMIENTO }

data class InventarioUiState(
    val isLoading: Boolean = false,
    val tab: InventarioTab = InventarioTab.STOCK_BAJO,
    val stockBajo: List<ProductoDto> = emptyList(),
    val proximosVencer: List<ProductoDto> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class InventarioViewModel @Inject constructor(
    private val repository: InventarioRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(InventarioUiState())
    val uiState = _uiState.asStateFlow()

    init {
        load()
    }

    fun setTab(tab: InventarioTab) {
        _uiState.update { it.copy(tab = tab) }
        if (tab == InventarioTab.STOCK_BAJO && _uiState.value.stockBajo.isEmpty()) loadStockBajo()
        if (tab == InventarioTab.VENCIMIENTO && _uiState.value.proximosVencer.isEmpty()) loadVencimiento()
    }

    fun load() {
        loadStockBajo()
        loadVencimiento()
    }

    private fun loadStockBajo() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            repository.getStockBajo()
                .onSuccess { data ->
                    _uiState.update { it.copy(isLoading = false, stockBajo = data) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    private fun loadVencimiento() {
        viewModelScope.launch {
            repository.getProximosVencer()
                .onSuccess { data ->
                    _uiState.update { it.copy(proximosVencer = data) }
                }
                .onFailure { }
        }
    }
}
