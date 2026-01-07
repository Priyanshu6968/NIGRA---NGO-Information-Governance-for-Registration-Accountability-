const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Fix for Windows DNS SRV lookup timeout - use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo-donation-system', {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 - fixes Windows DNS issues
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.warn('Backend is running without MongoDB. Database-dependent features will not work.');
    }
};

module.exports = connectDB;
