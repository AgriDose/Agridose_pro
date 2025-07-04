const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    ar: String,
    fr: String,
    en: String
  },
  symptoms: {
    ar: String,
    fr: String,
    en: String
  },
  treatment: {
    pesticide: {
      ar: String,
      fr: String,
      en: String
    },
    dosage: String,
    application_tips: {
      ar: String,
      fr: String,
      en: String
    }
  }
});

const fertilizerSchema = new mongoose.Schema({
  stage: {
    ar: String,
    fr: String,
    en: String
  },
  N: String,
  P: String,
  K: String,
  Ca: String,
  tips: {
    ar: String,
    fr: String,
    en: String
  }
});

const pesticideSchema = new mongoose.Schema({
  active_ingredient: {
    ar: String,
    fr: String,
    en: String
  },
  dosage: String,
  safety_period: {
    ar: String,
    fr: String,
    en: String
  },
  mixability: {
    ar: String,
    fr: String,
    en: String
  },
  bee_toxicity: {
    ar: String,
    fr: String,
    en: String
  },
  alternatives: {
    ar: [String],
    fr: [String],
    en: [String]
  }
});

const plantSchema = new mongoose.Schema({
  id: String,
  type: {
    ar: String,
    fr: String,
    en: String
  },
  name: {
    ar: String,
    fr: String,
    en: String
  },
  scientific_name: String,
  algerian_variety: Boolean,
  growing_regions: [String],
  diseases: [diseaseSchema],
  fertilizers: [fertilizerSchema],
  pesticides: [pesticideSchema],
  general_tips: {
    ar: String,
    fr: String,
    en: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Plant', plantSchema);
