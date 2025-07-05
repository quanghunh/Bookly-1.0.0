import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

// Apollo Client
import client from './lib/apollo-client';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import Home from './pages/Home';

// Admin Components (we'll create these next)
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminCategories from './admin/pages/Categories';
import AdminBooks from './admin/pages/Books';

// Styles
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="books" element={<AdminBooks />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
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
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;