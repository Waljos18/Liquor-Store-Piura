package com.licoreria.chilalo.data.remote

import retrofit2.http.GET

interface DashboardApi {

    @GET("reportes/dashboard")
    suspend fun getDashboard(): ApiResponse<DashboardDto>
}
