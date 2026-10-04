# USER STORY MAP – PROCESO DE VENTAS (POS)

**Proyecto:** Chilalo Shot / PIDS3 – Sistema Gestión Integral de Licorería  
**Proceso:** Realizar venta en punto de venta (POS)  
**Versión:** 1.0  
**Fecha:** Febrero 2025

---

## 1. PERSONAS INVOLUCRADAS

| Rol | Descripción | Participación en el proceso de ventas |
|-----|-------------|----------------------------------------|
| **Vendedor / Empleado** | Persona que atiende en mostrador, opera el POS. | Ejecuta la venta: inicia venta, busca productos, arma carrito, registra pago, solicita datos para comprobante si aplica, entrega ticket/comprobante al cliente. |
| **Dueño / Administrador** | Responsable del negocio; puede actuar como vendedor. | Puede realizar las mismas tareas que el vendedor; además puede anular ventas y resolver incidencias (ej. comprobantes SUNAT). |
| **Cliente** | Persona que compra en la licorería. | Indica productos que desea; entrega el pago; opcionalmente proporciona DNI/RUC y nombre para boleta o factura; recibe productos, ticket y/o comprobante electrónico. |
| **Sistema (POS)** | Aplicación de punto de venta. | Valida stock, aplica promociones, calcula totales, registra venta, actualiza inventario, genera ticket y comprobantes. |
| **Sistema (IA)** | Motor de recomendaciones. | Sugiere productos complementarios durante el armado del carrito (opcional). |

---

## 2. ACTIVIDADES DEL PROCESO DE VENTAS

Las **actividades** son los bloques principales del flujo (eje horizontal del User Story Map):

| # | Actividad | Descripción breve |
|---|-----------|-------------------|
| **A1** | **Iniciar venta** | Abrir una nueva venta en el POS y tener listo el carrito y la búsqueda. |
| **A2** | **Armar carrito** | Buscar productos, agregar ítems con cantidad, ver precios y totales; aplicar promociones y ver sugerencias IA. |
| **A3** | **Registrar pago** | Elegir forma de pago, ingresar monto si es efectivo, ver vuelto y confirmar. |
| **A4** | **Emitir comprobante (opcional)** | Si el cliente requiere boleta/factura: capturar datos del cliente y generar/enviar comprobante electrónico. |
| **A5** | **Cerrar venta** | Confirmar venta, actualizar stock, imprimir/entregar ticket y, si aplica, comprobante al cliente. |

---

## 3. TAREAS POR ACTIVIDAD

Desglose de **tareas** que forman parte de cada actividad.

### A1 – Iniciar venta

| ID | Tarea | Responsable |
|----|--------|-------------|
| A1.1 | Iniciar nueva venta en POS (botón o atajo). | Vendedor |
| A1.2 | Disponibilizar carrito vacío y pantalla de búsqueda. | Sistema |
| A1.3 | Habilitar búsqueda por código de barras, nombre o categoría. | Sistema |

### A2 – Armar carrito

| ID | Tarea | Responsable |
|----|--------|-------------|
| A2.1 | Buscar producto por código de barras, nombre o categoría. | Vendedor |
| A2.2 | Ingresar o seleccionar cantidad a agregar. | Vendedor |
| A2.3 | Validar que exista stock suficiente para la cantidad solicitada. | Sistema |
| A2.4 | Si no hay stock: mostrar alerta y no agregar. | Sistema |
| A2.5 | Agregar ítem al carrito con precio unitario y subtotal. | Sistema |
| A2.6 | Aplicar automáticamente promociones y packs vigentes. | Sistema |
| A2.7 | Calcular y mostrar subtotal, descuentos e IGV. | Sistema |
| A2.8 | Mostrar total a pagar actualizado. | Sistema |
| A2.9 | (Opcional) Mostrar recomendaciones de productos (IA). | Sistema |
| A2.10 | (Opcional) Agregar productos sugeridos al carrito. | Vendedor |
| A2.11 | Modificar cantidad o quitar ítem del carrito si aplica. | Vendedor |
| A2.12 | Decidir si agrega más productos o pasa a pago. | Vendedor |

### A3 – Registrar pago

