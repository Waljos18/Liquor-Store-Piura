# Imagen del backend para despliegue en la nube (Render, Railway, Fly.io, ...).
# El frontend NO va aquí: se despliega aparte en Vercel.

# ── Etapa 1: compilar el jar ────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests clean package

# ── Etapa 2: imagen de ejecución ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache tzdata && addgroup -S chilalo && adduser -S chilalo -G chilalo
COPY --from=build /build/target/licoreria-backend-*.jar app.jar
USER chilalo

# Hora de Perú: cierres de caja, reportes y comprobantes usan la fecha local.
# MaxRAMPercentage: aprovecha la memoria del contenedor (planes de 512 MB).
ENV TZ=America/Lima \
    SPRING_PROFILES_ACTIVE=cloud \
    JAVA_TOOL_OPTIONS="-Duser.timezone=America/Lima -XX:MaxRAMPercentage=75"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
