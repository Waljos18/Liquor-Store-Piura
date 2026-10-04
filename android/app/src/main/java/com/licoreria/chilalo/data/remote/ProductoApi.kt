package com.licoreria.chilalo.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ProductoApi {

    @GET("productos")
    suspend fun getProductos(
        @Query("search") search: String? = null,
        @Query("categoriaId") categoriaId: Long? = null,
        @Query("activo") activo: Boolean? = null,
        @Query("stockBajo") stockBajo: Boolean? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): ApiResponse<PagedData<ProductoDto>>

    @GET("productos/buscar")
    suspend fun buscarProductos(
        @Query("q") query: String
    ): ApiResponse<List<ProductoDto>>

    @GET("productos/barcode/{codigo}")
    suspend fun buscarPorBarcode(
        @Path("codigo") codigo: String
    ): ApiResponse<ProductoDto>

    @GET("productos/{id}")
    suspend fun getProducto(
        @Path("id") id: Long
    ): ApiResponse<ProductoDto>

    @POST("productos")
    suspend fun crearProducto(
        @Body dto: CrearProductoRequestDto
    ): ApiResponse<ProductoDto>

    @PUT("productos/{id}")
    suspend fun actualizarProducto(
        @Path("id") id: Long,
        @Body dto: CrearProductoRequestDto
    ): ApiResponse<ProductoDto>
}
