const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع النباتات
// @route   GET /api/plants
// @access  Public
exports.getPlants = asyncHandler(async (req, res) => {
  const { type, region, search } = req.query;
  
  let query = {};
  
  if (type) {
    query['type.ar'] = type;
  }
  
  if (region) {
    query.growing_regions = { $in: [region] };
  }
  
  if (search) {
    query.$or = [
      { 'name.ar': { $regex: search, $options: 'i' } },
      { 'name.fr': { $regex: search, $options: 'i' } },
      { 'scientific_name': { $regex: search, $options: 'i' } }
    ];
  }

  const plants = await Plant.find(query);
  
  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
});

// @desc    الحصول على نبات معين
// @route   GET /api/plants/:id
// @access  Public
exports.getPlant = asyncHandler(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id);
  
  if (!plant) {
    return next(new ErrorResponse(`لم يتم العثور على نبات بالرقم ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: plant
  });
});
