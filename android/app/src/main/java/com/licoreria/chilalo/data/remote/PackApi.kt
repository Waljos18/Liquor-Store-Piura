package com.licoreria.chilalo.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface PackApi {

    @GET("packs/buscar")
    suspend fun buscarPacks(
        @Query("q") q: String
    ): ApiResponse<List<PackDto>>

    @GET("packs")
    suspend fun getPacks(
        @Query("soloActivos") soloActivos: Boolean? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 100
    ): ApiResponse<PagedData<PackDto>>
}
