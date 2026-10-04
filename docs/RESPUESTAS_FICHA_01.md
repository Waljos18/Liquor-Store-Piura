# RESPUESTAS A PREGUNTAS DE LA FICHA 01

## 1. ¿En qué consiste el Machine Learning que se implementará en el sistema?

El Machine Learning (ML) implementado en el sistema consiste en **múltiples modelos de inteligencia artificial** diseñados para automatizar decisiones de negocio y optimizar operaciones de la licorería:

### 1.1 Modelos de Recomendación de Productos
- **Algoritmo:** Filtrado colaborativo
- **Funcionalidad:** Analiza patrones de compra históricos para sugerir productos complementarios durante la venta
- **Ejemplo:** Si un cliente compra cerveza, el sistema sugiere automáticamente snacks, hielo o limones basándose en compras previas de otros clientes
- **Beneficio:** Aumenta el ticket promedio de venta mediante recomendaciones inteligentes

### 1.2 Predicción de Demanda
- **Algoritmo:** Series temporales (ARIMA/Prophet simplificado)
- **Funcionalidad:** Predice qué productos se agotarán en los próximos 3-7 días y sugiere cantidades a comprar
- **Entrada:** Historial de ventas, tendencias estacionales, días de la semana
- **Salida:** Alertas proactivas de productos a reponer y sugerencias de cantidad óptima
- **Beneficio:** Evita desabastecimiento y optimiza el capital invertido en inventario

### 1.3 Optimización de Inventario
- **Algoritmo:** Regresión y análisis estadístico
- **Funcionalidad:** 
  - Sugiere stock mínimo y máximo recomendado por producto
  - Identifica productos con exceso de inventario
  - Detecta productos de baja rotación que necesitan promoción
- **Beneficio:** Reduce pérdidas por productos vencidos y optimiza la gestión de capital

### 1.4 Segmentación de Clientes
- **Algoritmo:** Clustering (K-means)
- **Funcionalidad:** Agrupa clientes por patrones de compra para personalizar ofertas y promociones
- **Beneficio:** Permite estrategias de marketing dirigidas y programas de fidelización efectivos

### 1.5 Sugerencias Automáticas de Promociones
- **Algoritmo:** Análisis de asociación y reglas de negocio
- **Funcionalidad:** 
  - Sugiere packs basados en productos frecuentemente comprados juntos
  - Recomienda descuentos para productos de baja rotación
  - Analiza efectividad de promociones pasadas
- **Beneficio:** Maximiza ventas mediante promociones estratégicas

### Tecnologías Utilizadas:
- **Scikit-learn:** Para modelos de predicción y clustering
- **Pandas:** Para análisis y procesamiento de datos
- **NumPy:** Para cálculos numéricos
- **Joblib:** Para persistencia de modelos entrenados
- **Python 3.10+ con FastAPI:** Para el servicio de IA

---

## 2. ¿Qué servicios cloud gratuitos se usarán en el proyecto?

Para mantener el presupuesto mínimo del proyecto académico, se utilizarán los siguientes **servicios cloud gratuitos**:

### 2.1 Hosting de Aplicaciones Web
- **Render** (tier gratuito): Para hosting del backend Spring Boot
  - 750 horas/mes gratuitas
  - Auto-deploy desde GitHub
  - SSL incluido
- **Railway** (tier gratuito): Alternativa para backend
  - $5 crédito mensual gratuito
  - Deploy automático
- **Vercel** (tier gratuito): Para frontend React
  - Hosting gratuito ilimitado
  - CDN global incluido
  - Deploy automático desde Git

### 2.2 Base de Datos Cloud
- **Supabase** (tier gratuito): PostgreSQL como servicio
  - 500 MB de base de datos
  - 2 GB de almacenamiento de archivos
  - API REST automática
- **Neon** (tier gratuito): PostgreSQL serverless
  - 512 MB de almacenamiento
  - Auto-scaling
  - Branching de base de datos

### 2.3 Almacenamiento de Archivos
- **Supabase Storage** (incluido en tier gratuito): Para imágenes de productos
- **Cloudinary** (tier gratuito): Alternativa para optimización de imágenes
  - 25 GB de almacenamiento
  - Transformaciones de imagen

### 2.4 Otros Servicios Gratuitos
- **GitHub** (gratis): Repositorio de código, CI/CD básico
- **GitHub Actions** (gratis): Automatización de builds y tests
- **MongoDB Atlas** (tier gratuito): Si se requiere NoSQL (opcional)
  - 512 MB de almacenamiento

### Nota sobre Límites:
Los servicios gratuitos tienen limitaciones que son suficientes para desarrollo y pruebas. Para producción real, podría requerirse upgrade a planes de pago según el volumen de datos y tráfico.

---

## 3. ¿Qué es el OSE de SUNAT?

