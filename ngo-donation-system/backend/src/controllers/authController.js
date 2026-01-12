const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private (Admin Role)
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search } = req.query;
        let query = {};

        // Filter by role if provided
        if (role && ['DONOR', 'NGO', 'ADMIN'].includes(role)) {
            query.role = role;
        }

        // Search by name or email if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Export users data as CSV (Admin only)
// @route   GET /api/auth/users/export
// @access  Private (Admin Role)
exports.exportUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        // Create CSV content
        const csvHeader = 'Name,Email,Role,Registration Date\n';
        const csvRows = users.map(user =>
            `"${user.name}","${user.email}","${user.role}","${new Date(user.createdAt).toISOString()}"`
        ).join('\n');

        const csvContent = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
        res.status(200).send(csvContent);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Make user admin (temporary - remove in production)
// @route   GET /api/auth/make-admin/:email
// @access  Public (REMOVE THIS IN PRODUCTION!)
exports.makeAdmin = async (req, res, next) => {
    try {
        const email = req.params.email;
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'ADMIN' },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: `User ${email} is now an ADMIN!`,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
