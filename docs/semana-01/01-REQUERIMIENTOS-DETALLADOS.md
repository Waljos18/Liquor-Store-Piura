# DOCUMENTO DE REQUERIMIENTOS DETALLADOS
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 1

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento
Este documento describe en detalle los requerimientos funcionales y no funcionales del Sistema Web y App Móvil con IA para Gestión Integral de Licorería, desarrollado para licorerías pequeñas en Piura (1-2 empleados).

### 1.2 Alcance
El sistema cubrirá las siguientes áreas funcionales:
- Gestión de ventas (POS)
- Control de inventario
- Facturación electrónica (SUNAT)
- Gestión de promociones y packs
- Clientes y fidelización
- Reportes y analytics
- Inteligencia artificial (recomendaciones, predicciones)

### 1.3 Audiencia
- Desarrolladores del proyecto
- Stakeholders y cliente
- Equipo de QA
- Usuarios finales (dueños/empleados de licorería)

---

## 2. REQUERIMIENTOS FUNCIONALES

### 2.1 Módulo de Autenticación y Autorización

#### RF-001: Autenticación de Usuarios
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir autenticación de usuarios mediante username/email y contraseña
- **Criterios de Aceptación:**
  - Login con email/username y contraseña
  - Generación de token JWT para sesión
  - Refresh token para renovar sesión
  - Logout seguro
  - Recuperación de contraseña por email
  - Bloqueo de cuenta después de 5 intentos fallidos

#### RF-002: Gestión de Roles
- **Prioridad:** Alta
- **Descripción:** El sistema debe soportar dos roles principales: Administrador y Vendedor
- **Criterios de Aceptación:**
  - Rol Administrador: acceso completo al sistema
  - Rol Vendedor: acceso limitado a ventas y consultas
  - Asignación de roles por usuario
  - Permisos granulares por módulo

---

### 2.2 Módulo de Gestión de Productos

#### RF-003: Registro de Productos
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir registrar productos con toda su información
- **Criterios de Aceptación:**
  - Campos obligatorios: código de barras, nombre, precio de venta, stock inicial
  - Campos opcionales: marca, categoría, precio de compra, stock mínimo/máximo, fecha de vencimiento, imagen
  - Validación de código de barras único
  - Búsqueda rápida por código, nombre o categoría
  - Edición y eliminación lógica de productos

#### RF-004: Categorización de Productos
- **Prioridad:** Media
- **Descripción:** Los productos deben organizarse por categorías
- **Criterios de Aceptación:**
  - Creación de categorías (Cervezas, Vinos, Licores, Whiskies, etc.)
  - Asignación de productos a categorías
  - Filtrado por categoría en búsquedas
  - Reportes por categoría

#### RF-005: Gestión de Imágenes
- **Prioridad:** Baja
- **Descripción:** Los productos pueden tener imágenes asociadas
- **Criterios de Aceptación:**
  - Carga de imágenes (máx. 2MB por imagen)
  - Formatos soportados: JPG, PNG, WebP
  - Redimensionamiento automático
  - Visualización en listados y detalles

---

### 2.3 Módulo de Control de Inventario

#### RF-006: Control de Stock en Tiempo Real
- **Prioridad:** Alta
- **Descripción:** El sistema debe actualizar el stock automáticamente con cada venta
- **Criterios de Aceptación:**
  - Actualización inmediata al realizar venta
  - Actualización al registrar compras
  - Historial de movimientos de inventario
  - Consulta de stock actual en tiempo real

#### RF-007: Alertas de Stock
- **Prioridad:** Alta
- **Descripción:** El sistema debe alertar cuando el stock está bajo o productos próximos a vencer
- **Criterios de Aceptación:**
  - Alerta cuando stock < stock mínimo
  - Alerta de productos próximos a vencer (7 días antes)
  - Notificaciones en dashboard
  - Lista de productos con stock bajo

