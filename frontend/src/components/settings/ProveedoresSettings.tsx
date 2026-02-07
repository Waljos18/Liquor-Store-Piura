import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { fetchProveedores, crearProveedor, actualizarProveedor, eliminarProveedor, type ProveedorDTO } from '../../api/api';

export const ProveedoresSettings = () => {
  const [items, setItems] = useState<ProveedorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ razonSocial: '', ruc: '', direccion: '', telefono: '', email: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetchProveedores();
    if (res.success && res.data) setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ razonSocial: '', ruc: '', direccion: '', telefono: '', email: '' });
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
  };

  const save = async () => {
    if (!form.razonSocial.trim()) {
      alert('Razón social es requerida');
      return;
    }
    setSaving(true);
    const dto = {
      razonSocial: form.razonSocial.trim(),
      ruc: form.ruc.trim() || undefined,
      direccion: form.direccion.trim() || undefined,
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
    };
    if (editId) {
      const res = await actualizarProveedor(editId, dto);
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    } else {
      const res = await crearProveedor(dto);
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    }
    setSaving(false);
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    const res = await eliminarProveedor(id);
    if (res.success) load();
    else alert(res.error?.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">Gestionar proveedores</p>
        <Button onClick={openNew}>Nuevo proveedor</Button>
      </div>

      {(editId !== null || form.razonSocial) && (
        <div className="p-4 border border-border rounded bg-background space-y-3">
          <Input label="Razón social" value={form.razonSocial} onChange={(e) => setForm((f) => ({ ...f, razonSocial: e.target.value }))} />
          <Input label="RUC" value={form.ruc} onChange={(e) => setForm((f) => ({ ...f, ruc: e.target.value }))} />
          <Input label="Dirección" value={form.direccion} onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))} />
          <Input label="Teléfono" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
            <Button variant="outline" onClick={openNew}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((p) => (
            <li key={p.id} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.razonSocial}</p>
                {p.ruc && <p className="text-sm text-text-secondary">RUC: {p.ruc}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Editar</Button>
                <Button variant="outline" size="sm" onClick={() => eliminar(p.id)} className="text-red-600">Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
