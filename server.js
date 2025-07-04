require('dotenv').config(); // تحميل متغيرات البيئة أولاً
const path = require('path');
const fs = require('fs');

const express = require('express');
const mongoose = require('mongoose');
const calculationRoutes = require('./routes/calculationRoutes');

const app = express();

// 1. التحقق من وجود متغيرات البيئة
console.log('🔍 التحقق من متغيرات البيئة:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'تم التعرف عليه' : 'غير معروف');
console.log('PORT:', process.env.PORT || '5000 (افتراضي)');

// 2. التحقق من هيكل الملفات
console.log('\n📂 هيكل المجلد الحالي:', __dirname);
console.log('📝 محتويات المجلد:');
try {
  fs.readdirSync(__dirname).forEach(file => {
    console.log(`├── ${file}`);
    
    // إذا كان مجلداً، اعرض محتوياته
    const filePath = path.join(__dirname, file);
    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach(subFile => {
        console.log(`│   ├── ${subFile}`);
      });
    }
  });
} catch (error) {
  console.error('❌ خطأ في قراءة المجلد:', error.message);
}

// 3. التحقق من وجود ملف .env
console.log('\n🔍 التحقق من وجود ملف .env:');
const envPath = path.join(__dirname, '.env');
console.log('مسار .env:', envPath);
console.log('هل الملف موجود؟', fs.existsSync(envPath) ? '✅ نعم' : '❌ لا');

// 4. الاتصال الآمن بقاعدة البيانات
const connectToDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI غير معرّف في ملف .env');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
    console.log('🛠️ جرب استخدام سلسلة اتصال محلية مؤقتاً...');
    
    try {
      // اتصال احتياطي بقاعدة بيانات محلية
      const localURI = 'mongodb://localhost:27017/agridose';
      await mongoose.connect(localURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      console.log('✅ تم الاتصال بقاعدة البيانات المحلية بنجاح');
    } catch (localError) {
      console.error('❌ فشل الاتصال بقاعدة البيانات المحلية:', localError.message);
      console.log('💡 الحلول الممكنة:');
      console.log('1. تأكد من تشغيل خادم MongoDB محلياً');
      console.log('2. تحقق من صحة سلسلة الاتصال في ملف .env');
      console.log('3. تأكد من أن MongoDB يعمل على المنفذ 27017');
    }
  }
};

connectToDB();

// 5. إعدادات الخادم الأساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. تعريف المسارات
app.use('/api/calculate', calculationRoutes);

// 7. تعريف مسار الصحة للتحقق من عمل الخادم
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'active',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// 8. معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('❌ خطأ غير متوقع:', err.stack);
  res.status(500).json({
    error: 'خطأ في الخادم',
    message: 'حدث خطأ غير متوقع'
  });
});

// 9. تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 الخادم يعمل على: http://localhost:${PORT}`);
  console.log('🔍 يمكنك اختبار الخادم عن طريق:');
  console.log(`curl http://localhost:${PORT}/health`);
});
