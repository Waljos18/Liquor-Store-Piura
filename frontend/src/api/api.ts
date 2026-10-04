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
    // Solo 401 indica sesión inválida/expirada; 403 = sin permiso (no cierra sesión)
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:session-invalid'));
    }
    // json?.error puede ser un objeto ApiResponse {code,message} o un string de Spring Boot
    const rawJson = json as unknown as Record<string, unknown> | null;
    const apiMsg = typeof rawJson?.error === 'object' && rawJson?.error !== null
      ? (rawJson.error as { message?: string })?.message
      : undefined;
    // json?.message es el campo message del formato de error estándar de Spring Boot
    const springMsg = typeof rawJson?.message === 'string' ? rawJson.message : undefined;
    const message =
      res.status === 403
        ? 'No tienes permiso para realizar esta acción.'
        : res.status === 401
          ? 'Sesión expirada. Inicia sesión nuevamente.'
          : apiMsg ?? springMsg ?? 'Error en la solicitud';
    const errObj = typeof rawJson?.error === 'object' && rawJson?.error !== null
      ? (rawJson.error as { code: string; message: string })
      : { code: String(res.status), message };
    return { success: false, error: errObj };
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

// Auth - Recuperación de contraseña
export async function solicitarResetPassword(email: string): Promise<ApiResponse<void>> {
  return request('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {},
  });
}

export async function resetPassword(token: string, nuevaPassword: string): Promise<ApiResponse<void>> {
  return request('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, nuevaPassword }),
    headers: {},
  });
}

// Dashboard
export interface DashboardDTO {
  ventasHoy: number;
  gananciasHoy?: number;  // precio venta - precio compra (hoy)
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
  ganancias?: number;
  ventasPorDia: VentaPorDia[];
  ventasPorFormaPago: { formaPago: string; total: number; cantidad: number }[];
  ventasPorCategoria?: { categoria: string; total: number; cantidadVendida: number }[];
  ventasPorVendedor?: { vendedor: string; rol: string; totalVentas: number; transacciones: number; ticketPromedio: number }[];
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
  fechaActualizacion?: string;
}

export async function fetchProductosSinCategoria(): Promise<ApiResponse<ProductoDTO[]>> {
  return request<ProductoDTO[]>('/api/v1/productos/sin-categoria');
}

export async function fetchProductos(params?: {
  search?: string;
  categoriaId?: number;
  page?: number;
  size?: number;
  activo?: boolean;
}): Promise<ApiResponse<{ content: ProductoDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.categoriaId) q.set('categoriaId', String(params.categoriaId));
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  if (params?.activo != null) q.set('activo', String(params.activo));
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

export async function eliminarProductosBulk(ids: number[]): Promise<ApiResponse<void>> {
  return request<void>('/api/v1/productos/bulk-delete', { method: 'POST', body: JSON.stringify(ids) });
}

export async function eliminarProducto(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/productos/${id}`, { method: 'DELETE' });
}

export async function eliminarProductoByCodigo(codigoBarras: string): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/productos/by-codigo/${encodeURIComponent(codigoBarras)}`, { method: 'DELETE' });
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
  /** Si true (default), se aplica IGV 18%. Si false, total = subtotal sin impuesto */
  aplicarIgv?: boolean;
  referencia?: string;
  /** Solo para formaPago=CREDITO */
  fechaVencimientoCredito?: string;
  /** Puntos a canjear como descuento (requiere clienteId) */
  puntosCanjeados?: number;
}

