import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit, Trash2, Search, X, Building, Phone, Mail, MapPin } from 'lucide-react';
import { fetchProveedores, crearProveedor, actualizarProveedor, eliminarProveedor, type ProveedorDTO } from '../../api/api';

export const ProveedoresSettings = () => {
  const [items, setItems] = useState<ProveedorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ razonSocial: '', ruc: '', direccion: '', telefono: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetchProveedores();
    if (res.success && res.data) setItems(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = search.trim()
    ? items.filter((p) =>
        p.razonSocial.toLowerCase().includes(search.trim().toLowerCase()) ||
        (p.ruc ?? '').includes(search.trim())
      )
    : items;

  const openNew = () => {
    setEditId(null);
    setForm({ razonSocial: '', ruc: '', direccion: '', telefono: '', email: '' });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (p: ProveedorDTO) => {
    setEditId(p.id);
    setForm({
      razonSocial: p.razonSocial,
      ruc: p.ruc ?? '',
      direccion: p.direccion ?? '',
      telefono: p.telefono ?? '',
      email: p.email ?? '',
    });
    setError(null);
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.razonSocial.trim()) {
      setError('La razón social es requerida');
      return;
    }
    if (form.ruc && !/^\d{11}$/.test(form.ruc)) {
      setError('El RUC debe tener exactamente 11 dígitos');
      return;
    }
    setSaving(true);
    setError(null);
    const dto = {
      razonSocial: form.razonSocial.trim(),
      ruc: form.ruc.trim() || undefined,
      direccion: form.direccion.trim() || undefined,
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
    };
    const res = editId
      ? await actualizarProveedor(editId, dto)
      : await crearProveedor(dto);
    setSaving(false);
    if (res.success) {
      setModalOpen(false);
      load();
    } else {
      setError(res.error?.message ?? 'Error al guardar el proveedor');
    }
  };

  const eliminar = async (p: ProveedorDTO) => {
    if (!confirm(`¿Eliminar el proveedor "${p.razonSocial}"?`)) return;
    setEliminandoId(p.id);
    const res = await eliminarProveedor(p.id);
    setEliminandoId(null);
    if (!res.success) alert(res.error?.message ?? 'Error al eliminar');
    else load();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por razón social o RUC..."
            className="w-full pl-9 pr-8 py-2 border border-border rounded text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Button onClick={openNew}>
          <Plus size={15} className="mr-1.5" /> Nuevo proveedor
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-text-secondary text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-text-secondary text-sm py-6 text-center">
          {items.length > 0 ? 'Sin resultados para la búsqueda' : 'No hay proveedores. Crea uno con "Nuevo proveedor".'}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="border border-border rounded-lg p-4 bg-surface hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Building size={16} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">{p.razonSocial}</h3>
                  {p.ruc && <p className="text-xs text-text-secondary mt-0.5">RUC: {p.ruc}</p>}
                </div>
              </div>

              {(p.telefono || p.email || p.direccion) && (
                <div className="space-y-1.5 mb-3 pl-1">
                  {p.telefono && (
                    <p className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Phone size={11} className="shrink-0" /> {p.telefono}
                    </p>
                  )}
                  {p.email && (
                    <p className="text-xs text-text-secondary flex items-center gap-1.5 truncate">
                      <Mail size={11} className="shrink-0" /> {p.email}
                    </p>
                  )}
                  {p.direccion && (
                    <p className="text-xs text-text-secondary flex items-center gap-1.5">
                      <MapPin size={11} className="shrink-0" /> {p.direccion}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="flex-1">
                  <Edit size={13} className="mr-1" /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eliminar(p)}
                  disabled={eliminandoId === p.id}
                  className="text-error flex-1"
                >
                  <Trash2 size={13} className="mr-1" />
                  {eliminandoId === p.id ? '...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">{editId ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-secondary hover:text-text-main">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="Razón social *"
                value={form.razonSocial}
                onChange={(e) => setForm((f) => ({ ...f, razonSocial: e.target.value }))}
                placeholder="Nombre o razón social de la empresa"
              />
              <Input
                label="RUC"
                value={form.ruc}
                onChange={(e) => setForm((f) => ({ ...f, ruc: e.target.value.replace(/\D/g, '') }))}
                placeholder="11 dígitos"
                maxLength={11}
              />
              <Input
                label="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="Número de contacto"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="correo@empresa.com"
              />
              <Input
                label="Dirección"
                value={form.direccion}
                onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                placeholder="Dirección del proveedor"
              />
              {error && (
                <p className="text-sm text-error bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
