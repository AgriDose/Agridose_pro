const Plant = require('../models/Plant');
const { calculateFertilizer, calculatePesticide } = require('../utils/calculations');

// حساب التوصيات الزراعية
exports.calculateRecommendations = async (req, res) => {
  const { plantId, region, operation, hectares, mode, extraParams } = req.body;
  
  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'لم يتم العثور على النبات'
      });
    }
    
    let result;
    if (operation === 'fertilizer') {
      result = calculateFertilizer(plant, region, hectares, mode, extraParams);
    } else if (operation === 'pesticide') {
      result = calculatePesticide(plant, region, hectares, mode, extraParams);
    } else {
      return res.status(400).json({
        success: false,
        error: 'نوع العملية غير صالح'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result,
      plant: plant.name,
      timestamp: new Date()
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الحساب: ' + err.message
    });
  }
};
