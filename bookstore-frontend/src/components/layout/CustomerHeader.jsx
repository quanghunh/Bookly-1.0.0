import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import toast from 'react-hot-toast';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X, 
  Book,
  LogOut
} from 'lucide-react';

const CustomerHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Always call hooks at the top level - never conditionally
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.warn('Logout error:', error);
      // Fallback navigation
      window.location.href = '/login';
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/shop" className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">BookStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/shop"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <User size={20} />
                <span className="hidden md:block text-sm">{user?.name || 'Guest'}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  My Orders
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Cart */}
            <div className="relative">
              <Link
                to="/cart"
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart size={20} />
              </Link>
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/shop"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-600 hover:text-red-700 font-medium transition-colors flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerHeader;