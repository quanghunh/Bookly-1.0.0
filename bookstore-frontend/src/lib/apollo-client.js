import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP link to GraphQL endpoint - hardcode để tránh lỗi process.env
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Hardcode tạm thời
  credentials: 'same-origin', // Thay đổi từ 'include' sang 'same-origin'
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken') || localStorage.getItem('customerToken');
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
        { operation: operation.operationName }
      );
      
      // Handle authentication errors
      if (message.includes('Authentication required') || 
          message.includes('Access denied') || 
          message.includes('Unauthorized') ||
          message.includes('Not authenticated')) {
        // Clear all auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('customerToken');
        localStorage.removeItem('user');
        localStorage.removeItem('customerUser');
        localStorage.removeItem('isCustomerLoggedIn');
        
        // Redirect to customer login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    });
  }
  
  if (networkError) {
    console.error(`Network error:`, {
      name: networkError.name,
      message: networkError.message,
      statusCode: networkError.statusCode,
      operation: operation.operationName
    });
    
    // Handle network errors
    if (networkError.statusCode === 401 || networkError.statusCode === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('customerToken');
      localStorage.removeItem('user');
      localStorage.removeItem('customerUser');
      localStorage.removeItem('isCustomerLoggedIn');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }
});

// Create Apollo Client với configuration đơn giản hơn
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    // Simplify cache config
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
  // Add this to help with debugging
  connectToDevTools: true,
});

export default client;