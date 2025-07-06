// backend/src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2; // THÊM DÒNG NÀY
require('dotenv').config();

// Import database connection
const connectDB = require('./utils/db');

// Import GraphQL resolvers và typeDefs tổng hợp (quan trọng)
// Đảm bảo bạn đã thay đổi các file index.js như các bước trước
const resolvers = require('./graphql/resolvers'); // ĐÃ THAY THẾ simpleResolvers
const typeDefs = require('./graphql/typeDefs');   // THÊM DÒNG NÀY
const { createContext } = require('./middleware/auth');

// Apollo Server setup
const { ApolloServer } = require('@apollo/server'); // THÊM DÒNG NÀY
const { expressMiddleware } = require('@apollo/server/express4'); // THÊM DÒNG NÀY
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer'); // THÊM DÒNG NÀY
const http = require('http'); // THÊM DÒNG NÀY

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Cấu hình Cloudinary (THÊM PHẦN NÀY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Tăng giới hạn payload nếu có nhiều ảnh
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Tăng giới hạn payload

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

// Xóa bỏ endpoint /test nếu không cần dùng nữa
// app.get('/test', (req, res) => {
//   res.json({ message: 'Express server is working!' });
// });

// Setup Apollo Server (THAY THẾ TOÀN BỘ PHẦN XỬ LÝ GRAPHQL THỦ CÔNG)
async function startApolloServer() {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs, // Sử dụng typeDefs tổng hợp
    resolvers, // Sử dụng resolvers tổng hợp
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, error) => {
      console.error('GraphQL Error:', formattedError.message);
      // Trả về lỗi được đơn giản hóa trong môi trường production
      return process.env.NODE_ENV === 'production' 
        ? new Error('Internal server error') 
        : formattedError;
    },
  });

  await server.start(); // Khởi động Apollo Server

  app.use(
    '/graphql', // Endpoint GraphQL chính thức
    expressMiddleware(server, {
      context: createContext, // Sử dụng createContext từ middleware/auth
    }),
  );

  const PORT = process.env.PORT || 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
}

startApolloServer(); // GỌI HÀM KHỞI ĐỘNG APOLLO SERVER

// Error handling middleware (giữ nguyên, đã điều chỉnh nhỏ trong formatError ở trên)
app.use((error, req, res, next) => {
  console.error('Express Error:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// 404 handler (giữ nguyên)
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

// Xóa bỏ phần `startServer()` cũ và `app.get('/')` cũ nếu có
// startServer(); 
// app.get('/', ...)