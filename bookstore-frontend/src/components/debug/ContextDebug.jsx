// src/components/debug/ContextDebug.jsx - Debug component to test contexts
import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

const ContextDebug = () => {
  const wishlist = useWishlist();
  const cart = useCart();

  // Test data
  const testBook = {
    id: 'test-book-1',
    title: 'Test Book',
    author: 'Test Author',
    price: 100000,
    originalPrice: 150000,
    rating: 4.5,
    reviewCount: 10,
    stock: 5,
    coverImage: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop' },
    category: { name: 'Test Category' }
  };

  const handleTestAddToCart = () => {
    console.log('Testing add to cart...');
    console.log('Cart context:', cart);
    
    if (cart && cart.addToCart) {
      const result = cart.addToCart(testBook, 1);
      console.log('Add to cart result:', result);
    } else {
      console.error('Cart context or addToCart function not available');
    }
  };

  const handleTestAddToWishlist = () => {
    console.log('Testing add to wishlist...');
    console.log('Wishlist context:', wishlist);
    
    if (wishlist && wishlist.addToWishlist) {
      const result = wishlist.addToWishlist(testBook);
      console.log('Add to wishlist result:', result);
    } else {
      console.error('Wishlist context or addToWishlist function not available');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold text-sm mb-2">Context Debug</h3>
      
      {/* Cart Debug */}
      <div className="mb-3">
        <p className="text-xs font-medium">Cart:</p>
        <p className="text-xs">Count: {cart?.cartCount || 0}</p>
        <p className="text-xs">Items: {cart?.cartItems?.length || 0}</p>
        <button 
          onClick={handleTestAddToCart}
          className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded"
        >
          Test Add to Cart
        </button>
      </div>
      
      {/* Wishlist Debug */}
      <div className="mb-3">
        <p className="text-xs font-medium">Wishlist:</p>
        <p className="text-xs">Count: {wishlist?.wishlistCount || 0}</p>
        <p className="text-xs">Items: {wishlist?.wishlistItems?.length || 0}</p>
        <button 
          onClick={handleTestAddToWishlist}
          className="mt-1 bg-pink-500 text-white px-2 py-1 text-xs rounded"
        >
          Test Add to Wishlist
        </button>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-600">
        <p>Cart Available: {cart ? '✅' : '❌'}</p>
        <p>Wishlist Available: {wishlist ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default ContextDebug;