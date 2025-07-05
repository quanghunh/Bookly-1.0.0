import { gql } from '@apollo/client';

// Auth Queries & Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
      expiresIn
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      isActive
    }
  }
`;

// Category Queries & Mutations
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      slug
      bookCount
      isActive
      isFeatured
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      slug
      isActive
      isFeatured
      sortOrder
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      slug
      isActive
      isFeatured
      sortOrder
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const TOGGLE_CATEGORY_STATUS = gql`
  mutation ToggleCategoryStatus($id: ID!) {
    toggleCategoryStatus(id: $id) {
      id
      isActive
    }
  }
`;

// Book Queries & Mutations
export const GET_BOOKS = gql`
  query GetBooks($page: Int, $limit: Int, $search: String) {
    books(page: $page, limit: $limit, search: $search) {
      books {
        id
        title
        author
        price
        originalPrice
        stock
        sold
        rating
        reviewCount
        isActive
        isFeatured
        slug
        category {
          id
          name
          slug
        }
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      author
      isbn
      description
      price
      originalPrice
      publisher
      publishedYear
      pages
      language
      format
      stock
      sold
      rating
      reviewCount
      isActive
      isFeatured
      tags
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      title
      author
      price
      stock
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: BookUpdateInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      author
      price
      stock
      isActive
      isFeatured
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const TOGGLE_BOOK_STATUS = gql`
  mutation ToggleBookStatus($id: ID!) {
    toggleBookStatus(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_BOOK_FEATURED = gql`
  mutation ToggleFeaturedStatus($id: ID!) {
    toggleFeaturedStatus(id: $id) {
      id
      isFeatured
    }
  }
`;

// Dashboard Stats
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    bookStats {
      totalBooks
      activeBooks
      inactiveBooks
      totalStock
      totalSold
      averageRating
      featuredBooks
      outOfStockBooks
    }
    categoryStats {
      totalCategories
      activeCategories
      inactiveCategories
      featuredCategories
    }
  }
`;