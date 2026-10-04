import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, Sparkles, TrendingUp, Package, AlertTriangle,
  Loader2, CheckCircle2, Gift, ShoppingCart, Tag, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  iaChat, iaInsights, iaPacks,
  fetchDashboard, fetchStockBajo, fetchProximosVencer,
  fetchProductosMasVendidos, fetchReporteVentas,
  fetchProductos, fetchPacks, crearPack,
  type ChatMsg, type PacksRecomendacion, type ProductoDTO,
} from '../api/api';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

interface RichContext {
  fecha_actual: string;
  ventas_hoy_soles: number;
  transacciones_hoy: number;
  productos_activos: number;
  productos_stock_bajo: { nombre: string; stock_actual: number; stock_minimo: number }[];
  productos_proximos_vencer: { nombre: string; fecha_vencimiento: string; dias_restantes: number }[];
  top_productos_mes: { nombre: string; cantidad_vendida: number; total_ventas: number }[];
  ventas_ultimos_7_dias: { total: number; transacciones: number; ticket_promedio: number };
  ventas_por_forma_pago: { formaPago: string; total: number; cantidad: number }[];
}

const QUICK_ACTIONS = [
  { label: '¿Cómo van las ventas de hoy?', icon: TrendingUp },
  { label: '¿Qué productos tienen stock crítico?', icon: Package },
  { label: 'Sugiere promociones para este mes', icon: Sparkles },
  { label: 'Dame las acciones prioritarias para hoy', icon: AlertTriangle },
];

function diasHasta(fecha: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const target = new Date(fecha);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - hoy.getTime()) / 86_400_000);
}

function fechaHace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().split('T')[0];
}

