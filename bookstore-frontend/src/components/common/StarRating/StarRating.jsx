// src/components/common/StarRating/StarRating.jsx
import React from 'react';

const StarRating = ({ rating = 0, maxRating = 5, className = "", interactive = false, onRatingChange = () => {} }) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        return (
          <svg
            key={i}
            className={`w-4 h-4 ${starValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`}
            viewBox="0 0 24 24"
            onClick={interactive ? () => onRatingChange(starValue) : undefined}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;