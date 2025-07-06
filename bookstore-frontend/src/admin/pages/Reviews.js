// src/admin/pages/Reviews.js
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { GET_ADMIN_REVIEWS, UPDATE_ADMIN_REPLY_MUTATION, UPDATE_REVIEW_VERIFICATION_STATUS_MUTATION } from '../../graphql/queries'; // Đảm bảo đã import các queries/mutations này
import Button from '../../components/common/Button'; // Đảm bảo đã import Button
import StarRating from '../../components/common/StarRating'; // Đảm bảo đã import StarRating

export default function AdminReviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterVerified, setFilterVerified] = useState(undefined); // undefined: all, true: verified, false: unverified
  const [selectedReviewId, setSelectedReviewId] = useState(null); // ID của review đang được admin phản hồi/chỉnh sửa
  const [adminReplyText, setAdminReplyText] = useState('');

  const itemsPerPage = 10;
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_REVIEWS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      isVerified: filterVerified,
      sortBy: "createdAt",
      sortOrder: "desc"
    },
    // Polling mỗi 10 giây để dashboard cập nhật tự động
    pollInterval: 10000, 
  });

  const [updateAdminReply] = useMutation(UPDATE_ADMIN_REPLY_MUTATION, {
    onCompleted: () => {
      toast.success('Admin reply updated!');
      setAdminReplyText(''); // Xóa nội dung phản hồi sau khi gửi
      setSelectedReviewId(null); // Đóng form phản hồi
      refetch(); // Tải lại danh sách review
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update reply');
    }
  });

  const [updateReviewVerificationStatus] = useMutation(UPDATE_REVIEW_VERIFICATION_STATUS_MUTATION, {
    onCompleted: (data) => {
      toast.success(`Review ${data.updateReviewVerificationStatus.isVerified ? 'verified' : 'unverified'}!`);
      refetch(); // Tải lại danh sách review
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update verification status');
    }
  });

  const handleReplySubmit = (reviewId) => {
    if (adminReplyText.trim() === '') {
      toast.error('Reply cannot be empty.');
      return;
    }
    updateAdminReply({ variables: { input: { reviewId, text: adminReplyText } } });
  };

  const handleVerifyToggle = (reviewId, currentStatus) => {
    updateReviewVerificationStatus({ variables: { input: { reviewId, isVerified: !currentStatus } } });
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const reviews = data?.adminReviews.reviews || [];
  const totalCount = data?.adminReviews.totalCount || 0;
  const totalPages = data?.adminReviews.totalPages || 0;

  return (
    <div className="container-custom mx-auto py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Product Reviews</h2>

      {/* Filter Options */}
      <div className="mb-6 flex space-x-4">
        <Button
          onClick={() => setFilterVerified(undefined)}
          variant={filterVerified === undefined ? 'primary' : 'outline'}
        >
          All Reviews ({totalCount})
        </Button>
        <Button
          onClick={() => setFilterVerified(true)}
          variant={filterVerified === true ? 'primary' : 'outline'}
        >
          Verified Reviews ({reviews.filter(r => r.isVerified).length})
        </Button>
        <Button
          onClick={() => setFilterVerified(false)}
          variant={filterVerified === false ? 'primary' : 'outline'}
        >
          Unverified Reviews ({reviews.filter(r => !r.isVerified).length})
        </Button>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-lg font-semibold text-gray-800">Review for: <span className="text-primary-500">{review.product.title}</span></p>
                  <p className="text-sm text-gray-600">By: {review.user.name} ({review.user.email})</p>
                </div>
                <div className="flex items-center">
                  <StarRating rating={review.rating} className="!justify-start text-yellow-400 mr-2" />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${review.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {review.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {review.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Review ${review.id} image ${index}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}

              {/* Admin Reply Section */}
              <div className="mt-4">
                {review.adminReply && review.adminReply.text ? (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                    <p className="font-semibold text-blue-700">Admin's Reply:</p>
                    <p className="text-gray-700 text-sm">{review.adminReply.text}</p>
                    <p className="text-xs text-gray-500 mt-1">Replied on: {new Date(review.adminReply.repliedAt).toLocaleDateString()}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        setAdminReplyText(review.adminReply.text);
                      }}
                    >
                      Edit Reply
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col mb-3">
                    <textarea
                      rows="2"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                      placeholder="Add admin reply..."
                      value={selectedReviewId === review.id ? adminReplyText : ''}
                      onChange={(e) => {
                        setSelectedReviewId(review.id);
                        setAdminReplyText(e.target.value);
                      }}
                    ></textarea>
                    <Button
                      size="sm"
                      onClick={() => handleReplySubmit(review.id)}
                      disabled={selectedReviewId !== review.id || adminReplyText.trim() === ''}
                    >
                      Submit Reply
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant={review.isVerified ? 'secondary' : 'primary'}
                  onClick={() => handleVerifyToggle(review.id, review.isVerified)}
                >
                  {review.isVerified ? 'Unverify' : 'Verify'} Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? 'primary' : 'outline'}
              className="mx-1"
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}