const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: [true, 'يجب إدخال اسم المرض بالعربية'] },
    fr: String,
    en: String
  },
  symptoms: {
    ar: String,
    fr: String
  },
  treatment: {
    pesticide: {
      ar: String,
      fr: String
    },
    dosage: String,
    application_tips: {
      ar: String,
      fr: String
    }
  }
});

const PlantSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    fr: { type: String, required: true },
    en: String
  },
  scientific_name: {
    type: String,
    required: true,
    unique: true
  },
  growing_regions: {
    type: [String],
    enum: ['الشمال', 'الجنوب', 'الهضاب العليا', 'الساحل'],
    required: true
  },
  diseases: [DiseaseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// فهرسة للبحث السريع
PlantSchema.index({ name: 'text', scientific_name: 'text' });

module.exports = mongoose.model('Plant', PlantSchema);
