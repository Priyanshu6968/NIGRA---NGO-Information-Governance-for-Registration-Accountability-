const express = require('express');
const {
    registerNGO,
    getMyNGO,
    verifyNGO,
    getVerifiedNGOs
} = require('../controllers/ngoController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getVerifiedNGOs);
router.get('/all', protect, authorize('ADMIN'), require('../controllers/ngoController').getAllNGOs);
router.post('/register', protect, authorize('NGO'), registerNGO);
router.get('/me', protect, authorize('NGO'), getMyNGO);
router.put('/verify/:id', protect, authorize('ADMIN'), verifyNGO);

module.exports = router;
