const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  product: 
  {
    type: String,
    required: true,
  },
  quantity: 
  {
    type: Number,
    required: true,
  },
  unit: 
  {
    type: String,
    enum: ["kg", "quintal"],
    default: "kg",
  },
  state: 
  {
    type: String,
    required: true,
  },
  location: 
  {
    type: String,
    required: true,
  },
  phone: 
  {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  email: 
  {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Email must be valid"],
  },
  dateAdded: 
  {
    type: Date,
    default: Date.now,
  },
  farmer: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming 'User' model is used for both farmers/customers
    required: true,
  }
});

module.exports = mongoose.model("Crop", cropSchema);
