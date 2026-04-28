import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/auth/Navbar'

// Páginas de Alumno 1
import Login    from './pages/Login'
import Register from './pages/Register'

// Páginas de Alumno 2 (se agregan cuando estén listas)
import Recipes      from './pages/Recipes'
import Planner      from './pages/Planner'
import ShoppingList from './pages/ShoppingList'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas — Alumno 2 */}
            <Route path="/recipes" element={
              <ProtectedRoute><Recipes /></ProtectedRoute>
            } />
            <Route path="/planner" element={
              <ProtectedRoute><Planner /></ProtectedRoute>
            } />
            <Route path="/shopping" element={
              <ProtectedRoute><ShoppingList /></ProtectedRoute>
            } />

            {/* Redireccion por defecto */}
            <Route path="*" element={<Navigate to="/recipes" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}