export interface VentaDTO {
  id: number;
  numeroVenta: string;
  fecha: string;
  total: number;
  vuelto?: number;
  formaPago: string;
  estado: string;
  usuario?: { id: number; nombre: string; username: string; rol: string };
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

export async function fetchVentaPorId(id: number): Promise<ApiResponse<VentaDTO>> {
  return request<VentaDTO>(`/api/v1/ventas/${id}`);
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

export async function fetchProximosVencer(dias?: number): Promise<ApiResponse<ProductoDTO[]>> {
  const q = dias != null && dias !== 30 ? `?dias=${dias}` : '';
  return request<ProductoDTO[]>(`/api/v1/inventario/alertas/vencimiento${q}`);
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
  // El backend usa @DateTimeFormat ISO_DATE_TIME: convertir "YYYY-MM-DD" → "YYYY-MM-DDTHH:mm:ssZ"
  if (params?.fechaDesde) {
    const iso = params.fechaDesde.length === 10 ? params.fechaDesde + 'T00:00:00Z' : params.fechaDesde;
    q.set('fechaDesde', iso);
  }
  if (params?.fechaHasta) {
    const iso = params.fechaHasta.length === 10 ? params.fechaHasta + 'T23:59:59Z' : params.fechaHasta;
    q.set('fechaHasta', iso);
  }
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: MovimientoInventarioDTO[]; totalElements: number }>(
    `/api/v1/inventario/movimientos?${q}`
  );
}

// Alertas resumen (campanita)
export interface AlertasResumenDTO {
  stockBajo: ProductoDTO[];
  proximosVencer: ProductoDTO[];
  movimientosRecientes: MovimientoInventarioDTO[];
  totalAlertas: number;
}

export async function fetchAlertasResumen(): Promise<ApiResponse<AlertasResumenDTO>> {
  return request<AlertasResumenDTO>('/api/v1/inventario/alertas/resumen');
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

/** Registra entrada de pack: convierte automáticamente a unidades (ej. 10 six pack → 60 unidades) */
export async function registrarEntradaPack(
  packId: number,
  cantidadPacks: number
): Promise<ApiResponse<void>> {
  return request<void>('/api/v1/inventario/entrada-pack', {
    method: 'POST',
    body: JSON.stringify({ packId, cantidadPacks }),
  });
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

export async function eliminarCategoriaByNombre(nombre: string): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/categorias/by-nombre?nombre=${encodeURIComponent(nombre)}`, { method: 'DELETE' });
}

// Clientes
export interface ClienteDTO {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  telefono?: string;
  email?: string;
  puntosFidelizacion?: number;
}

export async function fetchClientes(
  params?: { search?: string; page?: number; size?: number }
): Promise<ApiResponse<{ content: ClienteDTO[]; totalElements: number; totalPages: number }>> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.page != null) q.set('page', String(params.page));
  q.set('size', String(params?.size ?? 20));
  return request<{ content: ClienteDTO[]; totalElements: number; totalPages: number }>(
    `/api/v1/clientes${q.toString() ? '?' + q : ''}`
  );
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

export async function ajustarPuntosCliente(
  id: number,
  cantidad: number,
  tipo: 'SUMAR' | 'RESTAR',
  motivo?: string
): Promise<ApiResponse<ClienteDTO>> {
  const q = new URLSearchParams({ cantidad: String(cantidad), tipo, motivo: motivo ?? '' });
  return request<ClienteDTO>(`/api/v1/clientes/${id}/puntos?${q}`, { method: 'PATCH' });
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

// Usuarios (solo ADMIN)
export interface UsuarioDTO {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  activo?: boolean;
}

export async function fetchUsuarios(params?: { page?: number; size?: number }): Promise<ApiResponse<{ content: UsuarioDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  const path = `/api/v1/usuarios${q.toString() ? '?' + q : ''}`;
  return request<{ content: UsuarioDTO[]; totalElements: number }>(path);
}

export async function crearUsuario(dto: Partial<UsuarioDTO> & { password?: string }): Promise<ApiResponse<UsuarioDTO>> {
  return request<UsuarioDTO>('/api/v1/usuarios', { method: 'POST', body: JSON.stringify(dto) });
}

export async function actualizarUsuario(id: number, dto: Partial<UsuarioDTO> & { password?: string }): Promise<ApiResponse<UsuarioDTO>> {
  return request<UsuarioDTO>(`/api/v1/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function eliminarUsuario(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/usuarios/${id}`, { method: 'DELETE' });
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

export async function eliminarPromocion(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/promociones/${id}/eliminar`, { method: 'DELETE' });
}

// Packs (combos de productos)
export interface PackProductoDTO {
  id?: number;
  producto?: ProductoDTO;
  cantidad: number;
}

export interface PackDTO {
  id: number;
  nombre: string;
  precioPack: number;
  activo: boolean;
  fechaCreacion?: string;
  productos?: PackProductoDTO[];
}

export interface CrearPackRequest {
  nombre: string;
  precioPack: number;
  productos: { productoId: number; cantidad: number }[];
}

export async function buscarPacks(q: string): Promise<ApiResponse<PackDTO[]>> {
  if (!q || q.length < 2) return { success: true, data: [] };
  return request<PackDTO[]>(`/api/v1/packs/buscar?q=${encodeURIComponent(q)}`);
}

export async function fetchPacks(params?: { soloActivos?: boolean; page?: number; size?: number }): Promise<ApiResponse<{ content: PackDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.soloActivos != null) q.set('soloActivos', String(params.soloActivos));
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  const path = `/api/v1/packs${q.toString() ? '?' + q : ''}`;
  return request<{ content: PackDTO[]; totalElements: number }>(path);
}

export async function fetchPackPorId(id: number): Promise<ApiResponse<PackDTO>> {
  return request<PackDTO>(`/api/v1/packs/${id}`);
}

export async function crearPack(body: CrearPackRequest): Promise<ApiResponse<PackDTO>> {
  return request<PackDTO>('/api/v1/packs', { method: 'POST', body: JSON.stringify(body) });
}

export async function actualizarPack(id: number, body: CrearPackRequest): Promise<ApiResponse<PackDTO>> {
  return request<PackDTO>(`/api/v1/packs/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

export async function desactivarPack(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/packs/${id}`, { method: 'DELETE' });
}

export async function eliminarPack(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/packs/${id}/eliminar`, { method: 'DELETE' });
}

export async function calcularPrecioSugeridoPack(id: number): Promise<ApiResponse<number>> {
  return request<number>(`/api/v1/packs/${id}/calcular-precio`);
}

// Compras
export interface CompraDTO {
  id: number;
  numeroCompra: string;
  proveedor: { id: number; razonSocial: string; ruc?: string };
  fechaCompra: string;
  total: number;
  usuario: { id: number; nombre: string; username: string; rol: string };
  estado: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaRecepcion?: string;
  detalles?: { id: number; producto: { id: number; nombre: string; codigoBarras?: string }; cantidad: number; cantidadRecibida: number; precioUnitario: number; subtotal: number }[];
}

export interface CrearCompraRequest {
  proveedorId: number;
  fechaCompra?: string;
  items: { productoId: number; cantidad: number; precioUnitario: number }[];
  observaciones?: string;
}

export interface RecibirCompraRequest {
  items?: { productoId: number; cantidadRecibida: number }[];
  observaciones?: string;
}

export async function fetchCompras(params?: {
  proveedorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: CompraDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.proveedorId) q.set('proveedorId', String(params.proveedorId));
  if (params?.fechaDesde) q.set('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) q.set('fechaHasta', params.fechaHasta);
  if (params?.estado) q.set('estado', params.estado);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: CompraDTO[]; totalElements: number }>(`/api/v1/compras?${q}`);
}

export async function fetchCompraPorId(id: number): Promise<ApiResponse<CompraDTO>> {
  return request<CompraDTO>(`/api/v1/compras/${id}`);
}

export async function crearCompraCompleta(body: CrearCompraRequest): Promise<ApiResponse<CompraDTO>> {
  return request<CompraDTO>('/api/v1/compras', { method: 'POST', body: JSON.stringify(body) });
}

export async function recibirCompra(id: number, body?: RecibirCompraRequest): Promise<ApiResponse<CompraDTO>> {
  return request<CompraDTO>(`/api/v1/compras/${id}/recibir`, { method: 'PUT', body: JSON.stringify(body ?? {}) });
}

export async function anularCompra(id: number): Promise<ApiResponse<CompraDTO>> {
  return request<CompraDTO>(`/api/v1/compras/${id}/anular`, { method: 'PUT' });
}

// Devoluciones
export interface DevolucionDTO {
  id: number;
  numeroDevolucion: string;
  ventaId?: number;
  numeroVenta?: string;
  fecha: string;
  usuario: { id: number; nombre: string; rol: string };
  motivo: string;
  estado: string;
  observaciones?: string;
  total: number;
  fechaCreacion: string;
  detalles?: { id: number; productoId: number; productoNombre: string; cantidad: number; precioUnitario: number; subtotal: number }[];
}

export interface CrearDevolucionRequest {
  ventaId?: number;
  motivo: string;
  observaciones?: string;
  items: { productoId: number; cantidad: number; precioUnitario: number }[];
}

export async function fetchDevoluciones(params?: { desde?: string; hasta?: string; page?: number; size?: number }): Promise<ApiResponse<{ content: DevolucionDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  // El backend espera Instant en formato ISO-8601 con hora y zona
  if (params?.desde) q.set('desde', `${params.desde}T00:00:00Z`);
  if (params?.hasta) q.set('hasta', `${params.hasta}T23:59:59Z`);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: DevolucionDTO[]; totalElements: number }>(`/api/v1/devoluciones?${q}`);
}

export async function crearDevolucion(body: CrearDevolucionRequest): Promise<ApiResponse<DevolucionDTO>> {
  return request<DevolucionDTO>('/api/v1/devoluciones', { method: 'POST', body: JSON.stringify(body) });
}

export async function fetchDevolucionesPorVenta(ventaId: number): Promise<ApiResponse<DevolucionDTO[]>> {
  return request<DevolucionDTO[]>(`/api/v1/devoluciones/por-venta/${ventaId}`);
}

// Cuentas por cobrar (crédito / fiado)
export interface CuentaPorCobrarDTO {
  id: number;
  ventaId?: number;
  numeroVenta?: string;
  clienteId: number;
  clienteNombre: string;
  clienteDocumento: string;
  montoTotal: number;
  montoPagado: number;
  saldoPendiente: number;
  estado: string;
  fechaVencimiento?: string;
  observaciones?: string;
  fechaCreacion: string;
  pagos?: { id: number; monto: number; fecha: string; usuarioNombre: string; formaPago: string; observaciones?: string }[];
}

export async function fetchCuentasPorCobrar(params?: { estado?: string; clienteId?: number; page?: number; size?: number }): Promise<ApiResponse<{ content: CuentaPorCobrarDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.estado) q.set('estado', params.estado);
  if (params?.clienteId) q.set('clienteId', String(params.clienteId));
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: CuentaPorCobrarDTO[]; totalElements: number }>(`/api/v1/cuentas-cobrar?${q}`);
}

export async function fetchCuentaPorCobrarPorId(id: number): Promise<ApiResponse<CuentaPorCobrarDTO>> {
  return request<CuentaPorCobrarDTO>(`/api/v1/cuentas-cobrar/${id}`);
}

export async function pagarCuenta(id: number, body: { monto: number; formaPago: string; observaciones?: string }): Promise<ApiResponse<CuentaPorCobrarDTO>> {
  return request<CuentaPorCobrarDTO>(`/api/v1/cuentas-cobrar/${id}/pagar`, { method: 'POST', body: JSON.stringify(body) });
}

export async function fetchSaldoCliente(clienteId: number): Promise<ApiResponse<number>> {
  return request<number>(`/api/v1/cuentas-cobrar/cliente/${clienteId}/saldo`);
}

// Apertura de caja
export interface AperturaCajaDTO {
  id: number;
  fecha: string;
  horaApertura: string;
  horaCierre?: string;
  montoInicial: number;
  montoCierre?: number;
  montoReal?: number;
  sobranteFaltante?: number;
  usuarioAperturaNombre: string;
  usuarioCierreNombre?: string;
  estado: string;
  observaciones?: string;
  observacionesCierre?: string;
}

export async function abrirCaja(body: { montoInicial: number; observaciones?: string }): Promise<ApiResponse<AperturaCajaDTO>> {
  return request<AperturaCajaDTO>('/api/v1/caja/apertura', { method: 'POST', body: JSON.stringify(body) });
}

export async function cerrarCaja(id: number, body: { montoReal: number; observacionesCierre?: string }): Promise<ApiResponse<AperturaCajaDTO>> {
  return request<AperturaCajaDTO>(`/api/v1/caja/apertura/${id}/cerrar`, { method: 'PUT', body: JSON.stringify(body) });
}

export async function fetchCajaActiva(): Promise<ApiResponse<AperturaCajaDTO | null>> {
  return request<AperturaCajaDTO | null>('/api/v1/caja/apertura/activa');
}

// Cierre de caja
export interface CierreCajaDTO {
  fecha: string;
  totalVentas: number;
  totalGanancias: number;
  totalTransacciones: number;
  ventasAnuladas: number;
  desglosePorFormaPago: { formaPago: string; total: number; cantidad: number }[];
  ventasPorVendedor?: { vendedor: string; rol: string; totalVentas: number; transacciones: number }[];
}

export async function fetchCierreCaja(fecha?: string): Promise<ApiResponse<CierreCajaDTO>> {
  const q = fecha ? `?fecha=${fecha}` : '';
  return request<CierreCajaDTO>(`/api/v1/ventas/cierre-caja${q}`);
}

// IA / Asistente
const AI_BASE = import.meta.env.VITE_AI_URL || 'http://localhost:8001';

export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export async function iaChat(
  messages: ChatMsg[],
  context?: Record<string, unknown>
): Promise<{ success: boolean; message?: string; error?: string }> {
  const jwt_token = localStorage.getItem('access_token') ?? undefined;
  try {
    const res = await fetch(`${AI_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context, jwt_token }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.detail ?? 'Error en el servicio de IA' };
    return data as { success: boolean; message?: string };
  } catch {
    return { success: false, error: 'No se puede conectar con el servicio de IA. Asegúrate de que esté ejecutándose en el puerto 8001.' };
  }
}

