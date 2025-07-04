const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  bookSnapshot: {
    title: String,
    author: String,
    isbn: String,
    coverImage: {
      url: String,
      publicId: String
    }
  }
}, {
  timestamps: true
});

// Calculate total price before saving
orderDetailSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.models.OrderDetail || mongoose.model('OrderDetail', orderDetailSchema);