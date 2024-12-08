import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MainLayout: React.FC = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoginPage && (
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="text-xl font-bold">SoftScanner</div>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Products
                </Link>
                <Link
                  to="/store"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Store
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {user && (
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 mb-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-indigo-100 text-lg">
                  Manage your products and store with ease
                </p>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
