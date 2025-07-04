const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
  } catch (err) {
    console.error('فشل الاتصال بقاعدة البيانات:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
