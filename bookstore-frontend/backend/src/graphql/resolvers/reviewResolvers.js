// backend/src/graphql/resolvers/reviewResolvers.js
const Review = require('../../models/Review');
const Book = require('../../models/Book'); // Có thể không cần dùng trực tiếp ở đây nếu đã dùng populate
const Order = require('../../models/Order'); // Cần kiểm tra xem người dùng đã mua hàng chưa
const cloudinary = require('cloudinary').v2; // Giả sử bạn đã cấu hình Cloudinary

// Cấu hình Cloudinary (đảm bảo đã có trong .env hoặc server.js)
// Đây là cấu hình ví dụ, bạn nên đảm bảo các biến môi trường này đã được thiết lập đúng
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const reviewResolvers = {
  Query: {
    reviews: async (_, { productId, userId, isVerified, page, limit, sortBy, sortOrder }) => {
      try {
        const skip = (page - 1) * limit;
        let query = {};
        if (productId) query.product = productId;
        if (userId) query.user = userId;
        if (isVerified !== undefined) query.isVerified = isVerified;

        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const reviews = await Review.find(query)
          .populate('product', 'title slug') // Lấy thông tin sách
          .populate('user', 'name email avatar') // Lấy thông tin người dùng
          .sort(sort)
          .skip(skip)
          .limit(limit);

        const totalCount = await Review.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
          reviews,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages,
        };
      } catch (error) {
        throw new Error(`Error fetching reviews: ${error.message}`);
      }
    },
    review: async (_, { id }) => {
      try {
        const review = await Review.findById(id)
          .populate('product', 'title slug')
          .populate('user', 'name email avatar');
        if (!review) throw new Error('Review not found');
        return review;
      } catch (error) {
        throw new Error(`Error fetching review: ${error.message}`);
      }
    },
    adminReviews: async (_, { productId, userId, isVerified, page, limit, sortBy, sortOrder }, { user }) => {
      // Chỉ admin mới có quyền xem tất cả review
      if (!user || user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      try {
        const skip = (page - 1) * limit;
        let query = {};
        if (productId) query.product = productId;
        if (userId) query.user = userId;
        if (isVerified !== undefined) query.isVerified = isVerified;

        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const reviews = await Review.find(query)
          .populate('product', 'title slug')
          .populate('user', 'name email avatar')
          .sort(sort)
          .skip(skip)
          .limit(limit);

        const totalCount = await Review.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
          reviews,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages,
        };
      } catch (error) {
        throw new Error(`Error fetching admin reviews: ${error.message}`);
      }
    },
  },
  Mutation: {
    createReview: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required. Please log in to review.');
      }

      const { productId, rating, comment, imageFiles } = input;

      try {
        // Kiểm tra xem người dùng đã mua sản phẩm này và đơn hàng đã được giao thành công chưa
        const orderExists = await Order.findOne({
          user: user.id,
          'items.book': productId, // Giả sử items.book là ID của sách trong đơn hàng
          status: 'delivered', // Đảm bảo đơn hàng đã được giao
          paymentStatus: 'paid', // Đảm bảo đã thanh toán
        });

        if (!orderExists) {
          throw new Error('You can only review products you have successfully purchased and received.');
        }

        // Kiểm tra xem người dùng đã review sản phẩm này rồi chưa
        const existingReview = await Review.findOne({ product: productId, user: user.id });
        if (existingReview) {
          throw new Error('You have already reviewed this product.');
        }

        let uploadedImages = [];
        if (imageFiles && imageFiles.length > 0) {
          for (const file of imageFiles) {
            const { createReadStream } = await file; // filename, mimetype cũng có thể được dùng
            const stream = createReadStream();

            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'book_reviews', resource_type: 'image' }, // Upload vào thư mục 'book_reviews'
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                }
              );
              stream.pipe(uploadStream);
            });
            uploadedImages.push({ url: result.secure_url, publicId: result.public_id });
          }
        }

        const newReview = new Review({
          product: productId,
          user: user.id,
          rating,
          comment,
          images: uploadedImages,
          isVerified: false, // Mặc định review chưa được xác thực
        });

        await newReview.save();

        // Populate và trả về review mới
        return await newReview.populate('product', 'title slug').populate('user', 'name email avatar');
      } catch (error) {
        throw new Error(`Error creating review: ${error.message}`);
      }
    },
    updateAdminReply: async (_, { input }, { user }) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      const { reviewId, text } = input;
      try {
        const review = await Review.findById(reviewId);
        if (!review) throw new Error('Review not found');

        review.adminReply = {
          text,
          repliedAt: new Date(),
        };

        await review.save();
        return await review.populate('product', 'title slug').populate('user', 'name email avatar');
      } catch (error) {
        throw new Error(`Error adding admin reply: ${error.message}`);
      }
    },
    updateReviewVerificationStatus: async (_, { input }, { user }) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      const { reviewId, isVerified } = input;
      try {
        const review = await Review.findById(reviewId);
        if (!review) throw new Error('Review not found');

        review.isVerified = isVerified;
        await review.save();

        return await review.populate('product', 'title slug').populate('user', 'name email avatar');
      } catch (error) {
        throw new Error(`Error updating review verification status: ${error.message}`);
      }
    },
  },
};

module.exports = reviewResolvers;