const express = require('express');
const router = express.Router();
const { calculateRecommendations } = require('../controllers/calculationController');

// POST /api/calculate
router.post('/', calculateRecommendations);

// GET /api/calculate/test (لأغراض الاختبار)
router.get('/test', (req, res) => {
  res.json({ message: 'نظام الحسابات يعمل بشكل صحيح!' });
});

module.exports = router;
