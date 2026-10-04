# Presentación: Validación de Datos, Base de Datos y Seguridad
## Sistema de Gestión de Licorería (Chilalo Shot) — Piura

**Redacción sencilla para estudiantes.**  
Cada sección puede usarse como una diapositiva o tarjeta de presentación.

---

## 1. ¿Cuál es la importancia de validar los datos?

### Presentación breve

Validar los datos significa **revisar que la información que entra al sistema sea correcta, completa y segura** antes de guardarla o usarla.

**¿Por qué es importante?**

- **Evitar errores:** Si no validamos, podemos guardar un precio en negativo, un DNI con letras o un email sin arroba. Eso genera datos basura y reportes incorrectos.
- **Proteger la base de datos:** Datos mal formados pueden romper la estructura de las tablas o provocar fallos en la aplicación.
- **Dar buena experiencia al usuario:** Si validamos en el formulario (por ejemplo “ingrese un número de teléfono válido”), el usuario corrige de inmediato en lugar de ver un error después de enviar.
- **Seguridad:** Validar evita que alguien envíe código o comandos maliciosos disfrazados de datos normales (por ejemplo, inyección SQL o XSS).

**En resumen:** Validar es como revisar que lo que entra a nuestro sistema sea lo que realmente queremos guardar y usar. Sin validación, la información pierde confiabilidad y el sistema puede fallar o ser vulnerable.

---

## 2. ¿Mencione los tipos de validación de datos?

### Presentación breve

Los datos se pueden validar en **diferentes momentos y lugares**. Los tipos más comunes son:

| Tipo | Dónde se hace | Ejemplo |
|------|----------------|---------|
| **Validación en el cliente (frontend)** | En el navegador o en la app (formularios) | Comprobar que el email tenga “@” antes de enviar. |
| **Validación en el servidor (backend)** | En el servidor al recibir la petición | Comprobar que el usuario exista y la contraseña sea correcta. |
| **Validación en base de datos** | En la BD al insertar o actualizar | Campos `NOT NULL`, `UNIQUE`, `CHECK` (ej. `rol IN ('ADMIN','VENDEDOR')`). |
| **Validación de formato** | En cualquier capa | Que el DNI tenga 8 dígitos, que la fecha sea válida. |
| **Validación de rango** | En cualquier capa | Que la cantidad sea mayor que 0, que el descuento no supere el 100%. |
| **Validación de negocio** | Generalmente en el servidor | Que haya stock suficiente antes de registrar una venta. |

**Importante:** No basta con validar solo en el frontend; siempre hay que validar también en el backend y, cuando aplique, en la base de datos. Así nos aseguramos aunque alguien envíe datos directamente a la API.

---

## 3. ¿Qué tipo de datos se almacenan en la BD?

### Presentación breve

En la base de datos del sistema de licorería (**licoreria_db**, PostgreSQL) se guardan datos de **distintos tipos**, organizados en tablas. Resumen:

**Datos de texto (VARCHAR, TEXT):**
- Nombres de usuarios, clientes, productos, categorías, proveedores.
- Códigos (código de barras, número de venta, número de compra).
- Emails, teléfonos, direcciones.
- Documentos: DNI, RUC, tipo de documento.
- Contraseñas (guardadas encriptadas, no en texto plano).

**Datos numéricos (INTEGER, DECIMAL):**
- Precios (compra, venta, totales, descuentos).
- Cantidades (stock, unidades vendidas, cantidades en detalle de venta/compra).
- Puntos de fidelización del cliente.
- IDs (claves primarias y foráneas).

**Datos de fecha y hora (TIMESTAMP, DATE):**
- Fecha de venta, de compra, de creación y actualización de registros.
- Fechas de vencimiento de productos.
- Fechas de inicio y fin de promociones.
- Fecha de emisión y envío de comprobantes electrónicos.

**Datos lógicos (BOOLEAN):**
- Si un producto o categoría está activo.
- Si un usuario está activo.
- Si una promoción está activa.

**Otros:**
- Imágenes (ruta o referencia, a veces el archivo en otro almacenamiento).
- XML/PDF de comprobantes electrónicos (TEXT o BYTEA según cómo se guarde).

**Tablas principales:** usuarios, productos, categorias, clientes, ventas, detalle_ventas, venta_pagos, comprobantes_electronicos, movimientos_inventario, proveedores, compras, detalle_compras, promociones, promocion_productos, packs, pack_productos.

---

## 4. ¿Cuál es el propósito de mi BD?

### Presentación breve

