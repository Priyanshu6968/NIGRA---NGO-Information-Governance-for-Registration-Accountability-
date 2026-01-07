const NGO = require('../models/NGO');

// @desc    Register NGO details
// @route   POST /api/ngos/register
// @access  Private (NGO Role)
exports.registerNGO = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;

        // Check if user already has an NGO registered
        const existingNGO = await NGO.findOne({ userId: req.user.id });
        if (existingNGO) {
            return res.status(400).json({ success: false, error: 'User already has an NGO registered' });
        }

        const ngo = await NGO.create(req.body);

        res.status(201).json({
            success: true,
            data: ngo
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get current NGO profile
// @route   GET /api/ngos/me
// @access  Private (NGO Role)
exports.getMyNGO = async (req, res, next) => {
    try {
        const ngo = await NGO.findOne({ userId: req.user.id });

        if (!ngo) {
            return res.status(404).json({ success: false, error: 'NGO profile not found' });
        }

        res.status(200).json({
            success: true,
            data: ngo
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Verify NGO (Admin only)
// @route   PUT /api/ngos/verify/:id
// @access  Private (Admin Role)
exports.verifyNGO = async (req, res, next) => {
    try {
        let ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({ success: false, error: 'NGO not found' });
        }

        ngo = await NGO.findByIdAndUpdate(req.params.id, { isVerified: true }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: ngo
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all verified NGOs (For Donors)
// @route   GET /api/ngos
// @access  Public/Private
exports.getVerifiedNGOs = async (req, res, next) => {
    try {
        const ngos = await NGO.find({ isVerified: true });

        res.status(200).json({
            success: true,
            count: ngos.length,
            data: ngos
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
// @desc    Get all NGOs (Admin only)
// @route   GET /api/ngos/all
// @access  Private (Admin Role)
exports.getAllNGOs = async (req, res, next) => {
    try {
        const ngos = await NGO.find().populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: ngos.length,
            data: ngos
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
