import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

// Apollo Client
import client from './lib/apollo-client';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';

// Customer Components
import CustomerLogin from './pages/Auth/Login';
import CustomerRegister from './pages/Auth/Register';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Components (giữ nguyên)
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

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CustomerAuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Customer Auth Routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <CustomerLogin />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <CustomerRegister />
                  </PublicRoute>
                } />
                
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Protected Customer Routes */}
                <Route path="/shop" element={
                  <ProtectedRoute>
                    <Shop />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes (giữ nguyên) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="books" element={<AdminBooks />} />
                </Route>
                  Route path="*" element={<Navigate to="/" replace />}
                </Routes>
              
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
                    theme: {
                      primary: 'green',
                      secondary: 'black',
                    },
                  },
                  error: {
                    duration: 4000,
                    theme: {
                      primary: 'red',
                      secondary: 'black',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </CustomerAuthProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;