// src/components/ui/ReviewCard/ReviewCard.jsx
import React from 'react';
import StarRating from '../../common/StarRating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center mb-3">
        <img
          src={review.user.avatar?.url || `https://ui-avatars.com/api/?name=${review.user.name}&background=random&color=fff&size=40`}
          alt={review.user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">{review.user.name}</p>
          {/* Đảm bảo StarRating nhận prop className để căn chỉnh sao */}
          <StarRating rating={review.rating} className="!justify-start text-yellow-400" /> 
        </div>
      </div>
      <p className="text-gray-700 mb-3">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md"
            />
          ))}
        </div>
      )}
      {review.adminReply && review.adminReply.text && (
        <div className="bg-gray-50 border-l-4 border-primary-500 p-3 mt-3">
          <p className="font-semibold text-primary-500">Admin's Reply:</p>
          <p className="text-gray-700 text-sm">{review.adminReply.text}</p>
          <p className="text-xs text-gray-500 mt-1">Replied on: {new Date(review.adminReply.repliedAt).toLocaleDateString()}</p>
        </div>
      )}
      <p className="text-sm text-gray-500 text-right">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ReviewCard;