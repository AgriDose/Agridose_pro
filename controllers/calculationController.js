const Plant = require('../models/Plant');

// دالة حساب السماد
const calculateFertilizer = (plant, region, hectares, mode, extraParams) => {
  let results = [];
  
  if (mode === 'auto' && plant.fertilizers) {
    plant.fertilizers.forEach(program => {
      const total = {};
      
      ['N', 'P', 'K', 'Ca'].forEach(element => {
        if (program[element]) {
          const [amount, unit] = program[element].split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total[element] = `${totalAmount} ${unit}`;
        }
      });
      
      results.push({
        stage: program.stage,
        ...total,
        region,
        tips: program.tips || plant.general_tips,
        mode: 'auto'
      });
    });
  } 
  else if (mode === 'manual') {
    if (extraParams && extraParams.manualFertilizer) {
      extraParams.manualFertilizer.forEach(item => {
        const total = {};
        Object.keys(item.elements).forEach(element => {
          const [amount, unit] = item.elements[element].split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total[element] = `${totalAmount} ${unit}`;
        });
        
        results.push({
          stage: item.stage,
          ...total,
          region,
          tips: item.tips || plant.general_tips,
          mode: 'manual'
        });
      });
    }
  }
  
  return results;
};

// دالة حساب المبيدات
const calculatePesticide = (plant, region, hectares, mode, extraParams) => {
  let results = [];
  
  if (mode === 'auto' && plant.pesticides) {
    plant.pesticides.forEach(pesticide => {
      if (pesticide.dosage) {
        const [amount, unit] = pesticide.dosage.split(' ');
        const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
        
        results.push({
          name: pesticide.active_ingredient,
          dosage: pesticide.dosage,
          total: `${totalAmount} ${unit}`,
          safety_period: pesticide.safety_period,
          bee_toxicity: pesticide.bee_toxicity,
          alternatives: pesticide.alternatives,
          region,
          mode: 'auto'
        });
      }
    });
  }
  else if (mode === 'manual') {
    if (extraParams && extraParams.manualPesticide) {
      extraParams.manualPesticide.forEach(item => {
        const [amount, unit] = item.dosage.split(' ');
        const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
        
        results.push({
          name: item.name,
          dosage: item.dosage,
          total: `${totalAmount} ${unit}`,
          safety_period: item.safety_period || 'غير محدد',
          bee_toxicity: item.bee_toxicity || 'غير محدد',
          alternatives: item.alternatives || [],
          region,
          mode: 'manual'
        });
      });
    }
  }
  
  return results;
};

// الدالة الرئيسية للحسابات
exports.calculateRecommendations = async (req, res) => {
  try {
    const { plantId, region, hectares, operation, mode, extraParams } = req.body;
    
    // التحقق من البيانات المدخلة
    if (!plantId || !region || !hectares || !operation || !mode) {
      return res.status(400).json({
        error: 'بيانات ناقصة',
        message: 'يرجى تقديم جميع الحقول المطلوبة: plantId, region, hectares, operation, mode'
      });
    }
    
    // جلب بيانات النبات من قاعدة البيانات
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        error: 'غير موجود',
        message: 'لم يتم العثور على النبات المحدد'
      });
    }
    
    let result;
    const hectaresNum = parseFloat(hectares);
    
    if (isNaN(hectaresNum) || hectaresNum <= 0) {
      return res.status(400).json({
        error: 'قيمة غير صالحة',
        message: 'يجب أن تكون المساحة رقمًا موجبًا'
      });
    }
    
    // التوجيه بناءً على نوع العملية
    if (operation === 'fertilizer') {
      result = calculateFertilizer(plant, region, hectaresNum, mode, extraParams);
    } else if (operation === 'pesticide') {
      result = calculatePesticide(plant, region, hectaresNum, mode, extraParams);
    } else {
      return res.status(400).json({
        error: 'عملية غير معروفة',
        message: 'نوع العملية المطلوبة غير معروف'
      });
    }
    
    // الإرجاع بنجاح
    res.status(200).json({
      success: true,
      plant: plant.name,
      operation,
      region,
      hectares: hectaresNum,
      mode,
      results: result
    });
    
  } catch (error) {
    console.error('حدث خطأ في المعالجة:', error);
    res.status(500).json({
      error: 'خطأ في الخادم',
      message: 'حدث خطأ غير متوقع أثناء المعالجة'
    });
  }
};
