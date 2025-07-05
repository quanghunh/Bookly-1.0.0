const express = require('express');
const { graphql, buildSchema } = require('graphql');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./utils/db');

// Import GraphQL resolvers
const resolvers = require('./graphql/simpleResolvers');
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

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Express server is working!' });
});

// Manual GraphQL endpoint that works!
app.post('/graphql', async (req, res) => {
  try {
    const { query, variables = {} } = req.body;
    const context = await createContext({ req });
    
    // Execute GraphQL query manually
    const result = await executeGraphQLQuery(query, variables, context);
    
    res.json(result);
  } catch (error) {
    console.error('GraphQL Error:', error);
    res.status(500).json({
      errors: [{ message: error.message }]
    });
  }
});

// GraphQL endpoint for GET requests (GraphiQL-like interface)
app.get('/graphql', (req, res) => {
  const graphiqlHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>GraphQL Interface</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .query-section { display: flex; gap: 20px; height: 500px; }
            .query-input, .result-output { flex: 1; }
            textarea { width: 100%; height: 300px; font-family: monospace; border: 1px solid #ddd; border-radius: 4px; padding: 10px; }
            button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px 5px 10px 0; }
            button:hover { background: #0056b3; }
            .sample-btn { background: #28a745; }
            .sample-btn:hover { background: #1e7e34; }
            pre { background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 15px; overflow-x: auto; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Bookstore GraphQL API</h1>
            <p><strong>Endpoint:</strong> POST /graphql</p>
            
            <div class="query-section">
                <div class="query-input">
                    <h3>Query</h3>
                    <textarea id="query" placeholder="Enter GraphQL query...">query {
  hello
}</textarea>
                    <div>
                        <button onclick="executeQuery()">Execute Query</button>
                        <button class="sample-btn" onclick="loadSample('hello')">Hello</button>
                        <button class="sample-btn" onclick="loadSample('categories')">Categories</button>
                        <button class="sample-btn" onclick="loadSample('books')">Books</button>
                        <button class="sample-btn" onclick="loadSample('login')">Login</button>
                    </div>
                </div>
                
                <div class="result-output">
                    <h3>Result</h3>
                    <pre id="result">Click "Execute Query" to see results...</pre>
                </div>
            </div>
            
            <h3>Sample Queries</h3>
            <ul>
                <li><strong>Hello:</strong> <code>{ hello }</code></li>
                <li><strong>Categories:</strong> <code>{ categories { id name slug bookCount } }</code></li>
                <li><strong>Books:</strong> <code>{ books { books { id title author } totalCount } }</code></li>
                <li><strong>Login:</strong> <code>mutation { login(input: {email: "admin@bookstore.com", password: "admin123"}) { token user { name role } } }</code></li>
            </ul>
        </div>

        <script>
            const samples = {
                hello: 'query {\\n  hello\\n}',
                categories: 'query {\\n  categories {\\n    id\\n    name\\n    slug\\n    bookCount\\n    isFeatured\\n  }\\n}',
                books: 'query {\\n  books {\\n    books {\\n      id\\n      title\\n      author\\n      price\\n      category {\\n        name\\n      }\\n    }\\n    totalCount\\n  }\\n}',
                login: 'mutation {\\n  login(input: {\\n    email: "admin@bookstore.com"\\n    password: "admin123"\\n  }) {\\n    token\\n    user {\\n      id\\n      name\\n      email\\n      role\\n    }\\n  }\\n}'
            };
            
            function loadSample(type) {
                document.getElementById('query').value = samples[type];
            }
            
            async function executeQuery() {
                const query = document.getElementById('query').value;
                const resultEl = document.getElementById('result');
                
                if (!query.trim()) {
                    resultEl.textContent = 'Please enter a query!';
                    return;
                }
                
                resultEl.textContent = 'Executing...';
                
                try {
                    const response = await fetch('/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query })
                    });
                    
                    const data = await response.json();
                    resultEl.textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    resultEl.textContent = 'Error: ' + error.message;
                }
            }
        </script>
    </body>
    </html>
  `;
  
  res.send(graphiqlHTML);
});

// Manual GraphQL query executor
async function executeGraphQLQuery(query, variables, context) {
  try {
    // Simple query parser and executor
    if (query.includes('hello')) {
      return { data: await resolvers.Query.hello() };
    }
    
    if (query.includes('categories')) {
      const categories = await resolvers.Query.categories();
      return { data: { categories } };
    }
    
    if (query.includes('books')) {
      const booksResult = await resolvers.Query.books(null, { page: 1, limit: 12 });
      return { data: { books: booksResult } };
    }
    
    if (query.includes('login')) {
      // Extract email and password from mutation
      const emailMatch = query.match(/email:\s*"([^"]+)"/);
      const passwordMatch = query.match(/password:\s*"([^"]+)"/);
      
      if (emailMatch && passwordMatch) {
        const loginResult = await resolvers.Mutation.login(null, {
          input: { email: emailMatch[1], password: passwordMatch[1] }
        });
        return { data: { login: loginResult } };
      }
    }
    
    return { 
      errors: [{ message: 'Query not supported in manual executor' }],
      data: null 
    };
    
  } catch (error) {
    return { 
      errors: [{ message: error.message }],
      data: null 
    };
  }
}

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bookstore API',
    version: '1.0.0',
    graphql: '/graphql',
    healthCheck: '/health',
    test: '/test',
    documentation: 'GET /graphql for GraphQL interface'
  });
});

// Start server
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
      console.log(`🎮 GraphQL interface: http://localhost:${PORT}/graphql`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
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

// Start the server
startServer();