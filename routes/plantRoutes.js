const express = require('express');
const {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant
} = require('../controllers/plantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPlants)
  .post(protect, authorize('admin'), createPlant);

router.route('/:id')
  .get(getPlant)
  .put(protect, authorize('admin'), updatePlant)
  .delete(protect, authorize('admin'), deletePlant);

module.exports = router;
