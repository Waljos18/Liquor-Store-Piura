package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.InventarioApi
import com.licoreria.chilalo.data.remote.ProductoDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class InventarioRepository @Inject constructor(
    private val api: InventarioApi
) {
    suspend fun getStockBajo(): Result<List<ProductoDto>> = try {
        val resp = api.getStockBajo()
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar alertas"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getProximosVencer(): Result<List<ProductoDto>> = try {
        val resp = api.getProximosVencer()
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar vencimientos"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
