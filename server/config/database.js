const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "e-commerce",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "5"),
      min: parseInt(process.env.DB_POOL_MIN || "0"),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000"),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000"),
    },
    dialectOptions: {
      // For MySQL 8.0+ compatibility
      charset: "utf8mb4",
    },
    dialectModule: require("mysql2"),
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    return true;
  } catch (error) {
    if (error.original && error.original.code === 'ECONNREFUSED') {
      console.error("\n[ERROR] Unable to connect to the database: Connection refused.\n" +
        "Please check that your MySQL server is running, and that your DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD are correct in your .env file.\n" +
        "If using Docker, ensure the container is running and the port is exposed.\n");
    } else {
      console.error("Unable to connect to the database:", error);
    }
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return false;
  }
};

// Export the sequelize instance and the connection test function
module.exports = {
  sequelize,
  testConnection,
};



