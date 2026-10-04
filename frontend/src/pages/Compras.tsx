import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  ShoppingBag, Plus, X, ChevronLeft, ChevronRight, Search, Package, Eye,
  CheckCircle, XCircle, Clock, Truck,
} from 'lucide-react';
import {
  fetchCompras,
  fetchCompraPorId,
  crearCompraCompleta,
  recibirCompra,
  anularCompra,
  fetchProveedores,
  fetchProductos,
  type CompraDTO,
  type ProveedorDTO,
  type ProductoDTO,
} from '../api/api';
import { useAuth } from '../context/AuthContext';

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;
const formatFecha = (s: string) => new Date(s).toLocaleDateString('es-PE');

const ESTADOS = ['', 'PENDIENTE', 'RECIBIDA', 'COMPLETADA', 'ANULADA'] as const;

const estadoBadge = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'RECIBIDA':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'COMPLETADA':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'ANULADA':
      return 'bg-red-100 text-red-800 border border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};

const estadoIcon = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return <Clock size={13} className="inline mr-1" />;
    case 'RECIBIDA': return <Truck size={13} className="inline mr-1" />;
    case 'COMPLETADA': return <CheckCircle size={13} className="inline mr-1" />;
    case 'ANULADA': return <XCircle size={13} className="inline mr-1" />;
    default: return null;
  }
};

interface NuevaCompraItem {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

interface RecepcionItem {
  productoId: number;
  productoNombre: string;
  cantidadOrdenada: number;
  cantidadRecibida: number;
  cantidadARecibir: number;
}

export const Compras = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  // Lista principal
  const [compras, setCompras] = useState<CompraDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  // Proveedores y productos para formulario
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [productosSearch, setProductosSearch] = useState<ProductoDTO[]>([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');

  // Modal nueva compra
  const [showNuevaCompra, setShowNuevaCompra] = useState(false);
  const [ncProveedorId, setNcProveedorId] = useState('');
  const [ncFecha, setNcFecha] = useState('');
  const [ncObservaciones, setNcObservaciones] = useState('');
  const [ncItems, setNcItems] = useState<NuevaCompraItem[]>([]);
  const [ncLoading, setNcLoading] = useState(false);
  const [ncError, setNcError] = useState<string | null>(null);

  // Modal recepción
  const [showRecepcion, setShowRecepcion] = useState(false);
  const [recepcionCompra, setRecepcionCompra] = useState<CompraDTO | null>(null);
  const [recepcionItems, setRecepcionItems] = useState<RecepcionItem[]>([]);
  const [recepcionLoading, setRecepcionLoading] = useState(false);
  const [recepcionError, setRecepcionError] = useState<string | null>(null);

  // Modal detalle
  const [showDetalle, setShowDetalle] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState<CompraDTO | null>(null);

  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const cargarCompras = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    const res = await fetchCompras({
      estado: filtroEstado || undefined,
      fechaDesde: filtroDesde || undefined,
      fechaHasta: filtroHasta || undefined,
      page: p,
      size: PAGE_SIZE,
    });
    setLoading(false);
    if (res.success && res.data) {
      setCompras(res.data.content);
      setTotalElements(res.data.totalElements);
    } else {
      setError(res.error?.message ?? 'Error al cargar compras');
    }
  }, [filtroEstado, filtroDesde, filtroHasta]);

  useEffect(() => {
    cargarCompras(page);
  }, [page, cargarCompras]);

  useEffect(() => {
    fetchProveedores().then(r => { if (r.success && r.data) setProveedores(r.data); });
  }, []);

  const handleBuscar = () => {
    setPage(0);
    cargarCompras(0);
  };

  // Búsqueda de productos para nueva compra
  useEffect(() => {
    if (busquedaProducto.length < 2) { setProductosSearch([]); return; }
    const t = setTimeout(async () => {
      const r = await fetchProductos({ search: busquedaProducto, size: 8 });
      if (r.success && r.data) setProductosSearch(r.data.content);
    }, 300);
    return () => clearTimeout(t);
  }, [busquedaProducto]);