**OSE (Operador de Servicios Electrónicos)** es una **empresa privada autorizada por SUNAT** que actúa como intermediario entre el contribuyente y SUNAT para la emisión y envío de comprobantes electrónicos (boletas y facturas).

### 3.1 Funciones del OSE:
- **Intermediación:** Conecta el sistema de la licorería con los servicios de SUNAT
- **Validación:** Verifica que los comprobantes cumplan con las normativas vigentes
- **Transmisión:** Envía los comprobantes electrónicos a SUNAT de forma segura
- **Consulta:** Permite consultar el estado de los comprobantes enviados
- **Almacenamiento:** Guarda los comprobantes emitidos según normativa

### 3.2 ¿Por qué se necesita un OSE?
SUNAT no permite conexión directa de sistemas pequeños. El OSE:
- Simplifica la integración técnica
- Proporciona APIs más amigables que las de SUNAT directamente
- Ofrece soporte técnico y documentación
- Gestiona la seguridad y certificados digitales

### 3.3 OSEs Comunes en Perú:
- **Nubefact**
- **Facturador Electrónico**
- **SOLSE**
- **Otros OSEs autorizados por SUNAT**

### 3.4 Costo:
El OSE es un servicio **pagado por el cliente (licorería)**, no por el desarrollador. El costo típico es de $30-50 USD/mes según el volumen de comprobantes.

---

## 4. ¿De qué manera se integrarán las APIs de SUNAT al sistema?

La integración con las APIs de SUNAT se realizará a través del **OSE (Operador de Servicios Electrónicos)** mediante el siguiente flujo:

### 4.1 Arquitectura de Integración:

```
Sistema Web/POS → Backend Spring Boot → API del OSE → SUNAT
```

### 4.2 Proceso de Integración:

#### Paso 1: Configuración Inicial
- El cliente (licorería) debe tener:
  - Certificado digital vigente
  - Cuenta activa con un OSE
  - Datos del establecimiento configurados en SUNAT

#### Paso 2: Integración en Backend Spring Boot
- **Librerías Java:** Se utilizarán librerías Java para facturación electrónica (ej: `facturador-electronico-java`)
- **API REST del OSE:** El backend se conectará a la API REST del OSE seleccionado
- **Autenticación:** Mediante tokens API proporcionados por el OSE

#### Paso 3: Flujo de Emisión de Comprobante
1. **Generación del XML:** El backend genera el XML del comprobante según formato UBL 2.1
2. **Firma Digital:** El OSE firma digitalmente el XML con el certificado del cliente
3. **Envío a SUNAT:** El OSE envía el XML a SUNAT
4. **Respuesta:** SUNAT responde con el CDR (Constancia de Recepción) o errores
5. **Almacenamiento:** Se guarda el XML, PDF y CDR en la base de datos

#### Paso 4: Consultas y Validaciones
- **Consulta de estado:** Verificar si un comprobante fue aceptado por SUNAT
- **Reenvío:** En caso de error, reintentar el envío
- **Consulta de tickets:** Para comprobantes que requieren consulta posterior

### 4.3 Endpoints del Backend:
```java
POST /api/comprobantes/emitir-boleta
POST /api/comprobantes/emitir-factura
GET /api/comprobantes/consultar-estado/{id}
GET /api/comprobantes/descargar-pdf/{id}
```

### 4.4 Manejo de Errores:
- **Validación previa:** Verificar datos antes de enviar a SUNAT
- **Reintentos automáticos:** En caso de fallos temporales de conexión
- **Logging:** Registrar todos los intentos y respuestas
- **Notificaciones:** Alertar al usuario sobre comprobantes rechazados

### 4.5 Ambiente de Pruebas:
- Se utilizará el **ambiente de pruebas de SUNAT** (beta) durante desarrollo
- El OSE proporciona credenciales de prueba
- Permite validar la integración sin afectar datos reales

---

## 5. ¿En qué IDE se desarrollará el backend Spring Boot?

El backend Spring Boot se desarrollará utilizando **IntelliJ IDEA Community Edition**, que es la versión gratuita del IDE de JetBrains.

### 5.1 IntelliJ IDEA Community Edition:
- **Costo:** Gratuito (open source)
- **Licencia:** Apache 2.0
- **Características principales:**
  - Soporte completo para Java y Spring Boot
  - Autocompletado inteligente
  - Refactoring avanzado
  - Debugging integrado
  - Integración con Maven/Gradle
  - Soporte para Git
  - Terminal integrado

### 5.2 Alternativas Consideradas:
- **VS Code** (gratis): Con extensiones para Java y Spring Boot
  - Extensión: "Extension Pack for Java"
  - Más ligero que IntelliJ
  - Buena opción si se prefiere editor más simple