#### RF-008: Ajustes de Inventario
- **Prioridad:** Media
- **Descripción:** Permitir ajustes manuales de inventario (entradas y salidas)
- **Criterios de Aceptación:**
  - Registro de ajustes con motivo
  - Entradas de inventario (compras, devoluciones)
  - Salidas de inventario (mermas, pérdidas)
  - Historial completo de ajustes

---

### 2.4 Módulo de Ventas (POS)

#### RF-009: Proceso de Venta Rápida
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir realizar ventas de forma rápida y eficiente
- **Criterios de Aceptación:**
  - Búsqueda de productos por código de barras, nombre o categoría
  - Agregar productos al carrito
  - Cálculo automático de totales
  - Aplicación automática de promociones
  - Selección de forma de pago (efectivo, tarjeta, transferencia)
  - Cálculo automático de vuelto
  - Tiempo de venta < 45 segundos

#### RF-010: Gestión de Carrito
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir gestionar el carrito de compra
- **Criterios de Aceptación:**
  - Agregar productos con cantidad
  - Modificar cantidad de productos
  - Eliminar productos del carrito
  - Aplicar descuentos manuales
  - Limpiar carrito

#### RF-011: Múltiples Formas de Pago
- **Prioridad:** Alta
- **Descripción:** El sistema debe soportar diferentes formas de pago
- **Criterios de Aceptación:**
  - Pago en efectivo
  - Pago con tarjeta
  - Pago por transferencia
  - Pago mixto (efectivo + tarjeta)
  - Registro del monto recibido y vuelto

#### RF-012: Anulación de Ventas
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir anular ventas con autorización
- **Criterios de Aceptación:**
  - Anulación solo por administrador
  - Restauración de stock al anular
  - Generación de nota de crédito si aplica
  - Historial de anulaciones

---

### 2.5 Módulo de Facturación Electrónica

#### RF-013: Emisión de Boletas
- **Prioridad:** Alta
- **Descripción:** El sistema debe emitir boletas electrónicas integradas con SUNAT
- **Criterios de Aceptación:**
  - Generación automática de boleta al completar venta
  - Envío a SUNAT mediante OSE
  - Generación de XML y PDF
  - Numeración automática por serie
  - Consulta de estado en SUNAT

#### RF-014: Emisión de Facturas
- **Prioridad:** Alta
- **Descripción:** El sistema debe emitir facturas electrónicas para clientes con RUC
- **Criterios de Aceptación:**
  - Validación de RUC del cliente
  - Generación de factura con datos del cliente
  - Envío a SUNAT
  - Generación de XML y PDF

#### RF-015: Notas de Crédito y Débito
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir emitir notas de crédito y débito
- **Criterios de Aceptación:**
  - Generación de nota de crédito por anulación
  - Generación de nota de débito por ajustes
  - Envío a SUNAT
  - Relación con comprobante original

#### RF-016: Resumen Diario de Boletas (RCB)
- **Prioridad:** Media
- **Descripción:** El sistema debe generar resumen diario de boletas para SUNAT
- **Criterios de Aceptación:**
  - Generación automática al final del día
  - Envío a SUNAT
  - Consulta de estado

---

### 2.6 Módulo de Promociones y Packs

#### RF-017: Creación de Promociones
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir crear diferentes tipos de promociones
- **Criterios de Aceptación:**
  - Descuento por porcentaje
  - Descuento por monto fijo
  - Promociones 2x1, 3x2, etc.
  - Promociones por categoría
  - Promociones por fecha (temporales)
  - Activación/desactivación de promociones

#### RF-018: Creación de Packs
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir crear packs de productos
- **Criterios de Aceptación:**
  - Crear pack con múltiples productos
  - Definir precio del pack
  - Asignar cantidades por producto
  - Activar/desactivar packs

#### RF-019: Aplicación Automática de Promociones
- **Prioridad:** Alta
- **Descripción:** El sistema debe aplicar promociones automáticamente en las ventas
- **Criterios de Aceptación:**
  - Detección automática de promociones aplicables
  - Cálculo de descuentos en tiempo real
  - Visualización de ahorro para el cliente
  - Aplicación de múltiples promociones si aplica

