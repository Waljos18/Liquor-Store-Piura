package com.licoreria.chilalo.data.remote

import retrofit2.http.GET

interface CategoriaApi {

    @GET("categorias")
    suspend fun getCategorias(): ApiResponse<List<CategoriaDto>>
}
