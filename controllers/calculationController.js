const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    حساب جرعات الأسمدة (وضع تلقائي)
// @route   POST /api/calculations/fertilizer/auto
// @access  Public
exports.calculateAutoFertilizer = asyncHandler(async (req, res, next) => {
  const { type, variety, region, hectares } = req.body;

  // التحقق من المدخلات
  if (!type || !variety || !region || !hectares || hectares <= 0) {
    return next(new ErrorResponse('Invalid input data', 400));
  }

  const plant = await Plant.findOne({ type, variety });
  
  if (!plant) {
    return next(new ErrorResponse('Plant not found', 404));
  }

  // تصفية برامج التسمية حسب المنطقة
  const programs = plant.fertilizerPrograms.filter(p => p.region === region);
  
  if (programs.length === 0) {
    return next(new ErrorResponse('No fertilizer programs found for this region', 404));
  }

  // حساب الكميات الإجمالية
  const results = programs.map(program => ({
    name: program.name,
    npkRatio: program.npkRatio,
    dosagePerHectare: program.dosagePerHectare,
    totalQuantity: (program.dosagePerHectare * hectares).toFixed(2),
    applicationMethod: program.applicationMethod,
    priceEstimate: (program.pricePerKg * program.dosagePerHectare * hectares).toFixed(2),
    suitableMonths: program.months
  }));

  // ترتيب من الأغلى إلى الأرخص
  results.sort((a, b) => b.priceEstimate - a.priceEstimate);

  res.status(200).json({
    success: true,
    data: {
      plant: `${type} - ${variety}`,
      region,
      hectares,
      results
    }
  });
});

// @desc    حساب جرعات الأدوية (وضع تلقائي)
// @route   POST /api/calculations/pesticide/auto
// @access  Public
exports.calculateAutoPesticide = asyncHandler(async (req, res, next) => {
  const { type, variety, diseaseNames, hectares } = req.body;

  // التحقق من المدخلات
  if (!type || !variety || !diseaseNames || !Array.isArray(diseaseNames) || 
      diseaseNames.length === 0 || !hectares || hectares <= 0) {
    return next(new ErrorResponse('Invalid input data', 400));
  }

  const plant = await Plant.findOne({ type, variety });
  
  if (!plant) {
    return next(new ErrorResponse('Plant not found', 404));
  }

  // البحث عن الأمراض المطلوبة
  const diseases = plant.diseases.filter(d => 
    diseaseNames.includes(d.name)
  );
  
  if (diseases.length === 0) {
    return next(new ErrorResponse('No matching diseases found', 404));
  }

  // تجميع جميع المبيدات المقترحة
  const allPesticides = diseases.flatMap(d => d.pesticides);
  
  // إزالة التكرارات
  const uniquePesticides = Array.from(new Set(allPesticides.map(p => p.name)))
    .map(name => allPesticides.find(p => p.name === name));

  // حساب الكميات الإجمالية
  const results = uniquePesticides.map(pesticide => ({
    name: pesticide.name,
    activeIngredient: pesticide.activeIngredient,
    dosagePerHectare: pesticide.dosagePerHectare,
    totalQuantity: (pesticide.dosagePerHectare * hectares).toFixed(2),
    toxicity: pesticide.toxicity,
    mixingCompatibility: pesticide.mixingCompatibility
  }));

  res.status(200).json({
    success: true,
    data: {
      plant: `${type} - ${variety}`,
      diseases: diseaseNames,
      hectares,
      results
    }
  });
});
