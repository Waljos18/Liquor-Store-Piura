from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import json
import requests
from datetime import date
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="Licorería IA Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"
BACKEND_BASE = os.getenv("BACKEND_URL", "http://localhost:8080")
MAX_TOOL_ROUNDS = 5

SYSTEM_PROMPT = """Eres un asistente de inteligencia artificial especializado para una licorería llamada Chilalo en Piura, Perú.
Tu función es ayudar al administrador y vendedores del negocio con:
- Análisis de ventas y tendencias del negocio
- Sugerencias para optimizar el inventario y gestión de stock
- Recomendaciones de promociones y estrategias de ventas
- Alertas e insights sobre productos de baja rotación o próximos a vencer
- Respuestas a preguntas sobre la operación del negocio
- Análisis de datos de clientes y fidelización

Tienes herramientas que consultan datos en tiempo real de la base de datos.
Úsalas siempre que el usuario pregunte sobre ventas, stock o productos para dar cifras precisas y actualizadas.
Siempre responde en español, de forma concisa, práctica y directa.
Cuando analices datos, proporciona insights accionables con recomendaciones concretas.
Usa listas o puntos cuando sea apropiado para facilitar la lectura.
Si no tienes datos suficientes para un análisis completo, indícalo claramente.

GUÍA PARA BÚSQUEDA DE PRODUCTOS:
- Cuando pregunten por una CATEGORÍA (vinos, whiskys, cervezas, rones, vodkas, piscos, etc.) usa `buscar_productos` con el parámetro `categoria` y `rango_precio="cualquiera"`.
- Cuando pregunten por precio, usa `rango_precio`:
  * "económico" / "barato" / "accesible" → rango_precio="economico"
  * "intermedio" / "regular" / "precio medio" → rango_precio="intermedio"
  * "caro" / "premium" / "de lujo" / "el más caro" → rango_precio="premium"
  * Sin mención de precio → rango_precio="cualquiera"
- Si preguntan por un producto ESPECÍFICO por nombre (ej: "Tabernero", "Johnnie Walker Red") usa `get_producto_info`.
- Cuando muestres productos al usuario, usa formato de lista con nombre, precio en soles y stock."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_dashboard",
            "description": "Obtiene el resumen del dashboard: ventas del día en soles, número de transacciones hoy, productos activos y alertas de inventario. Usar cuando pregunten por ventas de hoy o estado general.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_resumen_ventas",
            "description": "Obtiene el resumen de ventas en un rango de fechas: total en soles, cantidad de transacciones, ticket promedio, ventas por forma de pago (efectivo, Yape, tarjeta, etc.) y ganancia neta.",
            "parameters": {
                "type": "object",
                "properties": {
                    "fecha_inicio": {
                        "type": "string",
                        "description": "Fecha inicio en formato YYYY-MM-DD. Para 'hoy' usa la fecha de hoy. Para 'esta semana' resta 7 días.",
                    },
                    "fecha_fin": {
                        "type": "string",
                        "description": "Fecha fin en formato YYYY-MM-DD (inclusive). Normalmente es la fecha de hoy.",
                    },
                },
                "required": ["fecha_inicio", "fecha_fin"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_top_productos",
            "description": "Obtiene los productos más vendidos por cantidad en un período. Útil para saber qué se vende más o para planificar compras.",
            "parameters": {
                "type": "object",
                "properties": {
                    "fecha_inicio": {"type": "string", "description": "Fecha inicio YYYY-MM-DD"},
                    "fecha_fin": {"type": "string", "description": "Fecha fin YYYY-MM-DD"},
                    "limit": {
                        "type": "integer",
                        "description": "Cuántos productos traer (por defecto 10, máximo 20)",
                        "default": 10,
                    },
                },
                "required": ["fecha_inicio", "fecha_fin"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_productos_stock_bajo",
            "description": "Lista todos los productos con stock actual menor o igual al stock mínimo. Usar para alertas de reabastecimiento o cuando pregunten qué productos están por agotarse.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_producto_info",
            "description": "Busca información detallada de un producto ESPECÍFICO por nombre (ej: 'Tabernero', 'Johnnie Walker Red'): precio de venta, precio de compra, stock actual, categoría. Usar solo cuando el usuario mencione un nombre de producto concreto.",
            "parameters": {
                "type": "object",
                "properties": {
                    "nombre": {
                        "type": "string",
                        "description": "Nombre o parte del nombre del producto específico a buscar",
                    },
                },
                "required": ["nombre"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "buscar_productos",
            "description": "Busca productos con stock disponible filtrando por categoría y/o rango de precio. Usar cuando pregunten por tipos de productos (vinos, whiskys, cervezas, rones, vodkas, piscos) o cuando pidan productos económicos, baratos, caros o premium. Devuelve lista ordenada por precio de menor a mayor.",
            "parameters": {
                "type": "object",
                "properties": {
                    "categoria": {
                        "type": "string",
                        "description": "Tipo de producto: 'vino', 'whisky', 'cerveza', 'ron', 'vodka', 'pisco', 'gaseosa', etc. Omitir para buscar en todo el catálogo.",
                    },
                    "rango_precio": {
                        "type": "string",
                        "enum": ["economico", "intermedio", "premium", "cualquiera"],
                        "description": "Rango de precio: 'economico' (hasta S/30), 'intermedio' (S/30-S/80), 'premium' (más de S/80), 'cualquiera' (sin filtro de precio). Si no mencionan precio usar 'cualquiera'.",
                    },
                },
                "required": ["rango_precio"],
            },
        },
    },
]

PACKS_PROMPT = """Eres un experto en estrategia comercial para licorerías en Perú. Conoces muy bien el modelo de packs de tiendas como Tambo+, que combina:
- Licor principal (whisky, ron, vodka, pisco, cerveza) + Mezclador (gaseosa, agua tónica, jugo) + Hielo
- El precio del pack es ligeramente menor que comprar los productos por separado (5-15% de descuento) para incentivar la compra conjunta y aumentar el ticket promedio.

