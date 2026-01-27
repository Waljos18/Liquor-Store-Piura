@echo off
echo ========================================
echo   Sistema de Licorería - Inicio Rápido
echo ========================================
echo.

REM Verificar Java
echo [1/4] Verificando Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no encontrado. Por favor instala Java 17 o superior.
    pause
    exit /b 1
)
echo ✓ Java encontrado
echo.

REM Verificar PostgreSQL
echo [2/4] Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: PostgreSQL no encontrado en PATH.
    echo Asegúrate de que PostgreSQL esté instalado y corriendo.
    echo.
)
echo.

REM Verificar base de datos
echo [3/4] Verificando base de datos...
psql -U licoreria_user -d licoreria_db -h localhost -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudo conectar a la base de datos.
    echo.
    echo Por favor ejecuta primero:
    echo   cd database
    echo   psql -U postgres -f setup.sql
    echo.
    set /p continuar="¿Deseas continuar de todos modos? (S/N): "
    if /i not "%continuar%"=="S" (
        exit /b 1
    )
    echo.
)
echo ✓ Base de datos verificada
echo.

REM Compilar y ejecutar
echo [4/4] Compilando y ejecutando backend...
echo.
cd backend

REM Verificar si Maven está instalado
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven no encontrado.
    echo.
    echo Opciones:
    echo 1. Instala Maven desde https://maven.apache.org/
    echo 2. O usa un IDE como IntelliJ IDEA o Eclipse que incluye Maven
    echo.
    pause
    exit /b 1
)

echo Compilando proyecto...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo.
    echo ERROR: La compilación falló. Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Compilación exitosa
echo ========================================
echo.
echo Iniciando servidor...
echo.
echo El servidor estará disponible en:
echo   - API: http://localhost:8080
echo   - Swagger UI: http://localhost:8080/swagger-ui.html
echo.
echo Presiona Ctrl+C para detener el servidor.
echo.

call mvn spring-boot:run

pause
