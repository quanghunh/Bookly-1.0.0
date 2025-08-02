// BookDetail.jsx - Updated with Cart & Wishlist integration

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useWishlist } from '../../contexts/WishlistContext'; // 👈 ADD THIS IMPORT
import { useCart } from '../../contexts/CartContext'; // 👈 ADD THIS IMPORT
import toast from 'react-hot-toast';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';

// ===================================================================
// UPDATED GraphQL Queries - Match your backend schema
// ===================================================================

// Try this query first - matches your existing backend structure
const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    books(limit: 1, search: $id) {
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
        pages
        language
        publishedYear
        publisher
        isActive
        isFeatured
        tags
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
          description
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

// Alternative query if you have a direct book query
const GET_BOOK_DETAIL_ALT = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
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
      pages
      language
      publishedYear
      publisher
      isActive
      isFeatured
      tags
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
        description
      }
    }
  }
`;

// Fallback query using existing books query with filter
const GET_ALL_BOOKS_FALLBACK = gql`
  query GetAllBooks {
    books {
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
        pages
        language
        publishedYear
        publisher
        isActive
        isFeatured
        tags
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
          description
        }
      }
    }
  }
`;

const GET_RELATED_BOOKS = gql`
  query GetRelatedBooks($limit: Int) {
    books(limit: $limit) {
      books {
        id
        title
        author
        price
        originalPrice
        rating
        reviewCount
        stock
        coverImage {
          url
          alt
        }
        category {
          id
          name
        }
      }
    }
  }
