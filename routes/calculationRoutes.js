const express = require('express');
const router = express.Router();
const calculationController = require('../controllers/calculationController');

// POST /api/calculate
router.post('/', calculationController.calculateRecommendations);

module.exports = router;
