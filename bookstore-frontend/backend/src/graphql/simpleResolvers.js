const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    
    // Category queries
    categories: async () => {
      try {
        return await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
      } catch (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
      }
    },

    category: async (_, { id }) => {
      try {
        return await Category.findById(id);
      } catch (error) {
        throw new Error(`Error fetching category: ${error.message}`);
      }
    },

    categoryBySlug: async (_, { slug }) => {
      try {
        return await Category.findOne({ slug, isActive: true });
      } catch (error) {
        throw new Error(`Error fetching category: ${error.message}`);
      }
    },

    activeCategories: async () => {
      try {
        return await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
      } catch (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
      }
    },

    // Book queries
    books: async (_, { page = 1, limit = 12 }) => {
      try {
        const skip = (page - 1) * limit;
        
        const books = await Book.find({ isActive: true })
          .populate('category', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
          
        const totalCount = await Book.countDocuments({ isActive: true });
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
        return await Book.findById(id).populate('category', 'name slug');
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    bookBySlug: async (_, { slug }) => {
      try {
        return await Book.findOne({ slug, isActive: true }).populate('category', 'name slug');
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    featuredBooks: async (_, { limit = 8 }) => {
      try {
        return await Book.find({ isFeatured: true, isActive: true })
          .populate('category', 'name slug')
          .sort({ createdAt: -1 })
          .limit(limit);
      } catch (error) {
        throw new Error(`Error fetching featured books: ${error.message}`);
      }
    },

    // User queries
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      return await User.findById(user.id);
    }
  },

  Mutation: {
    test: () => 'Test mutation working!',

    // Authentication
    register: async (_, { input }) => {
      try {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        const user = new User(input);
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        const userResponse = await User.findById(user._id);

        return {
          token,
          user: userResponse,
          expiresIn: '7 days'
        };
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    login: async (_, { input }) => {
      try {
        const { email, password } = input;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        const userResponse = await User.findById(user._id);

        return {
          token,
          user: userResponse,
          expiresIn: '7 days'
        };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    // Category mutations
    createCategory: async (_, { input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const category = new Category(input);
        await category.save();

        return category;
      } catch (error) {
        throw new Error(`Error creating category: ${error.message}`);
      }
    },

    updateCategory: async (_, { id, input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!updatedCategory) {
          throw new Error('Category not found');
        }

        return updatedCategory;
      } catch (error) {
        throw new Error(`Error updating category: ${error.message}`);
      }
    },

    deleteCategory: async (_, { id }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const bookCount = await Book.countDocuments({ category: id });
        if (bookCount > 0) {
          throw new Error(`Cannot delete category. It has ${bookCount} books associated with it.`);
        }

        await Category.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Error deleting category: ${error.message}`);
      }
    },

    // Book mutations
    createBook: async (_, { input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const category = await Category.findById(input.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }

        const bookData = { ...input, category: input.categoryId };
        delete bookData.categoryId;

        const book = new Book(bookData);
        await book.save();

        await Category.findByIdAndUpdate(input.categoryId, { $inc: { bookCount: 1 } });

        return await Book.findById(book._id).populate('category', 'name slug');
      } catch (error) {
        throw new Error(`Error creating book: ${error.message}`);
      }
    },

    updateBook: async (_, { id, input }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }

        if (input.categoryId && input.categoryId !== book.category.toString()) {
          const newCategory = await Category.findById(input.categoryId);
          if (!newCategory) {
            throw new Error('New category not found');
          }

          await Category.findByIdAndUpdate(book.category, { $inc: { bookCount: -1 } });
          await Category.findByIdAndUpdate(input.categoryId, { $inc: { bookCount: 1 } });

          input.category = input.categoryId;
        }

        delete input.categoryId;

        const updatedBook = await Book.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).populate('category', 'name slug');

        return updatedBook;
      } catch (error) {
        throw new Error(`Error updating book: ${error.message}`);
      }
    },

    deleteBook: async (_, { id }, { user }) => {
      try {
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        const book = await Book.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }

        await Category.findByIdAndUpdate(book.category, { $inc: { bookCount: -1 } });
        await Book.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Error deleting book: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;