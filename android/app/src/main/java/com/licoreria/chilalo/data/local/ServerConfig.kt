package com.licoreria.chilalo.data.local

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ServerConfig @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        /**
         * IPv4 de la PC donde corre el backend (ipconfig → Wi‑Fi). Ej. 10.202.40.55
         */
        const val DEFAULT_BASE_URL = "http://10.202.40.103:8080/api/v1/"
        private const val PREFS_NAME  = "server_config"
        private const val KEY_BASE_URL = "base_url"
    }

    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    /** URL completa guardada (o default si nunca se configuró) */
    fun getBaseUrl(): String =
        prefs.getString(KEY_BASE_URL, DEFAULT_BASE_URL) ?: DEFAULT_BASE_URL

    /**
     * Acepta:
     *  - Solo IP:         "192.168.1.100"         → http://192.168.1.100:8080/api/v1/
     *  - IP:puerto:       "192.168.1.100:9090"     → http://192.168.1.100:9090/api/v1/
     *  - URL completa:    "http://192.168.1.100:8080/api/v1/"  (sin cambios)
     */
    fun setBaseUrl(input: String) {
        val trimmed = input.trim()
        val url = when {
            trimmed.startsWith("http://") || trimmed.startsWith("https://") -> {
                if (trimmed.endsWith("/")) trimmed else "$trimmed/"
            }
            trimmed.contains(":") -> "http://$trimmed/api/v1/"   // IP:puerto
            else                  -> "http://$trimmed:8080/api/v1/"
        }
        prefs.edit().putString(KEY_BASE_URL, url).apply()
    }

    /** Devuelve "host:puerto" para mostrar en la UI (ej. "192.168.1.100:8080") */
    fun getHostDisplay(): String {
        val url = getBaseUrl()
        return try {
            url.removePrefix("http://").removePrefix("https://").substringBefore("/")
        } catch (_: Exception) {
            url
        }
    }

    fun resetToDefault() {
        prefs.edit().remove(KEY_BASE_URL).apply()
    }
}
