const express = require('express');
const router = express.Router();
const {
  getPlantTypes,
  getPlantVarieties
} = require('../controllers/plantController');

// GET /api/plants/types
router.get('/types', getPlantTypes);

// GET /api/plants/varieties/:type
router.get('/varieties/:type', getPlantVarieties);

module.exports = router;
