require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');

// Routes
const plantRoutes = require('./routes/plantRoutes');
const calculationRoutes = require('./routes/calculationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares الأساسية
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// 2. حماية ضد هجمات API
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة لاحقاً'
});
app.use('/api', limiter);

// 4. الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'));

// 5. Routes
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// 6. معالجة الأخطاء
app.use(errorHandler);

// 7. بدء الخادم
const server = app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

// معالجة الأخطاء غير الملتقطة
process.on('unhandledRejection', (err) => {
  console.error('❌ خطأ غير معالج:', err);
  server.close(() => process.exit(1));
});