Ejemplos reales de Tambo (referencia de mercado peruano):
- Johnnie Walker Red 750ml + Evervess 1.5L + Hielo → S/ 53.90
- Cartavio Black 750ml + Coca-Cola 1L + Hielo → S/ 22.50
- Havana Club Especial + Coca-Cola 1.5L + Hielo → S/ 44.90
- Ron Carúpano 700ml + Coca-Cola 1L + Hielo → S/ 23.50
- Vodka Soviet 750ml + Frutaris 3L + Hielo → S/ 19.90
- Flor de Caña 4 años + Evervess 1.5L + Hielo → S/ 39.90

Tu tarea es analizar el catálogo real de la licorería Chilalo y proponer packs comerciales concretos, con nombres creativos, usando exactamente los productos disponibles y sus precios reales.

IMPORTANTE:
- Usa SOLO productos que existan en el inventario proporcionado con stock > 0
- Calcula el precio del pack con descuento del 8-12% respecto a la suma individual
- Si faltan mezcladores o complementos, sugiere específicamente qué productos comprar al proveedor (con nombre y cantidad estimada)
- Los nombres de los packs deben ser atractivos y en español peruano
- Propón entre 5 y 8 packs variados (diferentes categorías de licor, diferentes rangos de precio)
- Formato de respuesta: JSON estructurado"""


# ── Pydantic models ────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" o "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: Optional[dict] = None
    jwt_token: Optional[str] = None  # JWT del usuario para llamar al backend


class InsightRequest(BaseModel):
    tipo: str  # "ventas", "inventario", "general"
    datos: dict


class PacksRequest(BaseModel):
    productos: list[dict]
    packs_existentes: list[dict]


class UpsellRequest(BaseModel):
    cart_items: list[dict]  # [{nombre, cantidad, precioUnitario}]
    jwt_token: Optional[str] = None


# ── Helpers ────────────────────────────────────────────────────────────────────

def _backend_get(path: str, jwt_token: Optional[str]) -> dict:
    """GET al backend Spring Boot con JWT opcional."""
    headers = {}
    if jwt_token:
        headers["Authorization"] = f"Bearer {jwt_token}"
    try:
        r = requests.get(f"{BACKEND_BASE}{path}", headers=headers, timeout=10)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.ConnectionError:
        return {"error": f"No se pudo conectar al backend en {BACKEND_BASE}. Verifica que el servidor esté corriendo."}
    except requests.exceptions.Timeout:
        return {"error": "El backend tardó demasiado en responder (timeout 10s)."}
    except requests.exceptions.HTTPError as e:
        return {"error": f"Error HTTP {e.response.status_code} del backend."}
    except Exception as e:
        return {"error": str(e)}


def execute_tool(name: str, args: dict, jwt_token: Optional[str]) -> str:
    """Ejecuta una herramienta y devuelve el resultado como string JSON."""
    try:
        if name == "get_dashboard":
            data = _backend_get("/api/v1/dashboard", jwt_token)
        elif name == "get_resumen_ventas":
            fi, ff = args["fecha_inicio"], args["fecha_fin"]
            data = _backend_get(
                f"/api/v1/reportes/ventas?fechaInicio={fi}&fechaFin={ff}&agrupacion=DIA",
                jwt_token,
            )
        elif name == "get_top_productos":
            fi, ff = args["fecha_inicio"], args["fecha_fin"]
            limit = args.get("limit", 10)
            data = _backend_get(
                f"/api/v1/reportes/productos-mas-vendidos?fechaInicio={fi}&fechaFin={ff}&limite={limit}",
                jwt_token,
            )
        elif name == "get_productos_stock_bajo":
            data = _backend_get("/api/v1/productos?stockBajo=true&size=50&activo=true", jwt_token)
        elif name == "get_producto_info":
            q = args["nombre"]
            data = _backend_get(f"/api/v1/productos/buscar?q={q}", jwt_token)
        elif name == "buscar_productos":
            categoria = args.get("categoria", "")
            rango = args.get("rango_precio", "cualquiera")

            # Mapear rango a límites numéricos
            rangos = {
                "economico":   (None, 30),
                "intermedio":  (30, 80),
                "premium":     (80, None),
                "cualquiera":  (None, None),
            }
            precio_min, precio_max = rangos.get(rango, (None, None))

            params = "activo=true&size=200"
            if categoria:
                params += f"&search={requests.utils.quote(categoria)}"

            raw = _backend_get(f"/api/v1/productos?{params}", jwt_token)

            # Extraer lista del wrapper ApiResponse { data: { content: [...] } }
            content = []
            if isinstance(raw.get("data"), dict):
                content = raw["data"].get("content", [])
            elif isinstance(raw.get("data"), list):
                content = raw["data"]

            # Si hay error de conexión, devolver el error directamente
            if raw.get("error") and not content:
                data = raw
            else:
                # Filtrar por precio y stock en Python
                resultados = []
                for p in content:
                    precio = p.get("precioVenta") or 0
                    stock = p.get("stockActual") or 0
                    if stock <= 0:
                        continue
                    if precio_min is not None and precio < precio_min:
                        continue
                    if precio_max is not None and precio > precio_max:
                        continue
                    resultados.append({
                        "nombre": p.get("nombre"),
                        "categoria": p.get("categoriaNombre", "Sin categoría"),
                        "precioVenta": precio,
                        "stockActual": stock,
                    })

                # Ordenar por precio ascendente
                resultados.sort(key=lambda x: x["precioVenta"])

                data = {
                    "total_encontrados": len(resultados),
                    "filtros": {"categoria": categoria or "todas", "rango_precio": rango},
                    "productos": resultados[:30],
                }
        else:
            data = {"error": f"Herramienta desconocida: {name}"}
    except Exception as e:
        data = {"error": f"Error en {name}: {str(e)}"}
    return json.dumps(data, ensure_ascii=False)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "licoreria-ia", "model": MODEL}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        today = date.today().isoformat()
        system = SYSTEM_PROMPT + f"\n\nFecha actual: {today}"
        if req.context:
            system += (
                f"\n\nContexto del negocio (snapshot, puede estar desactualizado — "
                f"usa las herramientas para datos frescos):\n"
                f"{json.dumps(req.context, ensure_ascii=False, indent=2)}"
            )

        messages: list[dict] = [{"role": "system", "content": system}]
        for m in req.messages:
            messages.append({"role": m.role, "content": m.content})

        # Agentic loop: model → tools → model … hasta respuesta final
        for _ in range(MAX_TOOL_ROUNDS):
            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )
            choice = response.choices[0]
            msg = choice.message
            finish_reason = choice.finish_reason

            if finish_reason != "tool_calls" or not msg.tool_calls:
                # Respuesta final del modelo
                return {"success": True, "message": msg.content or ""}

            # Construir el mensaje del asistente con tool_calls para appendear
            assistant_dict: dict = {
                "role": "assistant",
                "content": msg.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        },
                    }
                    for tc in msg.tool_calls
                ],
            }
            messages.append(assistant_dict)

            # Ejecutar cada herramienta solicitada
            for tc in msg.tool_calls:
                try:
                    args = json.loads(tc.function.arguments) if tc.function.arguments else {}
                except json.JSONDecodeError:
                    args = {}
                result = execute_tool(tc.function.name, args, req.jwt_token)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result,
                })

        # Demasiadas rondas de herramientas
        return {
            "success": True,
            "message": "Procesé varias consultas a los datos. ¿Podrías reformular tu pregunta de forma más específica?",
        }

    except Exception as e:
        msg_str = str(e)
        if "api key" in msg_str.lower() or "authentication" in msg_str.lower() or "401" in msg_str:
            raise HTTPException(
                status_code=401,
                detail="API key de Groq inválida. Configura GROQ_API_KEY en ai-service/.env",
            )
        if "rate limit" in msg_str.lower() or "429" in msg_str:
            raise HTTPException(status_code=429, detail="Límite de Groq alcanzado. Intenta en unos segundos.")
        raise HTTPException(status_code=500, detail=msg_str)


@app.post("/api/insights")
async def generar_insights(req: InsightRequest):
    try:
        prompts = {
            "ventas": "Analiza estos datos de ventas y proporciona exactamente 3 insights clave con recomendaciones concretas y accionables:",
            "inventario": "Analiza este estado del inventario y señala los 3 puntos más críticos que requieren atención inmediata, con acciones concretas:",
            "general": "Analiza este resumen del negocio y proporciona las 3 acciones más importantes a tomar para mejorar los resultados:",
        }
        prompt = prompts.get(req.tipo, prompts["general"])

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"{prompt}\n\nDatos:\n{json.dumps(req.datos, ensure_ascii=False, indent=2)}",
                },
            ],
        )

        return {"success": True, "insight": response.choices[0].message.content}

    except Exception as e:
        msg_str = str(e)
        if "rate limit" in msg_str.lower() or "429" in msg_str:
            raise HTTPException(status_code=429, detail="Límite de Groq alcanzado.")
        raise HTTPException(status_code=500, detail=msg_str)


@app.post("/api/packs-recomendacion")
async def recomendar_packs(req: PacksRequest):
    try:
        user_content = f"""Analiza el siguiente catálogo de la Licorería Chilalo en Piura y propone packs comerciales al estilo Tambo+.

