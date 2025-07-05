import express from 'express';
import connectDB from './config/db.js';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// الاتصال بقاعدة البيانات ثم تشغيل الخادم
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🌱 الخادم يعمل على المنفذ ${PORT}`));
});
