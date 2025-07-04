const userResolvers = require('./userResolvers');
const bookResolvers = require('./bookResolvers');
const categoryResolvers = require('./categoryResolvers');

// Merge all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...bookResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...categoryResolvers.Mutation
  }
};

module.exports = resolvers;