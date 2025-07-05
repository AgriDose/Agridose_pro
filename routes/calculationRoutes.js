import express from 'express';
const router = express.Router();

router.post('/fertilizer', (req, res) => {
  res.json({
    message: 'حساب الأسمدة',
    formula: 'NPK'
  });
});

export default router; // التصدير الموحد
