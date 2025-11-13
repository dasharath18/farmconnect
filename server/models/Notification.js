const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who triggered it
  type: { type: String, enum: ["wishlist_crop", "wishlist_request"], required: true },
  message: { type: String, required: true },
  metadata: { type: Object }, // any extra structured info (e.g., product, contact, location)
  createdAt: { type: Date, default: Date.now, index: true },
});

// TTL: documents will be removed ~24 hours after createdAt
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Notification", notificationSchema);
