package com.licoreria.chilalo.data.remote

import retrofit2.http.GET

interface FidelizacionApi {
    @GET("fidelizacion/config")
    suspend fun getConfig(): ApiResponse<ConfigFidelizacionDto>
}
