require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');

// Routes
const plantRoutes = require('./routes/plantRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. اتصال قاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'));

// 2. Middlewares الأساسية
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser()); // ضروري لنظام المصادقة

// 3. الحماية ضد الهجمات
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة لاحقاً'
});
app.use('/api', limiter);

// 5. Routes الأساسية
app.use('/api/v1/plants', plantRoutes);
app.use('/api/v1/auth', authRoutes);

// 6. معالجة الأخطاء
app.use(errorHandler);

// 7. تشغيل الخادم
const server = app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`📌 API: http://localhost:${PORT}/api/v1`);
});

// 8. معالجة الأخطاء غير الملتقطة
process.on('unhandledRejection', (err) => {
  console.error('❌ خطأ غير معالج:', err);
  server.close(() => process.exit(1));
});
