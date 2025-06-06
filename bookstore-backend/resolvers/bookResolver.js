const Book = require('../models/Book')

const bookResolver = {
  Query: {
    getAllBooks: async () => {
      try {
        return await Book.find()
      } catch (error) {
        throw new Error('Error fetching books')
      }
    },
    getBookById: async (_, { id }) => {
      try {
        return await Book.findById(id)
      } catch (error) {
        throw new Error('Book not found')
      }
    }
  }
}

module.exports = bookResolver
