import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

// 1. تهيئة البيئة وتحقق من المتغيرات
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('❌ خطأ: MONGO_URI غير معرف! تأكد من إضافته في ملف .env أو إعدادات Render');
  process.exit(1);
}

// 2. تهيئة التطبيق
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. مسارات API
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// 5. نقطة فحص الصحة
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// 6. اتصال MongoDB مع معالجة الأخطاء
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    return true;
  } catch (err) {
    console.error('❌ فشل الاتصال:', err.message);
    return false;
  }
};

// 7. تشغيل الخادم
const startServer = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('🔄 محاولة إعادة الاتصال بعد 5 ثوان...');
    setTimeout(startServer, 5000);
    return;
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
    ==================================
    🌱 AgriDose Backend يعمل على المنفذ ${PORT}
    ==================================
    `);
  });
};

startServer();

// 8. معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err) => {
  console.error('⚠️ خطأ غير معالج:', err);
});
