import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Search, Trash2, Plus, Minus, ShoppingCart, Tag, CheckCircle,
  ChevronRight, X, Receipt, FileText, PercentIcon, Gift, ChevronDown, ChevronUp,
  Bot, Sparkles, Loader2,
} from 'lucide-react';
import {
  buscarProductos,
  buscarPacks,
  crearVenta,
  fetchClientes,
  fetchCategorias,
  fetchProductos,
  fetchPromociones,
  emitirBoleta,
  emitirFactura,
  fetchFidelizacionConfig,
  iaUpsell,
  type ProductoDTO,
  type PackDTO,
  type PromocionDTO,
  type CrearVentaItem,
  type ClienteDTO,
  type CategoriaDTO,
  type ConfigFidelizacionDTO,
  type UpsellSugerencia,
} from '../api/api';

type FormaPago = 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN' | 'MIXTO' | 'CREDITO';

interface CartItem {
  producto?: ProductoDTO;
  packId?: number;
  packNombre?: string;
  packProductos?: { productoNombre: string; cantidad: number }[];
  cantidad: number;
  precioUnitario: number;
}

const FORMAS_PAGO: { value: FormaPago; label: string; color: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'TARJETA', label: 'Tarjeta', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'YAPE', label: 'Yape', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'PLIN', label: 'Plin', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { value: 'MIXTO', label: 'Mixto', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'CREDITO', label: 'Crédito/Fiado', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
];

const IGV = 0.18;

interface PostVentaData {
  numeroVenta: string;
  total: number;
  vuelto?: number;
  ventaId: number;
}

interface BoletaForm {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
}

interface FacturaForm {
  numeroDocumento: string;
  razonSocial: string;
}

export const POS = () => {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [packs, setPacks] = useState<PackDTO[]>([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [loadingCat, setLoadingCat] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promociones, setPromociones] = useState<PromocionDTO[]>([]);
  const [showPromociones, setShowPromociones] = useState(false);
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [clienteSearch, setClienteSearch] = useState('');
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [formaPago, setFormaPago] = useState<FormaPago>('EFECTIVO');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [montoMixto1, setMontoMixto1] = useState('');
  const [formaPagoMixto1, setFormaPagoMixto1] = useState<string>('EFECTIVO');
  const [formaPagoMixto2, setFormaPagoMixto2] = useState<string>('YAPE');
  const [fechaVencimientoCredito, setFechaVencimientoCredito] = useState('');
  const [configFidelizacion, setConfigFidelizacion] = useState<ConfigFidelizacionDTO | null>(null);
  const [puntosACanjear, setPuntosACanjear] = useState('');
  const [puntosAplicados, setPuntosAplicados] = useState(0);
  const [aplicarIgv, setAplicarIgv] = useState(true);
  const [descuento, setDescuento] = useState('');
  const [descuentoTipo, setDescuentoTipo] = useState<'porcentaje' | 'monto'>('porcentaje');
  const [postVenta, setPostVenta] = useState<PostVentaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showClienteSearch, setShowClienteSearch] = useState(false);
  const clienteDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Post-venta: boleta/factura
  const [showBoletaModal, setShowBoletaModal] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [boletaForm, setBoletaForm] = useState<BoletaForm>({ tipoDocumento: '1', numeroDocumento: '', nombre: '' });
  const [facturaForm, setFacturaForm] = useState<FacturaForm>({ numeroDocumento: '', razonSocial: '' });
  const [comprobanteLoading, setComprobanteLoading] = useState(false);
  const [comprobanteError, setComprobanteError] = useState<string | null>(null);
  const [comprobanteOk, setComprobanteOk] = useState<string | null>(null);

  // IA Upsell
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellLoading, setUpsellLoading] = useState(false);
  const [upsellSugerencias, setUpsellSugerencias] = useState<UpsellSugerencia[]>([]);
  const [upsellError, setUpsellError] = useState<string | null>(null);

  // Descuento por promoción por ítem (replica la lógica del backend: mejor descuento)
  const calcularDescuentoPromo = (item: CartItem): number => {
    if (!item.producto || promociones.length === 0) return 0;
    let maxDesc = 0;
    for (const promo of promociones) {
      const pp = promo.productos?.find((p) => p.producto?.id === item.producto!.id);
      if (!pp) continue;
      if (item.cantidad < (pp.cantidadMinima ?? 1)) continue;
      let desc = 0;
      if (promo.tipo === 'DESCUENTO_PORCENTAJE' && promo.descuentoPorcentaje != null) {
        desc = item.precioUnitario * (promo.descuentoPorcentaje / 100) * item.cantidad;
      } else if (promo.tipo === 'DESCUENTO_MONTO' && promo.descuentoMonto != null) {
        desc = promo.descuentoMonto * item.cantidad;
      }
      if (desc > maxDesc) maxDesc = desc;
    }
    return maxDesc;
  };

  // Cálculos
  const subtotalBruto = cart.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  const descuentoPromoTotal = cart.reduce((s, i) => s + calcularDescuentoPromo(i), 0);
  const descuentoNum = parseFloat(descuento) || 0;
  const descuentoManual = descuentoTipo === 'porcentaje'
    ? (subtotalBruto - descuentoPromoTotal) * (descuentoNum / 100)
    : Math.min(descuentoNum, subtotalBruto - descuentoPromoTotal);
  // Descuento por canje de puntos
  const descuentoPorPuntos = puntosAplicados > 0 && configFidelizacion
    ? puntosAplicados / configFidelizacion.puntosPorSolDescuento
    : 0;
  const descuentoMonto = descuentoPromoTotal + descuentoManual;
  const subtotal = subtotalBruto - descuentoMonto - descuentoPorPuntos;
  const impuesto = aplicarIgv ? subtotal * IGV : 0;
  const total = subtotal + impuesto;
  const vuelto = formaPago === 'EFECTIVO' && montoRecibido
    ? Math.max(0, parseFloat(montoRecibido) - total)
    : 0;
  const montoMixto2 = total - (parseFloat(montoMixto1) || 0);

  // Carga de categorías, promociones y config de fidelización
  useEffect(() => {
    fetchCategorias(true).then((res) => {
      if (res.success && res.data) setCategorias(res.data);
    });
    fetchPromociones({ soloActivas: true, size: 50 }).then((res) => {
      if (res.success && res.data?.content) setPromociones(res.data.content);
    });
    fetchFidelizacionConfig().then((res) => {
      if (res.success && res.data) setConfigFidelizacion(res.data);
    });
  }, []);

  // Carga de productos por categoría
  useEffect(() => {
    if (selectedCategoria == null) {
      setProductosPorCategoria([]);
      return;
    }
    setLoadingCat(true);
    fetchProductos({ categoriaId: selectedCategoria, size: 30 }).then((res) => {
      setLoadingCat(false);
      if (res.success && res.data?.content) setProductosPorCategoria(res.data.content);
      else setProductosPorCategoria([]);
    });
  }, [selectedCategoria]);

  // Búsqueda de productos
  const loadProductos = useCallback(async () => {
    if (search.length < 2) {
      setProductos([]);
      setPacks([]);
      return;
    }
    const [prodRes, packRes] = await Promise.all([
      buscarProductos(search),
      buscarPacks(search),
    ]);
    if (prodRes.success && prodRes.data) setProductos(prodRes.data);
    else setProductos([]);
    if (packRes.success && packRes.data) setPacks(packRes.data);
    else setPacks([]);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadProductos, 200);
    return () => clearTimeout(t);
  }, [loadProductos]);

  // Búsqueda de clientes
  useEffect(() => {
    if (clienteSearch.length < 2) { setClientes([]); return; }
    if (clienteDebounce.current) clearTimeout(clienteDebounce.current);
    clienteDebounce.current = setTimeout(async () => {
      const res = await fetchClientes({ search: clienteSearch });
      if (res.success && res.data?.content) setClientes(res.data.content);
      else setClientes([]);
    }, 250);
    return () => { if (clienteDebounce.current) clearTimeout(clienteDebounce.current); };
  }, [clienteSearch]);

  const addToCart = (p: ProductoDTO) => {
    if (p.stockActual < 1) { setError('Sin stock disponible'); return; }
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
    setPacks([]);
    setError(null);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const addPackToCart = (pack: PackDTO) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.packId === pack.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + 1 };
        return copy;
      }
      const packProductos = pack.productos?.map((pp) => ({
        productoNombre: pp.producto?.nombre ?? 'Producto',
        cantidad: pp.cantidad,
      })) ?? [];
      return [...prev, {
        packId: pack.id,
        packNombre: pack.nombre,
        packProductos,
        cantidad: 1,
        precioUnitario: pack.precioPack ?? 0,
      }];
    });
    setSearch('');
    setProductos([]);
    setPacks([]);
    setError(null);
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const c = copy[idx];
      const nueva = c.cantidad + delta;
      if (nueva < 1) { copy.splice(idx, 1); return copy; }
      const maxStock = c.producto?.stockActual ?? 999;
      if (nueva > maxStock) return prev;
      copy[idx] = { ...c, cantidad: nueva };
      return copy;
    });
  };

  const setQtyDirect = (idx: number, val: number) => {
    if (isNaN(val) || val < 1) return;
    setCart((prev) => {
      const copy = [...prev];
      const c = copy[idx];
      const maxStock = c.producto?.stockActual ?? 999;
      copy[idx] = { ...c, cantidad: Math.min(val, maxStock) };
      return copy;
    });
  };

  const removeFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const finalizarVenta = async () => {
    if (cart.length === 0) { setError('Agregue al menos un producto'); return; }
    if (formaPago === 'CREDITO' && !cliente) { setError('La venta a crédito requiere seleccionar un cliente'); return; }
    if (puntosAplicados > 0 && !cliente) { setError('Se requiere cliente para canjear puntos'); return; }
    if (puntosAplicados > 0 && cliente && puntosAplicados > (cliente.puntosFidelizacion ?? 0)) {
      setError(`El cliente solo tiene ${cliente.puntosFidelizacion ?? 0} puntos disponibles`);
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
      aplicarIgv,
      // Solo se envía el descuento manual; el backend aplica las promociones por producto automáticamente
      descuento: descuentoManual > 0 ? descuentoManual : undefined,
    };

    if (formaPago === 'EFECTIVO') {
      const monto = parseFloat(montoRecibido);
      if (!montoRecibido || isNaN(monto)) {
        setError('Ingrese el monto recibido del cliente');
        return;
      }
      if (monto < total) {
        setError(`Monto insuficiente: el cliente debe pagar S/ ${total.toFixed(2)} pero recibió S/ ${monto.toFixed(2)}`);
        return;
      }
      body.montoRecibido = monto;
    }

    if (formaPago === 'MIXTO') {
      const m1 = parseFloat(montoMixto1) || 0;
      const m2 = Math.max(0, total - m1);
      body.pagosMixtos = [
        { metodo: formaPagoMixto1, monto: m1 },
        { metodo: formaPagoMixto2, monto: m2 },
      ];
    }

    if (formaPago === 'CREDITO' && fechaVencimientoCredito) {
      body.fechaVencimientoCredito = fechaVencimientoCredito;
    }

    if (puntosAplicados > 0) {
      body.puntosCanjeados = puntosAplicados;
    }

    setLoading(true);
    setError(null);
    const res = await crearVenta(body);
    setLoading(false);

    if (res.success && res.data) {
      setPostVenta({
        numeroVenta: res.data.numeroVenta,
        total: res.data.total,
        vuelto: res.data.vuelto ?? undefined,
        ventaId: res.data.id,
      });
      setCart([]);
      setMontoRecibido('');
      setDescuento('');
      setFechaVencimientoCredito('');
      setPuntosACanjear('');
      setPuntosAplicados(0);
      setCliente(null);
      setBoletaForm({ tipoDocumento: '1', numeroDocumento: cliente?.numeroDocumento ?? '', nombre: cliente?.nombre ?? '' });
      setFacturaForm({ numeroDocumento: cliente?.numeroDocumento ?? '', razonSocial: cliente?.nombre ?? '' });
    } else {
      setError(res.error?.message ?? 'Error al registrar la venta');
    }
  };

  const nuevaVenta = () => {
    setPostVenta(null);
    setComprobanteOk(null);
    setComprobanteError(null);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleEmitirBoleta = async () => {
    if (!postVenta) return;
    if (!boletaForm.numeroDocumento.trim() || !boletaForm.nombre.trim()) {
      setComprobanteError('Complete número de documento y nombre');
      return;
    }
    setComprobanteLoading(true);
    setComprobanteError(null);
    const res = await emitirBoleta({
      ventaId: postVenta.ventaId,
      tipoDocumento: boletaForm.tipoDocumento,
      numeroDocumento: boletaForm.numeroDocumento.trim(),
      nombre: boletaForm.nombre.trim(),
    });
    setComprobanteLoading(false);
    if (res.success && res.data) {
      setComprobanteOk(`Boleta ${res.data.serie}-${res.data.numero} generada`);
      setShowBoletaModal(false);
    } else {
      setComprobanteError(res.error?.message ?? 'Error al emitir boleta');
    }
  };

  const handleEmitirFactura = async () => {
    if (!postVenta) return;
    if (!facturaForm.numeroDocumento.trim() || !facturaForm.razonSocial.trim()) {
      setComprobanteError('Complete RUC y razón social');
      return;
    }
    setComprobanteLoading(true);
    setComprobanteError(null);
    const res = await emitirFactura({
      ventaId: postVenta.ventaId,
      numeroDocumento: facturaForm.numeroDocumento.trim(),
      razonSocial: facturaForm.razonSocial.trim(),
    });
    setComprobanteLoading(false);
    if (res.success && res.data) {
      setComprobanteOk(`Factura ${res.data.serie}-${res.data.numero} generada`);
      setShowFacturaModal(false);
    } else {
      setComprobanteError(res.error?.message ?? 'Error al emitir factura');
    }
  };

  const pedirUpsell = async () => {
    if (cart.length === 0) return;
    setUpsellLoading(true);
    setUpsellError(null);
    setUpsellSugerencias([]);
    setShowUpsell(true);
    const items = cart.map(i => ({
      nombre: i.producto?.nombre ?? i.packNombre ?? 'Item',
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
    }));
    const res = await iaUpsell(items);
    if (res.success && res.sugerencias) {
      setUpsellSugerencias(res.sugerencias);
    } else {
      setUpsellError(res.error ?? 'Error al obtener sugerencias');
    }
    setUpsellLoading(false);
  };

  // Productos visibles (búsqueda tiene prioridad sobre categoría)
  const showSearch = search.length >= 2;
  const showCategoria = !showSearch && selectedCategoria != null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingCart size={26} /> Punto de Venta
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Columna izquierda ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {/* Barra de búsqueda */}
          <Card>
            <CardContent className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar por código de barras o nombre del producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && productos.length > 0) addToCart(productos[0]);
                  }}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setProductos([]); setPacks([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chips de categorías */}
          {categorias.length > 0 && !showSearch && (
            <div className="flex flex-wrap gap-1.5 px-1">
              <button
                onClick={() => setSelectedCategoria(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedCategoria == null
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-border bg-surface hover:bg-background text-text-secondary'
                }`}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoria(selectedCategoria === cat.id ? null : cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedCategoria === cat.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-border bg-surface hover:bg-background text-text-secondary'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Panel de Promociones Activas */}
          {promociones.length > 0 && (
            <div className="border border-amber-200 rounded-lg bg-amber-50">
              <button
                onClick={() => setShowPromociones((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-amber-800"
              >
                <span className="flex items-center gap-2">
                  <Gift size={15} />
                  {promociones.length} promoción{promociones.length !== 1 ? 'es' : ''} activa{promociones.length !== 1 ? 's' : ''}
                </span>
                {showPromociones ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showPromociones && (
                <div className="px-3 pb-3 flex flex-col gap-1.5">
                  {promociones.map((promo) => (
                    <div key={promo.id} className="bg-white border border-amber-200 rounded p-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-amber-900">{promo.nombre}</span>
                        <span className="shrink-0 text-amber-700 font-bold">
                          {promo.tipo === 'DESCUENTO_PORCENTAJE' && promo.descuentoPorcentaje != null
                            ? `-${promo.descuentoPorcentaje}%`
                            : promo.tipo === 'DESCUENTO_MONTO' && promo.descuentoMonto != null
                            ? `-S/ ${promo.descuentoMonto.toFixed(2)}`
                            : promo.tipo === 'CANTIDAD'
                            ? 'Cant.'
                            : ''}
                        </span>
                      </div>
                      {promo.productos && promo.productos.length > 0 && (
                        <p className="text-amber-700 mt-0.5 truncate">
                          {promo.productos.map((pp) => pp.producto?.nombre).filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resultados de búsqueda o grid por categoría */}
          {(showSearch || showCategoria) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-text-secondary">
                  {showSearch
                    ? `Resultados para "${search}"`
                    : `${categorias.find((c) => c.id === selectedCategoria)?.nombre ?? 'Categoría'}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {loadingCat && !showSearch ? (
                  <p className="text-text-secondary text-sm py-2">Cargando...</p>
                ) : (
                  <>
                    {(showSearch ? productos : productosPorCategoria).length === 0 &&
                     packs.length === 0 && !loadingCat && (
                      <p className="text-text-secondary text-sm py-2">
                        {showSearch ? 'No se encontraron resultados' : 'No hay productos en esta categoría'}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                      {(showSearch ? productos : productosPorCategoria).map((p) => (
                        <button
                          key={`p-${p.id}`}
                          onClick={() => addToCart(p)}
                          disabled={p.stockActual < 1}
                          className={`p-2.5 border rounded-lg text-left transition-all ${
                            p.stockActual < 1
                              ? 'opacity-50 cursor-not-allowed border-border bg-background'
                              : 'border-border hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm'
                          }`}
                        >
                          <p className="font-medium text-sm truncate">{p.nombre}</p>
                          {p.marca && <p className="text-xs text-text-secondary truncate">{p.marca}</p>}
                          <p className="text-sm text-blue-700 font-bold mt-1">S/ {p.precioVenta?.toFixed(2)}</p>
                          <p className={`text-xs mt-0.5 ${p.stockActual < 1 ? 'text-red-500' : p.stockActual <= (p.stockMinimo ?? 5) ? 'text-orange-500' : 'text-text-secondary'}`}>
                            Stock: {p.stockActual}
                          </p>
                        </button>
                      ))}
                      {showSearch && packs.map((pack) => (
                        <button
                          key={`pack-${pack.id}`}
                          onClick={() => addPackToCart(pack)}
                          className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 text-left transition-all"
                        >
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">Pack</span>
                          <p className="font-medium text-sm truncate mt-1">{pack.nombre}</p>
                          <p className="text-sm text-purple-700 font-bold mt-1">S/ {(pack.precioPack ?? 0).toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Carrito */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Carrito
                    <span className="ml-2 text-xs font-normal text-text-secondary bg-background px-2 py-0.5 rounded-full">
                      {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                  </CardTitle>
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <X size={12} /> Vaciar
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-2 px-3 font-medium text-text-secondary">Producto</th>
                      <th className="text-center py-2 px-2 font-medium text-text-secondary">Cant.</th>
                      <th className="text-right py-2 px-3 font-medium text-text-secondary">P. Unit.</th>
                      <th className="text-right py-2 px-3 font-medium text-text-secondary">Subtotal</th>
                      <th className="py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0 hover:bg-background/50">
                        <td className="py-2 px-3">
                          <p className="font-medium truncate max-w-[140px]">
                            {item.producto?.nombre ?? item.packNombre ?? 'Item'}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {item.packId && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-1 rounded">Pack</span>
                            )}
                            {calcularDescuentoPromo(item) > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-1 rounded flex items-center gap-0.5">
                                <Gift size={10} /> Promo
                              </span>
                            )}
                          </div>
                          {item.packId && item.packProductos && item.packProductos.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.packProductos.map((pp, i) => (
                                <span key={i} className="text-xs text-purple-600 bg-purple-50 border border-purple-100 rounded px-1">
                                  {pp.cantidad}× {pp.productoNombre}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updateQty(idx, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-border border border-border"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.producto?.stockActual ?? 999}
                              value={item.cantidad}
                              onChange={(e) => setQtyDirect(idx, parseInt(e.target.value, 10))}
                              className="w-10 text-center border border-border rounded text-sm py-0.5"
                            />
                            <button
                              onClick={() => updateQty(idx, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-border border border-border"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-text-secondary">
                          S/ {item.precioUnitario.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {(() => {
                            const desc = calcularDescuentoPromo(item);
                            const sub = item.precioUnitario * item.cantidad;
                            return desc > 0 ? (
                              <div>
                                <p className="line-through text-text-secondary text-xs">S/ {sub.toFixed(2)}</p>
                                <p className="font-semibold text-green-700">S/ {(sub - desc).toFixed(2)}</p>
                              </div>
                            ) : (
                              <p className="font-semibold">S/ {sub.toFixed(2)}</p>
                            );
                          })()}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* ── Widget IA Upsell ── */}
          {cart.length > 0 && (
            <div className="border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <button
                onClick={() => {
                  if (!showUpsell) pedirUpsell();
                  else setShowUpsell(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-blue-800 dark:text-blue-300"
              >
                <span className="flex items-center gap-2">
                  <Bot size={15} />
                  Sugerencias IA para el carrito
                </span>
                {upsellLoading
                  ? <Loader2 size={14} className="animate-spin text-blue-500" />
                  : showUpsell ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showUpsell && (
                <div className="px-3 pb-3">
                  {upsellLoading && (
                    <p className="text-xs text-blue-600 py-2 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" /> Analizando carrito con IA...
                    </p>
                  )}
                  {upsellError && !upsellLoading && (
                    <p className="text-xs text-red-600 py-2">{upsellError}</p>
                  )}
                  {!upsellLoading && upsellSugerencias.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {upsellSugerencias.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded p-2 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{s.nombre}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">{s.razon}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                              S/ {s.precioVenta?.toFixed(2) ?? '—'}
                            </span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={pedirUpsell}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 self-start"
                      >
                        <Sparkles size={11} /> Regenerar sugerencias
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Panel de pago ── */}
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">

              {!postVenta ? (
                <>
                  {/* Subtotales */}
                  <div className="space-y-1.5 text-sm">
                    {descuentoMonto > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Subtotal bruto</span>
                        <span>S/ {subtotalBruto.toFixed(2)}</span>
                      </div>
                    )}
                    {descuentoPromoTotal > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span className="flex items-center gap-1"><Gift size={12} /> Desc. promoción</span>
                        <span>- S/ {descuentoPromoTotal.toFixed(2)}</span>
                      </div>
                    )}
                    {descuentoManual > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Desc. adicional</span>
                        <span>- S/ {descuentoManual.toFixed(2)}</span>
                      </div>
                    )}
                    {descuentoPorPuntos > 0 && (
                      <div className="flex justify-between text-yellow-700">
                        <span>⭐ Canje {puntosAplicados} pts</span>
                        <span>- S/ {descuentoPorPuntos.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span>S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aplicarIgv}
                        onChange={(e) => setAplicarIgv(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-text-secondary">IGV (18%)</span>
                      {aplicarIgv && <span className="ml-auto">S/ {impuesto.toFixed(2)}</span>}
                    </label>
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-1">
                      <span>Total</span>
                      <span className="text-blue-700">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Descuento */}
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-1 flex items-center gap-1">
                      <PercentIcon size={12} /> Descuento
                    </p>
                    <div className="flex gap-1">
                      <select
                        value={descuentoTipo}
                        onChange={(e) => setDescuentoTipo(e.target.value as 'porcentaje' | 'monto')}
                        className="text-xs px-2 py-1.5 border border-border rounded"
                      >
                        <option value="porcentaje">%</option>
                        <option value="monto">S/</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        max={descuentoTipo === 'porcentaje' ? 100 : subtotalBruto}
                        step="0.01"
                        value={descuento}
                        onChange={(e) => setDescuento(e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-border rounded text-sm"
                        placeholder={descuentoTipo === 'porcentaje' ? '0%' : '0.00'}
                      />
                    </div>
                  </div>

                  {/* Cliente */}
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-1">Cliente (opcional)</p>
                    {!cliente ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowClienteSearch(true)}
                          className="w-full text-left px-3 py-2 border border-border rounded text-text-secondary text-sm hover:bg-background"
                        >
                          <Search size={12} className="inline mr-1" /> Buscar cliente...
                        </button>
                        {showClienteSearch && (
                          <div className="mt-1.5 space-y-1">
                            <input
                              type="text"
                              placeholder="Nombre o DNI..."
                              value={clienteSearch}
                              onChange={(e) => setClienteSearch(e.target.value)}
                              className="w-full px-3 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                              autoFocus
                            />
                            {clientes.length > 0 && (
                              <ul className="border border-border rounded max-h-32 overflow-y-auto bg-surface shadow-sm">
                                {clientes.map((c) => (
                                  <li key={c.id}>
                                    <button
                                      type="button"
                                      onClick={() => { setCliente(c); setClienteSearch(''); setClientes([]); setShowClienteSearch(false); }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-background text-sm"
                                    >
                                      <span className="font-medium">{c.nombre}</span>
                                      {c.numeroDocumento && <span className="text-text-secondary ml-1 text-xs">({c.numeroDocumento})</span>}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <button
                              onClick={() => { setShowClienteSearch(false); setClienteSearch(''); setClientes([]); }}
                              className="text-xs text-text-secondary hover:text-text-main"
                            >
                              Cerrar
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-3 py-1.5 border border-green-200 rounded bg-green-50 text-sm">
                          <div>
                            <span className="font-medium text-green-800">{cliente.nombre}</span>
                            {configFidelizacion?.activo && (
                              <span className="ml-2 text-xs text-yellow-700 font-medium">
                                ⭐ {cliente.puntosFidelizacion ?? 0} pts
                              </span>
                            )}
                          </div>
                          <button onClick={() => { setCliente(null); setPuntosACanjear(''); setPuntosAplicados(0); }} className="text-text-secondary hover:text-text-main ml-2">
                            <X size={14} />
                          </button>
                        </div>
                        {/* Canje de puntos */}
                        {configFidelizacion?.activo && (cliente.puntosFidelizacion ?? 0) > 0 && formaPago !== 'CREDITO' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-xs">
                            <p className="font-medium text-yellow-800 mb-1">
                              Canjear puntos ({configFidelizacion.puntosPorSolDescuento} pts = S/ 1)
                            </p>
                            <div className="flex gap-2 items-center">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                max={Math.min(cliente.puntosFidelizacion ?? 0, configFidelizacion.maxPuntosCanjeporVenta)}
                                value={puntosACanjear}
                                onChange={(e) => { setPuntosACanjear(e.target.value); setPuntosAplicados(0); }}
                                className="flex-1 px-2 py-1 border border-border rounded text-sm"
                                placeholder="Puntos a canjear"
                              />
                              <button
                                onClick={() => {
                                  const pts = parseInt(puntosACanjear) || 0;
                                  const max = Math.min(cliente.puntosFidelizacion ?? 0, configFidelizacion.maxPuntosCanjeporVenta);
                                  setPuntosAplicados(Math.min(pts, max));
                                }}
                                className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600"
                              >
                                Aplicar
                              </button>
                            </div>
                            {puntosAplicados > 0 && (
                              <div className="mt-1 flex justify-between items-center">
                                <span className="text-green-700 font-medium">
                                  Descuento: -S/ {(puntosAplicados / configFidelizacion.puntosPorSolDescuento).toFixed(2)}
                                </span>
                                <button onClick={() => { setPuntosAplicados(0); setPuntosACanjear(''); }} className="text-red-500 text-xs">Quitar</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Forma de pago */}
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-1.5">Forma de pago</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FORMAS_PAGO.map((fp) => (
                        <button
                          key={fp.value}
                          onClick={() => setFormaPago(fp.value)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            formaPago === fp.value
                              ? fp.color + ' shadow-sm'
                              : 'border-border bg-surface hover:bg-background text-text-secondary'
                          }`}
                        >
                          {fp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Efectivo: monto recibido */}
                  {formaPago === 'EFECTIVO' && (
                    <div>
                      <label className="text-xs font-medium text-text-secondary">Monto recibido</label>
                      <input
                        type="number"
                        step="0.01"
                        value={montoRecibido}
                        onChange={(e) => setMontoRecibido(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        placeholder="0.00"
                      />
                      {vuelto > 0 && (
                        <p className="mt-1 text-green-700 font-bold text-sm">
                          Vuelto: S/ {vuelto.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pago Mixto */}
                  {formaPago === 'MIXTO' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-orange-800">Distribución del pago</p>
                      <div className="flex gap-2 items-center">
                        <select
                          value={formaPagoMixto1}
                          onChange={(e) => setFormaPagoMixto1(e.target.value)}
                          className="text-xs px-2 py-1.5 border border-border rounded flex-1"
                        >
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="TARJETA">Tarjeta</option>
                          <option value="YAPE">Yape</option>
                          <option value="PLIN">Plin</option>
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          value={montoMixto1}
                          onChange={(e) => setMontoMixto1(e.target.value)}
                          className="w-24 px-2 py-1.5 border border-border rounded text-sm"
                          placeholder="S/ 0.00"
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <select
                          value={formaPagoMixto2}
                          onChange={(e) => setFormaPagoMixto2(e.target.value)}
                          className="text-xs px-2 py-1.5 border border-border rounded flex-1"
                        >
                          <option value="YAPE">Yape</option>
                          <option value="PLIN">Plin</option>
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="TARJETA">Tarjeta</option>
                        </select>
                        <span className="w-24 px-2 py-1.5 text-sm text-right text-orange-700 font-medium">
                          S/ {Math.max(0, montoMixto2).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Crédito / Fiado */}
                  {formaPago === 'CREDITO' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-yellow-800">Venta a crédito (fiado)</p>
                      {!cliente && (
                        <p className="text-xs text-red-600 font-medium">
                          ⚠ Selecciona un cliente antes de finalizar
                        </p>
                      )}
                      <div>
                        <label className="text-xs font-medium text-text-secondary">
                          Fecha de vencimiento <span className="text-gray-400">(opcional)</span>
                        </label>
                        <input
                          type="date"
                          value={fechaVencimientoCredito}
                          onChange={(e) => setFechaVencimientoCredito(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full mt-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-300"
                        />
                      </div>
                      <p className="text-xs text-yellow-700">
                        El saldo quedará pendiente en "Fiado / Crédito"
                      </p>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={finalizarVenta}
                    disabled={loading || cart.length === 0}
                    className="w-full py-3 text-base font-bold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="spinner" /> Procesando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ChevronRight size={18} /> FINALIZAR VENTA
                      </span>
                    )}
                  </Button>
                </>
              ) : (
                /* ── Post-venta ── */
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800 text-lg">¡Venta registrada!</p>
                    <p className="text-green-700 text-sm mt-1">N° {postVenta.numeroVenta}</p>
                    <p className="text-green-800 font-bold text-xl mt-2">S/ {postVenta.total.toFixed(2)}</p>
                    {postVenta.vuelto != null && postVenta.vuelto > 0 && (
                      <p className="text-green-700 font-semibold mt-1">Vuelto: S/ {postVenta.vuelto.toFixed(2)}</p>
                    )}
                  </div>

                  {comprobanteOk && (
                    <p className="text-green-700 text-xs bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center gap-1">
                      <CheckCircle size={12} /> {comprobanteOk}
                    </p>
                  )}
                  {comprobanteError && (
                    <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{comprobanteError}</p>
                  )}

                  <p className="text-xs font-medium text-text-secondary text-center">Emitir comprobante</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowBoletaModal(true); setComprobanteError(null); }}
                      disabled={!!comprobanteOk}
                    >
                      <Receipt size={14} className="mr-1" /> Boleta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowFacturaModal(true); setComprobanteError(null); }}
                      disabled={!!comprobanteOk}
                    >
                      <FileText size={14} className="mr-1" /> Factura
                    </Button>
                  </div>

                  <Button onClick={nuevaVenta} className="w-full">
                    <Tag size={16} className="mr-2" /> Nueva Venta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Boleta */}
      {showBoletaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Emitir Boleta</h3>
              <button onClick={() => setShowBoletaModal(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Tipo documento</label>
                <select
                  value={boletaForm.tipoDocumento}
                  onChange={(e) => setBoletaForm((f) => ({ ...f, tipoDocumento: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                >
                  <option value="1">DNI</option>
                  <option value="4">Carné de extranjería</option>
                </select>
              </div>
              <Input
                label="Número de documento"
                value={boletaForm.numeroDocumento}
                onChange={(e) => setBoletaForm((f) => ({ ...f, numeroDocumento: e.target.value }))}
                placeholder="Ej. 12345678"
              />
              <Input
                label="Nombre del cliente"
                value={boletaForm.nombre}
                onChange={(e) => setBoletaForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre completo"
              />
              {comprobanteError && <p className="text-red-600 text-xs">{comprobanteError}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBoletaModal(false)} disabled={comprobanteLoading}>Cancelar</Button>
              <Button size="sm" onClick={handleEmitirBoleta} disabled={comprobanteLoading}>
                {comprobanteLoading ? 'Generando...' : 'Emitir'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Factura */}
      {showFacturaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Emitir Factura</h3>
              <button onClick={() => setShowFacturaModal(false)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <Input
                label="RUC"
                value={facturaForm.numeroDocumento}
                onChange={(e) => setFacturaForm((f) => ({ ...f, numeroDocumento: e.target.value }))}
                placeholder="11 dígitos"
              />
              <Input
                label="Razón social"
                value={facturaForm.razonSocial}
                onChange={(e) => setFacturaForm((f) => ({ ...f, razonSocial: e.target.value }))}
                placeholder="Nombre o razón social"
              />
              {comprobanteError && <p className="text-red-600 text-xs">{comprobanteError}</p>}
            </div>
            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowFacturaModal(false)} disabled={comprobanteLoading}>Cancelar</Button>
              <Button size="sm" onClick={handleEmitirFactura} disabled={comprobanteLoading}>
                {comprobanteLoading ? 'Generando...' : 'Emitir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
