# Presentacion y Explicacion de Diagramas - Ficha 108

## Diapositiva 1 - Portada
**Titulo:** FPIPS-108 Diseno del Sistema de Informacion - Chilalo Shot  
**Subtitulo:** Presentacion de diagramas tecnicos del sistema  
**Datos:** Abril 2026 - I

**Guion (30-40 s):**  
En esta exposicion presento los diagramas clave de la Ficha 108 para el sistema Chilalo Shot. El objetivo es mostrar como se estructura la solucion a nivel de datos, arquitectura, comportamiento y despliegue, integrando backend, web y app movil.

---

## Diapositiva 2 - Objetivo de la ficha
- Definir el diseno tecnico integral del sistema.
- Alinear interfaces, persistencia y arquitectura.
- Servir como base para implementacion y pruebas.

**Guion (40 s):**  
La ficha no solo describe pantallas, sino que conecta la capa funcional con la tecnica. Por eso, los diagramas nos ayudan a reducir ambiguedades y a asegurar que el equipo implemente con la misma vision de arquitectura.

---

## Diapositiva 3 - Vista general de diagramas
**Diagramas presentados en la Ficha 108:**
1. Diagrama Entidad-Relacion (fisico)
2. Relacion Activity-ViewModel-Screen (Android)
3. Diagrama de clases
4. Diagrama de despliegue
5. Diagrama de estados
6. Diagrama de secuencia
7. Diagrama de componentes

**Guion (35 s):**  
Estos siete diagramas cubren todas las vistas importantes: datos, estructura interna, comportamiento dinamico y ejecucion en infraestructura. Con esto logramos trazabilidad desde un requerimiento hasta su implementacion tecnica.

---

## Diapositiva 4 - Diagrama ER Fisico (6.1)
**Enfoque:**
- Base de datos PostgreSQL 15 (`licoreria_db`).
- Tablas principales: usuarios, productos, clientes, ventas y detalle de ventas.
- Evolucion por migraciones Flyway hasta V18.

**Puntos clave para explicar:**
- Soporte de pagos mixtos (`venta_pagos`) y metodos multiples.
- Modulos avanzados: compras, devoluciones, gastos, mermas, fidelizacion.
- Escalabilidad del modelo por versionado de esquema.

**Guion (1 min):**  
El ER fisico garantiza integridad y crecimiento controlado. Iniciamos con tablas base de operacion comercial y, mediante Flyway, incorporamos funcionalidades del negocio real, como pagos mixtos, credito, caja y fidelizacion. Esto evidencia un diseno incremental y mantenible.

---

## Diapositiva 5 - Relacion Activity-ViewModel-Screen (6.2)
**Arquitectura Android:**
- Patrón Single Activity con Jetpack Compose.
- Navegacion central desde `MainActivity` -> `ChilaloNavGraph`.
- Flujo por estado de sesion: Splash -> Login o Main.

**Puntos clave para explicar:**
- Cada pantalla se desacopla con su ViewModel.
- Hilt inyecta dependencias (Retrofit/APIs) por modulos.
- URL de backend configurable en runtime (DataStore + NetworkModule).

**Guion (1 min):**  
Este diagrama muestra una app moderna y desacoplada. No se depende de Fragments; toda la UI se compone con funciones `@Composable`, mientras los ViewModel gestionan estado y logica. La configuracion dinamica de URL facilita pruebas en emulador, red local y produccion.

---

## Diapositiva 6 - Diagrama de Clases (6.3)
**Cobertura:**
- Backend: entidades JPA y relaciones del dominio.
- Android: clases de arquitectura MVVM.

**Puntos clave para explicar:**
- Relacion entre entidades del negocio (Venta, Detalle, Producto, Cliente).
- Separacion por responsabilidades (UI, dominio, datos).
- Reutilizacion y mantenibilidad por abstracciones.

**Guion (50 s):**  
El diagrama de clases permite validar coherencia del dominio. En backend define el modelo persistente y en Android organiza capas de presentacion y acceso a datos. Esta separacion reduce acoplamiento y simplifica pruebas unitarias.

---

