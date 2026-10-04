import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAlertasResumen, AlertasResumenDTO } from '../api/api';
import { useAuth } from './AuthContext';

interface NotificacionesContextType {
    alertas: AlertasResumenDTO | null;
    totalAlertas: number;
    nuevasAlertas: number;      // no vistas desde último clic en campana
    cargando: boolean;
    marcarVistas: () => void;
    refrescar: () => void;
}

const NotificacionesContext = createContext<NotificacionesContextType>({
    alertas: null,
    totalAlertas: 0,
    nuevasAlertas: 0,
    cargando: false,
    marcarVistas: () => {},
    refrescar: () => {},
});

const POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutos
const LAST_SEEN_KEY = 'notif_last_seen_count';

export const NotificacionesProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [alertas, setAlertas] = useState<AlertasResumenDTO | null>(null);
    const [cargando, setCargando] = useState(false);
    const [nuevasAlertas, setNuevasAlertas] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const cargar = useCallback(async () => {
        if (!isAuthenticated) return;
        setCargando(true);
        try {
            const res = await fetchAlertasResumen();
            if (res.success && res.data) {
                const data = res.data;
                setAlertas(data);

                // Calcular nuevas alertas comparando con el último total visto
                const lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY) || '0', 10);
                const diff = Math.max(0, data.totalAlertas - lastSeen);
                setNuevasAlertas(diff);
            }
        } catch {
            // silencioso — no interrumpe la UI
        } finally {
            setCargando(false);
        }
    }, [isAuthenticated]);

    const marcarVistas = useCallback(() => {
        if (alertas) {
            localStorage.setItem(LAST_SEEN_KEY, String(alertas.totalAlertas));
            setNuevasAlertas(0);
        }
    }, [alertas]);

    useEffect(() => {
        if (!isAuthenticated) return;
        cargar();
        intervalRef.current = setInterval(cargar, POLL_INTERVAL_MS);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAuthenticated, cargar]);

    return (
        <NotificacionesContext.Provider value={{
            alertas,
            totalAlertas: alertas?.totalAlertas ?? 0,
            nuevasAlertas,
            cargando,
            marcarVistas,
            refrescar: cargar,
        }}>
            {children}
        </NotificacionesContext.Provider>
    );
};

export const useNotificaciones = () => useContext(NotificacionesContext);
