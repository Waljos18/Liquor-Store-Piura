import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DollarSign, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import {
  fetchDashboard,
  fetchReporteVentas,
  fetchProductosMasVendidos,
  fetchStockBajo,
} from '../api/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-');
  return `${day}/${m}`;
};

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

export const Dashboard = () => {
  const [dashboard, setDashboard] = useState<{
    ventasHoy: number;
    transaccionesHoy: number;
    productosActivos: number;
    productosStockBajo: number;
    productosProximosVencer: number;
  } | null>(null);
  const [reporteVentas, setReporteVentas] = useState<{
    ventasPorDia: { fecha: string; total: number; transacciones: number }[];
    totalVentas: number;
    ticketPromedio: number;
  } | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    { nombreProducto: string; cantidadVendida: number; totalVentas: number }[]
  >([]);
  const [stockBajo, setStockBajo] = useState<{ nombre: string; stockActual: number; stockMinimo: number }[]>([]);
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
      const [dashRes, repRes, prodRes, stockRes] = await Promise.all([
        fetchDashboard(),
        fetchReporteVentas(getFechas().inicio, getFechas().fin),
        fetchProductosMasVendidos(getFechas().inicio, getFechas().fin, 5),
        fetchStockBajo(),
      ]);

      if (cancelled) return;

      if (dashRes.success && dashRes.data) setDashboard(dashRes.data);
      if (repRes.success && repRes.data) {
        setReporteVentas({
          ventasPorDia: repRes.data.ventasPorDia,
          totalVentas: repRes.data.totalVentas,
          ticketPromedio: repRes.data.ticketPromedio,
        });
      }
      if (prodRes.success && prodRes.data)
        setProductosMasVendidos(prodRes.data.map((p) => ({ nombreProducto: p.nombreProducto, cantidadVendida: p.cantidadVendida, totalVentas: p.totalVentas })));
      if (stockRes.success && stockRes.data)
        setStockBajo(stockRes.data.map((p) => ({ nombre: p.nombre, stockActual: p.stockActual, stockMinimo: p.stockMinimo ?? 0 })));

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [periodo]);

  const stats = [
    {
      label: 'Ventas Hoy',
      value: dashboard ? formatSoles(dashboard.ventasHoy) : '-',
      sub: `${dashboard?.transaccionesHoy ?? 0} transacciones`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      label: 'Productos',
      value: String(dashboard?.productosActivos ?? '-'),
      sub: 'Activos',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      label: 'Stock Bajo',
      value: String(dashboard?.productosStockBajo ?? '-'),
      sub: 'Productos',
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      label: 'Próx. Vencer',
      value: String(dashboard?.productosProximosVencer ?? '-'),
      sub: 'Productos',
      icon: ShoppingCart,
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex bg-surface rounded border border-border overflow-hidden">
          {(['hoy', 'semana', 'mes'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 text-sm ${periodo === p ? 'bg-primary text-white' : 'hover:bg-background'}`}
            >
              {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="text-2xl font-bold my-1">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.sub}</p>
                  </div>
                  <div className="p-3 rounded-full bg-surface border border-border">
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Día</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {reporteVentas?.ventasPorDia?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reporteVentas.ventasPorDia.map((v) => ({ ...v, fechaLabel: formatDate(v.fecha) }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fechaLabel" />
                      <YAxis tickFormatter={(v) => `S/ ${v}`} />
                      <Tooltip formatter={(v: number) => [formatSoles(v), 'Total']} />
                      <Line type="monotone" dataKey="total" stroke="#1976D2" strokeWidth={2} name="Total" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary">
                    No hay datos para el período seleccionado
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {productosMasVendidos.length ? (
                    productosMasVendidos.map((p, i) => (
                      <li key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{p.nombreProducto}</p>
                          <p className="text-sm text-text-secondary">{p.cantidadVendida} unidades</p>
                        </div>
                        <span className="font-bold">{formatSoles(p.totalVentas)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-text-secondary">Sin datos</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productos con Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              {stockBajo.length ? (
                <ul className="flex flex-col gap-2">
                  {stockBajo.slice(0, 5).map((p, i) => (
                    <li key={i} className="flex justify-between items-center py-1">
                      <span>{p.nombre}</span>
                      <span className="text-warning font-medium">
                        Stock: {p.stockActual} (mín: {p.stockMinimo})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-secondary">No hay productos con stock bajo</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
