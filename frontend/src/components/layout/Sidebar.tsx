import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beer, Package, Tag, BarChart } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Productos', path: '/products', icon: Beer },
    { label: 'Inventario', path: '/inventory', icon: Package },
    { label: 'Promociones', path: '/promotions', icon: Tag },
    { label: 'Reportes', path: '/reports', icon: BarChart },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside className={clsx('sidebar', isOpen && 'open')}>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx('sidebar-link', isActive && 'active')
                            }
                            onClick={onClose} // Auto close on mobile nav
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};
