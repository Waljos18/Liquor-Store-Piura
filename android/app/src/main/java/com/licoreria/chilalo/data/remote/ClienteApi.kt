package com.licoreria.chilalo.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ClienteApi {

    @GET("clientes")
    suspend fun getClientes(
        @Query("search") search: String? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): ApiResponse<PagedData<ClienteDto>>

    @GET("clientes/{id}")
    suspend fun getCliente(@Path("id") id: Long): ApiResponse<ClienteDto>

    @GET("clientes/documento/{numeroDocumento}")
    suspend fun getClientePorDocumento(
        @Path("numeroDocumento") numeroDocumento: String
    ): ApiResponse<ClienteDto>

    @POST("clientes")
    suspend fun crearCliente(@Body dto: ClienteDto): ApiResponse<ClienteDto>

    @PUT("clientes/{id}")
    suspend fun actualizarCliente(
        @Path("id") id: Long,
        @Body dto: ClienteDto
    ): ApiResponse<ClienteDto>
}
