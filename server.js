require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// تهيئة التطبيق
const app = express();

// Middlewares الأساسية
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد 100 طلب لكل IP
});
app.use(limiter);

// الاتصال بقاعدة البيانات
connectDB();

// Route الأساسي
app.get('/', (req, res) => {
  res.json({ 
    status: 'يعمل',
    message: '🌱 AgriDose Backend يعمل بنجاح',
    db_connection: mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل'
  });
});

// التعامل مع الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في الخادم' });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
