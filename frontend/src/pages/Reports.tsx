import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, TrendingUp, Package } from 'lucide-react';
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

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-');
  return `${day}/${m}`;
};

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

const COLORS = ['#1976D2', '#FF6F00', '#4CAF50', '#9C27B0', '#00BCD4'];

export const Reports = () => {
  const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes'>('semana');
  const [reporte, setReporte] = useState<{
    totalVentas: number;
    totalTransacciones: number;
    ticketPromedio: number;
    ventasPorDia: { fecha: string; total: number; transacciones: number }[];
    ventasPorFormaPago: { formaPago: string; total: number; cantidad: number }[];
  } | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    { nombreProducto: string; cantidadVendida: number; totalVentas: number; porcentajeDelTotal: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

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
      const { inicio, fin } = getFechas();
      const [repRes, prodRes] = await Promise.all([
        fetchReporteVentas(inicio, fin),
        fetchProductosMasVendidos(inicio, fin, 10),
      ]);

      if (cancelled) return;

      if (repRes.success && repRes.data) setReporte(repRes.data);
      if (prodRes.success && prodRes.data) setProductosMasVendidos(prodRes.data);

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [periodo]);

  const handleDescargarVentasPDF = async () => {
    const { inicio, fin } = getFechas();
    setDownloading('ventas');
    try {
      await descargarReporteVentasPDF(inicio, fin);
    } finally {
      setDownloading(null);
    }
  };

  const handleDescargarInventarioPDF = async () => {
    setDownloading('inventario');
    try {
      await descargarReporteInventarioPDF();
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Reportes</h2>
        <div className="flex gap-2">
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
          <Button
            variant="outline"
            onClick={handleDescargarVentasPDF}
            disabled={!!downloading}
          >
            <Download size={18} className="mr-2" />
            {downloading === 'ventas' ? 'Descargando...' : 'Ventas PDF'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDescargarInventarioPDF}
            disabled={!!downloading}
          >
            <Download size={18} className="mr-2" />
            {downloading === 'inventario' ? 'Descargando...' : 'Inventario PDF'}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-background rounded border border-border text-center">
                  <p className="text-text-secondary text-sm">Total ventas</p>
                  <p className="text-2xl font-bold text-primary">
                    {reporte ? formatSoles(reporte.totalVentas) : '-'}
                  </p>
                </div>
                <div className="p-4 bg-background rounded border border-border text-center">
                  <p className="text-text-secondary text-sm">Transacciones</p>
                  <p className="text-2xl font-bold">{reporte?.totalTransacciones ?? '-'}</p>
                </div>
                <div className="p-4 bg-background rounded border border-border text-center">
                  <p className="text-text-secondary text-sm">Ticket promedio</p>
                  <p className="text-2xl font-bold">
                    {reporte ? formatSoles(reporte.ticketPromedio) : '-'}
                  </p>
                </div>
              </div>
              <div className="h-64">
                {reporte?.ventasPorDia?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporte.ventasPorDia.map((v) => ({ ...v, fechaLabel: formatDate(v.fecha) }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fechaLabel" />
                      <YAxis tickFormatter={(v) => `S/ ${v}`} />
                      <Tooltip formatter={(v: number) => [formatSoles(v), 'Total']} />
                      <Bar dataKey="total" fill="#1976D2" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary">
                    No hay datos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por forma de pago</CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                {reporte?.ventasPorFormaPago?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reporte.ventasPorFormaPago}
                        dataKey="total"
                        nameKey="formaPago"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ formaPago, total }) =>
                          `${formaPago}: ${formatSoles(total)}`
                        }
                      >
                        {reporte.ventasPorFormaPago.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatSoles(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary">
                    No hay datos
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 productos más vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2">#</th>
                      <th className="py-2">Producto</th>
                      <th className="py-2">Cantidad</th>
                      <th className="py-2">Total</th>
                      <th className="py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosMasVendidos.map((p, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-2">{i + 1}</td>
                        <td className="py-2">{p.nombreProducto}</td>
                        <td className="py-2">{p.cantidadVendida}</td>
                        <td className="py-2">{formatSoles(p.totalVentas)}</td>
                        <td className="py-2">{p.porcentajeDelTotal?.toFixed(1) ?? 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!productosMasVendidos.length && (
                  <p className="text-text-secondary py-4">No hay datos</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
