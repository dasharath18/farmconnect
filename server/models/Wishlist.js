const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
{
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
