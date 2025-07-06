const Plant = require('../models/Plant');

exports.getPlantTypes = async (req, res) => {
  try {
    const types = await Plant.distinct('type');
    res.json({ types });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlantVarieties = async (req, res) => {
  try {
    const varieties = await Plant.find({ type: req.params.type }).distinct('variety');
    res.json({ varieties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
