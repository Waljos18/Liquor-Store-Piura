import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Mail, TrendingUp, Package } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Reports = () => {
    // Placeholder for chart data to likely avoid dependency issues if npm failed
    // const data = ...

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Reportes</h2>
                <div className="flex gap-2">
                    <div className="flex bg-surface rounded border border-border overflow-hidden">
                        <button className="px-3 py-1 text-sm bg-primary text-white">Hoy</button>
                        <button className="px-3 py-1 text-sm hover:bg-background">Semana</button>
                        <button className="px-3 py-1 text-sm hover:bg-background">Mes</button>
                    </div>
                    <Button variant="outline"><Download size={18} className="mr-2" /> Exportar</Button>
                    <Button variant="outline"><Mail size={18} className="mr-2" /> Email</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>RESUMEN DE VENTAS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-background rounded border border-border text-center">
                            <p className="text-text-secondary text-sm">Total Ventas</p>
                            <p className="text-2xl font-bold text-primary">S/ 8,500.00</p>
                        </div>
                        <div className="p-4 bg-background rounded border border-border text-center">
                            <p className="text-text-secondary text-sm">Transacciones</p>
                            <p className="text-2xl font-bold">125</p>
                        </div>
                        <div className="p-4 bg-background rounded border border-border text-center">
                            <p className="text-text-secondary text-sm">Ticket Promedio</p>
                            <p className="text-2xl font-bold">S/ 68.00</p>
                        </div>
                    </div>
                    <div className="h-64 bg-background rounded border border-border flex items-center justify-center">
                        <p className="text-text-secondary">[Gráfico de barras - Ventas por día]</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Ventas por Categoría</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                        [Gráfico Circular]
                        {/* Implementing charts without working deps can be risky, keeping text placeholder */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Ventas por Forma de Pago</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                        [Gráfico Circular]
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>TOP 10 PRODUCTOS MÁS VENDIDOS</CardTitle></CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-2">#</th>
                                <th className="py-2">Producto</th>
                                <th className="py-2">Cantidad</th>
                                <th className="py-2">Total Ventas</th>
                                <th className="py-2">% Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="py-2">1</td>
                                <td className="py-2">Cerveza Pilsen</td>
                                <td className="py-2">145</td>
                                <td className="py-2">S/ 580.00</td>
                                <td className="py-2">6.8%</td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-2">2</td>
                                <td className="py-2">Ron Flor Caña</td>
                                <td className="py-2">89</td>
                                <td className="py-2">S/ 4,005.00</td>
                                <td className="py-2">47.1%</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center gap-2"><TrendingUp /> PREDICCIONES DE IA</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-900">
                    <div className="mb-4">
                        <p className="font-bold flex items-center gap-2">📈 Predicción de Ventas Próxima Semana:</p>
                        <p>Se esperan ventas de <span className="font-bold">S/ 9,200.00</span> (+8.2% vs semana actual)</p>
                    </div>
                    <div>
                        <p className="font-bold mb-2 flex items-center gap-2"><Package size={16} /> Productos que se agotarán:</p>
                        <ul className="list-disc list-inside text-sm">
                            <li>Cerveza Pilsen: en 3 días</li>
                            <li>Ron Flor de Caña: en 5 días</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
