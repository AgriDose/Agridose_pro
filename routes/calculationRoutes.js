const express = require('express');
const {
  calculateAutoFertilizer,
  calculateAutoPesticide
} = require('../controllers/calculationController');
const router = express.Router();

router.post('/fertilizer/auto', calculateAutoFertilizer);
router.post('/pesticide/auto', calculateAutoPesticide);

module.exports = router;
