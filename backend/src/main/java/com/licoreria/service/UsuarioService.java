package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.UsuarioDTO;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse<Page<UsuarioDTO>> listar(Pageable pageable) {
        Page<Usuario> page = usuarioRepository.findAll(pageable);
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<UsuarioDTO> obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(u -> ApiResponse.ok(toDto(u)))
                .orElse(ApiResponse.error("NOT_FOUND", "Usuario no encontrado"));
    }

    @Transactional
    public ApiResponse<UsuarioDTO> crear(UsuarioDTO dto) {
        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            return ApiResponse.error("CONFLICT", "Username ya existe");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            return ApiResponse.error("CONFLICT", "Email ya existe");
        }
        Usuario.Rol rol;
        try {
            rol = Usuario.Rol.valueOf(dto.getRol());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("VALIDATION", "Rol inválido. Use ADMIN o VENDEDOR");
        }
        Usuario u = Usuario.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword() != null ? dto.getPassword() : "Temp123!"))
                .nombre(dto.getNombre())
                .rol(rol)
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        u = usuarioRepository.save(u);
        return ApiResponse.ok(toDto(u), "Usuario creado exitosamente");
    }

    @Transactional
    public ApiResponse<UsuarioDTO> actualizar(Long id, UsuarioDTO dto) {
        Usuario u = usuarioRepository.findById(id).orElse(null);
        if (u == null) {
            return ApiResponse.error("NOT_FOUND", "Usuario no encontrado");
        }
        if (dto.getUsername() != null && !dto.getUsername().equals(u.getUsername()) && usuarioRepository.existsByUsername(dto.getUsername())) {
            return ApiResponse.error("CONFLICT", "Username ya existe");
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(u.getEmail()) && usuarioRepository.existsByEmail(dto.getEmail())) {
            return ApiResponse.error("CONFLICT", "Email ya existe");
        }
        if (dto.getUsername() != null) u.setUsername(dto.getUsername());
        if (dto.getEmail() != null) u.setEmail(dto.getEmail());
        if (dto.getNombre() != null) u.setNombre(dto.getNombre());
        if (dto.getRol() != null) {
            try {
                u.setRol(Usuario.Rol.valueOf(dto.getRol()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (dto.getActivo() != null) u.setActivo(dto.getActivo());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        u = usuarioRepository.save(u);
        return ApiResponse.ok(toDto(u), "Usuario actualizado exitosamente");
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ApiResponse.error("NOT_FOUND", "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
        return ApiResponse.ok(null, "Usuario eliminado exitosamente");
    }

    private UsuarioDTO toDto(Usuario u) {
        UsuarioDTO d = new UsuarioDTO();
        d.setId(u.getId());
        d.setUsername(u.getUsername());
        d.setEmail(u.getEmail());
        d.setNombre(u.getNombre());
        d.setRol(u.getRol().name());
        d.setActivo(u.getActivo());
        return d;
    }
}
