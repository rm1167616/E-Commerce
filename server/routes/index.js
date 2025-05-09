const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");

// Use route modules
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);

// Add a test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;
