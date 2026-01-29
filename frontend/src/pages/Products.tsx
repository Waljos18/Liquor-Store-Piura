import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const SAMPLE_PRODUCTS = [
    { id: 1, code: '7790310', name: 'Cerveza Pilsen', category: 'Cervezas', price: 'S/ 4.00', stock: 20 },
    { id: 2, code: '7790311', name: 'Cerveza Cristal', category: 'Cervezas', price: 'S/ 4.50', stock: 15 },
    { id: 3, code: '7790312', name: 'Ron Flor Caña', category: 'Ron', price: 'S/ 45.00', stock: 5 },
    { id: 4, code: '7790313', name: 'Whisky Chivas', category: 'Whiskies', price: 'S/ 120.00', stock: 3 },
    { id: 5, code: '7790314', name: 'Vino Tinto', category: 'Vinos', price: 'S/ 35.00', stock: 10 },
];

export const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Productos</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <Input
                            placeholder="Buscar..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <Button>
                        <Plus size={18} className="mr-2" />
                        Nuevo Producto
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {['Todas', 'Cervezas', 'Vinos', 'Licores', 'Stock Bajo'].map(filter => (
                    <Button key={filter} variant="outline" size="sm" className="whitespace-nowrap">
                        {filter}
                    </Button>
                ))}
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-background">
                                <th className="p-4 font-medium">Código</th>
                                <th className="p-4 font-medium">Nombre</th>
                                <th className="p-4 font-medium">Categoría</th>
                                <th className="p-4 font-medium">Precio</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SAMPLE_PRODUCTS.map((product) => (
                                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface">
                                    <td className="p-4">{product.code}</td>
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">{product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm"><Edit2 size={16} /></Button>
                                            <Button variant="ghost" size="sm" className="text-error"><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center text-sm text-text-secondary">
                <span>Mostrando 1-5 de 245 productos</span>
                <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>&lt;</Button>
                    <Button variant="primary" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">&gt;</Button>
                </div>
            </div>
        </div>
    );
};
