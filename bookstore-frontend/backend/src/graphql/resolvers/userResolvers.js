const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const userResolvers = {
  Query: {
    // Get current user profile
    me: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }
        
        return await User.findById(user.id).lean();
      } catch (error) {
        throw new Error(`Error fetching user profile: ${error.message}`);
      }
    },

    // Admin queries
    users: async (_, { page = 1, limit = 20, filter = {}, search, sortBy = 'createdAt', sortOrder = 'desc' }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Apply filters
        if (filter.role) query.role = filter.role;
        if (filter.isActive !== undefined) query.isActive = filter.isActive;
        if (filter.isEmailVerified !== undefined) query.isEmailVerified = filter.isEmailVerified;
        if (filter.gender) query.gender = filter.gender;
        
        // Search functionality
        if (search) {
          query.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { phone: new RegExp(search, 'i') }
          ];
        }
        
        // Build sort
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortBy]: sortDirection };
        
        const users = await User.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await User.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          users,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }
    },

    user: async (_, { id }, { user }) => {
      try {
        // Check if user is admin or requesting own profile
        if (!user || (user.role !== 'admin' && user.id !== id)) {
          throw new Error('Access denied');
        }
        
        const targetUser = await User.findById(id).lean();
        if (!targetUser) {
          throw new Error('User not found');
        }
        
        return targetUser;
      } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }
    },

    userStats: async (_, __, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isActive: true });
        const inactiveUsers = totalUsers - activeUsers;
        const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
        const unverifiedUsers = totalUsers - verifiedUsers;
        const customers = await User.countDocuments({ role: 'customer' });
        const admins = await User.countDocuments({ role: 'admin' });
        
        // New users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newUsersThisMonth = await User.countDocuments({
          createdAt: { $gte: startOfMonth }
        });
        
        return {
          totalUsers,
          activeUsers,
          inactiveUsers,
          verifiedUsers,
          unverifiedUsers,
          customers,
          admins,
          newUsersThisMonth
        };
      } catch (error) {
        throw new Error(`Error fetching user stats: ${error.message}`);
      }
    }
  },

  Mutation: {
    // Authentication
    register: async (_, { input }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        // Create new user
        const user = new User(input);
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        // Remove password from response
        const userResponse = await User.findById(user._id).lean();
        
        return {
          token,
          user: userResponse,
          expiresIn: '7 days'
        };
      } catch (error) {
        if (error.code === 11000) {
          throw new Error('User with this email already exists');
        }
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    login: async (_, { input }) => {
      try {
        const { email, password } = input;
        
        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Check if user is active
        if (!user.isActive) {
          throw new Error('Account is deactivated. Please contact support.');
        }
        
        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        // Remove password from response
        const userResponse = await User.findById(user._id).lean();
        
        return {
          token,
          user: userResponse,
          expiresIn: '7 days'
        };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    logout: async () => {
      // Since we're using stateless JWT, logout is handled client-side
      // In a production app, you might want to maintain a blacklist of tokens
      return true;
    },

    // Profile management
    updateProfile: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }
        
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).lean();
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (error) {
        throw new Error(`Error updating profile: ${error.message}`);
      }
    },

    changePassword: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Authentication required');
        }
        
        const { currentPassword, newPassword, confirmPassword } = input;
        
        if (newPassword !== confirmPassword) {
          throw new Error('New password and confirm password do not match');
        }
        
        // Get user with current password
        const userWithPassword = await User.findById(user.id).select('+password');
        if (!userWithPassword) {
          throw new Error('User not found');
        }
        
        // Verify current password
        const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
          throw new Error('Current password is incorrect');
        }
        
        // Update password
        userWithPassword.password = newPassword;
        await userWithPassword.save();
        
        return true;
      } catch (error) {
        throw new Error(`Error changing password: ${error.message}`);
      }
    },

    // Admin mutations
    createUser: async (_, { input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        const newUser = new User(input);
        await newUser.save();
        
        return await User.findById(newUser._id).lean();
      } catch (error) {
        if (error.code === 11000) {
          throw new Error('User with this email already exists');
        }
        throw new Error(`Error creating user: ${error.message}`);
      }
    },

    updateUser: async (_, { id, input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Don't allow changing email to existing email
        if (input.email) {
          const existingUser = await User.findOne({ 
            email: input.email, 
            _id: { $ne: id } 
          });
          if (existingUser) {
            throw new Error('Email already exists');
          }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).lean();
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
      }
    },

    deleteUser: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Don't allow admin to delete themselves
        if (user.id === id) {
          throw new Error('Cannot delete your own account');
        }
        
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new Error('User not found');
        }
        
        return true;
      } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },

    toggleUserStatus: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Don't allow admin to deactivate themselves
        if (user.id === id) {
          throw new Error('Cannot change your own account status');
        }
        
        const targetUser = await User.findById(id);
        if (!targetUser) {
          throw new Error('User not found');
        }
        
        targetUser.isActive = !targetUser.isActive;
        await targetUser.save();
        
        return await User.findById(id).lean();
      } catch (error) {
        throw new Error(`Error toggling user status: ${error.message}`);
      }
    },

    bulkDeleteUsers: async (_, { ids }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Don't allow admin to delete themselves
        if (ids.includes(user.id)) {
          throw new Error('Cannot delete your own account');
        }
        
        await User.deleteMany({ _id: { $in: ids } });
        return true;
      } catch (error) {
        throw new Error(`Error bulk deleting users: ${error.message}`);
      }
    },

    bulkUpdateUsers: async (_, { ids, input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        await User.updateMany(
          { _id: { $in: ids } },
          { ...input, updatedAt: new Date() }
        );
        
        return await User.find({ _id: { $in: ids } }).lean();
      } catch (error) {
        throw new Error(`Error bulk updating users: ${error.message}`);
      }
    }
  }
};

module.exports = userResolvers;