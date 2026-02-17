package com.licoreria.chilalo.data.remote

import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequestDto): ApiResponse<LoginResponseDto>

    @POST("auth/refresh")
    suspend fun refresh(@Body body: Map<String, String>): ApiResponse<RefreshResponseDto>

    @POST("auth/logout")
    suspend fun logout(): ApiResponse<Unit>
}

data class LoginRequestDto(
    val username: String,
    val password: String
)

data class LoginResponseDto(
    val accessToken: String,
    val refreshToken: String,
    val tokenType: String,
    val expiresIn: Long,
    val user: UserInfoDto
)

data class UserInfoDto(
    val id: Long,
    val username: String,
    val email: String?,
    val nombre: String?,
    val rol: String?
)

data class RefreshResponseDto(
    val accessToken: String,
    val expiresIn: Long
)