| ID | Tarea | Responsable |
|----|--------|-------------|
| A3.1 | Seleccionar forma de pago (efectivo, tarjeta, transferencia, mixto). | Vendedor |
| A3.2 | Si es efectivo: ingresar monto recibido del cliente. | Vendedor |
| A3.3 | Calcular y mostrar vuelto. | Sistema |
| A3.4 | Validar que el monto sea suficiente; si no, indicar monto faltante. | Sistema |
| A3.5 | Si pago mixto: registrar montos por cada medio. | Vendedor / Sistema |
| A3.6 | Confirmar venta (disparar cierre). | Vendedor |

### A4 – Emitir comprobante (opcional)

| ID | Tarea | Responsable |
|----|--------|-------------|
| A4.1 | Indicar si el cliente requiere boleta o factura electrónica. | Vendedor |
| A4.2 | Registrar tipo de documento del cliente (DNI → boleta, RUC → factura). | Vendedor |
| A4.3 | Registrar número de documento y nombre (o razón social). | Vendedor |
| A4.4 | Generar comprobante en formato UBL y enviar a SUNAT vía OSE. | Sistema |
| A4.5 | Recibir y almacenar CDR; generar PDF. | Sistema |
| A4.6 | Si hay error/conexión: guardar venta y encolar comprobante para reintento. | Sistema |
| A4.7 | (Opcional) Asociar cliente registrado para puntos de fidelización. | Vendedor / Sistema |

### A5 – Cerrar venta

| ID | Tarea | Responsable |
|----|--------|-------------|
| A5.1 | Registrar la venta en el sistema (cabecera y detalle). | Sistema |
| A5.2 | Actualizar stock (descontar cantidades por ítem). | Sistema |
| A5.3 | Registrar movimientos de inventario. | Sistema |
| A5.4 | Imprimir o mostrar ticket de venta. | Sistema |
| A5.5 | Entregar ticket al cliente. | Vendedor |
| A5.6 | Si se emitió comprobante: poner PDF a disposición (imprimir o enviar). | Sistema / Vendedor |
| A5.7 | Entregar productos y comprobante al cliente. | Vendedor |

---

## 4. USER STORY MAP (VISUAL)

