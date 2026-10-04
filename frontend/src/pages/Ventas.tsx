import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  fetchVentas,
  fetchVentaPorId,
  anularVenta,
  fetchComprobantePorVenta,
  emitirBoleta,
  emitirFactura,
  descargarPdfComprobante,
  enviarComprobanteSunat,
  descargarReporteVentasPDF,
  type VentaDTO,
  type ComprobanteDTO,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText, Send, Download, Receipt, ListChecks, X,
  TrendingUp, ShoppingBag, CreditCard, ChevronLeft, ChevronRight,
  Calendar, Filter,
} from 'lucide-react';

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return s; }
};

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

const ESTADO_SUNAT_CLASS: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  ACEPTADO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
  ERROR: 'bg-red-100 text-red-800',
};

type Preset = 'hoy' | '7d' | '30d' | '90d' | 'custom';

const FORMAS_PAGO_OPTS = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN', 'MIXTO', 'TRANSFERENCIA'];

const PAGE_SIZE = 20;

function getLocalTzOffset(): string {
  const offset = new Date().getTimezoneOffset(); // minutos, positivo = detrás de UTC
  const sign = offset > 0 ? '-' : '+';
  const abs = Math.abs(offset);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `${sign}${h}:${m}`;
}

function buildDateRange(preset: Preset, customDesde: string, customHasta: string): { desde: string; hasta: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hoyStr = fmt(now);
  const tz = getLocalTzOffset();

  if (preset === 'custom') {
    return {
      desde: customDesde ? customDesde + 'T00:00:00' + tz : hoyStr + 'T00:00:00' + tz,
      hasta: customHasta ? customHasta + 'T23:59:59' + tz : hoyStr + 'T23:59:59' + tz,
    };
  }
  const back = new Date(now);
  if (preset === '7d') back.setDate(back.getDate() - 7);
  else if (preset === '30d') back.setDate(back.getDate() - 30);
  else if (preset === '90d') back.setDate(back.getDate() - 90);
  return {
    desde: fmt(back) + 'T00:00:00' + tz,
    hasta: hoyStr + 'T23:59:59' + tz,
  };
}

