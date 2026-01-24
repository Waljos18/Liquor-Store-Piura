# Licorería Piura - Backend

API REST Spring Boot para el Sistema de Gestión de Licorería (Semana 3-4).

## Requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL 15+

## Configuración

1. **Base de datos:** Crear `licoreria_db` y usuario `licoreria_user` (ver `../database/setup.sql`).
2. **Propiedades:** Ajustar `src/main/resources/application.properties` si usas otro host/credenciales.

## Ejecución

```bash
./mvnw spring-boot:run
```

- **API:** http://localhost:8080  
- **Swagger UI:** http://localhost:8080/swagger-ui.html  

## Autenticación

- Login: `POST /api/v1/auth/login` con `{"username":"admin","password":"Admin123!"}`.
- Incluir `Authorization: Bearer <token>` en las peticiones protegidas.

## Documentación

Ver `../docs/semana-03-04/01-ENTREGABLES-SPRINT-2.md`.
