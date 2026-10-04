import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wine, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const result = await login(formData.username.trim(), formData.password);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left panel — brand */}
            <div className="hidden lg:flex lg:w-[46%] relative bg-[#0F172A] flex-col justify-between p-12 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                </div>

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <Wine size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-none tracking-tight">Chilalo POS</p>
                        <p className="text-white/40 text-xs mt-0.5">Sistema de Gestión</p>
                    </div>
                </div>

                {/* Center text */}
                <div className="relative space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-primary font-semibold tracking-wide">SISTEMA ACTIVO</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                        Gestión inteligente<br />
                        <span className="text-primary">para tu licorería</span>
                    </h1>
                    <p className="text-white/50 text-base leading-relaxed max-w-xs">
                        Ventas, inventario, reportes y más — todo en un solo lugar. Piura, Perú.
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-6 pt-2">
                        {[
                            { label: 'Módulos',     value: '14+' },
                            { label: 'Reportes',    value: 'Real-time' },
                            { label: 'Plataformas', value: 'Web + Android' },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-white font-bold text-xl tracking-tight">{s.value}</p>
                                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom credits */}
                <div className="relative">
                    <p className="text-white/25 text-xs">© 2026 Licorería Chilalo · Piura, Perú</p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
                <div className="w-full max-w-[400px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Wine size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg leading-none tracking-tight text-text-main">Chilalo POS</p>
                            <p className="text-text-secondary text-xs mt-0.5">Licorería · Piura</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Bienvenido de vuelta</h2>
                        <p className="text-text-secondary text-sm mt-1.5">Ingresa tus credenciales para continuar</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 p-3.5 mb-5 rounded-lg bg-error-light border border-error/20 text-error text-sm">
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary block">
                                Usuario
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="admin"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    autoComplete="username"
                                    className="input-field pl-9 w-full"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary block">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    autoComplete="current-password"
                                    className="input-field pl-9 pr-10 w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main transition-colors"
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot link */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-xs text-primary hover:text-primary-hover hover:underline font-medium transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2 h-11 text-base font-semibold"
                        >
                            {loading ? <span className="spinner" /> : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-text-tertiary mt-8">
                        Sistema POS/ERP · Licorería Chilalo · Piura
                    </p>
                </div>
            </div>
        </div>
    );
};
