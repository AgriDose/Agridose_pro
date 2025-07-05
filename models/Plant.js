const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['خضر', 'حبوب', 'أشجار مثمرة'], required: true },
  region: { type: String, enum: ['north', 'center', 'south'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
