const { sequelize, testConnection } = require("../config/database");

// Import models
const User = require("./User");
const AdminData = require("./AdminData");
const Store = require("./Store");
const Category = require("./Category");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const ProductAttribute = require("./ProductAttribute");
const AttributeOption = require("./AttributeOption");
const ProductAttributeValue = require("./ProductAttributeValue");
const Offer = require("./Offer");
const ProductOffer = require("./ProductOffer");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Cart = require("./Cart");
const UserStore = require("./UserStore");
const UserProduct = require("./UserProduct");
const Review = require("./Review");
const OTP = require("./OTP");
const About = require("./About");
const AboutSection = require("./AboutSection");
const PageSettings = require("./PageSettings");
const AboutPage = require("./AboutPage");

// Define associations

// User associations
User.hasOne(AdminData, { foreignKey: "admin_id", onDelete: "CASCADE" });
User.hasMany(Store, { foreignKey: "created_by" });
User.hasMany(Product, { foreignKey: "created_by" });
User.hasMany(Order, { foreignKey: "user_id" });
User.hasMany(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(UserStore, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(UserProduct, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Review, { foreignKey: "user_id" });

// AdminData associations
AdminData.belongsTo(User, { foreignKey: "admin_id", onDelete: "CASCADE" });
AdminData.belongsTo(User, { foreignKey: "created_by", as: "Creator" });

// Store associations
Store.belongsTo(User, { foreignKey: "created_by" });
Store.hasMany(Category, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(Product, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(ProductAttribute, {
  foreignKey: "store_id",
  onDelete: "CASCADE",
});
Store.hasMany(Offer, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(Order, { foreignKey: "store_id" });
Store.hasMany(Cart, { foreignKey: "store_id" });
Store.hasMany(UserStore, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasOne(About, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasOne(AboutPage, {
  foreignKey: "store_id",
});

// About associations
About.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
About.hasMany(AboutSection, { foreignKey: "about_id", onDelete: "CASCADE" });

// AboutSection associations
AboutSection.belongsTo(About, { foreignKey: "about_id", onDelete: "CASCADE" });

// Category associations
Category.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
Category.hasMany(Product, { foreignKey: "category_id", onDelete: "SET NULL" });

// Product associations
Product.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
Product.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
});
Product.belongsTo(User, { foreignKey: "created_by" });
Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Product.hasMany(ProductAttributeValue, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Product.hasMany(ProductOffer, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Product.hasMany(OrderItem, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });
Product.hasMany(UserProduct, { foreignKey: "product_id", onDelete: "CASCADE" });
Product.hasMany(Review, { foreignKey: "product_id", onDelete: "CASCADE" });

// ProductImage associations
ProductImage.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

// ProductAttribute associations
ProductAttribute.belongsTo(Store, {
  foreignKey: "store_id",
  onDelete: "CASCADE",
});
ProductAttribute.hasMany(AttributeOption, {
  foreignKey: "attribute_id",
  onDelete: "CASCADE",
});
ProductAttribute.hasMany(ProductAttributeValue, {
  foreignKey: "attribute_id",
  onDelete: "CASCADE",
});

// AttributeOption associations
AttributeOption.belongsTo(ProductAttribute, {
  foreignKey: "attribute_id",
  onDelete: "CASCADE",
});
AttributeOption.hasMany(ProductAttributeValue, {
  foreignKey: "option_id",
  onDelete: "CASCADE",
});

// ProductAttributeValue associations
ProductAttributeValue.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
ProductAttributeValue.belongsTo(ProductAttribute, {
  foreignKey: "attribute_id",
  onDelete: "CASCADE",
});
ProductAttributeValue.belongsTo(AttributeOption, {
  foreignKey: "option_id",
  onDelete: "CASCADE",
});

// Offer associations
Offer.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
Offer.hasMany(ProductOffer, { foreignKey: "offer_id", onDelete: "CASCADE" });

// ProductOffer associations
ProductOffer.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
ProductOffer.belongsTo(Offer, { foreignKey: "offer_id", onDelete: "CASCADE" });

// Order associations
Order.belongsTo(Store, { foreignKey: "store_id" });
Order.belongsTo(User, { foreignKey: "user_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

// Cart associations
Cart.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(Store, { foreignKey: "store_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

// UserStore associations
UserStore.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
UserStore.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });

// UserProduct associations
UserProduct.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
UserProduct.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

// Review associations
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });

// AboutPage associations
AboutPage.hasMany(AboutSection, {
  foreignKey: "about_id",
  as: "AboutSections",
});

AboutSection.belongsTo(AboutPage, {
  foreignKey: "about_id",
});

// Sync all models with the database
// Note: In production, you might want to use migrations instead
const syncDatabase = async () => {
  try {
    // First test the connection
    const connectionSuccessful = await testConnection();

    if (!connectionSuccessful) {
      throw new Error("Database connection failed");
    }

    // Set { alter: true } to update tables if they exist
    // Use { force: true } to drop and recreate tables (CAUTION: this will delete all data)
    const syncOptions = {
      alter: process.env.DB_ALTER === "true",
      force: process.env.DB_FORCE === "true",
    };

    await sequelize.sync(syncOptions);
    console.log("Database synchronized successfully");
    return true;
  } catch (error) {
    console.error("Error synchronizing database:", error);
    return false;
  }
};

// Export models and sequelize instance
module.exports = {
  sequelize,
  syncDatabase,
  User,
  AdminData,
  Store,
  Category,
  Product,
  ProductImage,
  ProductAttribute,
  AttributeOption,
  ProductAttributeValue,
  Offer,
  ProductOffer,
  Order,
  OrderItem,
  Cart,
  UserStore,
  UserProduct,
  Review,
  OTP,
  About,
  AboutSection,
  PageSettings,
  AboutPage,
};
