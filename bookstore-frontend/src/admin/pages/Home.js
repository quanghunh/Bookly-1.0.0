import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, UserGroupIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Bookstore</span>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/admin/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {/* Hero section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Welcome to</span>{' '}
                    <span className="block text-indigo-600 xl:inline">Bookstore</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Discover, manage, and explore our collection of books. Admin can manage inventory,
                    categories, and view comprehensive analytics.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/admin/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Admin Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Complete Bookstore Management
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Everything you need to manage your bookstore efficiently
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <BookOpenIcon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Book Management</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Add, edit, and manage your book inventory with detailed information including categories, pricing, and stock levels.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Category Organization</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Organize books into categories for better navigation and management. Create, edit, and manage category hierarchies.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <ShoppingCartIcon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Sales Analytics</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Track sales, view analytics, and get insights into your bookstore's performance with comprehensive reporting.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="bg-indigo-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Demo Access
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Use these credentials to access the admin dashboard
              </p>
              <div className="mt-6 bg-white rounded-lg shadow px-6 py-4 inline-block">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Admin Credentials:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Email:</strong> admin@bookstore.com<br />
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Bookstore Management System. Built with React & GraphQL.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;