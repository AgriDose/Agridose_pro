import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Plants endpoint' });
});

export default router;  // التصدير بهذه الطريقة
