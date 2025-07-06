// backend/src/graphql/typeDefs/index.js
const { gql } = require('apollo-server-express');
const userTypeDefs = require('./userTypeDefs');
const bookTypeDefs = require('./bookTypeDefs');
const categoryTypeDefs = require('./categoryTypeDefs');
const reviewTypeDefs = require('./reviewTypeDefs'); // Thêm dòng này

// Base type definitions
const baseTypeDefs = gql`
  scalar Upload # Cần đảm bảo scalar Upload được định nghĩa ở đây hoặc trong reviewTypeDefs

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

// Combine all type definitions into a single string
const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  bookTypeDefs,
  categoryTypeDefs,
  reviewTypeDefs // Thêm dòng này
];

module.exports = typeDefs;