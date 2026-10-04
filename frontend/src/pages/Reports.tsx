import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Download,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import {
  fetchReporteVentas,
  fetchProductosMasVendidos,
  descargarReporteVentasPDF,
  descargarReporteInventarioPDF,
} from '../api/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

/* ── Paleta alineada con el design system ───────────────────── */
const COLORS = ['#2563EB', '#F97316', '#16A34A', '#8B5CF6', '#0284C7', '#DC2626', '#D97706', '#64748B'];

const formatDate = (d: string) => {
  const parts = d.split('-');
  return `${parts[2]}/${parts[1]}`;
};
const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

type Preset = 'hoy' | 'semana' | 'mes' | 'personalizado';

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function getPresetFechas(preset: Preset, customInicio?: string, customFin?: string) {
  const hoy = new Date();
  if (preset === 'hoy') return { inicio: toISO(hoy), fin: toISO(hoy) };
  if (preset === 'semana') {
    const ini = new Date(hoy);
    ini.setDate(ini.getDate() - 6);
    return { inicio: toISO(ini), fin: toISO(hoy) };
  }
  if (preset === 'mes') {
    return { inicio: toISO(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), fin: toISO(hoy) };
  }
  return { inicio: customInicio ?? toISO(hoy), fin: customFin ?? toISO(hoy) };
}

/* ── Tooltip personalizado para BarChart ────────────────────── */
const BarTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '8px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#2563EB', fontWeight: 700 }}>{formatSoles(payload[0].value)}</p>
    </div>
  );
};

/* ── Tooltip para Pie ────────────────────────────────────────── */
const PieTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '8px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 2 }}>{payload[0].name}</p>
      <p style={{ color: '#2563EB', fontWeight: 700 }}>{formatSoles(payload[0].value)}</p>
    </div>
  );
};

