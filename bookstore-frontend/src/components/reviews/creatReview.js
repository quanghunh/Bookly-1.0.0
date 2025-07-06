import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { StarIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import { 
  CAN_REVIEW_BOOK, 
  CREATE_REVIEW, 
  GET_BOOK_REVIEWS 
} from '../../graphql/reviewQueries';

function CreateReview({ bookId, onReviewCreated }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const comment = watch('comment', '');

  // Check if user can review this book
  const { data: canReviewData, loading: canReviewLoading } = useQuery(CAN_REVIEW_BOOK, {
    variables: { bookId },
    fetchPolicy: 'cache-and-network'
  });

  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: (data) => {
      toast.success('Review submitted successfully!');
      reset();
      setRating(0);
      setSelectedOrder('');
      setImages([]);
      if (onReviewCreated) {
        onReviewCreated(data.createReview);
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
    refetchQueries: [
      {
        query: GET_BOOK_REVIEWS,
        variables: { bookId, page: 1, limit: 10 }
      }
    ]
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            file,
            url: e.target.result,
            caption: ''
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index, caption) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  const onSubmit = async (formData) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!selectedOrder) {
      toast.error('Please select an order');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload images to a service like Cloudinary
      // For this demo, we'll use placeholder URLs
      const uploadedImages = images.map((img, index) => ({
        url: `https://example.com/review-images/${Date.now()}-${index}.jpg`,
        caption: img.caption || ''
      }));

      await createReview({
        variables: {
          input: {
            bookId,
            orderId: selectedOrder,
            rating,
            comment: formData.comment,
            images: uploadedImages
          }
        }
      });
    } catch (error) {
      // Error handled in mutation onError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (canReviewLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const canReview = canReviewData?.canReviewBook;

  if (!canReview?.canReview) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Cannot Write Review</h3>
        <p className="text-yellow-700 text-sm">
          {canReview?.reason || 'You cannot review this book at this time.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Order Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Purchase Order
          </label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select an order...</option>
            {canReview.eligibleOrders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                {star <= (hoverRating || rating) ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIcon className="w-8 h-8 text-gray-300" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('comment', {
              required: 'Please write a review',
              minLength: {
                value: 10,
                message: 'Review must be at least 10 characters long'
              },
              maxLength: {
                value: 1000,
                message: 'Review cannot exceed 1000 characters'
              }
            })}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your experience with this book..."
          />
          <div className="flex justify-between mt-1">
            {errors.comment && (
              <p className="text-red-600 text-sm">{errors.comment.message}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {comment.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB each
              </p>
            </label>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={image.caption}
                    onChange={(e) => updateImageCaption(index, e.target.value)}
                    className="w-full mt-1 text-xs border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Review...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <h4 className="font-medium mb-2">Review Guidelines:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Be honest and helpful in your review</li>
            <li>• Focus on the book content and quality</li>
            <li>• Avoid spoilers in your review</li>
            <li>• You can only review books you have purchased</li>
            <li>• Reviews cannot be edited or deleted once submitted</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default CreateReview;