---

### 2.7 Módulo de Clientes y Fidelización

#### RF-020: Registro de Clientes
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir registrar clientes
- **Criterios de Aceptación:**
  - Registro con DNI o RUC
  - Datos: nombre, teléfono, email (opcional)
  - Búsqueda de clientes existentes
  - Historial de compras por cliente

#### RF-021: Programa de Fidelización
- **Prioridad:** Baja
- **Descripción:** El sistema debe gestionar programa de puntos de fidelización
- **Criterios de Aceptación:**
  - Acumulación de puntos por compra
  - Canje de puntos por descuentos
  - Consulta de puntos del cliente
  - Historial de puntos

---

### 2.8 Módulo de Reportes y Analytics

#### RF-022: Dashboard Ejecutivo
- **Prioridad:** Alta
- **Descripción:** El sistema debe mostrar dashboard con métricas clave
- **Criterios de Aceptación:**
  - Ventas del día, semana, mes
  - Productos más vendidos
  - Categorías más vendidas
  - Alertas de stock bajo
  - Gráficos de tendencias

#### RF-023: Reportes de Ventas
- **Prioridad:** Alta
- **Descripción:** El sistema debe generar reportes de ventas
- **Criterios de Aceptación:**
  - Reporte diario de ventas
  - Reporte por período (semana, mes, año)
  - Reporte por forma de pago
  - Exportación a Excel/PDF

#### RF-024: Reportes de Inventario
- **Prioridad:** Media
- **Descripción:** El sistema debe generar reportes de inventario
- **Criterios de Aceptación:**
  - Productos con stock bajo
  - Productos próximos a vencer
  - Rotación de productos
  - Valor de inventario
  - Productos sin movimiento

---

### 2.9 Módulo de Inteligencia Artificial

#### RF-025: Recomendaciones de Productos
- **Prioridad:** Media
- **Descripción:** El sistema debe recomendar productos complementarios durante la venta
- **Criterios de Aceptación:**
  - Sugerencias basadas en productos frecuentemente comprados juntos
  - Recomendaciones personalizadas para clientes frecuentes
  - Visualización de sugerencias en POS
  - Actualización de recomendaciones según historial

#### RF-026: Predicción de Demanda
- **Prioridad:** Media
- **Descripción:** El sistema debe predecir qué productos se agotarán próximamente
- **Criterios de Aceptación:**
  - Predicción de productos que se agotarán en 3-7 días
  - Sugerencia de cantidad a comprar
  - Consideración de factores estacionales
  - Alertas proactivas

#### RF-027: Sugerencias de Promociones
- **Prioridad:** Baja
- **Descripción:** El sistema debe sugerir promociones basadas en patrones de venta
- **Criterios de Aceptación:**
  - Sugerencias de packs basados en productos comprados juntos
  - Sugerencias de descuentos para productos de baja rotación
  - Análisis de efectividad de promociones pasadas

---

## 3. REQUERIMIENTOS NO FUNCIONALES

### 3.1 Rendimiento
- **RNF-001:** Tiempo de respuesta de APIs < 500ms (p95)
- **RNF-002:** Tiempo de carga de página < 2 segundos
- **RNF-003:** Proceso de venta completo < 45 segundos
- **RNF-004:** Sistema debe soportar al menos 100 productos simultáneos en inventario
- **RNF-005:** Base de datos optimizada con índices para búsquedas rápidas

### 3.2 Disponibilidad
- **RNF-006:** Sistema disponible 99% del tiempo (uptime)
- **RNF-007:** Modo offline básico para POS (consulta de productos y precios)
- **RNF-008:** Sincronización automática al recuperar conexión

