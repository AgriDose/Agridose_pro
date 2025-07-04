// utils/calculations.js

// 1. حساب الأسمدة
exports.calculateFertilizer = (plant, region, hectares, mode, extraParams) => {
  let results = [];
  
  // الوضع التلقائي
  if (mode === 'auto') {
    if (plant.fertilizers) {
      plant.fertilizers.forEach(program => {
        const total = {};
        
        // حساب الكمية الإجمالية لكل عنصر
        if (program.N) {
          const [amount, unit] = program.N.split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total.N = `${totalAmount} ${unit}`;
        }
        
        if (program.P) {
          const [amount, unit] = program.P.split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total.P = `${totalAmount} ${unit}`;
        }
        
        if (program.K) {
          const [amount, unit] = program.K.split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total.K = `${totalAmount} ${unit}`;
        }
        
        if (program.Ca) {
          const [amount, unit] = program.Ca.split(' ');
          const totalAmount = (parseFloat(amount) * hectares).toFixed(2);
          total.Ca = `${totalAmount} ${unit}`;
        }
        
        // إضافة النتائج
        results.push({
          stage: program.stage,
          ...total,
          region,
          tips: program.tips || plant.general_tips,
          mode: 'auto'
        });
      });
    }
    
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
    const matchingProgram = plant.fertilizers?.find(program => 
      program[element] && program.stage.ar.includes(month)
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

// 2. حساب المبيدات
exports.calculatePesticide = (plant, region, hectares, mode, extraParams) => {
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
  } else {
    // تنفيذ المنطق اليدوي
    // ... (يمكنك إضافة الكود هنا لاحقًا)
  }
  
  return results;
};
