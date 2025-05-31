import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import { books, categories, testimonials, services } from '../../data/books';

// Header Component
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
            <h1 className="text-2xl font-bold text-primary-500">BookHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="/shop" className="nav-link">Shop</a>
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
                {["Romance", "Thriller", "Sci-fi", "Cooking", "Health", "Lifestyle", "Fiction"].map((category, index) => (
                  <a key={index} href="#" className="text-gray-700 hover:text-primary-500 transition-colors">
                    {category}
                    {index < 6 && <span className="mx-2 text-gray-400">/</span>}
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
                <a href="#" className="block text-gray-700 hover:text-primary-500 font-medium uppercase">Home</a>
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

// Hero Banner Component
const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      className="relative h-[700px] md:h-[800px] flex items-center bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248, 245, 242, 0.9), rgba(248, 245, 242, 0.95)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=800&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container-custom">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-5/12 md:ml-8 mt-8 md:mt-0 text-center md:text-left animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{slides[currentSlide].title}</h2>
            <p className="text-xl mb-6 text-gray-600">{slides[currentSlide].subtitle}</p>
            <Button size="lg">Shop Collection</Button>
          </div>
          <div className="md:w-6/12 text-center">
            <img 
              src={slides[currentSlide].image} 
              alt="banner" 
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
        ←
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        →
      </button>
    </section>
  );
};

// Services Component
const Services = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-3xl text-primary-500 mt-1">
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

// Book Card Component
const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    alert(`Added "${book.title}" to cart!`);
  };

  return (
    <div 
      className="book-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {book.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary-500 text-white px-3 py-1 text-sm rounded-md">
            {book.discount}% off
          </span>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={book.image} 
          alt={book.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Hover Actions */}
        <div className="book-card-actions">
          <button 
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-2 rounded hover:bg-primary-500 transition-colors"
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
        <a href="#" className="hover:text-primary-500 transition-colors">{book.title}</a>
      </h6>
      
      <div className="flex items-center mb-2">
        <p className="text-gray-500 text-sm mr-2">{book.author}</p>
        <StarRating rating={book.rating} />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-primary-500 font-bold text-lg">${book.price}</span>
          {book.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${book.originalPrice}</span>
          )}
        </div>
        <span className="text-green-600 text-xs font-medium">In Stock</span>
      </div>
    </div>
  );
};

// Best Selling Section
const BestSellingSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Best selling items</h3>
          <Button variant="primary">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
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
      className="section-padding h-[700px] md:h-[800px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248, 109, 114, 0.9), rgba(248, 109, 114, 0.8)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=800&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container-custom">
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
            
            <Button variant="secondary" size="lg">
              Shop Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h3 className="text-3xl font-bold mb-8">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4">
                <h6 className="bg-primary-500 text-white px-4 py-2 rounded-lg">
                  <a href="#" className="text-white hover:text-gray-200 transition-colors">
                    {category.name}
                  </a>
                </h6>
              </div>
            </div>
          ))}
        </div>
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
      className="section-padding relative h-[600px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container-custom">
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
              ←
            </button>
            <button 
              onClick={nextTestimonial}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              →
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
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                📌
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">Shop</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">Blogs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-500 transition-colors text-sm uppercase tracking-wider">Contact</a></li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider">Help & Info Help</h5>
            <ul className="space-y-2">
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

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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