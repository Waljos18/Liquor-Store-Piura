import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  CreditCard, X, ChevronLeft, ChevronRight, Eye, DollarSign, Clock, CheckCircle,
} from 'lucide-react';
import {
  fetchCuentasPorCobrar,
  fetchCuentaPorCobrarPorId,
  pagarCuenta,
  type CuentaPorCobrarDTO,
} from '../api/api';

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;
const formatFecha = (s: string) => new Date(s).toLocaleDateString('es-PE');

const ESTADOS_FILTRO = ['', 'PENDIENTE', 'PAGADO', 'VENCIDO'] as const;
const FORMAS_PAGO = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN'] as const;

const estadoBadge = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'PAGADO':    return 'bg-green-100 text-green-800 border border-green-300';
    case 'VENCIDO':   return 'bg-red-100 text-red-800 border border-red-300';
    default:          return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};

const estadoIcon = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return <Clock size={13} className="inline mr-1" />;
    case 'PAGADO':    return <CheckCircle size={13} className="inline mr-1" />;
    case 'VENCIDO':   return <X size={13} className="inline mr-1" />;
    default: return null;
  }
};

export const CuentasPorCobrar = () => {
  // Lista
  const [cuentas, setCuentas] = useState<CuentaPorCobrarDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // Modal pago
  const [showPago, setShowPago] = useState(false);
  const [pagosCuenta, setPagosCuenta] = useState<CuentaPorCobrarDTO | null>(null);
  const [pagoMonto, setPagoMonto] = useState('');
  const [pagoFormaPago, setPagoFormaPago] = useState<typeof FORMAS_PAGO[number]>('EFECTIVO');
  const [pagoObservaciones, setPagoObservaciones] = useState('');
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);

  // Modal detalle
  const [showDetalle, setShowDetalle] = useState(false);
  const [detalleCuenta, setDetalleCuenta] = useState<CuentaPorCobrarDTO | null>(null);

  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const cargar = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    const res = await fetchCuentasPorCobrar({
      estado: filtroEstado || undefined,
      page: p,
      size: PAGE_SIZE,
    });
    setLoading(false);
    if (res.success && res.data) {
      setCuentas(res.data.content);
      setTotalElements(res.data.totalElements);
    } else {
      setError(res.error?.message ?? 'Error al cargar cuentas por cobrar');
    }
  }, [filtroEstado]);

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  // Filtro local por nombre de cliente
  const cuentasFiltradas = filtroBusqueda.trim().length > 0
    ? cuentas.filter(c => c.clienteNombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
    : cuentas;

  const handleEstadoChange = (estado: string) => {
    setFiltroEstado(estado);
    setPage(0);
  };

  // Modal pago
  const handleAbrirPago = async (cuenta: CuentaPorCobrarDTO) => {
    const res = await fetchCuentaPorCobrarPorId(cuenta.id);
    if (res.success && res.data) {
      setPagosCuenta(res.data);
      setPagoMonto(String(res.data.saldoPendiente.toFixed(2)));
      setPagoFormaPago('EFECTIVO');
      setPagoObservaciones('');
      setPagoError(null);
      setShowPago(true);
    }
  };

  const handleConfirmarPago = async () => {
    if (!pagosCuenta) return;
    const monto = parseFloat(pagoMonto);
    if (isNaN(monto) || monto <= 0) { setPagoError('Ingresa un monto valido'); return; }
    if (monto > pagosCuenta.saldoPendiente) { setPagoError('El monto no puede superar el saldo pendiente'); return; }
    setPagoLoading(true);
    setPagoError(null);
    const res = await pagarCuenta(pagosCuenta.id, {
      monto,
      formaPago: pagoFormaPago,
      observaciones: pagoObservaciones || undefined,
    });
    setPagoLoading(false);
    if (res.success) {
      setShowPago(false);
      cargar(page);
    } else {
      setPagoError(res.error?.message ?? 'Error al registrar el pago');
    }
  };

  // Modal detalle
  const handleVerDetalle = async (cuenta: CuentaPorCobrarDTO) => {
    const res = await fetchCuentaPorCobrarPorId(cuenta.id);
    if (res.success && res.data) {
      setDetalleCuenta(res.data);
      setShowDetalle(true);
    }
  };

  // Stats (basados en datos filtrados localmente)
  const totalDeudaPendiente = cuentasFiltradas
    .filter(c => c.estado !== 'PAGADO')
    .reduce((s, c) => s + c.saldoPendiente, 0);
  const cantidadPendientes = cuentasFiltradas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO').length;
  const cantidadPagadas = cuentasFiltradas.filter(c => c.estado === 'PAGADO').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard size={26} /> Cuentas por Cobrar (Fiado)
        </h2>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Estado</label>
              <select
                value={filtroEstado}
                onChange={e => handleEstadoChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {ESTADOS_FILTRO.map(e => (
                  <option key={e} value={e}>{e || 'Todos'}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-48">
              <label className="text-xs text-gray-500 font-medium">Buscar cliente</label>
              <div className="relative">
                <Input
                  value={filtroBusqueda}
                  onChange={e => setFiltroBusqueda(e.target.value)}
                  placeholder="Nombre del cliente..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500">Total deuda pendiente</p>
              <DollarSign size={18} className="text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatSoles(totalDeudaPendiente)}</p>
            <p className="text-xs text-gray-400">Suma de saldos sin cobrar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500">Cuentas pendientes</p>
              <Clock size={18} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{cantidadPendientes}</p>
            <p className="text-xs text-gray-400">Pendientes y vencidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-500">Cuentas cobradas</p>
              <CheckCircle size={18} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{cantidadPagadas}</p>
            <p className="text-xs text-gray-400">Pagadas en el listado actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 text-sm">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Listado de cuentas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">Cargando...</p>
          ) : cuentasFiltradas.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-8 text-center">No hay cuentas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">N° Venta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Monto Total</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Pagado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Saldo</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Vencimiento</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cuentasFiltradas.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                        {c.numeroVenta ?? <span className="text-gray-400 font-normal">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{c.clienteNombre}</p>
                        {c.clienteDocumento && <p className="text-xs text-gray-400">{c.clienteDocumento}</p>}
                      </td>
                      <td className="py-3 px-4 text-right">{formatSoles(c.montoTotal)}</td>
                      <td className="py-3 px-4 text-right text-green-600">{formatSoles(c.montoPagado)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${c.saldoPendiente > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {formatSoles(c.saldoPendiente)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estadoBadge(c.estado)}`}>
                          {estadoIcon(c.estado)}{c.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {c.fechaVencimiento ? formatFecha(c.fechaVencimiento) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {(c.estado === 'PENDIENTE' || c.estado === 'VENCIDO') && (
                            <Button
                              variant="outline"
                              onClick={() => handleAbrirPago(c)}
                              className="text-xs px-2 py-1 h-auto border-green-400 text-green-700 hover:bg-green-50"
                            >
                              <DollarSign size={13} className="mr-1" /> Cobrar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleVerDetalle(c)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            <Eye size={13} className="mr-1" /> Ver
                          </Button>
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

      {/* MODAL: Registrar Pago */}
      {showPago && pagosCuenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Registrar Pago</h3>
                <p className="text-sm text-gray-500">{pagosCuenta.clienteNombre}</p>
              </div>
              <button onClick={() => setShowPago(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Resumen */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Monto total</p>
                  <p className="font-semibold">{formatSoles(pagosCuenta.montoTotal)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Ya pagado</p>
                  <p className="font-semibold text-green-600">{formatSoles(pagosCuenta.montoPagado)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs">Saldo pendiente</p>
                  <p className="font-bold text-red-600 text-lg">{formatSoles(pagosCuenta.saldoPendiente)}</p>
                </div>
              </div>

              {/* Monto */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Monto a cobrar *</label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={pagosCuenta.saldoPendiente}
                  value={pagoMonto}
                  onChange={e => setPagoMonto(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-400">Maximo: {formatSoles(pagosCuenta.saldoPendiente)}</p>
              </div>

              {/* Forma de pago */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Forma de pago *</label>
                <div className="flex flex-wrap gap-2">
                  {FORMAS_PAGO.map(fp => (
                    <button
                      key={fp}
                      onClick={() => setPagoFormaPago(fp)}
                      className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                        pagoFormaPago === fp
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {fp.charAt(0) + fp.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea
                  value={pagoObservaciones}
                  onChange={e => setPagoObservaciones(e.target.value)}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  placeholder="Notas opcionales..."
                />
              </div>

              {pagoError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{pagoError}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowPago(false)}>Cancelar</Button>
                <Button onClick={handleConfirmarPago} disabled={pagoLoading}>
                  {pagoLoading ? 'Procesando...' : <><CheckCircle size={15} className="mr-1" /> Confirmar Pago</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detalle de Cuenta */}
      {showDetalle && detalleCuenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Detalle de Cuenta</h3>
                <p className="text-sm text-gray-500">{detalleCuenta.clienteNombre}</p>
              </div>
              <button onClick={() => setShowDetalle(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Info cuenta */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Cliente</p>
                  <p className="font-semibold">{detalleCuenta.clienteNombre}</p>
                  {detalleCuenta.clienteDocumento && <p className="text-xs text-gray-400">{detalleCuenta.clienteDocumento}</p>}
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Venta</p>
                  <p className="font-semibold">{detalleCuenta.numeroVenta ?? '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Monto total</p>
                  <p className="font-semibold">{formatSoles(detalleCuenta.montoTotal)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Pagado</p>
                  <p className="font-semibold text-green-600">{formatSoles(detalleCuenta.montoPagado)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Saldo pendiente</p>
                  <p className={`font-bold text-lg ${detalleCuenta.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatSoles(detalleCuenta.saldoPendiente)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Estado</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${estadoBadge(detalleCuenta.estado)}`}>
                    {estadoIcon(detalleCuenta.estado)}{detalleCuenta.estado}
                  </span>
                </div>
                {detalleCuenta.fechaVencimiento && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Vencimiento</p>
                    <p className="font-medium">{formatFecha(detalleCuenta.fechaVencimiento)}</p>
                  </div>
                )}
                {detalleCuenta.observaciones && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Observaciones</p>
                    <p>{detalleCuenta.observaciones}</p>
                  </div>
                )}
              </div>

              {/* Historial de pagos */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Historial de pagos</h4>
                {(detalleCuenta.pagos ?? []).length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4 border border-gray-200 rounded">
                    Sin pagos registrados
                  </p>
                ) : (
                  <div className="border border-gray-200 rounded overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Fecha</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-500">Monto</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Forma pago</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Usuario</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Obs.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detalleCuenta.pagos ?? []).map((p, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 px-3 text-gray-600">{formatFecha(p.fecha)}</td>
                            <td className="py-2 px-3 text-right font-semibold text-green-600">{formatSoles(p.monto)}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {p.formaPago}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-600">{p.usuarioNombre}</td>
                            <td className="py-2 px-3 text-gray-400 text-xs">{p.observaciones ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold">
                          <td className="py-2 px-3">Total cobrado</td>
                          <td className="py-2 px-3 text-right text-green-600">
                            {formatSoles((detalleCuenta.pagos ?? []).reduce((s, p) => s + p.monto, 0))}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
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
