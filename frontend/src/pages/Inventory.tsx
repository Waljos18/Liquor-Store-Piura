import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Plus, ShoppingCart, BarChart2 } from 'lucide-react';

export const Inventory = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Inventario</h2>
                <div className="flex gap-2">
                    <Button variant="outline"><BarChart2 size={18} className="mr-2" /> Reportes</Button>
                    <Button variant="outline"><Plus size={18} className="mr-2" /> Ajuste</Button>
                    <Button><ShoppingCart size={18} className="mr-2" /> Compra</Button>
                </div>
            </div>

            <Card className="bg-orange-50 border-orange-200">
                <CardContent className="flex flex-col gap-2 p-4 text-orange-800">
                    <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> ALERTAS DE INVENTARIO</h3>
                    <p>⚠️ 12 productos con stock bajo</p>
                    <p>⚠️ 3 productos próximos a vencer</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Productos con Stock Bajo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-2">Producto</th>
                                    <th className="py-2">Actual</th>
                                    <th className="py-2">Mín.</th>
                                    <th className="py-2">Faltante</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="py-2">Cerveza Cristal</td>
                                    <td className="py-2 text-red-600 font-bold">5</td>
                                    <td className="py-2">15</td>
                                    <td className="py-2">10</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-2">Ron Flor de Caña</td>
                                    <td className="py-2 text-red-600 font-bold">2</td>
                                    <td className="py-2">10</td>
                                    <td className="py-2">8</td>
                                </tr>
                            </tbody>
                        </table>
                        <Button className="w-full mt-4" variant="outline" size="sm">Generar Orden de Compra</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos Próximos a Vencer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-2">Producto</th>
                                    <th className="py-2">Vence</th>
                                    <th className="py-2">Días</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="py-2">Cerveza Pilsen</td>
                                    <td className="py-2">20/02/2025</td>
                                    <td className="py-2 text-warning font-bold">5</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-2">Snacks</td>
                                    <td className="py-2">22/02/2025</td>
                                    <td className="py-2 text-warning font-bold">7</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Movimientos Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-2">Fecha</th>
                                <th className="py-2">Producto</th>
                                <th className="py-2">Tipo</th>
                                <th className="py-2">Cant.</th>
                                <th className="py-2">Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="py-2">15/01 10:30</td>
                                <td className="py-2">Cerveza Pilsen</td>
                                <td className="py-2 text-red-600">SALIDA</td>
                                <td className="py-2">-2</td>
                                <td className="py-2">Admin</td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-2">15/01 09:15</td>
                                <td className="py-2">Ron Flor Caña</td>
                                <td className="py-2 text-green-600">ENTRADA</td>
                                <td className="py-2">+10</td>
                                <td className="py-2">Admin</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};
