// server/controllers/requestController.js
const Request = require('../models/Request');
const RequestWishlist = require('../models/RequestWishlist');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.createRequest = async (req, res) => {
  try {
    const { product, quantity, unit, state, location, phone, email } = req.body;
    if (!product || !quantity) {
      return res.status(400).json({ message: 'product and quantity are required' });
    }

    const reqDoc = new Request({
      product,
      quantity,
      unit: unit || 'kg',
      state,
      location,
      phone,
      email,
      customer: req.user && req.user._id,
    });

    await reqDoc.save();
    return res.status(201).json(reqDoc);
  } catch (err) {
    console.error('createRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const q = {};
    if (req.query.product) q.product = { $regex: new RegExp(req.query.product, 'i') };
    if (req.query.state) q.state = req.query.state;

    if (req.query.mine === 'true') {
      if (!req.user) return res.status(401).json({ message: 'Authentication required for mine=true' });
      q.customer = req.user._id;
    }

    const requests = await Request.find(q)
      .populate('customer', 'name phone email')
      .sort({ dateAdded: -1 });

    return res.json(requests);
  } catch (err) {
    console.error('getRequests error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const request = await Request.findById(id).populate('customer', 'name phone email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    return res.json(request);
  } catch (err) {
    console.error('getRequestById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.wishlistRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const farmerId = req.user && req.user._id;

    const requestDoc = await Request.findById(requestId).populate('customer', 'name email phone');
    if (!requestDoc) return res.status(404).json({ message: 'Request not found' });

    const exists = await RequestWishlist.findOne({ farmer: farmerId, request: requestId });
    if (exists) {
      return res.status(200).json({ message: 'Already in wishlist', wishlistId: exists._id });
    }

    const wishlist = new RequestWishlist({
      farmer: farmerId,
      request: requestId,
    });
    await wishlist.save();

    // create notification for the customer (non-blocking)
    try {
      const notification = new Notification({
        recipient: requestDoc.customer._id,
        fromUser: farmerId,
        type: 'wishlist_request',
        message: `${(req.user && req.user.name) || 'A farmer'} added your request for ${requestDoc.product} to their wishlist.`,
        metadata: {
          requestId: requestDoc._id.toString(),
          product: requestDoc.product,
          quantity: requestDoc.quantity,
        },
      });
      await notification.save();
    } catch (nerr) {
      console.error('notification save error:', nerr);
    }

    return res.status(201).json({ message: 'Wishlisted request', wishlistId: wishlist._id });
  } catch (err) {
    console.error('wishlistRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ----------------- NEW: update & delete ----------------- */

exports.updateRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Only owner can update
    if (!req.user || request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Update allowed fields only
    const allowed = ['product', 'quantity', 'unit', 'state', 'location', 'phone', 'email'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) request[f] = req.body[f];
    });

    await request.save();

    // notify interested farmers? For simplicity notify owner only as confirmation
    try {
      const notification = new Notification({
        recipient: request.customer,
        fromUser: req.user._id,
        type: 'request_updated',
        message: `Your request for ${request.product} was updated.`,
        metadata: { requestId: request._id.toString() },
      });
      await notification.save();
    } catch (nerr) {
      console.error('notification save error (update):', nerr);
    }

    return res.json(request);
  } catch (err) {
    console.error('updateRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (!req.user || request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Request.findByIdAndDelete(id);

    // create notification for the owner (confirmation)
    try {
      const notification = new Notification({
        recipient: request.customer,
        fromUser: req.user._id,
        type: 'request_deleted',
        message: `Your request for ${request.product} was deleted.`,
        metadata: { requestId: request._id.toString() },
      });
      await notification.save();
    } catch (nerr) {
      console.error('notification save error (delete):', nerr);
    }

    return res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error('deleteRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// NEW: get all requests wishlisted by the current farmer
exports.getFarmerWishlist = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // find all wishlist entries by this farmer
    const wishlisted = await RequestWishlist.find({ farmer: farmerId })
      .populate("request") // gets the actual customer request object
      .populate("farmer", "name email");

    // extract only the request objects
    const requests = wishlisted
      .map(w => w.request)
      .filter(r => r !== null); // in case a request was deleted

    return res.json(requests);
  } catch (err) {
    console.error("getFarmerWishlist error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
