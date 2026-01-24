package com.licoreria.config;

import com.licoreria.entity.Usuario;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_PASS = "Admin123!";

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .username("admin")
                    .email("admin@licoreria.local")
                    .password(passwordEncoder.encode(ADMIN_PASS))
                    .nombre("Administrador")
                    .rol(Usuario.Rol.ADMIN)
                    .activo(true)
                    .build();
            usuarioRepository.save(admin);
            log.info("Usuario inicial creado: admin / {}", ADMIN_PASS);
        }
        if (usuarioRepository.findByUsername("vendedor").isEmpty()) {
            Usuario vendedor = Usuario.builder()
                    .username("vendedor")
                    .email("vendedor@licoreria.local")
                    .password(passwordEncoder.encode(ADMIN_PASS))
                    .nombre("Vendedor")
                    .rol(Usuario.Rol.VENDEDOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(vendedor);
            log.info("Usuario inicial creado: vendedor / {}", ADMIN_PASS);
        }
    }
}
