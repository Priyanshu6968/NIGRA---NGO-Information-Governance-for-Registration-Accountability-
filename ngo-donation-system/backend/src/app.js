const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files - frontend is sibling folder to backend
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;


