import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

// تحقق من وجود متغيرات البيئة المطلوبة
if (!process.env.MONGO_URI) {
  console.error('❌ خطأ: MONGO_URI غير معرف في ملف .env أو إعدادات Render');
  process.exit(1);
}

// تهيئة التطبيق
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
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
    // إعادة المحاولة بعد 5 ثواني
    setTimeout(connectDB, 5000);
  }
};

// المسارات
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// نقطة فحص الصحة
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// معالجة الأخطاء
process.on('unhandledRejection', (err) => {
  console.error('⚠️ خطأ غير معالج:', err);
});

// تشغيل الخادم بعد الاتصال بالـ DB
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
    ================================
    🌱 AgriDose Backend يعمل على المنفذ ${PORT}
    📡 حالة DB: ${mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل'}
    ================================
    `);
  });
});
