
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cropRoutes = require("./routes/cropRoutes");
const requestRoutes = require("./routes/requestRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

require("dotenv").config();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Crop routes
app.use("/api/crops", cropRoutes);

// Wishlsit routes
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/requests", requestRoutes);

app.use("/api/notifications", notificationRoutes);


// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => 
  {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB connection error:", err));
