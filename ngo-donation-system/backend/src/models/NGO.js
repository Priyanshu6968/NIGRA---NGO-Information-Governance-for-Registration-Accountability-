const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an NGO name'],
        unique: true,
        trim: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please add a registration number'],
        unique: true
    },
    contactInfo: {
        type: String,
        required: [true, 'Please add contact information']
    },
    bankOrUPI: {
        type: String,
        required: [true, 'Please add bank or UPI details for donations']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NGO', ngoSchema);
