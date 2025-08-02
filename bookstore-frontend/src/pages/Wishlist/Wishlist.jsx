// src/pages/Wishlist/Wishlist.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft, Filter, Grid, List } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

// Header Component (reused from other pages)
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount } = useWishlist();

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
            <div>Need any help? Call us <a href="tel:112233344455" className="text-pink-600">112233344455</a></div>
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
              <Link to="/" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Home</Link>
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
              <div className="relative">
                <Link to="/wishlist" className="p-2 hover:text-pink-500 transition-colors text-pink-500">
                  <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>
              </div>
              <div className="relative">
                <button className="p-2 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Home</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">About</a>
                <Link to="/shop" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Shop</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Blogs</a>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Contact</a>
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
          </div>
        </div>
      )}
    </>
  );
};

// Wishlist Item Component
const WishlistItem = ({ item, viewMode, onRemove, onMoveToCart }) => {
  const discountPercentage = item.originalPrice && item.originalPrice > item.price 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    toast.success(`Added "${item.title}" to cart!`);
    // Add cart logic here if you have cart context
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
        <div className="md:w-32 md:h-40 flex-shrink-0">
          <img 
            src={item.coverImage?.url || item.images?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'} 
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              <Link to={`/book/${item.id}`} className="hover:text-pink-500 transition-colors">
                {item.title}
              </Link>
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove from wishlist"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-2">by {item.author}</p>
          
          <div className="flex items-center mb-2">
            <StarRating rating={Math.round(item.rating || 4)} />
            <span className="text-sm text-gray-500 ml-2">({item.reviewCount || 0} reviews)</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-pink-500">{(item.price || 0).toLocaleString()}đ</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <>
                  <span className="text-gray-400 line-through">{item.originalPrice.toLocaleString()}đ</span>
                  <span className="bg-pink-500 text-white px-2 py-1 text-xs rounded">
                    -{discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            <span className={`text-sm font-medium ${(item.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(item.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={(item.stock || 0) === 0}
              className="flex items-center gap-2 flex-1"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
            <Link to={`/book/${item.id}`}>
              <Button variant="secondary">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative mb-4">
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-pink-500 text-white px-2 py-1 text-xs rounded">
              -{discountPercentage}% OFF
            </span>
          </div>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 transition-colors shadow-sm"
          title="Remove from wishlist"
        >
          <Trash2 size={16} />
        </button>
        <img 
          src={item.coverImage?.url || item.images?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'} 
          alt={item.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        <Link to={`/book/${item.id}`} className="hover:text-pink-500 transition-colors">
          {item.title}
        </Link>
      </h3>
      
      <p className="text-gray-600 text-sm mb-2">by {item.author}</p>
      
      <div className="flex items-center mb-2">
        <StarRating rating={Math.round(item.rating || 4)} />
        <span className="text-xs text-gray-500 ml-1">({item.reviewCount || 0})</span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="text-lg font-bold text-pink-500">{(item.price || 0).toLocaleString()}đ</span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-gray-400 line-through text-sm">{item.originalPrice.toLocaleString()}đ</span>
          )}
        </div>
        <span className={`text-xs font-medium ${(item.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {(item.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={(item.stock || 0) === 0}
          className="w-full flex items-center justify-center gap-2"
          size="sm"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </Button>
        <Link to={`/book/${item.id}`} className="block">
          <Button variant="secondary" className="w-full" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Main Wishlist Component
const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, getWishlistStats, isLoading } = useWishlist();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'price_low', 'price_high', 'name'
  const navigate = useNavigate();

  const stats = getWishlistStats();

  // Sort wishlist items
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.addedAt) - new Date(b.addedAt);
      case 'price_low':
        return (a.price || 0) - (b.price || 0);
      case 'price_high':
        return (b.price || 0) - (a.price || 0);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.addedAt) - new Date(a.addedAt);
    }
  });

  const handleRemoveItem = (bookId) => {
    removeFromWishlist(bookId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-pink-500">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Heart className="text-pink-500" fill="currentColor" />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {stats.totalItems} {stats.totalItems === 1 ? 'item' : 'items'} saved for later
                {stats.totalValue > 0 && (
                  <span className="ml-2">• Total value: {stats.totalValue.toLocaleString()}đ</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/shop">
                <Button variant="secondary" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Button>
              </Link>
              {wishlistItems.length > 0 && (
                <Button 
                  onClick={handleClearAll}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite books to your wishlist and come back to them later. 
              Start exploring our collection!
            </p>
            <Link to="/shop">
              <Button className="flex items-center gap-2 mx-auto">
                Explore Books
                <ArrowLeft size={16} className="rotate-180" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-pink-500"
                  >
                    <option value="newest">Newest Added</option>
                    <option value="oldest">Oldest Added</option>
                    <option value="name">Name A-Z</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {sortedItems.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            )}

            {/* Wishlist Stats */}
            {stats.categories > 0 && (
              <div className="mt-12 bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-500">{stats.totalItems}</div>
                    <div className="text-sm text-gray-600">Total Books</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-500">{stats.totalValue.toLocaleString()}đ</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-500">{stats.categories}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                </div>
                {stats.categoryList.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Categories in your wishlist:</p>
                    <div className="flex flex-wrap gap-2">
                      {stats.categoryList.map((category, index) => (
                        <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">Bookly</h2>
              <p className="text-gray-600 mb-6">
                Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-pink-500 transition-colors text-sm uppercase tracking-wider">Home</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm uppercase tracking-wider">About</a></li>
                <li><Link to="/shop" className="text-gray-600 hover:text-pink-500 transition-colors text-sm uppercase tracking-wider">Shop</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm uppercase tracking-wider">Blogs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm uppercase tracking-wider">Contact</a></li>
              </ul>
            </div>

            {/* Help & Info */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Help & Info Help</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">Track Your Order</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">Returns Policies</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">Shipping + Delivery</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">Faqs</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contact Us</h5>
              <p className="text-gray-600 text-sm mb-4">
                Do you have any queries or suggestions? <a href="mailto:yourinfo@gmail.com" className="text-pink-500 underline">yourinfo@gmail.com</a>
              </p>
              <p className="text-gray-600 text-sm">
                If you need support? Just give us a call. <a href="tel:+551112223334" className="text-pink-500 underline">+55 111 222 333 44</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;