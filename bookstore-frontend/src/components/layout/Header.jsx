// src/components/layout/Header.jsx - Updated Header with Cart Integration
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext'; // 👈 ADD CART HOOK

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart(); // 👈 ADD CART HOOK

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="hidden md:block bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 py-2 text-sm text-center">
            <div>Need any help? Call us <a href="tel:112233344455" className="text-blue-600">112233344455</a></div>
            <div className="border-l border-r border-gray-200">
              Summer sale discount off 60% off! <Link to="/shop" className="underline">Shop Now</Link>
            </div>
            <div>2-3 business days delivery & free returns</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">Bookly</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-900 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Home</Link>
              <a href="#" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">About</a>
              <Link to="/shop" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Shop</Link>
              <a href="#" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Blogs</a>
              <a href="#" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Contact</a>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 hover:text-pink-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:text-pink-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {/* 👈 UPDATED WISHLIST ICON */}
              <div className="relative">
                <Link to="/wishlist" className="p-2 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>
              </div>
              {/* 👈 UPDATED CART ICON */}
              <div className="relative">
                <Link to="/cart" className="p-2 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                  </svg>
                </Link>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - 👈 UPDATED WITH CART & WISHLIST */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-900 font-semibold uppercase text-sm tracking-wider">Home</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">About</a>
                <Link to="/shop" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Shop</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Blogs</a>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Contact</a>
                <Link to="/wishlist" className="text-gray-700 font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                  Wishlist ({wishlistCount})
                </Link>
                <Link to="/cart" className="text-gray-700 font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                  Cart ({cartCount})
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Type and press enter"
                  className="w-full text-4xl border-none outline-none text-center"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-8 text-center">
              <h5 className="text-sm uppercase tracking-wider mb-4">Browse Categories</h5>
              <div className="flex flex-wrap justify-center gap-4 text-2xl">
                {['Romance', 'Thriller', 'Sci-fi', 'Cooking', 'Health', 'Lifestyle', 'Fiction'].map((category, index) => (
                  <React.Fragment key={category}>
                    <a href="#" className="hover:text-pink-500 transition-colors">{category}</a>
                    {index < 6 && <span className="text-gray-400">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;