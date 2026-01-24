package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.auth.LoginRequest;
import com.licoreria.dto.auth.LoginResponse;
import com.licoreria.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Login, refresh y logout")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<LoginResponse> res = authService.login(request);
        if (!res.isSuccess()) {
            return ResponseEntity.status(401).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar access token")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@RequestBody Map<String, String> body) {
        String refresh = body != null ? body.get("refreshToken") : null;
        ApiResponse<LoginResponse> res = authService.refresh(refresh);
        if (!res.isSuccess()) {
            return ResponseEntity.status(401).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal(errorOnInvalidType = false) String username) {
        return ResponseEntity.ok(authService.logout(username));
    }
}
