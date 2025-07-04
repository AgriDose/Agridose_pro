// حساب جرعة السماد
exports.calculateFertilizer = (fertilizer, hectares, region) => {
  const calculateElement = (element) => {
    if (!element) return null;
    const value = parseFloat(element.split(' ')[0]);
    return {
      amount: (value * hectares).toFixed(2),
      unit: element.split(' ')[1]
    };
  };
  
  return {
    stage: fertilizer.stage,
    N: calculateElement(fertilizer.N),
    P: calculateElement(fertilizer.P),
    K: calculateElement(fertilizer.K),
    Ca: calculateElement(fertilizer.Ca),
    tips: fertilizer.tips,
    estimatedCost: estimateCost(fertilizer, hectares, region)
  };
};

// حساب جرعة المبيد
exports.calculatePesticide = (treatment, hectares) => {
  const dosagePerHectare = parseFloat(treatment.dosage.split(' ')[0]);
  const unit = treatment.dosage.split(' ')[1];
  
  return {
    pesticide: treatment.pesticide,
    dosagePerHectare: treatment.dosage,
    totalAmount: (dosagePerHectare * hectares).toFixed(2) + ' ' + unit,
    frequency: treatment.frequency || 'حسب الحاجة'
  };
};

// تقدير التكلفة (مثال مبسط)
function estimateCost(fertilizer, hectares, region) {
  // هذه قيم تقديرية، يجب استبدالها بقيم حقيقية
  const priceMap = {
    N: { north: 150, south: 180, center: 160 },
    P: { north: 200, south: 220, center: 210 },
    K: { north: 180, south: 200, center: 190 }
  };
  
  let total = 0;
  
  if (fertilizer.N) {
    const nValue = parseFloat(fertilizer.N.split(' ')[0]);
    total += nValue * hectares * priceMap.N[region];
  }
  
  if (fertilizer.P) {
    const pValue = parseFloat(fertilizer.P.split(' ')[0]);
    total += pValue * hectares * priceMap.P[region];
  }
  
  if (fertilizer.K) {
    const kValue = parseFloat(fertilizer.K.split(' ')[0]);
    total += kValue * hectares * priceMap.K[region];
  }
  
  return total;
}
