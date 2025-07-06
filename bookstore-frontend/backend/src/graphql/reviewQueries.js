import { gql } from '@apollo/client';

// Queries
export const GET_BOOK_REVIEWS = gql`
  query GetBookReviews($bookId: ID!, $page: Int, $limit: Int, $filter: ReviewFilterInput) {
    getBookReviews(bookId: $bookId, page: $page, limit: $limit, filter: $filter) {
      reviews {
        id
        user {
          id
          name
        }
        rating
        comment
        images {
          url
          caption
        }
        isVerified
        adminResponse
        adminResponseDate
        adminResponseBy {
          id
          name
        }
        helpfulCount
        age
        createdAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
      stats {
        averageRating
        totalReviews
        ratingDistribution {
          star1
          star2
          star3
          star4
          star5
        }
      }
    }
  }
`;

export const GET_BOOK_REVIEW_STATS = gql`
  query GetBookReviewStats($bookId: ID!) {
    getBookReviewStats(bookId: $bookId) {
      averageRating
      totalReviews
      ratingDistribution {
        star1
        star2
        star3
        star4
        star5
      }
    }
  }
`;

export const GET_MY_REVIEWS = gql`
  query GetMyReviews($page: Int, $limit: Int) {
    getMyReviews(page: $page, limit: $limit) {
      reviews {
        id
        book {
          id
          title
          author
          coverImage {
            url
          }
          slug
        }
        rating
        comment
        images {
          url
          caption
        }
        adminResponse
        adminResponseDate
        adminResponseBy {
          id
          name
        }
        helpfulCount
        age
        createdAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const CAN_REVIEW_BOOK = gql`
  query CanReviewBook($bookId: ID!) {
    canReviewBook(bookId: $bookId) {
      canReview
      reason
      eligibleOrders {
        id
        orderNumber
        createdAt
        items {
          book {
            id
            title
          }
          quantity
        }
      }
    }
  }
`;

export const GET_ALL_REVIEWS_ADMIN = gql`
  query GetAllReviews($page: Int, $limit: Int, $filter: AdminReviewFilterInput, $search: String) {
    getAllReviews(page: $page, limit: $limit, filter: $filter, search: $search) {
      reviews {
        id
        user {
          id
          name
          email
        }
        book {
          id
          title
          author
          coverImage {
            url
          }
          slug
        }
        rating
        comment
        images {
          url
          caption
        }
        isVerified
        adminResponse
        adminResponseDate
        adminResponseBy {
          id
          name
        }
        helpfulCount
        reportCount
        isHidden
        age
        createdAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($id: ID!) {
    getReviewById(id: $id) {
      id
      user {
        id
        name
        email
      }
      book {
        id
        title
        author
        coverImage {
          url
        }
        slug
      }
      order {
        id
        orderNumber
        createdAt
      }
      rating
      comment
      images {
        url
        caption
      }
      isVerified
      adminResponse
      adminResponseDate
      adminResponseBy {
        id
        name
      }
      helpfulCount
      reportCount
      isHidden
      age
      createdAt
      updatedAt
    }
  }
`;

export const GET_REVIEW_STATS_ADMIN = gql`
  query GetReviewStats {
    getReviewStats {
      totalReviews
      averageRating
      reviewsWithResponse
      reviewsWithoutResponse
      hiddenReviews
      recentReviews
      ratingDistribution {
        star1
        star2
        star3
        star4
        star5
      }
    }
  }
`;

// Mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      user {
        id
        name
      }
      book {
        id
        title
        author
      }
      rating
      comment
      images {
        url
        caption
      }
      isVerified
      helpfulCount
      age
      createdAt
    }
  }
`;

export const MARK_REVIEW_HELPFUL = gql`
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      id
      helpfulCount
    }
  }
`;

export const REPORT_REVIEW = gql`
  mutation ReportReview($reviewId: ID!, $reason: String!) {
    reportReview(reviewId: $reviewId, reason: $reason)
  }
`;

export const ADD_ADMIN_RESPONSE = gql`
  mutation AddAdminResponse($input: AdminResponseInput!) {
    addAdminResponse(input: $input) {
      id
      adminResponse
      adminResponseDate
      adminResponseBy {
        id
        name
      }
    }
  }
`;

export const UPDATE_ADMIN_RESPONSE = gql`
  mutation UpdateAdminResponse($input: AdminResponseInput!) {
    updateAdminResponse(input: $input) {
      id
      adminResponse
      adminResponseDate
      adminResponseBy {
        id
        name
      }
    }
  }
`;

export const DELETE_ADMIN_RESPONSE = gql`
  mutation DeleteAdminResponse($reviewId: ID!) {
    deleteAdminResponse(reviewId: $reviewId) {
      id
      adminResponse
      adminResponseDate
      adminResponseBy {
        id
        name
      }
    }
  }
`;

export const TOGGLE_REVIEW_VISIBILITY = gql`
  mutation ToggleReviewVisibility($reviewId: ID!) {
    toggleReviewVisibility(reviewId: $reviewId) {
      id
      isHidden
    }
  }
`;

// Subscriptions
export const REVIEW_ADDED_SUBSCRIPTION = gql`
  subscription ReviewAdded($bookId: ID) {
    reviewAdded(bookId: $bookId) {
      id
      user {
        id
        name
      }
      rating
      comment
      images {
        url
        caption
      }
      isVerified
      helpfulCount
      age
      createdAt
    }
  }
`;

export const ADMIN_RESPONSE_ADDED_SUBSCRIPTION = gql`
  subscription AdminResponseAdded {
    adminResponseAdded {
      id
      adminResponse
      adminResponseDate
      adminResponseBy {
        id
        name
      }
    }
  }
`;