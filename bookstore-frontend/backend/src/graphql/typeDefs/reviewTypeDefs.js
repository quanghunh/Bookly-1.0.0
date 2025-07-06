const { gql } = require('apollo-server-express');

const reviewTypeDefs = gql`
  type Review {
    id: ID!
    user: User!
    book: Book!
    order: Order!
    rating: Int!
    comment: String!
    images: [ReviewImage!]!
    isVerified: Boolean!
    adminResponse: String
    adminResponseDate: String
    adminResponseBy: User
    helpfulCount: Int!
    reportCount: Int!
    isHidden: Boolean!
    age: String
    createdAt: String!
    updatedAt: String!
  }

  type ReviewImage {
    url: String!
    publicId: String
    caption: String
  }

  type ReviewStats {
    averageRating: Float!
    totalReviews: Int!
    ratingDistribution: RatingDistribution!
  }

  type RatingDistribution {
    star1: Int!
    star2: Int!
    star3: Int!
    star4: Int!
    star5: Int!
  }

  type ReviewConnection {
    reviews: [Review!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
    stats: ReviewStats!
  }

  input CreateReviewInput {
    bookId: ID!
    orderId: ID!
    rating: Int!
    comment: String!
    images: [ReviewImageInput!]
  }

  input ReviewImageInput {
    url: String!
    publicId: String
    caption: String
  }

  input AdminResponseInput {
    reviewId: ID!
    response: String!
  }

  input ReviewFilterInput {
    rating: Int
    sortBy: ReviewSortBy
  }

  enum ReviewSortBy {
    NEWEST
    OLDEST
    HIGHEST_RATING
    LOWEST_RATING
    MOST_HELPFUL
  }

  extend type Query {
    # Public queries
    getBookReviews(
      bookId: ID!
      page: Int = 1
      limit: Int = 10
      filter: ReviewFilterInput
    ): ReviewConnection!
    
    getBookReviewStats(bookId: ID!): ReviewStats!
    
    # User queries (authenticated)
    getMyReviews(
      page: Int = 1
      limit: Int = 10
    ): ReviewConnection!
    
    canReviewBook(bookId: ID!): CanReviewResult!
    
    # Admin queries
    getAllReviews(
      page: Int = 1
      limit: Int = 20
      filter: AdminReviewFilterInput
      search: String
    ): ReviewConnection!
    
    getReviewById(id: ID!): Review
    
    getReviewStats: AdminReviewStats!
  }

  extend type Mutation {
    # User mutations
    createReview(input: CreateReviewInput!): Review!
    markReviewHelpful(reviewId: ID!): Review!
    reportReview(reviewId: ID!, reason: String!): Boolean!
    
    # Admin mutations
    addAdminResponse(input: AdminResponseInput!): Review!
    updateAdminResponse(input: AdminResponseInput!): Review!
    deleteAdminResponse(reviewId: ID!): Review!
    toggleReviewVisibility(reviewId: ID!): Review!
  }

  type CanReviewResult {
    canReview: Boolean!
    reason: String
    eligibleOrders: [Order!]!
  }

  input AdminReviewFilterInput {
    rating: Int
    hasAdminResponse: Boolean
    isHidden: Boolean
    sortBy: ReviewSortBy
  }

  type AdminReviewStats {
    totalReviews: Int!
    averageRating: Float!
    reviewsWithResponse: Int!
    reviewsWithoutResponse: Int!
    hiddenReviews: Int!
    recentReviews: Int!
    ratingDistribution: RatingDistribution!
  }

  extend type Subscription {
    reviewAdded(bookId: ID): Review!
    adminResponseAdded: Review!
  }
`;

module.exports = reviewTypeDefs;