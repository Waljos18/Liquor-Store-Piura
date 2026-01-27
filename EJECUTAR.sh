#!/bin/bash

echo "========================================"
echo "  Sistema de Licorería - Inicio Rápido"
echo "========================================"
echo ""

# Verificar Java
echo "[1/4] Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java no encontrado. Por favor instala Java 17 o superior."
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -n 1)
echo "✓ Java encontrado: $JAVA_VERSION"
echo ""

# Verificar PostgreSQL
echo "[2/4] Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "ADVERTENCIA: PostgreSQL no encontrado en PATH."
    echo "Asegúrate de que PostgreSQL esté instalado y corriendo."
    echo ""
else
    echo "✓ PostgreSQL encontrado"
fi
echo ""

# Verificar base de datos
echo "[3/4] Verificando base de datos..."
if ! PGPASSWORD=licoreria_pass psql -U licoreria_user -d licoreria_db -h localhost -c "SELECT 1;" &> /dev/null; then
    echo "ADVERTENCIA: No se pudo conectar a la base de datos."
    echo ""
    echo "Por favor ejecuta primero:"
    echo "  cd database"
    echo "  psql -U postgres -f setup.sql"
    echo ""
    read -p "¿Deseas continuar de todos modos? (S/N): " continuar
    if [[ ! "$continuar" =~ ^[Ss]$ ]]; then
        exit 1
    fi
    echo ""
else
    echo "✓ Base de datos verificada"
fi
echo ""

# Compilar y ejecutar
echo "[4/4] Compilando y ejecutando backend..."
echo ""
cd backend

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven no encontrado."
    echo ""
    echo "Instala Maven:"
    echo "  - Ubuntu/Debian: sudo apt-get install maven"
    echo "  - macOS: brew install maven"
    echo "  - O descarga desde https://maven.apache.org/"
    echo ""
    exit 1
fi

echo "Compilando proyecto..."
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: La compilación falló. Revisa los errores arriba."
    exit 1
fi

echo ""
echo "========================================"
echo "  ✓ Compilación exitosa"
echo "========================================"
echo ""
echo "Iniciando servidor..."
echo ""
echo "El servidor estará disponible en:"
echo "  - API: http://localhost:8080"
echo "  - Swagger UI: http://localhost:8080/swagger-ui.html"
echo ""
echo "Presiona Ctrl+C para detener el servidor."
echo ""

mvn spring-boot:run
