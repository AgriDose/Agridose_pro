const mongoose = require('mongoose');
const validator = require('validator');

const plantSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Plant type is required'],
    enum: ['خضر', 'حبوب', 'أشجار مثمرة']
  },
  variety: {
    type: String,
    required: [true, 'Variety is required'],
    trim: true,
    maxlength: [50, 'Variety name cannot exceed 50 characters']
  },
  region: {
    type: String,
    enum: ['north', 'center', 'south'],
    required: [true, 'Region is required']
  },
  fertilizerPrograms: [
    {
      name: String,
      npkRatio: String,
      dosagePerHectare: Number,
      applicationMethod: String,
      months: [Number],
      pricePerKg: Number
    }
  ],
  diseases: [
    {
      name: String,
      pesticides: [
        {
          name: String,
          activeIngredient: String,
          dosagePerHectare: Number,
          toxicity: {
            bees: String,
            humans: String
          },
          mixingCompatibility: [String]
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// فهرسة للبحث السريع
plantSchema.index({ type: 1, variety: 1, region: 1 });

module.exports = mongoose.model('Plant', plantSchema);
