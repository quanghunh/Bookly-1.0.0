import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors
      if (message.includes('Authentication required') || message.includes('Access denied')) {
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    });
  }
  
  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Handle network errors (like 404, 500, etc.)
    if (networkError.statusCode === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
  }
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          books: {
            // Enable pagination
            keyArgs: ["filter", "search"],
            merge(existing = { books: [], totalCount: 0 }, incoming) {
              return {
                ...incoming,
                books: [...existing.books, ...incoming.books]
              };
            }
          },
          categories: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;