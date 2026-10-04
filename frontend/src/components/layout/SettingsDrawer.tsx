import { useState, useEffect } from 'react';
import { Settings, X, Tag, Users, Truck, CreditCard, User, FileText, Printer, Bell, Gift, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CategoriasSettings } from '../settings/CategoriasSettings';
import { ClientesSettings } from '../settings/ClientesSettings';
import { ProveedoresSettings } from '../settings/ProveedoresSettings';
import { UsuariosSettings } from '../settings/UsuariosSettings';
import { MetodosPagoSettings } from '../settings/MetodosPagoSettings';
import { RecibosSettings } from '../settings/RecibosSettings';
import { AlertasSettings } from '../settings/AlertasSettings';
import { FidelizacionSettings } from '../settings/FidelizacionSettings';

type TabId = 'categorias' | 'clientes' | 'proveedores' | 'metodos-pago' | 'usuarios' | 'recibos' | 'impresoras' | 'alertas' | 'fidelizacion';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'categorias', label: 'Categorías', icon: Tag },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
    { id: 'metodos-pago', label: 'Métodos de pago', icon: CreditCard },
    { id: 'usuarios', label: 'Usuarios', icon: User },
    { id: 'recibos', label: 'Config. Recibos', icon: FileText },
    { id: 'impresoras', label: 'Impresoras', icon: Printer },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'fidelizacion', label: 'Fidelización', icon: Gift },
];

export const SettingsDrawer = () => {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'ADMIN';
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<TabId>('categorias');

    // Cerrar con Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Bloquear scroll del body cuando está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const activeTab = TABS.find(t => t.id === tab);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="settings-drawer-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Panel deslizable */}
            <div className={`settings-drawer-panel${isOpen ? ' open' : ''}`}>
                {/* Cabecera del panel */}
                <div className="settings-drawer-header">
                    <div className="settings-drawer-header-title">
                        <Settings size={20} />
                        <span>Configuración</span>
                    </div>
                    <button
                        className="settings-drawer-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar panel"
                    >
                        <X size={20} />
                    </button>
                </div>

                {!isAdmin ? (
                    <div className="settings-drawer-body">
                        <p style={{ color: 'var(--color-text-secondary)', padding: '16px' }}>
                            Solo los administradores pueden acceder a la configuración.
                        </p>
                    </div>
                ) : (
                    <div className="settings-drawer-content">
                        {/* Menú lateral de pestañas */}
                        <nav className="settings-drawer-nav">
                            {TABS.map(t => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        className={`settings-drawer-nav-item${tab === t.id ? ' active' : ''}`}
                                    >
                                        <Icon size={16} />
                                        <span>{t.label}</span>
                                        {tab === t.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Contenido de la pestaña activa */}
                        <div className="settings-drawer-body">
                            <h3 className="settings-drawer-section-title">
                                {activeTab && <activeTab.icon size={18} />}
                                {activeTab?.label}
                            </h3>

                            {tab === 'categorias' && <CategoriasSettings />}
                            {tab === 'clientes' && <ClientesSettings />}
                            {tab === 'proveedores' && <ProveedoresSettings />}
                            {tab === 'metodos-pago' && <MetodosPagoSettings />}
                            {tab === 'usuarios' && <UsuariosSettings />}
                            {tab === 'recibos' && <RecibosSettings />}
                            {tab === 'alertas' && <AlertasSettings />}
                            {tab === 'fidelizacion' && <FidelizacionSettings />}
                            {tab === 'impresoras' && (
                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    <p>Configuración de impresoras para:</p>
                                    <ul style={{ paddingLeft: '1.2rem', marginTop: '8px', lineHeight: 2 }}>
                                        <li>Tickets de venta (impresora térmica)</li>
                                        <li>Comprobantes en PDF</li>
                                    </ul>
                                    <p style={{ marginTop: '12px', fontSize: '0.8rem' }}>
                                        Selección de impresora por defecto disponible en próxima versión.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
