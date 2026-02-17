import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import {
  fetchProductos,
  fetchCategorias,
  eliminarProductoByCodigo,
  eliminarCategoriaByNombre,
  type ProductoDTO,
  type CategoriaDTO,
} from '../../api/api';
import { useNavigate } from 'react-router-dom';

const PRODUCTOS_A_ELIMINAR = [
  { codigo: '234234', nombre: 'Pilsen' },
  { codigo: '7891234567891', nombre: 'Ron Cartavio Black 750 ml' },
];
const CATEGORIA_A_ELIMINAR = 'Cervezas';

export const ProductosSettings = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [limpiando, setLimpiando] = useState(false);

  useEffect(() => {
    load();
  }, [search, categoriaId]);

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetchProductos({ search: search || undefined, categoriaId: categoriaId || undefined, size: 50 }),
      fetchCategorias(false),
    ]);
    if (prodRes.success && prodRes.data?.content) setItems(prodRes.data.content);
    if (catRes.success && catRes.data) setCategorias(catRes.data);
    setLoading(false);
  };

  const limpiarProductosYCategoriaPrueba = async () => {
    if (!window.confirm(`¿Desactivar productos ${PRODUCTOS_A_ELIMINAR.map((x) => x.nombre).join(', ')} y eliminar la categoría "${CATEGORIA_A_ELIMINAR}"?`)) return;
    setLimpiando(true);
    for (const { codigo } of PRODUCTOS_A_ELIMINAR) {
      await eliminarProductoByCodigo(codigo);
    }
    await eliminarCategoriaByNombre(CATEGORIA_A_ELIMINAR);
    setLimpiando(false);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary text-sm">Gestionar productos (crear y editar en la página Productos)</p>
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
        <Button
          variant="outline"
          onClick={limpiarProductosYCategoriaPrueba}
          disabled={limpiando}
          title={`Desactivar productos: ${PRODUCTOS_A_ELIMINAR.map((x) => x.nombre).join(', ')} y eliminar categoría ${CATEGORIA_A_ELIMINAR}`}
        >
          {limpiando ? 'Ejecutando...' : 'Quitar Pilsen, Ron Cartavio y categoría Cervezas'}
        </Button>
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
