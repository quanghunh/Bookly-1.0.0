import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomerHeader from '../../components/layout/CustomerHeader';
import { GET_CUSTOMER_BOOKS, GET_CATEGORIES } from '../../graphql/customer-queries';
import StarRating from '../../components/common/StarRating';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = 12;

  // Get initial params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    
    setSearchQuery(search);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  
  // Fetch books
  const { data: booksData, loading: booksLoading, error: booksError } = useQuery(GET_CUSTOMER_BOOKS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined
    },
    fetchPolicy: 'cache-and-network'
  });

  const books = booksData?.books?.books || [];
  const totalCount = booksData?.books?.totalCount || 0;
  const totalPages = booksData?.books?.totalPages || 1;
  const categories = categoriesData?.categories || [];

  if (booksError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">{booksError.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />
      
      {/* Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Shop</h1>
          <p className="text-gray-600">
            {booksLoading ? 'Loading...' : (
              <>
                Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                {searchQuery && (
                  <span className="ml-2 text-blue-600 font-medium">for "{searchQuery}"</span>
                )}
              </>
            )}
          </p>
        </div>

        {booksLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// BookCard component...
const BookCard = ({ book }) => {
  const handleAddToCart = () => {
    toast.success(`Added "${book.title}" to cart!`);
  };

  const discountPercentage = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white px-2 py-1 text-xs rounded font-medium">
            -{discountPercentage}%
          </span>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <img 
          src={book.coverImage?.url || book.images?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop'} 
          alt={book.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
          {book.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        
        <div className="flex items-center mb-2">
          <StarRating rating={Math.round(book.rating)} />
          <span className="text-xs text-gray-500 ml-2">({book.reviewCount})</span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold text-lg">{book.price.toLocaleString()}đ</span>
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

        <button 
          onClick={handleAddToCart}
          disabled={book.stock === 0}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default Shop;