# 🍽️ Meal Planner App

Aplicación web fullstack serverless para planificar comidas semanales, gestionar recetas y generar listas de compras automáticas.

---

## 🚀 Deploy

> **[Ver aplicación en producción →](https://meal-planner-tu-usuario.vercel.app)**

---

## 📋 Descripción

Meal Planner es una aplicación web que permite a los usuarios:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar sus propias recetas con ingredientes detallados
- Planificar sus comidas semanales en una grilla de 7 días
- Generar automáticamente una lista de compras basada en el plan semanal

Todos los datos están asociados al usuario autenticado y almacenados en la nube, accesibles desde cualquier dispositivo.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso | Justificación |
|---|---|---|
| **React 18** | Frontend SPA | Componentes reutilizables, hooks, estado reactivo |
| **Vite** | Bundler | Desarrollo rápido, HMR, build optimizado |
| **React Router v6** | Navegación | Rutas protegidas, navegación declarativa |
| **Supabase Auth** | Autenticación | Registro, login, sesión persistente sin backend propio |
| **Supabase PostgreSQL** | Base de datos | Relacional, Row Level Security, queries SQL |
| **Vercel** | Deploy | CI/CD automático desde GitHub, edge network |

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Registro de usuario con email y contraseña
- Inicio de sesión con manejo de errores
- Cierre de sesión
- Rutas protegidas — redirige a login si no hay sesión activa
- Sesión persistente entre recargas

### 🍲 Gestión de Recetas
- Crear recetas con nombre e instrucciones
- Agregar múltiples ingredientes con cantidad y unidad
- Editar recetas existentes
- Eliminar recetas
- Todas las recetas asociadas al usuario autenticado

### 📅 Planificador Semanal
- Grilla de 7 días × 3 momentos (desayuno, almuerzo, cena)
- Asignar cualquier receta creada a cada celda
- Guardado automático en la base de datos
- Plan cargado automáticamente al ingresar

### 🛒 Lista de Compras
- Generada automáticamente desde el plan semanal
- Une ingredientes repetidos entre recetas
- Suma cantidades del mismo ingrediente y unidad
- Marcar ítems como comprados con checkbox
- Separación visual entre pendientes y comprados

---

## 🗄️ Base de Datos

### Diagrama de tablas

```
auth.users (Supabase)
    └── recipes
            └── recipe_ingredients
    └── meal_plans
            └── meal_plan_entries ──→ recipes
```

### Tablas

| Tabla | Descripción |
|---|---|
| `recipes` | Recetas del usuario (nombre, instrucciones) |
| `recipe_ingredients` | Ingredientes por receta (nombre, cantidad, unidad) |
| `meal_plans` | Plan semanal por usuario y semana |
| `meal_plan_entries` | Asignación de receta por día y momento del día |

### Seguridad — Row Level Security

Todas las tablas tienen RLS activado. Cada usuario solo puede leer y modificar sus propios datos, incluso si alguien obtuviera la clave pública de Supabase.

---

## 👥 Equipo y División de Trabajo

| Integrante | Rama | Responsabilidades |
|---|---|---|
| **Alumno 1** | `alumno1` | Autenticación, sesión, AuthContext, Navbar, ProtectedRoute, rutas, setup del proyecto |
| **Alumno 2** | `alumno2` | Supabase DB, CRUD de recetas, planificador semanal, lista de compras, supabaseClient |

---

## 🌿 Estrategia de Ramas

```
main       → producción (siempre funcional, desplegada en Vercel)
develop    → integración de ambos alumnos
alumno1    → rama de trabajo del alumno 1
alumno2    → rama de trabajo del alumno 2
```

**Flujo de trabajo:**
1. Cada alumno trabaja en su rama personal
2. Se integra a `develop` mediante Pull Requests
3. Una vez estable, `develop` se mergea a `main`

---

## ⚙️ Instalación y Uso Local

### Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/meal-planner
cd meal-planner

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar .env con las credenciales de Supabase

# 4. Crear las tablas en Supabase
# Copiar y ejecutar el SQL de /docs/database.sql en el SQL Editor de Supabase

# 5. Iniciar el servidor de desarrollo
npm run dev
```

### Variables de entorno

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Obtener los valores en: **Supabase → Settings → API**

---

## 📁 Estructura del Proyecto

```
meal-planner/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx        # Auth provider + useAuth hook
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Recipes.jsx
│   │   ├── Planner.jsx
│   │   └── ShoppingList.jsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── recipes/
│   │   │   ├── RecipeCard.jsx
│   │   │   └── RecipeForm.jsx
│   │   └── planner/
│   ├── hooks/
│   │   ├── useRecipes.js
│   │   ├── usePlanner.js
│   │   └── useShoppingList.js
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── styles/
│   │   ├── global.css
│   │   └── auth.css
│   └── App.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔄 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo en localhost:5173
npm run build    # Build de producción
npm run preview  # Preview del build de producción
```

---

## 📌 Decisiones Técnicas

**¿Por qué Supabase y no Firebase?**
Supabase usa PostgreSQL relacional, lo que permite modelar correctamente las relaciones entre recetas, ingredientes y el plan semanal. El Row Level Security de PostgreSQL es más expresivo que las reglas de Firestore.

**¿Por qué la lista de compras no se persiste en la base de datos?**
La lista de compras es datos derivados del plan semanal — siempre se puede recalcular. Persistirla crearía duplicación de datos y problemas de sincronización. El cálculo con `useMemo` es instantáneo y mantiene la lista siempre actualizada.

**¿Por qué hooks personalizados?**
Encapsular la lógica en `useRecipes`, `usePlanner` mantiene los componentes enfocados en la presentación. Si cambia la base de datos, solo se modifican los hooks.
