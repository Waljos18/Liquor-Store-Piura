package com.licoreria.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void enviarResetPassword(String destinatario, String token, String nombreUsuario) {
        String link = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(from);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de contraseña - Licorería Chilalo");
        mensaje.setText(
                "Hola " + nombreUsuario + ",\n\n" +
                "Recibimos una solicitud para restablecer la contraseña de tu cuenta.\n\n" +
                "Haz clic en el siguiente enlace para crear una nueva contraseña:\n" +
                link + "\n\n" +
                "Este enlace expira en 30 minutos.\n\n" +
                "Si no solicitaste este cambio, ignora este correo.\n\n" +
                "— Sistema Licorería Chilalo, Piura"
        );

        try {
            mailSender.send(mensaje);
            log.info("Email de recuperación enviado a: {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar email de recuperación a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException("No se pudo enviar el correo. Verifica la configuración SMTP.");
        }
    }
}
