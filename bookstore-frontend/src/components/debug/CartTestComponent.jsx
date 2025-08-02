// src/components/debug/CartTestComponent.jsx - Component để test Cart functionality
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link } from 'react-router-dom';

const CartTestComponent = () => {
  const { addToCart, cartItems, cartCount, clearCart } = useCart();
  const { wishlistItems, wishlistCount } = useWishlist();

  // Test book data
  const testBooks = [
    {
      id: 'test-1',
      title: 'Test Book 1',
      author: 'Author 1',
      price: 100000,
      originalPrice: 150000,
      stock: 10,
      rating: 4.5,
      reviewCount: 25,
      coverImage: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop' },
      category: { name: 'Fiction' }
    },
    {
      id: 'test-2',
      title: 'Test Book 2',
      author: 'Author 2',
      price: 75000,
      originalPrice: 100000,
      stock: 5,
      rating: 4.0,
      reviewCount: 15,
      coverImage: { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop' },
      category: { name: 'Romance' }
    }
  ];

  const handleTestAddToCart = (book) => {
    console.log('Testing add to cart for:', book.title);
    const result = addToCart(book, 1);
    console.log('Result:', result);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200 m-4">
      <h2 className="text-xl font-bold mb-4 text-blue-600">🛠️ Cart Test Component</h2>
      
      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Cart Status</h3>
          <p>Items: {cartCount}</p>
          <p>Unique products: {cartItems?.length || 0}</p>
          <Link to="/cart" className="text-blue-600 underline">View Cart →</Link>
        </div>
        
        <div className="bg-pink-50 p-4 rounded">
          <h3 className="font-semibold text-pink-800">Wishlist Status</h3>
          <p>Items: {wishlistCount}</p>
          <p>Products: {wishlistItems?.length || 0}</p>
          <Link to="/wishlist" className="text-pink-600 underline">View Wishlist →</Link>
        </div>
      </div>

      {/* Test Books */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Test Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testBooks.map((book) => (
            <div key={book.id} className="border p-4 rounded">
              <div className="flex gap-3">
                <img 
                  src={book.coverImage.url} 
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  <p className="text-sm font-bold text-green-600">{book.price.toLocaleString()}đ</p>
                  <button
                    onClick={() => handleTestAddToCart(book)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Items Display */}
      {cartItems && cartItems.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Current Cart Items</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <pre className="text-xs overflow-auto max-h-32">
          {JSON.stringify({ 
            cartCount, 
            cartItemsLength: cartItems?.length,
            wishlistCount,
            wishlistItemsLength: wishlistItems?.length
          }, null, 2)}
        </pre>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-yellow-50 rounded border-l-4 border-yellow-400">
        <h4 className="font-medium text-yellow-800">How to test:</h4>
        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>1. Click "Add to Cart" buttons above</li>
          <li>2. Check the cart count in header</li>
          <li>3. Click "View Cart" to see cart page</li>
          <li>4. Check browser console for debug logs</li>
          <li>5. Try adding items from BookCard components</li>
        </ul>
      </div>
    </div>
  );
};

export default CartTestComponent;