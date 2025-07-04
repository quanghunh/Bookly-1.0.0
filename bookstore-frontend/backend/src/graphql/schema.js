const typeDefs = require('./singleTypeDefs');
const resolvers = require('./simpleResolvers');

// Export typeDefs and resolvers separately for Apollo Server
module.exports = {
  typeDefs,
  resolvers
};