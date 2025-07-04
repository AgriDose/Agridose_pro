require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { protect } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// 1. تهيئة التطبيق
const app = express();

// 2. تحسينات الأداء والأمان
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

// 3. الحد من معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // 100 طلب لكل IP
});
app.use(limiter);

// 4. معالجة JSON
app.use(express.json({ limit: '10kb' }));

// 5. الاتصال بقاعدة البيانات مع إعدادات متقدمة
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => {
  console.error('❌ فشل الاتصال:', err);
  process.exit(1);
});

// 6. مسارات التطبيق
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'active',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.use('/api/v1/plants', require('./routes/plantRoutes'));
app.use('/api/v1/calculate', protect, require('./routes/calculationRoutes'));

// 7. معالجة 404
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `لا يمكن العثور على ${req.originalUrl}`
  });
});

// 8. معالجة الأخطاء (يجب أن يكون الأخير)
app.use(errorHandler);

// 9. تشغيل الخادم
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🌱 AgriDose API تعمل على المنفذ ${PORT}`);
});

// 10. معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err) => {
  console.error('❌ خطأ غير معالج:', err);
  server.close(() => process.exit(1));
});

module.exports = app; // للتستينغ
