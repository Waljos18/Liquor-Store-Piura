# **Indicaciones para el capitulo II del TAA**

# **Capítulo II: Planificación del Proyecto**

## **Enfoque de Gestión del Proyecto y del Ciclo de Vida a Aplicar**

Se refiere a los diversos enfoques y etapas que se usarán para planificar, ejecutar y controlar un proyecto de software.

### **Enfoque de Gestión de Proyecto**

Metodologías para gestionar un proyecto:

*   **Predictivo (Clásico o Cascada)**  
    Enfoque secuencial donde cada etapa se completa antes de pasar a la siguiente.

*   **Adaptativo (Ágil)**  
    Basado en la entrega incremental del producto, con ciclos cortos de desarrollo y pruebas.

### **Ciclo de vida**

Etapas desde el inicio hasta la finalización del proyecto:

*   **Inicio:** Definición del alcance y documentos iniciales.
*   **Planificación:** Detalle de tareas, recursos y cronograma.
*   **Ejecución:** Realización de actividades.
*   **Seguimiento y control:** Monitoreo y ajuste.
*   **Cierre:** Finalización y documentación.

***

## **Justificación del Enfoque del Proyecto**

La elección depende de la naturaleza del proyecto, complejidad, experiencia del equipo y preferencias del cliente.

Ejemplo:

> Se usará un enfoque ágil, con ciclo iterativo e incremental basado en **Scrum**, debido a:

*   Flexibilidad y adaptabilidad.
*   Mayor colaboración y comunicación.
*   Mayor transparencia y visibilidad.
*   Mejora continua mediante retrospectivas.
*   Mayor motivación y compromiso del equipo.

***

## **Arquitectura del Software a Utilizar**

Estructura interna de un sistema y cómo se relacionan sus componentes.

Patrones de arquitectura comunes:

*   **Patrón de capas:** Presentación, lógica de negocio, acceso a datos.
*   **Cliente-servidor:** Cliente que solicita servicios y servidor que los entrega.
*   **MVC:** Modelo, vista y controlador separados.
*   **Microservicios:** Servicios pequeños y desacoplados comunicados por APIs.

***

## **Modelos y Artefactos a Aplicar**

### **Modelos**

*   **Modelo de cascada:** Secuencial, adecuado para proyectos pequeños y bien definidos.
*   **Modelo espiral:** Iterativo, combina cascada con RAD.
*   **Modelo de prototipos:** Permite validar requisitos con un prototipo funcional.
*   **Modelo ágil:** Entregas incrementales, adaptable a cambios.

### **Artefactos**

*   Especificaciones de requisitos.
*   Casos de uso.
*   Diagramas de flujo.
*   Código fuente.
*   Pruebas.

***

# **Planificación del Proyecto**

Contiene cómo se ejecutará, controlará y cerrará el proyecto: alcance, objetivos, cronograma, beneficios, interesados, supuestos, FCE, riesgos y matriz de comunicaciones.

***

## **Enunciado de Alcance del Proyecto (EAP)**

Define:

*   Descripción del producto o servicio final.
*   Principales entregables.
*   Exclusiones del proyecto.

### **Ejemplo de Enunciado de Alcance para un Software Web de Inventario**

#### **Descripción del Proyecto**

El software permitirá:

*   Registrar entrada y salida de productos.
*   Visualizar stock actual.
*   Generar informes PDF y Excel.
*   Configurar alertas de stock bajo.

#### **Entregables**

*   **Sitio web:** interfaz adaptable, gestión completa de inventario, informes, seguridad.
*   **Documentación:** manual de usuario y guía técnica.

#### **Exclusiones**

*   Diseño gráfico personalizado.
*   Integración con terceros.
*   Soporte técnico post-lanzamiento más allá de 30 días.

#### **Criterios de Aceptación**

*   Cumplimiento de requisitos funcionales y no funcionales.
*   Compatibilidad con navegadores modernos.
*   Seguridad y facilidad de uso.
*   Documentación completa.

#### **Restricciones**

*   Presupuesto: **20,000 USD**.
*   Duración: **15 semanas**.
*   Equipo: **3 desarrolladores + 1 diseñador**.

***

## **Objetivos del Proyecto**

### **Objetivo general**

Meta principal (SMART).  
Ejemplo:

> Desarrollar una aplicación móvil para aumentar ventas en 20% en un año.

### **Objetivos específicos**

*   Diseñar interfaz intuitiva.
*   Implementar sistema de pagos seguro.
*   Desarrollar estrategia de marketing para 1 millón de usuarios.

***

## **Beneficios del Proyecto**

Entre 3 y 5 beneficios:

*   Reducción de tiempos.
*   Reducción de costos.
*   Incremento de la capacidad.
*   Incremento de la calidad y satisfacción del cliente.

***

## **Cronograma**

Representación gráfica del tiempo estimado para cada actividad (imagen).

***

## **Interesados**

Personas o grupos afectados por las decisiones o resultados del proyecto.

***

## **Supuestos**

Condiciones consideradas ciertas, pero no verificables.

***

## **Restricciones**

Limitaciones que afectan alcance, costo, tiempo o calidad.

Ejemplos:

*   Presupuesto disponible.
*   Plazo límite.
*   Recursos humanos y materiales.

***

## **Factores Críticos de Éxito (FCE)**

De 3 a 5 elementos esenciales:

*   Cumplimiento de requisitos.
*   Gestión eficaz del tiempo.
*   Comunicación eficaz.

***

## **Riesgos**

Eventos inciertos que afectan el proyecto.

### **Ejemplo con metalenguaje Causa–Riesgo–Impacto:**

> Debido a los efectos colaterales del COVID‑19, el resfrío de un miembro del equipo demorará una semana; por lo tanto, sus entregables pueden atrasarse.

***

## **Matriz de Comunicaciones**

Define quién recibe qué información, con qué frecuencia y por cuál canal.

| Stakeholder          | Información         | Formato    | Frecuencia | Responsable         | Canal               |
| -------------------- | ------------------- | ---------- | ---------- | ------------------- | ------------------- |
| Cliente              | Informes de avance  | PDF        | Semanal    | Gerente de proyecto | Correo electrónico  |
| Equipo del proyecto  | Seguimiento         | Reunión    | Semanal    | Gerente de proyecto | Presencial          |
| Patrocinador         | Informes de hitos   | PDF        | Mensual    | Gerente de proyecto | Email               |
| Equipo de desarrollo | Tareas              | Plataforma | Diario     | Desarrolladores     | Gestor de proyectos |
| Equipo de QA         | Informes de pruebas | PDF        | Semanal    | Líder de QA         | Email               |
| Proveedores          | Actualizaciones     | Reunión    | Quincenal  | Gerente             | Reunión virtual     |

***

## **Figura 1**

> Retorno real de acciones americanas, títulos del tesoro, oro y dólar (1802–2012).  
> *Adaptado de “Stocks for the Long Run”, J. J. Siegel, 2014, McGraw Hill Education.*