PRODUCTOS DISPONIBLES (con stock actual):
{json.dumps(req.productos, ensure_ascii=False, indent=2)}

PACKS YA EXISTENTES EN LA TIENDA (no duplicar):
{json.dumps(req.packs_existentes, ensure_ascii=False, indent=2) if req.packs_existentes else "Ninguno aún."}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{{
  "packs_sugeridos": [
    {{
      "nombre": "Pack Chill Verano",
      "descripcion": "Descripción breve y atractiva",
      "productos": [
        {{"nombre": "Nombre exacto del producto", "cantidad": 1, "precio_unitario": 25.90}},
        {{"nombre": "Nombre exacto del producto", "cantidad": 1, "precio_unitario": 8.50}}
      ],
      "precio_individual_total": 34.40,
      "precio_pack_sugerido": 31.90,
      "descuento_porcentaje": 7,
      "margen_estimado": "Para calcular en base a precios de compra disponibles"
    }}
  ],
  "productos_a_comprar": [
    {{
      "nombre": "Producto sugerido a comprar",
      "motivo": "Por qué conviene tenerlo para packs",
      "cantidad_minima_sugerida": 24
    }}
  ]
}}"""

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": PACKS_PROMPT},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        data = json.loads(raw)
        return {"success": True, "recomendaciones": data}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="La IA devolvió un formato inesperado.")
    except Exception as e:
        msg_str = str(e)
        if "rate limit" in msg_str.lower() or "429" in msg_str:
            raise HTTPException(status_code=429, detail="Límite de Groq alcanzado.")
        raise HTTPException(status_code=500, detail=msg_str)


@app.post("/api/upsell")
async def sugerir_upsell(req: UpsellRequest):
    """Sugiere productos complementarios para aumentar el ticket del carrito actual (POS)."""
    try:
        # Obtener productos disponibles del backend para sugerencias precisas
        productos_disponibles = []
        if req.jwt_token:
            data = _backend_get("/api/v1/productos?activo=true&size=100", req.jwt_token)
            content = (data.get("data") or {}).get("content", []) if isinstance(data.get("data"), dict) else []
            productos_disponibles = [
                {
                    "nombre": p.get("nombre"),
                    "precioVenta": p.get("precioVenta"),
                    "stockActual": p.get("stockActual", 0),
                    "categoria": p.get("categoriaNombre", ""),
                }
                for p in content
                if (p.get("stockActual") or 0) > 0
            ]

        cart_text = json.dumps(req.cart_items, ensure_ascii=False, indent=2)
        productos_text = (
            json.dumps(productos_disponibles[:60], ensure_ascii=False)
            if productos_disponibles
            else "No disponible"
        )

        prompt = f"""El cliente tiene estos productos en el carrito de la Licorería Chilalo:
{cart_text}

Productos disponibles en tienda con stock:
{productos_text}

Sugiere entre 2 y 3 productos complementarios para hacer upsell/cross-sell (mezcladores, hielo, snacks, vasos desechables, etc.).
Prioriza productos que estén en la lista de disponibles. Si no hay complementos claros en la lista, sugiere nombres genéricos con precio estimado.

Responde ÚNICAMENTE con JSON:
{{
  "sugerencias": [
    {{
      "nombre": "nombre exacto del producto disponible o genérico",
      "razon": "por qué complementa el carrito (máx 10 palabras)",
      "precioVenta": 5.50
    }}
  ]
}}"""

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Eres un vendedor experto de licorería peruana. Sugiere complementos naturales que aumenten el ticket de venta.",
                },
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        data = json.loads(raw)
        return {"success": True, "sugerencias": data.get("sugerencias", [])}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Formato inesperado del modelo.")
    except Exception as e:
        msg_str = str(e)
        if "rate limit" in msg_str.lower() or "429" in msg_str:
            raise HTTPException(status_code=429, detail="Límite de Groq alcanzado.")
        raise HTTPException(status_code=500, detail=msg_str)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
