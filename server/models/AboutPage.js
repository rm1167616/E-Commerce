const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AboutPage = sequelize.define(
  "AboutPage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stores",
        key: "store_id", // Fixed: should match the PK in Store.js
      },
    },
  },
  {
    tableName: "AboutPages",
    timestamps: true,
  }
);

module.exports = AboutPage;