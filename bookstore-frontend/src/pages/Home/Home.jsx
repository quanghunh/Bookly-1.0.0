import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useWishlist } from '../../contexts/WishlistContext'; // 👈 ADD THIS IMPORT
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import { testimonials, services } from '../../data/books';
import toast from 'react-hot-toast';
import CartTestComponent from '../../components/debug/CartTestComponent';
import { useCart } from '../../contexts/CartContext';
// Simple GraphQL Queries that work with backend
const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    books {
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
        isFeatured
      }
    }
  }
`;

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      id
      name
      description
      slug
      bookCount
      isFeatured
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
  const { cartCount } = useCart(); // 👈 ADD CART HOOK - THIS WAS MISSING!

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
              {/* 👈 FIXED CART ICON WITH PROPER NAVIGATION */}
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

// Hero Banner Component - Use first 3 books from database
const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, loading } = useQuery(GET_ALL_BOOKS);
  
  const fallbackSlides = [
    {
      title: "The Fine Print Book Collection",
      subtitle: "Best Offer Save 30%. Grab it now!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center"
    },
    {
      title: "How Innovation works", 
      subtitle: "Discount available. Grab it now!",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop&crop=center"
    },
    {
      title: "Your Heart is the Sea",
      subtitle: "Limited stocks available. Grab it now!",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop&crop=center"
    }
  ];

  // Get first 3 books from database
  const books = data?.books?.books || [];
  const slides = books.length > 0 
    ? books.slice(0, 3).map(book => ({
        id: book.id,
        title: book.title,
        subtitle: `By ${book.author} - ${book.price.toLocaleString()}đ`,
        image: book.coverImage?.url || book.images?.[0]?.url || fallbackSlides[0].image,
        book: book
      }))
    : fallbackSlides;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section 
      className="relative h-[700px] md:h-[800px] flex items-center bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248, 245, 242, 0.9), rgba(248, 245, 242, 0.95)), url('${slides[currentSlide].image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-5/12 md:ml-8 mt-8 md:mt-0 text-center md:text-left">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-6"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{slides[currentSlide].title}</h2>
                <p className="text-xl mb-6 text-gray-600">{slides[currentSlide].subtitle}</p>
                <div className="flex gap-4">
                  <Link to="/shop">
                    <Button size="lg">Shop Collection</Button>
                  </Link>
                  {slides[currentSlide].book && (
                    <Link to={`/book/${slides[currentSlide].book.id}`}>
                      <Button variant="secondary" size="lg">View Details</Button>
                    </Link>
                  )}
                </div>
                {slides[currentSlide].book && (
                  <div className="mt-4 flex items-center gap-4">
                    <StarRating rating={Math.round(slides[currentSlide].book.rating)} />
                    <span className="text-2xl font-bold text-pink-500">
                      {slides[currentSlide].book.price.toLocaleString()}đ
                    </span>
                    {slides[currentSlide].book.originalPrice && slides[currentSlide].book.originalPrice > slides[currentSlide].book.price && (
                      <span className="text-gray-400 line-through text-lg">
                        {slides[currentSlide].book.originalPrice.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="md:w-6/12 text-center">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-pink-500' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Services Component
const Services = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-3xl text-pink-500 mt-1">
                {service.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
            className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500 transition-colors disabled:bg-gray-400"
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
      
      <div className="flex items-center justify-between">
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
    </Link>
  );
};

// Best Selling Section - Show featured books from database
const BestSellingSection = () => {
  const { data, loading, error } = useQuery(GET_ALL_BOOKS);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8">Best selling items</h3>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Books loading error:', error);
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8">Best selling items</h3>
          <div className="text-center py-16">
            <p className="text-red-600">Error loading books: {error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Get featured books or all books if no featured ones
  const allBooks = data?.books?.books || [];
  const featuredBooks = allBooks.filter(book => book.isFeatured);
  const booksToShow = featuredBooks.length > 0 ? featuredBooks : allBooks.slice(0, 10);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Best selling items</h3>
          <Link to="/shop">
            <Button variant="primary">View All</Button>
          </Link>
        </div>
        
        {booksToShow.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No books available</h3>
            <p className="text-gray-600">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {booksToShow.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Limited Offer Section
const LimitedOfferSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="py-20 h-[700px] md:h-[800px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248, 109, 114, 0.9), rgba(248, 109, 114, 0.8)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=800&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-6/12 text-center mb-8 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop&crop=center" 
              alt="Limited offer" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-5/12 md:ml-8 text-center md:text-left text-white">
            <h2 className="text-4xl font-bold mb-6">30% Discount on all items. Hurry Up !!!</h2>
            
            {/* Countdown Timer */}
            <div className="flex justify-center md:justify-start items-center space-x-4 mb-8 text-white">
              <div className="text-center">
                <span className="text-4xl font-normal block">{timeLeft.days}</span>
                <small>Days</small>
              </div>
              <span className="text-4xl">:</span>
              <div className="text-center">
                <span className="text-4xl font-normal block">{String(timeLeft.hours).padStart(2, '0')}</span>
                <small>Hrs</small>
              </div>
              <span className="text-4xl">:</span>
              <div className="text-center">
                <span className="text-4xl font-normal block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <small>Min</small>
              </div>
              <span className="text-4xl">:</span>
              <div className="text-center">
                <span className="text-4xl font-normal block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <small>Sec</small>
              </div>
            </div>
            
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Section - Show categories from database
const CategoriesSection = () => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8">Categories</h3>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Categories loading error:', error);
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8">Categories</h3>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading categories: {error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const allCategories = data?.categories || [];
  const featuredCategories = allCategories.filter(category => category.isFeatured);
  const categoriesToShow = featuredCategories.length > 0 ? featuredCategories : allCategories.slice(0, 6);
  
  const categoryImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=400&h=300&fit=crop&crop=center'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8">Categories</h3>
        {categoriesToShow.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No categories available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesToShow.map((category, index) => (
              <div key={category.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img 
                  src={categoryImages[index % categoryImages.length]} 
                  alt={category.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                  <h6 className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                    <Link to={`/shop?category=${category.slug}`} className="text-white hover:text-gray-200 transition-colors">
                      {category.name} ({category.bookCount})
                    </Link>
                  </h6>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      className="py-20 relative h-[600px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 text-white">Customers reviews</h3>
          
          <div className="bg-white rounded-lg p-8 shadow-lg relative">
            <blockquote className="text-lg mb-6">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <StarRating rating={testimonials[currentTestimonial].rating} className="justify-center mb-2" />
            <h5 className="font-medium text-lg">{testimonials[currentTestimonial].author}</h5>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={prevTestimonial}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
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

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
       <CartTestComponent />
      <HeroBanner />
      <Services />
      <BestSellingSection />
      <LimitedOfferSection />
      <CategoriesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;