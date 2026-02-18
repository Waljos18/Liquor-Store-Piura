package com.licoreria.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Devuelve 401 en JSON cuando la petición no está autenticada,
 * para que el frontend pueda redirigir al login en lugar de ver 403.
 */
@Component
public class Http401AuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        Map<String, Object> body = Map.of(
                "success", false,
                "error", Map.of(
                        "code", "UNAUTHORIZED",
                        "message", "Sesión expirada o no autenticado. Inicia sesión nuevamente."
                )
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
