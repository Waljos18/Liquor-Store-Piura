package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ClienteDTO;
import com.licoreria.entity.Cliente;
import com.licoreria.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ApiResponse<Page<ClienteDTO>> listar(String search, Pageable pageable) {
        Page<Cliente> page = clienteRepository.buscar(search, pageable);
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<ClienteDTO> obtenerPorId(Long id) {
        return clienteRepository.findById(id)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Cliente no encontrado"));
    }

    public ApiResponse<ClienteDTO> obtenerPorDocumento(String numeroDocumento) {
        return clienteRepository.findByNumeroDocumento(numeroDocumento)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Cliente no encontrado"));
    }

    @Transactional
    public ApiResponse<ClienteDTO> crear(ClienteDTO dto) {
        if (clienteRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            return ApiResponse.error("CONFLICT", "Ya existe un cliente con ese número de documento");
        }
        Cliente.TipoDocumento tp;
        try {
            tp = Cliente.TipoDocumento.valueOf(dto.getTipoDocumento());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("VALIDATION", "Tipo de documento inválido. Use DNI, RUC o CE");
        }
        Cliente c = Cliente.builder()
                .tipoDocumento(tp)
                .numeroDocumento(dto.getNumeroDocumento())
                .nombre(dto.getNombre())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .puntosFidelizacion(dto.getPuntosFidelizacion() != null ? dto.getPuntosFidelizacion() : 0)
                .build();
        c = clienteRepository.save(c);
        return ApiResponse.ok(toDto(c), "Cliente creado exitosamente");
    }

    @Transactional
    public ApiResponse<ClienteDTO> actualizar(Long id, ClienteDTO dto) {
        Cliente c = clienteRepository.findById(id).orElse(null);
        if (c == null) {
            return ApiResponse.error("NOT_FOUND", "Cliente no encontrado");
        }
        if (dto.getNumeroDocumento() != null && !dto.getNumeroDocumento().equals(c.getNumeroDocumento()) && clienteRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            return ApiResponse.error("CONFLICT", "Ya existe un cliente con ese número de documento");
        }
        if (dto.getTipoDocumento() != null) {
            try {
                c.setTipoDocumento(Cliente.TipoDocumento.valueOf(dto.getTipoDocumento()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (dto.getNumeroDocumento() != null) c.setNumeroDocumento(dto.getNumeroDocumento());
        if (dto.getNombre() != null) c.setNombre(dto.getNombre());
        if (dto.getTelefono() != null) c.setTelefono(dto.getTelefono());
        if (dto.getEmail() != null) c.setEmail(dto.getEmail());
        if (dto.getPuntosFidelizacion() != null) c.setPuntosFidelizacion(dto.getPuntosFidelizacion());
        c = clienteRepository.save(c);
        return ApiResponse.ok(toDto(c), "Cliente actualizado exitosamente");
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            return ApiResponse.error("NOT_FOUND", "Cliente no encontrado");
        }
        clienteRepository.deleteById(id);
        return ApiResponse.ok(null, "Cliente eliminado exitosamente");
    }

    private ClienteDTO toDto(Cliente c) {
        ClienteDTO d = new ClienteDTO();
        d.setId(c.getId());
        d.setTipoDocumento(c.getTipoDocumento().name());
        d.setNumeroDocumento(c.getNumeroDocumento());
        d.setNombre(c.getNombre());
        d.setTelefono(c.getTelefono());
        d.setEmail(c.getEmail());
        d.setPuntosFidelizacion(c.getPuntosFidelizacion());
        return d;
    }
}
