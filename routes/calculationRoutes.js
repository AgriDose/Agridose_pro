const express = require('express');
const router = express.Router();
const { calculateRecommendations } = require('../controllers/calculationController');

router.post('/', calculateRecommendations);

module.exports = router;
