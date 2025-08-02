// src/App.js - Updated với Cart & Wishlist functionality
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

// Apollo Client
import client from './lib/apollo-client';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import { WishlistProvider } from './contexts/WishlistContext'; // 👈 Wishlist Provider
import { CartProvider } from './contexts/CartContext'; // 👈 ADD Cart Provider

// Customer Components
import CustomerLogin from './pages/Auth/Login';
import CustomerRegister from './pages/Auth/Register';
import Home from './pages/Home';
import Shop from './pages/Shop';
import BookDetail from './pages/Shop/BookDetail';
import ProtectedRoute from './components/common/ProtectedRoute';
import Wishlist from './pages/Wishlist/Wishlist'; // 👈 Wishlist Component
import Cart from './pages/Cart/Cart'; // 👈 ADD Cart Component

// Admin Components
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminCategories from './admin/pages/Categories';
import AdminBooks from './admin/pages/Books';

// Styles
import './App.css';

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');
  
  if (isCustomerLoggedIn === 'true') {
    return <Navigate to="/shop" replace />;
  }
  
  return children;
}

// Root Layout Component - 👈 UPDATED với CartProvider
function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CustomerAuthProvider>
          <WishlistProvider> {/* 👈 Wishlist Provider */}
            <CartProvider> {/* 👈 ADD Cart Provider */}
              <div className="App">
                <Outlet />
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      style: {
                        background: '#10b981',
                        color: '#fff',
                      },
                    },
                    error: {
                      duration: 4000,
                      style: {
                        background: '#ef4444',
                        color: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </CartProvider> {/* 👈 CLOSE Cart Provider */}
          </WishlistProvider> {/* 👈 CLOSE Wishlist Provider */}
        </CustomerAuthProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

// Admin Layout Wrapper
function AdminLayoutWrapper() {
  return (
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  );
}

// Create router configuration for v7 - 👈 UPDATED với Cart route
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Customer Auth Routes
      {
        path: "login",
        element: (
          <PublicRoute>
            <CustomerLogin />
          </PublicRoute>
        )
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <CustomerRegister />
          </PublicRoute>
        )
      },
      
      // Public Routes
      {
        index: true, // This is equivalent to path: "/"
        element: <Home />
      },
      
      // Book Detail Route (Public - can view without login)
      {
        path: "book/:id",
        element: <BookDetail />
      },
      
      // Protected Customer Routes
      {
        path: "shop",
        element: (
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        )
      },
      
      // 👈 Wishlist Route (Protected)
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        )
      },
      
      // 👈 ADD Cart Route (Protected)
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      
      // 👈 ADD Checkout Route (Protected) - Placeholder
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="max-w-md mx-auto text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkout Coming Soon</h2>
                <p className="text-gray-600 mb-6">
                  The checkout feature is under development. 
                  Please check back later!
                </p>
                <div className="flex gap-3 justify-center">
                  <a 
                    href="/cart" 
                    className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition-colors"
                  >
                    Back to Cart
                  </a>
                  <a 
                    href="/shop" 
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Admin Routes
      {
        path: "admin/login",
        element: <AdminLogin />
      },
      {
        path: "admin",
        element: <AdminLayoutWrapper />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />
          },
          {
            path: "dashboard",
            element: <AdminDashboard />
          },
          {
            path: "categories",
            element: <AdminCategories />
          },
          {
            path: "books",
            element: <AdminBooks />
          }
        ]
      },
      
      // Catch all route
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;