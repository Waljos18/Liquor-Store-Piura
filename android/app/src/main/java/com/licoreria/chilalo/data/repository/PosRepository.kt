package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.ClienteApi
import com.licoreria.chilalo.data.remote.ClienteDto
import com.licoreria.chilalo.data.remote.CrearVentaRequestDto
import com.licoreria.chilalo.data.remote.ProductoApi
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.data.remote.VentaApi
import com.licoreria.chilalo.data.remote.VentaDto
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PosRepository @Inject constructor(
    private val ventaApi: VentaApi,
    private val productoApi: ProductoApi,
    private val clienteApi: ClienteApi
) {
    suspend fun getProductos(
        search: String? = null,
        categoriaId: Long? = null,
        size: Int = 40
    ): Result<List<ProductoDto>> = try {
        val resp = productoApi.getProductos(
            search = search?.takeIf { it.isNotBlank() },
            categoriaId = categoriaId,
            activo = true,
            page = 0,
            size = size
        )
        if (resp.success && resp.data != null) Result.success(resp.data.content)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar productos"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun buscarClientes(search: String): Result<List<ClienteDto>> = try {
        val resp = clienteApi.getClientes(search = search, page = 0, size = 20)
        if (resp.success && resp.data != null) Result.success(resp.data.content)
        else Result.failure(Exception(resp.error?.message ?: "Error al buscar clientes"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun buscarPorBarcode(codigo: String): Result<ProductoDto> = try {
        val resp = productoApi.buscarPorBarcode(codigo)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Producto no encontrado"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun crearVenta(request: CrearVentaRequestDto): Result<VentaDto> = try {
        val resp = ventaApi.crearVenta(request)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: resp.message ?: "Error al crear venta"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
