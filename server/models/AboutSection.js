const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AboutSection = sequelize.define(
  "AboutSection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    about_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AboutPages",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "AboutSections",
    timestamps: true,
  }
);

module.exports = AboutSection;
