import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Clock, TrendingDown, RefreshCw, Package } from 'lucide-react';
import { useNotificaciones } from '../../context/NotificacionesContext';

function tiempoRelativo(fechaStr: string): string {
    const diff = Date.now() - new Date(fechaStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'hace un momento';
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return `hace ${Math.floor(hrs / 24)}d`;
}

function diasParaVencer(fecha: string): number {
    return Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
}

export const NotificacionesPanel = () => {
    const navigate = useNavigate();
    const { alertas, totalAlertas, nuevasAlertas, cargando, marcarVistas, refrescar } = useNotificaciones();
    const [abierto, setAbierto] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setAbierto(false);
            }
        };
        if (abierto) document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [abierto]);

    const handleToggle = () => {
        if (!abierto) marcarVistas();
        setAbierto(prev => !prev);
    };

    const irAInventario = (tab?: string) => {
        setAbierto(false);
        navigate('/inventory' + (tab ? `?tab=${tab}` : ''));
    };

    const hayAlertas = totalAlertas > 0;
    const badgeCount = nuevasAlertas > 0 ? nuevasAlertas : (hayAlertas ? totalAlertas : 0);

    return (
        <div className="relative" ref={panelRef}>
            {/* Botón campanita */}
            <button
                onClick={handleToggle}
                title="Notificaciones"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg text-current hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
                <Bell size={20} className={hayAlertas ? 'text-orange-500' : ''} />
                {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                )}
            </button>

            {/* Panel dropdown */}
            {abierto && (
                <div className="absolute right-0 top-full mt-2 w-96 max-h-[520px] bg-surface border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
                    {/* Header panel */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-primary" />
                            <span className="font-semibold text-sm">Alertas de Inventario</span>
                            {totalAlertas > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                    {totalAlertas}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => { refrescar(); }}
                            title="Actualizar"
                            className="p-1 rounded hover:bg-border transition-colors"
                        >
                            <RefreshCw size={14} className={cargando ? 'animate-spin text-primary' : 'text-text-secondary'} />
                        </button>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="overflow-y-auto flex-1">
                        {/* Sin alertas */}
                        {!cargando && totalAlertas === 0 && (!alertas?.movimientosRecientes?.length) && (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-text-secondary">
                                <Bell size={32} className="opacity-30" />
                                <p className="text-sm">Todo en orden</p>
                                <p className="text-xs opacity-70">No hay alertas de inventario</p>
                            </div>
                        )}

                        {/* Sección: Stock Bajo */}
                        {(alertas?.stockBajo?.length ?? 0) > 0 && (
                            <section className="border-b border-border">
                                <button
                                    onClick={() => irAInventario('alertas')}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
                                >
                                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                        STOCK BAJO — {alertas!.stockBajo.length} producto{alertas!.stockBajo.length !== 1 ? 's' : ''}
                                    </span>
                                    <span className="ml-auto text-xs text-red-400">Ver →</span>
                                </button>
                                <ul>
                                    {alertas!.stockBajo.slice(0, 5).map(p => (
                                        <li
                                            key={p.id}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-border/40 cursor-pointer transition-colors"
                                            onClick={() => irAInventario('alertas')}
                                        >
                                            <TrendingDown size={14} className={p.stockActual <= 0 ? 'text-red-500' : 'text-orange-400'} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{p.nombre}</p>
                                                <p className="text-xs text-text-secondary">
                                                    Stock: <span className={`font-bold ${p.stockActual <= 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                                        {p.stockActual}
                                                    </span>
                                                    {p.stockMinimo != null && (
                                                        <> / mínimo {p.stockMinimo}</>
                                                    )}
                                                </p>
                                            </div>
                                            {p.stockActual <= 0 && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 flex-shrink-0">
                                                    AGOTADO
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                    {alertas!.stockBajo.length > 5 && (
                                        <li
                                            className="px-4 py-2 text-xs text-primary hover:underline cursor-pointer text-center"
                                            onClick={() => irAInventario('alertas')}
                                        >
                                            Ver {alertas!.stockBajo.length - 5} más →
                                        </li>
                                    )}
                                </ul>
                            </section>
                        )}

                        {/* Sección: Próximos a vencer */}
                        {(alertas?.proximosVencer?.length ?? 0) > 0 && (
                            <section className="border-b border-border">
                                <button
                                    onClick={() => irAInventario('alertas')}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-left"
                                >
                                    <Clock size={14} className="text-yellow-500 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                                        POR VENCER (7 días) — {alertas!.proximosVencer.length} producto{alertas!.proximosVencer.length !== 1 ? 's' : ''}
                                    </span>
                                    <span className="ml-auto text-xs text-yellow-500">Ver →</span>
                                </button>
                                <ul>
                                    {alertas!.proximosVencer.slice(0, 4).map(p => {
                                        const dias = p.fechaVencimiento ? diasParaVencer(p.fechaVencimiento) : 0;
                                        return (
                                            <li
                                                key={p.id}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-border/40 cursor-pointer transition-colors"
                                                onClick={() => irAInventario('alertas')}
                                            >
                                                <Clock size={14} className="text-yellow-500 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{p.nombre}</p>
                                                    <p className="text-xs text-text-secondary">
                                                        Vence: {p.fechaVencimiento}
                                                    </p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                                    dias <= 2
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {dias}d
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}

                        {/* Sección: Movimientos recientes */}
                        {(alertas?.movimientosRecientes?.length ?? 0) > 0 && (
                            <section>
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20">
                                    <Package size={14} className="text-blue-500" />
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                        MOVIMIENTOS RECIENTES (48h)
                                    </span>
                                </div>
                                <ul>
                                    {alertas!.movimientosRecientes.map(m => {
                                        const tipo = m.tipoMovimiento ?? '';
                                        const colorTipo =
                                            tipo === 'ENTRADA' ? 'text-green-600 bg-green-100' :
                                            tipo === 'SALIDA' ? 'text-red-600 bg-red-100' :
                                            tipo === 'VENTA_SALIDA' ? 'text-orange-600 bg-orange-100' :
                                            'text-blue-600 bg-blue-100';
                                        return (
                                            <li
                                                key={m.id}
                                                className="flex items-start gap-3 px-4 py-2.5 hover:bg-border/40 cursor-pointer transition-colors"
                                                onClick={() => irAInventario('movimientos')}
                                            >
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${colorTipo}`}>
                                                    {tipo.replace('_', ' ')}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {m.producto?.nombre ?? 'Producto'}
                                                    </p>
                                                    <p className="text-xs text-text-secondary">
                                                        Cant: <span className="font-semibold">{m.cantidad}</span>
                                                        {m.motivo && <> · {m.motivo}</>}
                                                    </p>
                                                </div>
                                                <span className="text-[11px] text-text-secondary flex-shrink-0 mt-0.5">
                                                    {tiempoRelativo(m.fecha)}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border px-4 py-2.5 bg-surface">
                        <button
                            onClick={() => irAInventario()}
                            className="w-full text-center text-xs text-primary hover:underline font-medium"
                        >
                            Ir a Inventario →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
