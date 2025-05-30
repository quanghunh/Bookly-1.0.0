// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  summary: String,
  isbn: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  publishedDate: Date,
  pages: Number,
});

module.exports = mongoose.model('Book', bookSchema);
