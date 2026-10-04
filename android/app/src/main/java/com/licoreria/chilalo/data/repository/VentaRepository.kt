package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.PagedData
import com.licoreria.chilalo.data.remote.VentaApi
import com.licoreria.chilalo.data.remote.VentaDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VentaRepository @Inject constructor(
    private val api: VentaApi
) {
    suspend fun getVentas(
        fechaDesde: String? = null,
        fechaHasta: String? = null,
        page: Int = 0,
        size: Int = 20
    ): Result<PagedData<VentaDto>> = try {
        val resp = api.getVentas(
            fechaDesde = fechaDesde,
            fechaHasta = fechaHasta,
            page = page,
            size = size
        )
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar ventas"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getVentaDetalle(id: Long): Result<VentaDto> = try {
        val resp = api.getVenta(id)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar detalle de venta"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
