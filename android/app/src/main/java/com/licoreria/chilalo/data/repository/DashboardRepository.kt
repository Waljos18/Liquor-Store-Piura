package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.DashboardApi
import com.licoreria.chilalo.data.remote.DashboardDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DashboardRepository @Inject constructor(
    private val api: DashboardApi
) {
    suspend fun getDashboard(): Result<DashboardDto> = try {
        val resp = api.getDashboard()
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar dashboard"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
