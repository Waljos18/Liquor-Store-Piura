import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchVentas, anularVenta, type VentaDTO } from '../api/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (s: string) => {
  try {
    const d = new Date(s);
    return d.toLocaleString('es-PE');
  } catch {
    return s;
  }
};

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

export const Ventas = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [anulando, setAnulando] = useState<number | null>(null);

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    setLoading(true);
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 19) + 'Z';
    const fin = hoy.toISOString().slice(0, 19) + 'Z';
    const res = await fetchVentas({ fechaDesde: inicio, fechaFin: fin, size: 100 });
    if (res.success && res.data?.content) setVentas(res.data.content);
    setLoading(false);
  };

  const handleAnular = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm('¿Anular esta venta? Se restaurará el stock.')) return;
    setAnulando(id);
    const res = await anularVenta(id);
    setAnulando(null);
    if (res.success) loadVentas();
    else alert(res.error?.message ?? 'Error al anular');
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Ventas y Comprobantes</h2>

      <Card>
        <CardHeader>
          <CardTitle>Listado de ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-text-secondary">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2">N° Venta</th>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Forma pago</th>
                    <th className="py-2">Estado</th>
                    {isAdmin && <th className="py-2">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => (
                    <tr key={v.id} className="border-b border-border">
                      <td className="py-2 font-medium">{v.numeroVenta}</td>
                      <td className="py-2">{formatDate(v.fecha)}</td>
                      <td className="py-2">{v.cliente?.nombre ?? '-'}</td>
                      <td className="py-2">{formatSoles(v.total)}</td>
                      <td className="py-2">{v.formaPago}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            v.estado === 'COMPLETADA'
                              ? 'bg-green-100 text-green-800'
                              : v.estado === 'ANULADA'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100'
                          }`}
                        >
                          {v.estado}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-2">
                          {v.estado === 'COMPLETADA' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAnular(v.id)}
                              disabled={anulando === v.id}
                            >
                              {anulando === v.id ? 'Anulando...' : 'Anular'}
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!ventas.length && <p className="py-4 text-text-secondary">No hay ventas</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
