package com.licoreria.chilalo.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface FacturacionApi {

    @POST("facturacion/emitir-boleta")
    suspend fun emitirBoleta(@Body request: EmitirBoletaRequestDto): ApiResponse<ComprobanteEmitidoDto>

    @POST("facturacion/emitir-factura")
    suspend fun emitirFactura(@Body request: EmitirFacturaRequestDto): ApiResponse<ComprobanteEmitidoDto>

    @GET("facturacion/comprobantes/por-venta/{ventaId}")
    suspend fun getComprobantePorVenta(@Path("ventaId") ventaId: Long): ApiResponse<ComprobanteDto>
}
