// src/components/ui/ReviewForm/ReviewForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import Button from '../../common/Button';
import StarRating from '../../common/StarRating';
import { CREATE_REVIEW_MUTATION } from '../../../graphql/queries';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const [selectedRating, setSelectedRating] = useState(0);
  const [createReview] = useMutation(CREATE_REVIEW_MUTATION);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating); // Cập nhật giá trị rating cho react-hook-form
  };

  const onSubmit = async (data) => {
    if (selectedRating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    try {
      // Chuyển đổi FileList thành Array of File
      const files = data.imageFiles ? Array.from(data.imageFiles) : [];

      await createReview({
        variables: {
          input: {
            productId,
            rating: selectedRating,
            comment: data.comment,
            imageFiles: files,
          },
        },
      });
      toast.success('Review submitted successfully! It will be visible after admin verification.');
      reset(); // Reset form fields
      setSelectedRating(0); // Reset star rating
      onReviewSubmitted(); // Callback để làm mới danh sách review (nếu có)
    } catch (error) {
      // Xử lý lỗi từ backend (ví dụ: đã review sản phẩm này rồi, chưa mua hàng)
      toast.error(error.message || 'Failed to submit review.');
      console.error("Review submission error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Your Rating:
          </label>
          <StarRating
            rating={selectedRating}
            onRatingChange={handleRatingChange} // Thêm prop để xử lý thay đổi rating
            interactive={true} // Bật chế độ tương tác
          />
          {errors.rating && <p className="text-red-500 text-xs italic">{errors.rating.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
            Your Comment:
          </label>
          <textarea
            id="comment"
            {...register('comment', { maxLength: { value: 1000, message: "Comment cannot exceed 1000 characters." } })}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write your review here..."
          ></textarea>
          {errors.comment && <p className="text-red-500 text-xs italic">{errors.comment.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="imageFiles" className="block text-gray-700 text-sm font-bold mb-2">
            Add Images (optional):
          </label>
          <input
            type="file"
            id="imageFiles"
            {...register('imageFiles')}
            multiple
            accept="image/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting || selectedRating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;