import { gql } from '@apollo/client';

export const CUSTOMER_LOGIN_MUTATION = gql`
  mutation CustomerLogin($input: CustomerLoginInput!) {
    customerLogin(input: $input) {
      success
      message
      user {
        id
        name
        email
        role
        phone
        dateOfBirth
        gender
        isActive
        isEmailVerified
        lastLogin
        createdAt
      }
    }
  }
`;

export const CUSTOMER_REGISTER_MUTATION = gql`
  mutation CustomerRegister($input: CustomerRegisterInput!) {
    customerRegister(input: $input) {
      success
      message
      user {
        id
        name
        email
        role
        phone
        dateOfBirth
        gender
        isActive
        isEmailVerified
        createdAt
      }
    }
  }
`;

// Book Queries
export const GET_CUSTOMER_BOOKS = gql`
  query GetBooks($page: Int, $limit: Int, $search: String) {
    books(page: $page, limit: $limit, search: $search) {
      books {
        id
        title
        author
        isbn
        description
        price
        originalPrice
        rating
        reviewCount
        stock
        sold
        isFeatured
        tags
        slug
        category {
          id
          name
          slug
        }
        coverImage {
          url
          alt
        }
        images {
          url
          alt
          isMain
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

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      bookCount
      isFeatured
      isActive
      sortOrder
    }
  }
`;

export const GET_FEATURED_BOOKS = gql`
  query GetFeaturedBooks($limit: Int = 8) {
    featuredBooks(limit: $limit) {
      id
      title
      author
      price
      originalPrice
      rating
      reviewCount
      category {
        name
      }
      coverImage {
        url
      }
      slug
    }
  }
`;
