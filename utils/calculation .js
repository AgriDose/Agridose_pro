// 1. حساب الأسمدة
exports.calculateFertilizer = (plant, region, hectares, mode, extraParams) => {
  let results = [];
  
  // الوضع التلقائي
  if (mode === 'auto') {
    plant.fertilizers.forEach(program => {
      const total = {};
      
      // حساب الكمية الإجمالية لكل عنصر
      Object.entries(program).forEach(([key, value]) => {
        if (['N', 'P', 'K', 'Ca'].includes(key) && value) {
          const [amount, unit] = value.split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total[key] = `${totalAmount} ${unit}`;
        }
      });
      
      // إضافة النتائج
      results.push({
        stage: program.stage,
        ...total,
        region,
        tips: program.tips,
        mode: 'auto'
      });
    });
    
    // ترتيب النتائج حسب التكلفة (مثال)
    results.sort((a, b) => {
      const costA = parseFloat(a.N?.split(' ')[0] || 0) + parseFloat(a.P?.split(' ')[0] || 0);
      const costB = parseFloat(b.N?.split(' ')[0] || 0) + parseFloat(b.P?.split(' ')[0] || 0);
      return costA - costB;
    });
    
  } 
  // الوضع اليدوي
  else if (mode === 'manual') {
    const { element, month } = extraParams;
    
    // البحث عن برنامج يناسب المدخلات
    const matchingProgram = plant.fertilizers.find(program => 
      Object.keys(program).includes(element) && 
      program.stage.ar.includes(month)
    );
    
    if (matchingProgram) {
      const value = matchingProgram[element];
      const [amount, unit] = value.split(' ');
      const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
      
      results.push({
        element,
        dosage: `${amount} ${unit}/هكتار`,
        total: `${totalAmount} ${unit}`,
        month,
        tips: matchingProgram.tips || plant.general_tips,
        mode: 'manual'
      });
    }
  }
  
  return results;
};

// 2. حساب المبيدات (بنفس النمط)
exports.calculatePesticide = (plant, region, hectares, mode, extraParams) => {
  let results = [];
  
  if (mode === 'auto') {
    plant.pesticides.forEach(pesticide => {
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
    });
  } else {
    // تنفيذ المنطق اليدوي
  }
  
  return results;
};
