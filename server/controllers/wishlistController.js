const Wishlist = require("../models/Wishlist");
const Crop = require("../models/Crop");
const Notification = require("../models/Notification");

// Add item to wishlist
// const addToWishlist = async (req, res) => 
// {
//   try 
//   {
//     const customerId = req.user._id;
//     const { cropId } = req.body;
//     if (!cropId) return res.status(400).json({ message: "cropId required" });

//     // optional: ensure crop exists
//     const crop = await Crop.findById(cropId);
//     if (!crop) return res.status(404).json({ message: "Crop not found" });

//     // prevent duplicates
//     const exists = await Wishlist.findOne({ customer: customerId, crop: cropId });
//     if (exists) return res.status(400).json({ message: "Already in wishlist" });

//     const item = await Wishlist.create({ customer: customerId, crop: cropId });
//     const populated = await item.populate({ path: "crop", populate: { path: "farmer", select: "name phone email" }});
//     res.status(201).json(populated);
//   } 
//   catch (err) 
//   {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const addToWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { cropId } = req.body;
    if (!cropId) return res.status(400).json({ message: "cropId required" });

    const crop = await Crop.findById(cropId).populate("farmer");
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // prevent duplicates
    const existing = await Wishlist.findOne({ customer: customerId, crop: cropId });
    if (existing) return res.status(400).json({ message: "Already in wishlist" });

    const item = new Wishlist({ customer: customerId, crop: cropId });
    await item.save();

    // Notify the farmer that a customer wishlisted their crop
    if (crop.farmer) {
      const notifMsg = `${req.user.name} has wishlisted your crop ${crop.product}. Contact: ${req.user.phone || "N/A"}`;
      const notification = new Notification({
        recipient: crop.farmer._id,
        fromUser: req.user._id,
        type: "wishlist_crop",
        message: notifMsg,
        metadata: {
          product: crop.product,
          quantity: crop.quantity,
          customerName: req.user.name,
          customerPhone: req.user.phone || null,
          customerLocation: req.user.location || null,
        },
      });
      await notification.save();
    }

    res.status(201).json({ message: "Added to wishlist", id: item._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all wishlist items for current user
const getWishlist = async (req, res) => 
{
  try 
  {
    const customerId = req.user._id;
    const items = await Wishlist.find({ customer: customerId })
      .populate({
        path: "crop",
        populate: { path: "farmer", select: "name phone email" }
      })
      .sort({ createdAt: -1 });

    res.json(items);
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from wishlist by wishlist id (or accept cropId path)
const removeFromWishlist = async (req, res) => 
{
  try 
  {
    const customerId = req.user._id;
    const id = req.params.id; // wishlist id OR if you want crop id, modify accordingly

    const item = await Wishlist.findOneAndDelete({ _id: id, customer: customerId });
    if (!item) return res.status(404).json({ message: "Not found or not authorized" });
    res.json({ message: "Removed from wishlist", id: item._id });
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
