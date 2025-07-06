// src/pages/ProductDetail/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_BOOK, GET_REVIEWS_FOR_PRODUCT } from '../../graphql/queries'; // Đảm bảo đã import GET_BOOK và GET_REVIEWS_FOR_PRODUCT
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ReviewCard from '../../components/ui/ReviewCard'; // Đảm bảo đã import ReviewCard
import ReviewForm from '../../components/ui/ReviewForm'; // Đảm bảo đã import ReviewForm
import StarRating from '../../components/common/StarRating'; // Đảm bảo đã import StarRating
import Button from '../../components/common/Button'; // Đảm bảo đã import Button

// Pagination component (Bạn có thể cần tạo component này nếu chưa có)
// Ví dụ đơn giản cho Pagination:
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(i => i + 1);
  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      {pages.map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'primary' : 'outline'}
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};


const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID của sách từ URL
  const [reviewFilterRating, setReviewFilterRating] = useState(0); // 0 để hiển thị tất cả rating
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng review hiển thị mỗi trang

  // Lấy thông tin sách
  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(GET_BOOK, {
    variables: { id },
  });

  // Lấy danh sách review cho sản phẩm
  const { data: reviewsData, loading: reviewsLoading, error: reviewsError, refetch: refetchReviews } = useQuery(GET_REVIEWS_FOR_PRODUCT, {
    variables: { 
      productId: id,
      isVerified: true, // Chỉ hiển thị review đã xác thực cho người dùng chưa đăng nhập
      rating: reviewFilterRating > 0 ? reviewFilterRating : undefined, // Lọc theo rating nếu có
      page: currentPage,
      limit: itemsPerPage,
    },
    fetchPolicy: 'cache-and-network', // Đảm bảo lấy dữ liệu mới nhất
  });

  if (bookLoading || reviewsLoading) return <p>Loading...</p>;
  if (bookError) return <p>Error loading book: {bookError.message}</p>;
  if (reviewsError) return <p>Error loading reviews: {reviewsError.message}</p>;

  const book = bookData.book;
  const reviews = reviewsData.reviews.reviews;
  const totalReviews = reviewsData.reviews.totalCount;
  const totalReviewPages = reviewsData.reviews.totalPages;

  const handleReviewFormSubmitted = () => {
    refetchReviews(); // Tải lại danh sách review sau khi gửi thành công
  };

  return (
    <div>
      <Header />
      <div className="container-custom py-8">
        {/* Product Details Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2">
            <img 
              src={book.coverImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'} 
              alt={book.title} 
              className="w-full h-auto object-cover rounded-lg shadow-md" 
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
            <div className="flex items-center mb-4">
              <StarRating rating={book.rating} className="mr-2" />
              <span className="text-gray-600">({book.reviewCount} reviews)</span>
            </div>
            <p className="text-primary-500 font-bold text-3xl mb-4">${book.price.toFixed(2)}</p>
            <p className="text-gray-700 leading-relaxed mb-6">{book.description}</p>
            <Button variant="primary">Add to Cart</Button> {/* Bạn có thể thêm logic giỏ hàng ở đây */}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews ({totalReviews})</h2>

            {/* Review Filter by Rating */}
            <div className="mb-4 flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Filter by rating:</span>
              {[0, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setReviewFilterRating(star);
                    setCurrentPage(1); // Reset về trang 1 khi lọc
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    reviewFilterRating === star ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {star === 0 ? 'All' : `${star} Stars`}
                </button>
              ))}
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-600">No verified reviews yet. Be the first to review!</p>
            ) : (
              <div>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalReviewPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            {/* Review Form (backend sẽ kiểm tra điều kiện người dùng đã mua hàng và chưa review) */}
            <ReviewForm productId={id} onReviewSubmitted={handleReviewFormSubmitted} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;