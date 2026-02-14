import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit2, Trash2, Upload } from 'lucide-react';
import {
  fetchProductos,
  fetchCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  importarProductosCSV,
  type ProductoDTO,
  type CategoriaDTO,
  type ImportarProductosResult,
} from '../api/api';

const emptyForm = {
  nombre: '',
  codigoBarras: '',
  marca: '',
  categoriaId: '' as number | '',
  precioCompra: '',
  precioVenta: '',
  stockInicial: '0',
  stockMinimo: '0',
  stockMaximo: '',
  fechaVencimiento: '',
  activo: true,
};

export const Products = () => {
  const [items, setItems] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [page, setPage] = useState(0);
  const size = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [resultadoImportacion, setResultadoImportacion] = useState<ImportarProductosResult | null>(null);

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetchProductos({
        search: searchTerm || undefined,
        categoriaId: categoriaId || undefined,
        page,
        size,
      }),
      fetchCategorias(false),
    ]);
    if (prodRes.success && prodRes.data) {
      setItems(prodRes.data.content ?? []);
      setTotalElements(prodRes.data.totalElements ?? 0);
    }
    if (catRes.success && catRes.data) setCategorias(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [searchTerm, categoriaId, page]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (p: ProductoDTO) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre ?? '',
      codigoBarras: p.codigoBarras ?? '',
      marca: p.marca ?? '',
      categoriaId: p.categoriaId ?? '',
      precioCompra: p.precioCompra != null ? String(p.precioCompra) : '',
      precioVenta: p.precioVenta != null ? String(p.precioVenta) : '',
      stockInicial: '',
      stockMinimo: p.stockMinimo != null ? String(p.stockMinimo) : '0',
      stockMaximo: p.stockMaximo != null ? String(p.stockMaximo) : '',
      fechaVencimiento: p.fechaVencimiento ? p.fechaVencimiento.slice(0, 10) : '',
      activo: p.activo ?? true,
    });
    setError(null);
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    const precioVenta = parseFloat(form.precioVenta);
    if (isNaN(precioVenta) || precioVenta < 0) {
      setError('Precio de venta debe ser un número válido');
      return;
    }
    setSaving(true);
    setError(null);
    const dto: Partial<ProductoDTO> = {
      nombre: form.nombre.trim(),
      codigoBarras: form.codigoBarras.trim() || undefined,
      marca: form.marca.trim() || undefined,
      categoriaId: form.categoriaId || undefined,
      precioCompra: form.precioCompra ? parseFloat(form.precioCompra) : undefined,
      precioVenta,
      stockMinimo: form.stockMinimo ? parseInt(form.stockMinimo, 10) : 0,
      stockMaximo: form.stockMaximo ? parseInt(form.stockMaximo, 10) : undefined,
      fechaVencimiento: form.fechaVencimiento || undefined,
      activo: form.activo,
    };
    if (editId) {
      const res = await actualizarProducto(editId, dto);
      if (res.success) {
        setModalOpen(false);
        load();
      } else {
        setError(res.error?.message ?? 'Error al actualizar');
      }
    } else {
      dto.stockInicial = form.stockInicial ? parseInt(form.stockInicial, 10) : 0;
      const res = await crearProducto(dto);
      if (res.success) {
        setModalOpen(false);
        load();
      } else {
        setError(res.error?.message ?? 'Error al crear');
      }
    }
    setSaving(false);
  };

  const eliminar = async (p: ProductoDTO) => {
    if (!confirm(`¿Desactivar el producto "${p.nombre}"? (eliminación lógica)`)) return;
    const res = await eliminarProducto(p.id);
    if (res.success) load();
    else alert(res.error?.message ?? 'Error al eliminar');
  };

  const importarRef = React.useRef<HTMLInputElement>(null);
  const importarDesdeArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setImportando(true);
    setResultadoImportacion(null);
    const res = await importarProductosCSV(file);
    setImportando(false);
    if (res.success && res.data) {
      setResultadoImportacion(res.data);
      load();
    } else {
      setResultadoImportacion({
        totalProcesados: 0,
        creados: 0,
        omitidos: 0,
        errores: 1,
        mensajesError: [res.error?.message ?? 'Error al importar'],
        productosCreados: [],
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Productos</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <Input
              placeholder="Buscar por nombre o código..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
            className="px-3 py-2 border border-border rounded"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input
            ref={importarRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={importarDesdeArchivo}
          />
          <Button
            variant="outline"
            onClick={() => importarRef.current?.click()}
            disabled={importando}
          >
            <Upload size={18} className="mr-2" />
            {importando ? 'Importando...' : 'Importar CSV'}
          </Button>
          <Button onClick={openNew}>
            <Plus size={18} className="mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <p className="p-4 text-text-secondary">Cargando...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="p-4 font-medium">Código</th>
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Categoría</th>
                  <th className="p-4 font-medium">Precio</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="p-4">{product.codigoBarras ?? '-'}</td>
                    <td className="p-4 font-medium">{product.nombre}</td>
                    <td className="p-4">
                      {categorias.find((c) => c.id === product.categoriaId)?.nombre ?? '-'}
                    </td>
                    <td className="p-4">S/ {product.precioVenta?.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          (product.stockMinimo != null && product.stockActual <= product.stockMinimo)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {product.stockActual}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error"
                          onClick={() => eliminar(product)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && items.length === 0 && (
            <p className="p-4 text-text-secondary">No hay productos. Crea uno con &quot;Nuevo Producto&quot;.</p>
          )}
        </CardContent>
      </Card>

      {totalElements > 0 && (
        <div className="flex justify-between items-center text-sm text-text-secondary">
          <span>
            Mostrando {page * size + 1}-{Math.min((page + 1) * size, totalElements)} de {totalElements} productos
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              &lt;
            </Button>
            <span className="px-2 py-1">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              &gt;
            </Button>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border font-bold">
              {editId ? 'Editar producto' : 'Nuevo producto'}
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="Nombre *"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej. Cerveza Pilsen"
              />
              <Input
                label="Código de barras"
                value={form.codigoBarras}
                onChange={(e) => setForm((f) => ({ ...f, codigoBarras: e.target.value }))}
              />
              <Input
                label="Marca"
                value={form.marca}
                onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={form.categoriaId}
                  onChange={(e) => setForm((f) => ({ ...f, categoriaId: e.target.value ? Number(e.target.value) : '' }))}
                  className="w-full px-3 py-2 border border-border rounded"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Precio compra"
                type="number"
                step="0.01"
                value={form.precioCompra}
                onChange={(e) => setForm((f) => ({ ...f, precioCompra: e.target.value }))}
              />
              <Input
                label="Precio venta *"
                type="number"
                step="0.01"
                value={form.precioVenta}
                onChange={(e) => setForm((f) => ({ ...f, precioVenta: e.target.value }))}
              />
              {!editId && (
                <Input
                  label="Stock inicial"
                  type="number"
                  min="0"
                  value={form.stockInicial}
                  onChange={(e) => setForm((f) => ({ ...f, stockInicial: e.target.value }))}
                />
              )}
              <Input
                label="Stock mínimo"
                type="number"
                min="0"
                value={form.stockMinimo}
                onChange={(e) => setForm((f) => ({ ...f, stockMinimo: e.target.value }))}
              />
              <Input
                label="Stock máximo"
                type="number"
                min="0"
                value={form.stockMaximo}
                onChange={(e) => setForm((f) => ({ ...f, stockMaximo: e.target.value }))}
              />
              <Input
                label="Fecha vencimiento"
                type="date"
                value={form.fechaVencimiento}
                onChange={(e) => setForm((f) => ({ ...f, fechaVencimiento: e.target.value }))}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-sm">Activo</span>
              </label>
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

      {/* Modal Resultado Importación */}
      {resultadoImportacion != null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border font-bold flex justify-between items-center">
              <span>Resultado de la importación</span>
              <Button variant="ghost" size="sm" onClick={() => setResultadoImportacion(null)}>Cerrar</Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-text-secondary">Total procesados</span>
                <span className="font-medium">{resultadoImportacion.totalProcesados}</span>
                <span className="text-text-secondary">Creados</span>
                <span className="font-medium text-green-600">{resultadoImportacion.creados}</span>
                <span className="text-text-secondary">Omitidos</span>
                <span className="font-medium">{resultadoImportacion.omitidos}</span>
                <span className="text-text-secondary">Errores</span>
                <span className="font-medium text-red-600">{resultadoImportacion.errores}</span>
              </div>
              {resultadoImportacion.mensajesError != null && resultadoImportacion.mensajesError.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Detalles de errores / omitidos</p>
                  <ul className="text-sm bg-background rounded border border-border p-2 max-h-40 overflow-y-auto space-y-1">
                    {resultadoImportacion.mensajesError.slice(0, 50).map((msg, idx) => (
                      <li key={idx} className="text-red-700 dark:text-red-400">• {msg}</li>
                    ))}
                    {resultadoImportacion.mensajesError.length > 50 && (
                      <li className="text-text-secondary">… y {resultadoImportacion.mensajesError.length - 50} más</li>
                    )}
                  </ul>
                </div>
              )}
              {resultadoImportacion.productosCreados != null && resultadoImportacion.productosCreados.length > 0 && resultadoImportacion.productosCreados.length <= 30 && (
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Productos creados</p>
                  <ul className="text-sm bg-background rounded border border-border p-2 max-h-32 overflow-y-auto">
                    {resultadoImportacion.productosCreados.map((nombre, idx) => (
                      <li key={idx}>• {nombre}</li>
                    ))}
                  </ul>
                </div>
              )}
              {resultadoImportacion.productosCreados != null && resultadoImportacion.productosCreados.length > 30 && (
                <p className="text-sm text-text-secondary">
                  {resultadoImportacion.productosCreados.length} productos creados (lista no mostrada).
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
