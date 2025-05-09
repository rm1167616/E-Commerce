const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const offerRoutes = require("./offerRoutes");
const reviewRoutes = require("./reviewRoutes");
const orderRoutes = require("./orderRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const cartRoutes = require("./cartRoutes");

// Use route modules
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/offers", offerRoutes);
router.use("/reviews", reviewRoutes);
router.use("/orders", orderRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/cart", cartRoutes);

// Add a test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;
