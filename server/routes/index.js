const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const offerRoutes = require("./offerRoutes");
const reviewRoutes = require("./reviewRoutes");

// Use route modules
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/offers", offerRoutes);
router.use("/reviews", reviewRoutes);

// Add a test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;
