require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');

// Import Routes
const plantRoutes = require('./routes/plantRoutes');
const calculationRoutes = require('./routes/calculationRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: '🌱 AgriDose Backend',
    available_routes: [
      '/api/plants',
      '/api/calculations',
      '/health'
    ]
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    db_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Register Routes
app.use('/api/plants', plantRoutes);
app.use('/api/calculations', calculationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
