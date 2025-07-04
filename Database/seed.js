const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Connection error:', err));

// 2. قراءة ملف البيانات
const dataPath = path.join(__dirname, 'database', 'Agridose_data_full.json');
const rawData = fs.readFileSync(dataPath);
const agriData = JSON.parse(rawData);

// 3. وظيفة استيراد البيانات
const importData = async () => {
  try {
    // حذف البيانات القديمة
    await Plant.deleteMany({});
    console.log('🗑️ Old data deleted');
    
    // استيراد النباتات
    await Plant.insertMany(agriData.plants);
    console.log(`🌱 Imported ${agriData.plants.length} plants successfully`);
    
    // إغلاق الاتصال
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Import error:', error);
    process.exit(1);
  }
};

// 4. استدعاء الوظيفة
importData();