export const Ventas = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [page, setPage] = useState(0);
  const [comprobantes, setComprobantes] = useState<Record<number, ComprobanteDTO | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anulando, setAnulando] = useState<number | null>(null);
  const [enviandoSunat, setEnviandoSunat] = useState<number | null>(null);

  // Filtros
  const [preset, setPreset] = useState<Preset>('30d');
  const [customDesde, setCustomDesde] = useState('');
  const [customHasta, setCustomHasta] = useState('');
  const [filterFormaPago, setFilterFormaPago] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  // Modales
  const [modalBoleta, setModalBoleta] = useState<VentaDTO | null>(null);
  const [modalFactura, setModalFactura] = useState<VentaDTO | null>(null);
  const [formBoleta, setFormBoleta] = useState({ tipoDocumento: '1', numeroDocumento: '', nombre: '' });
  const [formFactura, setFormFactura] = useState({ numeroDocumento: '', razonSocial: '' });
  const [guardandoComprobante, setGuardandoComprobante] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [detalleVenta, setDetalleVenta] = useState<VentaDTO | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const dateRange = useMemo(
    () => buildDateRange(preset, customDesde, customHasta),
    [preset, customDesde, customHasta]
  );

  const loadComprobantes = useCallback(async (listaVentas: VentaDTO[]) => {
    const completadas = listaVentas.filter((v) => v.estado === 'COMPLETADA');
    const results = await Promise.allSettled(
      completadas.map(async (v) => {
        const res = await fetchComprobantePorVenta(v.id);
        return { ventaId: v.id, comp: res.success && res.data ? res.data : null };
      })
    );
    const map: Record<number, ComprobanteDTO | null> = {};
    results.forEach((r) => {
      if (r.status === 'fulfilled') map[r.value.ventaId] = r.value.comp;
    });
    setComprobantes((prev) => ({ ...prev, ...map }));
  }, []);

  const loadVentas = useCallback(async (pg = 0) => {
    setLoading(true);
    setError(null);
    const res = await fetchVentas({ fechaDesde: dateRange.desde, fechaHasta: dateRange.hasta, page: pg, size: PAGE_SIZE });
    if (res.success && res.data) {
      const list = (res.data.content ?? []).sort((a, b) =>
        new Date(b.fecha ?? 0).getTime() - new Date(a.fecha ?? 0).getTime()
      );
      setVentas(list);
      setTotalVentas(res.data.totalElements);
      await loadComprobantes(list);
    } else if (!res.success) {
      setError(res.error?.message ?? 'Error al cargar ventas');
    }
    setLoading(false);
  }, [dateRange, loadComprobantes]);

  useEffect(() => {
    setPage(0);
    loadVentas(0);
  }, [loadVentas]);

  const handlePage = (newPage: number) => {
    setPage(newPage);
    loadVentas(newPage);
  };

  // Filtrado local por forma de pago y estado
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      if (filterFormaPago && v.formaPago !== filterFormaPago) return false;
      if (filterEstado && v.estado !== filterEstado) return false;
      return true;
    });
  }, [ventas, filterFormaPago, filterEstado]);

  // Stats basados en página actual filtrada
  const stats = useMemo(() => {
    const completadas = ventasFiltradas.filter((v) => v.estado === 'COMPLETADA');
    const totalMonto = completadas.reduce((s, v) => s + (v.total ?? 0), 0);
    const ticketProm = completadas.length > 0 ? totalMonto / completadas.length : 0;
    return { totalMonto, count: completadas.length, ticketProm };
  }, [ventasFiltradas]);

  const handleAnular = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm('¿Anular esta venta? Se restaurará el stock.')) return;
    setAnulando(id);
    const res = await anularVenta(id);
    setAnulando(null);
    if (res.success) loadVentas(page);
    else alert(res.error?.message ?? 'Error al anular');
  };

  const openBoleta = (v: VentaDTO) => {
    setFormBoleta({ tipoDocumento: '1', numeroDocumento: v.cliente?.numeroDocumento ?? '', nombre: v.cliente?.nombre ?? '' });
    setErrorModal(null);
    setModalBoleta(v);
  };

  const openFactura = (v: VentaDTO) => {
    setFormFactura({ numeroDocumento: v.cliente?.numeroDocumento ?? '', razonSocial: v.cliente?.nombre ?? '' });
    setErrorModal(null);
    setModalFactura(v);
  };

  const handleEmitirBoleta = async () => {
    if (!modalBoleta) return;
    if (!formBoleta.numeroDocumento.trim() || !formBoleta.nombre.trim()) {
      setErrorModal('Complete documento y nombre del cliente.');
      return;
    }
    setGuardandoComprobante(true);
    setErrorModal(null);
    const res = await emitirBoleta({
      ventaId: modalBoleta.id,
      tipoDocumento: formBoleta.tipoDocumento,
      numeroDocumento: formBoleta.numeroDocumento.trim(),
      nombre: formBoleta.nombre.trim(),
    });
    setGuardandoComprobante(false);
    if (res.success && res.data) {
      setComprobantes((prev) => ({
        ...prev,
        [modalBoleta.id]: {
          id: res.data!.id, ventaId: modalBoleta.id, tipoComprobante: 'BOLETA',
          serie: res.data!.serie, numero: res.data!.numero,
          estadoSunat: res.data!.estadoSunat, fechaEmision: new Date().toISOString(),
        },
      }));
      setModalBoleta(null);
    } else {
      setErrorModal(res.error?.message ?? 'Error al emitir boleta');
    }
  };

  const handleEmitirFactura = async () => {
    if (!modalFactura) return;
    if (!formFactura.numeroDocumento.trim() || !formFactura.razonSocial.trim()) {
      setErrorModal('Complete RUC y razón social.');
      return;
    }
    setGuardandoComprobante(true);
    setErrorModal(null);
    const res = await emitirFactura({
      ventaId: modalFactura.id,
      numeroDocumento: formFactura.numeroDocumento.trim(),
      razonSocial: formFactura.razonSocial.trim(),
    });
    setGuardandoComprobante(false);
    if (res.success && res.data) {
      setComprobantes((prev) => ({
        ...prev,
        [modalFactura.id]: {
          id: res.data!.id, ventaId: modalFactura.id, tipoComprobante: 'FACTURA',
          serie: res.data!.serie, numero: res.data!.numero,
          estadoSunat: res.data!.estadoSunat, fechaEmision: new Date().toISOString(),
        },
      }));
      setModalFactura(null);
    } else {
      setErrorModal(res.error?.message ?? 'Error al emitir factura');
    }
  };

  const openDetalle = async (v: VentaDTO) => {
    setDetalleVenta(null);
    setLoadingDetalle(true);
    const res = await fetchVentaPorId(v.id);
    setLoadingDetalle(false);
    if (res.success && res.data) setDetalleVenta(res.data);
    else alert(res.error?.message ?? 'Error al cargar detalle');
  };

  const handleEnviarSunat = async (comp: ComprobanteDTO) => {
    setEnviandoSunat(comp.id);
    const res = await enviarComprobanteSunat(comp.id);
    setEnviandoSunat(null);
    if (res.success) await loadVentas(page);
    else alert(res.error?.message ?? 'Error al enviar a SUNAT');
  };

  const handleDescargarPDF = async () => {
    try {
      await descargarReporteVentasPDF(
        dateRange.desde.slice(0, 10),
        dateRange.hasta.slice(0, 10)
      );
    } catch {
      alert('Error al descargar reporte');
    }
  };

  const totalPags = Math.ceil(totalVentas / PAGE_SIZE);

  const PRESET_LABELS: Record<Preset, string> = { hoy: 'Hoy', '7d': '7 días', '30d': '30 días', '90d': '90 días', custom: 'Personalizado' };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Ventas y Comprobantes</h2>
        <Button variant="outline" size="sm" onClick={handleDescargarPDF}>
          <Download size={14} className="mr-1.5" /> Exportar PDF
        </Button>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Calendar size={16} className="text-text-secondary" />
            {(['hoy', '7d', '30d', '90d', 'custom'] as Preset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  preset === p ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:bg-background text-text-secondary'
                }`}
              >
                {PRESET_LABELS[p]}
              </button>
            ))}
            {preset === 'custom' && (
              <div className="flex gap-2 items-center ml-2">
                <input
                  type="date"
                  value={customDesde}
                  onChange={(e) => setCustomDesde(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded text-sm"
                />
                <span className="text-text-secondary text-sm">→</span>
                <input
                  type="date"
                  value={customHasta}
                  onChange={(e) => setCustomHasta(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded text-sm"
                />
              </div>
            )}

            <div className="ml-auto flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-text-secondary" />
              <select
                value={filterFormaPago}
                onChange={(e) => setFilterFormaPago(e.target.value)}
                className="px-2 py-1.5 border border-border rounded text-xs"
              >
                <option value="">Todas las formas de pago</option>
                {FORMAS_PAGO_OPTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-2 py-1.5 border border-border rounded text-xs"
              >
                <option value="">Todos los estados</option>
                <option value="COMPLETADA">Completadas</option>
                <option value="ANULADA">Anuladas</option>
              </select>
              {(filterFormaPago || filterEstado) && (
                <button
                  onClick={() => { setFilterFormaPago(''); setFilterEstado(''); }}
                  className="text-xs text-text-secondary hover:text-text-main flex items-center gap-0.5"
                >
                  <X size={12} /> Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><TrendingUp size={18} className="text-green-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Total periodo</p>
              <p className="text-lg font-bold text-green-700">{formatSoles(stats.totalMonto)}</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><ShoppingBag size={18} className="text-blue-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Transacciones</p>
              <p className="text-lg font-bold text-blue-700">{stats.count}</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><CreditCard size={18} className="text-purple-600" /></div>
            <div>
              <p className="text-xs text-text-secondary">Ticket promedio</p>
              <p className="text-lg font-bold text-purple-700">{formatSoles(stats.ticketProm)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de ventas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">
              Ventas
              {ventasFiltradas.length > 0 && (
                <span className="ml-2 text-xs font-normal text-text-secondary">
                  {ventasFiltradas.length} resultado(s)
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && <p className="text-red-600 text-sm p-4">{error}</p>}
          {loading ? (
            <p className="text-text-secondary text-sm py-8 text-center">Cargando...</p>
          ) : ventasFiltradas.length === 0 ? (
            <p className="text-text-secondary text-sm py-8 text-center">No hay ventas para el período seleccionado</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">N° Venta</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Fecha</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Vendedor</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Cliente</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary text-right">Total</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Pago</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Estado</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Detalle</th>
                      <th className="py-2.5 px-3 text-xs font-medium text-text-secondary">Comprobante</th>
                      {isAdmin && <th className="py-2.5 px-3 text-xs font-medium text-text-secondary"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {ventasFiltradas.map((v) => {
                      const comp = comprobantes[v.id] ?? null;
                      return (
                        <tr key={v.id} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-2.5 px-3 font-medium text-blue-700">{v.numeroVenta}</td>
                          <td className="py-2.5 px-3 text-xs text-text-secondary whitespace-nowrap">{formatDate(v.fecha)}</td>
                          <td className="py-2.5 px-3 text-sm">
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[110px]">{v.usuario?.nombre ?? '-'}</span>
                              {v.usuario?.rol && (
                                <span className={`text-xs px-1.5 py-0.5 rounded w-fit mt-0.5 ${
                                  v.usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>{v.usuario.rol}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-sm max-w-[120px] truncate">
                            {v.cliente?.nombre ?? <span className="text-text-secondary italic">Público</span>}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-right">{formatSoles(v.total)}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs bg-background border border-border px-2 py-0.5 rounded">{v.formaPago}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                              v.estado === 'ANULADA' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {v.estado}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <Button variant="ghost" size="sm" onClick={() => openDetalle(v)} className="text-xs">
                              <ListChecks size={13} className="mr-1" /> Ver
                            </Button>
                          </td>
                          <td className="py-2.5 px-3">
                            {v.estado === 'COMPLETADA' && (
                              comp ? (
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-xs font-medium">{comp.serie}-{comp.numero}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${ESTADO_SUNAT_CLASS[comp.estadoSunat] ?? 'bg-gray-100'}`}>
                                    {comp.estadoSunat}
                                  </span>
                                  <button onClick={() => descargarPdfComprobante(comp.id)} className="text-text-secondary hover:text-primary p-0.5" title="Descargar PDF">
                                    <Download size={13} />
                                  </button>
                                  {comp.estadoSunat === 'PENDIENTE' && (
                                    <Button variant="outline" size="sm" onClick={() => handleEnviarSunat(comp)} disabled={enviandoSunat === comp.id} className="text-xs px-1.5 py-0.5">
                                      {enviandoSunat === comp.id ? '...' : <Send size={11} />}
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  <Button variant="outline" size="sm" onClick={() => openBoleta(v)} className="text-xs px-2 py-1">
                                    <Receipt size={11} className="mr-1" /> Boleta
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => openFactura(v)} className="text-xs px-2 py-1">
                                    <FileText size={11} className="mr-1" /> Factura
                                  </Button>
                                </div>
                              )
                            )}
                          </td>
                          {isAdmin && (
                            <td className="py-2.5 px-3">
                              {v.estado === 'COMPLETADA' && (
                                <Button variant="outline" size="sm" onClick={() => handleAnular(v.id)} disabled={anulando === v.id} className="text-xs text-red-600 border-red-200 hover:bg-red-50">
                                  {anulando === v.id ? '...' : 'Anular'}
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPags > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
                  <p className="text-xs text-text-secondary">
                    Página {page + 1} de {totalPags} · {totalVentas} ventas totales
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handlePage(page - 1)} disabled={page === 0} className="px-2">
                      <ChevronLeft size={14} />
                    </Button>
                    {Array.from({ length: Math.min(totalPags, 5) }, (_, i) => {
                      const p = Math.max(0, Math.min(page - 2, totalPags - 5)) + i;
                      return (
                        <Button
                          key={p}
                          variant={p === page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePage(p)}
                          className="px-2.5 min-w-[32px]"
                        >
                          {p + 1}
                        </Button>
                      );
                    })}
                    <Button variant="outline" size="sm" onClick={() => handlePage(page + 1)} disabled={page >= totalPags - 1} className="px-2">
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Emitir Boleta */}
      {modalBoleta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">Emitir Boleta</h3>
                <p className="text-xs text-text-secondary mt-0.5">Venta {modalBoleta.numeroVenta} · {formatSoles(modalBoleta.total)}</p>
              </div>
              <button onClick={() => setModalBoleta(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo documento</label>
                <select
                  value={formBoleta.tipoDocumento}
                  onChange={(e) => setFormBoleta((f) => ({ ...f, tipoDocumento: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="1">DNI</option>
                  <option value="4">Carné de extranjería</option>
                </select>
              </div>
              <Input
                label="Número de documento"
                value={formBoleta.numeroDocumento}
                onChange={(e) => setFormBoleta((f) => ({ ...f, numeroDocumento: e.target.value }))}
                placeholder="Ej. 12345678"
              />
              <Input
                label="Nombre del cliente"
                value={formBoleta.nombre}
                onChange={(e) => setFormBoleta((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre completo"
              />
              {errorModal && <p className="text-red-600 text-sm">{errorModal}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalBoleta(null)} disabled={guardandoComprobante}>Cancelar</Button>
              <Button onClick={handleEmitirBoleta} disabled={guardandoComprobante}>
                {guardandoComprobante ? 'Generando...' : 'Emitir boleta'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emitir Factura */}
      {modalFactura && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">Emitir Factura</h3>
                <p className="text-xs text-text-secondary mt-0.5">Venta {modalFactura.numeroVenta} · {formatSoles(modalFactura.total)}</p>
              </div>
              <button onClick={() => setModalFactura(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="RUC"
                value={formFactura.numeroDocumento}
                onChange={(e) => setFormFactura((f) => ({ ...f, numeroDocumento: e.target.value }))}
                placeholder="11 dígitos"
              />
              <Input
                label="Razón social"
                value={formFactura.razonSocial}
                onChange={(e) => setFormFactura((f) => ({ ...f, razonSocial: e.target.value }))}
                placeholder="Nombre o razón social"
              />
              {errorModal && <p className="text-red-600 text-sm">{errorModal}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalFactura(null)} disabled={guardandoComprobante}>Cancelar</Button>
              <Button onClick={handleEmitirFactura} disabled={guardandoComprobante}>
                {guardandoComprobante ? 'Generando...' : 'Emitir factura'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle de Venta */}
      {(detalleVenta != null || loadingDetalle) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">Detalle de Venta</h3>
                {detalleVenta && <p className="text-xs text-text-secondary mt-0.5">{detalleVenta.numeroVenta}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetalleVenta(null)} disabled={loadingDetalle}>
                <X size={16} />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingDetalle ? (
                <p className="text-text-secondary py-4 text-center">Cargando...</p>
              ) : detalleVenta ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Fecha', value: formatDate(detalleVenta.fecha) },
                      { label: 'Vendedor', value: detalleVenta.usuario ? `${detalleVenta.usuario.nombre} (${detalleVenta.usuario.rol})` : '-' },
                      { label: 'Cliente', value: detalleVenta.cliente?.nombre ?? 'Público general' },
                      { label: 'Forma de pago', value: detalleVenta.formaPago },
                      { label: 'Estado', value: detalleVenta.estado },
                    ].map((item) => (
                      <div key={item.label} className="bg-background rounded p-2">
                        <p className="text-xs text-text-secondary">{item.label}</p>
                        <p className="font-medium text-sm mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Productos vendidos</p>
                    <table className="w-full text-sm border border-border rounded overflow-hidden">
                      <thead>
                        <tr className="bg-background border-b border-border">
                          <th className="text-left p-2 text-xs text-text-secondary">Descripción</th>
                          <th className="text-right p-2 text-xs text-text-secondary">Cant.</th>
                          <th className="text-right p-2 text-xs text-text-secondary">P. Unit.</th>
                          <th className="text-right p-2 text-xs text-text-secondary">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detalleVenta.detalles ?? []).map((d, idx) => (
                          <tr key={idx} className="border-b border-border last:border-0">
                            <td className="p-2">{d.producto?.nombre ?? d.packNombre ?? '-'}</td>
                            <td className="p-2 text-right">{d.cantidad}</td>
                            <td className="p-2 text-right">{formatSoles(d.precioUnitario ?? 0)}</td>
                            <td className="p-2 text-right font-medium">{formatSoles(d.subtotal ?? 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <div className="space-y-1 text-sm min-w-[180px]">
                      <div className="flex justify-between gap-6">
                        <span className="text-text-secondary">Total</span>
                        <span className="font-bold text-lg text-blue-700">{formatSoles(detalleVenta.total)}</span>
                      </div>
                      {detalleVenta.vuelto != null && detalleVenta.vuelto > 0 && (
                        <div className="flex justify-between gap-6">
                          <span className="text-text-secondary">Vuelto</span>
                          <span className="font-semibold text-green-700">{formatSoles(detalleVenta.vuelto)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
