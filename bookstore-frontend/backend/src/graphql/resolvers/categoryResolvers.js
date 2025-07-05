const Category = require('../../models/Category');
const Book = require('../../models/Book');

const categoryResolvers = {
  Query: {
    // Customer queries
    categories: async (_, { filter = {} }) => {
      try {
        let query = {};
        
        if (filter.isActive !== undefined) query.isActive = filter.isActive;
        if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
        if (filter.parentCategoryId) query.parentCategory = filter.parentCategoryId;
        if (filter.hasParent !== undefined) {
          query.parentCategory = filter.hasParent ? { $exists: true, $ne: null } : { $exists: false };
        }
        
        return await Category.find(query)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .sort({ sortOrder: 1, name: 1 })
          .lean();
      } catch (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
      }
    },

    category: async (_, { id }) => {
      try {
        const category = await Category.findById(id)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
          
        if (!category) {
          throw new Error('Category not found');
        }
        
        return category;
      } catch (error) {
        throw new Error(`Error fetching category: ${error.message}`);
      }
    },

    categoryBySlug: async (_, { slug }) => {
      try {
        const category = await Category.findOne({ slug, isActive: true })
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
          
        if (!category) {
          throw new Error('Category not found');
        }
        
        return category;
      } catch (error) {
        throw new Error(`Error fetching category: ${error.message}`);
      }
    },

    activeCategories: async () => {
      try {
        return await Category.find({ isActive: true })
          .populate('parentCategory', 'name slug')
          .sort({ sortOrder: 1, name: 1 })
          .select('name slug description image bookCount isFeatured sortOrder')
          .lean();
      } catch (error) {
        throw new Error(`Error fetching active categories: ${error.message}`);
      }
    },

    featuredCategories: async (_, { limit = 6 }) => {
      try {
        return await Category.find({ isActive: true, isFeatured: true })
          .sort({ sortOrder: 1, name: 1 })
          .limit(limit)
          .select('name slug description image bookCount')
          .lean();
      } catch (error) {
        throw new Error(`Error fetching featured categories: ${error.message}`);
      }
    },

    categoryHierarchy: async () => {
      try {
        // Get all active categories
        const categories = await Category.find({ isActive: true })
          .sort({ sortOrder: 1, name: 1 })
          .lean();
        
        // Build hierarchy
        const parentCategories = categories.filter(cat => !cat.parentCategory);
        
        const hierarchy = parentCategories.map(parent => ({
          ...parent,
          children: categories.filter(cat => 
            cat.parentCategory && cat.parentCategory.toString() === parent._id.toString()
          )
        }));
        
        return hierarchy;
      } catch (error) {
        throw new Error(`Error fetching category hierarchy: ${error.message}`);
      }
    },

    // Admin queries
    allCategories: async (_, { page = 1, limit = 20, filter = {}, search }) => {
      try {
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Apply filters
        if (filter.isActive !== undefined) query.isActive = filter.isActive;
        if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
        if (filter.parentCategoryId) query.parentCategory = filter.parentCategoryId;
        if (filter.hasParent !== undefined) {
          query.parentCategory = filter.hasParent ? { $exists: true, $ne: null } : { $exists: false };
        }
        
        // Search functionality
        if (search) {
          query.$or = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { slug: new RegExp(search, 'i') }
          ];
        }
        
        const categories = await Category.find(query)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .sort({ sortOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
          
        const totalCount = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          categories,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages
        };
      } catch (error) {
        throw new Error(`Error fetching all categories: ${error.message}`);
      }
    },

    categoryStats: async () => {
      try {
        const totalCategories = await Category.countDocuments({});
        const activeCategories = await Category.countDocuments({ isActive: true });
        const inactiveCategories = totalCategories - activeCategories;
        const featuredCategories = await Category.countDocuments({ isFeatured: true });
        const parentCategories = await Category.countDocuments({ parentCategory: { $exists: false } });
        const subCategories = await Category.countDocuments({ parentCategory: { $exists: true, $ne: null } });
        
        return {
          totalCategories,
          activeCategories,
          inactiveCategories,
          featuredCategories,
          parentCategories,
          subCategories
        };
      } catch (error) {
        throw new Error(`Error fetching category stats: ${error.message}`);
      }
    }
  },

  Mutation: {
    // Admin mutations
    createCategory: async (_, { input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Validate parent category if provided
        if (input.parentCategoryId) {
          const parentCategory = await Category.findById(input.parentCategoryId);
          if (!parentCategory) {
            throw new Error('Parent category not found');
          }
          input.parentCategory = input.parentCategoryId;
        }
        
        delete input.parentCategoryId;
        
        // Create category
        const category = new Category(input);
        await category.save();
        
        // If this category has a parent, add it to parent's subCategories
        if (category.parentCategory) {
          await Category.findByIdAndUpdate(
            category.parentCategory,
            { $addToSet: { subCategories: category._id } }
          );
        }
        
        return await Category.findById(category._id)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
      } catch (error) {
        if (error.code === 11000) {
          if (error.keyPattern.name) {
            throw new Error('Category name already exists');
          }
          if (error.keyPattern.slug) {
            throw new Error('Category slug already exists');
          }
        }
        throw new Error(`Error creating category: ${error.message}`);
      }
    },

    updateCategory: async (_, { id, input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }
        
        // Handle parent category change
        if (input.parentCategoryId !== undefined) {
          // Remove from old parent if exists
          if (category.parentCategory) {
            await Category.findByIdAndUpdate(
              category.parentCategory,
              { $pull: { subCategories: category._id } }
            );
          }
          
          // Add to new parent if provided
          if (input.parentCategoryId) {
            const newParent = await Category.findById(input.parentCategoryId);
            if (!newParent) {
              throw new Error('New parent category not found');
            }
            
            // Prevent circular reference
            if (input.parentCategoryId === id) {
              throw new Error('Category cannot be its own parent');
            }
            
            await Category.findByIdAndUpdate(
              input.parentCategoryId,
              { $addToSet: { subCategories: category._id } }
            );
            
            input.parentCategory = input.parentCategoryId;
          } else {
            input.parentCategory = null;
          }
        }
        
        delete input.parentCategoryId;
        
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .populate('parentCategory', 'name slug')
        .populate('subCategories', 'name slug isActive')
        .lean();
        
        return updatedCategory;
      } catch (error) {
        if (error.code === 11000) {
          if (error.keyPattern.name) {
            throw new Error('Category name already exists');
          }
          if (error.keyPattern.slug) {
            throw new Error('Category slug already exists');
          }
        }
        throw new Error(`Error updating category: ${error.message}`);
      }
    },

    deleteCategory: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }
        
        // Check if category has books
        const bookCount = await Book.countDocuments({ category: id });
        if (bookCount > 0) {
          throw new Error(`Cannot delete category. It has ${bookCount} books associated with it.`);
        }
        
        // Check if category has subcategories
        if (category.subCategories && category.subCategories.length > 0) {
          throw new Error('Cannot delete category. It has subcategories. Please delete or move subcategories first.');
        }
        
        // Remove from parent's subCategories if exists
        if (category.parentCategory) {
          await Category.findByIdAndUpdate(
            category.parentCategory,
            { $pull: { subCategories: category._id } }
          );
        }
        
        await Category.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Error deleting category: ${error.message}`);
      }
    },

    toggleCategoryStatus: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }
        
        category.isActive = !category.isActive;
        await category.save();
        
        return await Category.findById(id)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
      } catch (error) {
        throw new Error(`Error toggling category status: ${error.message}`);
      }
    },

    toggleCategoryFeatured: async (_, { id }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }
        
        category.isFeatured = !category.isFeatured;
        await category.save();
        
        return await Category.findById(id)
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
      } catch (error) {
        throw new Error(`Error toggling featured status: ${error.message}`);
      }
    },

    bulkUpdateCategories: async (_, { ids, input }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        await Category.updateMany(
          { _id: { $in: ids } },
          { ...input, updatedAt: new Date() }
        );
        
        return await Category.find({ _id: { $in: ids } })
          .populate('parentCategory', 'name slug')
          .populate('subCategories', 'name slug isActive')
          .lean();
      } catch (error) {
        throw new Error(`Error bulk updating categories: ${error.message}`);
      }
    },

    bulkDeleteCategories: async (_, { ids }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Check if any category has books
        const bookCount = await Book.countDocuments({ category: { $in: ids } });
        if (bookCount > 0) {
          throw new Error(`Cannot delete categories. They have books associated with them.`);
        }
        
        // Check if any category has subcategories
        const categoriesWithSubs = await Category.find({
          _id: { $in: ids },
          subCategories: { $exists: true, $not: { $size: 0 } }
        });
        
        if (categoriesWithSubs.length > 0) {
          throw new Error('Cannot delete categories that have subcategories.');
        }
        
        await Category.deleteMany({ _id: { $in: ids } });
        return true;
      } catch (error) {
        throw new Error(`Error bulk deleting categories: ${error.message}`);
      }
    },

    reorderCategories: async (_, { categoryOrders }, { user }) => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Update sort order for each category
        const updatePromises = categoryOrders.map(({ id, sortOrder }) =>
          Category.findByIdAndUpdate(id, { sortOrder }, { new: true })
        );
        
        const updatedCategories = await Promise.all(updatePromises);
        
        return updatedCategories.filter(Boolean); // Remove any null results
      } catch (error) {
        throw new Error(`Error reordering categories: ${error.message}`);
      }
    }
  }
};

module.exports = categoryResolvers;