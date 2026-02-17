package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.local.TokenManager
import com.licoreria.chilalo.data.remote.AuthApi
import com.licoreria.chilalo.data.remote.LoginRequestDto
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val tokenManager: TokenManager
) {
    val isLoggedIn: Flow<Boolean> = tokenManager.accessTokenFlow.map { token ->
        !token.isNullOrBlank()
    }

    suspend fun login(username: String, password: String): Result<Unit> {
        return try {
            val response = authApi.login(LoginRequestDto(username = username, password = password))
            if (response.success && response.data != null) {
                tokenManager.saveTokens(
                    accessToken = response.data.accessToken,
                    refreshToken = response.data.refreshToken
                )
                Result.success(Unit)
            } else {
                val msg = response.error?.message ?: response.message ?: "Error al iniciar sesión"
                Result.failure(Exception(msg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        try {
            authApi.logout()
        } catch (_: Exception) { }
        tokenManager.clearTokens()
    }
}
