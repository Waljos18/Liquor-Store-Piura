package com.licoreria.chilalo.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface VentaApi {

    @POST("ventas")
    suspend fun crearVenta(@Body request: CrearVentaRequestDto): ApiResponse<VentaDto>

    @GET("ventas")
    suspend fun getVentas(
        @Query("fechaDesde") fechaDesde: String? = null,
        @Query("fechaHasta") fechaHasta: String? = null,
        @Query("estado") estado: String? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): ApiResponse<PagedData<VentaDto>>

    @GET("ventas/{id}")
    suspend fun getVenta(@Path("id") id: Long): ApiResponse<VentaDto>
}
