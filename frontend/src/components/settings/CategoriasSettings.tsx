import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { fetchCategorias, crearCategoria, actualizarCategoria, eliminarCategoria, type CategoriaDTO } from '../../api/api';

export const CategoriasSettings = () => {
  const [items, setItems] = useState<CategoriaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetchCategorias(false);
    if (res.success && res.data) setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setNombre('');
    setDescripcion('');
  };

  const openEdit = (c: CategoriaDTO) => {
    setEditId(c.id);
    setNombre(c.nombre);
    setDescripcion(c.descripcion ?? '');
  };

  const save = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    if (editId) {
      const res = await actualizarCategoria(editId, { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined });
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    } else {
      const res = await crearCategoria({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined });
      if (res.success) { openNew(); load(); }
      else alert(res.error?.message);
    }
    setSaving(false);
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    const res = await eliminarCategoria(id);
    if (res.success) load();
    else alert(res.error?.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">Gestionar categorías de productos</p>
        <Button onClick={openNew}>Nueva categoría</Button>
      </div>

      {(editId !== null || nombre) && (
        <div className="p-4 border border-border rounded bg-background space-y-3">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Cervezas"
          />
          <Input
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Opcional"
          />
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
                {c.descripcion && <p className="text-sm text-text-secondary">{c.descripcion}</p>}
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
