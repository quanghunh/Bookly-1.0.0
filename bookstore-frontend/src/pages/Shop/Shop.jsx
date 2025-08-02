import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams, Link } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useWishlist } from '../../contexts/WishlistContext'; // 👈 ADD THIS IMPORT
import toast from 'react-hot-toast';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';

// GraphQL Queries
const GET_CUSTOMER_BOOKS = gql`
  query GetCustomerBooks($page: Int, $limit: Int, $search: String, $category: String, $sortBy: String, $sortOrder: String) {
    books(page: $page, limit: $limit, search: $search, category: $category, sortBy: $sortBy, sortOrder: $sortOrder) {
      books {
        id
        title
        author
        isbn
        description
        price
        originalPrice
        rating
        reviewCount
        stock
        sold
        isActive
        isFeatured
        coverImage {
          url
          alt
        }
        images {
          url
          alt
          isMain
        }
        category {
          id
          name
          slug
        }
        tags
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      slug
      bookCount
      isFeatured
      isActive
      sortOrder
    }
  }
`;

// Header Component - 👈 UPDATED WITH WISHLIST
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount } = useWishlist(); // 👈 ADD WISHLIST HOOK

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
              <Link to="/shop" className="text-gray-900 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Shop</Link>
              <a href="#" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Blogs</a>
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-pink-500 font-semibold uppercase text-sm tracking-wider">Pages</a>
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About</a>
                  <Link to="/shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Shop</Link>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Single Product</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cart</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Checkout</a>
                </div>
              </div>
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

          {/* Mobile Menu - 👈 UPDATED WITH WISHLIST */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Home</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">About</a>
                <Link to="/shop" className="text-gray-900 font-semibold uppercase text-sm tracking-wider">Shop</Link>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Blogs</a>
                <a href="#" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Contact</a>
                <Link to="/wishlist" className="text-gray-700 font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                  Wishlist ({wishlistCount})
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

// Book Card Component - 👈 UPDATED WITH WISHLIST
const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist(); // 👈 ADD WISHLIST HOOK
  const isBookInWishlist = isInWishlist(book.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.stock === 0) {
      toast.error('This book is out of stock');
      return;
    }
    toast.success(`Added "${book.title}" to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  const discountPercentage = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <Link 
      to={`/book/${book.id}`}
      className="relative bg-white rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-pink-500 text-white px-3 py-1 text-sm rounded-md">
            -{discountPercentage}% off
          </span>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={book.coverImage?.url || book.images?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'} 
          alt={book.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Hover Actions - 👈 UPDATED WITH WISHLIST */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <button 
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
            </svg>
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={`p-2 rounded transition-colors ${
              isBookInWishlist 
                ? 'bg-pink-500 text-white hover:bg-pink-600' 
                : 'bg-gray-900 text-white hover:bg-pink-500'
            }`}
            title={isBookInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg className="w-5 h-5" fill={isBookInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div
            className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500 transition-colors"
            title="View Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <h6 className="font-bold text-gray-900 mb-2">
        <span className="hover:text-pink-500 transition-colors line-clamp-2">{book.title}</span>
      </h6>
      
      <div className="flex items-center mb-2">
        <p className="text-gray-500 text-sm mr-2">by {book.author}</p>
      </div>

      <div className="flex items-center mb-2">
        <StarRating rating={Math.round(book.rating)} />
        <span className="text-xs text-gray-500 ml-1">({book.reviewCount})</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-pink-500 font-bold text-lg">{book.price.toLocaleString()}đ</span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="text-gray-400 line-through text-sm">{book.originalPrice.toLocaleString()}đ</span>
          )}
        </div>
        <span className={`text-xs font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {book.category && (
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {book.category.name}
          </span>
        </div>
      )}
    </Link>
  );
};

