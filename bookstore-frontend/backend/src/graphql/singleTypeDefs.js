const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type Query {
    # Test query
    hello: String
    
    # Category queries
    categories: [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    activeCategories: [Category!]!
    
    # Book queries  
    books(page: Int = 1, limit: Int = 12): BookConnection!
    book(id: ID!): Book
    bookBySlug(slug: String!): Book
    featuredBooks(limit: Int = 8): [Book!]!
    
    # User queries
    me: User
  }

  type Mutation {
    # Test mutation
    test: String
    
    # Authentication
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
    createdAt: String!
    updatedAt: String!
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
    isActive: Boolean!
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