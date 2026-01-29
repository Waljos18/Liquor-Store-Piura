# Licorería Piura - Frontend

Este proyecto es el frontend para el Sistema de Gestión de Licorería, construido con React, Vite y TypeScript.

## Requisitos previos

- Node.js (v18 o superior)
- npm

## Instalación

1.  Navega al directorio `frontend`:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173` (por defecto).

## Estructura del Proyecto

-   `src/components/layout`: Componentes de estructura (Header, Sidebar, MainLayout).
-   `src/components/ui`: Componentes reutilizables (Button, Input, Card).
-   `src/pages`: Páginas de la aplicación (Login, Dashboard, Products, Inventory, Promotions, Reports).
-   `src/App.tsx`: Configuración de rutas.
-   `src/index.css`: Estilos globales y variables CSS.

## Estilos

Se utiliza **Vanilla CSS** con variables CSS para el sistema de diseño, ubicado en `src/index.css`.
