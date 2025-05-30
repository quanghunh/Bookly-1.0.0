// models/Author.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  birthDate: Date,
});

module.exports = mongoose.model('Author', authorSchema);
