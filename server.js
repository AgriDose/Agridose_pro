import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// التحقق من المتغيرات الأساسية
const requiredEnvVars = ['MONGO_URI', 'FRONTEND_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ خطأ: ${envVar} غير معرف في ملف .env`);
    process.exit(1);
  }
}

// تهيئة التطبيق
const app = express();

// Middleware الأمان
app.use(helmet());
app.disable('x-powered-by');

// CORS محدود للنطاق الأمامي فقط
app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

// معدل الطلب للوقاية من الهجمات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة لاحقاً'
});
app.use(limiter);

// تحليل جسم الطلب
app.use(express.json({ limit: '10kb' }));

// اتصال MongoDB مع إعادة محاولة
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
    setTimeout(connectDB, 5000);
  }
};

// مسارات التطبيق
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// نقطة فحص الصحة
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// معالجة الأخطاء المركزية
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'حدث خطأ في الخادم',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🌱 AgriDose يعمل على المنفذ ${PORT}`);
    console.log(`🔗 النطاق الأمامي المسموح: ${process.env.FRONTEND_URL}`);
    console.log(`⚙️ الوضع الحالي: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch(err => {
  console.error('❌ فشل تشغيل الخادم:', err);
  process.exit(1);
});
