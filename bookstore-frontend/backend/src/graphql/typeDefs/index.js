const { gql } = require('apollo-server-express');
const userTypeDefs = require('./userTypeDefs');
const bookTypeDefs = require('./bookTypeDefs');
const categoryTypeDefs = require('./categoryTypeDefs');

// Base type definitions
const baseTypeDefs = gql`
  scalar Upload

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
  categoryTypeDefs
];

module.exports = typeDefs;