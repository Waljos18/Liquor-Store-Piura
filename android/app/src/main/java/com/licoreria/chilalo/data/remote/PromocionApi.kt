package com.licoreria.chilalo.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface PromocionApi {

    @GET("promociones")
    suspend fun getPromociones(
        @Query("soloActivas") soloActivas: Boolean? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 100
    ): ApiResponse<PagedData<PromocionDto>>
}
