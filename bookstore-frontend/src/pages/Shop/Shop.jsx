import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import { books as originalBooks, categories as originalCategories } from '../../data/books';

// Extended products data - kết hợp data gốc với thêm sản phẩm
const additionalBooks = [
  {
    id: 6,
    title: "The Innovation Mindset",
    author: "Alex Morgan",
    price: 950,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=center",
    rating: 4,
    category: "Business",
    inStock: true,
    featured: false
  },
  {
    id: 7,
    title: "Cooking Mastery",
    author: "Chef Williams",
    price: 750,
    originalPrice: 900,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=250&fit=crop&crop=center",
    rating: 5,
    discount: 15,
    category: "Recipe",
    inStock: true,
    featured: false
  },
  {
    id: 8,
    title: "Mindful Living",
    author: "Sarah Jones",
    price: 680,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=250&fit=crop&crop=center",
    rating: 4,
    category: "Lifestyle",
    inStock: true,
    featured: false
  },
  {
    id: 9,
    title: "Digital Marketing 2024",
    author: "Mark Thompson",
    price: 1200,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8c2b21c?w=200&h=250&fit=crop&crop=center",
    rating: 5,
    category: "Business",
    inStock: false,
    featured: false
  },
  {
    id: 10,
    title: "Mystery of the Old Manor",
    author: "Detective Holmes",
    price: 820,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=250&fit=crop&crop=center",
    rating: 4,
    category: "Mystery",
    inStock: true,
    featured: false
  },
  {
    id: 11,
    title: "Healthy Recipe Collection",
    author: "Dr. Green",
    price: 590,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=250&fit=crop&crop=center",
    rating: 5,
    category: "Recipe",
    inStock: true,
    featured: false
  },
  {
    id: 12,
    title: "Urban Lifestyle Guide",
    author: "City Explorer",
    price: 720,
    originalPrice: 850,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=250&fit=crop&crop=center",
    rating: 4,
    discount: 15,
    category: "Lifestyle",
    inStock: true,
    featured: false
  }
];

// Combine original books with additional books
const allProducts = [...originalBooks, ...additionalBooks];

// Categories cho filter
const allCategoryNames = [...new Set(allProducts.map(book => book.category))];
const shopCategories = ["All", ...allCategoryNames];

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" }
];

