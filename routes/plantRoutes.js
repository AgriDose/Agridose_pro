const express = require('express');
const {
  getPlantTypes,
  getPlantVarieties,
  getPlantDetails
} = require('../controllers/plantController');
const router = express.Router();

router.get('/types', getPlantTypes);
router.get('/varieties/:type', getPlantVarieties);
router.get('/details/:type/:variety', getPlantDetails);

module.exports = router;