### 3.3 Seguridad
- **RNF-009:** Autenticación mediante JWT con refresh tokens
- **RNF-010:** Encriptación HTTPS/TLS para todas las comunicaciones
- **RNF-011:** Validación de entrada en backend y frontend
- **RNF-012:** Prevención de SQL Injection mediante ORM
- **RNF-013:** Sanitización de inputs para prevenir XSS
- **RNF-014:** Encriptación de datos sensibles (contraseñas, información de clientes)

### 3.4 Usabilidad
- **RNF-015:** Interfaz intuitiva que requiere mínima capacitación
- **RNF-016:** Diseño responsive para diferentes tamaños de pantalla
- **RNF-017:** Atajos de teclado para operaciones comunes
- **RNF-018:** Búsqueda rápida con autocompletado

### 3.5 Escalabilidad
- **RNF-019:** Arquitectura escalable para crecimiento futuro
- **RNF-020:** Base de datos diseñada para escalar horizontalmente
- **RNF-021:** Caché para mejorar rendimiento

### 3.6 Mantenibilidad
- **RNF-022:** Código documentado y siguiendo estándares
- **RNF-023:** Cobertura de tests > 70%
- **RNF-024:** Logging estructurado para debugging

---

## 4. CASOS DE USO PRINCIPALES

### 4.1 Caso de Uso: Realizar Venta Rápida
**Actor:** Vendedor  
**Precondiciones:** Usuario autenticado, productos en inventario  
**Flujo Principal:**
1. Vendedor busca producto por código de barras o nombre
2. Sistema muestra producto y stock disponible
3. Vendedor agrega producto al carrito con cantidad
4. Sistema aplica promociones automáticamente
5. Sistema muestra total a pagar
6. Vendedor selecciona forma de pago
7. Vendedor ingresa monto recibido (si es efectivo)
8. Sistema calcula vuelto
9. Vendedor confirma venta
10. Sistema actualiza stock
11. Sistema genera boleta electrónica
12. Sistema envía boleta a SUNAT
13. Sistema imprime ticket de venta

**Flujos Alternativos:**
- Si producto no tiene stock: Sistema muestra alerta y no permite agregar
- Si hay error en envío a SUNAT: Sistema guarda venta y reintenta después

### 4.2 Caso de Uso: Registrar Compra de Productos
**Actor:** Administrador  
**Precondiciones:** Usuario autenticado con rol Administrador  
**Flujo Principal:**
1. Administrador accede a módulo de compras
2. Administrador selecciona proveedor
3. Administrador agrega productos comprados con cantidades y precios
4. Sistema actualiza precios de compra de productos
5. Sistema actualiza stock de productos
6. Administrador confirma compra
7. Sistema registra movimiento de inventario

### 4.3 Caso de Uso: Consultar Alertas de Stock
**Actor:** Administrador  
**Precondiciones:** Usuario autenticado  
**Flujo Principal:**
1. Administrador accede al dashboard
2. Sistema muestra alertas de stock bajo
3. Administrador hace clic en alerta
4. Sistema muestra lista de productos con stock bajo
5. Administrador puede generar orden de compra

---

## 5. RESTRICCIONES Y SUPUESTOS

### 5.1 Restricciones Técnicas
- Proyecto debe completarse en 14 semanas
- Presupuesto mínimo (USD 30 aprox.)
- Desarrollo individual (practicante)
- Uso de herramientas gratuitas/educativas

### 5.2 Supuestos
- Cliente cuenta con conexión a internet estable
- Cliente tiene certificado digital SUNAT y OSE configurado
- Cliente tiene disponibilidad para reuniones y capacitación
- Usuario tiene conocimientos básicos de tecnología

---

## 6. GLOSARIO

- **POS:** Point of Sale (Punto de Venta)
- **SUNAT:** Superintendencia Nacional de Aduanas y de Administración Tributaria
- **OSE:** Operador de Servicios Electrónicos
- **JWT:** JSON Web Token
- **RCB:** Resumen de Comprobantes de Boletas
- **XML:** eXtensible Markup Language
- **PDF:** Portable Document Format

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