## Diapositiva 7 - Diagrama de Despliegue (6.4)
**Nodos principales:**
- Cliente web (React + Vite).
- App Android (Kotlin + Compose).
- API Backend (Spring Boot).
- Base de datos PostgreSQL.

**Puntos clave para explicar:**
- Comunicacion HTTP/REST con JWT.
- Backend como punto central de negocio y seguridad.
- Posibilidad de separar ambientes desarrollo/produccion.

**Guion (50 s):**  
El despliegue evidencia que web y movil consumen un mismo backend, lo que unifica reglas de negocio y seguridad. Este enfoque evita duplicidad de logica y facilita el mantenimiento operativo en distintos entornos.

---

## Diapositiva 8 - Diagrama de Estados (6.5)
**Objeto modelado:** Venta  
**Estados tipicos:** iniciada, en proceso de pago, confirmada, comprobante emitido, anulada/devuelta.

**Puntos clave para explicar:**
- Control del ciclo de vida de la venta.
- Restricciones de transicion para evitar inconsistencias.
- Base para reglas de negocio y auditoria.

**Guion (45 s):**  
El diagrama de estados define que puede y que no puede ocurrir en una venta. Por ejemplo, no deberia emitirse comprobante sin confirmar pago. Esta vista protege la consistencia operacional del sistema POS.

---

## Diapositiva 9 - Diagrama de Secuencia (6.6)
**Escenario sugerido para exponer:** Confirmar venta
- Usuario selecciona productos.
- Frontend/App envia solicitud al backend.
- Backend valida stock, calcula total y registra venta.
- Backend devuelve respuesta y comprobante.

**Puntos clave para explicar:**
- Orden temporal de mensajes.
- Integracion entre capas (UI -> API -> DB).
- Manejo de errores y respuesta al usuario.

**Guion (1 min):**  
La secuencia ayuda a entender el comportamiento en tiempo real. Permite verificar que cada paso se ejecute en el orden correcto y facilita detectar cuellos de botella o puntos de falla, especialmente en operaciones criticas como cobrar y emitir comprobantes.

---

## Diapositiva 10 - Diagrama de Componentes (6.7)
**Componentes principales:**
- Frontend Web
- App Android
- Backend API
- Modulo de seguridad JWT
- Persistencia PostgreSQL
- Integracion de facturacion electronica

**Puntos clave para explicar:**
- Interfaces entre componentes.
- Dependencias y limites de responsabilidad.
- Facilidad para evolucionar modulos de forma independiente.

**Guion (55 s):**  
Este diagrama resume la arquitectura macro del sistema. Muestra contratos de comunicacion claros entre componentes y permite planificar mejoras sin romper todo el sistema, por ejemplo extender facturacion o agregar nuevos modulos de negocio.

---

## Diapositiva 11 - Aporte de los diagramas al proyecto
- Mejoran comunicacion entre analisis, desarrollo y QA.
- Reducen retrabajo en implementacion.
- Dan soporte a pruebas funcionales y tecnicas.
- Facilitan mantenimiento y escalado futuro.

**Guion (35 s):**  
El valor principal de los diagramas es alinear al equipo. Cuando la arquitectura, datos y flujos estan claros, se reducen errores de interpretacion y se acelera la entrega de funcionalidades con mayor calidad.

---

## Diapositiva 12 - Cierre
**Conclusiones:**
- La Ficha 108 presenta una arquitectura coherente y escalable.
- Existe trazabilidad entre requerimientos, diseno y construccion.
- Los diagramas sustentan la viabilidad tecnica del sistema Chilalo Shot.

**Guion (30-40 s):**  
En conclusion, los diagramas de la Ficha 108 no son solo documentacion: son una guia de construccion. Respaldan decisiones tecnicas clave y preparan al proyecto para una implementacion ordenada, mantenible y alineada al negocio.

---

## Recomendacion para exponer (tiempo total)
- Duracion estimada: 8 a 10 minutos.
- Ritmo recomendado: 40 a 60 segundos por diagrama.
- Cerrar con 2 preguntas para el jurado:
  - Que diagrama consideran mas critico para reducir riesgos de implementacion?
  - Desean que detallemos un caso real de secuencia en POS (pago mixto)?
