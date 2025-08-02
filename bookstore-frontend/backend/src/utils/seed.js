// backend/src/utils/seed.js - Updated với 10 cuốn sách
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

    // Create 10 Books
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
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center',
          alt: 'Đắc Nhân Tâm cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center',
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
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center',
          alt: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center',
            alt: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        isbn: '9786045678901',
        description: 'Cuốn sách khám phá lịch sử tiến hóa của loài người từ thời kỳ đồ đá đến thời đại hiện đại.',
        price: 195000,
        originalPrice: 250000,
        category: createdCategories[5]._id, // Lịch sử - Địa lý
        publisher: 'NXB Thế Giới',
        publishedYear: 2019,
        pages: 512,
        language: 'Vietnamese',
        stock: 40,
        sold: 35,
        rating: 4.7,
        reviewCount: 120,
        isActive: true,
        isFeatured: true,
        tags: ['lịch sử', 'khoa học', 'best-seller'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center',
          alt: 'Sapiens cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center',
            alt: 'Sapiens cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9786045123789',
        description: 'Hướng dẫn viết code sạch và dễ bảo trì cho các lập trình viên. Cuốn sách kinh điển trong ngành IT.',
        price: 350000,
        originalPrice: 420000,
        category: createdCategories[1]._id, // Khoa học - Kỹ thuật
        publisher: 'NXB Bách Khoa',
        publishedYear: 2021,
        pages: 464,
        language: 'Vietnamese',
        stock: 25,
        sold: 18,
        rating: 4.8,
        reviewCount: 85,
        isActive: true,
        isFeatured: true,
        tags: ['lập trình', 'kỹ thuật', 'clean code'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop&crop=center',
          alt: 'Clean Code cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop&crop=center',
            alt: 'Clean Code cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        isbn: '9786045234567',
        description: 'Câu chuyện về hành trình tìm kiếm kho báu của cậu bé chăn cừu Santiago. Một tác phẩm văn học bất hủ.',
        price: 75000,
        originalPrice: 95000,
        category: createdCategories[0]._id, // Văn học
        publisher: 'NXB Hội Nhà Văn',
        publishedYear: 2020,
        pages: 256,
        language: 'Vietnamese',
        stock: 60,
        sold: 80,
        rating: 4.6,
        reviewCount: 300,
        isActive: true,
        isFeatured: true,
        tags: ['văn học thế giới', 'triết lý', 'tâm linh'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=center',
          alt: 'Nhà Giả Kim cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=center',
            alt: 'Nhà Giả Kim cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        isbn: '9786045345678',
        description: 'Cuốn sách về giáo dục tài chính cá nhân, so sánh quan điểm về tiền bạc của hai người cha.',
        price: 125000,
        originalPrice: 160000,
        category: createdCategories[2]._id, // Kinh tế - Quản lý
        publisher: 'NXB Lao Động',
        publishedYear: 2019,
        pages: 336,
        language: 'Vietnamese',
        stock: 35,
        sold: 42,
        rating: 4.5,
        reviewCount: 180,
        isActive: true,
        isFeatured: true,
        tags: ['tài chính', 'đầu tư', 'kinh doanh'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center',
          alt: 'Rich Dad Poor Dad cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center',
            alt: 'Rich Dad Poor Dad cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Doraemon - Tập 1',
        author: 'Fujiko F. Fujio',
        isbn: '9786045456789',
        description: 'Tập truyện tranh Doraemon đầu tiên, kể về cuộc phiêu lưu của chú mèo máy Doraemon và cậu bé Nobita.',
        price: 25000,
        originalPrice: 30000,
        category: createdCategories[3]._id, // Thiếu nhi
        publisher: 'NXB Kim Đồng',
        publishedYear: 2020,
        pages: 192,
        language: 'Vietnamese',
        stock: 100,
        sold: 150,
        rating: 4.9,
        reviewCount: 500,
        isActive: true,
        isFeatured: false,
        tags: ['manga', 'thiếu nhi', 'phiêu lưu'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=center',
          alt: 'Doraemon cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=center',
            alt: 'Doraemon cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9786045567890',
        description: 'Hướng dẫn xây dựng thói quen tốt và phá bỏ thói quen xấu một cách khoa học và hiệu quả.',
        price: 150000,
        originalPrice: 200000,
        category: createdCategories[4]._id, // Tâm lý - Kỹ năng sống
        publisher: 'NXB Thế Giới',
        publishedYear: 2021,
        pages: 384,
        language: 'Vietnamese',
        stock: 45,
        sold: 30,
        rating: 4.7,
        reviewCount: 95,
        isActive: true,
        isFeatured: true,
        tags: ['thói quen', 'kỹ năng sống', 'tự phát triển'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center',
          alt: 'Atomic Habits cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center',
            alt: 'Atomic Habits cover',
            isMain: true
          }
        ]
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9786045678901',
        description: 'Khám phá cách thức hoạt động của bộ não con người qua hai hệ thống tư duy nhanh và chậm.',
        price: 180000,
        originalPrice: 230000,
        category: createdCategories[4]._id, // Tâm lý - Kỹ năng sống
        publisher: 'NXB Thế Giới',
        publishedYear: 2020,
        pages: 512,
        language: 'Vietnamese',
        stock: 20,
        sold: 15,
        rating: 4.6,
        reviewCount: 65,
        isActive: true,
        isFeatured: false,
        tags: ['tâm lý học', 'khoa học', 'nhận thức'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&h=400&fit=crop&crop=center',
          alt: 'Thinking Fast and Slow cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&h=400&fit=crop&crop=center',
            alt: 'Thinking Fast and Slow cover',
            isMain: true
          }
        ]
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        isbn: '9786045789012',
        description: 'Phương pháp khởi nghiệp tinh gọn, giúp các startup xây dựng sản phẩm hiệu quả và giảm thiểu rủi ro.',
        price: 165000,
        originalPrice: 210000,
        category: createdCategories[2]._id, // Kinh tế - Quản lý
        publisher: 'NXB Trẻ',
        publishedYear: 2021,
        pages: 368,
        language: 'Vietnamese',
        stock: 28,
        sold: 22,
        rating: 4.4,
        reviewCount: 75,
        isActive: true,
        isFeatured: false,
        tags: ['startup', 'kinh doanh', 'quản lý'],
        coverImage: {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop&crop=center',
          alt: 'The Lean Startup cover'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop&crop=center',
            alt: 'The Lean Startup cover',
            isMain: true
          }
        ]
      }
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