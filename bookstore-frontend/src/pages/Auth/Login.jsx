import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { CUSTOMER_LOGIN_MUTATION } from '../../graphql/customer-queries';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [customerLogin, { loading, error }] = useMutation(CUSTOMER_LOGIN_MUTATION, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('✅ Login response:', data);
      
      if (data?.customerLogin?.success) {
        const user = data.customerLogin.user;
        login(user);
        toast.success(data.customerLogin.message || 'Login successful!');
        navigate('/shop');
      } else {
        const message = data?.customerLogin?.message || 'Login failed';
        console.log('❌ Login failed:', message);
        toast.error(message);
      }
    },
    onError: (error) => {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
      toast.error(error.message || 'Login failed. Please try again.');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Attempting login with:', {
      email: formData.email,
      password: '***hidden***'
    });
    
    try {
      await customerLogin({
        variables: {
          input: {
            email: formData.email,
            password: formData.password
          }
        }
      });
    } catch (error) {
      console.error('💥 Submit error:', error);
      // Error is also handled in onError callback
    }
  };

  // Mock login for testing
  const handleMockLogin = () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'customer@bookstore.com',
      role: 'customer'
    };
    
    login(mockUser);
    toast.success('Mock login successful!');
    navigate('/shop');
  };

  // Test direct fetch to GraphQL
  const handleTestDirectFetch = async () => {
    console.log('🧪 Testing direct fetch to GraphQL...');
    
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CustomerLogin($input: CustomerLoginInput!) {
              customerLogin(input: $input) {
                success
                message
                user {
                  id
                  name
                  email
                  role
                }
              }
            }
          `,
          variables: {
            input: {
              email: 'customer@bookstore.com',
              password: 'customer123'
            }
          }
        }),
      });
      
      const result = await response.json();
      console.log('🔍 Direct fetch result:', result);
      toast.success('Check console for direct fetch result');
    } catch (error) {
      console.error('💥 Direct fetch error:', error);
      toast.error('Direct fetch failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Debug info */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">GraphQL Error:</h3>
            <pre className="text-xs text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Test buttons */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Testing:</h3>
          <div className="space-y-2">
            <button
              onClick={handleMockLogin}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700"
            >
              Mock Login (No GraphQL)
            </button>
            <button
              onClick={handleTestDirectFetch}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md text-sm hover:bg-purple-700"
            >
              Test Direct Fetch
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-12 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in with GraphQL...
                </div>
              ) : (
                'Sign in with GraphQL'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Test credentials: customer@bookstore.com / customer123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;