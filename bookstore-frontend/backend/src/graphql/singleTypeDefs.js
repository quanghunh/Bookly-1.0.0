// backend/src/graphql/singleTypeDefs.js - Complete Updated Version
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type Query {
    # Test query
    hello: String
    
    # Category queries - UPDATED to support featured parameter
    categories(featured: Boolean): [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    activeCategories: [Category!]!
    
    # Book queries - UPDATED to support featured, orderBy, orderDirection
    books(
      page: Int = 1, 
      limit: Int = 12, 
      search: String, 
      featured: Boolean, 
      orderBy: String, 
      orderDirection: String
    ): BookConnection!
    book(id: ID!): Book
    bookBySlug(slug: String!): Book
    featuredBooks(limit: Int = 8): [Book!]!
    
    # User queries
    me: User
  }

  type Mutation {
    # Test mutation
    test: String
    
    # Customer Authentication (không cần token)
    customerLogin(input: CustomerLoginInput!): CustomerAuthResponse!
    customerRegister(input: CustomerRegisterInput!): CustomerAuthResponse!
    
    # Admin Authentication (cần token)
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # Category mutations (Admin only)
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
    
    # Book mutations (Admin only)
    createBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookUpdateInput!): Book!
    deleteBook(id: ID!): Boolean!
  }

  # Customer Auth Types (không cần token)
  input CustomerLoginInput {
    email: String!
    password: String!
  }

  input CustomerRegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
    dateOfBirth: String
    gender: String
  }

  type CustomerAuthResponse {
    success: Boolean!
    message: String!
    user: User!
  }

  # Category Types
  type Category {
    id: ID!
    name: String!
    description: String
    slug: String!
    bookCount: Int!
    isActive: Boolean!
    isFeatured: Boolean!
    sortOrder: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CategoryInput {
    name: String!
    description: String
    slug: String
    sortOrder: Int
    isFeatured: Boolean
  }

  input CategoryUpdateInput {
    name: String
    description: String
    slug: String
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
  }

  # Book Types
  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String
    description: String!
    price: Float!
    originalPrice: Float
    category: Category!
    publisher: String
    publishedYear: Int
    pages: Int
    language: String
    stock: Int!
    sold: Int!
    rating: Float!
    reviewCount: Int!
    isActive: Boolean!
    isFeatured: Boolean!
    tags: [String!]!
    slug: String!
    coverImage: BookImage
    images: [BookImage!]!
    createdAt: String!
    updatedAt: String!
  }

  type BookImage {
    url: String!
    publicId: String
    alt: String
    isMain: Boolean
  }

  input BookInput {
    title: String!
    author: String!
    isbn: String
    description: String!
    price: Float!
    originalPrice: Float
    categoryId: ID!
    publisher: String
    publishedYear: Int
    pages: Int
    language: String
    stock: Int!
    isFeatured: Boolean
    tags: [String!]
  }

  input BookUpdateInput {
    title: String
    author: String
    isbn: String
    description: String
    price: Float
    originalPrice: Float
    categoryId: ID
    publisher: String
    publishedYear: Int
    pages: Int
    language: String
    stock: Int
    isFeatured: Boolean
    isActive: Boolean
    tags: [String!]
  }

  type BookConnection {
    books: [Book!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  # User Types
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    phone: String
    dateOfBirth: String
    gender: String
    isActive: Boolean!
    isEmailVerified: Boolean!
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
    expiresIn: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
  }

  input LoginInput {
    email: String!
    password: String!
  }
`;

module.exports = typeDefs;