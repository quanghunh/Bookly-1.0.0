// models/Publisher.js
const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: String,
  address: String,
  website: String,
});

module.exports = mongoose.model('Publisher', publisherSchema);
