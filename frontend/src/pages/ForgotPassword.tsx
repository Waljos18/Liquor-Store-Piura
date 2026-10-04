import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wine, Mail, ArrowLeft } from 'lucide-react';
import { solicitarResetPassword } from '../api/api';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await solicitarResetPassword(email.trim());
            if (res.success) {
                setEnviado(true);
            } else {
                setError(res.error?.message || 'Error al procesar la solicitud');
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
                    {enviado ? (
                        <div className="text-center space-y-5">
                            <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto">
                                <Mail size={24} className="text-success" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-main tracking-tight">¡Correo enviado!</h2>
                                <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                                    Si <strong>{email}</strong> está registrado, recibirás el enlace de recuperación. Revisa tu carpeta de spam.
                                </p>
                            </div>
                            <Link to="/login" className="btn btn-outline w-full">
                                <ArrowLeft size={16} />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-text-main tracking-tight">Recuperar contraseña</h2>
                                <p className="text-text-secondary text-sm mt-1.5">
                                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-error-light border border-error/20 text-error text-sm">
                                    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary block">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                                        <input
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            className="input-field pl-9 w-full"
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary w-full h-11">
                                    {loading ? <span className="spinner" /> : 'Enviar enlace de recuperación'}
                                </button>
                            </form>

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
