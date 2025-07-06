const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // زيادة وقت الانتظار
      socketTimeoutMS: 45000 // زيادة وقت المهلة
    });
    console.log('✅ تم الاتصال بـ MongoDB بنجاح');
  } catch (err) {
    console.error('❌ فشل الاتصال بـ MongoDB:', err.message);
    process.exit(1); // إيقاف التطبيق إذا فشل الاتصال
  }
};

module.exports = connectDB;
