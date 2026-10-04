package com.licoreria.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Sirve el frontend (build de React/Vite) desde el mismo backend en producción.
 * Las rutas del SPA (/pos, /ventas, ...) que no son archivos devuelven index.html
 * para que React Router las resuelva. Las rutas /api/** nunca caen en index.html.
 */
@Configuration
public class FrontendConfig implements WebMvcConfigurer {

    /** Carpeta del build del frontend, p. ej. file:C:/Chilalo/web/ (vacío = solo classpath:/static/). */
    @Value("${app.frontend-dir:}")
    private String frontendDir;

    /** El handler de recursos ignora la ruta vacía, así que "/" se reenvía a index.html. */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String[] locations = frontendDir.isBlank()
                ? new String[]{"classpath:/static/"}
                : new String[]{normalizar(frontendDir), "classpath:/static/"};

        registry.addResourceHandler("/**")
                .addResourceLocations(locations)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // "" o "carpeta/" apuntan a un directorio: nunca se sirven directamente
                        if (!resourcePath.isEmpty() && !resourcePath.endsWith("/")) {
                            Resource solicitado = location.createRelative(resourcePath);
                            if (solicitado.exists() && solicitado.isReadable()) {
                                return solicitado;
                            }
                        }
                        // API o archivos con extensión inexistentes → 404 real
                        if (resourcePath.startsWith("api/") || resourcePath.contains(".")) {
                            return null;
                        }
                        Resource index = location.createRelative("index.html");
                        return index.exists() && index.isReadable() ? index : null;
                    }
                });
    }

    private static String normalizar(String dir) {
        String d = dir.startsWith("file:") || dir.startsWith("classpath:") ? dir : "file:" + dir;
        return d.endsWith("/") ? d : d + "/";
    }
}
