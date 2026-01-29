import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
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
        <div className="flex items-center justify-center p-4 bg-background h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Licorería Piura</CardTitle>
                    <p className="text-sm text-text-secondary mt-2">Ingresa tus credenciales para continuar</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <Input
                            label="Usuario"
                            placeholder="admin"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            autoComplete="username"
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" /> Recordar sesión
                            </label>
                            <a href="#" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>

                        <Button type="submit" variant="primary" className="w-full mt-4" isLoading={loading}>
                            Iniciar Sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
