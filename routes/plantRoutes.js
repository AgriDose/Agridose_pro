const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// 1. الحصول على جميع النباتات
router.get('/', async (req, res) => {
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
      error: 'Server Error: ' + err.message
    });
  }
});

// 2. الحصول على نباتات حسب النوع
router.get('/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const plants = await Plant.find({ 'type.ar': type });
    
    if (plants.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No plants found for type: ${type}`
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
      error: 'Server Error: ' + err.message
    });
  }
});

// 3. البحث عن نبات بالاسم
router.get('/search/:name', async (req, res) => {
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
      error: 'Server Error: ' + err.message
    });
  }
});

module.exports = router;
