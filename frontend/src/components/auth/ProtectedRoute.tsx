// src/components/auth/ProtectedRoute.tsx
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// Temporary auth check - will be replaced with real auth logic later
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()

  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute