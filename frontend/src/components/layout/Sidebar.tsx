import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Beer, Package, Tag, BarChart, ShoppingCart,
    FileText, Settings, Users, BrainCircuit, DollarSign, Truck,
    CreditCard, TrendingDown, Wine, RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_SECTIONS = [
    {
        label: 'Principal',
        items: [
            { label: 'Dashboard',      path: '/dashboard',     icon: LayoutDashboard, adminOnly: false },
            { label: 'Punto de Venta', path: '/pos',           icon: ShoppingCart,    adminOnly: false },
            { label: 'Caja',           path: '/cierre-caja',   icon: DollarSign,      adminOnly: false },
        ],
    },
    {
        label: 'Catálogo',
        items: [
            { label: 'Productos',   path: '/products',   icon: Beer,    adminOnly: false },
            { label: 'Inventario',  path: '/inventory',  icon: Package, adminOnly: false },
            { label: 'Promociones', path: '/promotions', icon: Tag,     adminOnly: false },
        ],
    },
    {
        label: 'Operaciones',
        items: [
            { label: 'Ventas',          path: '/ventas',         icon: FileText,    adminOnly: false },
            { label: 'Devoluciones',    path: '/devoluciones',   icon: RotateCcw,   adminOnly: false },
            { label: 'Compras',         path: '/compras',        icon: Truck,       adminOnly: true  },
            { label: 'Fiado / Crédito', path: '/cuentas-cobrar', icon: CreditCard,  adminOnly: false },
            { label: 'Gastos',          path: '/gastos',         icon: TrendingDown, adminOnly: true },
            { label: 'Clientes',        path: '/clientes',       icon: Users,       adminOnly: false },
        ],
    },
    {
        label: 'Análisis',
        items: [
            { label: 'Reportes',     path: '/reports', icon: BarChart,    adminOnly: true  },
            { label: 'Asistente IA', path: '/ia',      icon: BrainCircuit, adminOnly: false },
        ],
    },
    {
        label: 'Sistema',
        items: [
            { label: 'Configuración', path: '/settings', icon: Settings, adminOnly: true },
        ],
    },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'ADMIN';

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside className={clsx('sidebar', isOpen && 'open')} aria-label="Navegación principal">
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Wine size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="sidebar-logo-text">Chilalo POS</div>
                        <div className="sidebar-logo-sub">Licorería · Piura</div>
                    </div>
                </div>

                {/* Nav sections */}
                <nav className="sidebar-nav">
                    {NAV_SECTIONS.map((section) => {
                        const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin);
                        if (visibleItems.length === 0) return null;
                        return (
                            <div key={section.label}>
                                <div className="sidebar-section-label">{section.label}</div>
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            clsx('sidebar-link', isActive && 'active')
                                        }
                                        onClick={onClose}
                                    >
                                        <item.icon size={17} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer versión */}
                <div className="px-4 py-3 border-t border-white/5">
                    <p className="text-[11px] text-white/20 font-medium">v1.0.0 · Sprint 3</p>
                </div>
            </aside>
        </>
    );
};