La base de datos **licoreria_db** es el corazón del sistema de gestión de la licorería. Su propósito es:

1. **Guardar toda la información del negocio de forma ordenada:** productos, precios, stock, categorías, clientes, proveedores, usuarios del sistema, ventas, compras, pagos y comprobantes electrónicos.

2. **Permitir el control de inventario:** saber cuánto hay en stock, registrar entradas y salidas (compras, ventas, ajustes) y tener trazabilidad con la tabla de movimientos de inventario.

3. **Soportar las ventas:** registrar cada venta con su detalle (qué productos, cantidades y precios), la forma de pago y el cliente (si aplica), y vincular las facturas o boletas electrónicas.

4. **Gestionar personas:** clientes (para ventas y fidelización) y usuarios (empleados y administradores con sus roles y acceso).

5. **Soportar compras a proveedores:** registrar compras, sus detalles y los datos de los proveedores.

6. **Soportar promociones y packs:** guardar ofertas y conjuntos de productos con sus condiciones y precios.

7. **Servir de base para reportes y toma de decisiones:** con estos datos se pueden hacer consultas de ventas por período, productos más vendidos, stock bajo, etc.

**En una frase:** La BD existe para **almacenar y relacionar toda la información necesaria para operar la licorería (ventas, inventario, clientes, compras y facturación)** y que la aplicación web, la app móvil y el backend puedan consultarla y actualizarla de forma segura y consistente.

---

## 5. ¿Medidas de seguridad en la BD?

### Presentación breve

En el proyecto se aplican varias medidas de seguridad que afectan o protegen la base de datos y el acceso a los datos:

**1. Usuario y contraseña de la BD**
- La base de datos tiene un usuario dedicado (`licoreria_user`) con contraseña (`licoreria_pass`). No se usa el usuario `postgres` desde la aplicación. Las credenciales se configuran en `application.properties` y no se suben al repositorio en claro en producción.

**2. Contraseñas de usuarios encriptadas**
- Las contraseñas de los usuarios del sistema **no se guardan en texto plano**. Se usa **BCrypt** para encriptarlas antes de guardarlas en la tabla `usuarios`. Así, aunque alguien acceda a la BD, no puede ver las contraseñas reales.

**3. Autenticación con JWT**
- El acceso al API está protegido con **JWT (JSON Web Token)**. El usuario inicia sesión con usuario y contraseña; el servidor devuelve un token. Las peticiones posteriores llevan ese token y el servidor verifica que sea válido antes de ejecutar operaciones. Así se controla quién puede ver o modificar datos.

**4. Roles (ADMIN y VENDEDOR)**
- Hay roles definidos en la BD (`ADMIN`, `VENDEDOR`). El backend usa estos roles para permitir o denegar ciertas acciones (por ejemplo, solo un administrador puede hacer algunas tareas). Esto limita el daño si alguien obtiene la cuenta de un vendedor.

**5. Validación y reglas en la BD**
- Uso de `NOT NULL`, `UNIQUE`, `CHECK` y claves foráneas en el esquema. Eso evita datos incoherentes (por ejemplo, ventas sin usuario o cantidades negativas) y mantiene la integridad de los datos.

**6. Migraciones con Flyway**
- Los cambios del esquema de la BD se hacen mediante **migraciones Flyway** (scripts versionados), no modificando tablas a mano en producción. Así se controla qué cambios se aplican y se reduce el riesgo de errores o accesos indebidos por scripts mal usados.

**7. CORS**
- El backend está configurado para aceptar peticiones solo desde orígenes permitidos (por ejemplo, el frontend en localhost). Eso no protege la BD directamente pero evita que sitios no autorizados consuman el API que accede a la BD.

**Resumen:** Las medidas incluyen **cuenta dedicada de BD**, **contraseñas encriptadas con BCrypt**, **autenticación JWT**, **roles**, **integridad con constraints en la BD** y **control de cambios con Flyway**. Juntas protegen los datos y el acceso al sistema.

---

## Cómo usar este documento en la presentación

- **Una diapositiva por pregunta:** usa el título de cada sección como título de diapositiva y el contenido como bullets o texto breve.
- **Tarjetas:** puedes imprimir o mostrar cada sección como una “tarjeta” para explicar cada tema.
- **Guion:** el texto está redactado para que puedas leerlo o parafrasearlo en voz alta de forma clara.

Si quieres, puedo ayudarte a acortar alguna sección o pasarla a formato de diapositivas (por ejemplo, solo títulos y 3–4 bullets por slide).
