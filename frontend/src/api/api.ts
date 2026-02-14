import { getAuthHeaders } from './client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text || text.trim() === '') return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(url, { ...options, headers });
  const json = await parseJsonSafe<ApiResponse<T>>(res);

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:session-invalid'));
    }
    const message =
      res.status === 403
        ? 'Acceso denegado. Inicia sesión nuevamente.'
        : res.status === 401
          ? 'Sesión expirada. Inicia sesión nuevamente.'
          : json?.error?.message ?? 'Error en la solicitud';
    return {
      success: false,
      error: json?.error ?? { code: 'ERROR', message },
    };
  }

  if (json) return json;
  return { success: false, error: { code: 'ERROR', message: 'Respuesta inválida del servidor' } };
}

async function requestBlob(path: string): Promise<Blob> {
  const url = `${API_BASE}${path}`;
  const headers = getAuthHeaders();
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Error al descargar');
  return res.blob();
}

// Dashboard
export interface DashboardDTO {
  ventasHoy: number;
  transaccionesHoy: number;
  productosActivos: number;
  productosStockBajo: number;
  productosProximosVencer: number;
}

export async function fetchDashboard(): Promise<ApiResponse<DashboardDTO>> {
  return request<DashboardDTO>('/api/v1/reportes/dashboard');
}

// Reportes
export interface VentaPorDia {
  fecha: string;
  total: number;
  transacciones: number;
}

export interface ReporteVentas {
  totalVentas: number;
  totalTransacciones: number;
  ticketPromedio: number;
  ventasPorDia: VentaPorDia[];
  ventasPorFormaPago: { formaPago: string; total: number; cantidad: number }[];
}

export async function fetchReporteVentas(
  fechaInicio: string,
  fechaFin: string,
  agrupacion = 'DIA'
): Promise<ApiResponse<ReporteVentas>> {
  return request<ReporteVentas>(
    `/api/v1/reportes/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&agrupacion=${agrupacion}`
  );
}

export interface ProductoMasVendido {
  productoId: number;
  nombreProducto: string;
  cantidadVendida: number;
  totalVentas: number;
  porcentajeDelTotal: number;
}

export async function fetchProductosMasVendidos(
  fechaInicio: string,
  fechaFin: string,
  limite = 10
): Promise<ApiResponse<ProductoMasVendido[]>> {
  return request<ProductoMasVendido[]>(
    `/api/v1/reportes/productos-mas-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&limite=${limite}`
  );
}

