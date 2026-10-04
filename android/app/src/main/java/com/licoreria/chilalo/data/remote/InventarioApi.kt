package com.licoreria.chilalo.data.remote

import retrofit2.http.GET

interface InventarioApi {

    @GET("inventario/alertas/stock-bajo")
    suspend fun getStockBajo(): ApiResponse<List<ProductoDto>>

    @GET("inventario/alertas/vencimiento")
    suspend fun getProximosVencer(): ApiResponse<List<ProductoDto>>
}
