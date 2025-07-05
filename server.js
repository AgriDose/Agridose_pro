import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as plantRoutes } from './routes/plantRoutes.js';
import { router as calculationRoutes } from './routes/calculationRoutes.js';

// تهيئة التطبيق
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// اتصال MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
  .catch(err => console.error('❌ فشل الاتصال:', err));

// المسارات
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'active',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 AgriDose يعمل على المنفذ ${PORT}`);
});
