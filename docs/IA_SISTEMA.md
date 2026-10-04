# Inteligencia Artificial — Sistema Chilalo POS

## Índice

1. [Arquitectura del servicio de IA](#1-arquitectura-del-servicio-de-ia)
2. [Modelo y proveedor](#2-modelo-y-proveedor)
3. [Endpoints disponibles](#3-endpoints-disponibles)
4. [Funcionalidad 1 — Chat contextual](#4-funcionalidad-1--chat-contextual)
5. [Funcionalidad 2 — Análisis rápido (Insights)](#5-funcionalidad-2--análisis-rápido-insights)
6. [Funcionalidad 3 — Recomendador de Packs](#6-funcionalidad-3--recomendador-de-packs)
7. [Contexto enriquecido del negocio](#7-contexto-enriquecido-del-negocio)
8. [Configuración y puesta en marcha](#8-configuración-y-puesta-en-marcha)
9. [Flujo de datos completo](#9-flujo-de-datos-completo)
10. [Limitaciones y consideraciones](#10-limitaciones-y-consideraciones)

---

## 1. Arquitectura del servicio de IA

El módulo de IA es un **microservicio independiente** escrito en Python, separado del backend principal (Spring Boot). Esta separación permite actualizar o escalar el componente de IA sin afectar el resto del sistema.

```
Frontend React (puerto 5173)
       │
       │  HTTP directo al servicio de IA
       ▼
AI Service FastAPI (puerto 8001)
       │
       │  API REST (HTTPS)
       ▼
Groq Cloud API  ──►  Modelo Llama 3.3 70B
```

**Stack tecnológico del servicio:**

| Componente | Tecnología |
|---|---|
| Framework web | FastAPI (Python) |
| Servidor ASGI | Uvicorn |
| Cliente LLM | Groq SDK (`groq>=0.9.0`) |
| Variables de entorno | python-dotenv |
| Validación de datos | Pydantic |

> El frontend se comunica **directamente** con el servicio de IA en `http://localhost:8001`, sin pasar por el backend Java. La URL base es configurable mediante la variable de entorno `VITE_AI_URL`.

---

## 2. Modelo y proveedor

| Parámetro | Valor |
|---|---|
| Proveedor | **Groq** (groq.com) |
| Modelo | **Llama 3.3 70B Versatile** (`llama-3.3-70b-versatile`) |
| Autenticación | API Key (`GROQ_API_KEY` en `ai-service/.env`) |
| Idioma de respuesta | Español (forzado por system prompt) |

Groq ofrece inferencia de LLaMA a alta velocidad mediante hardware especializado (LPU), lo que resulta en tiempos de respuesta muy bajos comparado con otros proveedores.

---

## 3. Endpoints disponibles

### `GET /health`
Verifica que el servicio esté activo.

```json
{ "status": "ok", "service": "licoreria-ia", "model": "llama-3.3-70b-versatile" }
```

---

### `POST /api/chat`
Chat conversacional con historial y contexto del negocio.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "¿Cómo van las ventas de hoy?" }
  ],
  "context": { "ventas_hoy_soles": 850.50, "transacciones_hoy": 12, "..." : "..." }
}
```

**Response:**
```json
{ "success": true, "message": "Hoy llevas S/ 850.50 en ventas con 12 transacciones..." }
```

---

### `POST /api/insights`
Genera un análisis automático de 3 puntos clave según el tipo solicitado.

**Request:**
```json
{
  "tipo": "ventas",
  "datos": { "ventas_hoy_soles": 850.50, "top_productos_mes": [...] }
}
```

**Tipos disponibles:**

| Tipo | Instrucción enviada al modelo |
|---|---|
| `ventas` | "Analiza estos datos de ventas y proporciona exactamente 3 insights clave con recomendaciones concretas y accionables" |
| `inventario` | "Analiza este estado del inventario y señala los 3 puntos más críticos que requieren atención inmediata" |
| `general` | "Analiza este resumen del negocio y proporciona las 3 acciones más importantes a tomar" |

---

### `POST /api/packs-recomendacion`
Genera recomendaciones de packs comerciales al estilo Tambo+ a partir del catálogo real.

**Request:**
```json
{
  "productos": [
    { "nombre": "Johnnie Walker Red 750ml", "precioVenta": 65.00, "precioCompra": 48.00, "stockActual": 12 }
  ],
  "packs_existentes": []
}
```

**Response:**
```json
{
  "success": true,
  "recomendaciones": {
    "packs_sugeridos": [...],
    "productos_a_comprar": [...]
  }
}
```

---

## 4. Funcionalidad 1 — Chat contextual

### ¿Qué hace?
Permite hacer preguntas en lenguaje natural sobre la operación del negocio. El modelo responde como un asesor especializado en licorerías peruanas.

### System prompt base
El modelo siempre recibe este rol:

> *"Eres un asistente de inteligencia artificial especializado para una licorería llamada Chilalo en Piura, Perú. Tu función es ayudar al administrador y vendedores del negocio con: análisis de ventas y tendencias, sugerencias para optimizar el inventario, recomendaciones de promociones, alertas sobre productos de baja rotación o próximos a vencer, análisis de clientes y fidelización."*

### Acciones rápidas predefinidas (UI)
El frontend ofrece 4 botones de acceso rápido al chat:

1. "¿Cómo van las ventas de hoy?"
2. "¿Qué productos tienen stock crítico?"
3. "Sugiere promociones para este mes"
4. "Dame las acciones prioritarias para hoy"

### Historial de conversación
El chat mantiene el historial completo de la sesión. Cada mensaje enviado incluye todos los mensajes previos, permitiendo conversaciones con contexto acumulativo (multi-turn).

### Controles de teclado
- `Enter` → Enviar mensaje
- `Shift + Enter` → Salto de línea en el input

---

## 5. Funcionalidad 2 — Análisis rápido (Insights)

### ¿Qué hace?
Genera un análisis automático **sin necesidad de escribir una pregunta**. El usuario elige el tipo de análisis y el sistema prepara los datos relevantes y los envía al modelo.

### Tipos de análisis y datos enviados

**Análisis de Ventas** (`tipo: "ventas"`)
- Ventas del día (en soles y número de transacciones)
- Ventas de los últimos 7 días (total, transacciones, ticket promedio)
- Ventas por forma de pago (efectivo, Yape, tarjeta, etc.)
- Top 5 productos más vendidos del mes

**Análisis de Inventario** (`tipo: "inventario"`)
- Lista de productos con stock bajo (nombre, stock actual, stock mínimo)
- Productos próximos a vencer (nombre, fecha, días restantes)
- Total de productos activos en el sistema

**Resumen General del Negocio** (`tipo: "general"`)
- Todos los datos anteriores combinados en un único análisis

### Resultado
El modelo devuelve exactamente **3 puntos accionables** con recomendaciones concretas, mostrados en un panel lateral dentro de la interfaz.

---

## 6. Funcionalidad 3 — Recomendador de Packs

### ¿Qué hace?
Analiza el catálogo completo de la licorería y genera **sugerencias de packs comerciales** (combos) al estilo de las tiendas Tambo+, adaptados a los precios y stock reales del negocio.

### Flujo de operación

```
1. Frontend carga el catálogo completo (hasta 150 productos activos)
2. Frontend carga los packs ya existentes (para no duplicar)
3. Se envía al endpoint /api/packs-recomendacion
4. El modelo analiza y devuelve JSON estructurado
5. El frontend renderiza las tarjetas de packs
6. El usuario puede crear el pack en el sistema con un solo clic
```

### Lógica del modelo para generar packs
El prompt especializado instruye al modelo a:
- Usar **solo productos con stock > 0** del inventario real
- Aplicar un descuento de **8% a 12%** respecto a la suma de precios individuales
- Seguir el formato Tambo+: *Licor principal + Mezclador + Hielo*
- Proponer entre **5 y 8 packs variados** (diferentes categorías y rangos de precio)
- Nombrar los packs de forma creativa en español peruano
- Indicar **qué productos comprar al proveedor** si faltan complementos

### Ejemplos de referencia del mercado (incluidos en el prompt)
El modelo recibe como referencia real los siguientes precios de Tambo+:

| Pack | Precio |
|---|---|
| Johnnie Walker Red 750ml + Evervess 1.5L + Hielo | S/ 53.90 |
| Cartavio Black 750ml + Coca-Cola 1L + Hielo | S/ 22.50 |
| Havana Club Especial + Coca-Cola 1.5L + Hielo | S/ 44.90 |
| Vodka Soviet 750ml + Frutaris 3L + Hielo | S/ 19.90 |

### Creación de pack con un clic
Desde la UI, el usuario puede presionar **"Crear Pack en sistema"** en cualquier tarjeta sugerida. El frontend:
1. Busca cada producto sugerido en el catálogo local (por nombre, con búsqueda flexible)
2. Construye el payload del pack con los IDs reales
3. Llama a `POST /api/v1/packs` del backend Spring Boot
4. Muestra confirmación de éxito o error directamente en la tarjeta

### Respuesta estructurada (JSON forzado)
El endpoint usa `response_format: { type: "json_object" }` para garantizar que el modelo devuelva JSON válido sin texto libre, evitando errores de parseo.

---

## 7. Contexto enriquecido del negocio

Al cargar la página de IA, el frontend realiza **5 llamadas paralelas** al backend Java para construir el contexto del negocio que se incluye en cada mensaje al modelo:

```typescript
interface RichContext {
  fecha_actual: string;                    // Fecha de hoy
  ventas_hoy_soles: number;               // Total ventas del día
  transacciones_hoy: number;              // Número de ventas del día
  productos_activos: number;              // Total productos en sistema
  productos_stock_bajo: [...];            // Lista: nombre, stock_actual, stock_minimo
  productos_proximos_vencer: [...];       // Lista: nombre, fecha_vencimiento, dias_restantes
  top_productos_mes: [...];               // Top 5: nombre, cantidad_vendida, total_ventas
  ventas_ultimos_7_dias: {...};           // Total, transacciones, ticket_promedio
  ventas_por_forma_pago: [...];           // Por método: total y cantidad
}
```

Este contexto se **inyecta en el system prompt** de cada petición al modelo:

```
[System prompt base]

Contexto actual del negocio:
{
  "fecha_actual": "2026-03-21",
  "ventas_hoy_soles": 1250.00,
  ...
}
```

Esto permite que el modelo responda preguntas como "¿cuánto vendimos hoy?" con datos reales, sin necesidad de que el usuario los proporcione manualmente.

**Indicadores de carga en la UI:**
- ⏳ "Cargando datos del negocio..." — mientras se obtienen los datos
- ✅ "Datos del negocio cargados" — cuando el contexto está disponible

---

## 8. Configuración y puesta en marcha

### Requisitos
- Python 3.10+
- Cuenta en [console.groq.com](https://console.groq.com) (gratuita)

### Instalación

```bash
cd ai-service
pip install -r requirements.txt
```

### Variables de entorno

Crear el archivo `ai-service/.env` basado en `.env.example`:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

La API Key se obtiene en [console.groq.com/keys](https://console.groq.com/keys).

### Ejecución

```bash
cd ai-service
python main.py
# El servicio queda disponible en http://localhost:8001
# Documentación Swagger en http://localhost:8001/docs
```

### Variable de entorno del frontend (opcional)

Si el servicio de IA corre en una IP o puerto diferente, configurar en `frontend/.env`:

```env
VITE_AI_URL=http://192.168.1.100:8001
```

Por defecto usa `http://localhost:8001`.

### CORS configurado
El servicio acepta peticiones desde:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:8080`

---

## 9. Flujo de datos completo

```
┌─────────────────────────────────────────────────────────┐
│                    Usuario (navegador)                  │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼─────────────┐
              │     Página /ia (React)   │
              │  1. Carga contexto       │
              │  2. Usuario escribe      │
              │  3. Botón de análisis    │
              └──────────┬───────────────┘
                         │
           ┌─────────────┼─────────────────┐
           │             │                 │
           ▼             ▼                 ▼
    Backend Java   AI Service        AI Service
    (port 8080)    /api/chat         /api/insights
    5 endpoints    con historial     /api/packs-recomendacion
    para datos     + contexto
           │             │                 │
           └─────────────┼─────────────────┘
                         │
                         ▼
                  Groq Cloud API
                  Llama 3.3 70B
                         │
                         ▼
              Respuesta en español
              con insights/respuesta/packs
```

---

## 10. Limitaciones y consideraciones

| Aspecto | Detalle |
|---|---|
| **Rate limits de Groq** | El plan gratuito tiene límites de tokens por minuto. Si se alcanza, el servicio devuelve HTTP 429 y la UI muestra el error. |
| **Sin persistencia de chat** | El historial de conversación existe solo en memoria del navegador; se pierde al recargar la página. |
| **Contexto por sesión** | Los datos del negocio se cargan una sola vez al abrir la página. Para datos más frescos, recargar la página. |
| **Creación de packs por nombre** | El matching de productos sugeridos vs. catálogo real se hace por coincidencia de nombre (substring). Si el nombre del producto en el sistema difiere mucho del sugerido por la IA, el pack puede no crearse automáticamente. |
| **Seguridad de la API Key** | `GROQ_API_KEY` nunca viaja al frontend; permanece en el servidor Python. |
| **Disponibilidad** | El servicio de IA es **opcional**: si no está en ejecución, el resto del sistema (POS, ventas, inventario) funciona con normalidad. Solo la página `/ia` requiere el microservicio. |
