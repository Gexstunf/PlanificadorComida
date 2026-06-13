# Meal Planner App

Aplicacion web fullstack serverless para planificar comidas semanales, gestionar recetas, controlar nutricion y generar listas de compras automaticas.

## Deploy

[Ver aplicacion en produccion](https://planificador-comida.vercel.app/login)

## Calidad y CI/CD

El repositorio incluye un pipeline de GitHub Actions en `.github/workflows/ci-cd.yml`.

El workflow se ejecuta en cada push o pull request hacia `main` y valida:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

El deploy a Vercel se ejecuta automaticamente solo en push a `main` y solo si todos los pasos de calidad pasan correctamente.

Para que el deploy funcione desde GitHub Actions hay que configurar estos secrets en GitHub:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

La estrategia de calidad, las decisiones tecnicas, los tests y las limitaciones estan documentados en [CALIDAD.md](CALIDAD.md).

## Flujo de trabajo

Todo cambio debe estar trazado en GitHub:

- Crear un issue antes de empezar una funcionalidad, mejora o bug.
- Crear una rama con convencion consistente:
  - `feature/nombre-feature`
  - `fix/nombre-bug`
  - `docs/nombre-documentacion`
  - `test/nombre-test`
- Abrir un pull request hacia `main` o `develop`, segun corresponda.
- Referenciar el issue en el PR con `Closes #numero`.
- Esperar que pase el workflow de calidad.
- Pedir revision al otro integrante.
- Dejar al menos un comentario de revision real antes de aprobar y mergear.

No se mergean cambios directo a `main`.

## Descripcion

Meal Planner es una plataforma de productividad y nutricion construida con React, Vite y Supabase. La app permite organizar recetas, planificar la semana completa, calcular una lista de compras inteligente y visualizar metricas nutricionales con una interfaz oscura, moderna y orientada a uso diario.

Cada usuario trabaja con sus propios datos autenticados mediante Supabase Auth. Las recetas, planes semanales y configuraciones quedan asociadas al usuario y protegidas con Row Level Security.

## Funcionalidades principales

### Autenticacion

- Registro e inicio de sesion con email y contrasena.
- Sesion persistente entre recargas.
- Rutas protegidas para recetas, planner, compras, dashboard y perfil.
- Cierre de sesion desde el shell principal.

### Dashboard

- Resumen semanal de comidas planificadas.
- Promedio diario de calorias y proteina.
- Visualizacion de macros inspirada en Cronometer.
- Proximas comidas y recetas recientes.
- Accesos rapidos al planificador y al recetario.

### Recetas

- Crear, editar y eliminar recetas.
- Ingredientes con cantidad y unidad.
- Imagen por receta.
- Campos de nutricion real: calorias, proteina, carbohidratos, grasas, tiempo de preparacion y dificultad.
- Fallback automatico a estimaciones nutricionales cuando no hay datos reales.
- Filtros por alto contenido proteico, vegetariano, rapido, economico y favoritos.
- Favoritos con sincronizacion opcional en Supabase y fallback local.
- Busqueda/importacion de recetas externas.

### Planificador semanal

- Calendario semanal de 7 dias por desayuno, almuerzo y cena.
- Drag and drop avanzado con `@dnd-kit`.
- Soporte para pointer, touch y teclado.
- Dock de recetas para agregar comidas rapidamente.
- Guardado automatico de entradas en Supabase.
- Resumen de cobertura semanal, calorias y proteina.
- Navegacion por semana y tabs moviles por dia.

### Lista de compras inteligente

- Generada automaticamente desde el plan semanal.
- Fusiona ingredientes duplicados por nombre y unidad.
- Categoriza ingredientes automaticamente: vegetales, proteinas, lacteos, granos, despensa, fruta y otros.
- Permite marcar items como comprados.
- Persistencia opcional de checks en Supabase y fallback local.
- Panel de progreso de compra.

### Perfil y objetivos

- Actualizacion de email y contrasena.
- Objetivos nutricionales diarios: calorias y proteina.
- Presupuesto semanal.
- Preferencias alimentarias y restricciones.
- Sincronizacion opcional en Supabase y fallback local.

## Stack tecnologico

| Tecnologia | Uso |
|---|---|
| React | Frontend SPA |
| Vite | Desarrollo, build y HMR |
| React Router | Navegacion y rutas protegidas |
| Supabase Auth | Autenticacion |
| Supabase PostgreSQL | Persistencia de datos |
| Row Level Security | Seguridad por usuario |
| Framer Motion | Animaciones y microinteracciones |
| Lucide React | Iconografia |
| dnd-kit | Drag and drop accesible y tactil |
| TailwindCSS + shadcn-compatible config | Base de sistema de diseno |
| Vitest | Pruebas unitarias |
| Vercel | Deploy |

## Base de datos

Modelo principal:

```text
auth.users
  ├─ recipes
  │   └─ recipe_ingredients
  ├─ meal_plans
  │   └─ meal_plan_entries -> recipes
  ├─ favorite_recipes
  ├─ user_nutrition_goals
  └─ shopping_checks
```

Tablas principales:

| Tabla | Descripcion |
|---|---|
| `recipes` | Recetas del usuario con datos nutricionales opcionales |
| `recipe_ingredients` | Ingredientes por receta |
| `meal_plans` | Plan semanal por usuario y fecha de inicio |
| `meal_plan_entries` | Receta asignada por dia y tipo de comida |
| `favorite_recipes` | Favoritos del usuario |
| `user_nutrition_goals` | Objetivos, preferencias y restricciones |
| `shopping_checks` | Estado comprado/no comprado por semana |

El esquema completo para crear la base de datos desde cero esta en:

```bash
meal-planner/supabase/schema.sql
```

La migracion opcional para proyectos que ya tenian las tablas base creadas esta en:

```bash
meal-planner/supabase/meal_os_upgrade.sql
```

## Instalacion local

### Requisitos

- Node.js 18+
- Cuenta de Supabase
- Proyecto Supabase configurado

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Gexstunf/PlanificadorComida.git
cd PlanificadorComida/meal-planner

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear o editar .env con las credenciales de Supabase

# 4. Crear la base de datos
# Copiar meal-planner/supabase/schema.sql en Supabase SQL Editor

# 5. Iniciar desarrollo
npm run dev
```

### Variables de entorno

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## Scripts

```bash
npm run dev      # Servidor local
npm run build    # Build de produccion
npm run preview  # Preview del build
npm run lint     # Lint del proyecto
npm run test     # Tests unitarios
npm run test:e2e # Test end-to-end con Playwright
```

## Estructura del proyecto

```text
PlanificadorComida/
├─ README.md
└─ meal-planner/
   ├─ src/
   │  ├─ components/
   │  │  ├─ layout/
   │  │  ├─ planner/
   │  │  ├─ recipes/
   │  │  └─ ui/
   │  ├─ context/
   │  ├─ hooks/
   │  ├─ lib/
   │  │  └─ __tests__/
   │  ├─ pages/
   │  ├─ styles/
   │  └─ test/
   ├─ supabase/
   ├─ components.json
   ├─ package.json
   └─ vite.config.js
```

## Validacion

Estado actual validado con:

```bash
npm run lint
npm run test
npm run build
```

## Decisiones tecnicas

- La lista de compras se deriva del plan semanal para evitar duplicacion de datos.
- Los checks de compra pueden persistirse en Supabase, pero la app mantiene fallback local para no romperse si la migracion todavia no fue aplicada.
- Las calorias y macros usan datos reales cuando existen; si faltan, se calculan estimaciones desde ingredientes.
- Los favoritos y objetivos nutricionales tambien tienen fallback local mientras las tablas opcionales no existan.
- El drag and drop usa `dnd-kit` para soportar mouse, touch y accesibilidad por teclado.
