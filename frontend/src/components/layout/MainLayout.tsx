import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SettingsDrawer } from './SettingsDrawer';
import { useAuth } from '../../context/AuthContext';
import { NotificacionesProvider, useNotificaciones } from '../../context/NotificacionesContext';
import { AlertTriangle, X } from 'lucide-react';

function StockBajoToast() {
    const { alertas } = useNotificaciones();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [count, setCount] = useState(0);
    const shown = useRef(false);

    useEffect(() => {
        if (!shown.current && alertas && alertas.stockBajo.length > 0) {
            shown.current = true;
            setCount(alertas.stockBajo.length);
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 7000);
            return () => clearTimeout(t);
        }
    }, [alertas]);

    if (!visible) return null;

    return (
        <div className="toast-slide-in fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-red-600 text-white rounded-xl shadow-2xl px-4 py-3.5 max-w-xs">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="font-semibold text-sm leading-tight">
                    {count} producto{count !== 1 ? 's' : ''} con stock bajo
                </p>
                <button
                    onClick={() => { setVisible(false); navigate('/inventory?tab=alertas'); }}
                    className="text-xs text-red-100 hover:text-white underline mt-0.5"
                >
                    Ver alertas →
                </button>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="text-red-200 hover:text-white flex-shrink-0 ml-1"
                aria-label="Cerrar"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onSessionInvalid = () => {
            logout();
            navigate('/login', { replace: true });
        };
        window.addEventListener('auth:session-invalid', onSessionInvalid);
        return () => window.removeEventListener('auth:session-invalid', onSessionInvalid);
    }, [logout, navigate]);

    return (
        <NotificacionesProvider>
            <div className="layout">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="layout-body">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                    <main className="main-content">
                        <div className="container">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <SettingsDrawer />
                <StockBajoToast />
            </div>
        </NotificacionesProvider>
    );
};
