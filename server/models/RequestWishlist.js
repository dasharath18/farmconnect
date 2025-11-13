const mongoose = require("mongoose");

const requestWishlistSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestWishlist", requestWishlistSchema);
