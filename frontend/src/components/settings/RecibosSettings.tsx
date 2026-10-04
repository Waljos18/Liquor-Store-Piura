import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Building, Phone, Mail, MapPin, FileText, Hash } from 'lucide-react';

const LS_KEY = 'licoreria_empresa_config';

interface EmpresaConfig {
  razonSocial: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  serieBoleta: string;
  serieFactura: string;
}

const DEFAULT_CONFIG: EmpresaConfig = {
  razonSocial: '',
  ruc: '',
  direccion: '',
  telefono: '',
  email: '',
  serieBoleta: 'B001',
  serieFactura: 'F001',
};

function loadConfig(): EmpresaConfig {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<EmpresaConfig>) };
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

export const RecibosSettings = () => {
  const [form, setForm] = useState<EmpresaConfig>(loadConfig);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof EmpresaConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = () => {
    setError(null);
    if (form.ruc && !/^\d{11}$/.test(form.ruc)) {
      setError('El RUC debe tener exactamente 11 dígitos');
      return;
    }
    if (form.serieBoleta && !/^B\d{3}$/.test(form.serieBoleta)) {
      setError('La serie de boleta debe tener formato B + 3 dígitos (ej. B001)');
      return;
    }
    if (form.serieFactura && !/^F\d{3}$/.test(form.serieFactura)) {
      setError('La serie de factura debe tener formato F + 3 dígitos (ej. F001)');
      return;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-text-secondary text-sm">
        Datos de la empresa que se incluirán en boletas, facturas y reportes PDF.
      </p>

      {saved && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          Configuración guardada correctamente.
        </p>
      )}

      {/* Datos de la empresa */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Building size={16} className="text-primary" />
          Datos de la empresa
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Razón social"
              value={form.razonSocial}
              onChange={set('razonSocial')}
              placeholder="Ej. Licorería El Piurano E.I.R.L."
            />
          </div>
          <Input
            label="RUC"
            value={form.ruc}
            onChange={(e) => setForm((f) => ({ ...f, ruc: e.target.value.replace(/\D/g, '') }))}
            placeholder="11 dígitos"
            maxLength={11}
          />
          <div className="flex items-end gap-1">
            <div className="flex-1">
              <Input
                label="Dirección"
                value={form.direccion}
                onChange={set('direccion')}
                placeholder="Av. Grau 123, Piura"
              />
            </div>
            <MapPin size={16} className="text-text-secondary mb-2.5 shrink-0" />
          </div>
          <div className="flex items-end gap-1">
            <div className="flex-1">
              <Input
                label="Teléfono"
                value={form.telefono}
                onChange={set('telefono')}
                placeholder="073-123456"
              />
            </div>
            <Phone size={16} className="text-text-secondary mb-2.5 shrink-0" />
          </div>
          <div className="flex items-end gap-1">
            <div className="flex-1">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="contacto@empresa.com"
              />
            </div>
            <Mail size={16} className="text-text-secondary mb-2.5 shrink-0" />
          </div>
        </div>
      </div>

      {/* Numeración de comprobantes */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          Numeración de comprobantes
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-end gap-1">
            <div className="flex-1">
              <Input
                label="Serie de boleta"
                value={form.serieBoleta}
                onChange={(e) => setForm((f) => ({ ...f, serieBoleta: e.target.value.toUpperCase() }))}
                placeholder="B001"
                maxLength={4}
              />
            </div>
            <Hash size={16} className="text-text-secondary mb-2.5 shrink-0" />
          </div>
          <div className="flex items-end gap-1">
            <div className="flex-1">
              <Input
                label="Serie de factura"
                value={form.serieFactura}
                onChange={(e) => setForm((f) => ({ ...f, serieFactura: e.target.value.toUpperCase() }))}
                placeholder="F001"
                maxLength={4}
              />
            </div>
            <Hash size={16} className="text-text-secondary mb-2.5 shrink-0" />
          </div>
        </div>
        <p className="text-xs text-text-secondary">
          La numeración correlativa se incrementa automáticamente con cada comprobante emitido.
          El reinicio de numeración debe realizarse manualmente al inicio del ejercicio fiscal.
        </p>
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <Button onClick={save}>Guardar configuración</Button>
      </div>
    </div>
  );
};
