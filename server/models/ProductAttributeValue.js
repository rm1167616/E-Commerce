const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductAttributeValue = sequelize.define(
  "ProductAttributeValue",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ProductAttributeValues",
    timestamps: false,
  }
);

module.exports = ProductAttributeValue;
