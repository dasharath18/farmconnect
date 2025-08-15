const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlistController");

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:id", protect, removeFromWishlist);

module.exports = router;
