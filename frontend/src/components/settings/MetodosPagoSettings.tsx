import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, ArrowLeftRight, Wifi } from 'lucide-react';

const LS_KEY = 'licoreria_metodos_pago';

interface MetodoPago {
  id: string;
  label: string;
  descripcion: string;
  icon: React.ElementType;
  color: string;
}

const METODOS: MetodoPago[] = [
  { id: 'EFECTIVO',       label: 'Efectivo',       descripcion: 'Pago en billetes y monedas',                icon: Banknote,    color: 'text-green-600' },
  { id: 'TARJETA',        label: 'Tarjeta',         descripcion: 'Débito o crédito mediante POS',             icon: CreditCard,  color: 'text-blue-600' },
  { id: 'TRANSFERENCIA',  label: 'Transferencia',   descripcion: 'Transferencia bancaria (BCP, Interbank...)', icon: ArrowLeftRight, color: 'text-purple-600' },
  { id: 'YAPE',           label: 'Yape',            descripcion: 'Billetera digital Yape (BCP)',              icon: Smartphone,  color: 'text-violet-600' },
  { id: 'PLIN',           label: 'Plin',            descripcion: 'Billetera digital Plin (BBVA / Interbank)', icon: Wifi,        color: 'text-teal-600' },
  { id: 'MIXTO',          label: 'Mixto',           descripcion: 'Combinación de dos métodos de pago',        icon: CreditCard,  color: 'text-orange-600' },
];

function loadHabilitados(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, boolean>;
  } catch { /* ignore */ }
  // Por defecto todos habilitados
  return Object.fromEntries(METODOS.map((m) => [m.id, true]));
}

export const MetodosPagoSettings = () => {
  const [habilitados, setHabilitados] = useState<Record<string, boolean>>(loadHabilitados);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setSaved(false);
    setHabilitados((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const habilitarTodos = () => {
    const all = Object.fromEntries(METODOS.map((m) => [m.id, true]));
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    setHabilitados(all);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const efectivoHabilitado = habilitados['EFECTIVO'] !== false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-text-secondary text-sm">
          Activa o desactiva métodos de pago en el POS y en la pantalla de ventas.
        </p>
        <button
          type="button"
          onClick={habilitarTodos}
          className="text-sm text-primary hover:underline"
        >
          Habilitar todos
        </button>
      </div>

      {saved && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          Configuración guardada correctamente.
        </p>
      )}

      {!efectivoHabilitado && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Se recomienda mantener "Efectivo" habilitado como método de pago principal.
        </p>
      )}

      <ul className="divide-y divide-border">
        {METODOS.map((m) => {
          const Icon = m.icon;
          const on = habilitados[m.id] !== false;
          return (
            <li key={m.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${m.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-medium">{m.label}</p>
                  <p className="text-sm text-text-secondary">{m.descripcion}</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(m.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  on ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    on ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-text-secondary mt-2">
        Los cambios se aplican al recargar el POS. Los métodos desactivados no aparecerán como opción al registrar ventas.
      </p>
    </div>
  );
};
