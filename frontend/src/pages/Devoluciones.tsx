import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  RotateCcw, Plus, X, ChevronLeft, ChevronRight, Search, Eye,
} from 'lucide-react';
import {
  fetchDevoluciones,
  crearDevolucion,
  fetchVentaPorId,
  fetchProductos,
  type DevolucionDTO,
  type ProductoDTO,
  type VentaDTO,
} from '../api/api';

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;
const formatFecha = (s: string) => new Date(s).toLocaleDateString('es-PE');

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const hace = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const MOTIVOS: { value: string; label: string; short: string }[] = [
  { value: 'PRODUCTO_DEFECTUOSO', label: 'Producto defectuoso', short: 'Defectuoso' },
  { value: 'PRODUCTO_INCORRECTO', label: 'Producto incorrecto', short: 'Incorrecto' },
  { value: 'CAMBIO_PRODUCTO', label: 'Cambio de producto', short: 'Cambio' },
  { value: 'OTRO', label: 'Otro motivo', short: 'Otro' },
];

const motivoLabel = (motivo: string) =>
  MOTIVOS.find(m => m.value === motivo)?.short ?? motivo;

interface NdItem {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

export const Devoluciones = () => {
  const [devoluciones, setDevoluciones] = useState<DevolucionDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroDesde, setFiltroDesde] = useState(hace(7));
  const [filtroHasta, setFiltroHasta] = useState(today());
  const [preset, setPreset] = useState<'hoy' | '7d' | '30d' | 'custom'>('7d');

  // Modal nueva devolucion
  const [showNueva, setShowNueva] = useState(false);
  const [ndVentaNum, setNdVentaNum] = useState('');
  const [ndVenta, setNdVenta] = useState<VentaDTO | null>(null);
  const [ndMotivo, setNdMotivo] = useState('PRODUCTO_DEFECTUOSO');
  const [ndObservaciones, setNdObservaciones] = useState('');
  const [ndItems, setNdItems] = useState<NdItem[]>([]);
  const [ndLoading, setNdLoading] = useState(false);
  const [ndError, setNdError] = useState<string | null>(null);
  const [ndSearchProd, setNdSearchProd] = useState('');
  const [ndProductosResult, setNdProductosResult] = useState<ProductoDTO[]>([]);

