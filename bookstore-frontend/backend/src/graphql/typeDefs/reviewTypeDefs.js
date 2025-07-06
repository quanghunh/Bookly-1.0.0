// backend/src/graphql/typeDefs/reviewTypeDefs.js
const { gql } = require('apollo-server-express');

const reviewTypeDefs = gql`
  scalar Upload # Cần scalar này để xử lý upload file ảnh

  type Review {
    id: ID!
    product: Book!
    user: User!
    rating: Int!
    comment: String
    images: [ReviewImage!]
    adminReply: AdminReply
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type ReviewImage {
    url: String!
    publicId: String
  }

  type AdminReply {
    text: String!
    repliedAt: String!
  }

  input CreateReviewInput {
    productId: ID!
    rating: Int!
    comment: String
    imageFiles: [Upload!] # Tạm thời dùng Upload, bạn cần cài đặt handler cho nó
  }

  input UpdateAdminReplyInput {
    reviewId: ID!
    text: String!
  }

  input UpdateReviewVerificationInput {
    reviewId: ID!
    isVerified: Boolean!
  }

  input ReviewFilterInput {
    productId: ID
    userId: ID
    rating: Int
    isVerified: Boolean
  }

  type ReviewConnection {
    reviews: [Review!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  extend type Query {
    # Public queries
    reviews(
      productId: ID
      userId: ID
      isVerified: Boolean = true
      page: Int = 1
      limit: Int = 10
      sortBy: String = "createdAt"
      sortOrder: String = "desc"
    ): ReviewConnection!
    
    review(id: ID!): Review

    # Admin queries
    adminReviews(
      productId: ID
      userId: ID
      isVerified: Boolean
      page: Int = 1
      limit: Int = 20
      sortBy: String = "createdAt"
      sortOrder: String = "desc"
    ): ReviewConnection!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateAdminReply(input: UpdateAdminReplyInput!): Review!
    updateReviewVerificationStatus(input: UpdateReviewVerificationInput!): Review!
    # Không cho phép xóa review của người dùng theo yêu cầu
    # deleteReview(id: ID!): Boolean! 
  }
`;

module.exports = reviewTypeDefs;