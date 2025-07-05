const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    phone: String
    address: Address
    avatar: UserImage
    dateOfBirth: String
    gender: String
    isActive: Boolean!
    isEmailVerified: Boolean!
    lastLogin: String
    fullAddress: String
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  type UserImage {
    url: String!
    publicId: String
  }

  type AuthPayload {
    token: String!
    user: User!
    expiresIn: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
    dateOfBirth: String
    gender: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    phone: String
    address: AddressInput
    dateOfBirth: String
    gender: String
  }

  input AddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
    confirmPassword: String!
  }

  input UserFilterInput {
    role: String
    isActive: Boolean
    isEmailVerified: Boolean
    gender: String
  }

  input AdminUpdateUserInput {
    name: String
    email: String
    role: String
    phone: String
    address: AddressInput
    isActive: Boolean
    isEmailVerified: Boolean
  }

  type UserConnection {
    users: [User!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  type UserStats {
    totalUsers: Int!
    activeUsers: Int!
    inactiveUsers: Int!
    verifiedUsers: Int!
    unverifiedUsers: Int!
    customers: Int!
    admins: Int!
    newUsersThisMonth: Int!
  }

  extend type Query {
    # Public queries
    me: User
    
    # Admin queries
    users(
      page: Int = 1
      limit: Int = 20
      filter: UserFilterInput
      search: String
      sortBy: String = "createdAt"
      sortOrder: String = "desc"
    ): UserConnection!
    
    user(id: ID!): User
    userStats: UserStats!
  }

  extend type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    
    # Profile management
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(input: ChangePasswordInput!): Boolean!
    uploadAvatar(file: Upload!): UserImage!
    deleteAvatar: Boolean!
    
    # Email verification
    sendVerificationEmail: Boolean!
    verifyEmail(token: String!): Boolean!
    
    # Password reset
    forgotPassword(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
    
    # Admin mutations
    createUser(input: RegisterInput!): User!
    updateUser(id: ID!, input: AdminUpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    toggleUserStatus(id: ID!): User!
    
    # Bulk operations
    bulkDeleteUsers(ids: [ID!]!): Boolean!
    bulkUpdateUsers(ids: [ID!]!, input: AdminUpdateUserInput!): [User!]!
  }
`;

module.exports = userTypeDefs;