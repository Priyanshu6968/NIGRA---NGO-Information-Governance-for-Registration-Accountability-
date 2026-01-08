const express = require('express');
const {
    getKey,
    createOrder,
    verifyPayment
} = require('../controllers/paymentController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All payment routes require DONOR role
router.get('/key', protect, authorize('DONOR'), getKey);
router.post('/create-order', protect, authorize('DONOR'), createOrder);
router.post('/verify', protect, authorize('DONOR'), verifyPayment);

module.exports = router;
