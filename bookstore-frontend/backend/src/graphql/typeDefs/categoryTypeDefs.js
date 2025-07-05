const { gql } = require('apollo-server-express');

const categoryTypeDefs = gql`
  input CategoryInput {
    name: String!
    description: String
    slug: String
    parentCategoryId: ID
    sortOrder: Int
    isFeatured: Boolean
    metaTitle: String
    metaDescription: String
    keywords: [String!]
  }

  input CategoryUpdateInput {
    name: String
    description: String
    slug: String
    parentCategoryId: ID
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    metaTitle: String
    metaDescription: String
    keywords: [String!]
  }

  input CategoryFilterInput {
    isActive: Boolean
    isFeatured: Boolean
    parentCategoryId: ID
    hasParent: Boolean
  }

  type CategoryHierarchy {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: CategoryImage
    bookCount: Int!
    isFeatured: Boolean!
    children: [Category!]!
  }

  extend type Query {
    # Customer queries
    categories(filter: CategoryFilterInput): [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    activeCategories: [Category!]!
    featuredCategories(limit: Int = 6): [Category!]!
    categoryHierarchy: [CategoryHierarchy!]!
    
    # Admin queries
    allCategories(
      page: Int = 1
      limit: Int = 20
      filter: CategoryFilterInput
      search: String
    ): CategoryConnection!
    
    categoryStats: CategoryStats!
  }

  type CategoryConnection {
    categories: [Category!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  type CategoryStats {
    totalCategories: Int!
    activeCategories: Int!
    inactiveCategories: Int!
    featuredCategories: Int!
    parentCategories: Int!
    subCategories: Int!
  }

  extend type Mutation {
    # Admin mutations
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
    toggleCategoryStatus(id: ID!): Category!
    toggleCategoryFeatured(id: ID!): Category!
    
    # Image management
    uploadCategoryImage(categoryId: ID!, file: Upload!): CategoryImage!
    deleteCategoryImage(categoryId: ID!): Boolean!
    
    # Bulk operations
    bulkUpdateCategories(ids: [ID!]!, input: CategoryUpdateInput!): [Category!]!
    bulkDeleteCategories(ids: [ID!]!): Boolean!
    
    # Category hierarchy management
    reorderCategories(categoryOrders: [CategoryOrderInput!]!): [Category!]!
  }

  input CategoryOrderInput {
    id: ID!
    sortOrder: Int!
  }
`;

module.exports = categoryTypeDefs;