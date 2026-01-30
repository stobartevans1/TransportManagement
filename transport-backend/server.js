const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const cors = require('cors')({origin: true});
require('dotenv').config();

const authRoutes = require('./Pages/authRoutes');
const rideRoutes = require('./Pages/rideRoutes');
const vehicleRoutes = require('./Pages/vehicleRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/vehicles', vehicleRoutes);

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
