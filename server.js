import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

// تهيئة البيئة
dotenv.config();

// إصلاح مشكلة الإغلاق المفاجئ
const app = express();
app.use(cors());
app.use(express.json());

// اتصال MongoDB مع معالجة الأخطاء
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ تم الاتصال بقاعدة البيانات');
  } catch (err) {
    console.error('❌ فشل الاتصال:', err.message);
    process.exit(1);
  }
};

// المسارات الأساسية
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date() });
});

app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// تشغيل الخادم بعد الاتصال
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🌱 الخادم يعمل على المنفذ ${PORT}`);
  });
});

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err) => {
  console.error('حدث خطأ غير متوقع:', err);
});
