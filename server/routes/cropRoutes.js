
const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const { updateCrop,getAllCrops ,getCropById } = require("../controllers/cropController"); 
const protect = require("../middleware/auth"); // 🛡️ Auth middleware
const authorize = require("../middleware/roleMiddleware");


// Controller: Add crop
router.post("/", protect, async (req, res) => 
{
  try 
  {
    const { product, quantity, unit, state, location, phone, email } = req.body;

    if (!product || !quantity || !state || !location || !phone || !email) 
    {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCrop = new Crop({
      product,
      quantity,
      unit,
      state,
      location,
      phone,
      email,
      farmer: req.user._id,
    });

    await newCrop.save();
    res.status(201).json({ message: "Crop added successfully", crop: newCrop });

  } 
  catch (error) 
  {
    console.error("Error adding crop:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Controller: Get crops of logged-in farmer
router.get("/my", protect,authorize("farmer"), async (req, res) => 
{
  try 
  {
    const crops = await Crop.find({ farmer: req.user._id });
    res.json(crops);
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch crops" });
  }
});

// route for customers to fetch all crops
router.get("/", getAllCrops);


router.get("/:id", protect,authorize("customer", "farmer"), getCropById);

// Update Crop
router.put("/:id", protect, updateCrop);

// Delete crop
router.delete("/:id", protect, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting crop", error: err.message });
  }
});




module.exports = router;
  