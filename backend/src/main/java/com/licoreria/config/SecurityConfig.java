package com.licoreria.config;

import com.licoreria.security.Http401AuthenticationEntryPoint;
import com.licoreria.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final Http401AuthenticationEntryPoint http401EntryPoint;

    private static final String[] PUBLIC = {
            "/api/v1/auth/login",
            "/api/v1/auth/refresh",
            "/api/v1/auth/logout",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/api-docs/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(c -> c.disable())
                .cors(c -> c.configurationSource(corsConfigurationSource))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e.authenticationEntryPoint(http401EntryPoint))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(PUBLIC).permitAll()

                        // ── SOLO ADMIN ──────────────────────────────────────────────
                        // Gestión de usuarios
                        .requestMatchers("/api/v1/usuarios/**").hasRole("ADMIN")
                        // Compras y proveedores
                        .requestMatchers("/api/v1/compras/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/proveedores/**").hasRole("ADMIN")
                        // Gastos y mermas (operaciones administrativas)
                        .requestMatchers("/api/v1/gastos/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/mermas/**").hasRole("ADMIN")
                        // Reportes financieros completos (dashboard queda abierto)
                        .requestMatchers(HttpMethod.GET, "/api/v1/reportes/dashboard").authenticated()
                        .requestMatchers("/api/v1/reportes/**").hasRole("ADMIN")
                        // Gestión SUNAT: pendientes/errores/demo (emitir boleta/factura sigue abierto)
                        .requestMatchers(HttpMethod.GET, "/api/v1/facturacion/comprobantes/pendientes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/facturacion/comprobantes/errores").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/facturacion/demo").hasRole("ADMIN")

                        // ── CATÁLOGO: lectura abierta, escritura solo ADMIN ──────────
                        .requestMatchers(HttpMethod.POST, "/api/v1/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/v1/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/productos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/v1/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categorias/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/packs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/v1/packs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/packs/**").hasRole("ADMIN")

                        // Promociones: /aplicar abierto (usado en POS), resto escritura ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/v1/promociones/*/aplicar").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/promociones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/api/v1/promociones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/promociones/**").hasRole("ADMIN")

                        // ── INVENTARIO: lectura abierta, ajustes manuales solo ADMIN ─
                        .requestMatchers(HttpMethod.POST, "/api/v1/inventario/movimientos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/inventario/ajustar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/inventario/entrada-pack").hasRole("ADMIN")

                        // ── CLIENTES: alta/edición abierta, borrar y ajuste manual de puntos ADMIN ─
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/clientes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,  "/api/v1/clientes/**").hasRole("ADMIN")

                        // ── FIDELIZACIÓN: config y ajuste manual ADMIN (doble capa con @PreAuthorize) ─
                        .requestMatchers(HttpMethod.PUT,  "/api/v1/fidelizacion/config").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/fidelizacion/ajuste").hasRole("ADMIN")

                        // Legacy admin path
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // ── TODO LO DEMÁS: autenticado ───────────────────────────────
                        .requestMatchers("/api/**").authenticated()
                        // Archivos del frontend (index.html, JS, CSS) servidos por FrontendConfig
                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
