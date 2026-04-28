# 🍽️ Meal Planner

Aplicación web para planificar comidas semanales, gestionar recetas y llevar un seguimiento de la alimentación diaria.

🔗 **Demo en vivo:** [planificador-comida.vercel.app](https://planificador-comida.vercel.app/login)

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Librería de UI basada en componentes |
| [Vite](https://vitejs.dev/) | 8 | Bundler y servidor de desarrollo con HMR |
| [React Router DOM](https://reactrouter.com/) | v7 | Manejo de rutas del lado del cliente |
| [Supabase](https://supabase.com/) | — | Base de datos PostgreSQL, autenticación y tiempo real |
| [ESLint](https://eslint.org/) | — | Linting del código JavaScript/JSX |

---

## Estructura del proyecto

```
Meal-Planner/
└── meal-planner/
    ├── public/              # Archivos estáticos públicos
    ├── src/
    │   ├── assets/          # Imágenes, íconos y recursos estáticos
    │   ├── App.jsx          # Componente raíz de la aplicación
    │   ├── App.css          # Estilos del componente raíz
    │   ├── index.css        # Estilos globales
    │   └── main.jsx         # Punto de entrada de React
    ├── index.html           # HTML base
    ├── vite.config.js       # Configuración de Vite
    ├── eslint.config.js     # Configuración de ESLint
    └── package.json         # Dependencias y scripts
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en [Supabase](https://supabase.com) con un proyecto creado

---

## Instalación y uso local

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

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Analiza el código con ESLint |

---

## Deploy

El proyecto está desplegado en [Vercel](https://vercel.com/). Cada push a la rama `main` genera un nuevo deploy automáticamente.

Para deployar tu propia instancia:

1. Importar el repositorio desde el dashboard de Vercel.
2. Configurar las variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) en **Settings → Environment Variables**.
3. Asegurarse de que el directorio raíz apunte a `meal-planner/`.

https://planificador-comida.vercel.app/login
---

## Estado del proyecto

🚧 En desarrollo activo — base configurada con React + Vite + Supabase y desplegada en producción.