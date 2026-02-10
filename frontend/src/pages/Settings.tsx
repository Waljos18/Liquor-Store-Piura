import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Settings as SettingsIcon, Printer, Tag, Users, Package, Truck, CreditCard, User, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CategoriasSettings } from '../components/settings/CategoriasSettings';
import { ClientesSettings } from '../components/settings/ClientesSettings';
import { ProductosSettings } from '../components/settings/ProductosSettings';
import { ProveedoresSettings } from '../components/settings/ProveedoresSettings';

type TabId = 'categorias' | 'clientes' | 'productos' | 'proveedores' | 'metodos-pago' | 'usuarios' | 'recibos' | 'impresoras';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'categorias', label: 'Categorías', icon: Tag },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'metodos-pago', label: 'Métodos de pago', icon: CreditCard },
  { id: 'usuarios', label: 'Usuarios', icon: User },
  { id: 'recibos', label: 'Config. Recibos', icon: FileText },
  { id: 'impresoras', label: 'Impresoras', icon: Printer },
];

const VALID_TABS: TabId[] = ['categorias', 'clientes', 'productos', 'proveedores', 'metodos-pago', 'usuarios', 'recibos', 'impresoras'];

export const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabId | null;
  const initialTab: TabId = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'categorias';
  const [tab, setTab] = useState<TabId>(initialTab);

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam) && tab !== tabParam) {
      setTab(tabParam);
    }
  }, [tabParam]);

  const setTabAndUrl = (newTab: TabId) => {
    setTab(newTab);
    setSearchParams(newTab === 'categorias' ? {} : { tab: newTab }, { replace: true });
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Configuración</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-text-secondary">Solo los administradores pueden acceder a la configuración.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon size={28} /> Configuración
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="lg:w-64 flex-shrink-0">
          <CardContent className="p-2">
            <nav className="flex flex-col gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTabAndUrl(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-left ${
                    tab === t.id ? 'bg-primary text-white' : 'hover:bg-background'
                  }`}
                >
                  <t.icon size={18} />
                  {t.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-0">
          <CardHeader>
            <CardTitle>{TABS.find((t) => t.id === tab)?.label ?? 'Configuración'}</CardTitle>
          </CardHeader>
          <CardContent>
            {tab === 'categorias' && <CategoriasSettings />}
            {tab === 'clientes' && <ClientesSettings />}
            {tab === 'productos' && <ProductosSettings />}
            {tab === 'proveedores' && <ProveedoresSettings />}
            {tab === 'metodos-pago' && (
              <div className="text-text-secondary">
                <p>Métodos de pago disponibles: Efectivo, Tarjeta, Yape, Plin, Mixto.</p>
                <p className="mt-2 text-sm">Configuración en desarrollo.</p>
              </div>
            )}
            {tab === 'usuarios' && (
              <div className="text-text-secondary">
                <p>Gestión de usuarios y roles. Configuración en desarrollo.</p>
              </div>
            )}
            {tab === 'recibos' && (
              <div className="text-text-secondary">
                <p>Configuración de serie, numeración y datos de la empresa para recibos.</p>
                <p className="mt-2 text-sm">Configuración en desarrollo.</p>
              </div>
            )}
            {tab === 'impresoras' && (
              <div className="text-text-secondary">
                <p>Configuración de impresoras para tickets y comprobantes.</p>
                <p className="mt-2 text-sm">Configuración en desarrollo.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
