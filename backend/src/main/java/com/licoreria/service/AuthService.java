package com.licoreria.service;

import com.licoreria.config.JwtProperties;
import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.auth.LoginRequest;
import com.licoreria.dto.auth.LoginResponse;
import com.licoreria.dto.auth.ResetPasswordRequest;
import com.licoreria.dto.auth.SolicitarResetRequest;
import com.licoreria.entity.PasswordResetToken;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.PasswordResetTokenRepository;
import com.licoreria.repository.UsuarioRepository;
import com.licoreria.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    // En producción usar Redis. Para Sprint 2, almacenamiento en memoria de refresh tokens.
    private final Map<String, String> refreshTokenStore = new ConcurrentHashMap<>();

    public ApiResponse<LoginResponse> login(LoginRequest req) {
        Usuario u = usuarioRepository.findByUsername(req.getUsername())
                .orElse(null);
        if (u == null || !u.getActivo() || !passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            return ApiResponse.error("INVALID_CREDENTIALS", "Usuario o contraseña incorrectos");
        }
        String access = jwtUtil.generateAccessToken(u);
        String refresh = jwtUtil.generateRefreshToken(u);
        refreshTokenStore.put(u.getUsername(), refresh);

        LoginResponse.UserInfo info = LoginResponse.UserInfo.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .rol(u.getRol().name())
                .build();

        LoginResponse data = LoginResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpiration() / 1000)
                .user(info)
                .build();
        return ApiResponse.ok(data);
    }

    public ApiResponse<LoginResponse> refresh(String refreshToken) {
        if (refreshToken == null || !jwtUtil.validate(refreshToken)) {
            return ApiResponse.error("INVALID_TOKEN", "Refresh token inválido o expirado");
        }
        String username = jwtUtil.getUsername(refreshToken);
        if (!refreshToken.equals(refreshTokenStore.get(username))) {
            return ApiResponse.error("INVALID_TOKEN", "Refresh token no coincide");
        }
        Usuario u = usuarioRepository.findByUsername(username).orElse(null);
        if (u == null || !u.getActivo()) {
            return ApiResponse.error("USER_INACTIVE", "Usuario inactivo");
        }
        String access = jwtUtil.generateAccessToken(u);
        String newRefresh = jwtUtil.generateRefreshToken(u);
        refreshTokenStore.put(username, newRefresh);

        LoginResponse.UserInfo info = LoginResponse.UserInfo.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .rol(u.getRol().name())
                .build();

        LoginResponse data = LoginResponse.builder()
                .accessToken(access)
                .refreshToken(newRefresh)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpiration() / 1000)
                .user(info)
                .build();
        return ApiResponse.ok(data);
    }

    public ApiResponse<Void> logout(String username) {
        refreshTokenStore.remove(username);
        return ApiResponse.ok(null, "Sesión cerrada exitosamente");
    }

    @Transactional
    public ApiResponse<Void> solicitarReset(SolicitarResetRequest req) {
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(req.getEmail());
        // Siempre devolvemos ok para no revelar si el email existe
        if (optUsuario.isEmpty()) {
            return ApiResponse.ok(null, "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
        }
        Usuario usuario = optUsuario.get();
        if (!usuario.getActivo()) {
            return ApiResponse.ok(null, "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
        }

        // Eliminar tokens anteriores del usuario
        resetTokenRepository.deleteByUsuarioId(usuario.getId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .usuario(usuario)
                .expiraEn(LocalDateTime.now().plusMinutes(30))
                .usado(false)
                .creadoEn(LocalDateTime.now())
                .build();
        resetTokenRepository.save(resetToken);

        emailService.enviarResetPassword(usuario.getEmail(), token, usuario.getNombre());

        return ApiResponse.ok(null, "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
    }

    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest req) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(req.getToken()).orElse(null);
        if (resetToken == null || !resetToken.isValido()) {
            return ApiResponse.error("INVALID_TOKEN", "El enlace de recuperación es inválido o ha expirado.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(req.getNuevaPassword()));
        usuarioRepository.save(usuario);

        resetToken.setUsado(true);
        resetTokenRepository.save(resetToken);

        return ApiResponse.ok(null, "Contraseña actualizada exitosamente. Ya puedes iniciar sesión.");
    }
}
