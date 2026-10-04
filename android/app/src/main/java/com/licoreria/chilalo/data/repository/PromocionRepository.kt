package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.PromocionApi
import com.licoreria.chilalo.data.remote.PromocionDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PromocionRepository @Inject constructor(
    private val promocionApi: PromocionApi
) {
    suspend fun getPromocionesActivas(): Result<List<PromocionDto>> = try {
        val resp = promocionApi.getPromociones(soloActivas = true)
        if (resp.success && resp.data != null) Result.success(resp.data.content)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar promociones"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getPromociones(soloActivas: Boolean? = null): Result<List<PromocionDto>> = try {
        val resp = promocionApi.getPromociones(soloActivas = soloActivas)
        if (resp.success && resp.data != null) Result.success(resp.data.content)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar promociones"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
