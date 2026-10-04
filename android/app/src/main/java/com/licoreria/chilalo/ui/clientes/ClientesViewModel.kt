package com.licoreria.chilalo.ui.clientes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.remote.ClienteDto
import com.licoreria.chilalo.data.repository.ClienteRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ClientesUiState(
    // Lista
    val isLoading: Boolean = false,
    val clientes: List<ClienteDto> = emptyList(),
    val search: String = "",
    val page: Int = 0,
    val totalPages: Int = 0,
    val error: String? = null,
    // Formulario crear/editar
    val showForm: Boolean = false,
    val clienteEditando: ClienteDto? = null,   // null = nuevo cliente
    val formTipoDoc: String = "DNI",
    val formNumDoc: String = "",
    val formNombre: String = "",
    val formTelefono: String = "",
    val formEmail: String = "",
    val isSaving: Boolean = false,
    val saveError: String? = null
) {
    val esEdicion: Boolean get() = clienteEditando != null
}

@HiltViewModel
class ClientesViewModel @Inject constructor(
    private val repository: ClienteRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ClientesUiState())
    val uiState = _uiState.asStateFlow()

    private var searchJob: Job? = null

    init {
        load()
    }

    // ── Lista + búsqueda ───────────────────────────────────────────────────────

    fun load(page: Int = 0) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val search = _uiState.value.search.takeIf { it.isNotBlank() }
            repository.getClientes(search = search, page = page)
                .onSuccess { data ->
                    val clientes = if (page == 0) data.content
                    else _uiState.value.clientes + data.content
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            clientes = clientes,
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

    fun onSearchChange(query: String) {
        _uiState.update { it.copy(search = query) }
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            delay(400)
            load(page = 0)
        }
    }

    fun loadNextPage() {
        val state = _uiState.value
        if (!state.isLoading && state.page + 1 < state.totalPages) {
            load(page = state.page + 1)
        }
    }

    // ── Formulario crear/editar ────────────────────────────────────────────────

    fun abrirCrear() {
        _uiState.update {
            it.copy(
                showForm = true,
                clienteEditando = null,
                formTipoDoc = "DNI",
                formNumDoc = "",
                formNombre = "",
                formTelefono = "",
                formEmail = "",
                saveError = null
            )
        }
    }

    fun abrirEditar(cliente: ClienteDto) {
        _uiState.update {
            it.copy(
                showForm = true,
                clienteEditando = cliente,
                formTipoDoc = cliente.tipoDocumento.ifBlank { "DNI" },
                formNumDoc = cliente.numeroDocumento,
                formNombre = cliente.nombre,
                formTelefono = cliente.telefono ?: "",
                formEmail = cliente.email ?: "",
                saveError = null
            )
        }
    }

    fun cerrarForm() {
        _uiState.update { it.copy(showForm = false, saveError = null) }
    }

    fun onFormTipoDocChange(v: String) { _uiState.update { it.copy(formTipoDoc = v) } }
    fun onFormNumDocChange(v: String) { _uiState.update { it.copy(formNumDoc = v) } }
    fun onFormNombreChange(v: String) { _uiState.update { it.copy(formNombre = v) } }
    fun onFormTelefonoChange(v: String) { _uiState.update { it.copy(formTelefono = v) } }
    fun onFormEmailChange(v: String) { _uiState.update { it.copy(formEmail = v) } }

    fun guardar() {
        val state = _uiState.value
        if (state.formNumDoc.isBlank() || state.formNombre.isBlank()) {
            _uiState.update { it.copy(saveError = "Número de documento y nombre son obligatorios") }
            return
        }

        val dto = ClienteDto(
            id = state.clienteEditando?.id ?: 0,
            tipoDocumento = state.formTipoDoc,
            numeroDocumento = state.formNumDoc.trim(),
            nombre = state.formNombre.trim(),
            telefono = state.formTelefono.trim().takeIf { it.isNotBlank() },
            email = state.formEmail.trim().takeIf { it.isNotBlank() },
            puntosFidelizacion = state.clienteEditando?.puntosFidelizacion ?: 0
        )

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, saveError = null) }
            val result = if (state.esEdicion) {
                repository.actualizarCliente(state.clienteEditando!!.id, dto)
            } else {
                repository.crearCliente(dto)
            }
            result.onSuccess { clienteGuardado ->
                _uiState.update { it.copy(isSaving = false, showForm = false) }
                // Actualizar lista localmente sin recargar toda la red
                if (state.esEdicion) {
                    _uiState.update { s ->
                        s.copy(clientes = s.clientes.map { c ->
                            if (c.id == clienteGuardado.id) clienteGuardado else c
                        })
                    }
                } else {
                    // Recarga página 0 para incluir el nuevo cliente
                    load(page = 0)
                }
            }.onFailure { e ->
                _uiState.update { it.copy(isSaving = false, saveError = e.message) }
            }
        }
    }
}
