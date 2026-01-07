const express = require('express');
const {
    createDonation,
    getMyDonations,
    getNGODonations,
    getAllDonations
} = require('../controllers/donationController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('DONOR'), createDonation);
router.get('/my', protect, authorize('DONOR'), getMyDonations);
router.get('/ngo', protect, authorize('NGO'), getNGODonations);
router.get('/all', protect, authorize('ADMIN'), getAllDonations);

module.exports = router;
