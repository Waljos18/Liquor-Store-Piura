package com.licoreria.chilalo.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.licoreria.chilalo.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val username: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

sealed class LoginUiEvent {
    data object NavigateToHome : LoginUiEvent()
}

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<LoginUiEvent>()
    val events = _events.asSharedFlow()

    fun updateUsername(value: String) {
        _uiState.update { it.copy(username = value, errorMessage = null) }
    }

    fun updatePassword(value: String) {
        _uiState.update { it.copy(password = value, errorMessage = null) }
    }

    fun login() {
        viewModelScope.launch {
            val state = _uiState.value
            if (state.username.isBlank() || state.password.isBlank()) {
                _uiState.update { it.copy(errorMessage = "Completa usuario y contraseña") }
                return@launch
            }
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            authRepository.login(state.username, state.password)
                .onSuccess {
                    _uiState.update { it.copy(isLoading = false) }
                    _events.emit(LoginUiEvent.NavigateToHome)
                }
                .onFailure { e ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = e.message ?: "Usuario o contraseña incorrectos"
                        )
                    }
                }
        }
    }
}
