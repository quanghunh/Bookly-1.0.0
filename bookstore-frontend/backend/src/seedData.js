const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Book = require('./src/models/Book');
const Order = require('./src/models/Order');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true
    });

    // Create customer users
    const customerPassword = await bcrypt.hash('password123', 12);
    const customers = await User.insertMany([
      {
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        password: customerPassword,
        role: 'customer',
        phone: '0901234567',
        isEmailVerified: true,
        address: {
          street: '123 Nguyễn Huệ',
          city: 'TP. Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '70000',
          country: 'Vietnam'
        }
      },
      {
        name: 'Trần Thị Bình',
        email: 'tranthibinh@email.com',
        password: customerPassword,
        role: 'customer',
        phone: '0907654321',
        isEmailVerified: true,
        address: {
          street: '456 Lê Lợi',
          city: 'TP. Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '70000',
          country: 'Vietnam'
        }
      },
      {
        name: 'Lê Văn Cường',
        email: 'levancuong@email.com',
        password: customerPassword,
        role: 'customer',
        phone: '0912345678',
        isEmailVerified: true,
        address: {
          street: '789 Trần Hưng Đạo',
          city: 'Hà Nội',
          state: 'Hà Nội',
          zipCode: '10000',
          country: 'Vietnam'
        }
      },
      {
        name: 'Phạm Thị Dung',
        email: 'phamthidung@email.com',
        password: customerPassword,
        role: 'customer',
        phone: '0923456789',
        isEmailVerified: true,
        address: {
          street: '321 Hai Bà Trưng',
          city: 'Đà Nẵng',
          state: 'Đà Nẵng',
          zipCode: '50000',
          country: 'Vietnam'
        }
      },
      {
        name: 'Hoàng Văn Em',
        email: 'hoangvanem@email.com',
        password: customerPassword,
        role: 'customer',
        phone: '0934567890',
        isEmailVerified: true,
        address: {
          street: '654 Nguyễn Thái Học',
          city: 'TP. Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '70000',
          country: 'Vietnam'
        }
      }
    ]);

    console.log('Created users');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Văn học',
        description: 'Sách văn học trong nước và ngoại văn',
        slug: 'van-hoc',
        isActive: true,
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Khoa học',
        description: 'Sách khoa học và công nghệ',
        slug: 'khoa-hoc',
        isActive: true,
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Kinh tế',
        description: 'Sách về kinh tế và quản lý',
        slug: 'kinh-te',
        isActive: true,
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Kỹ năng sống',
        description: 'Sách phát triển bản thân và kỹ năng sống',
        slug: 'ky-nang-song',
        isActive: true,
        isFeatured: false,
        sortOrder: 4
      },
      {
        name: 'Thiếu nhi',
        description: 'Sách dành cho trẻ em',
        slug: 'thieu-nhi',
        isActive: true,
        isFeatured: false,
        sortOrder: 5
      },
      {
        name: 'Lịch sử',
        description: 'Sách về lịch sử và văn hóa',
        slug: 'lich-su',
        isActive: true,
        isFeatured: false,
        sortOrder: 6
      }
    ]);

    console.log('Created categories');

    // Create books
    const books = await Book.insertMany([
      {
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        isbn: '9786041234567',
        description: 'Câu chuyện tuổi thơ đầy cảm động về tình bạn và tình anh em.',
        price: 89000,
        originalPrice: 120000,
        category: categories[0]._id,
        publisher: 'NXB Trẻ',
        publishedYear: 2018,
        pages: 368,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 150,
        sold: 89,
        rating: 4.7,
        reviewCount: 23,
        isActive: true,
        isFeatured: true,
        tags: ['văn học', 'tuổi thơ', 'tình bạn'],
        viewCount: 1250
      },
      {
        title: 'Dế Mèn Phiêu Lưu Ký',
        author: 'Tô Hoài',
        isbn: '9786041234568',
        description: 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam.',
        price: 65000,
        originalPrice: 85000,
        category: categories[4]._id,
        publisher: 'NXB Kim Đồng',
        publishedYear: 2019,
        pages: 280,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 200,
        sold: 156,
        rating: 4.8,
        reviewCount: 45,
        isActive: true,
        isFeatured: true,
        tags: ['thiếu nhi', 'phiêu lưu', 'tô hoài'],
        viewCount: 890
      },
      {
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        isbn: '9786041234569',
        description: 'Cuốn sách khám phá lịch sử tiến hóa của loài người từ thời tiền sử đến hiện đại.',
        price: 199000,
        originalPrice: 250000,
        category: categories[5]._id,
        publisher: 'NXB Thế Giới',
        publishedYear: 2020,
        pages: 512,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 75,
        sold: 234,
        rating: 4.9,
        reviewCount: 67,
        isActive: true,
        isFeatured: true,
        tags: ['lịch sử', 'khoa học', 'triết học'],
        viewCount: 2340
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9786041234570',
        description: 'Khám phá cách thức hoạt động của tư duy con người.',
        price: 179000,
        originalPrice: 220000,
        category: categories[1]._id,
        publisher: 'NXB Thế Giới',
        publishedYear: 2021,
        pages: 624,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 45,
        sold: 78,
        rating: 4.6,
        reviewCount: 34,
        isActive: true,
        isFeatured: false,
        tags: ['tâm lý học', 'khoa học', 'tư duy'],
        viewCount: 567
      },
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        isbn: '9786041234571',
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ảnh hưởng đến người khác.',
        price: 89000,
        originalPrice: 115000,
        category: categories[3]._id,
        publisher: 'NXB Tổng Hợp',
        publishedYear: 2019,
        pages: 320,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 300,
        sold: 445,
        rating: 4.5,
        reviewCount: 89,
        isActive: true,
        isFeatured: true,
        tags: ['kỹ năng sống', 'giao tiếp', 'phát triển bản thân'],
        viewCount: 3450
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        isbn: '9786041234572',
        description: 'Bài học về tiền bạc và đầu tư từ người cha giàu và người cha nghèo.',
        price: 149000,
        originalPrice: 180000,
        category: categories[2]._id,
        publisher: 'NXB Lao Động',
        publishedYear: 2020,
        pages: 280,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 120,
        sold: 267,
        rating: 4.4,
        reviewCount: 56,
        isActive: true,
        isFeatured: false,
        tags: ['kinh tế', 'đầu tư', 'tài chính cá nhân'],
        viewCount: 1890
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9786041234573',
        description: 'Cách tạo thói quen tốt và phá bỏ thói quen xấu.',
        price: 169000,
        originalPrice: 200000,
        category: categories[3]._id,
        publisher: 'NXB Thế Giới',
        publishedYear: 2021,
        pages: 368,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 85,
        sold: 123,
        rating: 4.8,
        reviewCount: 42,
        isActive: true,
        isFeatured: true,
        tags: ['thói quen', 'kỹ năng sống', 'phát triển bản thân'],
        viewCount: 1123
      },
      {
        title: 'Hoàng Tử Bé',
        author: 'Antoine de Saint-Exupéry',
        isbn: '9786041234574',
        description: 'Câu chuyện cổ tích bất hủ về một hoàng tử bé đến từ hành tinh khác.',
        price: 59000,
        originalPrice: 75000,
        category: categories[0]._id,
        publisher: 'NXB Kim Đồng',
        publishedYear: 2018,
        pages: 128,
        language: 'Vietnamese',
        format: 'paperback',
        stock: 180,
        sold: 234,
        rating: 4.9,
        reviewCount: 78,
        isActive: true,
        isFeatured: true,
        tags: ['văn học', 'cổ tích', 'triết lý'],
        viewCount: 2100
      }
    ]);

    console.log('Created books');

    // Create orders with delivered status
    const orders = [];
    const orderPromises = [];

    // Nguyễn Văn An orders
    orderPromises.push(Order.create({
      user: customers[0]._id,
      items: [
        {
          book: books[0]._id,
          quantity: 1,
          price: books[0].price,
          total: books[0].price
        },
        {
          book: books[4]._id,
          quantity: 2,
          price: books[4].price,
          total: books[4].price * 2
        }
      ],
      totalAmount: books[0].price + (books[4].price * 2),
      status: 'delivered',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      shippingAddress: customers[0].address,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-22')
    }));

    // Trần Thị Bình orders
    orderPromises.push(Order.create({
      user: customers[1]._id,
      items: [
        {
          book: books[2]._id,
          quantity: 1,
          price: books[2].price,
          total: books[2].price
        }
      ],
      totalAmount: books[2].price,
      status: 'delivered',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      shippingAddress: customers[1].address,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-28')
    }));

    // Lê Văn Cường orders
    orderPromises.push(Order.create({
      user: customers[2]._id,
      items: [
        {
          book: books[1]._id,
          quantity: 1,
          price: books[1].price,
          total: books[1].price
        },
        {
          book: books[7]._id,
          quantity: 1,
          price: books[7].price,
          total: books[7].price
        }
      ],
      totalAmount: books[1].price + books[7].price,
      status: 'delivered',
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      shippingAddress: customers[2].address,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-08')
    }));

    // Phạm Thị Dung orders
    orderPromises.push(Order.create({
      user: customers[3]._id,
      items: [
        {
          book: books[5]._id,
          quantity: 1,
          price: books[5].price,
          total: books[5].price
        },
        {
          book: books[6]._id,
          quantity: 1,
          price: books[6].price,
          total: books[6].price
        }
      ],
      totalAmount: books[5].price + books[6].price,
      status: 'delivered',
      paymentMethod: 'e_wallet',
      paymentStatus: 'paid',
      shippingAddress: customers[3].address,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-17')
    }));

    // Hoàng Văn Em orders
    orderPromises.push(Order.create({
      user: customers[4]._id,
      items: [
        {
          book: books[3]._id,
          quantity: 1,
          price: books[3].price,
          total: books[3].price
        },
        {
          book: books[4]._id,
          quantity: 1,
          price: books[4].price,
          total: books[4].price
        }
      ],
      totalAmount: books[3].price + books[4].price,
      status: 'delivered',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      shippingAddress: customers[4].address,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-22')
    }));

    // Additional orders for more variety
    orderPromises.push(Order.create({
      user: customers[0]._id,
      items: [
        {
          book: books[2]._id,
          quantity: 1,
          price: books[2].price,
          total: books[2].price
        }
      ],
      totalAmount: books[2].price,
      status: 'delivered',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      shippingAddress: customers[0].address,
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-27')
    }));

    orderPromises.push(Order.create({
      user: customers[1]._id,
      items: [
        {
          book: books[6]._id,
          quantity: 1,
          price: books[6].price,
          total: books[6].price
        },
        {
          book: books[7]._id,
          quantity: 1,
          price: books[7].price,
          total: books[7].price
        }
      ],
      totalAmount: books[6].price + books[7].price,
      status: 'delivered',
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      shippingAddress: customers[1].address,
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-03-05')
    }));

    const createdOrders = await Promise.all(orderPromises);
    console.log('Created orders');

    // Update category book counts
    for (const category of categories) {
      const bookCount = await Book.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { bookCount });
    }

    console.log('Updated category book counts');
    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${customers.length} customers created`);
    console.log(`- ${categories.length} categories created`);
    console.log(`- ${books.length} books created`);
    console.log(`- ${createdOrders.length} orders created`);
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@bookstore.com / admin123');
    console.log('Customer example: nguyenvanan@email.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedData();