// server/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleMiddleware');
const {
  createRequest,
  getRequests,
  getRequestById,
  wishlistRequest,
} = require('../controllers/requestController');

// customer creates a request
router.post('/', authenticate, authorize(['customer']), createRequest);

// browse requests (public to authenticated users)
router.get('/', authenticate, getRequests);

// single request
router.get('/:id', authenticate, getRequestById);

// farmer adds a customer request to wishlist
router.post('/:id/wishlist', authenticate, authorize(['farmer']), wishlistRequest);

module.exports = router;
