import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, X, DollarSign, TrendingDown } from 'lucide-react';
import {
  fetchGastos, crearGasto, eliminarGasto,
  type GastoDTO, type CrearGastoRequest,
} from '../api/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = [
  { value: 'SERVICIOS', label: 'Servicios (luz, agua, internet)' },
  { value: 'ALQUILER', label: 'Alquiler' },
  { value: 'SUELDOS', label: 'Sueldos' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'PROVEEDOR', label: 'Pago a proveedor (extra)' },
  { value: 'OTROS', label: 'Otros' },
];

const CAT_COLORS: Record<string, string> = {
  SERVICIOS: 'bg-blue-100 text-blue-800',
  ALQUILER: 'bg-purple-100 text-purple-800',
  SUELDOS: 'bg-green-100 text-green-800',
  MANTENIMIENTO: 'bg-orange-100 text-orange-800',
  PROVEEDOR: 'bg-yellow-100 text-yellow-800',
  OTROS: 'bg-gray-100 text-gray-800',
};

const today = () => new Date().toISOString().split('T')[0];
const firstOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

export const Gastos = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [gastos, setGastos] = useState<GastoDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [desde, setDesde] = useState(firstOfMonth());
  const [hasta, setHasta] = useState(today());

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CrearGastoRequest>({
    descripcion: '', categoria: 'SERVICIOS', monto: 0, fecha: today(),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    const res = await fetchGastos({ desde, hasta, page: p, size: 15 });
    setLoading(false);
    if (res.success && res.data) {
      setGastos(res.data.content);
      setTotal(res.data.totalElements);
      setTotalPages(Math.ceil(res.data.totalElements / 15));
    }
  };

  useEffect(() => { load(0); setPage(0); }, [desde, hasta]);

  const totalMonto = gastos.reduce((s, g) => s + g.monto, 0);

  const handleCrear = async () => {
    if (!form.descripcion.trim()) { setError('Ingresa una descripción'); return; }
    if (!form.monto || form.monto <= 0) { setError('El monto debe ser mayor a 0'); return; }
    setSaving(true);
    setError(null);
    const res = await crearGasto(form);
    setSaving(false);
    if (res.success) {
      setShowModal(false);
      setForm({ descripcion: '', categoria: 'SERVICIOS', monto: 0, fecha: today() });
      load(0); setPage(0);
    } else {
      setError(res.error?.message ?? 'Error al registrar gasto');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    await eliminarGasto(id);
    load(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gastos Operativos</h2>
        {isAdmin && (
          <Button onClick={() => { setShowModal(true); setError(null); }}>
            <Plus size={16} className="mr-1" /> Registrar Gasto
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-text-secondary">Desde</label>
            <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary">Hasta</label>
            <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><TrendingDown size={20} className="text-red-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Total gastos (período)</p>
              <p className="text-xl font-bold text-red-600">S/ {totalMonto.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><DollarSign size={20} className="text-blue-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Registros</p>
              <p className="text-xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><DollarSign size={20} className="text-orange-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Promedio por gasto</p>
              <p className="text-xl font-bold">
                S/ {total > 0 ? (totalMonto / gastos.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de gastos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Cargando...</div>
          ) : gastos.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No hay gastos en el período seleccionado</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium">Descripción</th>
                    <th className="px-4 py-3 text-left font-medium">Categoría</th>
                    <th className="px-4 py-3 text-right font-medium">Monto</th>
                    <th className="px-4 py-3 text-left font-medium">Comprobante</th>
                    <th className="px-4 py-3 text-left font-medium">Registrado por</th>
                    {isAdmin && <th className="px-4 py-3" />}
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((g) => (
                    <tr key={g.id} className="border-b border-border hover:bg-surface/50">
                      <td className="px-4 py-3 whitespace-nowrap">{g.fecha}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{g.descripcion}</p>
                        {g.observaciones && <p className="text-xs text-text-secondary">{g.observaciones}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CAT_COLORS[g.categoria] ?? 'bg-gray-100 text-gray-800'}`}>
                          {CATEGORIAS.find((c) => c.value === g.categoria)?.label.split(' ')[0] ?? g.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">S/ {g.monto.toFixed(2)}</td>
                      <td className="px-4 py-3 text-text-secondary">{g.comprobante ?? '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{g.usuario}</td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEliminar(g.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface font-bold border-t-2 border-border">
                    <td colSpan={3} className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right text-red-600">S/ {totalMonto.toFixed(2)}</td>
                    <td colSpan={isAdmin ? 3 : 2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i); load(i); }}
                  className={`px-3 py-1 rounded text-sm ${i === page ? 'bg-primary text-white' : 'border border-border hover:bg-surface'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Nuevo Gasto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg">Registrar Gasto</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-surface rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Descripción *</label>
                <Input
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Ej: Recibo de luz enero"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Monto (S/) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.monto || ''}
                    onChange={(e) => setForm({ ...form, monto: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha *</label>
                  <Input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Comprobante</label>
                <Input
                  value={form.comprobante ?? ''}
                  onChange={(e) => setForm({ ...form, comprobante: e.target.value })}
                  placeholder="Nro. factura o boleta (opcional)"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Observaciones</label>
                <textarea
                  value={form.observaciones ?? ''}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 h-20 resize-none"
                  placeholder="Notas adicionales..."
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}
            </div>
            <div className="flex gap-3 justify-end p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleCrear} disabled={saving}>
                {saving ? 'Guardando...' : 'Registrar Gasto'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