// Header Component - EXACT từ Home.jsx với Shop active
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      {/* Top Info Bar */}
      <div className="hidden md:block bg-gray-50 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-3 text-center py-2 text-sm">
            <div>
              Need any help? Call us <a href="tel:112233344455" className="text-primary-500 hover:underline">112233344455</a>
            </div>
            <div className="border-l border-r border-gray-200">
              Summer sale discount off 60% off! <a href="#" className="text-primary-500 underline hover:no-underline">Shop Now</a>
            </div>
            <div>
              2-3 business days delivery & free returns
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary-500">BookHub</a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="/shop" className="nav-link active">Shop</a>
            <a href="#" className="nav-link">Blogs</a>
            <div className="relative group dropdown">
              <button className="nav-link">Pages</button>
              <div className="dropdown-menu w-48 left-0">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About</a>
                <a href="/shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Shop</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Single Product</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cart</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Checkout</a>
              </div>
            </div>
            <a href="#" className="nav-link">Contact</a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="text-gray-700 hover:text-primary-500 transition-colors"
              title="Search"
            >
              🔍
            </button>
            <button className="text-gray-700 hover:text-primary-500 transition-colors" title="Account">
              👤
            </button>
            <div className="relative group dropdown">
              <button className="text-gray-700 hover:text-primary-500 transition-colors" title="Wishlist">
                ❤️
              </button>
              <div className="dropdown-menu w-80 right-0 p-4">
                <h4 className="flex justify-between items-center mb-3">
                  <span className="text-primary-500 font-medium">Your wishlist</span>
                  <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">2</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">The Emerald Crown</h5>
                      <small className="text-gray-500">Special discounted price.</small>
                    </div>
                    <span className="text-primary-500 font-bold">$2000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group dropdown">
              <button className="text-gray-700 hover:text-primary-500 transition-colors flex items-center" title="Cart">
                🛒
                <span className="ml-1 text-sm">(02)</span>
              </button>
              <div className="dropdown-menu w-80 right-0 p-4">
                <h4 className="flex justify-between items-center mb-3">
                  <span className="text-primary-500 font-medium">Your cart</span>
                  <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">2</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Secrets of the Alchemist</h5>
                      <small className="text-gray-500">High quality in good price.</small>
                    </div>
                    <span className="text-primary-500 font-bold">$870</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button size="sm" className="w-full">View Cart</Button>
                  <Button variant="primary" size="sm" className="w-full">Go to checkout</Button>
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-gray-700 hover:text-primary-500"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Search Popup */}
      {isSearchOpen && (
        <div className={`search-popup ${isSearchOpen ? 'is-visible' : ''}`}>
          <div className="container-custom text-center">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
            </button>
            <div className="max-w-2xl mx-auto">
              <form className="mb-8">
                <input 
                  type="search" 
                  placeholder="Type and press enter" 
                  className="w-full text-2xl border-b-2 border-gray-300 focus:border-primary-500 outline-none py-4 bg-transparent"
                  autoFocus
                />
              </form>
              <h5 className="text-lg font-medium mb-4 uppercase tracking-wider">Browse Categories</h5>
              <div className="flex flex-wrap justify-center gap-4 text-xl">
                {allCategoryNames.map((category, index) => (
                  <a key={index} href="#" className="text-gray-700 hover:text-primary-500 transition-colors">
                    {category}
                    {index < allCategoryNames.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''} lg:hidden`}>
          <div className="mobile-menu-panel">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary-500">Bookly</h1>
                <button onClick={() => setIsMenuOpen(false)}>
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <a href="/" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">Home</a>
                <a href="#" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">About</a>
                <a href="/shop" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">Shop</a>
                <a href="#" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">Blogs</a>
                <a href="#" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">Contact</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Breadcrumb Component
const Breadcrumb = () => {
  return (
    <div className="bg-gray-50 py-4">
      <div className="container-custom">
        <nav className="flex items-center space-x-2 text-sm">
          <a href="/" className="text-gray-500 hover:text-primary-500">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Shop</span>
        </nav>
      </div>
    </div>
  );
};

// Product Card Component - giống BookCard trong Home.jsx
const ProductCard = ({ product, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    alert(`Added "${product.title}" to cart!`);
  };

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex-shrink-0 relative">
          {product.discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-primary-500 text-white px-2 py-1 text-xs rounded">
                {product.discount}% off
              </span>
            </div>
          )}
          <img 
            src={product.image} 
            alt={product.title}
            className="w-32 h-40 object-cover rounded"
          />
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h6 className="font-bold text-lg text-gray-900 mb-1 hover:text-primary-500 transition-colors cursor-pointer">
                {product.title}
              </h6>
              <p className="text-gray-500 text-sm mb-2">by {product.author}</p>
              <StarRating rating={product.rating} className="mb-2" />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500 font-bold text-xl">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 ml-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                title="Add to Wishlist"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view - EXACT như BookCard trong Home.jsx
  return (
    <div 
      className="book-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary-500 text-white px-3 py-1 text-sm rounded-md">
            {product.discount}% off
          </span>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Hover Actions */}
        <div className="book-card-actions">
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-gray-900 text-white p-2 rounded hover:bg-primary-500 transition-colors disabled:bg-gray-500"
            title="Add to Cart"
          >
            🛒
          </button>
          <button 
            className="bg-gray-900 text-white p-2 rounded hover:bg-primary-500 transition-colors"
            title="Add to Wishlist"
          >
            ❤️
          </button>
        </div>
      </div>

      <h6 className="font-bold text-gray-900 mb-2">
        <a href="#" className="hover:text-primary-500 transition-colors">{product.title}</a>
      </h6>
      
      <div className="flex items-center mb-2">
        <p className="text-gray-500 text-sm mr-2">{product.author}</p>
        <StarRating rating={product.rating} />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-primary-500 font-bold text-lg">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
          )}
        </div>
        <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
};

// Sidebar Filter Component
const Sidebar = ({ selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Categories</h4>
        <div className="space-y-2">
          {shopCategories.map((category) => {
            const count = category === 'All' 
              ? allProducts.length 
              : allProducts.filter(book => book.category === category).length;
            
            return (
              <label key={category} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="mr-3 text-primary-500"
                  />
                  <span className="text-gray-700 hover:text-primary-500 transition-colors">
                    {category}
                  </span>
                </div>
                <span className="text-xs text-gray-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Price Range</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price: ${priceRange.min}</label>
            <input
              type="range"
              min="0"
              max="1500"
              value={priceRange.min}
              onChange={(e) => onPriceChange('min', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price: ${priceRange.max}</label>
            <input
              type="range"
              min="0"
              max="1500"
              value={priceRange.max}
              onChange={(e) => onPriceChange('max', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>${priceRange.min}</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input type="checkbox" className="mr-3 text-primary-500" defaultChecked />
              <span className="text-gray-700">In Stock</span>
            </div>
            <span className="text-xs text-gray-400">({allProducts.filter(p => p.inStock).length})</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input type="checkbox" className="mr-3 text-primary-500" />
              <span className="text-gray-700">Out of Stock</span>
            </div>
            <span className="text-xs text-gray-400">({allProducts.filter(p => !p.inStock).length})</span>
          </label>
        </div>
      </div>

      {/* Featured Books */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Featured Books</h4>
        <div className="space-y-4">
          {originalBooks.filter(p => p.featured).slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h6 className="font-medium text-sm text-gray-900 line-clamp-1 hover:text-primary-500 transition-colors">{product.title}</h6>
                <p className="text-xs text-gray-500">{product.author}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-primary-500 font-bold text-sm">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-xs">${product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-3 py-2 border rounded-lg ${
            page === currentPage 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'text-gray-600 hover:bg-gray-50'
          } ${page === '...' ? 'cursor-default' : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
};

// Footer Component - EXACT từ Home.jsx
const Footer = () => {
  return (
    <footer className="bg-white border-t section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-primary-500 mb-4">Bookly</h2>
            <p className="text-gray-600 mb-6">
              Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">📘</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">🐦</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">📷</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">📌</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm">Track Your Order</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm">Returns Policies</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm">Shipping + Delivery</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm">Faqs</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contact Us</h5>
            <p className="text-gray-600 text-sm mb-4">
              Do you have any queries or suggestions? <a href="mailto:yourinfo@gmail.com" className="text-primary-500 underline">yourinfo@gmail.com</a>
            </p>
            <p className="text-gray-600 text-sm">
              If you need support? Just give us a call. <a href="tel:+551112223334" className="text-primary-500 underline">+55 111 222 333 44</a>
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row gap-8 mb-4 md:mb-0">
              <div className="flex items-center">
                <p className="text-sm text-gray-600 mr-4">We ship with:</p>
                <div className="flex space-x-2">
                  <span className="bg-gray-200 px-2 py-1 text-xs rounded">DHL</span>
                  <span className="bg-gray-200 px-2 py-1 text-xs rounded">FedEx</span>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-600 mr-4">Payment options:</p>
                <div className="flex space-x-2">
                  <span className="bg-gray-200 px-2 py-1 text-xs rounded">💳</span>
                  <span className="bg-gray-200 px-2 py-1 text-xs rounded">🅿️</span>
                  <span className="bg-gray-200 px-2 py-1 text-xs rounded">💰</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                © Copyright 2024 Bookly. HTML Template by{' '}
                <a href="https://templatesjungle.com/" target="_blank" rel="noopener noreferrer" className="text-primary-500">
                  TemplatesJungle
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Shop Component
const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const itemsPerPage = 9;

  // Filter và sort products
  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
    return categoryMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-az':
        return a.title.localeCompare(b.title);
      case 'name-za':
        return b.title.localeCompare(a.title);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: 1500 });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb />
      
      {/* Shop Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
              <p className="text-gray-600">
                Showing {startIndex + 1}–{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} results
                {selectedCategory !== 'All' && (
                  <span className="ml-2 text-primary-500 font-medium">in "{selectedCategory}"</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  title="Grid View"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  title="List View"
                >
                  ☰
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden bg-primary-500 text-white px-4 py-2 rounded-lg"
              >
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-1/4 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <Sidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:w-3/4">
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <Button onClick={clearFilters} variant="primary">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-6"
                }>
                  {currentProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsSidebarOpen(false)}>
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <Sidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop; 