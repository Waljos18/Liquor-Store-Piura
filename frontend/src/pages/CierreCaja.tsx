import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  fetchCierreCaja,
  fetchCajaActiva,
  abrirCaja,
  cerrarCaja,
  type CierreCajaDTO,
  type AperturaCajaDTO,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign, TrendingUp, ShoppingBag, XCircle, Printer,
  Lock, Unlock, AlertTriangle, CheckCircle, X,
} from 'lucide-react';

const fmt = (n: number | undefined | null) => `S/ ${(n ?? 0).toFixed(2)}`;

const FORMA_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: 'Efectivo', TARJETA: 'Tarjeta', YAPE: 'Yape',
  PLIN: 'Plin', TRANSFERENCIA: 'Transferencia', MIXTO: 'Mixto', CREDITO: 'Crédito',
};

/** Horarios de operación (texto para mostrar al usuario) */
const HORARIOS = 'Lun–Jue: 9:00–23:30 | Vie–Sáb: 9:00–03:00 | Dom: 10:00–22:00';

export const CierreCaja = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const _d = new Date();
  const hoy = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`;

  const [fecha, setFecha] = useState(hoy);
  const [data, setData] = useState<CierreCajaDTO | null>(null);
  const [apertura, setApertura] = useState<AperturaCajaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Abrir caja
  const [modalAbrir, setModalAbrir] = useState(false);
  const [montoInicial, setMontoInicial] = useState('0');
  const [obsApertura, setObsApertura] = useState('');
  const [abriendo, setAbriendo] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Modal Cerrar caja
  const [modalCerrar, setModalCerrar] = useState(false);
  const [montoReal, setMontoReal] = useState('');
  const [obsCierre, setObsCierre] = useState('');
  const [cerrando, setCerrando] = useState(false);

  const cargar = async (f: string) => {
    setLoading(true);
    setError(null);
    const [cierreRes, activaRes] = await Promise.all([
      fetchCierreCaja(f),
      fetchCajaActiva(),
    ]);
    setLoading(false);
    if (cierreRes.success && cierreRes.data) setData(cierreRes.data);
    else setError(cierreRes.error?.message ?? 'Error al cargar cierre');
    if (activaRes.success) setApertura(activaRes.data ?? null);
  };

  useEffect(() => { cargar(hoy); }, []);

  const handleFechaChange = (f: string) => { setFecha(f); cargar(f); };

  const handleAbrir = async () => {
    const monto = parseFloat(montoInicial);
    if (isNaN(monto) || monto < 0) { setErrorModal('Ingrese un monto válido'); return; }
    setAbriendo(true);
    setErrorModal(null);
    const res = await abrirCaja({ montoInicial: monto, observaciones: obsApertura || undefined });
    setAbriendo(false);
    if (res.success && res.data) {
      setApertura(res.data);
      setModalAbrir(false);
      setMontoInicial('0');
      setObsApertura('');
    } else {
      setErrorModal(res.error?.message ?? 'Error al abrir caja');
    }
  };

  const handleCerrar = async () => {
    if (!apertura) return;
    const monto = parseFloat(montoReal);
    if (isNaN(monto) || monto < 0) { setErrorModal('Ingrese un monto válido'); return; }
    setCerrando(true);
    setErrorModal(null);
    const res = await cerrarCaja(apertura.id, { montoReal: monto, observacionesCierre: obsCierre || undefined });
    setCerrando(false);
    if (res.success && res.data) {
      setApertura(null);
      setModalCerrar(false);
      setMontoReal('');
      setObsCierre('');
      cargar(fecha);
    } else {
      setErrorModal(res.error?.message ?? 'Error al cerrar caja');
    }
  };

  const margen = data && data.totalVentas > 0
    ? ((data.totalGanancias / data.totalVentas) * 100).toFixed(1)
    : '0.0';

  const sobranteFaltante = apertura?.sobranteFaltante;
  const sobrante = sobranteFaltante != null && sobranteFaltante > 0;
  const faltante = sobranteFaltante != null && sobranteFaltante < 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign size={26} /> Caja
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="date"
            value={fecha}
            max={hoy}
            onChange={(e) => handleFechaChange(e.target.value)}
            className="px-3 py-1.5 border border-border rounded text-sm bg-surface"
          />
          {!apertura && isAdmin && (
            <Button onClick={() => { setModalAbrir(true); setErrorModal(null); }} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white">
              <Unlock size={16} /> Abrir Caja
            </Button>
          )}
          {apertura && (
            <Button onClick={() => { setModalCerrar(true); setErrorModal(null); }} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white">
              <Lock size={16} /> Cerrar Caja
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()} className="print:hidden">
            <Printer size={16} className="mr-1" /> Imprimir
          </Button>
        </div>
      </div>

      {/* Estado de apertura */}
      {apertura ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-green-800">Caja abierta</span>
            <span className="text-green-700 ml-2">
              por {apertura.usuarioAperturaNombre} · Monto inicial: {fmt(apertura.montoInicial)}
              {apertura.horaApertura && ` · ${new Date(apertura.horaApertura).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-amber-800">Caja cerrada</span>
            <span className="text-amber-700 ml-2">No hay sesión activa. {isAdmin ? 'Abre la caja para comenzar.' : 'Contacta al administrador.'}</span>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 text-sm">{error}</p>}

      {loading ? (
        <p className="text-text-secondary">Cargando...</p>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-text-secondary">Ventas del día</p>
                  <ShoppingBag size={18} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-700">{fmt(data.totalVentas)}</p>
                <p className="text-xs text-text-secondary">{data.totalTransacciones} transacciones</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-text-secondary">Ganancias netas</p>
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-700">{fmt(data.totalGanancias)}</p>
                <p className="text-xs text-text-secondary">Margen: {margen}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-text-secondary">Ticket promedio</p>
                  <DollarSign size={18} className="text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {data.totalTransacciones > 0 ? fmt(data.totalVentas / data.totalTransacciones) : 'S/ 0.00'}
                </p>
                <p className="text-xs text-text-secondary">Por venta completada</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-text-secondary">Ventas anuladas</p>
                  <XCircle size={18} className="text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-600">{data.ventasAnuladas}</p>
                <p className="text-xs text-text-secondary">Anulaciones del día</p>
              </CardContent>
            </Card>
          </div>

          {/* Desglose por forma de pago */}
          <Card>
            <CardHeader><CardTitle>Desglose por forma de pago</CardTitle></CardHeader>
            <CardContent className="p-0">
              {data.desglosePorFormaPago.length === 0 ? (
                <p className="text-text-secondary text-sm px-4 py-6 text-center">No hay ventas registradas para esta fecha</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Forma de pago</th>
                      <th className="text-center py-3 px-4 font-medium text-text-secondary">Transacciones</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">Total</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">% del total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.desglosePorFormaPago.map((d, i) => {
                      const pct = data.totalVentas > 0 ? ((d.total / data.totalVentas) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-3 px-4 font-medium">{FORMA_PAGO_LABEL[d.formaPago] ?? d.formaPago}</td>
                          <td className="py-3 px-4 text-center">{d.cantidad}</td>
                          <td className="py-3 px-4 text-right font-semibold text-blue-700">{fmt(d.total)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-border rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-text-secondary w-10 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-background font-bold">
                      <td className="py-3 px-4">TOTAL</td>
                      <td className="py-3 px-4 text-center">{data.totalTransacciones}</td>
                      <td className="py-3 px-4 text-right text-blue-800">{fmt(data.totalVentas)}</td>
                      <td className="py-3 px-4 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Ventas por vendedor */}
          {data.ventasPorVendedor && data.ventasPorVendedor.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Ventas por vendedor</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Vendedor</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Rol</th>
                      <th className="text-center py-3 px-4 font-medium text-text-secondary">Transacciones</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">Total</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">% del total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ventasPorVendedor.map((v, i) => {
                      const pct = data.totalVentas > 0 ? ((v.totalVentas / data.totalVentas) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50">
                          <td className="py-3 px-4 font-medium">{v.vendedor}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{v.rol}</span>
                          </td>
                          <td className="py-3 px-4 text-center">{v.transacciones}</td>
                          <td className="py-3 px-4 text-right font-semibold text-blue-700">{fmt(v.totalVentas)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-border rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-text-secondary w-10 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Resumen final */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between border-b border-border pb-2 sm:border-b-0 sm:pb-0 sm:border-r sm:pr-4">
                  <span className="text-text-secondary">Total ingresos</span>
                  <span className="font-bold">{fmt(data.totalVentas)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2 sm:border-b-0 sm:pb-0 sm:border-r sm:px-4">
                  <span className="text-text-secondary">Ganancia estimada</span>
                  <span className="font-bold text-green-700">{fmt(data.totalGanancias)}</span>
                </div>
                <div className="flex justify-between sm:pl-4">
                  <span className="text-text-secondary">Margen bruto</span>
                  <span className="font-bold text-purple-700">{margen}%</span>
                </div>
              </div>

              {/* Sobrante/faltante al cierre */}
              {apertura?.estado === 'CERRADA' && apertura.sobranteFaltante != null && (
                <div className={`mt-4 pt-4 border-t border-border flex items-center justify-between`}>
                  <div>
                    <p className="text-xs text-text-secondary">Monto inicial + ingresos esperado</p>
                    <p className="font-semibold">{fmt(apertura.montoCierre)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Conteo físico</p>
                    <p className="font-semibold">{fmt(apertura.montoReal)}</p>
                  </div>
                  <div className={`text-right rounded-lg px-4 py-2 ${sobrante ? 'bg-green-50' : faltante ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <p className="text-xs text-text-secondary">{sobrante ? 'Sobrante' : faltante ? 'Faltante' : 'Cuadrado'}</p>
                    <p className={`text-xl font-bold ${sobrante ? 'text-green-700' : faltante ? 'text-red-700' : 'text-gray-700'}`}>
                      {faltante ? '-' : ''}{fmt(Math.abs(apertura.sobranteFaltante ?? 0))}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}

      {/* Modal Abrir Caja */}
      {modalAbrir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Unlock size={18} className="text-green-600" /> Abrir Caja</h3>
                <p className="text-xs text-text-secondary mt-0.5">{HORARIOS}</p>
              </div>
              <button onClick={() => setModalAbrir(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Monto inicial en caja (S/)</label>
                <input
                  type="number"
                  min="0"
                  step="0.10"
                  value={montoInicial}
                  onChange={(e) => setMontoInicial(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="0.00"
                />
                <p className="text-xs text-text-secondary mt-1">Efectivo físico en la caja al abrir el turno</p>
              </div>
              <Input
                label="Observaciones (opcional)"
                value={obsApertura}
                onChange={(e) => setObsApertura(e.target.value)}
                placeholder="Ej. Turno mañana"
              />
              {errorModal && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2">{errorModal}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalAbrir(false)} disabled={abriendo}>Cancelar</Button>
              <Button onClick={handleAbrir} disabled={abriendo} className="bg-green-600 hover:bg-green-700 text-white">
                {abriendo ? 'Abriendo...' : 'Abrir Caja'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cerrar Caja */}
      {modalCerrar && apertura && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Lock size={18} className="text-red-600" /> Cerrar Caja</h3>
                <p className="text-xs text-text-secondary mt-0.5">Monto inicial: {fmt(apertura.montoInicial)}</p>
              </div>
              <button onClick={() => setModalCerrar(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-background rounded p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Monto inicial</span>
                  <span className="font-medium">{fmt(apertura.montoInicial)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ingresos del día</span>
                  <span className="font-medium text-green-700">{fmt(data?.totalVentas)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-semibold">
                  <span>Esperado en caja</span>
                  <span>{fmt((apertura.montoInicial ?? 0) + (data?.totalVentas ?? 0))}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conteo físico de caja (S/)</label>
                <input
                  type="number"
                  min="0"
                  step="0.10"
                  value={montoReal}
                  onChange={(e) => setMontoReal(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="0.00"
                />
                <p className="text-xs text-text-secondary mt-1">Cuente el efectivo físico en caja al cerrar</p>
              </div>
              {montoReal && !isNaN(parseFloat(montoReal)) && (
                <div className={`rounded px-3 py-2 text-sm font-medium ${
                  parseFloat(montoReal) > (apertura.montoInicial ?? 0) + (data?.totalVentas ?? 0)
                    ? 'bg-green-50 text-green-700'
                    : parseFloat(montoReal) < (apertura.montoInicial ?? 0) + (data?.totalVentas ?? 0)
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {(() => {
                    const diff = parseFloat(montoReal) - ((apertura.montoInicial ?? 0) + (data?.totalVentas ?? 0));
                    return diff > 0 ? `Sobrante: ${fmt(diff)}` : diff < 0 ? `Faltante: ${fmt(Math.abs(diff))}` : 'Caja cuadrada ✓';
                  })()}
                </div>
              )}
              <Input
                label="Observaciones del cierre (opcional)"
                value={obsCierre}
                onChange={(e) => setObsCierre(e.target.value)}
                placeholder="Ej. Entrega al supervisor"
              />
              {errorModal && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2">{errorModal}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalCerrar(false)} disabled={cerrando}>Cancelar</Button>
              <Button onClick={handleCerrar} disabled={cerrando} className="bg-red-600 hover:bg-red-700 text-white">
                {cerrando ? 'Cerrando...' : 'Cerrar Caja'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
