// src/components/ui/BookCard/BookCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo đã import Link nếu bạn sử dụng
import StarRating from '../../common/StarRating'; // Đảm bảo đã import StarRating

const BookCard = ({ product, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine the image to display
  const imageUrl = product.coverImage?.url || 
                   (product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300x450?text=No+Image');

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`book-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${
        viewMode === 'list' ? 'flex items-center p-4' : 'p-4 flex flex-col'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={viewMode === 'list' ? 'flex-shrink-0 w-32 h-auto mr-4' : ''}>
        <div className="relative overflow-hidden rounded-md" style={{ paddingTop: '150%' }}>
          <img
            src={imageUrl}
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </Link>

      <div className={viewMode === 'list' ? 'flex-grow' : 'mt-4 flex flex-col flex-grow'}>
        <h6 className="font-bold text-gray-900 mb-1 leading-tight">
          <Link to={`/product/${product.id}`} className="hover:text-primary-500 transition-colors">
            {product.title}
          </Link>
        </h6>
        <p className="text-gray-500 text-sm mb-2">{product.author}</p>

        {/* THÊM PHẦN ĐÁNH GIÁ VÀ SỐ LƯỢNG REVIEW */}
        <div className="flex items-center mb-2">
          <StarRating rating={product.rating} /> {/* Hiển thị sao trung bình */}
          {product.reviewCount > 0 && (
            <span className="text-gray-500 text-xs ml-1">({product.reviewCount} reviews)</span>
          )}
        </div>

        {viewMode === 'list' && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-3">{product.description}</p>
        )}

        <div className={`mt-auto ${viewMode === 'grid' ? 'flex flex-col items-center' : 'flex justify-between items-center'}`}>
          <div className="flex flex-col">
            <p className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</p>
            {product.originalPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          {isHovered && (
            <button className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-600 transition-colors mt-2 md:mt-0">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;