  const agregarItemNuevaCompra = (prod: ProductoDTO) => {
    const exists = ncItems.find(i => i.productoId === prod.id);
    if (exists) {
      setNcItems(prev => prev.map(i => i.productoId === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setNcItems(prev => [...prev, {
        productoId: prod.id,
        productoNombre: prod.nombre,
        cantidad: 1,
        precioUnitario: prod.precioCompra ?? 0,
      }]);
    }
    setBusquedaProducto('');
    setProductosSearch([]);
  };

  const actualizarItemNc = (idx: number, field: 'cantidad' | 'precioUnitario', val: number) => {
    setNcItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const quitarItemNc = (idx: number) => {
    setNcItems(prev => prev.filter((_, i) => i !== idx));
  };

  const totalNc = ncItems.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0);

  const handleRegistrarCompra = async () => {
    if (!ncProveedorId) { setNcError('Selecciona un proveedor'); return; }
    if (ncItems.length === 0) { setNcError('Agrega al menos un producto'); return; }
    setNcLoading(true);
    setNcError(null);
    const res = await crearCompraCompleta({
      proveedorId: Number(ncProveedorId),
      fechaCompra: ncFecha || undefined,
      observaciones: ncObservaciones || undefined,
      items: ncItems.map(i => ({ productoId: i.productoId, cantidad: i.cantidad, precioUnitario: i.precioUnitario })),
    });
    setNcLoading(false);
    if (res.success) {
      setShowNuevaCompra(false);
      resetNuevaCompra();
      cargarCompras(0);
    } else {
      setNcError(res.error?.message ?? 'Error al registrar la compra');
    }
  };

  const resetNuevaCompra = () => {
    setNcProveedorId('');
    setNcFecha('');
    setNcObservaciones('');
    setNcItems([]);
    setNcError(null);
    setBusquedaProducto('');
    setProductosSearch([]);
  };

  // Recepción
  const handleAbrirRecepcion = async (compra: CompraDTO) => {
    setRecepcionError(null);
    const res = await fetchCompraPorId(compra.id);
    if (res.success && res.data) {
      const c = res.data;
      setRecepcionCompra(c);
      setRecepcionItems((c.detalles ?? []).map(d => ({
        productoId: d.producto.id,
        productoNombre: d.producto.nombre,
        cantidadOrdenada: d.cantidad,
        cantidadRecibida: d.cantidadRecibida,
        cantidadARecibir: d.cantidad - d.cantidadRecibida,
      })));
      setShowRecepcion(true);
    }
  };

  const handleRecibirTodo = () => {
    setRecepcionItems(prev => prev.map(i => ({ ...i, cantidadARecibir: i.cantidadOrdenada - i.cantidadRecibida })));
  };

  const handleConfirmarRecepcion = async () => {
    if (!recepcionCompra) return;
    setRecepcionLoading(true);
    setRecepcionError(null);
    const res = await recibirCompra(recepcionCompra.id, {
      items: recepcionItems.map(i => ({ productoId: i.productoId, cantidadRecibida: i.cantidadARecibir })),
    });
    setRecepcionLoading(false);
    if (res.success) {
      setShowRecepcion(false);
      cargarCompras(page);
    } else {
      setRecepcionError(res.error?.message ?? 'Error al registrar recepción');
    }
  };

  // Detalle
  const handleVerDetalle = async (compra: CompraDTO) => {
    const res = await fetchCompraPorId(compra.id);
    if (res.success && res.data) {
      setDetalleCompra(res.data);
      setShowDetalle(true);
    }
  };

  // Anular
  const handleAnular = async (compra: CompraDTO) => {
    if (!confirm(`¿Anular la compra ${compra.numeroCompra}?`)) return;
    await anularCompra(compra.id);
    cargarCompras(page);
  };

  // Stats
  const totalComprasPeriodo = compras.reduce((s, c) => s + c.total, 0);
  const pendientesCount = compras.filter(c => c.estado === 'PENDIENTE').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag size={26} /> Compras de Mercaderia
        </h2>
        <Button onClick={() => { resetNuevaCompra(); setShowNuevaCompra(true); }}>
          <Plus size={16} className="mr-1" /> Nueva Compra
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Estado</label>
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {ESTADOS.map(e => <option key={e} value={e}>{e || 'Todos'}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Desde</label>
              <input
                type="date"
                value={filtroDesde}
                onChange={e => setFiltroDesde(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Hasta</label>
              <input
                type="date"
                value={filtroHasta}
                onChange={e => setFiltroHasta(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <Button onClick={handleBuscar} variant="outline">
              <Search size={15} className="mr-1" /> Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500">Total compras (periodo)</p>
            <p className="text-2xl font-bold text-blue-700">{formatSoles(totalComprasPeriodo)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500">Ordenes en periodo</p>
            <p className="text-2xl font-bold text-purple-700">{totalElements}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500">Pendientes de recibir</p>
            <p className="text-2xl font-bold text-yellow-600">{pendientesCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 text-sm">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Listado de compras</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">Cargando...</p>
          ) : compras.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">No hay compras registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">N° Compra</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Proveedor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Comprador</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">{c.numeroCompra}</td>
                      <td className="py-3 px-4 text-gray-600">{formatFecha(c.fechaCompra)}</td>
                      <td className="py-3 px-4">{c.proveedor?.razonSocial ?? '-'}</td>
                      <td className="py-3 px-4">
                        <span>{c.usuario?.nombre ?? '-'}</span>
                        {c.usuario?.rol && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                            c.usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>{c.usuario.rol}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">{formatSoles(c.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estadoBadge(c.estado)}`}>
                          {estadoIcon(c.estado)}{c.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {c.estado === 'PENDIENTE' && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => handleAbrirRecepcion(c)}
                                className="text-xs px-2 py-1 h-auto border-green-400 text-green-700 hover:bg-green-50"
                              >
                                <Truck size={13} className="mr-1" /> Recibir
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleAnular(c)}
                                  className="text-xs px-2 py-1 h-auto border-red-400 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle size={13} className="mr-1" /> Anular
                                </Button>
                              )}
                            </>
                          )}
                          {(c.estado === 'RECIBIDA' || c.estado === 'COMPLETADA' || c.estado === 'ANULADA') && (
                            <Button
                              variant="outline"
                              onClick={() => handleVerDetalle(c)}
                              className="text-xs px-2 py-1 h-auto"
                            >
                              <Eye size={13} className="mr-1" /> Ver detalle
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginacion */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalElements)} de {totalElements}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 0} className="px-2 py-1 h-auto text-xs">
                  <ChevronLeft size={14} />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                  return (
                    <Button
                      key={pg}
                      variant={pg === page ? 'primary' : 'outline'}
                      onClick={() => setPage(pg)}
                      className="px-3 py-1 h-auto text-xs"
                    >
                      {pg + 1}
                    </Button>
                  );
                })}
                <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="px-2 py-1 h-auto text-xs">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL: Nueva Compra */}
      {showNuevaCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold">Nueva Orden de Compra</h3>
              <button onClick={() => setShowNuevaCompra(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Proveedor */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Proveedor *</label>
                <select
                  value={ncProveedorId}
                  onChange={e => setNcProveedorId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.razonSocial}</option>)}
                </select>
              </div>

              {/* Fecha */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Fecha de compra</label>
                <input
                  type="date"
                  value={ncFecha}
                  onChange={e => setNcFecha(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Buscar producto */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Buscar producto</label>
                <div className="relative">
                  <Input
                    value={busquedaProducto}
                    onChange={e => setBusquedaProducto(e.target.value)}
                    placeholder="Nombre del producto..."
                  />
                  {productosSearch.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-full mt-1 max-h-48 overflow-y-auto">
                      {productosSearch.map(p => (
                        <button
                          key={p.id}
                          onClick={() => agregarItemNuevaCompra(p)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm flex justify-between"
                        >
                          <span>{p.nombre}</span>
                          <span className="text-gray-400 text-xs">{formatSoles(p.precioCompra ?? 0)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              {ncItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Items de la orden</label>
                  <div className="border border-gray-200 rounded overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Producto</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-500 w-24">Cantidad</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-500 w-28">Precio unit.</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-500 w-24">Subtotal</th>
                          <th className="w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ncItems.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 px-3">{item.productoNombre}</td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={1}
                                value={item.cantidad}
                                onChange={e => actualizarItemNc(idx, 'cantidad', Number(e.target.value))}
                                className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={item.precioUnitario}
                                onChange={e => actualizarItemNc(idx, 'precioUnitario', Number(e.target.value))}
                                className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-medium">
                              {formatSoles(item.cantidad * item.precioUnitario)}
                            </td>
                            <td className="py-2 px-2">
                              <button onClick={() => quitarItemNc(idx)} className="text-red-400 hover:text-red-600">
                                <X size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold">
                          <td colSpan={3} className="py-2 px-3 text-right">Total:</td>
                          <td className="py-2 px-3 text-right text-blue-700">{formatSoles(totalNc)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea
                  value={ncObservaciones}
                  onChange={e => setNcObservaciones(e.target.value)}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  placeholder="Notas opcionales..."
                />
              </div>

              {ncError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{ncError}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowNuevaCompra(false)}>Cancelar</Button>
                <Button onClick={handleRegistrarCompra} disabled={ncLoading}>
                  {ncLoading ? 'Registrando...' : <><Package size={15} className="mr-1" /> Registrar Orden</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Recibir Mercaderia */}
      {showRecepcion && recepcionCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Recibir Mercaderia</h3>
                <p className="text-sm text-gray-500">{recepcionCompra.numeroCompra} — {recepcionCompra.proveedor?.razonSocial}</p>
              </div>
              <button onClick={() => setShowRecepcion(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleRecibirTodo} className="text-sm">
                  <CheckCircle size={14} className="mr-1" /> Recibir todo
                </Button>
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Producto</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">Ordenado</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">Ya recibido</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">A recibir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recepcionItems.map((item, idx) => {
                      const pendiente = item.cantidadOrdenada - item.cantidadRecibida;
                      return (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3">{item.productoNombre}</td>
                          <td className="py-2 px-3 text-center">{item.cantidadOrdenada}</td>
                          <td className="py-2 px-3 text-center text-green-600 font-medium">{item.cantidadRecibida}</td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min={0}
                              max={pendiente}
                              value={item.cantidadARecibir}
                              onChange={e => {
                                const val = Math.min(Number(e.target.value), pendiente);
                                setRecepcionItems(prev => prev.map((it, i) => i === idx ? { ...it, cantidadARecibir: val } : it));
                              }}
                              className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {recepcionError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{recepcionError}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowRecepcion(false)}>Cancelar</Button>
                <Button onClick={handleConfirmarRecepcion} disabled={recepcionLoading}>
                  {recepcionLoading ? 'Procesando...' : <><Truck size={15} className="mr-1" /> Confirmar Recepcion</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ver Detalle */}
      {showDetalle && detalleCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Detalle de compra</h3>
                <p className="text-sm text-gray-500">{detalleCompra.numeroCompra}</p>
              </div>
              <button onClick={() => setShowDetalle(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Proveedor:</span> <span className="font-medium">{detalleCompra.proveedor?.razonSocial}</span></div>
                <div><span className="text-gray-500">Estado:</span> <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${estadoBadge(detalleCompra.estado)}`}>{detalleCompra.estado}</span></div>
                <div><span className="text-gray-500">Fecha compra:</span> <span className="font-medium">{formatFecha(detalleCompra.fechaCompra)}</span></div>
                <div><span className="text-gray-500">Comprador:</span> <span className="font-medium">{detalleCompra.usuario?.nombre}</span></div>
                {detalleCompra.observaciones && (
                  <div className="col-span-2"><span className="text-gray-500">Observaciones:</span> <span>{detalleCompra.observaciones}</span></div>
                )}
              </div>

              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Producto</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">Cant.</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">Recibido</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">P. Unit.</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(detalleCompra.detalles ?? []).map((d, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 px-3">{d.producto.nombre}</td>
                        <td className="py-2 px-3 text-center">{d.cantidad}</td>
                        <td className="py-2 px-3 text-center text-green-600">{d.cantidadRecibida}</td>
                        <td className="py-2 px-3 text-right">{formatSoles(d.precioUnitario)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatSoles(d.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={4} className="py-2 px-3 text-right">Total:</td>
                      <td className="py-2 px-3 text-right text-blue-700">{formatSoles(detalleCompra.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setShowDetalle(false)}>Cerrar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
