import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/auth/Protectedroute'
import AppShell from './components/layout/AppShell'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Recipes from './pages/Recipes'
import Planner from './pages/Planner'
import ShoppingList from './pages/ShoppingList'

function ProtectedApp({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedApp><Dashboard /></ProtectedApp>} />
          <Route path="/recipes" element={<ProtectedApp><Recipes /></ProtectedApp>} />
          <Route path="/planner" element={<ProtectedApp><Planner /></ProtectedApp>} />
          <Route path="/shopping" element={<ProtectedApp><ShoppingList /></ProtectedApp>} />
          <Route path="/profile" element={<ProtectedApp><Profile /></ProtectedApp>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
