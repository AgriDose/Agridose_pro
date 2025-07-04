const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  stage: String,
  N: String,
  P: String,
  K: String,
  Ca: String,
  tips: String
});

const pesticideSchema = new mongoose.Schema({
  active_ingredient: String,
  dosage: String,
  safety_period: String,
  bee_toxicity: String,
  alternatives: [String]
});

const plantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  type: String,
  growth_stages: [String],
  fertilizers: [fertilizerSchema],
  pesticides: [pesticideSchema],
  general_tips: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plant', plantSchema);
