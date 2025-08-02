// src/pages/Cart/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Heart, Tag } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

// Header Component (reused from other pages)
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

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
                <Link to="/wishlist" className="p-2 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>
              </div>
              <div className="relative">
                <Link to="/cart" className="p-2 hover:text-pink-500 transition-colors text-pink-500">
                  <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
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

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (item.stock || 99)) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const discountPercentage = item.originalPrice && item.originalPrice > item.price 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const itemTotal = item.price * item.quantity;
  const originalItemTotal = (item.originalPrice || item.price) * item.quantity;
  const itemSavings = originalItemTotal - itemTotal;

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
            title="Remove from cart"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-2">by {item.author}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-pink-500">{item.price.toLocaleString()}đ</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <>
                <span className="text-gray-400 line-through">{item.originalPrice.toLocaleString()}đ</span>
                {discountPercentage > 0 && (
                  <span className="bg-pink-500 text-white px-2 py-1 text-xs rounded">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </>
            )}
          </div>
          <span className={`text-sm font-medium ${(item.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(item.stock || 0) > 0 ? `${item.stock} in stock` : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-1 border-l border-r border-gray-300 min-w-[50px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (item.stock || 99)}
                className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Item Total & Actions */}
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{itemTotal.toLocaleString()}đ</div>
            {itemSavings > 0 && (
              <div className="text-sm text-green-600">You save: {itemSavings.toLocaleString()}đ</div>
            )}
            <button
              onClick={() => onMoveToWishlist(item)}
              className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1 mt-1"
            >
              <Heart size={14} />
              Move to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ stats, onCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const handleApplyPromo = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1, type: 'percentage' });
      toast.success('Promo code applied! 10% discount');
    } else if (promoCode.toLowerCase() === 'freeship') {
      setAppliedPromo({ code: 'FREESHIP', discount: 30000, type: 'fixed' });
      toast.success('Free shipping applied!');
    } else if (promoCode.trim()) {
      toast.error('Invalid promo code');
    }
  };

  const shippingFee = appliedPromo?.code === 'FREESHIP' ? 0 : 30000;
  const discountAmount = appliedPromo?.type === 'percentage' 
    ? stats.totalValue * appliedPromo.discount 
    : appliedPromo?.type === 'fixed' ? appliedPromo.discount : 0;
  
  const finalTotal = stats.totalValue + shippingFee - discountAmount;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({stats.totalItems} items)</span>
          <span className="font-medium">{stats.totalValue.toLocaleString()}đ</span>
        </div>
        
        {stats.totalSavings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{stats.totalSavings.toLocaleString()}đ</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className={shippingFee === 0 ? "text-green-600" : "font-medium"}>
            {shippingFee === 0 ? 'Free' : `${shippingFee.toLocaleString()}đ`}
          </span>
        </div>
        
        {appliedPromo && appliedPromo.type === 'percentage' && (
          <div className="flex justify-between text-green-600">
            <span>Promo ({appliedPromo.code})</span>
            <span>-{discountAmount.toLocaleString()}đ</span>
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-pink-500"
          />
          <Button onClick={handleApplyPromo} size="sm" className="whitespace-nowrap">
            Apply
          </Button>
        </div>
        <p className="text-xs text-gray-500">Try: SAVE10 for 10% off or FREESHIP for free shipping</p>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-pink-500">{finalTotal.toLocaleString()}đ</span>
        </div>
      </div>
      
      <Button 
        onClick={onCheckout}
        className="w-full mb-3"
        size="lg"
        disabled={stats.totalItems === 0}
      >
        Proceed to Checkout
      </Button>
      
      <Link to="/shop">
        <Button variant="secondary" className="w-full" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

// Main Cart Component
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartStats } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const stats = getCartStats();

  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
  };

  const handleUpdateQuantity = (bookId, quantity) => {
    updateQuantity(bookId, quantity);
  };

  const handleMoveToWishlist = (item) => {
    // Add to wishlist
    addToWishlist(item);
    // Remove from cart
    removeFromCart(item.id);
    toast.success(`Moved "${item.title}" to wishlist`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    toast.success('Redirecting to checkout...');
    // Navigate to checkout page
    navigate('/checkout');
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
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShoppingCart className="text-pink-500" />
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {stats.totalItems} {stats.totalItems === 1 ? 'item' : 'items'} in your cart
                {stats.totalValue > 0 && (
                  <span className="ml-2">• Total: {stats.totalValue.toLocaleString()}đ</span>
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
              {cartItems.length > 0 && (
                <Button 
                  onClick={handleClearCart}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Clear Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any books to your cart yet. 
              Start exploring our collection and find your next great read!
            </p>
            <Link to="/shop">
              <Button className="flex items-center gap-2 mx-auto">
                Explore Books
                <ArrowLeft size={16} className="rotate-180" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleClearCart}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      Clear Cart
                    </Button>
                    <Link to="/shop">
                      <Button variant="secondary">Continue Shopping</Button>
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Need help?</p>
                    <p className="text-sm">
                      Call us at <a href="tel:112233344455" className="text-pink-500 font-medium">112233344455</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <OrderSummary stats={stats} onCheckout={handleCheckout} />
              
              {/* Security Features */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Secure Checkout</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Free shipping on orders over 200,000đ</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">We Accept</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gray-200 px-3 py-1 text-xs rounded">💳 Visa</span>
                  <span className="bg-gray-200 px-3 py-1 text-xs rounded">💳 Mastercard</span>
                  <span className="bg-gray-200 px-3 py-1 text-xs rounded">🅿️ PayPal</span>
                  <span className="bg-gray-200 px-3 py-1 text-xs rounded">💰 Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed or Recommended Books */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h3>
            <div className="bg-white rounded-lg p-6 border">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="text-center">
                    <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
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

export default Cart;