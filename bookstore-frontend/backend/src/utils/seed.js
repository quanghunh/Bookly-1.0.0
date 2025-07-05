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

    // Create Customer User
    const customerUser = new User({
      name: 'Customer Test',
      email: 'customer@bookstore.com',
      password: 'customer123',
      role: 'customer',
      phone: '0987654321',
      isActive: true,
      isEmailVerified: true
    });
    await customerUser.save();
    console.log('👤 Created customer user');

    // Create Categories
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

    // Create Books
    const books = [
      // Văn học
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        isbn: '9786045676394',
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử. Đây là một trong những cuốn sách bán chạy nhất mọi thời đại.',
        price: 89000,
        originalPrice: 120000,
        category: createdCategories[0]._id, // Văn học
        publisher: 'NXB Tổng hợp TP.HCM',
        publishedYear: 2020,
        pages: 320,
        language: 'english',
        format: 'paperback',
        stock: 50,
        sold: 25,
        rating: 4.8,
        reviewCount: 150,
        isActive: true,
        isFeatured: true,
        tags: ['best-seller', 'kỹ năng sống', 'giao tiếp'],
        viewCount: 500
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
        format: 'paperback',
        stock: 30,
        sold: 45,
        rating: 4.9,
        reviewCount: 200,
        isActive: true,
        isFeatured: true,
        tags: ['thiếu nhi', 'văn học việt nam', 'tuổi thơ'],
        viewCount: 650
      },
      
      // Khoa học - Kỹ thuật
      {
        title: 'JavaScript: The Definitive Guide',
        author: 'David Flanagan',
        isbn: '9781491952023',
        description: 'Hướng dẫn toàn diện về JavaScript từ cơ bản đến nâng cao. Cuốn sách kinh điển cho lập trình viên.',
        price: 450000,
        originalPrice: 550000,
        category: createdCategories[1]._id, // Khoa học - Kỹ thuật
        publisher: 'O\'Reilly Media',
        publishedYear: 2020,
        pages: 688,
        language: 'Tiếng Anh',
        format: 'paperback',
        stock: 15,
        sold: 8,
        rating: 4.7,
        reviewCount: 45,
        isActive: true,
        isFeatured: true,
        tags: ['lập trình', 'javascript', 'web development'],
        viewCount: 280
      },
      {
        title: 'Lập Trình React Native',
        author: 'Bonnie Eisenman',
        isbn: '9786041654321',
        description: 'Hướng dẫn xây dựng ứng dụng mobile đa nền tảng với React Native.',
        price: 320000,
        originalPrice: 380000,
        category: createdCategories[1]._id, // Khoa học - Kỹ thuật
        publisher: 'NXB Lao động',
        publishedYear: 2021,
        pages: 456,
        language: 'Tiếng Việt',
        format: 'paperback',
        stock: 20,
        sold: 12,
        rating: 4.5,
        reviewCount: 30,
        isActive: true,
        isFeatured: false,
        tags: ['lập trình', 'react native', 'mobile'],
        viewCount: 180
      },

      // Kinh tế - Quản lý
      {
        title: 'Nghệ Thuật Quản Lý',
        author: 'Peter Drucker',
        isbn: '9786045987654',
        description: 'Tác phẩm kinh điển về quản lý từ cha đẻ của khoa học quản lý hiện đại.',
        price: 250000,
        originalPrice: 300000,
        category: createdCategories[2]._id, // Kinh tế - Quản lý
        publisher: 'NXB Lao động',
        publishedYear: 2019,
        pages: 520,
        language: 'Tiếng Việt',
        format: 'hardcover',
        stock: 25,
        sold: 18,
        rating: 4.6,
        reviewCount: 80,
        isActive: true,
        isFeatured: true,
        tags: ['quản lý', 'leadership', 'kinh doanh'],
        viewCount: 320
      },
      {
        title: 'Từ Tốt Đến Vĩ Đại',
        author: 'Jim Collins',
        isbn: '9786045123789',
        description: 'Nghiên cứu về những công ty xuất sắc và bí quyết chuyển đổi từ tốt thành vĩ đại.',
        price: 180000,
        originalPrice: 220000,
        category: createdCategories[2]._id, // Kinh tế - Quản lý
        publisher: 'NXB Tổng hợp TP.HCM',
        publishedYear: 2020,
        pages: 380,
        language: 'Tiếng Việt',
        format: 'paperback',
        stock: 35,
        sold: 22,
        rating: 4.7,
        reviewCount: 95,
        isActive: true,
        isFeatured: true,
        tags: ['quản lý', 'doanh nghiệp', 'thành công'],
        viewCount: 420
      },

      // Thiếu nhi
      {
        title: 'Dế Mèn Phiêu Lưu Ký',
        author: 'Tô Hoài',
        isbn: '9786041987321',
        description: 'Tác phẩm văn học thiếu nhi kinh điển của Việt Nam.',
        price: 45000,
        originalPrice: 60000,
        category: createdCategories[3]._id, // Thiếu nhi
        publisher: 'NXB Kim Đồng',
        publishedYear: 2019,
        pages: 200,
        language: 'Tiếng Việt',
        format: 'paperback',
        stock: 40,
        sold: 35,
        rating: 4.8,
        reviewCount: 120,
        isActive: true,
        isFeatured: false,
        tags: ['thiếu nhi', 'cổ tích', 'việt nam'],
        viewCount: 380
      },

      // Tâm lý - Kỹ năng sống
      {
        title: 'Tư Duy Nhanh Và Chậm',
        author: 'Daniel Kahneman',
        isbn: '9786045234567',
        description: 'Khám phá hai hệ thống tư duy của con người và cách chúng ảnh hưởng đến quyết định.',
        price: 195000,
        originalPrice: 240000,
        category: createdCategories[4]._id, // Tâm lý - Kỹ năng sống
        publisher: 'NXB Tổng hợp TP.HCM',
        publishedYear: 2021,
        pages: 480,
        language: 'Tiếng Việt',
        format: 'paperback',
        stock: 22,
        sold: 15,
        rating: 4.9,
        reviewCount: 75,
        isActive: true,
        isFeatured: true,
        tags: ['tâm lý học', 'tư duy', 'khoa học'],
        viewCount: 290
      },

      // Lịch sử - Địa lý
      {
        title: 'Lịch Sử Việt Nam',
        author: 'Trần Trọng Kim',
        isbn: '9786041567890',
        description: 'Tác phẩm lịch sử Việt Nam của sử gia Trần Trọng Kim.',
        price: 120000,
        originalPrice: 150000,
        category: createdCategories[5]._id, // Lịch sử - Địa lý
        publisher: 'NXB Văn học',
        publishedYear: 2020,
        pages: 600,
        language: 'Tiếng Việt',
        format: 'hardcover',
        stock: 18,
        sold: 8,
        rating: 4.5,
        reviewCount: 40,
        isActive: true,
        isFeatured: false,
        tags: ['lịch sử', 'việt nam', 'văn hóa'],
        viewCount: 150
      }
    ];

    // Create Books one by one để tránh lỗi slug
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
    console.log(`👤 Customer: customer@bookstore.com / customer123`);
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