# Cómo ejecutar el proyecto

## Opción 1: Dos terminales (recomendado)

### Terminal 1 – Backend (Spring Boot)

**Si tienes Maven instalado:**
```bash
cd c:\Users\Usuario\Desktop\CHILALO-IA\backend
mvn spring-boot:run
```

**Si usas Eclipse/IntelliJ:**  
Abre la carpeta `backend` como proyecto Maven y ejecuta la clase `LicoreriaApplication.java` (Run).

**Requisitos:** Java 17+, PostgreSQL en ejecución, base de datos `licoreria_db` creada (usuario `postgres`, contraseña `123456` según `application.properties`).

Cuando arranque verás algo como:  
`Started LicoreriaApplication in X seconds`  
- API: http://localhost:8080  
- Swagger: http://localhost:8080/swagger-ui.html  

---

### Terminal 2 – Frontend (Vite + React)

```bash
cd c:\Users\Usuario\Desktop\CHILALO-IA\frontend
npm run dev
```

Cuando arranque verás la URL local, por ejemplo:  
- App: http://localhost:5173  

Abre esa URL en el navegador. Para iniciar sesión: **usuario** `admin`, **contraseña** `Admin123!`.

---

## Opción 2: Solo backend (bat)

Doble clic en **EJECUTAR.bat** (o ejecútalo desde CMD).  
Eso compila y levanta solo el backend. El frontend debes levantarlo aparte con `npm run dev` en la carpeta `frontend`.

---

## Resumen

| Componente | Comando / Acción | URL |
|------------|------------------|-----|
| Backend    | `mvn spring-boot:run` en `backend` o Run en IDE | http://localhost:8080 |
| Frontend   | `npm run dev` en `frontend` | http://localhost:5173 |
| Login      | Usuario: `admin` / Contraseña: `Admin123!` | — |

Si Maven no está instalado, instálalo desde https://maven.apache.org/ o usa tu IDE para ejecutar el backend.
