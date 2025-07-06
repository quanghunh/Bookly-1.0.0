import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  StarIcon, 
  HandThumbUpIcon,
  FlagIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import { 
  GET_BOOK_REVIEWS, 
  MARK_REVIEW_HELPFUL, 
  REPORT_REVIEW 
} from '../../graphql/reviewQueries';

function ReviewList({ bookId }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState('NEWEST');
  const [ratingFilter, setRatingFilter] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_BOOK_REVIEWS, {
    variables: {
      bookId,
      page,
      limit: 10,
      filter: {
        rating: ratingFilter,
        sortBy
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const [markHelpful] = useMutation(MARK_REVIEW_HELPFUL, {
    onCompleted: () => {
      toast.success('Thank you for your feedback!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const [reportReview] = useMutation(REPORT_REVIEW, {
    onCompleted: () => {
      toast.success('Review reported. We will review it shortly.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleMarkHelpful = (reviewId) => {
    markHelpful({
      variables: { reviewId },
      optimisticResponse: {
        markReviewHelpful: {
          id: reviewId,
          helpfulCount: -1, // Will be updated by server response
          __typename: 'Review'
        }
      }
    });
  };

  const handleReportReview = (reviewId) => {
    const reason = prompt('Please provide a reason for reporting this review:');
    if (reason && reason.trim()) {
      reportReview({
        variables: { reviewId, reason: reason.trim() }
      });
    }
  };

  const handleFilterChange = (rating) => {
    setRatingFilter(rating === ratingFilter ? null : rating);
    setPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = (stats) => {
    const total = stats.totalReviews;
    if (total === 0) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-3">Rating Overview</h3>
        <div className="flex items-center mb-4">
          <div className="text-3xl font-bold mr-3">{stats.averageRating.toFixed(1)}</div>
          <div>
            {renderStars(Math.round(stats.averageRating), 'w-5 h-5')}
            <div className="text-sm text-gray-600">{total} reviews</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[`star${rating}`];
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <button
                key={rating}
                onClick={() => handleFilterChange(rating)}
                className={`flex items-center w-full text-left hover:bg-gray-100 p-1 rounded ${
                  ratingFilter === rating ? 'bg-blue-50 border border-blue-300' : ''
                }`}
              >
                <span className="flex items-center w-12">
                  {rating} <StarIconSolid className="w-3 h-3 text-yellow-400 ml-1" />
                </span>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading reviews: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const reviews = data?.getBookReviews?.reviews || [];
  const stats = data?.getBookReviews?.stats;
  const pagination = data?.getBookReviews;

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      {stats && renderRatingDistribution(stats)}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <span className="font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="HIGHEST_RATING">Highest Rating</option>
            <option value="LOWEST_RATING">Lowest Rating</option>
            <option value="MOST_HELPFUL">Most Helpful</option>
          </select>
        </div>

        {ratingFilter && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing {ratingFilter}-star reviews</span>
            <button
              onClick={() => handleFilterChange(null)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {ratingFilter 
              ? `No ${ratingFilter}-star reviews yet.`
              : 'No reviews yet. Be the first to review this book!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onMarkHelpful={handleMarkHelpful}
              onReport={handleReportReview}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-600">
            Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalCount)} of {pagination.totalCount} reviews
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewItem({ review, onMarkHelpful, onReport }) {
  const [showImages, setShowImages] = useState(false);
  const [showFullComment, setShowFullComment] = useState(false);

  const isLongComment = review.comment.length > 200;
  const displayComment = showFullComment 
    ? review.comment 
    : isLongComment 
      ? review.comment.substring(0, 200) + '...'
      : review.comment;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.user.name}</span>
              {review.isVerified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.age}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-3">
        <p className="text-gray-800 leading-relaxed">{displayComment}</p>
        {isLongComment && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          >
            {showFullComment ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mb-2"
          >
            <span>{review.images.length} photo{review.images.length !== 1 ? 's' : ''}</span>
            {showImages ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
          {showImages && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {review.images.map((image, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.caption || `Review image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-blue-800">
                Response from {review.adminResponseBy?.name || 'Admin'}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {review.adminResponse}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {new Date(review.adminResponseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={() => onMarkHelpful(review.id)}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
        >
          <HandThumbUpIcon className="w-4 h-4" />
          <span>Helpful ({review.helpfulCount})</span>
        </button>
        
        <button
          onClick={() => onReport(review.id)}
          className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm"
        >
          <FlagIcon className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>
    </div>
  );
}

export default ReviewList;