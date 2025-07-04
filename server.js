const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const plantRoutes = require('./routes/plantRoutes');
const calculationRoutes = require('./routes/calculationRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/plants', plantRoutes);
app.use('/api/calculate', calculationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
