import { useState } from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, Clock, TrendingDown, CheckCircle } from 'lucide-react';
import {
  getAlertasConfig,
  saveAlertasConfig,
  ALERTAS_DEFAULTS,
  type AlertasConfig,
} from '../../config/alertasConfig';

export const AlertasSettings = () => {
  const [config, setConfig] = useState<AlertasConfig>(getAlertasConfig);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof AlertasConfig, value: number) => {
    setSaved(false);
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveAlertasConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setConfig({ ...ALERTAS_DEFAULTS });
    setSaved(false);
  };

  const changed =
    config.diasVencimiento !== ALERTAS_DEFAULTS.diasVencimiento ||
    config.diasUrgente !== ALERTAS_DEFAULTS.diasUrgente;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-text-secondary text-sm">
        Configura los umbrales que determinan cuándo se muestran las alertas en el módulo de Inventario.
        Los cambios se aplican inmediatamente al recargar la vista de Inventario.
      </p>

      {/* Alerta de vencimiento */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-orange-500" />
          <h3 className="font-semibold text-sm">Alerta de productos próximos a vencer</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Días de anticipación para alerta
              <span className="ml-2 text-xs text-text-secondary font-normal">(por defecto: 30 días)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={7}
                max={90}
                step={1}
                value={config.diasVencimiento}
                onChange={(e) => update('diasVencimiento', Number(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={7}
                  max={90}
                  value={config.diasVencimiento}
                  onChange={(e) => {
                    const v = Math.min(90, Math.max(7, Number(e.target.value)));
                    update('diasVencimiento', v);
                  }}
                  className="w-16 px-2 py-1 border border-border rounded text-sm text-center"
                />
                <span className="text-sm text-text-secondary">días</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Se mostrarán como alertas los productos que venzan en los próximos{' '}
              <strong>{config.diasVencimiento} días</strong>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Días para marcar como urgente
              <span className="ml-2 text-xs text-text-secondary font-normal">(por defecto: 7 días)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={Math.max(14, config.diasVencimiento - 1)}
                step={1}
                value={config.diasUrgente}
                onChange={(e) => update('diasUrgente', Number(e.target.value))}
                className="flex-1 accent-red-500"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={Math.max(14, config.diasVencimiento - 1)}
                  value={config.diasUrgente}
                  onChange={(e) => {
                    const v = Math.min(config.diasVencimiento - 1, Math.max(1, Number(e.target.value)));
                    update('diasUrgente', v);
                  }}
                  className="w-16 px-2 py-1 border border-border rounded text-sm text-center"
                />
                <span className="text-sm text-text-secondary">días</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Productos con menos de <strong>{config.diasUrgente} días</strong> para vencer se marcan en{' '}
              <span className="text-red-600 font-medium">rojo urgente</span>; el resto en naranja.
            </p>
          </div>
        </div>

        {/* Vista previa */}
        <div className="bg-background rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-text-secondary">Vista previa del comportamiento:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full">
              <span className="font-bold">≤ {config.diasUrgente}d</span> → Urgente (rojo)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
              {config.diasUrgente + 1}–{config.diasVencimiento}d → Próximo a vencer (naranja)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
              &gt; {config.diasVencimiento}d → Sin alerta
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown size={18} className="text-red-500" />
          <h3 className="font-semibold text-sm">Alerta de stock bajo</h3>
        </div>
        <p className="text-sm text-text-secondary">
          Se dispara automáticamente cuando el stock de un producto es menor o igual a su{' '}
          <strong>stock mínimo</strong> configurado individualmente, o cuando llega a cero.
        </p>
        <div className="bg-background rounded-lg p-3 text-xs text-text-secondary space-y-1">
          <p>
            Para ajustar el stock mínimo por producto, edítalo desde{' '}
            <strong>Inventario → Ajustar Stock</strong> o directamente en el catálogo de Productos.
          </p>
          <p>
            Los valores por defecto se asignaron por categoría según la migración V8 (vino: 2, agua: 5, etc.).
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          Guardar configuración
        </Button>
        {changed && (
          <Button variant="outline" onClick={handleReset}>
            Restaurar valores por defecto
          </Button>
        )}
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-700">
            <CheckCircle size={15} /> Guardado correctamente
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
        <p>
          La configuración se guarda en este navegador. Para ver los cambios aplicados, recarga la página de{' '}
          <strong>Inventario</strong>.
        </p>
      </div>
    </div>
  );
};