export interface UpsellSugerencia {
  nombre: string;
  razon: string;
  precioVenta: number;
}

export async function iaUpsell(
  cartItems: { nombre: string; cantidad: number; precioUnitario: number }[]
): Promise<{ success: boolean; sugerencias?: UpsellSugerencia[]; error?: string }> {
  const jwt_token = localStorage.getItem('access_token') ?? undefined;
  try {
    const res = await fetch(`${AI_BASE}/api/upsell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_items: cartItems, jwt_token }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.detail ?? 'Error en el servicio de IA' };
    return data as { success: boolean; sugerencias?: UpsellSugerencia[] };
  } catch {
    return { success: false, error: 'No se puede conectar con el servicio de IA.' };
  }
}

export async function iaInsights(
  tipo: 'ventas' | 'inventario' | 'general',
  datos: Record<string, unknown>
): Promise<{ success: boolean; insight?: string; error?: string }> {
  try {
    const res = await fetch(`${AI_BASE}/api/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, datos }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.detail ?? 'Error en el servicio de IA' };
    return data as { success: boolean; insight?: string };
  } catch {
    return { success: false, error: 'No se puede conectar con el servicio de IA.' };
  }
}

export interface PackSugerido {
  nombre: string;
  descripcion: string;
  productos: { nombre: string; cantidad: number; precio_unitario: number }[];
  precio_individual_total: number;
  precio_pack_sugerido: number;
  descuento_porcentaje: number;
  margen_estimado: string;
}

