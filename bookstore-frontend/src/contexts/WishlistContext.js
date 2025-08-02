// src/contexts/WishlistContext.js - Updated with Cart Integration
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

// Wishlist action types
const WISHLIST_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST',
  MOVE_TO_CART: 'MOVE_TO_CART'
};

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_ITEM: {
      const { book } = action.payload;
      const existingItem = state.items.find(item => item.id === book.id);
      
      if (existingItem) {
        // Item already in wishlist
        return state;
      }
      
      const wishlistItem = {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        originalPrice: book.originalPrice,
        rating: book.rating,
        reviewCount: book.reviewCount,
        coverImage: book.coverImage,
        images: book.images,
        category: book.category,
        stock: book.stock,
        addedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        items: [...state.items, wishlistItem]
      };
    }
    
    case WISHLIST_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.bookId)
      };
    }
    
    case WISHLIST_ACTIONS.CLEAR_WISHLIST: {
      return {
        ...state,
        items: []
      };
    }
    
    case WISHLIST_ACTIONS.LOAD_WISHLIST: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    
    case WISHLIST_ACTIONS.MOVE_TO_CART: {
      // Remove item from wishlist when moved to cart
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.bookId)
      };
    }
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  isLoading: false
};

// Wishlist provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('bookly_wishlist');
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({
          type: WISHLIST_ACTIONS.LOAD_WISHLIST,
          payload: { items: wishlistData.items || [] }
        });
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('bookly_wishlist', JSON.stringify({ items: state.items }));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [state.items]);

  // Add item to wishlist
  const addToWishlist = (book) => {
    if (!book || !book.id) {
      toast.error('Invalid book data');
      return false;
    }

    const existingItem = state.items.find(item => item.id === book.id);
    if (existingItem) {
      toast.info(`"${book.title}" is already in your wishlist`);
      return false;
    }

    dispatch({
      type: WISHLIST_ACTIONS.ADD_ITEM,
      payload: { book }
    });

    toast.success(`Added "${book.title}" to wishlist!`);
    return true;
  };

  // Remove item from wishlist
  const removeFromWishlist = (bookId) => {
    const item = state.items.find(item => item.id === bookId);
    if (item) {
      dispatch({
        type: WISHLIST_ACTIONS.REMOVE_ITEM,
        payload: { bookId }
      });
      toast.success(`Removed "${item.title}" from wishlist`);
      return true;
    }
    return false;
  };

  // Toggle item in wishlist
  const toggleWishlist = (book) => {
    const isInWishlist = state.items.some(item => item.id === book.id);
    
    if (isInWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
    toast.success('Wishlist cleared');
  };

  // Check if item is in wishlist
  const isInWishlist = (bookId) => {
    return state.items.some(item => item.id === bookId);
  };

  // Move item from wishlist to cart (used when adding to cart)
  const moveFromWishlistToCart = (bookId) => {
    const item = state.items.find(item => item.id === bookId);
    if (item) {
      dispatch({
        type: WISHLIST_ACTIONS.MOVE_TO_CART,
        payload: { bookId }
      });
      return item;
    }
    return null;
  };

  // Calculate wishlist statistics
  const getWishlistStats = () => {
    const totalItems = state.items.length;
    const totalValue = state.items.reduce((sum, item) => sum + item.price, 0);
    const categories = [...new Set(state.items.map(item => item.category?.name).filter(Boolean))];
    const categoryList = categories;
    
    return {
      totalItems,
      totalValue,
      categories: categories.length,
      categoryList
    };
  };

  const value = {
    // State
    wishlistItems: state.items,
    isLoading: state.isLoading,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveFromWishlistToCart,
    
    // Utilities
    isInWishlist,
    getWishlistStats,
    
    // Computed values
    wishlistCount: state.items.length
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};