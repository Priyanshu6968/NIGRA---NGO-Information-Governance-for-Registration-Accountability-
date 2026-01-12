const express = require('express');
const { register, login, getMe, getAllUsers, exportUsers } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.get('/users/export', protect, authorize('ADMIN'), exportUsers);

module.exports = router;

