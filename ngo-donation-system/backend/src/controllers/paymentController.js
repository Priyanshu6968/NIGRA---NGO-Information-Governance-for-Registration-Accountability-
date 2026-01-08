const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Get Razorpay public key
// @route   GET /api/payments/key
// @access  Private (Donor Role)
exports.getKey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (Donor Role)
exports.createOrder = async (req, res) => {
    try {
        const { amount, ngoId } = req.body;

        // Validate amount
        if (!amount || amount < 1) {
            return res.status(400).json({
                success: false,
                error: 'Amount must be at least 1 INR'
            });
        }

        // Check if NGO exists and is verified
        const ngo = await NGO.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({ success: false, error: 'NGO not found' });
        }
        if (!ngo.isVerified) {
            return res.status(400).json({
                success: false,
                error: 'Cannot donate to an unverified NGO'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                ngoId: ngoId,
                donorId: req.user.id,
                ngoName: ngo.name
            }
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            ngo: {
                id: ngo._id,
                name: ngo.name
            }
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Verify payment and create donation record
// @route   POST /api/payments/verify
// @access  Private (Donor Role)
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            ngoId,
            amount
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            // Create failed donation record
            await Donation.create({
                donorId: req.user.id,
                ngoId: ngoId,
                amount: amount,
                razorpayOrderId: razorpay_order_id,
                paymentStatus: 'failed'
            });

            return res.status(400).json({
                success: false,
                error: 'Payment verification failed'
            });
        }

        // Create successful donation record
        const donation = await Donation.create({
            donorId: req.user.id,
            ngoId: ngoId,
            amount: amount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            paymentStatus: 'completed'
        });

        res.status(201).json({
            success: true,
            message: 'Payment verified successfully',
            data: donation
        });
    } catch (err) {
        console.error('Error verifying payment:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
