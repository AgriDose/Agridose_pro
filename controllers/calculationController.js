const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');
const { calculateFertilizer, calculatePesticide } = require('../utils/calculations');

// @desc    حساب جرعة الأسمدة (وضع تلقائي)
// @route   POST /api/calculate/fertilizer/auto
// @access  Public
exports.calculateAutoFertilizer = asyncHandler(async (req, res) => {
  const { plantId, hectares, region } = req.body;
  
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على النبتة'
    });
  }
  
  const programs = plant.fertilizers.map(fertilizer => {
    return calculateFertilizer(fertilizer, hectares, region);
  });
  
  // ترتيب البرامج من الأغلى إلى الأرخص (مثال)
  programs.sort((a, b) => b.estimatedCost - a.estimatedCost);
  
  res.status(200).json({
    success: true,
    data: {
      programs,
      generalTips: plant.general_tips,
      regionalTips: getRegionalTips(region)
    }
  });
});

// @desc    حساب جرعة الأدوية (وضع تلقائي)
// @route   POST /api/calculate/pesticide/auto
// @access  Public
exports.calculateAutoPesticide = asyncHandler(async (req, res) => {
  const { plantId, diseaseName, hectares } = req.body;
  
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على النبتة'
    });
  }
  
  const disease = plant.diseases.find(d => d.name.ar === diseaseName || d.name.fr === diseaseName);
  if (!disease) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على المرض'
    });
  }
  
  const result = calculatePesticide(disease.treatment, hectares);
  
  res.status(200).json({
    success: true,
    data: {
      ...result,
      safetyPeriod: disease.treatment.safety_period,
      beeToxicity: disease.treatment.bee_toxicity,
      applicationTips: disease.treatment.application_tips
    }
  });
});

// وظائف مساعدة
function getRegionalTips(region) {
  const tips = {
    north: {
      ar: "المنطقة الشمالية: ينصح بالري المعتدل وتجنب الإفراط في التسميد النيتروجيني",
      fr: "Région nord: Irrigation modérée recommandée, éviter l'excès d'engrais azotés"
    },
    south: {
      ar: "المنطقة الجنوبية: ينصح بالري بالتنقيط وتوفير الظل للنباتات الحساسة",
      fr: "Région sud: Irrigation goutte à goutte recommandée, ombrage pour les plantes sensibles"
    }
  };
  
  return tips[region] || {
    ar: "نصائح عامة: اتبع تعليمات الجرعات بدقة وحافظ على التوازن الغذائي",
    fr: "Conseils généraux: Suivez les doses recommandées et maintenez l'équilibre nutritionnel"
  };
}
