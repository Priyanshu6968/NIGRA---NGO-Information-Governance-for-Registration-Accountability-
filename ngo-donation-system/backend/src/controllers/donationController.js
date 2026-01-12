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

// @desc    Get admin dashboard stats
// @route   GET /api/donations/stats
// @access  Private (Admin Role)
exports.getAdminStats = async (req, res, next) => {
    try {
        const User = require('../models/User');

        // Get total registrations (all users)
        const totalUsers = await User.countDocuments();
        const donorCount = await User.countDocuments({ role: 'DONOR' });
        const ngoCount = await User.countDocuments({ role: 'NGO' });

        // Get donation stats
        const donations = await Donation.find();
        const totalDonations = donations.length;

        // Calculate amounts by status
        const completedDonations = donations.filter(d => d.paymentStatus === 'completed');
        const pendingDonations = donations.filter(d => d.paymentStatus === 'pending');
        const failedDonations = donations.filter(d => d.paymentStatus === 'failed');

        const totalAmountReceived = completedDonations.reduce((sum, d) => sum + d.amount, 0);
        const totalAmountPending = pendingDonations.reduce((sum, d) => sum + d.amount, 0);

        res.status(200).json({
            success: true,
            data: {
                registrations: {
                    total: totalUsers,
                    donors: donorCount,
                    ngos: ngoCount
                },
                donations: {
                    total: totalDonations,
                    completed: completedDonations.length,
                    pending: pendingDonations.length,
                    failed: failedDonations.length,
                    totalAmountReceived,
                    totalAmountPending
                }
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
