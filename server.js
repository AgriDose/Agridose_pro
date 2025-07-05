import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import plantRoutes from './routes/plantRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بـ MongoDB'))
  .catch(err => console.error('❌ فشل الاتصال:', err));

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', nodeVersion: process.version });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌱 الخادم يعمل على المنفذ ${PORT}`));