export interface ProductoAComprar {
  nombre: string;
  motivo: string;
  cantidad_minima_sugerida: number;
}

export interface PacksRecomendacion {
  packs_sugeridos: PackSugerido[];
  productos_a_comprar: ProductoAComprar[];
}

// ── Fidelización ──────────────────────────────────────────────────────────────

export interface ConfigFidelizacionDTO {
  id: number;
  solesPorPunto: number;
  puntosPorSolDescuento: number;
  maxPuntosCanjeporVenta: number;
  minCompraParaCanje: number;
  activo: boolean;
}

export interface PuntosMovimientoDTO {
  id: number;
  tipo: 'ACUMULACION' | 'CANJE' | 'AJUSTE_MANUAL';
  cantidad: number;
  saldoDespues: number;
  motivo?: string;
  ventaNumero?: string;
  fecha: string;
}

export async function fetchFidelizacionConfig(): Promise<ApiResponse<ConfigFidelizacionDTO>> {
  return request<ConfigFidelizacionDTO>('/api/v1/fidelizacion/config');
}

export async function updateFidelizacionConfig(
  data: Partial<ConfigFidelizacionDTO>
): Promise<ApiResponse<ConfigFidelizacionDTO>> {
  return request<ConfigFidelizacionDTO>('/api/v1/fidelizacion/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchHistorialPuntos(
  clienteId: number,
  page = 0,
  size = 20
): Promise<ApiResponse<{ content: PuntosMovimientoDTO[]; totalElements: number }>> {
  return request<{ content: PuntosMovimientoDTO[]; totalElements: number }>(
    `/api/v1/fidelizacion/historial/${clienteId}?page=${page}&size=${size}`
  );
}

export async function ajusteManualPuntos(data: {
  clienteId: number;
  cantidad: number;
  motivo?: string;
}): Promise<ApiResponse<void>> {
  return request<void>('/api/v1/fidelizacion/ajuste', { method: 'POST', body: JSON.stringify(data) });
}

// ── Gastos Operativos ──────────────────────────────────────────────────────────

export interface GastoDTO {
  id: number;
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
  comprobante?: string;
  observaciones?: string;
  usuario: string;
  fechaCreacion?: string;
}

export interface CrearGastoRequest {
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
  comprobante?: string;
  observaciones?: string;
}

export async function fetchGastos(params?: {
  desde?: string;
  hasta?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: GastoDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.desde) q.set('desde', params.desde);
  if (params?.hasta) q.set('hasta', params.hasta);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: GastoDTO[]; totalElements: number }>(`/api/v1/gastos?${q}`);
}

