require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const plantRoutes = require('./routes/plantRoutes');
const calculationRoutes = require('./routes/calculationRoutes');

// 1. تهيئة التطبيق
const app = express();
const PORT = process.env.PORT || 5000;

// 2. الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// 3. Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// 4. Rate Limiting (100 requests per 15 minutes)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '❌ Too many requests from this IP, please try again after 15 minutes'
}));

// 5. Routes
app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

// 6. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'active',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// 7. بدء الخادم
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 AgriDose Backend Ready!`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
