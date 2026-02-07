import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { fetchClientes, crearCliente, actualizarCliente, eliminarCliente, type ClienteDTO } from '../../api/api';

export const ClientesSettings = () => {
  const [items, setItems] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', tipoDocumento: 'DNI', numeroDocumento: '', telefono: '', email: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetchClientes();
    if (res.success && res.data?.content) setItems(res.data.content);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ nombre: '', tipoDocumento: 'DNI', numeroDocumento: '', telefono: '', email: '' });
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
  };

  const save = async () => {
    if (!form.nombre.trim() || !form.numeroDocumento.trim()) {
      alert('Nombre y número de documento son requeridos');
      return;
    }
    setSaving(true);
    const dto = { ...form, telefono: form.telefono || undefined, email: form.email || undefined };
    if (editId) {
      const res = await actualizarCliente(editId, dto);
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    } else {
      const res = await crearCliente(dto);
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    }
    setSaving(false);
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    const res = await eliminarCliente(id);
    if (res.success) load();
    else alert(res.error?.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">Gestionar clientes</p>
        <Button onClick={openNew}>Nuevo cliente</Button>
      </div>

      {(editId !== null || form.nombre || form.numeroDocumento) && (
        <div className="p-4 border border-border rounded bg-background space-y-3">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Tipo doc.</label>
              <select
                value={form.tipoDocumento}
                onChange={(e) => setForm((f) => ({ ...f, tipoDocumento: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded"
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <div className="flex-1">
              <Input label="Nº Documento" value={form.numeroDocumento} onChange={(e) => setForm((f) => ({ ...f, numeroDocumento: e.target.value }))} />
            </div>
          </div>
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
          {items.map((c) => (
            <li key={c.id} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{c.nombre}</p>
                <p className="text-sm text-text-secondary">{c.tipoDocumento} {c.numeroDocumento}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(c)}>Editar</Button>
                <Button variant="outline" size="sm" onClick={() => eliminar(c.id)} className="text-red-600">Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
