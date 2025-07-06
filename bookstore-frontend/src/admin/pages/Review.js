import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import {
  GET_ALL_REVIEWS_ADMIN,
  GET_REVIEW_STATS_ADMIN,
  ADD_ADMIN_RESPONSE,
  UPDATE_ADMIN_RESPONSE,
  DELETE_ADMIN_RESPONSE,
  TOGGLE_REVIEW_VISIBILITY,
  ADMIN_RESPONSE_ADDED_SUBSCRIPTION
} from '../../graphql/reviewQueries';

function AdminReviews() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Auto-refresh every 10 seconds
  const { data, loading, error, refetch } = useQuery(GET_ALL_REVIEWS_ADMIN, {
    variables: {
      page,
      limit: 20,
      filter,
      search: search.trim() || undefined
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000 // Refresh every 10 seconds
  });

  const { data: statsData } = useQuery(GET_REVIEW_STATS_ADMIN, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000
  });

  // Subscribe to new admin responses
  useSubscription(ADMIN_RESPONSE_ADDED_SUBSCRIPTION, {
    onSubscriptionData: () => {
      refetch();
    }
  });

  const [toggleVisibility] = useMutation(TOGGLE_REVIEW_VISIBILITY, {
    onCompleted: () => {
      toast.success('Review visibility updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: GET_ALL_REVIEWS_ADMIN, variables: { page, limit: 20, filter, search } }]
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPage(1);
  };

  const handleToggleVisibility = (reviewId) => {
    toggleVisibility({ variables: { reviewId } });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const reviews = data?.getAllReviews?.reviews || [];
  const pagination = data?.getAllReviews;
  const stats = statsData?.getReviewStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600">Manage customer reviews and respond to feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">With Response</p>
                <p className="text-lg font-semibold text-gray-900">{stats.reviewsWithResponse}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Need Response</p>
                <p className="text-lg font-semibold text-gray-900">{stats.reviewsWithoutResponse}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-lg font-semibold">{stats.averageRating}</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-xs text-gray-400">Recent: {stats.recentReviews} reviews</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews, users, books..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Rating Filter */}
          <select
            value={filter.rating || ''}
            onChange={(e) => handleFilterChange({ rating: e.target.value ? parseInt(e.target.value) : undefined })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Response Filter */}
          <select
            value={filter.hasAdminResponse === undefined ? '' : filter.hasAdminResponse.toString()}
            onChange={(e) => handleFilterChange({ 
              hasAdminResponse: e.target.value === '' ? undefined : e.target.value === 'true' 
            })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Reviews</option>
            <option value="true">With Response</option>
            <option value="false">Need Response</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading && !data ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No reviews found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    onToggleVisibility={handleToggleVisibility}
                    onSelectReview={setSelectedReview}
                    onShowResponseModal={setShowResponseModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} reviews
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
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <AdminResponseModal
          review={selectedReview}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedReview(null);
          }}
          onSuccess={() => {
            refetch();
            setShowResponseModal(false);
            setSelectedReview(null);
          }}
        />
      )}
    </div>
  );
}

function ReviewRow({ review, onToggleVisibility, onSelectReview, onShowResponseModal }) {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleResponseClick = () => {
    onSelectReview(review);
    onShowResponseModal(true);
  };

  return (
    <tr className={review.isHidden ? 'bg-red-50' : ''}>
      <td className="px-4 py-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">
                {review.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
            <p className="text-sm text-gray-500">{review.user.email}</p>
            <p className="text-sm text-gray-800 mt-1 line-clamp-2">{review.comment}</p>
            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
              <span>{review.age}</span>
              <span>{review.helpfulCount} helpful</span>
              {review.reportCount > 0 && (
                <span className="text-red-600">{review.reportCount} reports</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          {review.book.coverImage && (
            <img
              src={review.book.coverImage.url}
              alt={review.book.title}
              className="w-10 h-12 object-cover rounded"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">
              {review.book.title}
            </p>
            <p className="text-sm text-gray-500">{review.book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          {renderStars(review.rating)}
          <span className="text-sm text-gray-600">({review.rating})</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          {review.isVerified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
          )}
          {review.isHidden && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Hidden
            </span>
          )}
          {review.adminResponse ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Responded
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Needs Response
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResponseClick}
            className="text-blue-600 hover:text-blue-900 text-sm"
            title={review.adminResponse ? 'Edit Response' : 'Add Response'}
          >
            <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleVisibility(review.id)}
            className={`text-sm ${review.isHidden ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
            title={review.isHidden ? 'Show Review' : 'Hide Review'}
          >
            {review.isHidden ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

function AdminResponseModal({ review, onClose, onSuccess }) {
  const [response, setResponse] = useState(review.adminResponse || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addResponse] = useMutation(ADD_ADMIN_RESPONSE);
  const [updateResponse] = useMutation(UPDATE_ADMIN_RESPONSE);
  const [deleteResponse] = useMutation(DELETE_ADMIN_RESPONSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      if (review.adminResponse) {
        await updateResponse({
          variables: {
            input: {
              reviewId: review.id,
              response: response.trim()
            }
          }
        });
        toast.success('Response updated successfully');
      } else {
        await addResponse({
          variables: {
            input: {
              reviewId: review.id,
              response: response.trim()
            }
          }
        });
        toast.success('Response added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    setIsSubmitting(true);
    try {
      await deleteResponse({
        variables: { reviewId: review.id }
      });
      toast.success('Response deleted successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {review.adminResponse ? 'Edit Admin Response' : 'Add Admin Response'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Review Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">
                  {review.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{review.user.name}</p>
                <div className="flex items-center space-x-2">
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
                  <span className="text-sm text-gray-600">{review.age}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-800">{review.comment}</p>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Response
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your response to this review..."
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {response.length}/500 characters
              </p>
            </div>

            <div className="flex justify-between">
              <div>
                {review.adminResponse && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete Response
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !response.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : review.adminResponse ? 'Update Response' : 'Add Response'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;