  // Modal detalle
  const [showDetalle, setShowDetalle] = useState(false);
  const [detalleDevolucion, setDetalleDevolucion] = useState<DevolucionDTO | null>(null);

  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const cargar = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    const res = await fetchDevoluciones({
      desde: filtroDesde || undefined,
      hasta: filtroHasta || undefined,
      page: p,
      size: PAGE_SIZE,
    });
    setLoading(false);
    if (res.success && res.data) {
      setDevoluciones(res.data.content);
      setTotalElements(res.data.totalElements);
    } else {
      setError(res.error?.message ?? 'Error al cargar devoluciones');
    }
  }, [filtroDesde, filtroHasta]);

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  const aplicarPreset = (p: typeof preset) => {
    setPreset(p);
    const hoy = today();
    if (p === 'hoy') { setFiltroDesde(hoy); setFiltroHasta(hoy); }
    else if (p === '7d') { setFiltroDesde(hace(7)); setFiltroHasta(hoy); }
    else if (p === '30d') { setFiltroDesde(hace(30)); setFiltroHasta(hoy); }
    setPage(0);
  };

  const handleBuscar = () => {
    setPage(0);
    cargar(0);
  };

  // Buscar productos para nueva devolucion
  useEffect(() => {
    if (!showNueva || ndSearchProd.length < 2) { setNdProductosResult([]); return; }
    const t = setTimeout(async () => {
      const r = await fetchProductos({ search: ndSearchProd, size: 8 });
      if (r.success && r.data) setNdProductosResult(r.data.content);
    }, 300);
    return () => clearTimeout(t);
  }, [ndSearchProd, showNueva]);

  // Buscar venta por numero cuando cambia ndVentaNum
  const handleBuscarVenta = async () => {
    if (!ndVentaNum.trim()) { setNdVenta(null); setNdItems([]); return; }
    setNdError(null);
    // La API busca por ID numerico; si el usuario ingresa el numero de venta (ej. V-0001)
    // extraemos el numero al final o buscamos con el ID
    const idStr = ndVentaNum.replace(/\D/g, '');
    if (!idStr) { setNdError('Ingresa un numero de venta valido (ej: 1)'); return; }
    const res = await fetchVentaPorId(Number(idStr));
    if (res.success && res.data) {
      setNdVenta(res.data);
      // Auto-popular items desde la venta
      const items: NdItem[] = (res.data.detalles ?? [])
        .filter(d => d.producto)
        .map(d => ({
          productoId: d.producto!.id,
          productoNombre: d.producto!.nombre,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        }));
      setNdItems(items);
    } else {
      setNdError('No se encontro la venta');
      setNdVenta(null);
      setNdItems([]);
    }
  };

  const agregarProducto = (prod: ProductoDTO) => {
    const exists = ndItems.find(i => i.productoId === prod.id);
    if (exists) {
      setNdItems(prev => prev.map(i => i.productoId === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setNdItems(prev => [...prev, { productoId: prod.id, productoNombre: prod.nombre, cantidad: 1, precioUnitario: prod.precioVenta }]);
    }
    setNdSearchProd('');
    setNdProductosResult([]);
  };

  const actualizarItem = (idx: number, field: 'cantidad' | 'precioUnitario', val: number) => {
    setNdItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const quitarItem = (idx: number) => {
    setNdItems(prev => prev.filter((_, i) => i !== idx));
  };

  const totalNd = ndItems.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0);

  const handleRegistrarDevolucion = async () => {
    if (ndItems.length === 0) { setNdError('Agrega al menos un producto'); return; }
    if (!ndMotivo) { setNdError('Selecciona un motivo'); return; }
    setNdLoading(true);
    setNdError(null);
    const res = await crearDevolucion({
      ventaId: ndVenta?.id,
      motivo: ndMotivo,
      observaciones: ndObservaciones || undefined,
      items: ndItems.map(i => ({ productoId: i.productoId, cantidad: i.cantidad, precioUnitario: i.precioUnitario })),
    });
    setNdLoading(false);
    if (res.success) {
      setShowNueva(false);
      resetNueva();
      cargar(0);
    } else {
      setNdError(res.error?.message ?? 'Error al registrar la devolucion');
    }
  };

  const resetNueva = () => {
    setNdVentaNum('');
    setNdVenta(null);
    setNdMotivo('PRODUCTO_DEFECTUOSO');
    setNdObservaciones('');
    setNdItems([]);
    setNdError(null);
    setNdSearchProd('');
    setNdProductosResult([]);
  };

  // Stats
  const totalMonto = devoluciones.reduce((s, d) => s + d.total, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <RotateCcw size={26} /> Devoluciones
        </h2>
        <Button onClick={() => { resetNueva(); setShowNueva(true); }}>
          <Plus size={16} className="mr-1" /> Nueva Devolucion
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex gap-1">
              {(['hoy', '7d', '30d'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => aplicarPreset(p)}
                  className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                    preset === p
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p === 'hoy' ? 'Hoy' : p === '7d' ? 'Ultimos 7d' : 'Ultimos 30d'}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Desde</label>
              <input
                type="date"
                value={filtroDesde}
                onChange={e => { setFiltroDesde(e.target.value); setPreset('custom'); }}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Hasta</label>
              <input
                type="date"
                value={filtroHasta}
                onChange={e => { setFiltroHasta(e.target.value); setPreset('custom'); }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500">Monto devuelto (periodo)</p>
            <p className="text-2xl font-bold text-red-600">{formatSoles(totalMonto)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500">Cantidad de devoluciones</p>
            <p className="text-2xl font-bold text-purple-700">{totalElements}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 text-sm">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Listado de devoluciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">Cargando...</p>
          ) : devoluciones.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">No hay devoluciones en el periodo seleccionado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">N° Devolucion</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Venta Origen</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Motivo</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vendedor</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {devoluciones.map(d => (
                    <tr key={d.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold text-purple-700">{d.numeroDevolucion}</td>
                      <td className="py-3 px-4 text-gray-600">{formatFecha(d.fecha)}</td>
                      <td className="py-3 px-4">
                        {d.numeroVenta
                          ? <span className="text-blue-600 font-medium">{d.numeroVenta}</span>
                          : <span className="text-gray-400 italic">Sin venta</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          {motivoLabel(d.motivo)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">{formatSoles(d.total)}</td>
                      <td className="py-3 px-4">{d.usuario?.nombre ?? '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          d.estado === 'COMPLETADA'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : d.estado === 'ANULADA'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                          {d.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="outline"
                          onClick={() => { setDetalleDevolucion(d); setShowDetalle(true); }}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          <Eye size={13} className="mr-1" /> Ver detalle
                        </Button>
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

      {/* MODAL: Nueva Devolucion */}
      {showNueva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold">Nueva Devolucion</h3>
              <button onClick={() => setShowNueva(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">

              {/* Venta de origen */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">N° de Venta (opcional)</label>
                <div className="flex gap-2">
                  <Input
                    value={ndVentaNum}
                    onChange={e => setNdVentaNum(e.target.value)}
                    placeholder="Ej: 1 (ID de la venta)"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleBuscarVenta} type="button">
                    <Search size={15} className="mr-1" /> Buscar
                  </Button>
                </div>
                {ndVenta && (
                  <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-1.5 mt-1">
                    Venta: <span className="font-semibold">{ndVenta.numeroVenta}</span> — Total: {formatSoles(ndVenta.total)}
                    {ndVenta.cliente && ` — ${ndVenta.cliente.nombre}`}
                  </p>
                )}
              </div>

              {/* Motivo */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Motivo *</label>
                <select
                  value={ndMotivo}
                  onChange={e => setNdMotivo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {MOTIVOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Buscar producto (solo si no vino de una venta) */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  {ndVenta ? 'Productos devueltos (de la venta, edita cantidades)' : 'Agregar producto'}
                </label>
                {!ndVenta && (
                  <div className="relative">
                    <Input
                      value={ndSearchProd}
                      onChange={e => setNdSearchProd(e.target.value)}
                      placeholder="Buscar producto..."
                    />
                    {ndProductosResult.length > 0 && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-full mt-1 max-h-48 overflow-y-auto">
                        {ndProductosResult.map(p => (
                          <button
                            key={p.id}
                            onClick={() => agregarProducto(p)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm flex justify-between"
                          >
                            <span>{p.nombre}</span>
                            <span className="text-gray-400 text-xs">{formatSoles(p.precioVenta)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Items */}
              {ndItems.length > 0 && (
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
                      {ndItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3">{item.productoNombre}</td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min={1}
                              value={item.cantidad}
                              onChange={e => actualizarItem(idx, 'cantidad', Number(e.target.value))}
                              className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={item.precioUnitario}
                              onChange={e => actualizarItem(idx, 'precioUnitario', Number(e.target.value))}
                              className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-medium">
                            {formatSoles(item.cantidad * item.precioUnitario)}
                          </td>
                          <td className="py-2 px-2">
                            <button onClick={() => quitarItem(idx)} className="text-red-400 hover:text-red-600">
                              <X size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={3} className="py-2 px-3 text-right">Total a devolver:</td>
                        <td className="py-2 px-3 text-right text-red-600">{formatSoles(totalNd)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Observaciones */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea
                  value={ndObservaciones}
                  onChange={e => setNdObservaciones(e.target.value)}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  placeholder="Notas opcionales..."
                />
              </div>

              {ndError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{ndError}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowNueva(false)}>Cancelar</Button>
                <Button onClick={handleRegistrarDevolucion} disabled={ndLoading}>
                  {ndLoading ? 'Registrando...' : <><RotateCcw size={15} className="mr-1" /> Registrar Devolucion</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ver Detalle */}
      {showDetalle && detalleDevolucion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Detalle de devolucion</h3>
                <p className="text-sm text-gray-500">{detalleDevolucion.numeroDevolucion}</p>
              </div>
              <button onClick={() => setShowDetalle(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formatFecha(detalleDevolucion.fecha)}</span></div>
                <div>
                  <span className="text-gray-500">Venta origen:</span>{' '}
                  <span className="font-medium">{detalleDevolucion.numeroVenta ?? 'Sin venta'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Motivo:</span>{' '}
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    {MOTIVOS.find(m => m.value === detalleDevolucion.motivo)?.label ?? detalleDevolucion.motivo}
                  </span>
                </div>
                <div><span className="text-gray-500">Vendedor:</span> <span className="font-medium">{detalleDevolucion.usuario?.nombre}</span></div>
                <div><span className="text-gray-500">Estado:</span> <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium border ${
                  detalleDevolucion.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                }`}>{detalleDevolucion.estado}</span></div>
                <div><span className="text-gray-500">Total:</span> <span className="font-bold text-red-600">{formatSoles(detalleDevolucion.total)}</span></div>
                {detalleDevolucion.observaciones && (
                  <div className="col-span-2"><span className="text-gray-500">Obs.:</span> {detalleDevolucion.observaciones}</div>
                )}
              </div>

              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Producto</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-500">Cant.</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">P. Unit.</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(detalleDevolucion.detalles ?? []).map((d, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 px-3">{d.productoNombre}</td>
                        <td className="py-2 px-3 text-center">{d.cantidad}</td>
                        <td className="py-2 px-3 text-right">{formatSoles(d.precioUnitario)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatSoles(d.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="py-2 px-3 text-right">Total:</td>
                      <td className="py-2 px-3 text-right text-red-600">{formatSoles(detalleDevolucion.total)}</td>
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
