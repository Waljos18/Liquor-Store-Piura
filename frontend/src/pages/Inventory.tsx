import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAlertasConfig } from '../config/alertasConfig';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  AlertTriangle, Plus, ShoppingCart, BarChart2, RefreshCw,
  Search, TrendingDown, Clock, ArrowDownCircle, ArrowUpCircle,
  SlidersHorizontal, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import {
  fetchStockBajo,
  fetchProximosVencer,
  fetchMovimientosInventario,
  ajustarInventario,
  crearCompra,
  fetchProductos,
  fetchProveedores,
  descargarReporteInventarioPDF,
  crearMovimientoManual,
  fetchMermas,
  registrarMerma,
  type ProductoDTO,
  type ProveedorDTO,
  type MovimientoInventarioDTO,
  type CrearCompraItem,
  type MermaDTO,
} from '../api/api';

type Tab = 'alertas' | 'movimientos' | 'mermas';

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return s; }
};

const diasParaVencer = (fechaVenc?: string) => {
  if (!fechaVenc) return null;
  const venc = new Date(fechaVenc);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  venc.setHours(0, 0, 0, 0);
  return Math.ceil((venc.getTime() - hoy.getTime()) / 86400000);
};

const StockBar = ({ actual, minimo, maximo }: { actual: number; minimo?: number; maximo?: number }) => {
  const min = minimo ?? 0;
  const max = maximo ?? Math.max(actual, min * 2, 10);
  const pct = max > 0 ? Math.min(100, (actual / max) * 100) : 0;
  const color = actual <= 0 ? 'bg-red-500' : actual <= min ? 'bg-orange-400' : actual <= min * 1.5 ? 'bg-yellow-400' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-background rounded-full h-1.5 min-w-[40px]">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-text-secondary w-6 text-right">{actual}</span>
    </div>
  );
};

