import React, { useEffect, useState } from 'react';
import { DollarSign, Package, AlertTriangle, ShoppingCart, Tag, TrendingUp } from 'lucide-react';
import {
  fetchDashboard,
  fetchReporteVentas,
  fetchProductosMasVendidos,
  fetchStockBajo,
  fetchPacks,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatDate = (d: string) => {
  const [, m, day] = d.split('-');
  return `${day}/${m}`;
};

const formatSoles = (n: number | string | undefined | null): string => {
  const num = typeof n === 'number' && !Number.isNaN(n) ? n : Number(n);
  return `S/ ${(Number.isNaN(num) ? 0 : num).toFixed(2)}`;
};

/* ── Tooltip personalizado ──────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: {
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

export const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [dashboard, setDashboard] = useState<{
    ventasHoy: number;
    gananciasHoy?: number;
    transaccionesHoy: number;
    productosActivos: number;
    productosStockBajo: number;
    productosProximosVencer: number;
  } | null>(null);
  const [reporteVentas, setReporteVentas] = useState<{
    ventasPorDia: { fecha: string; total: number; transacciones: number }[];
    totalVentas: number;
    totalTransacciones: number;
    ticketPromedio: number;
    ganancias?: number;
  } | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    { nombreProducto: string; cantidadVendida: number; totalVentas: number }[]
  >([]);
  const [stockBajo, setStockBajo] = useState<{ nombre: string; stockActual: number; stockMinimo: number }[]>([]);
  const [packsActivos, setPacksActivos] = useState<number>(0);
  const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes'>('semana');
  const [loading, setLoading] = useState(true);

  const getFechas = () => {
    const hoy = new Date();
    let inicio: Date, fin: Date;
    if (periodo === 'hoy') {
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      fin = new Date(hoy);
    } else if (periodo === 'semana') {
      fin = new Date(hoy);
      inicio = new Date(hoy);
      inicio.setDate(inicio.getDate() - 6);
    } else {
      fin = new Date(hoy);
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    }
    return {
      inicio: inicio.toISOString().slice(0, 10),
      fin: fin.toISOString().slice(0, 10),
    };
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const fechas = getFechas();
      const agrupacion = periodo === 'hoy' ? 'DIA' : periodo === 'semana' ? 'SEMANA' : 'MES';

      // Reportes financieros detallados solo disponibles para ADMIN
      const baseRequests = [
        fetchDashboard(),
        fetchStockBajo(),
        fetchPacks({ soloActivos: true, size: 100 }),
      ] as const;
      const adminRequests = isAdmin
        ? [
            fetchReporteVentas(fechas.inicio, fechas.fin, agrupacion),
            fetchProductosMasVendidos(fechas.inicio, fechas.fin, 5),
          ] as const
        : [];

      const [dashRes, stockRes, packsRes, ...adminRes] = await Promise.all([
        ...baseRequests,
        ...adminRequests,
      ]);

      if (cancelled) return;

      if (dashRes.success && dashRes.data) setDashboard(dashRes.data);
      if (stockRes.success && stockRes.data)
        setStockBajo(stockRes.data.map((p) => ({ nombre: p.nombre, stockActual: p.stockActual, stockMinimo: p.stockMinimo ?? 0 })));
      if (packsRes.success && packsRes.data)
        setPacksActivos(packsRes.data.content?.length ?? 0);

      if (isAdmin) {
        const [repRes, prodRes] = adminRes as [typeof adminRes[0], typeof adminRes[1]];
        if (repRes?.success && repRes.data) {
          setReporteVentas({
            ventasPorDia: repRes.data.ventasPorDia,
            totalVentas: repRes.data.totalVentas,
            totalTransacciones: repRes.data.totalTransacciones ?? 0,
            ticketPromedio: repRes.data.ticketPromedio,
            ganancias: repRes.data.ganancias,
          });
        }
        if (prodRes?.success && prodRes.data)
          setProductosMasVendidos(prodRes.data.map((p) => ({ nombreProducto: p.nombreProducto, cantidadVendida: p.cantidadVendida, totalVentas: p.totalVentas })));
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [periodo]);

  const ventasLabel = periodo === 'hoy' ? 'Ventas hoy' : periodo === 'semana' ? 'Ventas de la semana' : 'Ventas del mes';
  const ventasValue = periodo === 'hoy'
    ? (dashboard != null ? formatSoles(dashboard.ventasHoy) : '-')
    : (reporteVentas != null ? formatSoles(reporteVentas.totalVentas) : '-');
  const ventasSub = periodo === 'hoy'
    ? `${dashboard?.transaccionesHoy ?? 0} transacciones`
    : `${reporteVentas?.totalTransacciones ?? 0} transacciones`;

  const segundaLabel = periodo === 'hoy' ? 'Ganancias hoy' : periodo === 'semana' ? 'Ganancias de la semana' : 'Ganancias del mes';
  const segundaValue = periodo === 'hoy'
    ? (dashboard != null ? formatSoles(dashboard.gananciasHoy) : '-')
    : (reporteVentas != null ? formatSoles(reporteVentas.ganancias) : '-');

  const stats = [
    { label: ventasLabel,    value: ventasValue,                                    sub: ventasSub,                     icon: DollarSign,     color: '#2563EB' },
    { label: segundaLabel,   value: segundaValue,                                   sub: 'Venta − Compra (incl. packs)', icon: TrendingUp,     color: '#16A34A' },
    { label: 'Packs activos',value: String(packsActivos),                           sub: 'Combos disponibles',          icon: Tag,            color: '#8B5CF6' },
    { label: 'Productos',    value: String(dashboard?.productosActivos ?? '-'),     sub: 'Activos',                     icon: Package,        color: '#0284C7' },
    { label: 'Stock Bajo',   value: String(dashboard?.productosStockBajo ?? '-'),   sub: 'Productos',                   icon: AlertTriangle,  color: '#D97706' },
    { label: 'Próx. Vencer', value: String(dashboard?.productosProximosVencer ?? '-'), sub: 'Productos',               icon: ShoppingCart,   color: '#DC2626' },
  ];

  /* Max de ventas para barras de progreso */
  const maxVentas = productosMasVendidos.reduce((m, p) => Math.max(m, p.totalVentas), 0);
  const BAR_COLORS = ['#2563EB', '#F97316', '#16A34A', '#8B5CF6', '#0284C7'];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Resumen operacional de la licorería</p>
        </div>
        <div className="tabs-bar">
          {(['hoy', 'semana', 'mes'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`tab-btn ${periodo === p ? 'active' : ''}`}
            >
              {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="skeleton h-72 rounded-xl" />
            <div className="skeleton h-72 rounded-xl" />
          </div>
          <div className="skeleton h-48 rounded-xl" />
        </>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="kpi-card"
                style={{ '--kpi-accent': stat.color } as React.CSSProperties}
              >
                <div className="kpi-top">
                  <p className="kpi-label">{stat.label}</p>
                  <div className="kpi-icon" style={{ background: `${stat.color}14` }}>
                    <stat.icon size={15} style={{ color: stat.color }} />
                  </div>
                </div>
                <div>
                  <p className="kpi-value">{stat.value}</p>
                  <p className="kpi-sub">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row — solo ADMIN ve reportes financieros */}
          {isAdmin && <div className="grid gap-5 md:grid-cols-2">

            {/* ── Gráfica de área: Ventas ── */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="card-title">
                  {periodo === 'hoy' ? 'Ventas de hoy' : periodo === 'semana' ? 'Ventas — últimos 7 días' : 'Ventas del mes'}
                </h3>
                <span className="badge badge-primary">
                  {reporteVentas ? formatSoles(reporteVentas.totalVentas) : '-'}
                </span>
              </div>
              <div className="card-content" style={{ height: 256 }}>
                {reporteVentas?.ventasPorDia?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={reporteVentas.ventasPorDia.map((v) => ({ ...v, fechaLabel: formatDate(v.fecha) }))}
                      margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="dashVentasGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.20} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
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
                        tickFormatter={(v) => `S/${v}`}
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                        width={54}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '5 5' }} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#2563EB"
                        strokeWidth={2.5}
                        fill="url(#dashVentasGrad)"
                        dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                    No hay datos para el período
                  </div>
                )}
              </div>
            </div>

            {/* ── Más Vendidos con barras de progreso ── */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Más Vendidos</h3>
              </div>
              <div className="card-content">
                {productosMasVendidos.length ? (
                  <ul className="space-y-4">
                    {productosMasVendidos.map((p, i) => {
                      const barPct = maxVentas > 0 ? (p.totalVentas / maxVentas) * 100 : 0;
                      const color = BAR_COLORS[i % BAR_COLORS.length];
                      return (
                        <li key={i} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                              style={{ background: `${color}18`, color }}
                            >
                              {i + 1}
                            </span>
                            <p className="flex-1 text-sm font-semibold truncate min-w-0">{p.nombreProducto}</p>
                            <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--color-text-main)' }}>
                              {formatSoles(p.totalVentas)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pl-9">
                            <div
                              className="flex-1 rounded-full h-1.5"
                              style={{ background: 'var(--color-border)' }}
                            >
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${barPct}%`,
                                  background: color,
                                  opacity: 0.75,
                                  transition: 'width 0.5s ease',
                                }}
                              />
                            </div>
                            <span className="text-xs w-14 text-right" style={{ color: 'var(--color-text-tertiary)' }}>
                              {p.cantidadVendida} uds
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Sin datos en el período
                  </p>
                )}
              </div>
            </div>
          </div>}

          {/* Stock bajo */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
              <h3 className="card-title">Productos con Stock Bajo</h3>
              {stockBajo.length > 0 && (
                <span className="badge badge-warning ml-auto">{stockBajo.length}</span>
              )}
            </div>
            <div className="card-content">
              {stockBajo.length ? (
                <ul className="divide-y divide-border">
                  {stockBajo.slice(0, 5).map((p, i) => {
                    const pct = p.stockMinimo > 0 ? Math.min((p.stockActual / p.stockMinimo) * 100, 100) : 0;
                    return (
                      <li key={i} className="flex items-center gap-3 py-2.5">
                        <span className="text-sm font-medium flex-1">{p.nombre}</span>
                        {/* Mini barra de stock */}
                        <div className="w-20 rounded-full h-1.5 hidden sm:block" style={{ background: 'var(--color-border)' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: p.stockActual <= 0 ? '#DC2626' : p.stockActual <= p.stockMinimo ? '#D97706' : '#16A34A',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${p.stockActual <= 0 ? 'badge-error' : 'badge-warning'}`}>
                            {p.stockActual <= 0 ? 'Agotado' : `${p.stockActual} uds`}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            mín: {p.stockMinimo}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Todo el inventario está en niveles normales
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