// Filters Sidebar
const FilterSidebar = ({ categories, onFilterChange, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters & Sort
        </Button>
      </div>

      {/* Filters Sidebar */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'} bg-white rounded-lg p-6 shadow-sm border`}>
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
          <select 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
            value={currentFilters.sort || ''}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="">Default</option>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="category" 
                value=""
                checked={!currentFilters.category}
                onChange={(e) => onFilterChange('category', '')}
                className="mr-2"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value={category.slug}
                  checked={currentFilters.category === category.slug}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{category.name} ({category.bookCount})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="priceRange" 
                value=""
                checked={!currentFilters.priceRange}
                onChange={(e) => onFilterChange('priceRange', '')}
                className="mr-2"
              />
              <span className="text-sm">All Prices</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="priceRange" 
                value="0-50000"
                checked={currentFilters.priceRange === '0-50000'}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Under 50,000đ</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="priceRange" 
                value="50000-100000"
                checked={currentFilters.priceRange === '50000-100000'}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">50,000đ - 100,000đ</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="priceRange" 
                value="100000-200000"
                checked={currentFilters.priceRange === '100000-200000'}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">100,000đ - 200,000đ</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="priceRange" 
                value="200000-999999999"
                checked={currentFilters.priceRange === '200000-999999999'}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Over 200,000đ</span>
            </label>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center">
                <input 
                  type="radio" 
                  name="rating" 
                  value={rating}
                  checked={currentFilters.rating === rating.toString()}
                  onChange={(e) => onFilterChange('rating', e.target.value)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <StarRating rating={rating} />
                  <span className="text-sm ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onFilterChange('clear')}
        >
          Clear All Filters
        </Button>
      </div>
    </>
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
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...' || page === currentPage}
          className={`px-3 py-2 border rounded ${
            page === currentPage
              ? 'bg-pink-500 text-white border-pink-500'
              : page === '...'
              ? 'border-gray-300 cursor-default'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

// Footer Component (reused from Home)
const Footer = () => {
  return (
    <footer className="bg-white border-t py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Bookly</h2>
            <p className="text-gray-600 mb-6">
              Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.377-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
                </svg>
              </a>
            </div>
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
                <a href="https://templatesjungle.com/" target="_blank" rel="noopener noreferrer" className="text-pink-500">
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
    priceRange: '',
    rating: ''
  });

  const itemsPerPage = 12;

  // Get initial params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const sort = searchParams.get('sort') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const rating = searchParams.get('rating') || '';
    
    setFilters({
      search,
      category,
      sort,
      priceRange,
      rating
    });
    setCurrentPage(page);
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (key === 'clear') {
      newParams.delete('search');
      newParams.delete('category');
      newParams.delete('sort');
      newParams.delete('priceRange');
      newParams.delete('rating');
      newParams.delete('page');
      setFilters({
        search: '',
        category: '',
        sort: '',
        priceRange: '',
        rating: ''
      });
      setCurrentPage(1);
    } else {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      
      // Reset page when filters change
      if (key !== 'page') {
        newParams.delete('page');
        setCurrentPage(1);
      }
      
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateFilters('page', page.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  
  // Build variables for books query
  const buildQueryVariables = () => {
    const variables = {
      page: currentPage,
      limit: itemsPerPage
    };

    if (filters.search) variables.search = filters.search;
    if (filters.category) variables.category = filters.category;
    
    if (filters.sort) {
      const [sortBy, sortOrder] = filters.sort.split('_');
      variables.sortBy = sortBy;
      variables.sortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';
    }

    return variables;
  };

  // Fetch books
  const { data: booksData, loading: booksLoading, error: booksError } = useQuery(GET_CUSTOMER_BOOKS, {
    variables: buildQueryVariables(),
    fetchPolicy: 'cache-and-network'
  });

  const books = booksData?.books?.books || [];
  const totalCount = booksData?.books?.totalCount || 0;
  const totalPages = booksData?.books?.totalPages || 1;
  const categories = categoriesData?.categories || [];

  // Filter books by price range and rating on client side (if not handled by backend)
  const filteredBooks = books.filter(book => {
    let matchesPriceRange = true;
    let matchesRating = true;

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPriceRange = book.price >= min && book.price <= max;
    }

    if (filters.rating) {
      matchesRating = Math.round(book.rating) >= parseInt(filters.rating);
    }

    return matchesPriceRange && matchesRating;
  });

  if (booksError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">{booksError.message}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-pink-500">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
            {filters.category && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-pink-500 font-medium">
                  {categories.find(c => c.slug === filters.category)?.name || filters.category}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Shop Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar 
              categories={categories}
              onFilterChange={updateFilters}
              currentFilters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {filters.category 
                  ? categories.find(c => c.slug === filters.category)?.name || 'Shop'
                  : 'Book Shop'
                }
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-600">
                  {booksLoading ? 'Loading...' : (
                    <>
                      Showing {filteredBooks.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} results
                      {filters.search && (
                        <span className="ml-2 text-pink-600 font-medium">for "{filters.search}"</span>
                      )}
                    </>
                  )}
                </p>
                
                {/* Quick Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select 
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-pink-500"
                    value={filters.sort || ''}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.category || filters.sort || filters.priceRange || filters.rating) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                      Search: "{filters.search}"
                      <button 
                        onClick={() => updateFilters('search', '')}
                        className="ml-2 hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                      {categories.find(c => c.slug === filters.category)?.name || filters.category}
                      <button 
                        onClick={() => updateFilters('category', '')}
                        className="ml-2 hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button 
                    onClick={() => updateFilters('clear')}
                    className="text-sm text-pink-600 hover:text-pink-800 underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Books Grid */}
            {booksLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading books...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
                <Button onClick={() => updateFilters('clear')}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBooks.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;