export async function crearGasto(body: CrearGastoRequest): Promise<ApiResponse<GastoDTO>> {
  return request<GastoDTO>('/api/v1/gastos', { method: 'POST', body: JSON.stringify(body) });
}

export async function eliminarGasto(id: number): Promise<ApiResponse<void>> {
  return request<void>(`/api/v1/gastos/${id}`, { method: 'DELETE' });
}

// ── Mermas ─────────────────────────────────────────────────────────────────────

export interface MermaDTO {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  motivo: string;
  descripcion?: string;
  valorPerdida: number;
  fecha: string;
  usuario: string;
}

export interface RegistrarMermaRequest {
  productoId: number;
  cantidad: number;
  motivo: string;
  descripcion?: string;
}

export async function fetchMermas(params?: {
  desde?: string;
  hasta?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<{ content: MermaDTO[]; totalElements: number }>> {
  const q = new URLSearchParams();
  if (params?.desde) q.set('desde', params.desde);
  if (params?.hasta) q.set('hasta', params.hasta);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.size != null) q.set('size', String(params.size));
  return request<{ content: MermaDTO[]; totalElements: number }>(`/api/v1/mermas?${q}`);
}

export async function registrarMerma(body: RegistrarMermaRequest): Promise<ApiResponse<MermaDTO>> {
  return request<MermaDTO>('/api/v1/mermas', { method: 'POST', body: JSON.stringify(body) });
}

export async function iaPacks(
  productos: { nombre: string; categoria?: string; precioVenta: number; precioCompra?: number; stockActual: number }[],
  packsExistentes: { nombre: string; productos: string[]; precioPack: number }[]
): Promise<{ success: boolean; recomendaciones?: PacksRecomendacion; error?: string }> {
  try {
    const res = await fetch(`${AI_BASE}/api/packs-recomendacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos, packs_existentes: packsExistentes }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.detail ?? 'Error en el servicio de IA' };
    return data as { success: boolean; recomendaciones?: PacksRecomendacion };
  } catch {
    return { success: false, error: 'No se puede conectar con el servicio de IA.' };
  }
}
