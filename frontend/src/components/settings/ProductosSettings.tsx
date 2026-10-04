import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import {
  fetchProductos,
  fetchCategorias,
  fetchProductosSinCategoria,
  eliminarProducto,
  eliminarProductoByCodigo,
  type ProductoDTO,
  type CategoriaDTO,
} from '../../api/api';
import { useNavigate } from 'react-router-dom';

export const ProductosSettings = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [sinCategoria, setSinCategoria] = useState<ProductoDTO[]>([]);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, [search, categoriaId]);

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes, sinCatRes] = await Promise.all([
      fetchProductos({ search: search || undefined, categoriaId: categoriaId || undefined, size: 50 }),
      fetchCategorias(false),
      fetchProductosSinCategoria(),
    ]);
    if (prodRes.success && prodRes.data?.content) setItems(prodRes.data.content);
    if (catRes.success && catRes.data) setCategorias(catRes.data);
    if (sinCatRes.success && sinCatRes.data) setSinCategoria(sinCatRes.data);
    setLoading(false);
  };

  const eliminarProductoSinCategoria = async (p: ProductoDTO) => {
    if (!window.confirm(`¿Desactivar "${p.nombre}" (${p.codigoBarras ?? 'sin código'})?`)) return;
    setEliminandoId(p.id);
    const res = p.codigoBarras
      ? await eliminarProductoByCodigo(p.codigoBarras)
      : await eliminarProducto(p.id);
    setEliminandoId(null);
    if (res.success) load();
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-text-secondary text-sm">Gestionar productos (crear y editar en la página Productos)</p>

      {sinCategoria.length > 0 && (
        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
          <h4 className="font-bold text-amber-900 mb-2">Productos sin categoría</h4>
          <p className="text-sm text-amber-800 mb-3">Estos productos no tienen categoría asignada. Puede asignarles una desde la página Productos o desactivarlos aquí.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="py-2 text-left">Código</th>
                  <th className="py-2 text-left">Nombre</th>
                  <th className="py-2 text-left">Precio</th>
                  <th className="py-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {sinCategoria.map((p) => (
                  <tr key={p.id} className="border-b border-amber-200">
                    <td className="py-2">{p.codigoBarras ?? '-'}</td>
                    <td className="py-2">{p.nombre}</td>
                    <td className="py-2">S/ {p.precioVenta?.toFixed(2)}</td>
                    <td className="py-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarProductoSinCategoria(p)}
                        disabled={eliminandoId === p.id}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {eliminandoId === p.id ? '...' : 'Eliminar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-border rounded flex-1 min-w-[200px]"
        />
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
        <Button onClick={() => navigate('/products')}>Ir a Productos</Button>
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left">Código</th>
                <th className="py-2 text-left">Nombre</th>
                <th className="py-2 text-left">Precio</th>
                <th className="py-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="py-2">{p.codigoBarras ?? '-'}</td>
                  <td className="py-2">{p.nombre}</td>
                  <td className="py-2">S/ {p.precioVenta?.toFixed(2)}</td>
                  <td className="py-2">{p.stockActual}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <p className="py-4 text-text-secondary">No hay productos</p>}
        </div>
      )}
    </div>
  );
};
