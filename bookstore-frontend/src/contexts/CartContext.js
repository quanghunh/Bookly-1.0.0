// src/contexts/CartContext.js - Fixed with Better Error Handling
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  console.log('Cart Reducer:', action.type, action.payload); // 👈 DEBUG LOG
  
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { book, quantity = 1 } = action.payload;
      
      if (!book || !book.id) {
        console.error('Invalid book data in reducer:', book);
        return state;
      }
      
      const existingItemIndex = state.items.findIndex(item => item.id === book.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...state.items];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        const maxQuantity = book.stock || 99;
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Math.min(newQuantity, maxQuantity)
        };
        
        console.log('Updated existing item:', updatedItems[existingItemIndex]);
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        const cartItem = {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          originalPrice: book.originalPrice,
          coverImage: book.coverImage,
          images: book.images,
          category: book.category,
          stock: book.stock,
          quantity: Math.min(quantity, book.stock || 99),
          addedAt: new Date().toISOString()
        };
        
        console.log('Adding new item to cart:', cartItem);
        
        return {
          ...state,
          items: [...state.items, cartItem]
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.bookId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { bookId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== bookId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === bookId
            ? { ...item, quantity: Math.min(quantity, item.stock || 99) }
            : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
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

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  console.log('CartProvider rendered, current state:', state); // 👈 DEBUG LOG

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bookly_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        console.log('Loading cart from localStorage:', cartData); // 👈 DEBUG LOG
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: { items: cartData.items || [] }
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      const cartData = { items: state.items };
      localStorage.setItem('bookly_cart', JSON.stringify(cartData));
      console.log('Saved cart to localStorage:', cartData); // 👈 DEBUG LOG
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Add item to cart
  const addToCart = (book, quantity = 1) => {
    console.log('addToCart called with:', book, quantity); // 👈 DEBUG LOG
    
    if (!book || !book.id) {
      console.error('Invalid book data:', book);
      toast.error('Invalid book data');
      return false;
    }

    if (book.stock === 0) {
      toast.error('This book is out of stock');
      return false;
    }

    try {
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: { book, quantity }
      });

      console.log('Successfully dispatched ADD_ITEM action'); // 👈 DEBUG LOG
      return true;
    } catch (error) {
      console.error('Error in addToCart:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = (bookId) => {
    const item = state.items.find(item => item.id === bookId);
    if (item) {
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: { bookId }
      });
      toast.success(`Removed "${item.title}" from cart`);
    }
  };

  // Update item quantity
  const updateQuantity = (bookId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { bookId, quantity }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared');
  };

  // Check if item is in cart
  const isInCart = (bookId) => {
    return state.items.some(item => item.id === bookId);
  };

  // Get item quantity in cart
  const getItemQuantity = (bookId) => {
    const item = state.items.find(item => item.id === bookId);
    return item ? item.quantity : 0;
  };

  // Calculate cart statistics
  const getCartStats = () => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalOriginalValue = state.items.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);
    const totalSavings = totalOriginalValue - totalValue;
    
    return {
      totalItems,
      totalValue,
      totalOriginalValue,
      totalSavings,
      itemCount: state.items.length
    };
  };

  const value = {
    // State
    cartItems: state.items,
    isLoading: state.isLoading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Utilities
    isInCart,
    getItemQuantity,
    getCartStats,
    
    // Computed values
    cartCount: state.items.reduce((sum, item) => sum + item.quantity, 0)
  };

  console.log('CartProvider value:', value); // 👈 DEBUG LOG

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};