const express = require('express');
const {
  getPlantTypes,
  getPlantsByType,
  getPlantDetails
} = require('../controllers/plantController');

const router = express.Router();

router.get('/types', getPlantTypes);
router.get('/:type', getPlantsByType);
router.get('/details/:id', getPlantDetails);

module.exports = router;
