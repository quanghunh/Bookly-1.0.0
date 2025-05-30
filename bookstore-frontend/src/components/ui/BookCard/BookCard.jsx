import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg p-6 relative group hover:shadow-lg transition-shadow">
      {book.discount && (
        <div className="absolute top-4 left-4 bg-pink-500 text-white px-2 py-1 rounded text-sm">
          {book.discount}
        </div>
      )}
      
      <img 
        src={book.image} 
        alt={book.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      
      <h6 className="font-semibold text-gray-900 mb-2">
        <a href="#" className="hover:text-pink-500">{book.title}</a>
      </h6>
      
      <div className="flex items-center mb-2">
        <p className="text-gray-500 text-sm mr-2">{book.author}</p>
        <div className="flex text-yellow-400">
          {[...Array(book.rating)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        {book.originalPrice && (
          <span className="line-through text-gray-400 mr-2">${book.originalPrice}</span>
        )}
        <span className="text-pink-500 font-bold text-lg">${book.price}</span>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500">
          <ShoppingCart size={16} />
        </button>
        <button className="bg-gray-900 text-white p-2 rounded hover:bg-pink-500">
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
};

export default BookCard;