### 5.3 Plugins Recomendados para IntelliJ:
- **Spring Boot:** Soporte nativo incluido
- **Lombok:** Para reducir código boilerplate
- **Database Navigator:** Para gestión de base de datos
- **REST Client:** Para probar APIs
- **Git Integration:** Incluido por defecto

### 5.4 Configuración del Proyecto:
- **Build Tool:** Maven o Gradle
- **Java Version:** Java 17+ (LTS)
- **Spring Boot Version:** 3.x
- **Project Structure:** Estándar Maven/Gradle

### Nota:
Para estudiantes, también está disponible **IntelliJ IDEA Ultimate** mediante **GitHub Student Pack**, que incluye funcionalidades adicionales como soporte para bases de datos avanzado y herramientas de profiling.

---

## 6. ¿Qué es el QA de la Semana 13?

**QA (Quality Assurance / Aseguramiento de Calidad)** en la Semana 13 se refiere a la **fase de pruebas y validación completa del sistema** antes del despliegue a producción.

### 6.1 Actividades de QA en Semana 13:

#### 6.1.1 Testing Funcional
- **Pruebas de todos los módulos:**
  - Módulo de Ventas (POS)
  - Módulo de Inventario
  - Módulo de Facturación Electrónica
  - Módulo de Promociones
  - Módulo de Reportes
  - Módulo de IA (recomendaciones y predicciones)

#### 6.1.2 Testing de Integración
- **Pruebas de integración con SUNAT:**
  - Emisión de boletas electrónicas
  - Emisión de facturas electrónicas
  - Consulta de estado de comprobantes
  - Manejo de errores y rechazos
- **Pruebas de integración frontend-backend:**
  - Verificar que todas las APIs funcionen correctamente
  - Validar flujos completos de usuario

#### 6.1.3 Testing de Rendimiento
- **Carga del sistema:**
  - Simular múltiples usuarios concurrentes
  - Verificar tiempos de respuesta
  - Validar que el POS responda en < 30 segundos por venta
- **Pruebas de base de datos:**
  - Consultas con grandes volúmenes de datos
  - Optimización de queries

#### 6.1.4 Testing de Seguridad
- **Validación de autenticación:**
  - Login y logout
  - Manejo de sesiones
  - Tokens JWT
- **Validación de autorización:**
  - Permisos por rol (Admin, Vendedor)
  - Acceso a módulos restringidos
- **Validación de datos:**
  - Prevención de SQL Injection
  - Validación de inputs
  - Sanitización de datos

#### 6.1.5 Testing de Usabilidad
- **Pruebas con usuario final:**
  - El dueño de la licorería prueba el sistema
  - Validar que sea intuitivo para 1-2 personas
  - Verificar que la curva de aprendizaje sea mínima
- **Pruebas de accesibilidad:**
  - Interfaz clara y fácil de usar
  - Navegación intuitiva

#### 6.1.6 Testing de Modelos de IA
- **Validación de recomendaciones:**
  - Verificar que las recomendaciones sean relevantes
  - Probar con datos de prueba
- **Validación de predicciones:**
  - Comparar predicciones con datos históricos reales
  - Verificar precisión de modelos

#### 6.1.7 Corrección de Bugs
- **Identificación de errores:**
  - Documentar todos los bugs encontrados
  - Priorizar por severidad (crítico, alto, medio, bajo)
- **Corrección:**
  - Corregir bugs críticos y de alta prioridad
  - Documentar soluciones implementadas

### 6.2 Herramientas de QA Utilizadas:
- **JUnit:** Para pruebas unitarias del backend
- **Jest + React Testing Library:** Para pruebas del frontend
- **Postman/Insomnia:** Para pruebas de APIs
- **Selenium/Cypress:** Para pruebas end-to-end (opcional)
- **JMeter:** Para pruebas de carga (opcional)

### 6.3 Entregables de QA Semana 13:
- **Reporte de pruebas:** Documento con resultados de todas las pruebas
- **Lista de bugs:** Bugs encontrados y estado de corrección
- **Métricas de calidad:** Cobertura de código, tiempo de respuesta, etc.
- **Sistema probado y validado:** Listo para despliegue en Semana 14

### 6.4 Criterios de Aceptación:
El sistema pasa QA cuando:
- ✅ Todos los módulos principales funcionan correctamente
- ✅ Integración con SUNAT funciona al 100%
- ✅ No hay bugs críticos pendientes
- ✅ Tiempo de respuesta cumple con los requisitos
- ✅ Usuario final valida que el sistema es usable
- ✅ Cobertura de tests > 70%

---

## Resumen

Estas respuestas proporcionan el detalle técnico necesario para completar la FICHA_01 y demuestran el conocimiento profundo del proyecto, las tecnologías utilizadas y los procesos de desarrollo e integración.
