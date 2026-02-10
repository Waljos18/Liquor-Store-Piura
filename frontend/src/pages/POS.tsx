import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  buscarProductos,
  crearVenta,
  fetchCategorias,
  fetchClientes,
  type ProductoDTO,
  type CrearVentaItem,
  type ClienteDTO,
} from '../api/api';

type FormaPago = 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN' | 'MIXTO';

interface CartItem {
  producto?: ProductoDTO;
  packId?: number;
  packNombre?: string;
  cantidad: number;
  precioUnitario: number;
}

const FORMAS_PAGO: { value: FormaPago; label: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'MIXTO', label: 'Mixto' },
];

const IGV = 0.18;

export const POS = () => {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [clienteSearch, setClienteSearch] = useState('');
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [formaPago, setFormaPago] = useState<FormaPago>('EFECTIVO');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [resultado, setResultado] = useState<{ numeroVenta: string; total: number; vuelto?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showClienteSearch, setShowClienteSearch] = useState(false);
  const clienteSearchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtotal = cart.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  const impuesto = subtotal * IGV;
  const total = subtotal + impuesto;
  const vuelto = formaPago === 'EFECTIVO' && montoRecibido ? Math.max(0, parseFloat(montoRecibido) - total) : 0;

  const loadProductos = useCallback(async () => {
    if (search.length < 2) {
      setProductos([]);
      return;
    }
    const res = await buscarProductos(search);
    if (res.success && res.data) setProductos(res.data);
    else setProductos([]);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadProductos, 200);
    return () => clearTimeout(t);
  }, [loadProductos]);

  useEffect(() => {
    if (clienteSearch.length < 2) {
      setClientes([]);
      return;
    }
    if (clienteSearchDebounce.current) clearTimeout(clienteSearchDebounce.current);
    clienteSearchDebounce.current = setTimeout(async () => {
      const res = await fetchClientes(clienteSearch);
      if (res.success && res.data?.content) setClientes(res.data.content);
      else setClientes([]);
    }, 250);
    return () => {
      if (clienteSearchDebounce.current) clearTimeout(clienteSearchDebounce.current);
    };
  }, [clienteSearch]);

  const addToCart = (p: ProductoDTO) => {
    if (p.stockActual < 1) {
      setError('Sin stock disponible');
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.producto?.id === p.id && !c.packId);
      if (idx >= 0) {
        const copy = [...prev];
        if (copy[idx].cantidad >= p.stockActual) return prev;
        copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + 1 };
        return copy;
      }
      return [...prev, { producto: p, cantidad: 1, precioUnitario: p.precioVenta }];
    });
    setSearch('');
    setProductos([]);
    setError(null);
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const c = copy[idx];
      const nueva = c.cantidad + delta;
      if (nueva < 1) {
        copy.splice(idx, 1);
        return copy;
      }
      const maxStock = c.producto?.stockActual ?? 999;
      if (nueva > maxStock) return prev;
      copy[idx] = { ...c, cantidad: nueva };
      return copy;
    });
  };

  const removeFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const finalizarVenta = async () => {
    if (cart.length === 0) {
      setError('Agregue al menos un producto');
      return;
    }

    const items: CrearVentaItem[] = cart.map((c) => {
      const item: CrearVentaItem = { cantidad: c.cantidad, precioUnitario: c.precioUnitario };
      if (c.packId) item.packId = c.packId;
      else if (c.producto?.id) item.productoId = c.producto.id;
      return item;
    });

    const body: Parameters<typeof crearVenta>[0] = {
      items,
      formaPago,
      clienteId: cliente?.id,
    };

    if (formaPago === 'EFECTIVO' && montoRecibido) {
      body.montoRecibido = parseFloat(montoRecibido);
    }

    setLoading(true);
    setError(null);
    const res = await crearVenta(body);
    setLoading(false);

    if (res.success && res.data) {
      setResultado({
        numeroVenta: res.data.numeroVenta,
        total: res.data.total,
        vuelto: res.data.vuelto ?? undefined,
      });
      setCart([]);
      setMontoRecibido('');
    } else {
      setError(res.error?.message ?? 'Error al registrar la venta');
    }
  };

  const nuevaVenta = () => {
    setResultado(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingCart size={28} /> Punto de Venta
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Búsqueda y productos */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded bg-surface"
                  autoFocus
                />
              </div>
            </CardContent>
          </Card>

          {productos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {productos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="p-3 border border-border rounded hover:bg-background text-left"
                    >
                      <p className="font-medium truncate">{p.nombre}</p>
                      <p className="text-sm text-primary font-bold">S/ {p.precioVenta?.toFixed(2)}</p>
                      <p className="text-xs text-text-secondary">Stock: {p.stockActual}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Carrito ({cart.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {cart.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{item.producto?.nombre ?? item.packNombre ?? 'Item'}</p>
                        <p className="text-sm text-text-secondary">S/ {item.precioUnitario.toFixed(2)} x {item.cantidad}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(idx, -1)} className="p-1 rounded hover:bg-background">
                          <Minus size={18} />
                        </button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <button onClick={() => updateQty(idx, 1)} className="p-1 rounded hover:bg-background">
                          <Plus size={18} />
                        </button>
                        <button onClick={() => removeFromCart(idx)} className="p-1 rounded hover:bg-red-100 text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de pago */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Venta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-text-secondary text-sm">Subtotal</p>
              <p className="text-lg font-bold">S/ {subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">IGV (18%)</p>
              <p className="text-lg">S/ {impuesto.toFixed(2)}</p>
            </div>
            <div className="border-t border-border pt-2">
              <p className="text-text-secondary text-sm">Total</p>
              <p className="text-2xl font-bold text-primary">S/ {total.toFixed(2)}</p>
            </div>

            {!resultado && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Cliente (opcional)</p>
                  {!cliente ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowClienteSearch(true)}
                        className="w-full text-left px-3 py-2 border border-border rounded text-text-secondary text-sm"
                      >
                        Buscar cliente...
                      </button>
                      {showClienteSearch && (
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Nombre o documento..."
                            value={clienteSearch}
                            onChange={(e) => setClienteSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded text-sm"
                            autoFocus
                          />
                          {clientes.length > 0 && (
                            <ul className="border border-border rounded max-h-32 overflow-y-auto">
                              {clientes.map((c) => (
                                <li key={c.id}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCliente(c);
                                      setClienteSearch('');
                                      setClientes([]);
                                      setShowClienteSearch(false);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-background text-sm"
                                  >
                                    {c.nombre} {c.numeroDocumento ? `(${c.numeroDocumento})` : ''}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                          <Button variant="outline" size="sm" onClick={() => { setShowClienteSearch(false); setClienteSearch(''); setClientes([]); }}>
                            Cerrar
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center px-3 py-2 border border-border rounded bg-background">
                      <span className="text-sm">{cliente.nombre}</span>
                      <button
                        type="button"
                        onClick={() => setCliente(null)}
                        className="text-text-secondary hover:text-primary text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Forma de pago</p>
                  <div className="flex flex-wrap gap-2">
                    {FORMAS_PAGO.map((fp) => (
                      <button
                        key={fp.value}
                        onClick={() => setFormaPago(fp.value)}
                        className={`px-3 py-1.5 rounded text-sm border ${
                          formaPago === fp.value ? 'bg-primary text-white border-primary' : 'border-border hover:bg-background'
                        }`}
                      >
                        {fp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formaPago === 'EFECTIVO' && (
                  <div>
                    <label className="text-sm font-medium">Monto recibido</label>
                    <input
                      type="number"
                      step="0.01"
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-border rounded"
                      placeholder="0.00"
                    />
                    {vuelto > 0 && (
                      <p className="mt-1 text-success font-bold">Vuelto: S/ {vuelto.toFixed(2)}</p>
                    )}
                  </div>
                )}

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button
                  onClick={finalizarVenta}
                  disabled={loading || cart.length === 0}
                  className="w-full py-3"
                >
                  {loading ? 'Procesando...' : 'FINALIZAR VENTA'}
                </Button>
              </>
            )}

            {resultado && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="font-bold text-green-800">Venta registrada</p>
                <p className="text-sm">N° {resultado.numeroVenta}</p>
                <p className="font-bold">Total: S/ {resultado.total.toFixed(2)}</p>
                {resultado.vuelto != null && resultado.vuelto > 0 && (
                  <p className="font-bold">Vuelto: S/ {resultado.vuelto.toFixed(2)}</p>
                )}
                <Button onClick={nuevaVenta} variant="outline" className="mt-3">
                  Nueva venta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
