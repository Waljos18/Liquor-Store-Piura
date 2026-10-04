package com.licoreria.chilalo.data.repository

import com.licoreria.chilalo.data.remote.ClienteApi
import com.licoreria.chilalo.data.remote.ClienteDto
import com.licoreria.chilalo.data.remote.PagedData
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ClienteRepository @Inject constructor(
    private val api: ClienteApi
) {
    suspend fun getClientes(
        search: String? = null,
        page: Int = 0,
        size: Int = 20
    ): Result<PagedData<ClienteDto>> = try {
        val resp = api.getClientes(search = search, page = page, size = size)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al cargar clientes"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getCliente(id: Long): Result<ClienteDto> = try {
        val resp = api.getCliente(id)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Cliente no encontrado"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun buscarPorDocumento(numeroDocumento: String): Result<ClienteDto> = try {
        val resp = api.getClientePorDocumento(numeroDocumento)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Cliente no encontrado"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun crearCliente(dto: ClienteDto): Result<ClienteDto> = try {
        val resp = api.crearCliente(dto)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al crear cliente"))
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun actualizarCliente(id: Long, dto: ClienteDto): Result<ClienteDto> = try {
        val resp = api.actualizarCliente(id, dto)
        if (resp.success && resp.data != null) Result.success(resp.data)
        else Result.failure(Exception(resp.error?.message ?: "Error al actualizar cliente"))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
