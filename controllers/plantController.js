const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع أنواع النباتات
// @route   GET /api/plants/types
// @access  Public
exports.getPlantTypes = asyncHandler(async (req, res) => {
  const plants = await Plant.find({});
  const types = [...new Set(plants.map(p => p.type.ar))];
  
  res.status(200).json({
    success: true,
    data: types
  });
});

// @desc    الحصول على الأصناف حسب النوع
// @route   GET /api/plants/:type
// @access  Public
exports.getPlantsByType = asyncHandler(async (req, res) => {
  const type = req.params.type;
  
  const plants = await Plant.find({});
  const filteredPlants = plants.filter(p => p.type.ar === type);
  
  if (!filteredPlants.length) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على نباتات من هذا النوع'
    });
  }
  
  res.status(200).json({
    success: true,
    data: filteredPlants.map(p => ({
      id: p._id,
      name: p.name,
      scientific_name: p.scientific_name
    }))
  });
});

// @desc    الحصول على تفاصيل نبتة محددة
// @route   GET /api/plants/details/:id
// @access  Public
exports.getPlantDetails = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على النبتة'
    });
  }
  
  res.status(200).json({
    success: true,
    data: plant
  });
});
