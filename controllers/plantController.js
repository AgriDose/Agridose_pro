const Plant = require('../models/Plant');

// 1. الحصول على جميع النباتات
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم: ' + err.message
    });
  }
};

// 2. الحصول على نباتات حسب النوع
exports.getPlantsByType = async (req, res) => {
  try {
    const type = req.params.type;
    const plants = await Plant.find({ 'type.ar': type });
    
    if (plants.length === 0) {
      return res.status(404).json({
        success: false,
        error: `لا توجد نباتات من نوع: ${type}`
      });
    }
    
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم: ' + err.message
    });
  }
};

// 3. البحث عن نبات بالاسم
exports.searchPlants = async (req, res) => {
  try {
    const name = req.params.name;
    const plants = await Plant.find({
      $or: [
        { 'name.ar': { $regex: name, $options: 'i' } },
        { 'name.fr': { $regex: name, $options: 'i' } },
        { 'name.en': { $regex: name, $options: 'i' } },
        { scientific_name: { $regex: name, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم: ' + err.message
    });
  }
};

// 4. الحصول على نبات بواسطة ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'لم يتم العثور على النبات'
      });
    }
    
    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم: ' + err.message
    });
  }
};
