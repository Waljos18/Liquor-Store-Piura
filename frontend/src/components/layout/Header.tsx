import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Moon, Sun, Wine } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificacionesPanel } from './NotificacionesPanel';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        const dark = saved === 'dark';
        if (dark) document.documentElement.setAttribute('data-theme', 'dark');
        return dark;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.rol === 'ADMIN';

    return (
        <header className="header">
            <div className="header-left">
                <button
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} />
                </button>

                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="hidden md:flex w-8 h-8 bg-primary rounded-lg items-center justify-center flex-shrink-0">
                        <Wine size={16} className="text-white" />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="header-title">
                            Chilalo <span>POS</span>
                        </h1>
                        <p className="text-[11px] text-text-secondary leading-none mt-0.5">Licorería · Piura</p>
                    </div>
                    {/* Mobile title */}
                    <h1 className="md:hidden header-title">Chilalo</h1>
                </div>
            </div>

            <div className="header-right">
                {/* Theme toggle */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    title={isDark ? 'Modo claro' : 'Modo oscuro'}
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
                >
                    {isDark
                        ? <Sun size={18} className="text-amber-400" />
                        : <Moon size={18} />
                    }
                </button>

                {/* Notifications bell */}
                <NotificacionesPanel />

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* User info */}
                <div className="user-info gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-primary" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold leading-none text-text-main">
                            {user?.nombre || user?.username || 'Usuario'}
                        </p>
                        <p className="text-[11px] leading-none mt-0.5">
                            <span className={`font-medium ${isAdmin ? 'text-primary' : 'text-secondary'}`}>
                                {isAdmin ? 'Administrador' : 'Vendedor'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/8 transition-all text-sm font-medium"
                    aria-label="Cerrar sesión"
                >
                    <LogOut size={16} />
                    <span className="hidden md:inline">Salir</span>
                </button>
            </div>
        </header>
    );
};
