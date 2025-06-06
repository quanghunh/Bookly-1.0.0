const { gql } = require('apollo-server-express')

const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String
    price: Float
    image: String
    description: String
    categoryId: ID
  }

  type Query {
    getAllBooks: [Book]
    getBookById(id: ID!): Book
  }
`

module.exports = bookTypeDefs
