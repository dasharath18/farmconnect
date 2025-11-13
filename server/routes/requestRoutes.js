// server/routes/requestRoutes.js
const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/roleMiddleware');

const {
  createRequest,
  getRequests,
  getRequestById,
  wishlistRequest,
  updateRequest,
  deleteRequest,
  getFarmerWishlist 
} = require('../controllers/requestController');

// customer creates a request
router.post('/', authenticateToken, authorize('customer'), createRequest);

// browse requests (authenticated users)
router.get('/', authenticateToken, getRequests);

// single request
router.get('/:id', authenticateToken, getRequestById);

// edit request (only owner customer)
router.put('/:id', authenticateToken, authorize('customer'), updateRequest);

// delete request (only owner customer)
router.delete('/:id', authenticateToken, authorize('customer'), deleteRequest);

// farmer adds a customer request to wishlist
router.post('/:id/wishlist', authenticateToken, authorize('farmer'), wishlistRequest);

router.get('/wishlist/farmer', authenticateToken, authorize('farmer'), getFarmerWishlist);

module.exports = router;
