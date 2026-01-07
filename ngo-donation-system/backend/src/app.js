const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

app.get('/', (req, res) => {
    res.send('NGO Donation System API is running...');
});

module.exports = app;