Eje horizontal: **actividades**. Debajo de cada actividad: **user stories** (Como… quiero… para…).

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────────────────┬─────────────────┐
│  A1. INICIAR    │  A2. ARMAR      │  A3. REGISTRAR   │  A4. EMITIR COMPROBANTE    │  A5. CERRAR     │
│  VENTA          │  CARRITO        │  PAGO           │  (opcional)                 │  VENTA          │
├─────────────────┼─────────────────┼─────────────────┼─────────────────────────────┼─────────────────┤
│ US-1.1          │ US-2.1          │ US-3.1          │ US-4.1                       │ US-5.1          │
│ US-1.2          │ US-2.2          │ US-3.2          │ US-4.2                       │ US-5.2          │
│                 │ US-2.3          │ US-3.3          │ US-4.3                       │ US-5.3          │
│                 │ US-2.4          │ US-3.4          │ US-4.4                       │ US-5.4          │
│                 │ US-2.5          │ US-3.5          │                              │ US-5.5          │
│                 │ US-2.6          │                 │                              │ US-5.6          │
│                 │ US-2.7 (IA)     │                 │                              │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────────────────┴─────────────────┘
```

---

## 5. USER STORIES POR ACTIVIDAD

### A1 – Iniciar venta

| ID | User Story | Prioridad |
|----|------------|-----------|
| **US-1.1** | Como **vendedor** quiero **iniciar una nueva venta con un solo clic o atajo** para atender rápido al cliente. | Must |
| **US-1.2** | Como **vendedor** quiero **ver el carrito vacío y la búsqueda lista de inmediato** para empezar a agregar productos sin esperar. | Must |

### A2 – Armar carrito

| ID | User Story | Prioridad |
|----|------------|-----------|
| **US-2.1** | Como **vendedor** quiero **buscar productos por código de barras, nombre o categoría** para encontrar rápido lo que pide el cliente. | Must |
| **US-2.2** | Como **vendedor** quiero **indicar la cantidad e agregar el producto al carrito** para armar la venta. | Must |
| **US-2.3** | Como **vendedor** quiero **que el sistema no permita agregar si no hay stock** para evitar ventas que no se pueden cumplir. | Must |
| **US-2.4** | Como **vendedor** quiero **ver precio unitario, cantidad y subtotal por ítem** para confirmar que los precios son correctos. | Must |
| **US-2.5** | Como **vendedor** quiero **que se apliquen solas las promociones y packs vigentes** para no calcular descuentos a mano. | Must |
| **US-2.6** | Como **vendedor** quiero **ver el total a pagar actualizado al instante** para informar al cliente. | Must |
| **US-2.7** | Como **vendedor** quiero **ver sugerencias de productos complementarios (IA)** para ofrecer más y aumentar la venta. | Should |
| **US-2.8** | Como **vendedor** quiero **modificar cantidades o quitar ítems del carrito** para corregir antes de cobrar. | Must |

### A3 – Registrar pago

| ID | User Story | Prioridad |
|----|------------|-----------|
| **US-3.1** | Como **vendedor** quiero **elegir forma de pago (efectivo, tarjeta, transferencia, mixto)** para registrar cómo paga el cliente. | Must |
| **US-3.2** | Como **vendedor** quiero **ingresar el monto recibido en efectivo y que el sistema calcule el vuelto** para no equivocarme. | Must |
| **US-3.3** | Como **vendedor** quiero **que el sistema avise si el monto no alcanza** para pedir el faltante o cambiar forma de pago. | Must |
| **US-3.4** | Como **vendedor** quiero **confirmar la venta con un solo paso** para cerrar la transacción y que se actualice stock y se genere ticket. | Must |

### A4 – Emitir comprobante (opcional)

| ID | User Story | Prioridad |
|----|------------|-----------|
| **US-4.1** | Como **vendedor** quiero **indicar si el cliente necesita boleta o factura** para emitir el comprobante correcto. | Must |
| **US-4.2** | Como **vendedor** quiero **registrar DNI o RUC y nombre del cliente** para que el sistema genere boleta o factura electrónica. | Must |
| **US-4.3** | Como **vendedor** quiero **que el sistema envíe el comprobante a SUNAT y entregue el PDF** para cumplir la norma y darlo al cliente. | Must |
| **US-4.4** | Como **vendedor** quiero **que si falla SUNAT la venta se guarde y el comprobante se envíe después** para no bloquear la cola. | Must |
| **US-4.5** | Como **vendedor** quiero **asociar un cliente para acumular puntos de fidelización** para que el cliente pueda canjear después. | Should |

### A5 – Cerrar venta

| ID | User Story | Prioridad |
|----|------------|-----------|
| **US-5.1** | Como **vendedor** quiero **que al confirmar se registre la venta y se actualice el stock** para tener inventario y ventas al día. | Must |
| **US-5.2** | Como **vendedor** quiero **recibir el ticket impreso o en pantalla** para entregarlo al cliente. | Must |
| **US-5.3** | Como **vendedor** quiero **poder imprimir o enviar el PDF del comprobante si se emitió** para darlo al cliente. | Must |
| **US-5.4** | Como **cliente** quiero **recibir ticket y/o comprobante electrónico** para tener constancia de mi compra. | Must |

---

## 6. RESUMEN: ACTIVIDADES, PERSONAS Y TAREAS

| Actividad | Personas principales | Cantidad de tareas | User stories (Must / Should) |
|-----------|------------------------|--------------------|-------------------------------|
| A1. Iniciar venta | Vendedor, Sistema | 3 | 2 Must |
| A2. Armar carrito | Vendedor, Sistema, IA | 12 | 7 Must, 1 Should |
| A3. Registrar pago | Vendedor, Sistema | 6 | 4 Must |
| A4. Emitir comprobante | Vendedor, Sistema | 7 | 4 Must, 1 Should |
| A5. Cerrar venta | Vendedor, Sistema, Cliente | 7 | 4 Must |

---

## 7. REFERENCIAS

- `docs/MAPA_PROCESO_OPERATIVO_REALIZAR_VENTA.md` – Proceso operativo Realizar venta.
- `docs/MAPA_PROCESO_OPERATIVO_REALIZAR_VENTA.puml` – Diagrama del proceso.
- FICHA_03 – CUN "Realizar venta en punto de venta (POS)".
- Requerimientos detallados – RF-009 a RF-012.

---

**Documento elaborado por:** Equipo de Desarrollo – Proyecto Chilalo Shot  
**Versión:** 1.0