export async function descargarReporteVentasPDF(fechaInicio: string, fechaFin: string): Promise<void> {
  const blob = await requestBlob(
    `/api/v1/reportes/ventas/pdf?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-ventas-${fechaInicio}-${fechaFin}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function descargarReporteInventarioPDF(): Promise<void> {
  const blob = await requestBlob('/api/v1/reportes/inventario/pdf');
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reporte-inventario.pdf';
  link.click();
  window.URL.revokeObjectURL(url);
}

// Productos
export interface ProductoDTO {
  id: number;
  codigoBarras?: string;
  nombre: string;
  marca?: string;
  categoriaId?: number;
  precioCompra?: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo?: number;
  stockMaximo?: number;
  fechaVencimiento?: string;
  imagen?: string;
  activo: boolean;
}

export async function fetchProductos(params?: {
  search?: string;
  categoriaId?: number;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: ProductoDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.categoriaId) q.set('categoriaId', String(params.categoriaId));
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: ProductoDTO[]; totalElements: number }>(`/api/v1/productos?${q}`);
}

export async function buscarProductos(q: string): Promise<ApiResponse<ProductoDTO[]>> {
  if (!q || q.length < 2) return { success: true, data: [] };
  return request<ProductoDTO[]>(`/api/v1/productos/buscar?q=${encodeURIComponent(q)}`);
}

export async function obtenerProducto(id: number): Promise<ApiResponse<ProductoDTO>> {
  return request<ProductoDTO>(`/api/v1/productos/${id}`);
}

export async function crearProducto(dto: Partial<ProductoDTO>): Promise<ApiResponse<ProductoDTO>> {
  return request<ProductoDTO>('/api/v1/productos', { method: 'POST', body: JSON.stringify(dto) });
}

export async function actualizarProducto(id: number, dto: Partial<ProductoDTO>): Promise<ApiResponse<ProductoDTO>> {
  return request<ProductoDTO>(`/api/v1/productos/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function eliminarProducto(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/productos/${id}`, { method: 'DELETE' });
}

export interface ImportarProductosResult {
  totalProcesados: number;
  creados: number;
  omitidos: number;
  errores: number;
  mensajesError: string[];
  productosCreados: string[];
}

export async function importarProductosCSV(archivo: File): Promise<ApiResponse<ImportarProductosResult>> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const url = `${API_BASE}/api/v1/productos/importar`;
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  const json = await parseJsonSafe<ApiResponse<ImportarProductosResult>>(res);
  if (!res.ok) {
    return {
      success: false,
      error: json?.error ?? { code: 'ERROR', message: 'Error al importar productos' },
    };
  }
  return json ?? { success: false, error: { code: 'ERROR', message: 'Respuesta inválida' } };
}

// Ventas
export interface CrearVentaItem {
  productoId?: number;
  packId?: number;
  cantidad: number;
  precioUnitario: number;
}

export interface PagoMixto {
  metodo: string;
  monto: number;
  referencia?: string;
}

export interface CrearVentaRequest {
  clienteId?: number;
  items: CrearVentaItem[];
  formaPago: string;
  montoRecibido?: number;
  pagosMixtos?: PagoMixto[];
  descuento?: number;
  referencia?: string;
}

export interface VentaDTO {
  id: number;
  numeroVenta: string;
  fecha: string;
  total: number;
  vuelto?: number;
  formaPago: string;
  estado: string;
  cliente?: { id: number; nombre: string; numeroDocumento?: string };
  detalles?: { producto?: ProductoDTO; packNombre?: string; cantidad: number; precioUnitario: number; subtotal: number }[];
}

export async function crearVenta(body: CrearVentaRequest): Promise<ApiResponse<VentaDTO>> {
  return request<VentaDTO>('/api/v1/ventas', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchVentas(params?: {
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: VentaDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.fechaDesde) q.set('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) q.set('fechaHasta', params.fechaHasta);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: VentaDTO[]; totalElements: number }>(`/api/v1/ventas?${q}`);
}

export async function anularVenta(id: number, motivo?: string): Promise<ApiResponse<VentaDTO>> {
  const q = motivo ? `?motivo=${encodeURIComponent(motivo)}` : '';
  return request<VentaDTO>(`/api/v1/ventas/${id}/anular${q}`, { method: 'PUT' });
}

// Facturación / Comprobantes
export interface ComprobanteDTO {
  id: number;
  ventaId: number;
  tipoComprobante: string;
  serie: string;
  numero: string;
  estadoSunat: string;
  fechaEmision: string;
}

export interface EmitirBoletaRequest {
  ventaId: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
}

export interface EmitirFacturaRequest {
  ventaId: number;
  numeroDocumento: string; // RUC
  razonSocial: string;
}

export async function fetchComprobantePorVenta(ventaId: number): Promise<ApiResponse<ComprobanteDTO>> {
  return request<ComprobanteDTO>(`/api/v1/facturacion/comprobantes/por-venta/${ventaId}`);
}

export async function emitirBoleta(body: EmitirBoletaRequest): Promise<ApiResponse<{ id: number; serie: string; numero: string; estadoSunat: string }>> {
  return request<{ id: number; serie: string; numero: string; estadoSunat: string }>('/api/v1/facturacion/emitir-boleta', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function emitirFactura(body: EmitirFacturaRequest): Promise<ApiResponse<{ id: number; serie: string; numero: string; estadoSunat: string }>> {
  return request<{ id: number; serie: string; numero: string; estadoSunat: string }>('/api/v1/facturacion/emitir-factura', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function descargarPdfComprobante(comprobanteId: number): Promise<void> {
  const blob = await requestBlob(`/api/v1/facturacion/comprobantes/${comprobanteId}/pdf`);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `comprobante-${comprobanteId}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function enviarComprobanteSunat(comprobanteId: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request<Record<string, unknown>>(`/api/v1/facturacion/comprobantes/${comprobanteId}/enviar`, { method: 'POST' });
}

export async function consultarEstadoSunat(comprobanteId: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request<Record<string, unknown>>(`/api/v1/facturacion/comprobantes/${comprobanteId}/consultar`);
}

// Inventario
export async function fetchStockBajo(): Promise<ApiResponse<ProductoDTO[]>> {
  return request<ProductoDTO[]>('/api/v1/inventario/alertas/stock-bajo');
}

export async function fetchProximosVencer(): Promise<ApiResponse<ProductoDTO[]>> {
  return request<ProductoDTO[]>('/api/v1/inventario/alertas/vencimiento');
}

export interface MovimientoInventarioDTO {
  id: number;
  producto?: { id: number; nombre: string };
  tipoMovimiento: string;
  cantidad: number;
  motivo?: string;
  usuario?: { nombre?: string; username?: string };
  fecha: string;
}

export async function fetchMovimientosInventario(params?: {
  productoId?: number;
  tipoMovimiento?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: MovimientoInventarioDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.productoId) q.set('productoId', String(params.productoId));
  if (params?.tipoMovimiento) q.set('tipoMovimiento', params.tipoMovimiento);
  if (params?.fechaDesde) q.set('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) q.set('fechaHasta', params.fechaHasta);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: MovimientoInventarioDTO[]; totalElements: number }>(
    `/api/v1/inventario/movimientos?${q}`
  );
}

export async function crearMovimientoManual(
  productoId: number,
  tipoMovimiento: string,
  cantidad: number,
  motivo?: string
): Promise<ApiResponse<MovimientoInventarioDTO>> {
  const q = new URLSearchParams({
    productoId: String(productoId),
    tipoMovimiento,
    cantidad: String(cantidad),
  });
  if (motivo) q.set('motivo', motivo);
  return request<MovimientoInventarioDTO>(`/api/v1/inventario/movimientos?${q}`, {
    method: 'POST',
  });
}

export async function ajustarInventario(
  productoId: number,
  stockFisico: number
): Promise<ApiResponse<void>> {
  const q = new URLSearchParams({
    productoId: String(productoId),
    stockFisico: String(stockFisico),
  });
  return request<void>(`/api/v1/inventario/ajustar?${q}`, { method: 'POST' });
}

// Compras
export interface CrearCompraItem {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CrearCompraRequest {
  proveedorId: number;
  fechaCompra?: string;
  items: CrearCompraItem[];
  observaciones?: string;
}

export interface CompraDTO {
  id: number;
  numeroCompra: string;
  fechaCompra: string;
  total: number;
  estado: string;
}

export async function crearCompra(body: CrearCompraRequest): Promise<ApiResponse<CompraDTO>> {
  return request<CompraDTO>('/api/v1/compras', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Categorías
export interface CategoriaDTO {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}

export async function fetchCategorias(soloActivas = true): Promise<ApiResponse<CategoriaDTO[]>> {
  return request<CategoriaDTO[]>(`/api/v1/categorias?soloActivas=${soloActivas}`);
}

export async function crearCategoria(dto: Partial<CategoriaDTO>): Promise<ApiResponse<CategoriaDTO>> {
  return request<CategoriaDTO>('/api/v1/categorias', { method: 'POST', body: JSON.stringify(dto) });
}

export async function actualizarCategoria(id: number, dto: Partial<CategoriaDTO>): Promise<ApiResponse<CategoriaDTO>> {
  return request<CategoriaDTO>(`/api/v1/categorias/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function eliminarCategoria(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/categorias/${id}`, { method: 'DELETE' });
}

// Clientes
export interface ClienteDTO {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  telefono?: string;
  email?: string;
}

export async function fetchClientes(search?: string): Promise<ApiResponse<{ content: ClienteDTO[]; totalElements: number }>> {
  const q = search ? `?search=${encodeURIComponent(search)}&size=50` : '?size=50';
  return request<{ content: ClienteDTO[]; totalElements: number }>(`/api/v1/clientes${q}`);
}

export async function crearCliente(dto: Partial<ClienteDTO>): Promise<ApiResponse<ClienteDTO>> {
  return request<ClienteDTO>('/api/v1/clientes', { method: 'POST', body: JSON.stringify(dto) });
}

export async function actualizarCliente(id: number, dto: Partial<ClienteDTO>): Promise<ApiResponse<ClienteDTO>> {
  return request<ClienteDTO>(`/api/v1/clientes/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function eliminarCliente(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/clientes/${id}`, { method: 'DELETE' });
}

// Proveedores
export interface ProveedorDTO {
  id: number;
  razonSocial: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export async function fetchProveedores(): Promise<ApiResponse<ProveedorDTO[]>> {
  const res = await request<{ content?: ProveedorDTO[] }>('/api/v1/proveedores?size=100');
  if (res.success && res.data && 'content' in res.data && Array.isArray((res.data as { content: ProveedorDTO[] }).content))
    return { ...res, data: (res.data as { content: ProveedorDTO[] }).content };
  return res as ApiResponse<ProveedorDTO[]>;
}

export async function crearProveedor(dto: Partial<ProveedorDTO>): Promise<ApiResponse<ProveedorDTO>> {
  return request<ProveedorDTO>('/api/v1/proveedores', { method: 'POST', body: JSON.stringify(dto) });
}

export async function actualizarProveedor(id: number, dto: Partial<ProveedorDTO>): Promise<ApiResponse<ProveedorDTO>> {
  return request<ProveedorDTO>(`/api/v1/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function eliminarProveedor(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/proveedores/${id}`, { method: 'DELETE' });
}

// Promociones
export interface PromocionProductoDTO {
  id?: number;
  producto?: ProductoDTO;
  cantidadMinima: number;
  cantidadGratis?: number;
}

export interface PromocionDTO {
  id: number;
  nombre: string;
  tipo: string;
  descuentoPorcentaje?: number;
  descuentoMonto?: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  productos?: PromocionProductoDTO[];
}

export interface CrearPromocionRequest {
  nombre: string;
  tipo: string;
  descuentoPorcentaje?: number;
  descuentoMonto?: number;
  fechaInicio: string;
  fechaFin: string;
  productos?: { productoId: number; cantidadMinima?: number; cantidadGratis?: number }[];
}

export async function fetchPromociones(params?: { soloActivas?: boolean; page?: number; size?: number }): Promise<ApiResponse<{ content: PromocionDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.soloActivas != null) q.set('soloActivas', String(params.soloActivas));
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  const path = `/api/v1/promociones${q.toString() ? '?' + q : ''}`;
  return request<{ content: PromocionDTO[]; totalElements: number }>(path);
}

export async function crearPromocion(body: CrearPromocionRequest): Promise<ApiResponse<PromocionDTO>> {
  return request<PromocionDTO>('/api/v1/promociones', { method: 'POST', body: JSON.stringify(body) });
}

export async function actualizarPromocion(id: number, body: CrearPromocionRequest): Promise<ApiResponse<PromocionDTO>> {
  return request<PromocionDTO>(`/api/v1/promociones/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

export async function desactivarPromocion(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/promociones/${id}`, { method: 'DELETE' });
}
