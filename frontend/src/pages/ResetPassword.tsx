import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Wine, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '../api/api';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        if (!token) setError('El enlace de recuperación no es válido. Solicita uno nuevo.');
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
        if (password !== confirmar) { setError('Las contraseñas no coinciden.'); return; }
        setLoading(true);
        try {
            const res = await resetPassword(token, password);
            if (res.success) {
                setExito(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(res.error?.message || 'El enlace es inválido o ha expirado.');
            }
        } catch {
            setError('Error de conexión. Verifica que el servidor esté activo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <Wine size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-none tracking-tight text-text-main">Chilalo POS</p>
                        <p className="text-text-secondary text-xs mt-0.5">Licorería · Piura</p>
                    </div>
                </div>

                <div className="card p-8">
                    {exito ? (
                        <div className="text-center space-y-5">
                            <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto">
                                <CheckCircle size={24} className="text-success" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-main tracking-tight">¡Contraseña actualizada!</h2>
                                <p className="text-text-secondary text-sm mt-2">
                                    Tu contraseña fue restablecida. Serás redirigido al login en unos segundos.
                                </p>
                            </div>
                            <Link to="/login" className="btn btn-primary w-full">Ir al inicio de sesión</Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-text-main tracking-tight">Nueva contraseña</h2>
                                <p className="text-text-secondary text-sm mt-1.5">
                                    Crea una nueva contraseña segura para tu cuenta.
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-error-light border border-error/20 text-error text-sm">
                                    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    {error}
                                    {!token && (
                                        <Link to="/forgot-password" className="ml-1 underline font-semibold whitespace-nowrap">Solicitar nuevo →</Link>
                                    )}
                                </div>
                            )}

                            {token && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-secondary block">Nueva contraseña</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Mínimo 6 caracteres"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                autoComplete="new-password"
                                                className="input-field pl-9 pr-10 w-full"
                                            />
                                            <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main transition-colors">
                                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-secondary block">Confirmar contraseña</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                placeholder="Repite la contraseña"
                                                value={confirmar}
                                                onChange={e => setConfirmar(e.target.value)}
                                                required
                                                autoComplete="new-password"
                                                className="input-field pl-9 pr-10 w-full"
                                            />
                                            <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main transition-colors">
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="btn btn-primary w-full h-11">
                                        {loading ? <span className="spinner" /> : 'Restablecer contraseña'}
                                    </button>
                                </form>
                            )}

                            <div className="mt-5 text-center">
                                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors">
                                    <ArrowLeft size={14} />
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
