const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const fs = require('fs');
const path = require('path');

// مسار ملف البيانات
const dataPath = path.join(__dirname, 'Agridose_data_full.json');

// استيراد البيانات
const importData = async () => {
  try {
    // قراءة الملف
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);
    
    // حذف البيانات القديمة
    await Plant.deleteMany();
    console.log('🗑️ تم حذف البيانات القديمة');
    
    // استيراد النباتات
    await Plant.insertMany(data.plants);
    console.log(`🌱 تم استيراد ${data.plants.length} صنف نباتي بنجاح`);
    
    // إغلاق الاتصال
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ خطأ في استيراد البيانات:', error);
    process.exit(1);
  }
};

// الاتصال بقاعدة البيانات ثم الاستيراد
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🔗 متصل بقاعدة البيانات');
  importData();
})
.catch(err => console.error('❌ خطأ في الاتصال:', err));
