import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ تم الاتصال بقاعدة البيانات');
  } catch (err) {
    console.error('❌ فشل الاتصال:', err.message);
    process.exit(1);
  }
};

export default connectDB;
