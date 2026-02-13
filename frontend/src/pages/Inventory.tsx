import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertTriangle, Plus, ShoppingCart, BarChart2, RefreshCw } from 'lucide-react';
import {
  fetchStockBajo,
  fetchProximosVencer,
  fetchMovimientosInventario,
  ajustarInventario,
  crearCompra,
  fetchProductos,
  fetchProveedores,
  descargarReporteInventarioPDF,
  type ProductoDTO,
  type ProveedorDTO,
  type MovimientoInventarioDTO,
  type CrearCompraItem,
} from '../api/api';

const formatDate = (s: string) => {
  try {
    const d = new Date(s);
    return d.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return s;
  }
};

const diasParaVencer = (fechaVenc?: string) => {
  if (!fechaVenc) return null;
  const venc = new Date(fechaVenc);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  venc.setHours(0, 0, 0, 0);
  return Math.ceil((venc.getTime() - hoy.getTime()) / (24 * 60 * 60 * 1000));
};

export const Inventory = () => {
  const [stockBajo, setStockBajo] = useState<ProductoDTO[]>([]);
  const [proximosVencer, setProximosVencer] = useState<ProductoDTO[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAjuste, setModalAjuste] = useState(false);
  const [modalCompra, setModalCompra] = useState(false);
  const [ajusteProducto, setAjusteProducto] = useState<ProductoDTO | null>(null);
  const [ajusteStockFisico, setAjusteStockFisico] = useState('');
  const [ajusteSaving, setAjusteSaving] = useState(false);
  const [compraProveedor, setCompraProveedor] = useState<number | ''>('');
  const [compraItems, setCompraItems] = useState<CrearCompraItem[]>([]);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [compraSaving, setCompraSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [stockRes, proximosRes, movRes] = await Promise.all([
      fetchStockBajo(),
      fetchProximosVencer(),
      fetchMovimientosInventario({ size: 20 }),
    ]);
    if (stockRes.success && stockRes.data) setStockBajo(stockRes.data);
    if (proximosRes.success && proximosRes.data) setProximosVencer(proximosRes.data);
    if (movRes.success && movRes.data?.content) setMovimientos(movRes.data.content);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openAjuste = async (p?: ProductoDTO) => {
    setAjusteProducto(p ?? null);
    setAjusteStockFisico(p ? String(p.stockActual) : '');
    setError(null);
    setModalAjuste(true);
    if (productos.length === 0) {
      const res = await fetchProductos({ size: 200 });
      if (res.success && res.data?.content) setProductos(res.data.content);
    }
  };

  const handleAjuste = async () => {
    const producto = ajusteProducto;
    const stock = parseInt(ajusteStockFisico, 10);
    if (!producto || isNaN(stock) || stock < 0) {
      setError('Seleccione un producto y un stock físico válido');
      return;
    }
    setAjusteSaving(true);
    setError(null);
    const res = await ajustarInventario(producto.id, stock);
    setAjusteSaving(false);
    if (res.success) {
      setModalAjuste(false);
      load();
    } else {
      setError(res.error?.message ?? 'Error al ajustar');
    }
  };

  const openCompra = async () => {
    setCompraProveedor('');
    setCompraItems([]);
    setError(null);
    setModalCompra(true);
    const [pRes, provRes] = await Promise.all([fetchProductos({ size: 200 }), fetchProveedores()]);
    if (pRes.success && pRes.data?.content) setProductos(pRes.data.content);
    if (provRes.success && provRes.data) setProveedores(Array.isArray(provRes.data) ? provRes.data : []);
  };

  const addCompraItem = () => {
    const first = productos[0];
    if (first) {
      setCompraItems((prev) => [...prev, { productoId: first.id, cantidad: 1, precioUnitario: first.precioCompra ?? first.precioVenta }]);
    }
  };

  const updateCompraItem = (idx: number, field: keyof CrearCompraItem, value: number) => {
    setCompraItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const removeCompraItem = (idx: number) => {
    setCompraItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCompra = async () => {
    const provId = compraProveedor;
    if (!provId || compraItems.length === 0) {
      setError('Seleccione un proveedor y agregue al menos un item');
      return;
    }
    for (const it of compraItems) {
      if (it.cantidad < 1 || it.precioUnitario <= 0) {
        setError('Cantidad y precio deben ser válidos');
        return;
      }
    }
    setCompraSaving(true);
    setError(null);
    const res = await crearCompra({
      proveedorId: Number(provId),
      items: compraItems,
    });
    setCompraSaving(false);
    if (res.success) {
      setModalCompra(false);
      load();
    } else {
      setError(res.error?.message ?? 'Error al registrar compra');
    }
  };

  const handleDescargarReporte = async () => {
    try {
      await descargarReporteInventarioPDF();
    } catch {
      setError('Error al descargar el reporte');
    }
  };

  const totalStockBajo = stockBajo.length;
  const totalProximosVencer = proximosVencer.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDescargarReporte}>
            <BarChart2 size={18} className="mr-2" /> Reportes
          </Button>
          <Button variant="outline" onClick={() => openAjuste()}>
            <RefreshCw size={18} className="mr-2" /> Ajuste
          </Button>
          <Button onClick={openCompra}>
            <ShoppingCart size={18} className="mr-2" /> Compra
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : (
        <>
          <Card className={totalStockBajo > 0 || totalProximosVencer > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}>
            <CardContent className="flex flex-col gap-2 p-4">
              <h3 className="font-bold flex items-center gap-2">
                <AlertTriangle size={20} />
                ALERTAS DE INVENTARIO
              </h3>
              <p className={totalStockBajo > 0 ? 'text-orange-800' : 'text-green-800'}>
                {totalStockBajo} productos con stock bajo
              </p>
              <p className={totalProximosVencer > 0 ? 'text-orange-800' : 'text-green-800'}>
                {totalProximosVencer} productos próximos a vencer
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent>
                {stockBajo.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2">Producto</th>
                        <th className="py-2">Actual</th>
                        <th className="py-2">Mín.</th>
                        <th className="py-2">Faltante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockBajo.map((p) => {
                        const min = p.stockMinimo ?? 0;
                        const faltante = Math.max(0, min - p.stockActual);
                        return (
                          <tr key={p.id} className="border-b border-border">
                            <td className="py-2">{p.nombre}</td>
                            <td className="py-2 text-red-600 font-bold">{p.stockActual}</td>
                            <td className="py-2">{min}</td>
                            <td className="py-2">{faltante}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-text-secondary py-4">No hay productos con stock bajo</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos Próximos a Vencer</CardTitle>
              </CardHeader>
              <CardContent>
                {proximosVencer.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2">Producto</th>
                        <th className="py-2">Vence</th>
                        <th className="py-2">Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proximosVencer.map((p) => {
                        const dias = diasParaVencer(p.fechaVencimiento);
                        return (
                          <tr key={p.id} className="border-b border-border">
                            <td className="py-2">{p.nombre}</td>
                            <td className="py-2">
                              {p.fechaVencimiento ? new Date(p.fechaVencimiento).toLocaleDateString('es-PE') : '-'}
                            </td>
                            <td className="py-2 text-warning font-bold">{dias ?? '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-text-secondary py-4">No hay productos próximos a vencer</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {movimientos.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2">Fecha</th>
                      <th className="py-2">Producto</th>
                      <th className="py-2">Tipo</th>
                      <th className="py-2">Cant.</th>
                      <th className="py-2">Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((m) => (
                      <tr key={m.id} className="border-b border-border">
                        <td className="py-2">{formatDate(m.fecha)}</td>
                        <td className="py-2">{m.producto?.nombre ?? '-'}</td>
                        <td className="py-2">
                          <span
                            className={
                              m.tipoMovimiento === 'SALIDA'
                                ? 'text-red-600'
                                : m.tipoMovimiento === 'ENTRADA'
                                ? 'text-green-600'
                                : ''
                            }
                          >
                            {m.tipoMovimiento}
                          </span>
                        </td>
                        <td className="py-2">
                          {m.tipoMovimiento === 'SALIDA' ? '-' : '+'}{m.cantidad}
                        </td>
                        <td className="py-2">{m.usuario?.nombre ?? m.usuario?.username ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-text-secondary py-4">No hay movimientos recientes</p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal Ajuste */}
      {modalAjuste && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border font-bold">Ajuste de Inventario</div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Producto</label>
                <select
                  value={ajusteProducto?.id ?? ''}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const all = [...stockBajo, ...productos.filter((x) => !stockBajo.some((s) => s.id === x.id))];
                    const p = id ? all.find((x) => x.id === id) ?? null : null;
                    setAjusteProducto(p);
                    setAjusteStockFisico(p ? String(p.stockActual) : '');
                  }}
                  className="w-full px-3 py-2 border border-border rounded"
                >
                  <option value="">Seleccione producto</option>
                  {[...stockBajo, ...productos.filter((p) => !stockBajo.some((s) => s.id === p.id))].map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stockActual})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Stock físico"
                type="number"
                min="0"
                value={ajusteStockFisico}
                onChange={(e) => setAjusteStockFisico(e.target.value)}
                placeholder="Cantidad en inventario físico"
              />
              {ajusteProducto && (
                <p className="text-sm text-text-secondary">
                  Stock en sistema: {ajusteProducto.stockActual}
                </p>
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalAjuste(false)} disabled={ajusteSaving}>
                Cancelar
              </Button>
              <Button onClick={handleAjuste} disabled={ajusteSaving || !ajusteProducto}>
                {ajusteSaving ? 'Guardando...' : 'Ajustar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Compra */}
      {modalCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full my-8">
            <div className="p-4 border-b border-border font-bold">Registrar Compra</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Proveedor *</label>
                <select
                  value={compraProveedor}
                  onChange={(e) => setCompraProveedor(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-border rounded"
                >
                  <option value="">Seleccione proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.razonSocial}
                    </option>
                  ))}
                </select>
                {proveedores.length === 0 && (
                  <p className="text-sm text-text-secondary mt-1">No hay proveedores. Cree uno en Configuración.</p>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Items</label>
                  <Button variant="outline" size="sm" onClick={addCompraItem}>
                    <Plus size={14} className="mr-1" /> Añadir
                  </Button>
                </div>
                {compraItems.length === 0 ? (
                  <p className="text-sm text-text-secondary">Agregue productos a la compra</p>
                ) : (
                  <ul className="space-y-2">
                    {compraItems.map((it, idx) => (
                        <li key={idx} className="flex gap-2 items-center flex-wrap border border-border rounded p-2">
                          <select
                            value={it.productoId}
                            onChange={(e) => updateCompraItem(idx, 'productoId', Number(e.target.value))}
                            className="flex-1 min-w-[140px] px-2 py-1 border border-border rounded text-sm"
                          >
                            {productos.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nombre}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={it.cantidad}
                            onChange={(e) => updateCompraItem(idx, 'cantidad', parseInt(e.target.value, 10) || 1)}
                            className="w-20 px-2 py-1 border border-border rounded text-sm"
                            placeholder="Cant"
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={it.precioUnitario}
                            onChange={(e) => updateCompraItem(idx, 'precioUnitario', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-border rounded text-sm"
                            placeholder="P. unit"
                          />
                          <Button variant="ghost" size="sm" className="text-error" onClick={() => removeCompraItem(idx)}>
                            Eliminar
                          </Button>
                        </li>
                    ))}
                  </ul>
                )}
                {compraItems.length > 0 && (
                  <p className="text-sm font-medium mt-2">
                    Total: S/ {compraItems.reduce((s, it) => s + it.cantidad * it.precioUnitario, 0).toFixed(2)}
                  </p>
                )}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalCompra(false)} disabled={compraSaving}>
                Cancelar
              </Button>
              <Button onClick={handleCompra} disabled={compraSaving || compraItems.length === 0}>
                {compraSaving ? 'Registrando...' : 'Registrar Compra'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
