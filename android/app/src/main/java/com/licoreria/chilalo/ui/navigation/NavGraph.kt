package com.licoreria.chilalo.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.licoreria.chilalo.data.repository.AuthRepository
import com.licoreria.chilalo.ui.dashboard.HomeScreen
import com.licoreria.chilalo.ui.login.LoginScreen
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@Composable
fun ChilaloNavGraph(
    authRepository: AuthRepository,
    scope: CoroutineScope,
    onLogout: () -> Unit = {}
) {
    val isLoggedIn by authRepository.isLoggedIn.collectAsState(initial = null)

    when (isLoggedIn) {
        null -> Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        true -> HomeScreen(
            onLogout = {
                scope.launch { authRepository.logout() }
            }
        )
        false -> LoginScreen(
            onNavigateToHome = { /* El Flow isLoggedIn se actualiza al guardar token */ }
        )
    }
}
