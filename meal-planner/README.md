# Meal Planner

Aplicacion web serverless para planificar comidas semanales, administrar recetas, calcular listas de compras y seguir objetivos nutricionales.

## Stack

- React + Vite
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage para imagenes de recetas
- Vercel para despliegue
- Vitest y ESLint para validacion

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env`:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

3. Crear la base de datos en Supabase ejecutando:

```text
supabase/schema.sql
```

4. Iniciar la app:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## Funcionalidades

- Registro, inicio y cierre de sesion.
- Rutas protegidas por usuario autenticado.
- CRUD de recetas con ingredientes e imagen.
- Planificador semanal asociado al usuario.
- Lista de compras generada desde el plan.
- Favoritos, objetivos nutricionales y preferencias.
- Persistencia en Supabase con Row Level Security.

## Base de datos

El esquema completo esta en `supabase/schema.sql`.

La migracion `supabase/meal_os_upgrade.sql` queda como referencia historica para proyectos que ya tenian las tablas base creadas y solo necesitaban agregar las funciones nuevas.
