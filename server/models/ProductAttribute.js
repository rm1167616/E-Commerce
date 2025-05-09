const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductAttribute = sequelize.define(
  "ProductAttribute",
  {
    attribute_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "ProductAttributes",
    timestamps: false,
  }
);

module.exports = ProductAttribute;