const TipoMovBadge = ({ tipo }: { tipo: string }) => {
  const styles: Record<string, string> = {
    ENTRADA: 'bg-green-100 text-green-800',
    SALIDA: 'bg-red-100 text-red-800',
    AJUSTE: 'bg-blue-100 text-blue-800',
  };
  const icons: Record<string, React.ReactNode> = {
    ENTRADA: <ArrowDownCircle size={11} />,
    SALIDA: <ArrowUpCircle size={11} />,
    AJUSTE: <SlidersHorizontal size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[tipo] ?? 'bg-gray-100'}`}>
      {icons[tipo]} {tipo}
    </span>
  );
};

const MOV_PAGE_SIZE = 15;

export const Inventory = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const alertasConfig = useMemo(() => getAlertasConfig(), []);
  const [tab, setTab] = useState<Tab>('alertas');
  const [stockBajo, setStockBajo] = useState<ProductoDTO[]>([]);
  const [proximosVencer, setProximosVencer] = useState<ProductoDTO[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventarioDTO[]>([]);
  const [totalMovimientos, setTotalMovimientos] = useState(0);
  const [movPage, setMovPage] = useState(0);
  const [movFilterTipo, setMovFilterTipo] = useState('');
  const [movFilterSearch, setMovFilterSearch] = useState('');
  const [movFilterDesde, setMovFilterDesde] = useState('');
  const [movFilterHasta, setMovFilterHasta] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMov, setLoadingMov] = useState(false);

  // Modales
  const [modalAjuste, setModalAjuste] = useState(false);
  const [modalCompra, setModalCompra] = useState(false);
  const [modalMovManual, setModalMovManual] = useState(false);
  const [ajusteProducto, setAjusteProducto] = useState<ProductoDTO | null>(null);
  const [ajusteStockFisico, setAjusteStockFisico] = useState('');
  const [ajusteSaving, setAjusteSaving] = useState(false);
  const [compraProveedor, setCompraProveedor] = useState<number | ''>('');
  const [compraItems, setCompraItems] = useState<CrearCompraItem[]>([]);
  const [compraSaving, setCompraSaving] = useState(false);
  const [movManualProductoId, setMovManualProductoId] = useState<number | ''>('');
  const [movManualTipo, setMovManualTipo] = useState<'ENTRADA' | 'SALIDA' | 'AJUSTE'>('ENTRADA');
  const [movManualCantidad, setMovManualCantidad] = useState('');
  const [movManualMotivo, setMovManualMotivo] = useState('');
  const [movManualSaving, setMovManualSaving] = useState(false);

  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mermas
  const [mermas, setMermas] = useState<MermaDTO[]>([]);
  const [totalMermas, setTotalMermas] = useState(0);
  const [mermaPage, setMermaPage] = useState(0);
  const [loadingMermas, setLoadingMermas] = useState(false);
  const [showModalMerma, setShowModalMerma] = useState(false);
  const [mermaProductoId, setMermaProductoId] = useState<number | ''>('');
  const [mermaCantidad, setMermaCantidad] = useState('');
  const [mermaMotivo, setMermaMotivo] = useState('VENCIMIENTO');
  const [mermaDescripcion, setMermaDescripcion] = useState('');
  const [mermaSaving, setMermaSaving] = useState(false);
  const [searchStockBajo, setSearchStockBajo] = useState('');
  const [ajusteSearch, setAjusteSearch] = useState('');

  const stockBajoFiltrado = useMemo(() => {
    if (!searchStockBajo.trim()) return stockBajo;
    const q = searchStockBajo.trim().toLowerCase();
    return stockBajo.filter(
      (p) => p.nombre?.toLowerCase().includes(q) || p.codigoBarras?.toLowerCase().includes(q)
    );
  }, [stockBajo, searchStockBajo]);

  const loadAlertas = async () => {
    setLoading(true);
    const [stockRes, proximosRes] = await Promise.all([fetchStockBajo(), fetchProximosVencer(alertasConfig.diasVencimiento)]);
    if (stockRes.success && stockRes.data) {
      setStockBajo([...stockRes.data].sort((a, b) => {
        // Más recientemente actualizados (cayeron en stock bajo) primero
        const fa = a.fechaActualizacion ? new Date(a.fechaActualizacion).getTime() : 0;
        const fb = b.fechaActualizacion ? new Date(b.fechaActualizacion).getTime() : 0;
        return fb - fa;
      }));
    }
    if (proximosRes.success && proximosRes.data) {
      setProximosVencer([...proximosRes.data].sort((a, b) => {
        const dA = diasParaVencer(a.fechaVencimiento) ?? 999;
        const dB = diasParaVencer(b.fechaVencimiento) ?? 999;
        return dA - dB;
      }));
    }
    setLoading(false);
  };

  const loadMovimientos = useCallback(async (page = 0) => {
    setLoadingMov(true);
    const res = await fetchMovimientosInventario({
      tipoMovimiento: movFilterTipo || undefined,
      fechaDesde: movFilterDesde || undefined,
      fechaHasta: movFilterHasta || undefined,
      page,
      size: MOV_PAGE_SIZE,
    });
    setLoadingMov(false);
    if (res.success && res.data) {
      setMovimientos(res.data.content);
      setTotalMovimientos(res.data.totalElements);
    }
  }, [movFilterTipo, movFilterDesde, movFilterHasta]);

  useEffect(() => {
    loadAlertas();
  }, []);

  const loadMermas = useCallback(async (page = 0) => {
    setLoadingMermas(true);
    const res = await fetchMermas({ page, size: 15 });
    setLoadingMermas(false);
    if (res.success && res.data) {
      setMermas(res.data.content);
      setTotalMermas(res.data.totalElements);
    }
  }, []);

  useEffect(() => {
    if (tab === 'movimientos') {
      setMovPage(0);
      loadMovimientos(0);
    }
    if (tab === 'mermas') {
      setMermaPage(0);
      loadMermas(0);
    }
  }, [tab, loadMovimientos, loadMermas]);

  const handleMovPage = (newPage: number) => {
    setMovPage(newPage);
    loadMovimientos(newPage);
  };

  const ensureProductos = async () => {
    if (productos.length === 0) {
      const res = await fetchProductos({ size: 200 });
      if (res.success && res.data?.content) setProductos(res.data.content);
    }
  };

  const openAjuste = async (p?: ProductoDTO) => {
    await ensureProductos();
    setAjusteProducto(p ?? null);
    setAjusteStockFisico(p ? String(p.stockActual) : '');
    setAjusteSearch('');
    setError(null);
    setModalAjuste(true);
  };

  const handleAjuste = async () => {
    const stock = parseInt(ajusteStockFisico, 10);
    if (!ajusteProducto || isNaN(stock) || stock < 0) {
      setError('Seleccione un producto y un stock físico válido');
      return;
    }
    setAjusteSaving(true);
    setError(null);
    const res = await ajustarInventario(ajusteProducto.id, stock);
    setAjusteSaving(false);
    if (res.success) {
      setModalAjuste(false);
      loadAlertas();
      if (tab === 'movimientos') loadMovimientos(movPage);
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
    if (first) setCompraItems((prev) => [...prev, { productoId: first.id, cantidad: 1, precioUnitario: first.precioCompra ?? first.precioVenta }]);
  };

  const updateCompraItem = (idx: number, field: keyof CrearCompraItem, value: number) => {
    setCompraItems((prev) => { const copy = [...prev]; copy[idx] = { ...copy[idx], [field]: value }; return copy; });
  };

  const removeCompraItem = (idx: number) => setCompraItems((prev) => prev.filter((_, i) => i !== idx));

  const handleCompra = async () => {
    if (!compraProveedor || compraItems.length === 0) {
      setError('Seleccione un proveedor y agregue al menos un item');
      return;
    }
    for (const it of compraItems) {
      if (it.cantidad < 1 || it.precioUnitario <= 0) { setError('Cantidad y precio deben ser válidos'); return; }
    }
    setCompraSaving(true);
    setError(null);
    const res = await crearCompra({ proveedorId: Number(compraProveedor), items: compraItems });
    setCompraSaving(false);
    if (res.success) {
      setModalCompra(false);
      loadAlertas();
      if (tab === 'movimientos') loadMovimientos(movPage);
    } else {
      setError(res.error?.message ?? 'Error al registrar compra');
    }
  };

  const openMovManual = async () => {
    await ensureProductos();
    setMovManualProductoId('');
    setMovManualTipo('ENTRADA');
    setMovManualCantidad('');
    setMovManualMotivo('');
    setError(null);
    setModalMovManual(true);
  };

  const handleMovManual = async () => {
    const prodId = movManualProductoId;
    const cant = parseInt(movManualCantidad, 10);
    if (!prodId || isNaN(cant) || cant < 1) { setError('Complete producto y cantidad válida'); return; }
    setMovManualSaving(true);
    setError(null);
    const res = await crearMovimientoManual(Number(prodId), movManualTipo, cant, movManualMotivo || undefined);
    setMovManualSaving(false);
    if (res.success) {
      setModalMovManual(false);
      loadAlertas();
      if (tab === 'movimientos') loadMovimientos(movPage);
    } else {
      setError(res.error?.message ?? 'Error al registrar movimiento');
    }
  };

  const handleRegistrarMerma = async () => {
    const cant = parseInt(mermaCantidad, 10);
    if (!mermaProductoId || isNaN(cant) || cant < 1) { setError('Complete producto y cantidad válida'); return; }
    setMermaSaving(true);
    setError(null);
    const res = await registrarMerma({
      productoId: Number(mermaProductoId),
      cantidad: cant,
      motivo: mermaMotivo,
      descripcion: mermaDescripcion || undefined,
    });
    setMermaSaving(false);
    if (res.success) {
      setShowModalMerma(false);
      setMermaCantidad('');
      setMermaDescripcion('');
      setMermaProductoId('');
      loadMermas(mermaPage);
      loadAlertas();
    } else {
      setError(res.error?.message ?? 'Error al registrar merma');
    }
  };

  const compraTotal = compraItems.reduce((s, it) => s + it.cantidad * it.precioUnitario, 0);
  const totalPags = Math.ceil(totalMovimientos / MOV_PAGE_SIZE);

  const handleDescargarReporte = async () => {
    try {
      await descargarReporteInventarioPDF();
    } catch {
      setError('Error al descargar el reporte');
    }
  };

  const movsFiltradosPorSearch = useMemo(() => {
    if (!movFilterSearch.trim()) return movimientos;
    const q = movFilterSearch.trim().toLowerCase();
    return movimientos.filter((m) => m.producto?.nombre?.toLowerCase().includes(q));
  }, [movimientos, movFilterSearch]);

  const allAjusteProductos = useMemo(
    () => [...stockBajo, ...productos.filter((x) => !stockBajo.some((s) => s.id === x.id))],
    [stockBajo, productos]
  );

  const filteredAjusteProductos = useMemo(() => {
    if (!ajusteSearch.trim()) return allAjusteProductos;
    const q = ajusteSearch.trim().toLowerCase();
    return allAjusteProductos.filter((p) => p.nombre?.toLowerCase().includes(q));
  }, [allAjusteProductos, ajusteSearch]);

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleDescargarReporte}>
              <BarChart2 size={15} className="mr-1.5" /> Reporte PDF
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => openMovManual()}>
              <SlidersHorizontal size={15} className="mr-1.5" /> Mov. Manual
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => openAjuste()}>
              <RefreshCw size={15} className="mr-1.5" /> Ajustar Stock
            </Button>
          )}
          {isAdmin && (
            <Button size="sm" onClick={openCompra}>
              <ShoppingCart size={15} className="mr-1.5" /> Registrar Compra
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg"><TrendingDown size={18} className="text-red-600" /></div>
          <div>
            <p className="text-xs text-text-secondary">Stock Bajo</p>
            <p className="text-xl font-bold text-red-600">{stockBajo.length}</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg"><Clock size={18} className="text-orange-600" /></div>
          <div>
            <p className="text-xs text-text-secondary">Por Vencer</p>
            <p className="text-xl font-bold text-orange-600">{proximosVencer.length}</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg"><ArrowDownCircle size={18} className="text-blue-600" /></div>
          <div>
            <p className="text-xs text-text-secondary">Alertas activas</p>
            <p className="text-xl font-bold text-blue-600">{stockBajo.length + proximosVencer.length}</p>
          </div>
        </div>
        <div className={`bg-surface border rounded-lg p-3 flex items-center gap-3 ${
          stockBajo.length === 0 && proximosVencer.length === 0 ? 'border-green-200' : 'border-orange-200'
        }`}>
          <div className={`p-2 rounded-lg ${stockBajo.length === 0 && proximosVencer.length === 0 ? 'bg-green-100' : 'bg-orange-100'}`}>
            <AlertTriangle size={18} className={stockBajo.length === 0 && proximosVencer.length === 0 ? 'text-green-600' : 'text-orange-600'} />
          </div>
          <div>
            <p className="text-xs text-text-secondary">Estado</p>
            <p className={`text-sm font-bold ${stockBajo.length === 0 && proximosVencer.length === 0 ? 'text-green-700' : 'text-orange-700'}`}>
              {stockBajo.length === 0 && proximosVencer.length === 0 ? 'OK' : 'Requiere atención'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['alertas', 'movimientos', ...(isAdmin ? ['mermas'] : [])] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            {t === 'alertas' ? 'Alertas' : t === 'movimientos' ? 'Movimientos' : 'Mermas'}
            {t === 'alertas' && (stockBajo.length + proximosVencer.length) > 0 && (
              <span className="ml-1.5 bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">
                {stockBajo.length + proximosVencer.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Alertas ── */}
      {tab === 'alertas' && (
        loading ? (
          <p className="text-text-secondary text-sm">Cargando alertas...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stock Bajo */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown size={16} className="text-red-500" /> Stock Bajo / Sin Stock
                    <span className="text-xs font-normal bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full">
                      {stockBajoFiltrado.length}
                    </span>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchStockBajo}
                      onChange={(e) => setSearchStockBajo(e.target.value)}
                      className="pl-7 pr-3 py-1 border border-border rounded text-xs w-36"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {stockBajoFiltrado.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-background">
                          <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Producto</th>
                          <th className="text-center py-2 px-2 text-xs font-medium text-text-secondary">Stock</th>
                          <th className="py-2 px-3 text-xs font-medium text-text-secondary">Nivel</th>
                          <th className="py-2 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockBajoFiltrado.map((p) => {
                          const sinStock = p.stockActual <= 0;
                          const faltante = Math.max(0, (p.stockMinimo ?? 0) - p.stockActual);
                          return (
                            <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-background/50 ${sinStock ? 'bg-red-50/40' : ''}`}>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="font-medium text-sm">{p.nombre}</p>
                                  {sinStock && (
                                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Sin Stock</span>
                                  )}
                                </div>
                                {!sinStock && faltante > 0 && (
                                  <p className="text-xs text-orange-500">Faltan {faltante} uds.</p>
                                )}
                              </td>
                              <td className="py-2 px-2 text-center">
                                {sinStock ? (
                                  <span className="font-bold text-sm text-red-600">0</span>
                                ) : (
                                  <>
                                    <span className="font-bold text-sm text-orange-600">{p.stockActual}</span>
                                    <span className="text-xs text-text-secondary">/{p.stockMinimo ?? 0}</span>
                                  </>
                                )}
                              </td>
                              <td className="py-2 px-3 min-w-[80px]">
                                <StockBar actual={p.stockActual} minimo={p.stockMinimo} maximo={p.stockMaximo} />
                              </td>
                              {isAdmin && (
                                <td className="py-2 px-2">
                                  <button
                                    onClick={() => openAjuste(p)}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                                    title="Ajustar stock"
                                  >
                                    Ajustar
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">
                    {stockBajo.length > 0 ? 'Sin resultados para la búsqueda' : '✓ Todos los productos tienen stock adecuado'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Próximos a vencer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" /> Próximos a Vencer
                  <span className="text-xs font-normal bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full">
                    {proximosVencer.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {proximosVencer.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Producto</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Vence</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-text-secondary">Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proximosVencer.map((p) => {
                        const dias = diasParaVencer(p.fechaVencimiento);
                        const urgent = (dias ?? 99) <= alertasConfig.diasUrgente;
                        return (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background/50">
                            <td className="py-2 px-3">
                              <p className="font-medium text-sm">{p.nombre}</p>
                              <p className="text-xs text-text-secondary">Stock: {p.stockActual}</p>
                            </td>
                            <td className="py-2 px-3 text-sm">
                              {p.fechaVencimiento ? new Date(p.fechaVencimiento).toLocaleDateString('es-PE') : '-'}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${urgent ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                {dias ?? '-'}d
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">
                    ✓ No hay productos próximos a vencer
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )
      )}

      {/* ── Tab Movimientos ── */}
      {tab === 'movimientos' && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 items-end justify-between">
              <CardTitle className="text-base">Historial de Movimientos</CardTitle>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Filtro tipo */}
                <select
                  value={movFilterTipo}
                  onChange={(e) => setMovFilterTipo(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded text-xs"
                >
                  <option value="">Todos los tipos</option>
                  <option value="ENTRADA">Entradas</option>
                  <option value="SALIDA">Salidas</option>
                  <option value="AJUSTE">Ajustes</option>
                </select>
                {/* Fecha desde */}
                <input
                  type="date"
                  value={movFilterDesde}
                  onChange={(e) => setMovFilterDesde(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded text-xs"
                />
                {/* Fecha hasta */}
                <input
                  type="date"
                  value={movFilterHasta}
                  onChange={(e) => setMovFilterHasta(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded text-xs"
                />
                {/* Buscar producto */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" size={13} />
                  <input
                    type="text"
                    placeholder="Producto..."
                    value={movFilterSearch}
                    onChange={(e) => setMovFilterSearch(e.target.value)}
                    className="pl-6 pr-7 py-1.5 border border-border rounded text-xs w-32"
                  />
                  {movFilterSearch && (
                    <button onClick={() => setMovFilterSearch('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-text-secondary">
                      <X size={11} />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setMovPage(0); loadMovimientos(0); }}
                  className="text-xs"
                >
                  Buscar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMov ? (
              <p className="text-text-secondary text-sm py-6 text-center">Cargando movimientos...</p>
            ) : movsFiltradosPorSearch.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Fecha</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Producto</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Tipo</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-text-secondary">Cant.</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Motivo</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-text-secondary">Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movsFiltradosPorSearch.map((m) => (
                        <tr key={m.id} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-2 px-3 text-xs text-text-secondary whitespace-nowrap">{formatDate(m.fecha)}</td>
                          <td className="py-2 px-3">
                            <span className="font-medium">{m.producto?.nombre ?? '-'}</span>
                          </td>
                          <td className="py-2 px-3">
                            <TipoMovBadge tipo={m.tipoMovimiento} />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`font-bold ${m.tipoMovimiento === 'SALIDA' ? 'text-red-600' : 'text-green-600'}`}>
                              {m.tipoMovimiento === 'SALIDA' ? '-' : '+'}{m.cantidad}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-xs text-text-secondary max-w-[120px] truncate">
                            {m.motivo ?? '-'}
                          </td>
                          <td className="py-2 px-3 text-xs text-text-secondary">
                            {m.usuario?.nombre ?? m.usuario?.username ?? '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Paginación */}
                {totalPags > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
                    <p className="text-xs text-text-secondary">
                      Página {movPage + 1} de {totalPags} · {totalMovimientos} movimientos
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMovPage(movPage - 1)}
                        disabled={movPage === 0}
                        className="px-2"
                      >
                        <ChevronLeft size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMovPage(movPage + 1)}
                        disabled={movPage >= totalPags - 1}
                        className="px-2"
                      >
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-text-secondary text-sm py-6 text-center">No hay movimientos con los filtros seleccionados</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Tab Mermas ── */}
      {tab === 'mermas' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gestión de Mermas</CardTitle>
              <Button size="sm" onClick={async () => { await ensureProductos(); setShowModalMerma(true); setError(null); }}>
                <Plus size={14} className="mr-1" /> Registrar Merma
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMermas ? (
              <p className="text-text-secondary text-sm py-6 text-center">Cargando...</p>
            ) : mermas.length === 0 ? (
              <p className="text-text-secondary text-sm py-6 text-center">No hay mermas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Fecha</th>
                      <th className="px-4 py-3 text-left font-medium">Producto</th>
                      <th className="px-4 py-3 text-center font-medium">Cantidad</th>
                      <th className="px-4 py-3 text-left font-medium">Motivo</th>
                      <th className="px-4 py-3 text-right font-medium">Valor pérdida</th>
                      <th className="px-4 py-3 text-left font-medium">Registrado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mermas.map((m) => (
                      <tr key={m.id} className="border-b border-border hover:bg-surface/50">
                        <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                          {new Date(m.fecha).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 font-medium">{m.productoNombre}</td>
                        <td className="px-4 py-3 text-center">{m.cantidad}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            {m.motivo.replace('_', ' ')}
                          </span>
                          {m.descripcion && <p className="text-xs text-text-secondary mt-0.5">{m.descripcion}</p>}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">
                          S/ {m.valorPerdida.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-text-secondary text-xs">{m.usuario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Paginación mermas */}
            {Math.ceil(totalMermas / 15) > 1 && (
              <div className="flex justify-center gap-2 p-4">
                {Array.from({ length: Math.ceil(totalMermas / 15) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setMermaPage(i); loadMermas(i); }}
                    className={`px-3 py-1 rounded text-sm ${i === mermaPage ? 'bg-primary text-white' : 'border border-border hover:bg-surface'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Modal Merma ── */}
      {showModalMerma && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Registrar Merma</h3>
              <button onClick={() => setShowModalMerma(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Producto *</label>
                <select
                  value={mermaProductoId}
                  onChange={(e) => setMermaProductoId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stockActual})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Motivo *</label>
                <select
                  value={mermaMotivo}
                  onChange={(e) => setMermaMotivo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="VENCIMIENTO">Vencimiento</option>
                  <option value="ROTURA">Rotura</option>
                  <option value="DETERIORO">Deterioro</option>
                  <option value="ROBO">Robo</option>
                  <option value="DIFERENCIA_INVENTARIO">Diferencia de inventario</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <Input
                label="Cantidad *"
                type="number"
                min="1"
                value={mermaCantidad}
                onChange={(e) => setMermaCantidad(e.target.value)}
                placeholder="Unidades dadas de baja"
              />
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  value={mermaDescripcion}
                  onChange={(e) => setMermaDescripcion(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded text-sm h-16 resize-none"
                  placeholder="Detalles adicionales..."
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModalMerma(false)} disabled={mermaSaving}>Cancelar</Button>
              <Button onClick={handleRegistrarMerma} disabled={mermaSaving}>
                {mermaSaving ? 'Registrando...' : 'Registrar Merma'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Ajuste ── */}
      {modalAjuste && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Ajuste de Inventario</h3>
              <button onClick={() => setModalAjuste(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Producto</label>
                <div className="relative mb-1.5">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                  <input
                    type="text"
                    value={ajusteSearch}
                    onChange={(e) => setAjusteSearch(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full pl-8 pr-3 py-1.5 border border-border rounded text-sm"
                  />
                </div>
                <select
                  value={ajusteProducto?.id ?? ''}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const p = id ? allAjusteProductos.find((x) => x.id === id) ?? null : null;
                    setAjusteProducto(p);
                    setAjusteStockFisico(p ? String(p.stockActual) : '');
                  }}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                  size={filteredAjusteProductos.length > 0 && filteredAjusteProductos.length <= 8 ? filteredAjusteProductos.length + 1 : undefined}
                >
                  <option value="">Seleccione producto</option>
                  {filteredAjusteProductos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stockActual})</option>
                  ))}
                </select>
                {ajusteSearch && filteredAjusteProductos.length === 0 && (
                  <p className="text-xs text-text-secondary mt-1">Sin resultados para "{ajusteSearch}"</p>
                )}
              </div>
              <Input
                label="Stock físico contado"
                type="number"
                min="0"
                value={ajusteStockFisico}
                onChange={(e) => setAjusteStockFisico(e.target.value)}
                placeholder="Cantidad real en almacén"
              />
              {ajusteProducto && (
                <div className="bg-background rounded p-2 text-sm space-y-1">
                  <p className="text-text-secondary">Stock en sistema: <strong>{ajusteProducto.stockActual}</strong></p>
                  {ajusteStockFisico && !isNaN(parseInt(ajusteStockFisico)) && (
                    <p className={`font-medium ${parseInt(ajusteStockFisico) - ajusteProducto.stockActual >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      Diferencia: {parseInt(ajusteStockFisico) - ajusteProducto.stockActual > 0 ? '+' : ''}
                      {parseInt(ajusteStockFisico) - ajusteProducto.stockActual}
                    </p>
                  )}
                </div>
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalAjuste(false)} disabled={ajusteSaving}>Cancelar</Button>
              <Button onClick={handleAjuste} disabled={ajusteSaving || !ajusteProducto}>
                {ajusteSaving ? 'Guardando...' : 'Aplicar Ajuste'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Compra ── */}
      {modalCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full my-8">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Registrar Compra</h3>
              <button onClick={() => setModalCompra(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Proveedor *</label>
                <select
                  value={compraProveedor}
                  onChange={(e) => setCompraProveedor(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="">Seleccione proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.razonSocial} {p.ruc ? `(${p.ruc})` : ''}</option>
                  ))}
                </select>
                {proveedores.length === 0 && (
                  <p className="text-xs text-text-secondary mt-1">No hay proveedores registrados. Créelos en Configuración.</p>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Productos *</label>
                  <Button variant="outline" size="sm" onClick={addCompraItem}>
                    <Plus size={13} className="mr-1" /> Añadir producto
                  </Button>
                </div>
                {compraItems.length === 0 ? (
                  <p className="text-sm text-text-secondary py-2">Agregue productos a la compra</p>
                ) : (
                  <div className="space-y-2">
                    {compraItems.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_80px_90px_auto] gap-1.5 items-center border border-border rounded p-2">
                        <select
                          value={it.productoId}
                          onChange={(e) => updateCompraItem(idx, 'productoId', Number(e.target.value))}
                          className="px-2 py-1 border border-border rounded text-xs"
                        >
                          {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                        <input
                          type="number" min="1" value={it.cantidad}
                          onChange={(e) => updateCompraItem(idx, 'cantidad', parseInt(e.target.value, 10) || 1)}
                          className="px-2 py-1 border border-border rounded text-xs text-center"
                          placeholder="Cant."
                        />
                        <input
                          type="number" min="0" step="0.01" value={it.precioUnitario}
                          onChange={(e) => updateCompraItem(idx, 'precioUnitario', parseFloat(e.target.value) || 0)}
                          className="px-2 py-1 border border-border rounded text-xs"
                          placeholder="P. unit."
                        />
                        <button onClick={() => removeCompraItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-1 border-t border-border">
                      <span className="text-xs text-text-secondary">{compraItems.length} producto(s)</span>
                      <span className="font-bold text-sm">Total: S/ {compraTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalCompra(false)} disabled={compraSaving}>Cancelar</Button>
              <Button onClick={handleCompra} disabled={compraSaving || compraItems.length === 0}>
                {compraSaving ? 'Registrando...' : 'Registrar Compra'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Movimiento Manual ── */}
      {modalMovManual && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Movimiento Manual</h3>
              <button onClick={() => setModalMovManual(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Producto *</label>
                <select
                  value={movManualProductoId}
                  onChange={(e) => setMovManualProductoId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stockActual})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de movimiento *</label>
                <div className="flex gap-2">
                  {(['ENTRADA', 'SALIDA', 'AJUSTE'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setMovManualTipo(t)}
                      className={`flex-1 py-2 rounded text-sm font-medium border transition-colors ${
                        movManualTipo === t
                          ? t === 'ENTRADA' ? 'bg-green-100 border-green-400 text-green-800'
                            : t === 'SALIDA' ? 'bg-red-100 border-red-400 text-red-800'
                            : 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'border-border hover:bg-background'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Cantidad *"
                type="number"
                min="1"
                value={movManualCantidad}
                onChange={(e) => setMovManualCantidad(e.target.value)}
                placeholder="Cantidad de unidades"
              />
              <Input
                label="Motivo"
                value={movManualMotivo}
                onChange={(e) => setMovManualMotivo(e.target.value)}
                placeholder="Ej. Merma, rotura, corrección..."
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalMovManual(false)} disabled={movManualSaving}>Cancelar</Button>
              <Button onClick={handleMovManual} disabled={movManualSaving}>
                {movManualSaving ? 'Registrando...' : 'Registrar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