export const IA = () => {
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA para la Licorería Chilalo. Puedo analizar ventas, inventario, sugerir promociones y mucho más. ¿En qué te ayudo?',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [iloading, setIloading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [ctx, setCtx] = useState<RichContext | undefined>();
  const [ctxLoading, setCtxLoading] = useState(true);
  const [ctxLastUpdated, setCtxLastUpdated] = useState<Date | null>(null);

  // Packs
  const [tab, setTab] = useState<'chat' | 'packs'>('chat');
  const [packsLoading, setPacksLoading] = useState(false);
  const [packsData, setPacksData] = useState<PacksRecomendacion | null>(null);
  const [packsError, setPacksError] = useState<string | null>(null);
  const [catalogoProductos, setCatalogoProductos] = useState<ProductoDTO[]>([]);
  const [packCreandoIdx, setPackCreandoIdx] = useState<number | null>(null);
  const [packResultados, setPackResultados] = useState<Record<number, { ok: boolean; msg: string }>>({});

  const endRef = useRef<HTMLDivElement>(null);

  const cargarContexto = useCallback(async () => {
    setCtxLoading(true);
    const hoy = new Date().toISOString().split('T')[0];
    const hace7 = fechaHace(7);
    const hace30 = fechaHace(30);

    try {
      const [dash, stockBajo, proxVencer, topProductos, ventasSemana] = await Promise.all([
        fetchDashboard(),
        fetchStockBajo(),
        fetchProximosVencer(),
        fetchProductosMasVendidos(hace30, hoy, 5),
        fetchReporteVentas(hace7, hoy),
      ]);
      const d = dash.success && dash.data ? dash.data : null;
      const sb = stockBajo.success && stockBajo.data ? stockBajo.data : [];
      const pv = proxVencer.success && proxVencer.data ? proxVencer.data : [];
      const tp = topProductos.success && topProductos.data ? topProductos.data : [];
      const vs = ventasSemana.success && ventasSemana.data ? ventasSemana.data : null;

      setCtx({
        fecha_actual: hoy,
        ventas_hoy_soles: d?.ventasHoy ?? 0,
        transacciones_hoy: d?.transaccionesHoy ?? 0,
        productos_activos: d?.productosActivos ?? 0,
        productos_stock_bajo: sb.map(p => ({
          nombre: p.nombre,
          stock_actual: p.stockActual,
          stock_minimo: p.stockMinimo ?? 0,
        })),
        productos_proximos_vencer: pv
          .filter(p => p.fechaVencimiento)
          .map(p => ({
            nombre: p.nombre,
            fecha_vencimiento: p.fechaVencimiento!,
            dias_restantes: diasHasta(p.fechaVencimiento!),
          })),
        top_productos_mes: tp.map(p => ({
          nombre: p.nombreProducto,
          cantidad_vendida: p.cantidadVendida,
          total_ventas: p.totalVentas,
        })),
        ventas_ultimos_7_dias: {
          total: vs?.totalVentas ?? 0,
          transacciones: vs?.totalTransacciones ?? 0,
          ticket_promedio: vs?.ticketPromedio ?? 0,
        },
        ventas_por_forma_pago: vs?.ventasPorFormaPago ?? [],
      });
      setCtxLastUpdated(new Date());
    } finally {
      setCtxLoading(false);
    }
  }, []);

  // Carga inicial + auto-refresh cada 5 minutos
  useEffect(() => {
    cargarContexto();
    const interval = setInterval(cargarContexto, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cargarContexto]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const t = text.trim();
    setMsgs(p => [...p, { role: 'user', content: t }, { role: 'assistant', content: '', loading: true }]);
    setInput('');
    setLoading(true);

    const history: ChatMsg[] = [
      ...msgs.filter(m => !m.loading).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: t },
    ];

    const res = await iaChat(history, ctx as unknown as Record<string, unknown>);
    setMsgs(p => [
      ...p.slice(0, -1),
      { role: 'assistant', content: res.message ?? res.error ?? 'Error al procesar la solicitud.' },
    ]);
    setLoading(false);
  };

  const runInsight = async (tipo: 'ventas' | 'inventario' | 'general') => {
    setIloading(true);
    setInsight(null);

    const datos: Record<string, unknown> = ctx
      ? tipo === 'ventas'
        ? {
            ventas_hoy_soles: ctx.ventas_hoy_soles,
            transacciones_hoy: ctx.transacciones_hoy,
            ventas_ultimos_7_dias: ctx.ventas_ultimos_7_dias,
            ventas_por_forma_pago: ctx.ventas_por_forma_pago,
            top_productos_mes: ctx.top_productos_mes,
          }
        : tipo === 'inventario'
        ? {
            productos_stock_bajo: ctx.productos_stock_bajo,
            productos_proximos_vencer: ctx.productos_proximos_vencer,
            productos_activos: ctx.productos_activos,
          }
        : (ctx as unknown as Record<string, unknown>)
      : {};

    const res = await iaInsights(tipo, datos);
    setInsight(res.insight ?? res.error ?? 'Error al generar el análisis.');
    setIloading(false);
  };

  const generarRecomendacionPacks = async () => {
    setPacksLoading(true);
    setPacksData(null);
    setPacksError(null);

    const [productosRes, packsRes] = await Promise.all([
      fetchProductos({ size: 150, activo: true }),
      fetchPacks({ soloActivos: true, size: 50 }),
    ]);

    const catalogoCompleto = (productosRes.success && productosRes.data?.content)
      ? productosRes.data.content
      : [];
    setCatalogoProductos(catalogoCompleto);
    setPackResultados({});

    const productos = catalogoCompleto.map(p => ({
      nombre: p.nombre,
      precioVenta: p.precioVenta,
      precioCompra: p.precioCompra,
      stockActual: p.stockActual,
    }));

    const packsExistentes = (packsRes.success && packsRes.data?.content)
      ? packsRes.data.content.map(pk => ({
          nombre: pk.nombre,
          productos: pk.productos?.map(pp => pp.producto?.nombre ?? '') ?? [],
          precioPack: pk.precioPack,
        }))
      : [];

    const res = await iaPacks(productos, packsExistentes);
    if (res.success && res.recomendaciones) {
      setPacksData(res.recomendaciones);
    } else {
      setPacksError(res.error ?? 'Error al generar recomendaciones.');
    }
    setPacksLoading(false);
  };

  const crearPackDesdeIA = async (packIdx: number) => {
    if (!packsData) return;
    const sugerido = packsData.packs_sugeridos[packIdx];
    setPackCreandoIdx(packIdx);

    // Buscar cada producto sugerido en el catálogo real (match por nombre)
    const productosMatch = sugerido.productos.flatMap(prod => {
      const n = prod.nombre.toLowerCase().trim();
      const encontrado = catalogoProductos.find(
        p => p.nombre.toLowerCase() === n ||
             p.nombre.toLowerCase().includes(n) ||
             n.includes(p.nombre.toLowerCase())
      );
      return encontrado ? [{ productoId: encontrado.id, cantidad: prod.cantidad }] : [];
    });

    if (productosMatch.length === 0) {
      setPackResultados(prev => ({
        ...prev,
        [packIdx]: { ok: false, msg: 'No se encontraron productos en el catálogo. Crea el pack manualmente.' },
      }));
      setPackCreandoIdx(null);
      return;
    }

    const res = await crearPack({
      nombre: sugerido.nombre,
      precioPack: sugerido.precio_pack_sugerido,
      productos: productosMatch,
    });

    setPackResultados(prev => ({
      ...prev,
      [packIdx]: res.success
        ? { ok: true, msg: `Pack "${sugerido.nombre}" creado correctamente.` }
        : { ok: false, msg: res.error?.message ?? 'Error al crear el pack.' },
    }));
    setPackCreandoIdx(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Bot size={28} /> Asistente IA
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Panel lateral */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Rápido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {(
                [
                  { tipo: 'ventas' as const, label: 'Analizar Ventas', Icon: TrendingUp },
                  { tipo: 'inventario' as const, label: 'Analizar Inventario', Icon: Package },
                  { tipo: 'general' as const, label: 'Resumen del Negocio', Icon: Sparkles },
                ]
              ).map(({ tipo, label, Icon }) => (
                <button
                  key={tipo}
                  onClick={() => { setTab('chat'); runInsight(tipo); }}
                  disabled={iloading || ctxLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-background hover:bg-primary hover:text-white transition-colors text-sm text-left disabled:opacity-50"
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
              {iloading && (
                <div className="flex items-center gap-2 text-sm text-text-secondary pt-1">
                  <Loader2 size={13} className="animate-spin" /> Analizando con IA...
                </div>
              )}
              {insight && !iloading && (
                <div className="mt-1 p-3 bg-background rounded-lg text-xs text-text-secondary whitespace-pre-wrap border border-border max-h-64 overflow-y-auto">
                  {insight}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => { setTab('chat'); send(q.label); }}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background transition-colors text-sm text-left text-text-secondary disabled:opacity-50"
                >
                  <q.icon size={13} className="flex-shrink-0 text-primary" />
                  <span>{q.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Panel principal con tabs */}
        <div className="flex-1 flex flex-col border border-border rounded-lg bg-surface min-w-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab('chat')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === 'chat'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Bot size={15} /> Chat
            </button>
            <button
              onClick={() => setTab('packs')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === 'packs'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Gift size={15} /> Recomendador de Packs
            </button>
          </div>

          {/* Tab: Chat */}
          {tab === 'chat' && (
            <>
              <div
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
                style={{ height: '60vh' }}
              >
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-background border border-border text-text-primary'
                      }`}
                    >
                      {m.loading ? (
                        <span className="flex items-center gap-2 text-text-secondary">
                          <Loader2 size={12} className="animate-spin" /> Pensando...
                        </span>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-4 border-t border-border flex flex-col gap-1">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter para nueva línea)"
                    rows={2}
                    className="flex-1 input resize-none text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    className="btn btn-primary self-end"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-text-secondary">
                    Groq · Llama 3.3 70B · function calling activo
                  </p>
                  <div className="flex items-center gap-2">
                    {ctxLoading ? (
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Loader2 size={11} className="animate-spin" /> Actualizando datos...
                      </span>
                    ) : ctx ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 size={11} />
                        {ctxLastUpdated
                          ? `Datos al ${ctxLastUpdated.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`
                          : 'Datos cargados'}
                      </span>
                    ) : null}
                    <button
                      onClick={cargarContexto}
                      disabled={ctxLoading}
                      title="Actualizar datos del negocio"
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-border hover:bg-background disabled:opacity-50 transition-colors text-text-secondary"
                    >
                      <RefreshCw size={11} className={ctxLoading ? 'animate-spin' : ''} />
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab: Recomendador de Packs */}
          {tab === 'packs' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ minHeight: '60vh' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-text-secondary">
                    La IA analiza tu catálogo completo y genera packs al estilo <strong>Tambo+</strong>
                    {' '}(Licor + Mezclador + Hielo) adaptados a tus precios reales, con descuentos de 8-12%.
                    También indica qué productos te conviene comprar para completar combos.
                  </p>
                </div>
                <button
                  onClick={generarRecomendacionPacks}
                  disabled={packsLoading}
                  className="btn btn-primary whitespace-nowrap flex items-center gap-2 flex-shrink-0"
                >
                  {packsLoading
                    ? <><Loader2 size={15} className="animate-spin" /> Analizando...</>
                    : <><Sparkles size={15} /> Generar Packs</>}
                </button>
              </div>

              {packsError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {packsError}
                </div>
              )}

              {!packsData && !packsLoading && !packsError && (
                <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
                  <div className="text-center flex flex-col items-center gap-3">
                    <Gift size={40} className="opacity-30" />
                    <p>Haz clic en <strong>Generar Packs</strong> para que la IA analice tu inventario<br />y sugiera combos rentables al estilo Tambo+</p>
                  </div>
                </div>
              )}

              {packsData && (
                <div className="flex flex-col gap-6">
                  {/* Packs sugeridos */}
                  <div>
                    <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <Tag size={16} className="text-primary" />
                      Packs Sugeridos ({packsData.packs_sugeridos.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packsData.packs_sugeridos.map((pack, i) => (
                        <div key={i} className="border border-border rounded-lg p-4 bg-background flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm">{pack.nombre}</p>
                              <p className="text-xs text-text-secondary mt-0.5">{pack.descripcion}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                              -{pack.descuento_porcentaje}%
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            {pack.productos.map((prod, j) => (
                              <div key={j} className="flex items-center justify-between text-xs text-text-secondary">
                                <span>• {prod.cantidad > 1 ? `${prod.cantidad}x ` : ''}{prod.nombre}</span>
                                <span>S/ {prod.precio_unitario.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border pt-2 flex items-center justify-between">
                            <div className="text-xs text-text-secondary line-through">
                              S/ {pack.precio_individual_total.toFixed(2)}
                            </div>
                            <div className="font-bold text-primary text-sm">
                              Pack: S/ {pack.precio_pack_sugerido.toFixed(2)}
                            </div>
                          </div>

                          {packResultados[i] ? (
                            <p className={`text-xs mt-1 ${packResultados[i].ok ? 'text-green-600' : 'text-red-600'}`}>
                              {packResultados[i].ok ? '✓ ' : '✗ '}{packResultados[i].msg}
                            </p>
                          ) : (
                            <button
                              onClick={() => crearPackDesdeIA(i)}
                              disabled={packCreandoIdx !== null}
                              className="mt-1 w-full text-xs btn btn-primary py-1.5 flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                              {packCreandoIdx === i
                                ? <><Loader2 size={11} className="animate-spin" /> Creando...</>
                                : <><Package size={11} /> Crear Pack en sistema</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Productos a comprar */}
                  {packsData.productos_a_comprar.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                        <ShoppingCart size={16} className="text-amber-600" />
                        Productos a Comprar al Proveedor
                      </h3>
                      <div className="flex flex-col gap-2">
                        {packsData.productos_a_comprar.map((p, i) => (
                          <div key={i} className="border border-amber-200 bg-amber-50 rounded-lg px-4 py-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-amber-900">{p.nombre}</p>
                              <p className="text-xs text-amber-700 mt-0.5">{p.motivo}</p>
                            </div>
                            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                              Mín. {p.cantidad_minima_sugerida} und.
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
