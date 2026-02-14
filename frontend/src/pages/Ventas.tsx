import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  fetchVentas,
  anularVenta,
  fetchComprobantePorVenta,
  emitirBoleta,
  emitirFactura,
  descargarPdfComprobante,
  enviarComprobanteSunat,
  type VentaDTO,
  type ComprobanteDTO,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Send, Download, Receipt } from 'lucide-react';

const formatDate = (s: string) => {
  try {
    const d = new Date(s);
    return d.toLocaleString('es-PE');
  } catch {
    return s;
  }
};

const formatSoles = (n: number) => `S/ ${(n ?? 0).toFixed(2)}`;

const ESTADO_SUNAT_CLASS: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  ACEPTADO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
  ERROR: 'bg-red-100 text-red-800',
};

export const Ventas = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [comprobantes, setComprobantes] = useState<Record<number, ComprobanteDTO | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anulando, setAnulando] = useState<number | null>(null);
  const [enviandoSunat, setEnviandoSunat] = useState<number | null>(null);

  const [modalBoleta, setModalBoleta] = useState<VentaDTO | null>(null);
  const [modalFactura, setModalFactura] = useState<VentaDTO | null>(null);
  const [formBoleta, setFormBoleta] = useState({ tipoDocumento: '1', numeroDocumento: '', nombre: '' });
  const [formFactura, setFormFactura] = useState({ numeroDocumento: '', razonSocial: '' });
  const [guardandoComprobante, setGuardandoComprobante] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

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
      if (r.status === 'fulfilled') {
        map[r.value.ventaId] = r.value.comp;
      }
    });
    setComprobantes((prev) => ({ ...prev, ...map }));
  }, []);

  const loadVentas = async () => {
    setLoading(true);
    setError(null);
    const hoy = new Date();
    const hace90 = new Date(hoy);
    hace90.setDate(hace90.getDate() - 90);
    const fechaDesde = hace90.toISOString().slice(0, 19) + 'Z';
    const fechaHasta = hoy.toISOString().slice(0, 19) + 'Z';
    const res = await fetchVentas({ fechaDesde, fechaHasta, size: 100 });
    if (res.success && res.data) {
      const list = res.data.content ?? [];
      setVentas(list);
      await loadComprobantes(list);
    } else if (!res.success) {
      setError(res.error?.message ?? 'Error al cargar ventas');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVentas();
  }, []);

  const handleAnular = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm('¿Anular esta venta? Se restaurará el stock.')) return;
    setAnulando(id);
    const res = await anularVenta(id);
    setAnulando(null);
    if (res.success) loadVentas();
    else alert(res.error?.message ?? 'Error al anular');
  };

  const openBoleta = (v: VentaDTO) => {
    setFormBoleta({
      tipoDocumento: '1',
      numeroDocumento: v.cliente?.numeroDocumento ?? '',
      nombre: v.cliente?.nombre ?? '',
    });
    setErrorModal(null);
    setModalBoleta(v);
  };

  const openFactura = (v: VentaDTO) => {
    setFormFactura({
      numeroDocumento: v.cliente?.numeroDocumento ?? '',
      razonSocial: v.cliente?.nombre ?? '',
    });
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
          id: res.data!.id,
          ventaId: modalBoleta.id,
          tipoComprobante: 'BOLETA',
          serie: res.data!.serie,
          numero: res.data!.numero,
          estadoSunat: res.data!.estadoSunat,
          fechaEmision: new Date().toISOString(),
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
          id: res.data!.id,
          ventaId: modalFactura.id,
          tipoComprobante: 'FACTURA',
          serie: res.data!.serie,
          numero: res.data!.numero,
          estadoSunat: res.data!.estadoSunat,
          fechaEmision: new Date().toISOString(),
        },
      }));
      setModalFactura(null);
    } else {
      setErrorModal(res.error?.message ?? 'Error al emitir factura');
    }
  };

  const handleVerPdf = (comp: ComprobanteDTO) => {
    descargarPdfComprobante(comp.id);
  };

  const handleEnviarSunat = async (comp: ComprobanteDTO) => {
    setEnviandoSunat(comp.id);
    const res = await enviarComprobanteSunat(comp.id);
    setEnviandoSunat(null);
    if (res.success) {
      await loadVentas();
    } else {
      alert(res.error?.message ?? 'Error al enviar a SUNAT');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Ventas y Comprobantes</h2>

      <Card>
        <CardHeader>
          <CardTitle>Listado de ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {loading ? (
            <p className="text-text-secondary">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2">N° Venta</th>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Forma pago</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Comprobante</th>
                    {isAdmin && <th className="py-2">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => {
                    const comp = comprobantes[v.id] ?? null;
                    return (
                      <tr key={v.id} className="border-b border-border">
                        <td className="py-2 font-medium">{v.numeroVenta}</td>
                        <td className="py-2">{formatDate(v.fecha)}</td>
                        <td className="py-2">{v.cliente?.nombre ?? '-'}</td>
                        <td className="py-2">{formatSoles(v.total)}</td>
                        <td className="py-2">{v.formaPago}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              v.estado === 'COMPLETADA'
                                ? 'bg-green-100 text-green-800'
                                : v.estado === 'ANULADA'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100'
                            }`}
                          >
                            {v.estado}
                          </span>
                        </td>
                        <td className="py-2">
                          {v.estado === 'COMPLETADA' && (
                            comp ? (
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-medium">{comp.serie}-{comp.numero}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${ESTADO_SUNAT_CLASS[comp.estadoSunat] ?? 'bg-gray-100'}`}>
                                  {comp.estadoSunat}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => handleVerPdf(comp)} title="Descargar PDF">
                                  <Download size={14} />
                                </Button>
                                {comp.estadoSunat === 'PENDIENTE' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEnviarSunat(comp)}
                                    disabled={enviandoSunat === comp.id}
                                    title="Enviar a SUNAT"
                                  >
                                    {enviandoSunat === comp.id ? '...' : <Send size={14} />}
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                <Button variant="outline" size="sm" onClick={() => openBoleta(v)} title="Emitir boleta">
                                  <Receipt size={14} className="mr-1" />
                                  Boleta
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => openFactura(v)} title="Emitir factura">
                                  <FileText size={14} className="mr-1" />
                                  Factura
                                </Button>
                              </div>
                            )
                          )}
                        </td>
                        {isAdmin && (
                          <td className="py-2">
                            {v.estado === 'COMPLETADA' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAnular(v.id)}
                                disabled={anulando === v.id}
                              >
                                {anulando === v.id ? 'Anulando...' : 'Anular'}
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!ventas.length && <p className="py-4 text-text-secondary">No hay ventas</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Emitir Boleta */}
      {modalBoleta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-border font-bold flex justify-between items-center">
              <span>Emitir boleta — Venta {modalBoleta.numeroVenta}</span>
              <Button variant="ghost" size="sm" onClick={() => setModalBoleta(null)}>Cerrar</Button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo documento</label>
                <select
                  value={formBoleta.tipoDocumento}
                  onChange={(e) => setFormBoleta((f) => ({ ...f, tipoDocumento: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded"
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
            <div className="p-4 border-t border-border flex justify-end gap-2">
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
            <div className="p-4 border-b border-border font-bold flex justify-between items-center">
              <span>Emitir factura — Venta {modalFactura.numeroVenta}</span>
              <Button variant="ghost" size="sm" onClick={() => setModalFactura(null)}>Cerrar</Button>
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="RUC"
                value={formFactura.numeroDocumento}
                onChange={(e) => setFormFactura((f) => ({ ...f, numeroDocumento: e.target.value }))}
                placeholder="10 o 11 dígitos"
              />
              <Input
                label="Razón social"
                value={formFactura.razonSocial}
                onChange={(e) => setFormFactura((f) => ({ ...f, razonSocial: e.target.value }))}
                placeholder="Nombre o razón social"
              />
              {errorModal && <p className="text-red-600 text-sm">{errorModal}</p>}
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalFactura(null)} disabled={guardandoComprobante}>Cancelar</Button>
              <Button onClick={handleEmitirFactura} disabled={guardandoComprobante}>
                {guardandoComprobante ? 'Generando...' : 'Emitir factura'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
