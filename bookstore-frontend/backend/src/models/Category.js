const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  image: {
    url: String,
    publicId: String
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  bookCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String,
  keywords: [String]
}, {
  timestamps: true
});

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Static method to get category hierarchy
categorySchema.statics.getCategoryHierarchy = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('subCategories', 'name slug isActive')
    .lean();
    
  // Build hierarchy (parent categories with their children)
  const hierarchy = categories
    .filter(cat => !cat.parentCategory)
    .map(parent => ({
      ...parent,
      children: categories.filter(cat => 
        cat.parentCategory && cat.parentCategory.toString() === parent._id.toString()
      )
    }));
    
  return hierarchy;
};

// Static method to get active categories
categorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('name slug description image bookCount isFeatured');
};

// Static method to get featured categories
categorySchema.statics.getFeaturedCategories = function(limit = 6) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit)
    .select('name slug description image bookCount');
};

// Instance method to get full path (for breadcrumbs)
categorySchema.methods.getFullPath = async function() {
  const path = [this];
  let current = this;
  
  while (current.parentCategory) {
    current = await this.model('Category').findById(current.parentCategory);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }
  
  return path;
};

// Virtual for URL
categorySchema.virtual('url').get(function() {
  return `/categories/${this.slug}`;
});

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);