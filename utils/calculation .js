class CalculationService {
  static calculateFertilizer(plant, area, options = {}) {
    const { stage, element } = options;
    let results = [];
    
    plant.fertilizers.forEach(fert => {
      if ((!stage || fert.stage.ar === stage) && 
          (!element || fert[element])) {
        
        const calculated = {};
        ['N', 'P', 'K', 'Ca'].forEach(nutrient => {
          if (fert[nutrient]) {
            const [value, unit] = fert[nutrient].split(' ');
            calculated[nutrient] = `${(parseFloat(value) * area).toFixed(2)} ${unit}`;
          }
        });
        
        results.push({
          stage: fert.stage,
          ...calculated,
          tips: fert.tips.ar
        });
      }
    });
    
    return results;
  }

  static calculatePesticide(plant, area, diseaseName) {
    const disease = plant.diseases.find(d => d.name.ar === diseaseName);
    if (!disease) return null;
    
    const [value, unit] = disease.treatment.dosage.split(' ');
    const total = (parseFloat(value) * area;
    
    return {
      disease: disease.name,
      pesticide: disease.treatment.pesticide,
      dosage: `${value} ${unit}/هكتار`,
      total: `${total.toFixed(2)} ${unit}`,
      application: disease.treatment.application_tips.ar
    };
  }
}

module.exports = CalculationService;