export const Reports = () => {
  const hoy = toISO(new Date());
  const [preset, setPreset] = useState<Preset>('semana');
  const [customInicio, setCustomInicio] = useState(hoy);
  const [customFin, setCustomFin] = useState(hoy);

  const [reporte, setReporte] = useState<{
    totalVentas: number;
    totalTransacciones: number;
    ticketPromedio: number;
    ganancias?: number;
    totalGastos?: number;
    gananciaNeta?: number;
    ventasPorDia: { fecha: string; total: number; transacciones: number }[];
    ventasPorFormaPago: { formaPago: string; total: number; cantidad: number }[];
    ventasPorCategoria?: { categoria: string; total: number; cantidadVendida: number }[];
    ventasPorVendedor?: { vendedor: string; rol: string; totalVentas: number; transacciones: number; ticketPromedio: number }[];
  } | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    { nombreProducto: string; cantidadVendida: number; totalVentas: number; porcentajeDelTotal: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = async (p: Preset, cIni?: string, cFin?: string) => {
    setLoading(true);
    const { inicio, fin } = getPresetFechas(p, cIni, cFin);
    const [repRes, prodRes] = await Promise.all([
      fetchReporteVentas(inicio, fin),
      fetchProductosMasVendidos(inicio, fin, 10),
    ]);
    if (repRes.success && repRes.data) setReporte(repRes.data);
    if (prodRes.success && prodRes.data) setProductosMasVendidos(prodRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load('semana');
  }, []);

  const handlePreset = (p: Preset) => {
    setPreset(p);
    if (p !== 'personalizado') load(p);
  };

  const handleBuscar = () => load('personalizado', customInicio, customFin);

  const handleDescargarVentasPDF = async () => {
    const { inicio, fin } = getPresetFechas(preset, customInicio, customFin);
    setDownloading('ventas');
    try { await descargarReporteVentasPDF(inicio, fin); } finally { setDownloading(null); }
  };

  const handleDescargarInventarioPDF = async () => {
    setDownloading('inventario');
    try { await descargarReporteInventarioPDF(); } finally { setDownloading(null); }
  };

  /* ── KPI cards config ───────────────────────────────────────── */
  const kpiCards = reporte ? [
    {
      label: 'Total ventas',
      value: formatSoles(reporte.totalVentas),
      sub: `${reporte.totalTransacciones} transacciones`,
      icon: DollarSign,
      color: '#2563EB',
    },
    {
      label: 'Ticket promedio',
      value: formatSoles(reporte.ticketPromedio),
      sub: 'Por venta',
      icon: ShoppingCart,
      color: '#0284C7',
    },
    {
      label: 'Ganancia bruta',
      value: reporte.ganancias != null ? formatSoles(reporte.ganancias) : '-',
      sub: reporte.totalVentas > 0 && reporte.ganancias != null
        ? `Margen: ${((reporte.ganancias / reporte.totalVentas) * 100).toFixed(1)}%`
        : 'Venta − Compra',
      icon: TrendingUp,
      color: '#16A34A',
    },
    ...(reporte.totalGastos != null ? [{
      label: 'Gastos operativos',
      value: formatSoles(reporte.totalGastos),
      sub: 'Del período',
      icon: Wallet,
      color: '#DC2626',
    }] : []),
    ...(reporte.gananciaNeta != null ? [{
      label: 'Ganancia neta',
      value: formatSoles(reporte.gananciaNeta),
      sub: 'Ganancia − Gastos',
      icon: reporte.gananciaNeta >= 0 ? TrendingUp : TrendingDown,
      color: reporte.gananciaNeta >= 0 ? '#16A34A' : '#D97706',
    }] : []),
  ] : [];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Encabezado ── */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="page-title">Reportes</h2>
          <p className="page-subtitle">Análisis de ventas e indicadores del período</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="tabs-bar">
            {(['hoy', 'semana', 'mes', 'personalizado'] as Preset[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePreset(p)}
                className={`tab-btn ${preset === p ? 'active' : ''}`}
              >
                {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Semana' : p === 'mes' ? 'Mes' : 'Rango'}
              </button>
            ))}
          </div>
          {preset === 'personalizado' && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={customInicio}
                max={customFin}
                onChange={(e) => setCustomInicio(e.target.value)}
                className="px-2 py-1.5 border border-border rounded text-sm bg-surface"
              />
              <span className="text-text-secondary text-sm">–</span>
              <input
                type="date"
                value={customFin}
                min={customInicio}
                max={hoy}
                onChange={(e) => setCustomFin(e.target.value)}
                className="px-2 py-1.5 border border-border rounded text-sm bg-surface"
              />
              <Button size="sm" onClick={handleBuscar} disabled={loading}>Buscar</Button>
            </div>
          )}
          <Button variant="outline" onClick={handleDescargarVentasPDF} disabled={!!downloading}>
            <Download size={16} className="mr-1" />
            {downloading === 'ventas' ? 'Descargando...' : 'Ventas PDF'}
          </Button>
          <Button variant="outline" onClick={handleDescargarInventarioPDF} disabled={!!downloading}>
            <Download size={16} className="mr-1" />
            {downloading === 'inventario' ? 'Descargando...' : 'Inventario PDF'}
          </Button>
        </div>
      </div>

      {loading ? (
        /* ── Skeleton carga ── */
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="skeleton h-56 rounded-xl" />
            <div className="skeleton h-56 rounded-xl" />
          </div>
          <div className="skeleton h-48 rounded-xl" />
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((k, i) => (
              <div
                key={i}
                className="kpi-card"
                style={{ '--kpi-accent': k.color } as React.CSSProperties}
              >
                <div className="kpi-top">
                  <p className="kpi-label">{k.label}</p>
                  <div className="kpi-icon" style={{ background: `${k.color}14` }}>
                    <k.icon size={15} style={{ color: k.color }} />
                  </div>
                </div>
                <div>
                  <p className="kpi-value" style={{ color: k.color }}>{k.value}</p>
                  <p className="kpi-sub">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Ventas por día — BarChart con gradiente ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ventas por día</CardTitle>
                {reporte && (
                  <span className="badge badge-primary">{formatSoles(reporte.totalVentas)}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {reporte?.ventasPorDia?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reporte.ventasPorDia.map((v) => ({ ...v, fechaLabel: formatDate(v.fecha) }))}
                      margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="barVentasGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.90} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0.50} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="fechaLabel"
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `S/ ${v}`}
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                        width={58}
                      />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--color-primary-muted)' }} />
                      <Bar
                        dataKey="total"
                        fill="url(#barVentasGrad)"
                        name="Total"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary">No hay datos</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Donuts: Forma de pago + Categoría ── */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* Forma de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Por forma de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {reporte?.ventasPorFormaPago?.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reporte.ventasPorFormaPago}
                          dataKey="total"
                          nameKey="formaPago"
                          cx="50%"
                          cy="45%"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={2}
                          stroke="transparent"
                        >
                          {reporte.ventasPorFormaPago.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => (
                            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-text-secondary">No hay datos</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Por categoría */}
            <Card>
              <CardHeader>
                <CardTitle>Por categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {reporte?.ventasPorCategoria?.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reporte.ventasPorCategoria}
                          dataKey="total"
                          nameKey="categoria"
                          cx="50%"
                          cy="45%"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={2}
                          stroke="transparent"
                        >
                          {reporte.ventasPorCategoria.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => (
                            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-text-secondary">No hay datos</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Detalle por categoría ── */}
          {reporte?.ventasPorCategoria && reporte.ventasPorCategoria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalle por categoría</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-2 px-4 font-medium text-text-secondary">Categoría</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">Unidades</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">Total</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">% ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.ventasPorCategoria.map((c, i) => {
                      const pct = reporte.totalVentas > 0
                        ? ((c.total / reporte.totalVentas) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                              {c.categoria}
                            </div>
                          </td>
                          <td className="py-2 px-4 text-right">{c.cantidadVendida}</td>
                          <td className="py-2 px-4 text-right font-semibold">{formatSoles(c.total)}</td>
                          <td className="py-2 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-border rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full"
                                  style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                                />
                              </div>
                              <span className="text-text-secondary w-10 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* ── Ventas por vendedor ── */}
          {reporte?.ventasPorVendedor && reporte.ventasPorVendedor.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ventas por vendedor</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-2 px-4 font-medium text-text-secondary">Vendedor</th>
                      <th className="text-left py-2 px-4 font-medium text-text-secondary">Rol</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">Transacciones</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">Total</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">Ticket prom.</th>
                      <th className="text-right py-2 px-4 font-medium text-text-secondary">% ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.ventasPorVendedor.map((v, i) => {
                      const pct = reporte.totalVentas > 0
                        ? ((v.totalVentas / reporte.totalVentas) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-2 px-4 font-medium">{v.vendedor}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              v.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>{v.rol}</span>
                          </td>
                          <td className="py-2 px-4 text-right">{v.transacciones}</td>
                          <td className="py-2 px-4 text-right font-semibold">{formatSoles(v.totalVentas)}</td>
                          <td className="py-2 px-4 text-right">{formatSoles(v.ticketPromedio)}</td>
                          <td className="py-2 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-border rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-text-secondary w-8 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* ── Top 10 productos ── */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="text-left py-2 px-4 font-medium text-text-secondary">#</th>
                    <th className="text-left py-2 px-4 font-medium text-text-secondary">Producto</th>
                    <th className="text-right py-2 px-4 font-medium text-text-secondary">Cant.</th>
                    <th className="text-right py-2 px-4 font-medium text-text-secondary">Total</th>
                    <th className="text-right py-2 px-4 font-medium text-text-secondary">%</th>
                  </tr>
                </thead>
                <tbody>
                  {productosMasVendidos.map((p, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50">
                      <td className="py-2 px-4">
                        <span
                          className="w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-bold"
                          style={{ background: `${COLORS[i % COLORS.length]}18`, color: COLORS[i % COLORS.length] }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2 px-4">{p.nombreProducto}</td>
                      <td className="py-2 px-4 text-right">{p.cantidadVendida}</td>
                      <td className="py-2 px-4 text-right font-semibold">{formatSoles(p.totalVentas)}</td>
                      <td className="py-2 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-border rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${p.porcentajeDelTotal ?? 0}%`,
                                background: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                          <span className="text-text-secondary w-8 text-right">
                            {(p.porcentajeDelTotal ?? 0).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!productosMasVendidos.length && (
                <p className="text-text-secondary py-6 text-center text-sm">No hay datos</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
