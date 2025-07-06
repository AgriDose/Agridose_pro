require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// Middlewares الأساسية
app.use(express.json());
app.use(require('cors')());
app.use(require('helmet')());

// الاتصال بقاعدة البيانات
connectDB();

// Route الأساسي
app.get('/', (req, res) => {
  res.json({
    status: 'نشط',
    message: '🌱 AgriDose يعمل بنجاح',
    db_status: mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل'
  });
});

// Route لاختبار الخادم (مضاف جديد)
app.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: '✅ اختبار الخادم ناجح',
    timestamp: new Date().toISOString()
  });
});

// Route للتحقق من اتصال MongoDB (مضاف جديد)
app.get('/db-check', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      db_connected: true,
      collections: collections.map(c => c.name)
    });
  } catch (err) {
    res.status(500).json({
      db_connected: false,
      error: err.message
    });
  }
});

// التعامل مع الأخطاء
app.use((req, res) => {
  res.status(404).json({ error: 'مسار غير موجود' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
