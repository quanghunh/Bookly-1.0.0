const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Book = require('./src/models/Book');
const Order = require('./src/models/Order');
const Review = require('./src/models/Review');

async function seedReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Connected to MongoDB');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Get all users, books, and orders
    const users = await User.find({ role: 'customer' });
    const books = await Book.find({});
    const orders = await Order.find({ status: 'delivered' }).populate('items.book');

    console.log(`Found ${users.length} customers, ${books.length} books, ${orders.length} delivered orders`);

    const reviewsData = [];
    const adminUser = await User.findOne({ role: 'admin' });

    // Sample review comments for different ratings
    const reviewComments = {
      5: [
        "Cuốn sách tuyệt vời! Tôi đã đọc không ngừng và không thể đặt xuống. Nội dung rất hay và ý nghĩa.",
        "Một tác phẩm xuất sắc! Tác giả đã viết rất tâm huyết và truyền cảm hứng mạnh mẽ.",
        "Đây là một trong những cuốn sách hay nhất tôi từng đọc. Rất đáng để sưu tầm.",
        "Nội dung phong phú, ngôn ngữ lôi cuốn. Tôi đã học được rất nhiều điều từ cuốn sách này.",
        "Cuốn sách đã thay đổi cách nhìn của tôi về cuộc sống. Cảm ơn tác giả đã mang đến tác phẩm tuyệt vời này."
      ],
      4: [
        "Sách khá hay, nội dung bổ ích. Có một vài chỗ hơi dài dòng nhưng nhìn chung vẫn rất tốt.",
        "Đây là một cuốn sách đáng đọc. Tôi thích cách tác giả trình bày và phát triển câu chuyện.",
        "Nội dung tốt, học được nhiều điều hay. Chỉ có điều một số phần hơi khó hiểu.",
        "Cuốn sách này rất bổ ích và thú vị. Tôi sẽ giới thiệu cho bạn bè đọc.",
        "Đọc khá thú vị, có những insight hay. Mình nghĩ sẽ đọc lại lần nữa."
      ],
      3: [
        "Sách ổn, có những phần hay nhưng cũng có phần nhàm chán. Phù hợp để đọc trong thời gian rảnh.",
        "Nội dung bình thường, không có gì đặc biệt lắm. Có thể đọc để giải trí.",
        "Cuốn sách này có những điểm hay nhưng cũng có những hạn chế. Đọc được nhưng không ấn tượng lắm.",
        "Tạm ổn, có một số ý hay nhưng chưa thực sự thuyết phục. Có thể phù hợp với một số người.",
        "Đọc được, có những phần thú vị. Nhưng tổng thể chưa đạt được kỳ vọng."
      ],
      2: [
        "Sách không hay lắm, nội dung khá nhàm chán và khó theo dõi. Có lẽ mình không phù hợp với thể loại này.",
        "Đọc thấy hơi khô khan, không có điểm nhấn gì đặc biệt. Có thể tác giả viết chưa cuốn hút.",
        "Nội dung không như kỳ vọng. Có những phần hay nhưng phần lớn là khá dàn trải.",
        "Cuốn sách này khá khó đọc và không thú vị lắm. Mình đã cố gắng đọc hết nhưng cảm thấy mệt mỏi.",
        "Không phải cuốn sách dành cho mình. Nội dung khá khô và thiếu sức hút."
      ],
      1: [
        "Rất thất vọng với cuốn sách này. Nội dung nhàm chán và không có gì hấp dẫn.",
        "Đọc không được bao xa đã bỏ. Cách viết không thu hút và nội dung khó hiểu.",
        "Không khuyến khích mọi người đọc cuốn này. Lãng phí thời gian và tiền bạc.",
        "Cuốn sách tệ nhất tôi từng đọc. Không hiểu sao lại có người khen.",
        "Hoàn toàn không phù hợp với mình. Đọc vài trang đã muốn bỏ."
      ]
    };

    const adminResponses = [
      "Cảm ơn bạn đã dành thời gian đánh giá! Chúng tôi rất vui khi cuốn sách mang lại giá trị cho bạn.",
      "Cảm ơn feedback của bạn. Chúng tôi sẽ tiếp tục cải thiện để mang đến những cuốn sách chất lượng hơn.",
      "Rất tiếc khi cuốn sách chưa đáp ứng được kỳ vọng của bạn. Hy vọng những cuốn sách khác sẽ phù hợp hơn.",
      "Cảm ơn bạn đã chia sẻ. Ý kiến của bạn rất quý giá để chúng tôi cải thiện dịch vụ.",
      "Chúng tôi ghi nhận và trân trọng đánh giá của bạn. Cảm ơn bạn đã tin tưởng và mua sách tại cửa hàng!"
    ];

    // Create reviews for each order
    for (const order of orders) {
      for (const item of order.items) {
        // Random chance to create a review (70% chance)
        if (Math.random() > 0.3) {
          const rating = Math.floor(Math.random() * 5) + 1;
          const comments = reviewComments[rating];
          const comment = comments[Math.floor(Math.random() * comments.length)];
          
          // Random number of images (0-3)
          const numImages = Math.floor(Math.random() * 4);
          const images = [];
          for (let i = 0; i < numImages; i++) {
            images.push({
              url: `https://picsum.photos/400/300?random=${Date.now() + i}`,
              caption: `Image ${i + 1} for review`
            });
          }

          const reviewData = {
            user: order.user,
            book: item.book._id || item.book,
            order: order._id,
            rating,
            comment,
            images,
            isVerified: true,
            helpfulCount: Math.floor(Math.random() * 20),
            reportCount: rating < 3 ? Math.floor(Math.random() * 3) : 0,
            createdAt: new Date(order.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date after order
          };

          // Add admin response to some reviews (40% chance)
          if (Math.random() > 0.6) {
            const responseIndex = Math.floor(Math.random() * adminResponses.length);
            reviewData.adminResponse = adminResponses[responseIndex];
            reviewData.adminResponseBy = adminUser._id;
            reviewData.adminResponseDate = new Date(reviewData.createdAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
          }

          reviewsData.push(reviewData);
        }
      }
    }

    // Create additional standalone reviews for variety
    const additionalReviews = [
      {
        userEmail: 'nguyenvanan@email.com',
        bookTitle: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        rating: 5,
        comment: 'Cuốn sách đã đưa tôi trở về tuổi thơ đầy kỷ niệm. Nguyễn Nhật Ánh thật tài tình trong cách kể chuyện.',
        hasAdminResponse: true
      },
      {
        userEmail: 'tranthibinh@email.com',
        bookTitle: 'Sapiens: Lược Sử Loài Người',
        rating: 5,
        comment: 'Một cuốn sách mở mang tầm mắt tuyệt vời! Yuval Noah Harari đã giúp tôi hiểu rõ hơn về lịch sử loài người.',
        hasAdminResponse: false
      },
      {
        userEmail: 'levancuong@email.com',
        bookTitle: 'Đắc Nhân Tâm',
        rating: 4,
        comment: 'Cuốn sách kinh điển về nghệ thuật giao tiếp. Rất hữu ích cho công việc và cuộc sống.',
        hasAdminResponse: true
      }
    ];

    for (const additionalReview of additionalReviews) {
      const user = await User.findOne({ email: additionalReview.userEmail });
      const book = await Book.findOne({ title: additionalReview.bookTitle });
      
      if (user && book) {
        // Find an order for this user that contains this book
        const userOrder = await Order.findOne({
          user: user._id,
          status: 'delivered',
          'items.book': book._id
        });

        if (userOrder) {
          const reviewData = {
            user: user._id,
            book: book._id,
            order: userOrder._id,
            rating: additionalReview.rating,
            comment: additionalReview.comment,
            images: [],
            isVerified: true,
            helpfulCount: Math.floor(Math.random() * 15) + 5,
            reportCount: 0,
            createdAt: new Date(userOrder.createdAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000)
          };

          if (additionalReview.hasAdminResponse) {
            reviewData.adminResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)];
            reviewData.adminResponseBy = adminUser._id;
            reviewData.adminResponseDate = new Date(reviewData.createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
          }

          reviewsData.push(reviewData);
        }
      }
    }

    // Insert all reviews
    const createdReviews = await Review.insertMany(reviewsData);
    console.log(`Created ${createdReviews.length} reviews`);

    // Update book ratings based on reviews
    const bookIds = [...new Set(reviewsData.map(r => r.book.toString()))];
    
    for (const bookId of bookIds) {
      const book = await Book.findById(bookId);
      if (book) {
        const bookReviews = await Review.find({ book: bookId, isHidden: false });
        if (bookReviews.length > 0) {
          const totalRating = bookReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / bookReviews.length;
          
          await Book.findByIdAndUpdate(bookId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: bookReviews.length
          });
        }
      }
    }

    console.log('Updated book ratings');
    console.log('✅ Review seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdReviews.length} reviews created`);
    console.log(`- ${createdReviews.filter(r => r.adminResponse).length} reviews with admin responses`);
    console.log(`- Reviews distributed across ${bookIds.length} books`);
    console.log('\n⭐ Rating distribution:');
    
    const ratingCounts = {};
    createdReviews.forEach(review => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });
    
    for (let i = 1; i <= 5; i++) {
      console.log(`  ${i} stars: ${ratingCounts[i] || 0} reviews`);
    }

  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedReviews();