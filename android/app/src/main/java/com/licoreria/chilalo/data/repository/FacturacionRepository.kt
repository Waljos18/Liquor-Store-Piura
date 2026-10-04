package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.ComprobanteDto
import com.licoreria.chilalo.data.remote.ComprobanteEmitidoDto
import com.licoreria.chilalo.data.remote.EmitirBoletaRequestDto
import com.licoreria.chilalo.data.remote.EmitirFacturaRequestDto
import com.licoreria.chilalo.data.remote.FacturacionApi
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FacturacionRepository @Inject constructor(
    private val api: FacturacionApi
) {
    suspend fun emitirBoleta(req: EmitirBoletaRequestDto): Result<ComprobanteEmitidoDto> = try {
        val resp = api.emitirBoleta(req)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: resp.message ?: "Error al emitir boleta"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun emitirFactura(req: EmitirFacturaRequestDto): Result<ComprobanteEmitidoDto> = try {
        val resp = api.emitirFactura(req)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: resp.message ?: "Error al emitir factura"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getComprobantePorVenta(ventaId: Long): Result<ComprobanteDto?> = try {
        val resp = api.getComprobantePorVenta(ventaId)
        if (resp.success) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al obtener comprobante"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
