// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

// Import Sequelize models and database connection
const { sequelize, syncDatabase } = require("./models/index");

// Import routes
const apiRoutes = require("./routes/index");

// Import Swagger configuration
const swaggerSpec = require("./config/swagger/swaggerConfig");

const app = express();
const PORT = 5222;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base route
app.get("/", (req, res) => {
  res.send("E-Commerce API is running. Visit /api-docs for documentation.");
});

// API Routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
(async () => {
  try {
    const dbSynced = await syncDatabase();

    if (!dbSynced) {
      console.error(
        "[Startup Warning] Failed to sync database. Server will start but may not function correctly.\nPlease check your database connection and configuration."
      );
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
