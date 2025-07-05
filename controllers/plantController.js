const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    الحصول على جميع أنواع النباتات
// @route   GET /api/plants/types
// @access  Public
exports.getPlantTypes = asyncHandler(async (req, res, next) => {
  const types = await Plant.distinct('type');
  res.status(200).json({ success: true, data: types });
});

// @desc    الحصول على الأصناف حسب النوع
// @route   GET /api/plants/varieties/:type
// @access  Public
exports.getPlantVarieties = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  
  if (!['خضر', 'حبوب', 'أشجار مثمرة'].includes(type)) {
    return next(new ErrorResponse('Invalid plant type', 400));
  }

  const varieties = await Plant.distinct('variety', { type });
  res.status(200).json({ success: true, data: varieties });
});

// @desc    الحصول على تفاصيل صنف معين
// @route   GET /api/plants/details/:type/:variety
// @access  Public
exports.getPlantDetails = asyncHandler(async (req, res, next) => {
  const { type, variety } = req.params;

  const plant = await Plant.findOne({ type, variety });
  
  if (!plant) {
    return next(new ErrorResponse('Plant variety not found', 404));
  }

  res.status(200).json({ success: true, data: plant });
});
