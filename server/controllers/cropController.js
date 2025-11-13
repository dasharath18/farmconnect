const Crop = require("../models/Crop");

// Create a new crop
const createCrop = async (req, res) => {
  try 
  {
    const { product, quantity, unit, state, location, phone, email } = req.body;

    if (!product || !quantity || !state || !location || !phone || !email) 
    {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCrop = new Crop(
    {
      product,
      quantity,
      unit,
      state,
      location,
      phone,
      email,
      farmer: req.user._id, // from auth middleware
    });

    await newCrop.save();
    res.status(201).json({ message: "Crop added successfully", crop: newCrop });
  } 
  catch (error) 
  {
    console.error("Error adding crop:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Update an existing crop
const updateCrop = async (req, res) => 
{
  try 
  {
    const { id } = req.params;
    const { product, quantity, unit, state, location, phone, email } = req.body;

    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      { product, quantity, unit, state, location, phone, email },
      { new: true }
    );

    if (!updatedCrop) 
    {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(updatedCrop);
  } 
  catch (err) 
  {
    res.status(500).json({ message: "Error updating crop", error: err.message });
  }
};

// Get all crops for customers
const getAllCrops = async (req, res) => 
{
  try 
  {
    const { product, state, location, minQuantity, maxQuantity, sort } = req.query;

    // Build query object dynamically
    let query = {};

    if (product) 
    {
      query.product = { $regex: product, $options: "i" }; // case-insensitive search
    }

    if (state) 
    {
      query.state = { $regex: state, $options: "i" };
    }

    if (location) 
    {
      query.location = { $regex: location, $options: "i" };
    }

    if (minQuantity || maxQuantity) 
    {
      query.quantity = {};
      if (minQuantity) query.quantity.$gte = Number(minQuantity);
      if (maxQuantity) query.quantity.$lte = Number(maxQuantity);
    }

    // Sort logic
    let sortOption = {};
    if (sort === "latest") 
    {
      sortOption.dateAdded = -1; // newest first
    } 
    else if (sort === "oldest") 
    {
      sortOption.dateAdded = 1;
    }

    const crops = await Crop.find(query)
      .populate("farmer", "name email phone")
      .sort(sortOption);

    res.status(200).json(crops);
  } 
  catch (err) 
  {
    res.status(500).json({ error: "Failed to fetch crops with filters." });
  }
};

const getCropById = async (req, res) => 
{
  try 
  {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    res.json(crop);
  } 
  catch (err) 
  {
    console.error("getCropById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Export functions using CommonJS
module.exports = 
{
  getAllCrops,
  createCrop,
  updateCrop,
  getCropById,
};
