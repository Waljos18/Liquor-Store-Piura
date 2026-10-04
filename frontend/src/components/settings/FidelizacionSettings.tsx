import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Gift, CheckCircle } from 'lucide-react';
import { fetchFidelizacionConfig, updateFidelizacionConfig, type ConfigFidelizacionDTO } from '../../api/api';

export const FidelizacionSettings = () => {
  const [config, setConfig] = useState<ConfigFidelizacionDTO | null>(null);
  const [form, setForm] = useState<Partial<ConfigFidelizacionDTO>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFidelizacionConfig().then((res) => {
      setLoading(false);
      if (res.success && res.data) {
        setConfig(res.data);
        setForm(res.data);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setOk(false);
    const res = await updateFidelizacionConfig(form);
    setSaving(false);
    if (res.success && res.data) {
      setConfig(res.data);
      setForm(res.data);
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } else {
      setError(res.error?.message ?? 'Error al guardar');
    }
  };

  if (loading) return <div className="p-4 text-text-secondary">Cargando configuración...</div>;

  const descuentoPorPunto = form.puntosPorSolDescuento ? 1 / form.puntosPorSolDescuento : 0;
  const maxDescuento = form.maxPuntosCanjeporVenta && form.puntosPorSolDescuento
    ? (form.maxPuntosCanjeporVenta / form.puntosPorSolDescuento).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gift size={20} className="text-primary" />
        <h3 className="font-semibold text-lg">Reglas de Fidelización</h3>
      </div>

      {/* Preview de reglas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-1">
        <p className="font-medium text-blue-800 mb-2">Reglas actuales:</p>
        <p className="text-blue-700">
          • 1 punto por cada S/ {form.solesPorPunto ?? config?.solesPorPunto ?? 5} de compra
        </p>
        <p className="text-blue-700">
          • {form.puntosPorSolDescuento ?? config?.puntosPorSolDescuento ?? 20} puntos = S/ 1 de descuento
          ({descuentoPorPunto > 0 ? `S/ ${descuentoPorPunto.toFixed(4)}` : '—'} por punto)
        </p>
        <p className="text-blue-700">
          • Máximo {form.maxPuntosCanjeporVenta ?? config?.maxPuntosCanjeporVenta ?? 500} puntos por venta
          (= S/ {maxDescuento} de descuento máx.)
        </p>
        <p className="text-blue-700">
          • Mínimo S/ {form.minCompraParaCanje ?? config?.minCompraParaCanje ?? 20} para poder canjear
        </p>
        <p className={`font-medium ${(form.activo ?? config?.activo) ? 'text-green-700' : 'text-red-700'}`}>
          • Sistema: {(form.activo ?? config?.activo) ? '✓ Activo' : '✗ Inactivo'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Soles por punto (S/ / punto)</label>
          <p className="text-xs text-text-secondary mb-1">
            Ej: 5 → 1 punto por cada S/ 5 de compra
          </p>
          <Input
            type="number"
            step="0.5"
            min="1"
            value={form.solesPorPunto ?? ''}
            onChange={(e) => setForm({ ...form, solesPorPunto: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Puntos por sol de descuento</label>
          <p className="text-xs text-text-secondary mb-1">
            Ej: 20 → 20 puntos = S/ 1 de descuento
          </p>
          <Input
            type="number"
            step="1"
            min="1"
            value={form.puntosPorSolDescuento ?? ''}
            onChange={(e) => setForm({ ...form, puntosPorSolDescuento: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Máx. puntos a canjear por venta</label>
          <Input
            type="number"
            step="50"
            min="0"
            value={form.maxPuntosCanjeporVenta ?? ''}
            onChange={(e) => setForm({ ...form, maxPuntosCanjeporVenta: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Mínimo de compra para canjear (S/)</label>
          <Input
            type="number"
            step="5"
            min="0"
            value={form.minCompraParaCanje ?? ''}
            onChange={(e) => setForm({ ...form, minCompraParaCanje: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="activo-fidelizacion"
          checked={form.activo ?? true}
          onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="activo-fidelizacion" className="text-sm font-medium">
          Sistema de puntos activo
        </label>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
      )}
      {ok && (
        <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center gap-1">
          <CheckCircle size={14} /> Configuración guardada
        </p>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar configuración'}
      </Button>
    </div>
  );
};
