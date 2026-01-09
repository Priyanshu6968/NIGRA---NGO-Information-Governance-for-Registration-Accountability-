/**
 * Admin Seeder Script
 * Run with: node src/seedAdmin.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo-donation-system', {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log('Connected to MongoDB!');

        // Update user role to ADMIN directly
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: 'admin@test.com' },
            { $set: { role: 'ADMIN' } }
        );

        if (result.matchedCount > 0) {
            console.log('✅ SUCCESS! User admin@test.com is now an ADMIN');
        } else {
            console.log('❌ User not found with email: admin@test.com');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

run();
