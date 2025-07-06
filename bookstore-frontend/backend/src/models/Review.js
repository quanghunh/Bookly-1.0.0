const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String
  }],
  isVerified: {
    type: Boolean,
    default: true // Verified because user purchased the product
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin response cannot exceed 500 characters']
  },
  adminResponseDate: {
    type: Date
  },
  adminResponseBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  reportCount: {
    type: Number,
    default: 0,
    min: [0, 'Report count cannot be negative']
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ book: 1, user: 1 }, { unique: true }); // One review per user per book
reviewSchema.index({ book: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1, isHidden: 1 });
reviewSchema.index({ createdAt: -1 });

// Pre-save middleware to verify user purchased the book
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Order = mongoose.model('Order');
    
    // Check if user has a delivered order containing this book
    const orderExists = await Order.findOne({
      _id: this.order,
      user: this.user,
      status: 'delivered',
      'items.book': this.book
    });
    
    if (!orderExists) {
      throw new Error('You can only review books you have purchased and received');
    }
    
    // Check if user already reviewed this book
    const existingReview = await this.constructor.findOne({
      user: this.user,
      book: this.book,
      _id: { $ne: this._id }
    });
    
    if (existingReview) {
      throw new Error('You have already reviewed this book');
    }
  }
  next();
});

// Post-save middleware to update book rating
reviewSchema.post('save', async function() {
  await this.updateBookRating();
});

// Post-remove middleware to update book rating
reviewSchema.post('remove', async function() {
  await this.updateBookRating();
});

// Instance method to update book's average rating
reviewSchema.methods.updateBookRating = async function() {
  const Review = this.constructor;
  const Book = mongoose.model('Book');
  
  const stats = await Review.aggregate([
    {
      $match: {
        book: this.book,
        isHidden: false
      }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await Book.findByIdAndUpdate(this.book, {
      rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: stats[0].totalReviews
    });
  } else {
    await Book.findByIdAndUpdate(this.book, {
      rating: 0,
      reviewCount: 0
    });
  }
};

// Static method to get review statistics for a book
reviewSchema.statics.getBookReviewStats = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: {
        book: mongoose.Types.ObjectId(bookId),
        isHidden: false
      }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        averageRating: { $round: ['$averageRating', 1] },
        totalReviews: 1,
        ratingDistribution: {
          $reduce: {
            input: [1, 2, 3, 4, 5],
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $let: {
                    vars: {
                      rating: '$$this',
                      count: {
                        $size: {
                          $filter: {
                            input: '$ratingDistribution',
                            cond: { $eq: ['$$item', '$$this'] }
                          }
                        }
                      }
                    },
                    in: {
                      $arrayToObject: [[{
                        k: { $toString: '$$rating' },
                        v: '$$count'
                      }]]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  };
};

// Static method to get reviews for a book with filters
reviewSchema.statics.getBookReviews = async function(bookId, options = {}) {
  const {
    page = 1,
    limit = 10,
    rating = null,
    sortBy = 'newest' // newest, oldest, highest, lowest, helpful
  } = options;
  
  const skip = (page - 1) * limit;
  
  // Build match conditions
  const match = {
    book: mongoose.Types.ObjectId(bookId),
    isHidden: false
  };
  
  if (rating) {
    match.rating = parseInt(rating);
  }
  
  // Build sort conditions
  let sort = {};
  switch (sortBy) {
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'highest':
      sort = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sort = { rating: 1, createdAt: -1 };
      break;
    case 'helpful':
      sort = { helpfulCount: -1, createdAt: -1 };
      break;
    default: // newest
      sort = { createdAt: -1 };
  }
  
  const reviews = await this.find(match)
    .populate('user', 'name')
    .populate('adminResponseBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
  
  const totalCount = await this.countDocuments(match);
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    reviews,
    totalCount,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    currentPage: page,
    totalPages
  };
};

// Virtual for review age
reviewSchema.virtual('age').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);