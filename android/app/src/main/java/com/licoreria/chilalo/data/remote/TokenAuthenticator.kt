package com.licoreria.chilalo.data.remote

import com.google.gson.Gson
import com.google.gson.JsonParser
import com.licoreria.chilalo.data.local.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import javax.inject.Singleton

/**
 * Ante 401, intenta renovar el access token con el refresh token.
 * Si falla el refresh, limpia tokens para que el usuario vuelva a la pantalla de login.
 */
@Singleton
class TokenAuthenticator constructor(
    private val tokenManager: TokenManager,
    private val authClient: OkHttpClient,
    private val gson: Gson,
    private val baseUrl: String
) : Authenticator {

    override fun authenticate(route: okhttp3.Route?, response: Response): Request? {
        val refreshToken = runBlocking { tokenManager.getRefreshToken() }
            ?: run {
                runBlocking { tokenManager.clearTokens() }
                return null
            }

        val body = gson.toJson(mapOf("refreshToken" to refreshToken))
            .toRequestBody("application/json".toMediaType())
        val refreshRequest = Request.Builder()
            .url("${baseUrl}auth/refresh")
            .post(body)
            .build()

        val refreshResponse = authClient.newCall(refreshRequest).execute()
        if (!refreshResponse.isSuccessful) {
            runBlocking { tokenManager.clearTokens() }
            return null
        }

        val bodyStr = refreshResponse.body?.string() ?: run {
            runBlocking { tokenManager.clearTokens() }
            return null
        }

        val data = try {
            JsonParser().parse(bodyStr).asJsonObject.getAsJsonObject("data")
        } catch (_: Exception) {
            runBlocking { tokenManager.clearTokens() }
            return null
        } ?: run {
            runBlocking { tokenManager.clearTokens() }
            return null
        }

        val newAccess = data.get("accessToken")?.asString ?: run {
            runBlocking { tokenManager.clearTokens() }
            return null
        }
        val newRefresh = data.get("refreshToken")?.asString ?: refreshToken

        runBlocking { tokenManager.saveTokens(accessToken = newAccess, refreshToken = newRefresh) }

        return response.request.newBuilder()
            .removeHeader("Authorization")
            .addHeader("Authorization", "Bearer $newAccess")
            .build()
    }
}
