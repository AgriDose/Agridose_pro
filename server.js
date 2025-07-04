const express = require('express');
const mongoose = require('mongoose');
const calculationRoutes = require('./routes/calculationRoutes');
const path = require('path');

const app = express();

// منتصف البرنامج - تحقق من المسارات
app.use((req, res, next) => {
  console.log('📂 هيكل المجلد الحالي:');
  console.log('المسار الجذري:', __dirname);
  
  const fs = require('fs');
  const controllersPath = path.join(__dirname, 'controllers');
  
  if (fs.existsSync(controllersPath)) {
    console.log('📝 محتويات مجلد controllers:');
    console.log(fs.readdirSync(controllersPath));
  } else {
    console.error('❌ مجلد controllers غير موجود!');
  }
  
  next();
});

// بقية إعدادات الخادم
app.use(express.json());
app.use('/api/calculate', calculationRoutes);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ متصل بقاعدة البيانات بنجاح'))
.catch(err => console.error('❌ فشل الاتصال بقاعدة البيانات:', err));

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
