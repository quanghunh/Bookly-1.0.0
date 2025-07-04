const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./utils/db');

// Import GraphQL schema and context
const { typeDefs, resolvers } = require('./graphql/schema');
const { createContext } = require('./middleware/auth');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Bookstore API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bookstore API',
    version: '1.0.0',
    graphql: '/graphql',
    healthCheck: '/health',
    documentation: '/graphql (GraphQL Playground in development)'
  });
});

// Create Apollo Server
const createServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
    
    // Enable GraphQL Playground in development
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production' ? {
      settings: {
        'request.credentials': 'include',
      }
    } : false,
    
    // Error formatting
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production') {
        // Log the full error for debugging
        console.error('Full error:', error);
        
        // Return sanitized error to client
        if (error.message.includes('Access denied') || 
            error.message.includes('Authentication required') ||
            error.message.includes('not found')) {
          return new Error(error.message);
        }
        
        return new Error('Internal server error');
      }
      
      return error;
    },
    
    // Plugin for logging
    plugins: [
      {
        requestDidStart() {
          return {
            didResolveOperation(requestContext) {
              console.log(`GraphQL Operation: ${requestContext.request.operationName}`);
            },
            didEncounterErrors(requestContext) {
              console.error('GraphQL Errors:', requestContext.errors);
            }
          };
        }
      }
    ]
  });

  await server.start();
  
  // Apply middleware to Express app
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We're handling CORS above
  });

  return server;
};

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express Error:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      graphql: '/graphql',
      health: '/health',
      root: '/'
    }
  });
});

// Start server
const startServer = async () => {
  try {
    const server = await createServer();
    
    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
      }
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();