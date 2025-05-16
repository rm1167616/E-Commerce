const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PageSettings = sequelize.define(
  "PageSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stores",
        key: "store_id",
      },
    },
    backgroundColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#FFFFFF",
      validate: {
        isHexColor: true,
      },
    },
    primaryTextColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#000000",
      validate: {
        isHexColor: true,
      },
    },
    secondaryTextColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#666666",
      validate: {
        isHexColor: true,
      },
    },
    linkColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#0066CC",
      validate: {
        isHexColor: true,
      },
    },
    linkHoverColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#003366",
      validate: {
        isHexColor: true,
      },
    },
    headingFont: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Arial",
    },
    headingSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24,
      validate: {
        min: 8,
        max: 72,
      },
    },
    pagePadding: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "20px",
      validate: {
        is: /^[0-9]+(px|rem|em|%)$/i,
      },
    },
    paragraphFont: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Arial",
    },
    paragraphSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 16,
      validate: {
        min: 8,
        max: 72,
      },
    },
    contentMaxWidth: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "1200px",
      validate: {
        is: /^[0-9]+(px|rem|em|%)$/i,
      },
    },
  },
  {
    tableName: "PageSettings",
    timestamps: false,
  }
);

module.exports = PageSettings;
