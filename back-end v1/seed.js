// scripts/seed.js
const mongoose = require('mongoose');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const Book = require('../models/Book');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  await mongoose.connection.dropDatabase();

  const author = await Author.create({ name: 'Nguyễn Nhật Ánh', bio: 'Nhà văn Việt Nam', birthDate: new Date('1955-05-07') });
  const category = await Category.create({ name: 'Thiếu nhi', description: 'Sách dành cho thiếu nhi' });
  const publisher = await Publisher.create({ name: 'NXB Trẻ', address: 'TP.HCM', website: 'https://nxbtre.com.vn' });

  await Book.create({
    title: 'Cho tôi xin một vé đi tuổi thơ',
    summary: 'Một câu chuyện về tuổi thơ',
    isbn: '9786041123456',
    author: author._id,
    category: category._id,
    publisher: publisher._id,
    publishedDate: new Date('2008-06-01'),
    pages: 180,
  });

  await User.create({ name: 'Admin', email: 'admin@example.com', password: 'securepassword', role: 'admin' });

  console.log('Dữ liệu mẫu đã được chèn thành công!');
  mongoose.disconnect();
}

seed();
