import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ProductsPage from '../pages/ProductsPage'
import StorePage from '../pages/StorePage'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import ErrorBoundary from '../components/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/products',
        element: <ProtectedRoute><ProductsPage /></ProtectedRoute>,
      },
      {
        path: '/store',
        element: <ProtectedRoute><StorePage /></ProtectedRoute>,
      },
    ],
  },
])
