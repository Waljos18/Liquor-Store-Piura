const STORAGE_KEY = 'licoreria_alertas_config';

export interface AlertasConfig {
  diasVencimiento: number; // días de anticipación para alerta de vencimiento (default 30)
  diasUrgente: number;     // días para marcar como urgente (default 7)
}

const DEFAULTS: AlertasConfig = {
  diasVencimiento: 30,
  diasUrgente: 7,
};

export function getAlertasConfig(): AlertasConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAlertasConfig(config: AlertasConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export const ALERTAS_DEFAULTS = DEFAULTS;
