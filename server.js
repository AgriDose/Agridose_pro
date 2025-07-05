import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

dotenv.config();

// إصلاح مشكلة الإغلاق المفاجئ
const app = express();
app.use(cors());
app.use(express.json());

// اتصال MongoDB مع معالجة الأخطاء المحسنة
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // زيادة وقت الانتظار
      socketTimeoutMS: 45000
    });
    console.log('✅ تم الاتصال بـ MongoDB');
  } catch (err) {
    console.error('❌ فشل الاتصال:', err.message);
    process.exit(1); // إغلاق مع رمز خطأ
  }
};

// مسارات API
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// نقطة فحص الصحة
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active' });
});

// تشغيل الخادم بعد الاتصال بقاعدة البيانات
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🌱 الخادم يعمل على المنفذ ${PORT}`);
  });
});

// معالجة الأخطاء غير الملتقطة
process.on('unhandledRejection', (err) => {
  console.error('خطأ غير معالج:', err);
});
