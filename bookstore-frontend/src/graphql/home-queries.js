// src/graphql/home-queries.js
import { gql } from '@apollo/client';

// Query để lấy sách bán chạy nhất cho trang Home
export const GET_FEATURED_BOOKS = gql`
  query GetFeaturedBooks($limit: Int) {
    books(limit: $limit, featured: true, orderBy: "sold", orderDirection: "DESC") {
      books {
        id
        title
        author
        price
        originalPrice
        rating
        reviewCount
        stock
        sold
        coverImage {
          url
          alt
        }
        images {
          url
          alt
          isMain
        }
        category {
          id
          name
          slug
        }
        tags
        isActive
        isFeatured
      }
      totalCount
      totalPages
    }
  }
`;

// Query để lấy danh mục nổi bật
export const GET_FEATURED_CATEGORIES = gql`
  query GetFeaturedCategories {
    categories(featured: true) {
      id
      name
      description
      slug
      bookCount
      isFeatured
      sortOrder
    }
  }
`;

// Query để lấy sách mới nhất
export const GET_NEW_BOOKS = gql`
  query GetNewBooks($limit: Int) {
    books(limit: $limit, orderBy: "createdAt", orderDirection: "DESC") {
      books {
        id
        title
        author
        price
        originalPrice
        rating
        reviewCount
        stock
        coverImage {
          url
          alt
        }
        category {
          id
          name
          slug
        }
        publishedYear
        isActive
        isFeatured
      }
      totalCount
    }
  }
`;

// Query để lấy sách giảm giá
export const GET_DISCOUNTED_BOOKS = gql`
  query GetDiscountedBooks($limit: Int) {
    books(limit: $limit, hasDiscount: true) {
      books {
        id
        title
        author
        price
        originalPrice
        rating
        reviewCount
        stock
        coverImage {
          url
          alt
        }
        category {
          id
          name
          slug
        }
        isActive
        isFeatured
      }
      totalCount
    }
  }
`;