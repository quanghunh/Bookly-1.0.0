const Review = require('../../models/Review');
const Book = require('../../models/Book');
const Order = require('../../models/Order');
const User = require('../../models/User');
const { withFilter } = require('graphql-subscriptions');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const reviewResolvers = {
  Query: {
    // Public queries
    getBookReviews: async (_, { bookId, page = 1, limit = 10, filter = {} }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        const options = {
          page,
          limit,
          rating: filter.rating,
          sortBy: filter.sortBy?.toLowerCase() || 'newest'
        };

        const result = await Review.getBookReviews(bookId, options);
        const stats = await Review.getBookReviewStats(bookId);

        return {
          ...result,
          stats: {
            ...stats,
            ratingDistribution: {
              star1: stats.ratingDistribution['1'] || 0,
              star2: stats.ratingDistribution['2'] || 0,
              star3: stats.ratingDistribution['3'] || 0,
              star4: stats.ratingDistribution['4'] || 0,
              star5: stats.ratingDistribution['5'] || 0
            }
          }
        };
      } catch (error) {
        throw new Error(`Error fetching book reviews: ${error.message}`);
      }
    },

    getBookReviewStats: async (_, { bookId }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        const stats = await Review.getBookReviewStats(bookId);
        return {
          ...stats,
          ratingDistribution: {
            star1: stats.ratingDistribution['1'] || 0,
            star2: stats.ratingDistribution['2'] || 0,
            star3: stats.ratingDistribution['3'] || 0,
            star4: stats.ratingDistribution['4'] || 0,
            star5: stats.ratingDistribution['5'] || 0
          }
        };
      } catch (error) {
        throw new Error(`Error fetching review stats: ${error.message}`);
      }
    },

    // User queries
    getMyReviews: async (_, { page = 1, limit = 10 }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user: user.id })
          .populate('book', 'title author coverImage slug')
          .populate('adminResponseBy', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        const totalCount = await Review.countDocuments({ user: user.id });
        const totalPages = Math.ceil(totalCount / limit);

        return {
          reviews,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages,
          stats: {
            averageRating: 0,
            totalReviews: totalCount,
            ratingDistribution: {
              star1: 0, star2: 0, star3: 0, star4: 0, star5: 0
            }
          }
        };
      } catch (error) {
        throw new Error(`Error fetching your reviews: ${error.message}`);
      }
    },

    canReviewBook: async (_, { bookId }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }

        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({
          user: user.id,
          book: bookId
        });

        if (existingReview) {
          return {
            canReview: false,
            reason: 'You have already reviewed this book',
            eligibleOrders: []
          };
        }

        // Find eligible orders (delivered orders containing this book)
        const eligibleOrders = await Order.find({
          user: user.id,
          status: 'delivered',
          'items.book': bookId
        }).populate('items.book', 'title').lean();

        if (eligibleOrders.length === 0) {
          return {
            canReview: false,
            reason: 'You can only review books you have purchased and received',
            eligibleOrders: []
          };
        }

        return {
          canReview: true,
          reason: null,
          eligibleOrders
        };
      } catch (error) {
        throw new Error(`Error checking review eligibility: ${error.message}`);
      }
    },

    // Admin queries
    getAllReviews: async (_, { page = 1, limit = 20, filter = {}, search }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const skip = (page - 1) * limit;
        let query = {};

        // Apply filters
        if (filter.rating) query.rating = filter.rating;
        if (filter.hasAdminResponse !== undefined) {
          query.adminResponse = filter.hasAdminResponse ? { $exists: true, $ne: null } : { $exists: false };
        }
        if (filter.isHidden !== undefined) query.isHidden = filter.isHidden;

        // Search functionality
        if (search) {
          const users = await User.find({
            $or: [
              { name: new RegExp(search, 'i') },
              { email: new RegExp(search, 'i') }
            ]
          }).select('_id');

          const books = await Book.find({
            $or: [
              { title: new RegExp(search, 'i') },
              { author: new RegExp(search, 'i') }
            ]
          }).select('_id');

          query.$or = [
            { comment: new RegExp(search, 'i') },
            { user: { $in: users.map(u => u._id) } },
            { book: { $in: books.map(b => b._id) } }
          ];
        }

        // Build sort
        let sort = {};
        switch (filter.sortBy?.toLowerCase()) {
          case 'oldest':
            sort = { createdAt: 1 };
            break;
          case 'highest_rating':
            sort = { rating: -1, createdAt: -1 };
            break;
          case 'lowest_rating':
            sort = { rating: 1, createdAt: -1 };
            break;
          case 'most_helpful':
            sort = { helpfulCount: -1, createdAt: -1 };
            break;
          default:
            sort = { createdAt: -1 };
        }

        const reviews = await Review.find(query)
          .populate('user', 'name email')
          .populate('book', 'title author coverImage slug')
          .populate('adminResponseBy', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();

        const totalCount = await Review.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
          reviews,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages,
          stats: {
            averageRating: 0,
            totalReviews: totalCount,
            ratingDistribution: {
              star1: 0, star2: 0, star3: 0, star4: 0, star5: 0
            }
          }
        };
      } catch (error) {
        throw new Error(`Error fetching all reviews: ${error.message}`);
      }
    },

    getReviewById: async (_, { id }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const review = await Review.findById(id)
          .populate('user', 'name email')
          .populate('book', 'title author coverImage slug')
          .populate('order', 'orderNumber createdAt')
          .populate('adminResponseBy', 'name')
          .lean();

        if (!review) {
          throw new Error('Review not found');
        }

        return review;
      } catch (error) {
        throw new Error(`Error fetching review: ${error.message}`);
      }
    },

    getReviewStats: async (_, __, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const totalReviews = await Review.countDocuments({});
        const reviewsWithResponse = await Review.countDocuments({ 
          adminResponse: { $exists: true, $ne: null } 
        });
        const hiddenReviews = await Review.countDocuments({ isHidden: true });
        
        // Recent reviews (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentReviews = await Review.countDocuments({
          createdAt: { $gte: sevenDaysAgo }
        });

        // Average rating
        const avgRatingResult = await Review.aggregate([
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);
        const averageRating = avgRatingResult[0]?.avgRating || 0;

        // Rating distribution
        const ratingDist = await Review.aggregate([
          {
            $group: {
              _id: '$rating',
              count: { $sum: 1 }
            }
          }
        ]);

        const ratingDistribution = {
          star1: 0, star2: 0, star3: 0, star4: 0, star5: 0
        };

        ratingDist.forEach(item => {
          ratingDistribution[`star${item._id}`] = item.count;
        });

        return {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewsWithResponse,
          reviewsWithoutResponse: totalReviews - reviewsWithResponse,
          hiddenReviews,
          recentReviews,
          ratingDistribution
        };
      } catch (error) {
        throw new Error(`Error fetching review stats: ${error.message}`);
      }
    }
  },

  Mutation: {
    // User mutations
    createReview: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }

        const { bookId, orderId, rating, comment, images = [] } = input;

        // Validate order and book
        const order = await Order.findOne({
          _id: orderId,
          user: user.id,
          status: 'delivered',
          'items.book': bookId
        });

        if (!order) {
          throw new Error('Invalid order. You can only review books from delivered orders.');
        }

        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        // Create review
        const review = new Review({
          user: user.id,
          book: bookId,
          order: orderId,
          rating,
          comment,
          images
        });

        await review.save();

        // Populate the review
        const populatedReview = await Review.findById(review._id)
          .populate('user', 'name')
          .populate('book', 'title author coverImage slug')
          .lean();

        // Publish to subscription
        pubsub.publish('REVIEW_ADDED', { 
          reviewAdded: populatedReview,
          bookId 
        });

        return populatedReview;
      } catch (error) {
        throw new Error(`Error creating review: ${error.message}`);
      }
    },

    markReviewHelpful: async (_, { reviewId }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        // Increment helpful count
        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          { $inc: { helpfulCount: 1 } },
          { new: true }
        ).populate('user', 'name').lean();

        return updatedReview;
      } catch (error) {
        throw new Error(`Error marking review helpful: ${error.message}`);
      }
    },

    reportReview: async (_, { reviewId, reason }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        // Increment report count
        await Review.findByIdAndUpdate(reviewId, { $inc: { reportCount: 1 } });

        // Here you could also create a separate Report model to track who reported what
        // For now, we'll just increment the counter

        return true;
      } catch (error) {
        throw new Error(`Error reporting review: ${error.message}`);
      }
    },

    // Admin mutations
    addAdminResponse: async (_, { input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const { reviewId, response } = input;

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        if (review.adminResponse) {
          throw new Error('This review already has an admin response. Use updateAdminResponse to modify it.');
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          {
            adminResponse: response,
            adminResponseDate: new Date(),
            adminResponseBy: user.id
          },
          { new: true }
        )
        .populate('user', 'name')
        .populate('book', 'title author coverImage slug')
        .populate('adminResponseBy', 'name')
        .lean();

        // Publish to subscription
        pubsub.publish('ADMIN_RESPONSE_ADDED', { adminResponseAdded: updatedReview });

        return updatedReview;
      } catch (error) {
        throw new Error(`Error adding admin response: ${error.message}`);
      }
    },

    updateAdminResponse: async (_, { input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const { reviewId, response } = input;

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        if (!review.adminResponse) {
          throw new Error('This review does not have an admin response. Use addAdminResponse to create one.');
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          {
            adminResponse: response,
            adminResponseDate: new Date(),
            adminResponseBy: user.id
          },
          { new: true }
        )
        .populate('user', 'name')
        .populate('book', 'title author coverImage slug')
        .populate('adminResponseBy', 'name')
        .lean();

        return updatedReview;
      } catch (error) {
        throw new Error(`Error updating admin response: ${error.message}`);
      }
    },

    deleteAdminResponse: async (_, { reviewId }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          {
            $unset: {
              adminResponse: 1,
              adminResponseDate: 1,
              adminResponseBy: 1
            }
          },
          { new: true }
        )
        .populate('user', 'name')
        .populate('book', 'title author coverImage slug')
        .lean();

        return updatedReview;
      } catch (error) {
        throw new Error(`Error deleting admin response: ${error.message}`);
      }
    },

    toggleReviewVisibility: async (_, { reviewId }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          { isHidden: !review.isHidden },
          { new: true }
        )
        .populate('user', 'name')
        .populate('book', 'title author coverImage slug')
        .populate('adminResponseBy', 'name')
        .lean();

        // Update book rating after hiding/showing review
        await review.updateBookRating();

        return updatedReview;
      } catch (error) {
        throw new Error(`Error toggling review visibility: ${error.message}`);
      }
    }
  },

  Subscription: {
    reviewAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['REVIEW_ADDED']),
        (payload, variables) => {
          // If bookId is provided, only send reviews for that book
          if (variables.bookId) {
            return payload.bookId === variables.bookId;
          }
          return true;
        }
      )
    },

    adminResponseAdded: {
      subscribe: () => pubsub.asyncIterator(['ADMIN_RESPONSE_ADDED'])
    }
  }
};

module.exports = reviewResolvers;