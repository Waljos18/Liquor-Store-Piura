package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.PackApi
import com.licoreria.chilalo.data.remote.PackDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PackRepository @Inject constructor(
    private val packApi: PackApi
) {
    suspend fun buscarPacks(query: String): Result<List<PackDto>> = try {
        val resp = packApi.buscarPacks(query)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al buscar packs"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getPacks(soloActivos: Boolean = true): Result<List<PackDto>> = try {
        val resp = packApi.getPacks(soloActivos = soloActivos)
        if (resp.success && resp.data != null) Result.success(resp.data.content)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar packs"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
