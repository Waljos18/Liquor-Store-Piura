import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lightbulb, Plus, Tag, Edit, Trash2 } from 'lucide-react';

export const Promotions = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Promociones</h2>
                <div className="flex gap-2">
                    <Button variant="outline"><Lightbulb size={18} className="mr-2" /> Sugerencias IA</Button>
                    <Button><Plus size={18} className="mr-2" /> Nueva Promoción</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>PROMOCIONES ACTIVAS</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="border border-border rounded-lg p-4 flex justify-between items-start bg-surface">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg">Pack Fiesta</h3>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">Activa ✓</span>
                            </div>
                            <p className="text-text-secondary mb-1">Cerveza Pilsen x6 + Snacks x2 + Hielo x1</p>
                            <p className="font-medium">Precio: S/ 25.00 <span className="text-success text-sm">(Ahorro: S/ 5.00)</span></p>
                            <p className="text-xs text-text-secondary mt-1">Válido hasta: 31/01/2025</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            <Button variant="outline" size="sm" className="text-error">Desactivar</Button>
                        </div>
                    </div>

                    <div className="border border-border rounded-lg p-4 flex justify-between items-start bg-surface">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg">2x1 en Cervezas</h3>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">Activa ✓</span>
                            </div>
                            <p className="text-text-secondary mb-1">Lleva 2 cervezas, paga 1</p>
                            <p className="text-xs text-text-secondary mt-1">Válido hasta: 25/01/2025</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            <Button variant="outline" size="sm" className="text-error">Desactivar</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800"><Lightbulb size={24} /> SUGERENCIAS DE IA</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-900">
                    <p className="mb-4">💡 Basado en tus ventas, te sugerimos crear:</p>
                    <div className="bg-white p-4 rounded border border-blue-100 mb-4">
                        <h4 className="font-bold mb-2">"Pack Verano"</h4>
                        <ul className="list-disc list-inside mb-2 text-sm">
                            <li>Cerveza Pilsen x6</li>
                            <li>Hielo x2</li>
                        </ul>
                        <p className="font-medium">Precio sugerido: S/ 28.00</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm">Crear Promoción</Button>
                        <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">Descartar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
