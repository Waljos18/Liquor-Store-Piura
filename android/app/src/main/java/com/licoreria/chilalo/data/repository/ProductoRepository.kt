package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.CrearProductoRequestDto
import com.licoreria.chilalo.data.remote.PagedData
import com.licoreria.chilalo.data.remote.ProductoApi
import com.licoreria.chilalo.data.remote.ProductoDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProductoRepository @Inject constructor(
    private val api: ProductoApi
) {
    suspend fun getProductos(
        search: String? = null,
        categoriaId: Long? = null,
        activo: Boolean? = true,
        page: Int = 0,
        size: Int = 20
    ): Result<PagedData<ProductoDto>> = try {
        val resp = api.getProductos(search = search, categoriaId = categoriaId, activo = activo, page = page, size = size)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar productos"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun buscarPorBarcode(codigo: String): Result<ProductoDto> = try {
        val resp = api.buscarPorBarcode(codigo)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Producto no encontrado"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun crearProducto(dto: CrearProductoRequestDto): Result<ProductoDto> = try {
        val resp = api.crearProducto(dto)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al crear producto"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun actualizarProducto(id: Long, dto: CrearProductoRequestDto): Result<ProductoDto> = try {
        val resp = api.actualizarProducto(id, dto)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al actualizar producto"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
