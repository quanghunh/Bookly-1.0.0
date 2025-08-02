// src/components/common/BookCard.jsx - Fixed for Database Books
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const isBookInWishlist = isInWishlist(book.id);

  // 👈 NORMALIZE BOOK DATA FOR CONSISTENCY
  const normalizeBookData = (rawBook) => {
    return {
      id: rawBook.id,
      title: rawBook.title || 'Unknown Title',
      author: rawBook.author || 'Unknown Author',
      price: rawBook.price || 0,
      originalPrice: rawBook.originalPrice || null,
      rating: rawBook.rating || 0,
      reviewCount: rawBook.reviewCount || 0,
      stock: rawBook.stock || 1, // Default to 1 if undefined
      coverImage: rawBook.coverImage || { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop' },
      images: rawBook.images || [],
      category: rawBook.category || { name: 'General' },
      description: rawBook.description || '',
      // Add any other fields that might be missing
      isFeatured: rawBook.isFeatured || false,
      isActive: rawBook.isActive !== false, // Default to true unless explicitly false
      tags: rawBook.tags || []
    };
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 👈 NORMALIZE BOOK DATA BEFORE ADDING TO CART
    const normalizedBook = normalizeBookData(book);
    
    console.log('Original book data:', book);
    console.log('Normalized book data:', normalizedBook);
    
    if (!normalizedBook || !normalizedBook.id) {
      console.error('Invalid book data after normalization:', normalizedBook);
      toast.error('Invalid book data');
      return;
    }
    
    if (normalizedBook.stock === 0) {
      toast.error('This book is out of stock');
      return;
    }

    try {
      console.log('Attempting to add to cart:', normalizedBook);
      
      // Add to cart with normalized data
      const success = addToCart(normalizedBook, 1);
      console.log('Add to cart result:', success);
      
      if (success) {
        // If the book is in wishlist, remove it from wishlist when added to cart
        if (isBookInWishlist) {
          removeFromWishlist(book.id);
          toast.success(`"${normalizedBook.title}" moved from wishlist to cart!`);
        } else {
          toast.success(`"${normalizedBook.title}" added to cart!`);
        }
        
        // Navigate to cart page after adding (with delay to show toast)
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const normalizedBook = normalizeBookData(book);
      toggleWishlist(normalizedBook);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Use normalized data for display
  const displayBook = normalizeBookData(book);
  
  const discountPercentage = displayBook.originalPrice && displayBook.originalPrice > displayBook.price 
    ? Math.round(((displayBook.originalPrice - displayBook.price) / displayBook.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="bg-white rounded-lg p-4 relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
      
      {/* Wishlist indicator for cards in wishlist */}
      {isBookInWishlist && (
        <div className="absolute top-4 right-4 z-10">
          <Heart size={20} className="text-pink-500" fill="currentColor" />
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Link to={`/book/${displayBook.id}`}>
          <img 
            src={displayBook.coverImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'} 
            alt={displayBook.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Hover Actions */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <button 
            onClick={handleAddToCart}
            disabled={displayBook.stock === 0}
            className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={displayBook.stock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart size={16} />
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
            <Heart size={16} fill={isBookInWishlist ? "currentColor" : "none"} />
          </button>
          <Link 
            to={`/book/${displayBook.id}`}
            className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <Link to={`/book/${displayBook.id}`}>
        <h6 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">
          {displayBook.title}
        </h6>
      </Link>
      
      <div className="flex items-center mb-2">
        <p className="text-gray-500 text-sm mr-2">by {displayBook.author}</p>
      </div>

      <div className="flex items-center mb-2">
        <StarRating rating={Math.round(displayBook.rating)} />
        <span className="text-xs text-gray-500 ml-1">({displayBook.reviewCount})</span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-pink-500 font-bold text-lg">
            {typeof displayBook.price === 'number' ? `${displayBook.price.toLocaleString()}đ` : `$${displayBook.price}`}
          </span>
          {displayBook.originalPrice && displayBook.originalPrice > displayBook.price && (
            <span className="text-gray-400 line-through text-sm">
              {typeof displayBook.originalPrice === 'number' ? `${displayBook.originalPrice.toLocaleString()}đ` : `$${displayBook.originalPrice}`}
            </span>
          )}
        </div>
        <span className={`text-xs font-medium ${displayBook.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {displayBook.stock === 0 ? 'Out of Stock' : 'In Stock'}
        </span>
      </div>

      {displayBook.category && (
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {displayBook.category.name || displayBook.category}
          </span>
        </div>
      )}

      {/* Quick Add to Cart Button */}
      <div className="mt-3">
        <button 
          onClick={handleAddToCart}
          disabled={displayBook.stock === 0}
          className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
        >
          <ShoppingCart size={14} />
          {displayBook.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;