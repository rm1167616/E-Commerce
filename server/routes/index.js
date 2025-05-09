const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");

// Use route modules
router.use("/auth", authRoutes);

// Add a test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;
