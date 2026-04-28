# 🍽️ Meal Planner

Aplicación web para planificar comidas semanales, gestionar recetas y llevar un seguimiento de la alimentación diaria.

## Tecnologías utilizadas

- **React 19** — librería de UI basada en componentes
- **Vite 8** — bundler y servidor de desarrollo ultrarrápido con HMR
- **React Router DOM v7** — manejo de rutas del lado del cliente
- **Supabase** — backend como servicio: base de datos PostgreSQL, autenticación y almacenamiento en tiempo real
- **ESLint** — linting del código JavaScript/JSX

## Estructura del proyecto

```
Meal-Planner/
└── meal-planner/
    ├── public/          # Archivos estáticos públicos
    ├── src/
    │   ├── assets/      # Imágenes, íconos y recursos estáticos
    │   ├── App.jsx      # Componente raíz de la aplicación
    │   ├── App.css      # Estilos del componente raíz
    │   ├── index.css    # Estilos globales
    │   └── main.jsx     # Punto de entrada de React
    ├── index.html       # HTML base
    ├── vite.config.js   # Configuración de Vite
    ├── eslint.config.js # Configuración de ESLint
    └── package.json     # Dependencias y scripts
```

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en [Supabase](https://supabase.com) con un proyecto creado

## Instalación y uso

1. Clonar el repositorio:

```bash
git clone https://github.com/Gexstunf/Meal-Planner.git
cd Meal-Planner/meal-planner
```

2. Instalar las dependencias:

```bash
npm install
```

3. Configurar las variables de entorno. Crear un archivo `.env` en la carpeta `meal-planner/` con las credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Correr el servidor de desarrollo:

```bash
npm run dev
```

La aplicación va a estar disponible en `http://localhost:5173`.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Analiza el código con ESLint |

## Estado del proyecto

El proyecto se encuentra en fase de desarrollo inicial. La base del proyecto está configurada con React + Vite y las dependencias principales instaladas.