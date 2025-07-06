const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot be more than 5 stars'],
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  images: [
    {
      url: String,
      publicId: String,
    },
  ],
  adminReply: {
    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin reply cannot exceed 1000 characters'],
    },
    repliedAt: Date,
  },
  isVerified: {
    type: Boolean,
    default: false, // Reviews need to be verified by admin
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Ngăn người dùng review cùng một sản phẩm nhiều lần
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Middleware để cập nhật rating và reviewCount trong Book model
// khi một review mới được tạo hoặc xóa.
ReviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, isVerified: true },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Book').findByIdAndUpdate(productId, {
      rating: stats[0]?.averageRating || 0,
      reviewCount: stats[0]?.reviewCount || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Gọi getAverageRating sau khi save review
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

// Gọi getAverageRating sau khi remove review
ReviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);