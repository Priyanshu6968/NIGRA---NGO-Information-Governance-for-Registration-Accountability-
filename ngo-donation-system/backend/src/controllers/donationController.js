const Donation = require('../models/Donation');
const NGO = require('../models/NGO');

// @desc    Create a donation
// @route   POST /api/donations
// @access  Private (Donor Role)
exports.createDonation = async (req, res, next) => {
    try {
        req.body.donorId = req.user.id;

        // Check if NGO exists and is verified
        const ngo = await NGO.findById(req.body.ngoId);
        if (!ngo) {
            return res.status(404).json({ success: false, error: 'NGO not found' });
        }
        if (!ngo.isVerified) {
            return res.status(400).json({ success: false, error: 'Cannot donate to an unverified NGO' });
        }

        const donation = await Donation.create(req.body);

        res.status(201).json({
            success: true,
            data: donation
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get my donations (Donor)
// @route   GET /api/donations/my
// @access  Private (Donor Role)
exports.getMyDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donorId: req.user.id }).populate('ngoId', 'name');

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get donations for an NGO (NGO Owner)
// @route   GET /api/donations/ngo
// @access  Private (NGO Role)
exports.getNGODonations = async (req, res, next) => {
    try {
        const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) {
            return res.status(404).json({ success: false, error: 'NGO profile not found' });
        }

        const donations = await Donation.find({ ngoId: ngo._id }).populate('donorId', 'name email');

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations/all
// @access  Private (Admin Role)
exports.getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find().populate('donorId', 'name email').populate('ngoId', 'name');

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
