import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Tag, Edit, Trash2, Package, Search } from 'lucide-react';
import {
  fetchPromociones,
  crearPromocion,
  actualizarPromocion,
  desactivarPromocion,
  fetchProductos,
  fetchCategorias,
  buscarProductos,
  fetchPacks,
  fetchPackPorId,
  crearPack,
  actualizarPack,
  desactivarPack,
  type PromocionDTO,
  type CrearPromocionRequest,
  type ProductoDTO,
  type CategoriaDTO,
  type PackDTO,
  type CrearPackRequest,
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

type TabId = 'promociones' | 'packs';

/** Item en el formulario de pack: producto seleccionado con datos para mostrar y enviar */
interface PackFormItem {
  productoId: number;
  cantidad: number;
  nombre: string;
  precioVenta: number;
}

export const Promotions = () => {
  const [activeTab, setActiveTab] = useState<TabId>('promociones');

  const [items, setItems] = useState<PromocionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

  const [packs, setPacks] = useState<PackDTO[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(false);
  const [modalPackOpen, setModalPackOpen] = useState(false);
  const [editPackId, setEditPackId] = useState<number | null>(null);
  const [formPack, setFormPack] = useState({ nombre: '', precioPack: '', productos: [] as PackFormItem[] });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductoDTO[]>([]);
  const [searching, setSearching] = useState(false);
  const [savingPack, setSavingPack] = useState(false);
  const [errorPack, setErrorPack] = useState<string | null>(null);

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

  const loadPacks = useCallback(async () => {
    setLoadingPacks(true);
    const res = await fetchPacks({ soloActivos: undefined, size: 100 });
    if (res.success && res.data) setPacks(res.data.content ?? []);
    setLoadingPacks(false);
  }, []);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (activeTab === 'packs') loadPacks();
  }, [activeTab, loadPacks]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      setSearching(true);
      buscarProductos(searchQuery.trim()).then((res) => {
        if (res.success && res.data) setSearchResults(res.data);
        else setSearchResults([]);
        setSearching(false);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

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

  const openNewPack = () => {
    setEditPackId(null);
    setFormPack({ nombre: '', precioPack: '', productos: [] });
    setSearchQuery('');
    setSearchResults([]);
    setErrorPack(null);
    setModalPackOpen(true);
  };

  const openEditPack = async (pack: PackDTO) => {
    setEditPackId(pack.id);
    setErrorPack(null);
    const res = await fetchPackPorId(pack.id);
    if (!res.success || !res.data) {
      setErrorPack(res.error?.message ?? 'Error al cargar pack');
      return;
    }
    const p = res.data;
    const productosForm: PackFormItem[] = (p.productos ?? []).map((pp) => ({
      productoId: pp.producto?.id ?? 0,
      cantidad: pp.cantidad ?? 1,
      nombre: pp.producto?.nombre ?? '',
      precioVenta: pp.producto?.precioVenta ?? 0,
    })).filter((x) => x.productoId > 0);
    setFormPack({
      nombre: p.nombre ?? '',
      precioPack: p.precioPack != null ? String(p.precioPack) : '',
      productos: productosForm,
    });
    setSearchQuery('');
    setSearchResults([]);
    setModalPackOpen(true);
  };

  const addProductoToPack = (prod: ProductoDTO) => {
    const exists = formPack.productos.some((x) => x.productoId === prod.id);
    if (exists) return;
    setFormPack((f) => ({
      ...f,
      productos: [
        ...f.productos,
        { productoId: prod.id, cantidad: 1, nombre: prod.nombre, precioVenta: prod.precioVenta ?? 0 },
      ],
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const updatePackItemCantidad = (idx: number, cantidad: number) => {
    const c = Math.max(1, cantidad);
    setFormPack((f) => {
      const copy = [...f.productos];
      copy[idx] = { ...copy[idx], cantidad: c };
      return { ...f, productos: copy };
    });
  };

  const removePackItem = (idx: number) => {
    setFormPack((f) => ({ ...f, productos: f.productos.filter((_, i) => i !== idx) }));
  };

  const precioSugeridoPack = formPack.productos.reduce(
    (sum, it) => sum + it.precioVenta * it.cantidad,
    0
  ) * 0.9;

  const usePrecioSugerido = () => {
    setFormPack((f) => ({ ...f, precioPack: precioSugeridoPack.toFixed(2) }));
  };

  const savePack = async () => {
    if (!formPack.nombre.trim()) {
      setErrorPack('El nombre del pack es requerido');
      return;
    }
    const precio = parseFloat(formPack.precioPack);
    if (isNaN(precio) || precio < 0) {
      setErrorPack('Indique un precio válido');
      return;
    }
    if (formPack.productos.length === 0) {
      setErrorPack('Agregue al menos un producto al pack');
      return;
    }
    setSavingPack(true);
    setErrorPack(null);
    const body: CrearPackRequest = {
      nombre: formPack.nombre.trim(),
      precioPack: precio,
      productos: formPack.productos.map((p) => ({ productoId: p.productoId, cantidad: p.cantidad })),
    };
    if (editPackId) {
      const res = await actualizarPack(editPackId, body);
      setSavingPack(false);
      if (res.success) {
        setModalPackOpen(false);
        loadPacks();
      } else {
        setErrorPack(res.error?.message ?? 'Error al actualizar');
      }
    } else {
      const res = await crearPack(body);
      setSavingPack(false);
      if (res.success) {
        setModalPackOpen(false);
        loadPacks();
      } else {
        setErrorPack(res.error?.message ?? 'Error al crear');
      }
    }
  };

  const desactivarPackHandler = async (pack: PackDTO) => {
    if (!confirm(`¿Desactivar el pack "${pack.nombre}"?`)) return;
    const res = await desactivarPack(pack.id);
    if (res.success) loadPacks();
    else alert(res.error?.message ?? 'Error al desactivar');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Promociones y Packs</h2>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('promociones')}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'promociones' ? 'bg-primary text-white' : 'bg-surface hover:bg-background'}`}
            >
              <Tag size={18} />
              Promociones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('packs')}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'packs' ? 'bg-primary text-white' : 'bg-surface hover:bg-background'}`}
            >
              <Package size={18} />
              Packs
            </button>
          </div>
          {activeTab === 'promociones' && (
            <Button onClick={openNew}>
              <Plus size={18} className="mr-2" />
              Nueva Promoción
            </Button>
          )}
          {activeTab === 'packs' && (
            <Button onClick={openNewPack}>
              <Plus size={18} className="mr-2" />
              Nuevo Pack
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'packs' && (
        <>
          <p className="text-text-secondary text-sm">
            Arma combos de tus productos (ej. 2 cervezas + 1 snack) y define un precio especial para el pack, como en Tambo.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Packs disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPacks ? (
                <p className="text-text-secondary">Cargando...</p>
              ) : packs.length === 0 ? (
                <p className="text-text-secondary">No hay packs. Crea uno con &quot;Nuevo Pack&quot;.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {packs.map((pack) => (
                    <div
                      key={pack.id}
                      className="border border-border rounded-xl p-4 bg-surface hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{pack.nombre}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${pack.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {pack.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-primary mb-2">S/ {(pack.precioPack ?? 0).toFixed(2)}</p>
                      {pack.productos?.length ? (
                        <ul className="text-sm text-text-secondary space-y-0.5 mb-4">
                          {pack.productos.slice(0, 5).map((pp, i) => (
                            <li key={i}>
                              {pp.cantidad}× {pp.producto?.nombre ?? 'Producto'}
                            </li>
                          ))}
                          {(pack.productos?.length ?? 0) > 5 && (
                            <li>+{(pack.productos?.length ?? 0) - 5} más</li>
                          )}
                        </ul>
                      ) : null}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditPack(pack)}>
                          <Edit size={14} className="mr-1" />
                          Editar
                        </Button>
                        {pack.activo && (
                          <Button variant="outline" size="sm" className="text-error" onClick={() => desactivarPackHandler(pack)}>
                            <Trash2 size={14} className="mr-1" />
                            Desactivar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'promociones' && (
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
      )}

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

      {/* Modal Crear/Editar Pack */}
      {modalPackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border font-bold flex justify-between items-center">
              <span>{editPackId ? 'Editar pack' : 'Nuevo pack'}</span>
              <Button variant="ghost" size="sm" onClick={() => setModalPackOpen(false)}>Cerrar</Button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <Input
                label="Nombre del pack *"
                value={formPack.nombre}
                onChange={(e) => setFormPack((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej. Combo Cervezas + Snack"
              />
              <Input
                label="Precio del pack (S/) *"
                type="number"
                min="0"
                step="0.01"
                value={formPack.precioPack}
                onChange={(e) => setFormPack((f) => ({ ...f, precioPack: e.target.value }))}
                placeholder="0.00"
              />
              {formPack.productos.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-text-secondary">
                    Precio sugerido (10% dto): S/ {precioSugeridoPack.toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm" onClick={usePrecioSugerido}>
                    Usar precio sugerido
                  </Button>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Buscar y agregar productos</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe nombre o código del producto..."
                    className="w-full pl-10 pr-3 py-2 border border-border rounded"
                  />
                </div>
                {searching && <p className="text-xs text-text-secondary mt-1">Buscando...</p>}
                {searchResults.length > 0 && (
                  <ul className="mt-2 border border-border rounded max-h-40 overflow-y-auto">
                    {searchResults.map((p) => {
                      const yaAgregado = formPack.productos.some((x) => x.productoId === p.id);
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => addProductoToPack(p)}
                            disabled={yaAgregado}
                            className={`w-full text-left px-3 py-2 flex justify-between items-center hover:bg-background ${yaAgregado ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="font-medium">{p.nombre}</span>
                            <span className="text-sm text-text-secondary">S/ {(p.precioVenta ?? 0).toFixed(2)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Productos en el pack</label>
                {formPack.productos.length === 0 ? (
                  <p className="text-sm text-text-secondary">Busca productos arriba y haz clic para agregarlos.</p>
                ) : (
                  <ul className="space-y-2">
                    {formPack.productos.map((item, idx) => (
                      <li key={item.productoId} className="flex gap-2 items-center flex-wrap border border-border rounded p-2">
                        <span className="flex-1 min-w-0 truncate font-medium">{item.nombre}</span>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => updatePackItemCantidad(idx, parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 border border-border rounded text-sm"
                        />
                        <span className="text-sm text-text-secondary">S/ {(item.precioVenta * item.cantidad).toFixed(2)}</span>
                        <Button variant="ghost" size="sm" className="text-error" onClick={() => removePackItem(idx)}>
                          <Trash2 size={14} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errorPack && <p className="text-red-600 text-sm">{errorPack}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalPackOpen(false)} disabled={savingPack}>Cancelar</Button>
              <Button onClick={savePack} disabled={savingPack || formPack.productos.length === 0}>
                {savingPack ? 'Guardando...' : 'Guardar pack'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
