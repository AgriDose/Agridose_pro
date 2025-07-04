const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const { calculateFertilizer, calculatePesticide } = require('../utils/calculations');

// 1. حساب التوصيات
router.post('/', async (req, res) => {
  const { plantId, region, operation, hectares, mode, extraParams } = req.body;
  
  try {
    // التحقق من وجود النبات
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found with ID: ' + plantId
      });
    }
    
    // حساب النتائج حسب العملية
    let result;
    if (operation === 'fertilizer') {
      result = calculateFertilizer(plant, region, hectares, mode, extraParams);
    } else if (operation === 'pesticide') {
      result = calculatePesticide(plant, region, hectares, mode, extraParams);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid operation type'
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
      error: 'Calculation Error: ' + err.message
    });
  }
});

module.exports = router;