`;

// ===================================================================
// Custom Hook for Book Data with Fallback Strategy
// ===================================================================

const useBookDetail = (id) => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try primary query first
  const { data: primaryData, loading: primaryLoading, error: primaryError } = useQuery(GET_BOOK_BY_ID, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id
  });

  // Fallback to all books query if primary fails
  const { data: fallbackData, loading: fallbackLoading, error: fallbackError } = useQuery(GET_ALL_BOOKS_FALLBACK, {
    errorPolicy: 'all',
    skip: !primaryError || primaryLoading
  });

  useEffect(() => {
    if (primaryLoading || fallbackLoading) {
      setLoading(true);
      return;
    }

    if (primaryData?.books?.books?.length > 0) {
      // Found book using primary query
      const book = primaryData.books.books.find(b => b.id === id) || primaryData.books.books[0];
      setBookData(book);
      setLoading(false);
      setError(null);
    } else if (fallbackData?.books?.books?.length > 0) {
      // Fallback to finding book in all books
      const book = fallbackData.books.books.find(b => b.id === id);
      if (book) {
        setBookData(book);
        setLoading(false);
        setError(null);
      } else {
        setError(new Error('Book not found'));
        setLoading(false);
      }
    } else {
      setError(primaryError || fallbackError || new Error('Book not found'));
      setLoading(false);
    }
  }, [id, primaryData, fallbackData, primaryLoading, fallbackLoading, primaryError, fallbackError]);

  return { data: bookData, loading, error };
};

// ===================================================================
// Header Component (reused) - 👈 UPDATED WITH CART & WISHLIST
// ===================================================================

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount } = useWishlist(); // 👈 ADD WISHLIST HOOK
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
                <Link to="/" className="text-gray-700 font-semibold uppercase text-sm tracking-wider">Home</Link>
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
          </div>
        </div>
      )}
    </>
  );
};

// ===================================================================
// Product Info Component - 👈 UPDATED WITH CART & WISHLIST
// ===================================================================

const ProductInfo = ({ book }) => {
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist, removeFromWishlist } = useWishlist(); // 👈 ADD WISHLIST HOOK
  const { addToCart, isInCart, getItemQuantity } = useCart(); // 👈 ADD CART HOOK
  const navigate = useNavigate();
  
  const isBookInWishlist = isInWishlist(book.id);
  const isBookInCart = isInCart(book.id);
  const currentCartQuantity = getItemQuantity(book.id);

  const handleAddToCart = () => {
    if (book.stock === 0) {
      toast.error('This book is out of stock');
      return;
    }

    const success = addToCart(book, quantity);
    
    if (success) {
      // If the book is in wishlist, remove it from wishlist when added to cart
      if (isBookInWishlist) {
        removeFromWishlist(book.id);
        toast.success(`"${book.title}" moved from wishlist to cart!`);
      }
      
      // Navigate to cart page after adding
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }
  };

  const handleBuyNow = () => {
    if (book.stock === 0) {
      toast.error('This book is out of stock');
      return;
    }
    
    // Add to cart first
    const success = addToCart(book, quantity);
    
    if (success) {
      // Remove from wishlist if it's there
      if (isBookInWishlist) {
        removeFromWishlist(book.id);
      }
      
      // Navigate directly to checkout
      navigate('/checkout');
      toast.success('Proceeding to checkout...');
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(book);
  };

  const discountPercentage = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Title & Author */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        <p className="text-lg text-gray-600">by <span className="font-medium">{book.author}</span></p>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <StarRating rating={Math.round(book.rating || 4)} />
          <span className="ml-2 text-sm text-gray-600">({book.reviewCount || 0} reviews)</span>
        </div>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-600">{book.sold || 0} sold</span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-pink-500">{(book.price || 0).toLocaleString()}đ</span>
        {book.originalPrice && book.originalPrice > book.price && (
          <>
            <span className="text-xl text-gray-400 line-through">{book.originalPrice.toLocaleString()}đ</span>
            <span className="bg-pink-500 text-white px-3 py-1 text-sm rounded-full">
              -{discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          (book.stock || 0) > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            (book.stock || 0) > 0 ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          {(book.stock || 0) > 0 ? `${book.stock} in stock` : 'Out of stock'}
        </span>
        {isBookInCart && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {currentCartQuantity} in cart
          </span>
        )}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
        <div>
          <span className="text-sm text-gray-600">Publisher:</span>
          <p className="font-medium">{book.publisher || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Published Year:</span>
          <p className="font-medium">{book.publishedYear || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Pages:</span>
          <p className="font-medium">{book.pages || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Language:</span>
          <p className="font-medium">{book.language || 'N/A'}</p>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
              className="px-3 py-2 hover:bg-gray-50"
              disabled={quantity >= (book.stock || 99)}
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons - 👈 UPDATED WITH CART & WISHLIST */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={(book.stock || 0) === 0}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
            </svg>
            {isBookInCart ? `Add ${quantity} More` : 'Add to Cart'}
          </Button>
          <Button
            variant="primary"
            onClick={handleBuyNow}
            disabled={(book.stock || 0) === 0}
            className="flex-1"
          >
            Buy Now
          </Button>
          <Button
            variant={isBookInWishlist ? "primary" : "secondary"}
            onClick={handleToggleWishlist}
            className="sm:w-auto flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill={isBookInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isBookInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>

        {/* Quick Actions Info */}
        <div className="text-sm text-gray-600 space-y-1">
          {isBookInCart && (
            <p className="text-blue-600">
              ✓ This book is already in your cart ({currentCartQuantity} items)
            </p>
          )}
          {isBookInWishlist && (
            <p className="text-pink-600">
              ❤️ This book is in your wishlist
            </p>
          )}
          <p>📦 Free shipping on orders over 200,000đ</p>
          <p>🔄 30-day return policy</p>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      )}
    </div>
  );
};

// ===================================================================
// Footer Component (reused)
// ===================================================================

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
  );
};

// ===================================================================
// Main BookDetail Component
// ===================================================================

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, loading, error } = useBookDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-300 h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-300 w-20 h-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded"></div>
                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                <div className="bg-gray-300 h-10 rounded w-1/3"></div>
                <div className="bg-gray-300 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error?.message || "The book you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/shop')}>
                Browse All Books
              </Button>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
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
            <Link to="/shop" className="text-gray-600 hover:text-pink-500">Shop</Link>
            {book.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  to={`/shop?category=${book.category.slug}`}
                  className="text-gray-600 hover:text-pink-500"
                >
                  {book.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{book.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={book.coverImage?.url || book.images?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <ProductInfo book={book} />
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Details */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">ISBN:</span>
                <p className="text-gray-900">{book.isbn || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Publisher:</span>
                <p className="text-gray-900">{book.publisher || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Published Year:</span>
                <p className="text-gray-900">{book.publishedYear || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Pages:</span>
                <p className="text-gray-900">{book.pages || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Language:</span>
                <p className="text-gray-900">{book.language || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <p className="text-gray-900">{book.category?.name || 'N/A'}</p>
              </div>
            </div>
            
            {book.tags && book.tags.length > 0 && (
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-600 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/cart" className="block">
                <Button variant="secondary" className="w-full">
                  View Cart
                </Button>
              </Link>
              <Link to="/wishlist" className="block">
                <Button variant="secondary" className="w-full">
                  View Wishlist
                </Button>
              </Link>
              <Link to="/shop" className="block">
                <Button variant="secondary" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Contact our customer service
              </p>
              <p className="text-sm">
                📞 <a href="tel:112233344455" className="text-pink-500 font-medium">112233344455</a>
              </p>
              <p className="text-sm">
                ✉️ <a href="mailto:support@bookly.com" className="text-pink-500 font-medium">support@bookly.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">You might also like</h3>
            <Link to="/shop" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-gray-200 h-32 rounded-lg mb-2 group-hover:shadow-md transition-shadow"></div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-pink-500">
                  Sample Book {i}
                </h4>
                <p className="text-sm text-gray-600 mb-1">Author {i}</p>
                <p className="text-sm font-bold text-pink-500">
                  {(50000 + i * 10000).toLocaleString()}đ
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;