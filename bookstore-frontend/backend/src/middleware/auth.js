const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Extract user from JWT token
const getUser = async (req) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null; // No token provided
    }

    // Check if token starts with 'Bearer '
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password').lean();
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified
    };

  } catch (error) {
    console.error('Authentication error:', error.message);
    return null; // Return null for invalid tokens instead of throwing
  }
};

// Middleware to require authentication
const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required. Please log in.');
  }
  return user;
};

// Middleware to require admin role
const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }
  return user;
};

// Middleware to require customer role (or admin)
const requireCustomer = (user) => {
  requireAuth(user);
  if (user.role !== 'customer' && user.role !== 'admin') {
    throw new Error('Access denied. Customer privileges required.');
  }
  return user;
};

// Check if user owns resource or is admin
const requireOwnershipOrAdmin = (user, resourceUserId) => {
  requireAuth(user);
  if (user.role !== 'admin' && user.id !== resourceUserId.toString()) {
    throw new Error('Access denied. You can only access your own resources.');
  }
  return user;
};

// GraphQL context function to add user to context
const createContext = async ({ req }) => {
  try {
    // Extract user from request
    const user = await getUser(req);
    
    // Add user to context
    return {
      user,
      // Helper functions for checking permissions
      requireAuth: () => requireAuth(user),
      requireAdmin: () => requireAdmin(user),
      requireCustomer: () => requireCustomer(user),
      requireOwnershipOrAdmin: (resourceUserId) => requireOwnershipOrAdmin(user, resourceUserId),
      
      // Request object for additional context
      req
    };
  } catch (error) {
    console.error('Context creation error:', error.message);
    return {
      user: null,
      req
    };
  }
};

// Express middleware for REST endpoints (if needed)
const expressAuth = async (req, res, next) => {
  try {
    const user = await getUser(req);
    req.user = user;
    next();
  } catch (error) {
    console.error('Express auth error:', error.message);
    req.user = null;
    next();
  }
};

// Express middleware to require authentication
const expressRequireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid authentication token'
    });
  }
  next();
};

// Express middleware to require admin role
const expressRequireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid authentication token'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
  
  next();
};

// Utility function to generate JWT token
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn }
  );
};

// Utility function to verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  getUser,
  requireAuth,
  requireAdmin,
  requireCustomer,
  requireOwnershipOrAdmin,
  createContext,
  expressAuth,
  expressRequireAuth,
  expressRequireAdmin,
  generateToken,
  verifyToken
};