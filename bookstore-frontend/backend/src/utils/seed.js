// backend/src/utils/seed.js - Updated với nhiều customer hơn
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting to seed database...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'admin',
      phone: '0123456789',
      isActive: true,
      isEmailVerified: true
    });
    await adminUser.save();
    console.log('👑 Created admin user');

    // Create Customer Users
    const customerUsers = [
      {
        name: 'Customer Demo',
        email: 'customer@bookstore.com',
        password: 'customer123',
        role: 'customer',
        phone: '0987654321',
        isActive: true,
        isEmailVerified: true
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'customer',
        phone: '0912345678',
        isActive: true,
        isEmailVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '123456',
        role: 'customer',
        phone: '0923456789',
        isActive: true,
        isEmailVerified: false
      },
      {
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        password: '123456',
        role: 'customer',
        phone: '0934567890',
        gender: 'male',
        isActive: true,
        isEmailVerified: true
      },
      {
        name: 'Trần Thị Bình',
        email: 'tranthibinh@gmail.com',
        password: '123456',
        role: 'customer',
        phone: '0945678901',
        gender: 'female',
        isActive: true,
        isEmailVerified: true
      }
    ];

    for (const userData of customerUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`👤 Created customer: ${user.name} (${user.email})`);
    }

    // Create Categories (giữ nguyên như cũ)
    const categories = [
      {
        name: 'Văn học',
        description: 'Sách văn học trong nước và ngoại văn',
        slug: 'van-hoc',
        isActive: true,
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Khoa học - Kỹ thuật',
        description: 'Sách khoa học, công nghệ, kỹ thuật',
        slug: 'khoa-hoc-ky-thuat',
        isActive: true,
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Kinh tế - Quản lý',
        description: 'Sách về kinh tế, quản lý, kinh doanh',
        slug: 'kinh-te-quan-ly',
        isActive: true,
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Thiếu nhi',
        description: 'Sách dành cho trẻ em và thiếu niên',
        slug: 'thieu-nhi',
        isActive: true,
        isFeatured: false,
        sortOrder: 4
      },
      {
        name: 'Tâm lý - Kỹ năng sống',
        description: 'Sách về tâm lý học và phát triển bản thân',
        slug: 'tam-ly-ky-nang-song',
        isActive: true,
        isFeatured: true,
        sortOrder: 5
      },
      {
        name: 'Lịch sử - Địa lý',
        description: 'Sách về lịch sử và địa lý',
        slug: 'lich-su-dia-ly',
        isActive: true,
        isFeatured: false,
        sortOrder: 6
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`📚 Created ${createdCategories.length} categories`);

    // Create Books (giữ nguyên như cũ nhưng thêm coverImage và images)
    const books = [
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        isbn: '9786045676394',
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử. Đây là một trong những cuốn sách bán chạy nhất mọi thời đại.',
        price: 89000,
        originalPrice: 120000,
        category: createdCategories[4]._id, // Tâm lý - Kỹ năng sống
        publisher: 'NXB Tổng hợp TP.HCM',
        publishedYear: 2020,
        pages: 320,
        language: 'Vietnamese',
        stock: 50,
        sold: 25,
        rating: 4.8,
        reviewCount: 150,
        isActive: true,
        isFeatured: true,
        tags: ['best-seller', 'kỹ năng sống', 'giao tiếp'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=center',
          alt: 'Đắc Nhân Tâm cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=center',
            alt: 'Đắc Nhân Tâm cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        isbn: '9786041123456',
        description: 'Tác phẩm văn học thiếu nhi nổi tiếng của tác giả Nguyễn Nhật Ánh, kể về tuổi thơ miền quê đầy thơ mộng.',
        price: 65000,
        originalPrice: 85000,
        category: createdCategories[0]._id, // Văn học
        publisher: 'NXB Trẻ',
        publishedYear: 2018,
        pages: 280,
        language: 'Vietnamese',
        stock: 30,
        sold: 45,
        rating: 4.9,
        reviewCount: 200,
        isActive: true,
        isFeatured: true,
        tags: ['thiếu nhi', 'văn học việt nam', 'tuổi thơ'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=250&fit=crop&crop=center',
          alt: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=250&fit=crop&crop=center',
            alt: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh cover',
            isMain: true
          }
        ]
      }
      // ... thêm các sách khác tương tự
    ];

    // Create Books one by one
    const createdBooks = [];
    for (let i = 0; i < books.length; i++) {
      try {
        const book = new Book(books[i]);
        await book.save();
        createdBooks.push(book);
        console.log(`📖 Created book: ${book.title}`);
      } catch (error) {
        console.error(`❌ Error creating book ${books[i].title}:`, error.message);
      }
    }
    console.log(`📖 Created ${createdBooks.length} books`);

    // Update category book counts
    for (const category of createdCategories) {
      const bookCount = await Book.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { bookCount });
    }
    console.log('🔄 Updated category book counts');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👑 Admin: admin@bookstore.com / admin123`);
    console.log(`👤 Customers:`);
    customerUsers.forEach(user => {
      console.log(`   - ${user.email} / ${user.password}`);
    });
    console.log(`📚 Categories: ${createdCategories.length}`);
    console.log(`📖 Books: ${createdBooks.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seed
const runSeed = async () => {
  await connectDB();
  await seedData();
};

// Check if this file is being run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData, runSeed };