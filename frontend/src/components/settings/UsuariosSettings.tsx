import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  fetchUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  type UsuarioDTO,
} from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
];

export const UsuariosSettings = () => {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    rol: 'VENDEDOR',
    activo: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetchUsuarios({ size: 100 });
    if (res.success && res.data?.content) setItems(res.data.content);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ username: '', email: '', password: '', nombre: '', rol: 'VENDEDOR', activo: true });
    setError(null);
  };

  const openEdit = (u: UsuarioDTO) => {
    setEditId(u.id);
    setForm({
      username: u.username,
      email: u.email,
      password: '',
      nombre: u.nombre,
      rol: u.rol ?? 'VENDEDOR',
      activo: u.activo ?? true,
    });
    setError(null);
  };

  const save = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.nombre.trim()) {
      setError('Usuario, email y nombre son requeridos');
      return;
    }
    if (!editId && (!form.password || form.password.length < 6)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSaving(true);
    setError(null);
    const payload: Partial<UsuarioDTO> & { password?: string } = {
      username: form.username.trim(),
      email: form.email.trim(),
      nombre: form.nombre.trim(),
      rol: form.rol,
      activo: form.activo,
    };
    if (form.password.trim()) payload.password = form.password;
    if (editId) {
      const res = await actualizarUsuario(editId, payload);
      if (res.success) {
        openNew();
        load();
      } else {
        setError(res.error?.message ?? 'Error al actualizar');
      }
    } else {
      const res = await crearUsuario({ ...payload, password: payload.password ?? form.password });
      if (res.success) {
        openNew();
        load();
      } else {
        setError(res.error?.message ?? 'Error al crear');
      }
    }
    setSaving(false);
  };

  const eliminar = async (u: UsuarioDTO) => {
    if (u.id === currentUser?.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }
    if (!confirm(`¿Eliminar al usuario "${u.nombre}" (${u.username})?`)) return;
    const res = await eliminarUsuario(u.id);
    if (res.success) load();
    else alert(res.error?.message ?? 'Error al eliminar');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">Gestionar usuarios del sistema (Administrador y Vendedor)</p>
        <Button onClick={openNew}>Nuevo usuario</Button>
      </div>

      {(editId !== null || form.username || form.nombre) && (
        <div className="p-4 border border-border rounded bg-background space-y-3">
          <Input
            label="Usuario (login) *"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder="Ej: jperez"
            disabled={!!editId}
          />
          {editId && <p className="text-xs text-text-secondary">El usuario no se puede cambiar al editar.</p>}
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="correo@ejemplo.com"
          />
          <Input
            label={editId ? 'Nueva contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={editId ? '••••••••' : 'Mínimo 6 caracteres'}
            autoComplete={editId ? 'new-password' : 'off'}
          />
          <Input
            label="Nombre completo *"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            placeholder="Ej: Juan Pérez"
          />
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm">Usuario activo</span>
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
            <Button variant="outline" onClick={openNew}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 font-medium">Usuario</th>
                <th className="py-2 font-medium">Nombre</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Rol</th>
                <th className="py-2 font-medium">Estado</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b border-border">
                  <td className="py-2 font-medium">{u.username}</td>
                  <td className="py-2">{u.nombre}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.rol === 'ADMIN' ? 'Administrador' : 'Vendedor'}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminar(u)}
                        disabled={u.id === currentUser?.id}
                        className="text-red-600"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="py-4 text-text-secondary">No hay usuarios registrados.</p>}
        </div>
      )}
    </div>
  );
};
