// tests/book.test.js
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/bookstore_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Book Model Test', () => {
  it('tạo một sách mới', async () => {
    const author = await Author.create({ name: 'Tác giả A' });
    const category = await Category.create({ name: 'Thể loại A' });
    const publisher = await Publisher.create({ name: 'Nhà xuất bản A' });

    const book = await Book.create({
      title: 'Sách A',
      summary: 'Tóm tắt Sách A',
      isbn: '1234567890123',
      author: author._id,
      category: category._id,
      publisher: publisher._id,
      publishedDate: new Date(),
      pages: 200,
    });

    expect(book.title).toBe('Sách A');
    expect(book.pages).toBe(200);
  });
});
