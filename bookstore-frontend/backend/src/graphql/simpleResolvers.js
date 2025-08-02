// backend/src/graphql/simpleResolvers.js - Complete Updated Version
const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    
    // Category queries - UPDATED to support featured parameter
    categories: async (_, { featured }) => {
      try {
        let query = { isActive: true };
        
        // Add featured filter if specified
        if (featured !== undefined) {
          query.isFeatured = featured;
        }
        
        return await Category.find(query).sort({ sortOrder: 1, name: 1 });
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

    // Book queries - UPDATED to support featured, orderBy, orderDirection
    books: async (_, { page = 1, limit = 12, search, featured, orderBy = 'createdAt', orderDirection = 'DESC' }) => {
      try {
        const skip = (page - 1) * limit;
        
        // Build query - chỉ lấy sách active
        let query = { isActive: true };
        
        // Add featured filter if specified
        if (featured !== undefined) {
          query.isFeatured = featured;
        }
        
        // Search functionality
        if (search) {
          query.$or = [
            { title: new RegExp(search, 'i') },
            { author: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
          ];
        }
        
        // Build sort object
        const sortDirection = orderDirection === 'ASC' ? 1 : -1;
        let sort = {};
        
        switch (orderBy) {
          case 'sold':
            sort = { sold: sortDirection };
            break;
          case 'price':
            sort = { price: sortDirection };
            break;
          case 'rating':
            sort = { rating: sortDirection };
            break;
          case 'title':
            sort = { title: sortDirection };
            break;
          case 'author':
            sort = { author: sortDirection };
            break;
          case 'createdAt':
          default:
            sort = { createdAt: sortDirection };
            break;
        }
        
        const books = await Book.find(query)
          .populate('category', 'id name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit);
          
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
        return await Book.findById(id).populate('category', 'id name slug');
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    bookBySlug: async (_, { slug }) => {
      try {
        return await Book.findOne({ slug, isActive: true }).populate('category', 'id name slug');
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },

    featuredBooks: async (_, { limit = 8 }) => {
      try {
        return await Book.find({ isFeatured: true, isActive: true })
          .populate('category', 'id name slug')
          .sort({ createdAt: -1 })
          .limit(limit);
      } catch (error) {
        throw new Error(`Error fetching featured books: ${error.message}`);
      }
    },

    // User queries (cần auth cho admin)
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      return await User.findById(user.id);
    }
  },

  Mutation: {
    test: () => 'Test mutation working!',

    // Customer Authentication (không cần token)
    customerLogin: async (_, { input }) => {
      try {
        const { email, password } = input;

        // Find user và include password
        const user = await User.findOne({ 
          email: email.toLowerCase(),
          role: 'customer' // Chỉ cho phép customer login
        }).select('+password');
        
        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return user info (không cần token)
        const userResponse = await User.findById(user._id);

        return {
          success: true,
          message: 'Login successful',
          user: userResponse
        };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    // Customer Registration (không cần token)
    customerRegister: async (_, { input }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Create new customer
        const userData = {
          ...input,
          role: 'customer', // Force role to customer
          isActive: true,
          isEmailVerified: false
        };

        const user = new User(userData);
        await user.save();

        // Return user info (không cần token)
        const userResponse = await User.findById(user._id);

        return {
          success: true,
          message: 'Registration successful',
          user: userResponse
        };
      } catch (error) {
        if (error.code === 11000) {
          throw new Error('User with this email already exists');
        }
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    // Admin Authentication (giữ nguyên, cần token)
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

    // Category mutations (Admin only)
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

    // Book mutations (Admin only)
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

        return await Book.findById(book._id).populate('category', 'id name slug');
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
        ).populate('category', 'id name slug');

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