import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';
import {
  fetchPromociones,
  crearPromocion,
  actualizarPromocion,
  desactivarPromocion,
  fetchProductos,
  fetchCategorias,
  type PromocionDTO,
  type CrearPromocionRequest,
  type ProductoDTO,
  type CategoriaDTO,
} from '../api/api';

const TIPOS_PROMO = [
  { value: 'DESCUENTO_PORCENTAJE', label: 'Descuento %' },
  { value: 'DESCUENTO_MONTO', label: 'Descuento monto fijo' },
  { value: 'CANTIDAD', label: 'Cantidad (ej. 2x1)' },
  { value: 'VOLUMEN', label: 'Volumen' },
];

function toLocalDateTimeStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}T00:00:00`;
}

export const Promotions = () => {
  const [items, setItems] = useState<PromocionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

  const [form, setForm] = useState({
    nombre: '',
    tipo: 'DESCUENTO_PORCENTAJE',
    descuentoPorcentaje: '',
    descuentoMonto: '',
    fechaInicio: toLocalDateTimeStr(new Date()),
    fechaFin: toLocalDateTimeStr(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    productos: [] as { productoId: number; cantidadMinima: number; cantidadGratis: number }[],
  });

  const load = async () => {
    setLoading(true);
    const res = await fetchPromociones({ soloActivas: undefined, size: 100 });
    if (res.success && res.data) {
      setItems(res.data.content ?? []);
    }
    setLoading(false);
  };

  const loadProductos = async () => {
    const [pRes, cRes] = await Promise.all([
      fetchProductos({ size: 200 }),
      fetchCategorias(false),
    ]);
    if (pRes.success && pRes.data?.content) setProductos(pRes.data.content);
    if (cRes.success && cRes.data) setCategorias(cRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({
      nombre: '',
      tipo: 'DESCUENTO_PORCENTAJE',
      descuentoPorcentaje: '',
      descuentoMonto: '',
      fechaInicio: toLocalDateTimeStr(new Date()),
      fechaFin: toLocalDateTimeStr(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      productos: [],
    });
    setError(null);
    setModalOpen(true);
    loadProductos();
  };

  const openEdit = (p: PromocionDTO) => {
    setEditId(p.id);
    const productosForm = (p.productos ?? []).map((pp) => ({
      productoId: pp.producto?.id ?? 0,
      cantidadMinima: pp.cantidadMinima ?? 1,
      cantidadGratis: pp.cantidadGratis ?? 0,
    })).filter((x) => x.productoId > 0);
    setForm({
      nombre: p.nombre ?? '',
      tipo: p.tipo ?? 'DESCUENTO_PORCENTAJE',
      descuentoPorcentaje: p.descuentoPorcentaje != null ? String(p.descuentoPorcentaje) : '',
      descuentoMonto: p.descuentoMonto != null ? String(p.descuentoMonto) : '',
      fechaInicio: p.fechaInicio ? p.fechaInicio.slice(0, 19) : toLocalDateTimeStr(new Date()),
      fechaFin: p.fechaFin ? p.fechaFin.slice(0, 19) : toLocalDateTimeStr(new Date()),
      productos: productosForm.length ? productosForm : [],
    });
    setError(null);
    setModalOpen(true);
    loadProductos();
  };

  const save = async () => {
    if (!form.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    const tipo = form.tipo;
    if (tipo === 'DESCUENTO_PORCENTAJE' && (!form.descuentoPorcentaje || parseFloat(form.descuentoPorcentaje) < 0)) {
      setError('Indique el descuento porcentaje');
      return;
    }
    if (tipo === 'DESCUENTO_MONTO' && (!form.descuentoMonto || parseFloat(form.descuentoMonto) < 0)) {
      setError('Indique el descuento en monto');
      return;
    }
    const fechaInicio = form.fechaInicio.slice(0, 19);
    const fechaFin = form.fechaFin.slice(0, 19);
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setError('La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    setSaving(true);
    setError(null);
    const body: CrearPromocionRequest = {
      nombre: form.nombre.trim(),
      tipo,
      fechaInicio,
      fechaFin,
      productos: form.productos.map((pr) => ({
        productoId: pr.productoId,
        cantidadMinima: pr.cantidadMinima,
        cantidadGratis: pr.cantidadGratis,
      })),
    };
    if (tipo === 'DESCUENTO_PORCENTAJE' && form.descuentoPorcentaje) {
      body.descuentoPorcentaje = parseFloat(form.descuentoPorcentaje);
    }
    if (tipo === 'DESCUENTO_MONTO' && form.descuentoMonto) {
      body.descuentoMonto = parseFloat(form.descuentoMonto);
    }

    if (editId) {
      const res = await actualizarPromocion(editId, body);
      if (res.success) {
        setModalOpen(false);
        load();
      } else {
        setError(res.error?.message ?? 'Error al actualizar');
      }
    } else {
      const res = await crearPromocion(body);
      if (res.success) {
        setModalOpen(false);
        load();
      } else {
        setError(res.error?.message ?? 'Error al crear');
      }
    }
    setSaving(false);
  };

  const desactivar = async (p: PromocionDTO) => {
    if (!confirm(`¿Desactivar la promoción "${p.nombre}"?`)) return;
    const res = await desactivarPromocion(p.id);
    if (res.success) load();
    else alert(res.error?.message ?? 'Error al desactivar');
  };

  const addProductoToForm = () => {
    const firstId = productos[0]?.id;
    if (firstId) {
      setForm((f) => ({
        ...f,
        productos: [...f.productos, { productoId: firstId, cantidadMinima: 1, cantidadGratis: 0 }],
      }));
    }
  };

  const updateProductoInForm = (idx: number, field: 'productoId' | 'cantidadMinima' | 'cantidadGratis', value: number) => {
    setForm((f) => {
      const copy = [...f.productos];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...f, productos: copy };
    });
  };

  const removeProductoFromForm = (idx: number) => {
    setForm((f) => ({ ...f, productos: f.productos.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promociones</h2>
        <Button onClick={openNew}>
          <Plus size={18} className="mr-2" />
          Nueva Promoción
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promociones</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-text-secondary">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-text-secondary">No hay promociones. Crea una con &quot;Nueva Promoción&quot;.</p>
          ) : (
            items.map((promo) => (
              <div
                key={promo.id}
                className="border border-border rounded-lg p-4 flex justify-between items-start bg-surface"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{promo.nombre}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        promo.activa ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {promo.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">Tipo: {promo.tipo}</p>
                  {promo.descuentoPorcentaje != null && (
                    <p className="text-sm">Descuento: {promo.descuentoPorcentaje}%</p>
                  )}
                  {promo.descuentoMonto != null && (
                    <p className="text-sm">Descuento: S/ {Number(promo.descuentoMonto).toFixed(2)}</p>
                  )}
                  {promo.productos?.length ? (
                    <p className="text-text-secondary text-sm mt-1">
                      Productos: {promo.productos.map((pp) => pp.producto?.nombre).filter(Boolean).join(', ')}
                    </p>
                  ) : null}
                  <p className="text-xs text-text-secondary mt-1">
                    Válido: {promo.fechaInicio?.slice(0, 10)} — {promo.fechaFin?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(promo)}>
                    <Edit size={16} className="mr-1" />
                    Editar
                  </Button>
                  {promo.activa && (
                    <Button variant="outline" size="sm" className="text-error" onClick={() => desactivar(promo)}>
                      <Trash2 size={16} className="mr-1" />
                      Desactivar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border font-bold">
              {editId ? 'Editar promoción' : 'Nueva promoción'}
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="Nombre *"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej. 2x1 Cervezas"
              />
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded"
                >
                  {TIPOS_PROMO.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {form.tipo === 'DESCUENTO_PORCENTAJE' && (
                <Input
                  label="Descuento %"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.descuentoPorcentaje}
                  onChange={(e) => setForm((f) => ({ ...f, descuentoPorcentaje: e.target.value }))}
                />
              )}
              {form.tipo === 'DESCUENTO_MONTO' && (
                <Input
                  label="Descuento (S/)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.descuentoMonto}
                  onChange={(e) => setForm((f) => ({ ...f, descuentoMonto: e.target.value }))}
                />
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha inicio</label>
                  <input
                    type="datetime-local"
                    value={form.fechaInicio.slice(0, 16)}
                    onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value ? e.target.value + ':00' : f.fechaInicio }))}
                    className="w-full px-3 py-2 border border-border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha fin</label>
                  <input
                    type="datetime-local"
                    value={form.fechaFin.slice(0, 16)}
                    onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value ? e.target.value + ':00' : f.fechaFin }))}
                    className="w-full px-3 py-2 border border-border rounded"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Productos en la promoción</label>
                  <Button variant="outline" size="sm" onClick={addProductoToForm}>
                    Añadir producto
                  </Button>
                </div>
                {form.productos.length === 0 ? (
                  <p className="text-sm text-text-secondary">Opcional: añade productos para limitar la promoción.</p>
                ) : (
                  <ul className="space-y-2">
                    {form.productos.map((pr, idx) => (
                      <li key={idx} className="flex gap-2 items-center flex-wrap">
                        <select
                          value={pr.productoId}
                          onChange={(e) => updateProductoInForm(idx, 'productoId', Number(e.target.value))}
                          className="flex-1 min-w-[140px] px-2 py-1 border border-border rounded text-sm"
                        >
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={pr.cantidadMinima}
                          onChange={(e) => updateProductoInForm(idx, 'cantidadMinima', parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 border border-border rounded text-sm"
                          placeholder="Mín"
                        />
                        <input
                          type="number"
                          min="0"
                          value={pr.cantidadGratis}
                          onChange={(e) => updateProductoInForm(idx, 'cantidadGratis', parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-2 py-1 border border-border rounded text-sm"
                          placeholder="Gratis"
                        />
                        <Button variant="ghost" size="sm" className="text-error" onClick={() => removeProductoFromForm(idx)}>
                          <Trash2 size={14} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
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
