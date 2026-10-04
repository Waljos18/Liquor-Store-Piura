package com.licoreria.chilalo.di

import com.licoreria.chilalo.data.remote.CategoriaApi
import com.licoreria.chilalo.data.remote.ClienteApi
import com.licoreria.chilalo.data.remote.DashboardApi
import com.licoreria.chilalo.data.remote.FacturacionApi
import com.licoreria.chilalo.data.remote.FidelizacionApi
import com.licoreria.chilalo.data.remote.InventarioApi
import com.licoreria.chilalo.data.remote.PackApi
import com.licoreria.chilalo.data.remote.ProductoApi
import com.licoreria.chilalo.data.remote.PromocionApi
import com.licoreria.chilalo.data.remote.VentaApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideProductoApi(@Named("api") retrofit: Retrofit): ProductoApi =
        retrofit.create(ProductoApi::class.java)

    @Provides
    @Singleton
    fun provideVentaApi(@Named("api") retrofit: Retrofit): VentaApi =
        retrofit.create(VentaApi::class.java)

    @Provides
    @Singleton
    fun provideClienteApi(@Named("api") retrofit: Retrofit): ClienteApi =
        retrofit.create(ClienteApi::class.java)

    @Provides
    @Singleton
    fun provideInventarioApi(@Named("api") retrofit: Retrofit): InventarioApi =
        retrofit.create(InventarioApi::class.java)

    @Provides
    @Singleton
    fun provideDashboardApi(@Named("api") retrofit: Retrofit): DashboardApi =
        retrofit.create(DashboardApi::class.java)

    @Provides
    @Singleton
    fun provideCategoriaApi(@Named("api") retrofit: Retrofit): CategoriaApi =
        retrofit.create(CategoriaApi::class.java)

    @Provides
    @Singleton
    fun provideFacturacionApi(@Named("api") retrofit: Retrofit): FacturacionApi =
        retrofit.create(FacturacionApi::class.java)

    @Provides
    @Singleton
    fun providePackApi(@Named("api") retrofit: Retrofit): PackApi =
        retrofit.create(PackApi::class.java)

    @Provides
    @Singleton
    fun providePromocionApi(@Named("api") retrofit: Retrofit): PromocionApi =
        retrofit.create(PromocionApi::class.java)

    @Provides
    @Singleton
    fun provideFidelizacionApi(@Named("api") retrofit: Retrofit): FidelizacionApi =
        retrofit.create(FidelizacionApi::class.java)
}
