import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Calculation endpoint' });
});

export default router;  // التصدير بهذه الطريقة
