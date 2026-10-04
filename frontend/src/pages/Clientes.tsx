import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  fetchClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  ajustarPuntosCliente,
  type ClienteDTO,
} from '../api/api';
import {
  Users, Star, TrendingUp, Search, ChevronLeft, ChevronRight,
  Plus, Minus, X, Award, Edit, Trash2, UserPlus,
} from 'lucide-react';

const PAGE_SIZE = 20;

interface PuntosModal {
  cliente: ClienteDTO;
  tipo: 'SUMAR' | 'RESTAR';
}

const FORM_EMPTY = { nombre: '', tipoDocumento: 'DNI', numeroDocumento: '', telefono: '', email: '' };

export const Clientes = () => {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(FORM_EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal puntos
  const [puntosModal, setPuntosModal] = useState<PuntosModal | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchClientes({ search: search || undefined, page, size: PAGE_SIZE });
      if (res.success && res.data) {
        setClientes(res.data.content ?? []);
        setTotal(res.data.totalElements ?? 0);
      } else {
        setError('Error al cargar clientes');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleSearch = () => { setSearch(searchInput); setPage(0); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  // CRUD clientes
  const openNew = () => {
    setEditId(null);
    setForm(FORM_EMPTY);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (c: ClienteDTO) => {
    setEditId(c.id);
    setForm({
      nombre: c.nombre,
      tipoDocumento: c.tipoDocumento ?? 'DNI',
      numeroDocumento: c.numeroDocumento,
      telefono: c.telefono ?? '',
      email: c.email ?? '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => { if (!saving) setModalOpen(false); };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.numeroDocumento.trim()) {
      setFormError('Nombre y número de documento son requeridos');
      return;
    }
    setSaving(true);
    setFormError(null);
    const dto = {
      nombre: form.nombre.trim(),
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento.trim(),
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
    };
    const res = editId
      ? await actualizarCliente(editId, dto)
      : await crearCliente(dto);
    setSaving(false);
    if (res.success) {
      setModalOpen(false);
      cargar();
    } else {
      setFormError(res.error?.message ?? 'Error al guardar');
    }
  };

  const eliminar = async (c: ClienteDTO) => {
    if (!confirm(`¿Eliminar al cliente "${c.nombre}"?`)) return;
    const res = await eliminarCliente(c.id);
    if (res.success) cargar();
    else alert(res.error?.message ?? 'Error al eliminar');
  };

  // Modal puntos
  const abrirModal = (cliente: ClienteDTO, tipo: 'SUMAR' | 'RESTAR') => {
    setPuntosModal({ cliente, tipo });
    setCantidad('');
    setMotivo('');
    setModalError(null);
  };

  const cerrarModal = () => { if (!guardando) setPuntosModal(null); };

  const confirmarAjuste = async () => {
    if (!puntosModal) return;
    const cant = parseInt(cantidad, 10);
    if (isNaN(cant) || cant <= 0) { setModalError('Ingresa una cantidad válida (mayor a 0)'); return; }
    setGuardando(true);
    setModalError(null);
    try {
      const res = await ajustarPuntosCliente(puntosModal.cliente.id!, cant, puntosModal.tipo, motivo);
      if (res.success && res.data) {
        setClientes(prev => prev.map(c => c.id === res.data!.id ? res.data! : c));
        setPuntosModal(null);
      } else {
        setModalError('No se pudo ajustar los puntos');
      }
    } catch {
      setModalError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const clientesConPuntos = clientes.filter(c => (c.puntosFidelizacion ?? 0) > 0).length;
  const totalPuntosPagina = clientes.reduce((s, c) => s + (c.puntosFidelizacion ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión de clientes y fidelización</p>
        </div>
        <Button onClick={openNew}>
          <UserPlus size={16} className="mr-2" />
          Nuevo cliente
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total clientes</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Con puntos (pág.)</p>
                <p className="text-2xl font-bold">{clientesConPuntos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Puntos totales (pág.)</p>
                <p className="text-2xl font-bold">{totalPuntosPagina.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <Input
                className="pl-9"
                placeholder="Buscar por nombre, documento o email..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <Users size={48} className="mx-auto mb-3 opacity-30" />
              <p>No se encontraron clientes</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-background text-left">
                      <th className="px-4 py-3 font-medium text-text-secondary">Cliente</th>
                      <th className="px-4 py-3 font-medium text-text-secondary">Documento</th>
                      <th className="px-4 py-3 font-medium text-text-secondary">Contacto</th>
                      <th className="px-4 py-3 font-medium text-text-secondary text-center">Puntos</th>
                      <th className="px-4 py-3 font-medium text-text-secondary text-center">Ajustar</th>
                      <th className="px-4 py-3 font-medium text-text-secondary text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {clientes.map(cliente => (
                      <tr key={cliente.id} className="hover:bg-background transition-colors">
                        <td className="px-4 py-3 font-medium">{cliente.nombre}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          <span className="text-xs bg-background border border-border px-2 py-0.5 rounded mr-1">
                            {cliente.tipoDocumento}
                          </span>
                          {cliente.numeroDocumento}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          <div>{cliente.telefono ?? '—'}</div>
                          <div className="text-xs">{cliente.email ?? ''}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-1 rounded-full text-sm ${
                            (cliente.puntosFidelizacion ?? 0) > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-background text-text-secondary'
                          }`}>
                            <Star size={13} className={(cliente.puntosFidelizacion ?? 0) > 0 ? 'fill-amber-400 text-amber-400' : ''} />
                            {(cliente.puntosFidelizacion ?? 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => abrirModal(cliente, 'SUMAR')}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Sumar puntos"
                            >
                              <Plus size={15} />
                            </button>
                            <button
                              onClick={() => abrirModal(cliente, 'RESTAR')}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Restar puntos"
                              disabled={(cliente.puntosFidelizacion ?? 0) === 0}
                            >
                              <Minus size={15} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(cliente)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Editar cliente"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => eliminar(cliente)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              title="Eliminar cliente"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-text-secondary">
                  {total} cliente{total !== 1 ? 's' : ''} en total
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-text-secondary">{page + 1} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear / Editar Cliente */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-surface border border-border rounded-xl shadow-xl w-full max-w-md z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-lg">
                {editId ? 'Editar cliente' : 'Nuevo cliente'}
              </h2>
              <button onClick={closeModal} className="text-text-secondary hover:text-text-main">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              <Input
                label="Nombre completo *"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej. Juan Pérez García"
              />
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-32">
                  <label className="block text-sm font-medium mb-1">Tipo doc.</label>
                  <select
                    value={form.tipoDocumento}
                    onChange={e => setForm(f => ({ ...f, tipoDocumento: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface"
                  >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    label="Nº Documento *"
                    value={form.numeroDocumento}
                    onChange={e => setForm(f => ({ ...f, numeroDocumento: e.target.value }))}
                    placeholder={form.tipoDocumento === 'DNI' ? '8 dígitos' : form.tipoDocumento === 'RUC' ? '11 dígitos' : ''}
                  />
                </div>
              </div>
              <Input
                label="Teléfono"
                value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="Ej. 987654321"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
              {formError && (
                <p className="text-sm text-error bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <Button variant="outline" onClick={closeModal} disabled={saving} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={guardar} disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear cliente'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajuste de Puntos */}
      {puntosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={cerrarModal} />
          <div className="relative bg-surface border border-border rounded-xl shadow-xl w-full max-w-md z-10">
            <div className={`flex items-center justify-between px-6 py-4 border-b border-border rounded-t-xl ${
              puntosModal.tipo === 'SUMAR' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-2">
                <Award size={20} className={puntosModal.tipo === 'SUMAR' ? 'text-green-600' : 'text-red-600'} />
                <h2 className="font-semibold">
                  {puntosModal.tipo === 'SUMAR' ? 'Sumar' : 'Restar'} puntos de fidelización
                </h2>
              </div>
              <button onClick={cerrarModal} className="text-text-secondary hover:text-text-main">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Users size={18} className="text-text-secondary" />
                <div>
                  <p className="font-medium">{puntosModal.cliente.nombre}</p>
                  <p className="text-xs text-text-secondary">
                    {puntosModal.cliente.tipoDocumento} {puntosModal.cliente.numeroDocumento}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 font-semibold text-amber-600">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {(puntosModal.cliente.puntosFidelizacion ?? 0).toLocaleString()}
                </div>
              </div>

              <Input
                label="Cantidad de puntos *"
                type="number"
                min="1"
                placeholder="Ej: 50"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
              />
              <Input
                label="Motivo (opcional)"
                placeholder="Ej: Compra especial, canje, corrección..."
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
              />

              {modalError && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{modalError}</div>}

              {cantidad && parseInt(cantidad, 10) > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  Resultado: <strong>
                    {puntosModal.tipo === 'SUMAR'
                      ? (puntosModal.cliente.puntosFidelizacion ?? 0) + parseInt(cantidad, 10)
                      : Math.max(0, (puntosModal.cliente.puntosFidelizacion ?? 0) - parseInt(cantidad, 10))
                    }
                  </strong> puntos
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <Button variant="outline" onClick={cerrarModal} disabled={guardando} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={confirmarAjuste}
                disabled={guardando || !cantidad}
                className={`flex-1 ${puntosModal.tipo === 'SUMAR' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {guardando ? 'Guardando...' : puntosModal.tipo === 'SUMAR' ? 'Sumar puntos' : 'Restar puntos'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
