const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Please enter a valid ISBN (10 or 13 digits)']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  language: {
    type: String,
    default: 'Vietnamese',
    trim: true
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
    default: 'paperback'
  },
  dimensions: {
    length: Number, // cm
    width: Number,  // cm
    height: Number  // cm
  },
  weight: Number, // grams
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  coverImage: {
    url: String,
    publicId: String,
    alt: String
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold quantity cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for search and performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, isActive: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: -1 });
bookSchema.index({ sold: -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ isFeatured: 1, isActive: 1 });
bookSchema.index({ slug: 1 });
bookSchema.index({ tags: 1 });

// Pre-save middleware to generate slug
bookSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now();
  }
  next();
});

// Pre-save middleware to set cover image
bookSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0 && !this.coverImage) {
    const mainImage = this.images.find(img => img.isMain) || this.images[0];
    this.coverImage = {
      url: mainImage.url,
      publicId: mainImage.publicId,
      alt: mainImage.alt || this.title
    };
  }
  next();
});

// Virtual for discount percentage
bookSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
bookSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for sale status
bookSchema.virtual('onSale').get(function() {
  if (!this.isOnSale || !this.saleStartDate || !this.saleEndDate) {
    return false;
  }
  const now = new Date();
  return now >= this.saleStartDate && now <= this.saleEndDate;
});

// Virtual for URL
bookSchema.virtual('url').get(function() {
  return `/books/${this.slug}`;
});

// Static method to get books by category
bookSchema.statics.getByCategory = function(categoryId, options = {}) {
  const {
    page = 1,
    limit = 12,
    sort = { createdAt: -1 },
    isActive = true
  } = options;
  
  const skip = (page - 1) * limit;
  
  return this.find({ category: categoryId, isActive })
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to search books
bookSchema.statics.searchBooks = function(query, options = {}) {
  const {
    page = 1,
    limit = 12,
    sort = { score: { $meta: 'textScore' } },
    filters = {}
  } = options;
  
  const skip = (page - 1) * limit;
  
  let searchQuery = {
    $text: { $search: query },
    isActive: true,
    ...filters
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to get featured books
bookSchema.statics.getFeaturedBooks = function(limit = 8) {
  return this.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to update stock
bookSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
    this.sold += quantity;
  } else if (operation === 'add') {
    this.stock += quantity;
  }
  return this.save();
};

// Instance method to update rating
bookSchema.methods.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRating = this.rating * this.reviewCount + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  }
  return this.save();
};

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);