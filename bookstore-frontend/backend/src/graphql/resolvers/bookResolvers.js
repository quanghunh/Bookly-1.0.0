const Book = require('../../models/Book');
const Category = require('../../models/Category');

const bookResolvers = {
  Query: {
    // Customer queries
    books: async (_, { page = 1, limit = 12, filter = {}, search, sortBy = 'CREATED_AT', sortOrder = 'DESC' }) => {
      try {
        const skip = (page - 1) * limit;
        
        // Build query
        let query = { isActive: true };
        
        // Apply filters
        if (filter.categoryId) query.category = filter.categoryId;
        if (filter.minPrice !== undefined) query.price = { ...query.price, $gte: filter.minPrice };
        if (filter.maxPrice !== undefined) query.price = { ...query.price, $lte: filter.maxPrice };
        if (filter.author) query.author = new RegExp(filter.author, 'i');
        if (filter.publisher) query.publisher = new RegExp(filter.publisher, 'i');
        if (filter.language) query.language = filter.language;
        if (filter.format) query.format = filter.format;
        if (filter.inStock !== undefined) {
          query.stock = filter.inStock ? { $gt: 0 } : { $eq: 0 };
        }
        if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
        if (filter.isOnSale !== undefined) query.isOnSale = filter.isOnSale;
        if (filter.rating !== undefined) query.rating = { $gte: filter.rating };
        
        // Search functionality
        if (search) {
          query.$text = { $search: search };
        }
        
        // Build sort object
        const sortMap = {
          'CREATED_AT': 'createdAt',
          'UPDATED_AT': 'updatedAt',
          'TITLE': 'title',
          'AUTHOR': 'author',
          'PRICE': 'price',
          'RATING': 'rating',
          'SOLD': 'sold',
          'VIEW_COUNT': 'viewCount'
        };
        
        const sortField = sortMap[sortBy] || 'createdAt';
        const sortDirection = sortOrder === 'ASC' ? 1 : -1;
        let sort = { [sortField]: sortDirection };
        
        // If searching, add text score to sort
        if (search) {
          sort = { score: { $meta: 'textScore' }, ...sort };
        }
        
        // Execute queries
        const books = await Book.find(query)
          .populate('category', 'name slug description')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          books,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error fetching books: ${error.message}`);
      }
    },

    book: async (_, { id }) => {
      try {
        const book = await Book.findById(id)
          .populate('category', 'name slug description')
          .lean();
          
        if (!book) {
          throw new Error('Book not found');
        }
        
        // Increment view count
        await Book.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        
        return book;
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    bookBySlug: async (_, { slug }) => {
      try {
        const book = await Book.findOne({ slug, isActive: true })
          .populate('category', 'name slug description')
          .lean();
          
        if (!book) {
          throw new Error('Book not found');
        }
        
        // Increment view count
        await Book.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
        
        return book;
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    featuredBooks: async (_, { limit = 8 }) => {
      try {
        return await Book.find({ isFeatured: true, isActive: true })
          .populate('category', 'name slug description')
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
      } catch (error) {
        throw new Error(`Error fetching featured books: ${error.message}`);
      }
    },

    booksByCategory: async (_, { categoryId, page = 1, limit = 12, sortBy = 'CREATED_AT', sortOrder = 'DESC' }) => {
      try {
        const skip = (page - 1) * limit;
        
        const sortMap = {
          'CREATED_AT': 'createdAt',
          'TITLE': 'title',
          'PRICE': 'price',
          'RATING': 'rating',
          'SOLD': 'sold'
        };
        
        const sortField = sortMap[sortBy] || 'createdAt';
        const sortDirection = sortOrder === 'ASC' ? 1 : -1;
        const sort = { [sortField]: sortDirection };
        
        const books = await Book.find({ category: categoryId, isActive: true })
          .populate('category', 'name slug description')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await Book.countDocuments({ category: categoryId, isActive: true });
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          books,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error fetching books by category: ${error.message}`);
      }
    },

    searchBooks: async (_, { query, page = 1, limit = 12, filter = {} }) => {
      try {
        const skip = (page - 1) * limit;
        
        let searchQuery = {
          $text: { $search: query },
          isActive: true,
          ...filter
        };
        
        const books = await Book.find(searchQuery, { score: { $meta: 'textScore' } })
          .populate('category', 'name slug description')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await Book.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          books,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error searching books: ${error.message}`);
      }
    },

    relatedBooks: async (_, { bookId, limit = 4 }) => {
      try {
        const book = await Book.findById(bookId).select('category tags');
        if (!book) throw new Error('Book not found');
        
        return await Book.find({
          $and: [
            { _id: { $ne: bookId } },
            { isActive: true },
            {
              $or: [
                { category: book.category },
                { tags: { $in: book.tags } }
              ]
            }
          ]
        })
        .populate('category', 'name slug description')
        .sort({ rating: -1, sold: -1 })
        .limit(limit)
        .lean();
      } catch (error) {
        throw new Error(`Error fetching related books: ${error.message}`);
      }
    },

    // Admin queries
    allBooks: async (_, { page = 1, limit = 20, filter = {}, search, sortBy = 'CREATED_AT', sortOrder = 'DESC' }) => {
      try {
        const skip = (page - 1) * limit;
        
        // Build query for admin (includes inactive books)
        let query = {};
        
        // Apply filters
        if (filter.categoryId) query.category = filter.categoryId;
        if (filter.isActive !== undefined) query.isActive = filter.isActive;
        if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
        if (filter.author) query.author = new RegExp(filter.author, 'i');
        if (filter.publisher) query.publisher = new RegExp(filter.publisher, 'i');
        
        // Search functionality
        if (search) {
          query.$or = [
            { title: new RegExp(search, 'i') },
            { author: new RegExp(search, 'i') },
            { isbn: new RegExp(search, 'i') },
            { publisher: new RegExp(search, 'i') }
          ];
        }
        
        // Build sort
        const sortMap = {
          'CREATED_AT': 'createdAt',
          'UPDATED_AT': 'updatedAt',
          'TITLE': 'title',
          'AUTHOR': 'author',
          'PRICE': 'price',
          'RATING': 'rating',
          'SOLD': 'sold',
          'VIEW_COUNT': 'viewCount'
        };
        
        const sortField = sortMap[sortBy] || 'createdAt';
        const sortDirection = sortOrder === 'ASC' ? 1 : -1;
        const sort = { [sortField]: sortDirection };
        
        const books = await Book.find(query)
          .populate('category', 'name slug description')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          books,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error fetching all books: ${error.message}`);
      }
    },

    bookStats: async () => {
      try {
        const totalBooks = await Book.countDocuments({});
        const activeBooks = await Book.countDocuments({ isActive: true });
        const inactiveBooks = totalBooks - activeBooks;
        
        const stockStats = await Book.aggregate([
          {
            $group: {
              _id: null,
              totalStock: { $sum: '$stock' },
              totalSold: { $sum: '$sold' },
              averageRating: { $avg: '$rating' }
            }
          }
        ]);
        
        const featuredBooks = await Book.countDocuments({ isFeatured: true });
        const outOfStockBooks = await Book.countDocuments({ stock: 0 });
        
        return {
          totalBooks,
          activeBooks,
          inactiveBooks,
          totalStock: stockStats[0]?.totalStock || 0,
          totalSold: stockStats[0]?.totalSold || 0,
          averageRating: Math.round((stockStats[0]?.averageRating || 0) * 100) / 100,
          featuredBooks,
          outOfStockBooks
        };
      } catch (error) {
        throw new Error(`Error fetching book stats: ${error.message}`);
      }
    }
  },

  Mutation: {
    // Admin mutations
    createBook: async (_, { input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Validate category exists
        const category = await Category.findById(input.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
        
        // Create book
        const bookData = { ...input, category: input.categoryId };
        delete bookData.categoryId;
        
        const book = new Book(bookData);
        await book.save();
        
        // Update category book count
        await Category.findByIdAndUpdate(input.categoryId, { $inc: { bookCount: 1 } });
        
        return await Book.findById(book._id).populate('category', 'name slug description').lean();
      } catch (error) {
        throw new Error(`Error creating book: ${error.message}`);
      }
    },

    updateBook: async (_, { id, input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        
        // If category is being changed, validate new category
        if (input.categoryId && input.categoryId !== book.category.toString()) {
          const newCategory = await Category.findById(input.categoryId);
          if (!newCategory) {
            throw new Error('New category not found');
          }
          
          // Update book counts
          await Category.findByIdAndUpdate(book.category, { $inc: { bookCount: -1 } });
          await Category.findByIdAndUpdate(input.categoryId, { $inc: { bookCount: 1 } });
          
          input.category = input.categoryId;
        }
        
        delete input.categoryId;
        
        const updatedBook = await Book.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).populate('category', 'name slug description').lean();
        
        return updatedBook;
      } catch (error) {
        throw new Error(`Error updating book: ${error.message}`);
      }
    },

    deleteBook: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        
        // Update category book count
        await Category.findByIdAndUpdate(book.category, { $inc: { bookCount: -1 } });
        
        await Book.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Error deleting book: ${error.message}`);
      }
    },

    toggleBookStatus: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        
        book.isActive = !book.isActive;
        await book.save();
        
        return await Book.findById(id).populate('category', 'name slug description').lean();
      } catch (error) {
        throw new Error(`Error toggling book status: ${error.message}`);
      }
    },

    toggleFeaturedStatus: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        
        book.isFeatured = !book.isFeatured;
        await book.save();
        
        return await Book.findById(id).populate('category', 'name slug description').lean();
      } catch (error) {
        throw new Error(`Error toggling featured status: ${error.message}`);
      }
    },

    updateBookStock: async (_, { id, quantity, operation }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        
        if (operation === 'add') {
          book.stock += quantity;
        } else if (operation === 'subtract') {
          book.stock = Math.max(0, book.stock - quantity);
          book.sold += Math.min(book.stock + quantity, quantity);
        } else {
          throw new Error('Invalid operation. Use "add" or "subtract"');
        }
        
        await book.save();
        
        return await Book.findById(id).populate('category', 'name slug description').lean();
      } catch (error) {
        throw new Error(`Error updating stock: ${error.message}`);
      }
    }
  }
};

module.exports = bookResolvers;