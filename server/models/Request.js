const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  state: { type: String },
  location: { type: String },
  phone: { type: String }, 
  email: { type: String }, 
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
