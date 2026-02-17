package com.licoreria.chilalo.data.remote

import com.google.gson.annotations.SerializedName

/**
 * Formato estándar de respuesta del backend.
 * success, data, message, error.
 */
data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T? = null,
    @SerializedName("message") val message: String? = null,
    @SerializedName("error") val error: ErrorDetail? = null
)

data class ErrorDetail(
    @SerializedName("code") val code: String? = null,
    @SerializedName("message") val message: String? = null,
    @SerializedName("details") val details: Map<String, Any>? = null
)
