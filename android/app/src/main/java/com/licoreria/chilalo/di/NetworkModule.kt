package com.licoreria.chilalo.di

import com.licoreria.chilalo.data.local.ServerConfig
import com.licoreria.chilalo.data.local.TokenManager
import com.licoreria.chilalo.data.remote.AuthApi
import com.licoreria.chilalo.data.remote.TokenAuthenticator
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import kotlinx.coroutines.runBlocking
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton
import com.google.gson.Gson

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideGson(): Gson = Gson()

    @Provides
    @Singleton
    @Named("auth")
    fun provideAuthOkHttpClient(): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        return OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideTokenAuthenticator(
        tokenManager: TokenManager,
        @Named("auth") authClient: OkHttpClient,
        gson: Gson,
        serverConfig: ServerConfig
    ): TokenAuthenticator = TokenAuthenticator(
        tokenManager = tokenManager,
        authClient = authClient,
        gson = gson,
        baseUrl = serverConfig.getBaseUrl()
    )

    @Provides
    @Singleton
    @Named("api")
    fun provideApiOkHttpClient(
        tokenManager: TokenManager,
        tokenAuthenticator: TokenAuthenticator
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        return OkHttpClient.Builder()
            .addInterceptor { chain ->
                val token = runBlocking { tokenManager.getAccessToken() }
                val request = if (!token.isNullOrBlank()) {
                    chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                } else {
                    chain.request()
                }
                chain.proceed(request)
            }
            .authenticator(tokenAuthenticator)
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    @Named("auth")
    fun provideAuthRetrofit(
        @Named("auth") authClient: OkHttpClient,
        serverConfig: ServerConfig
    ): Retrofit = Retrofit.Builder()
        .baseUrl(serverConfig.getBaseUrl())
        .client(authClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    @Named("api")
    fun provideApiRetrofit(
        @Named("api") apiClient: OkHttpClient,
        serverConfig: ServerConfig
    ): Retrofit = Retrofit.Builder()
        .baseUrl(serverConfig.getBaseUrl())
        .client(apiClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    fun provideAuthApi(@Named("auth") retrofit: Retrofit): AuthApi =
        retrofit.create(AuthApi::class.java)
}
