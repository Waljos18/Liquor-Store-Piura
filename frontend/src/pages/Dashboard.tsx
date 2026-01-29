import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DollarSign, Package, AlertTriangle, ShoppingCart } from 'lucide-react';

const stats = [
    { label: 'Ventas Hoy', value: 'S/ 1,250', sub: '+15% vs ayer', icon: DollarSign, color: 'text-success' },
    { label: 'Productos', value: '245', sub: 'Activos', icon: Package, color: 'text-primary' },
    { label: 'Stock Bajo', value: '12', sub: 'Productos', icon: AlertTriangle, color: 'text-warning' },
    { label: 'Alertas', value: '3', sub: 'Pendientes', icon: ShoppingCart, color: 'text-error' },
];

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm text-text-secondary">{stat.label}</p>
                                <p className="text-2xl font-bold my-1">{stat.value}</p>
                                <p className={`text-xs ${stat.color}`}>{stat.sub}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-surface border border-border`}>
                                <stat.icon size={24} className={stat.color === 'text-success' ? 'text-green-500' : stat.color === 'text-primary' ? 'text-blue-500' : stat.color === 'text-warning' ? 'text-orange-500' : 'text-red-500'} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas de la Semana</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center bg-background rounded relative">
                        <p className="text-text-secondary">Gráfico de Ventas (Placeholder)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos Más Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">Cerveza Pilsen</p>
                                        <p className="text-sm text-text-secondary">45 unidades</p>
                                    </div>
                                    <span className="font-bold">S/ 180.00</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
