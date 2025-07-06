const userResolvers = require('./userResolvers');
const bookResolvers = require('./bookResolvers');
const categoryResolvers = require('./categoryResolvers');
const reviewResolvers = require('./reviewResolvers');

// Merge all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...bookResolvers.Query,
    ...categoryResolvers.Query,
    ...reviewResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...reviewResolvers.Mutation
  },
  Subscription: {
    ...reviewResolvers.Subscription
  }
};

module.exports = resolvers;