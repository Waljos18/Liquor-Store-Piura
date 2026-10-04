package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.CategoriaApi
import com.licoreria.chilalo.data.remote.CategoriaDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CategoriaRepository @Inject constructor(
    private val api: CategoriaApi
) {
    suspend fun getCategorias(): Result<List<CategoriaDto>> = try {
        val resp = api.getCategorias()
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar categorías"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
