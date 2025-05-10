const { Cart, Product, Store } = require("../models");
const { Op } = require("sequelize");

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1, selected_attributes } = req.body;
    const user_id = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is in stock
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: {
        user_id,
        product_id,
        selected_attributes: selected_attributes
          ? JSON.stringify(selected_attributes)
          : null,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;

      // Check if new quantity exceeds stock
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more of this item (exceeds available stock)",
        });
      }

      await existingCartItem.update({ quantity: newQuantity });

      // Fetch updated cart item with product details
      const updatedCartItem = await Cart.findByPk(existingCartItem.cart_id, {
        include: [
          {
            model: Product,
            attributes: ["product_id", "name", "price", "stock_quantity"],
          },
          {
            model: Store,
            attributes: ["store_id", "name"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        data: updatedCartItem,
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({
      user_id,
      store_id: product.store_id,
      product_id,
      quantity,
      selected_attributes,
    });

    // Fetch cart item with product details
    const newCartItem = await Cart.findByPk(cartItem.cart_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price", "stock_quantity"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get user's cart items
 * @route   GET /api/cart
 * @access  Private
 */
const getCartItems = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { store_id } = req.query;

    // Build where conditions
    const whereConditions = { user_id };

    if (store_id) {
      whereConditions.store_id = store_id;
    }

    // Get cart items
    const cartItems = await Cart.findAll({
      where: whereConditions,
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price", "stock_quantity"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
      order: [["added_at", "DESC"]],
    });

    // Group items by store
    const storeGroups = {};
    let totalItems = 0;
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalItems += item.quantity;
      totalAmount += parseFloat(item.Product.price) * item.quantity;

      const storeId = item.store_id;
      if (!storeGroups[storeId]) {
        storeGroups[storeId] = {
          store_id: storeId,
          store_name: item.Store.name,
          items: [],
          store_total: 0,
        };
      }

      storeGroups[storeId].items.push(item);
      storeGroups[storeId].store_total +=
        parseFloat(item.Product.price) * item.quantity;
    });

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: {
        items: cartItems,
        stores: Object.values(storeGroups),
        summary: {
          total_items: totalItems,
          total_amount: totalAmount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart items",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    // Find cart item
    const cartItem = await Cart.findOne({
      where: {
        cart_id: id,
        user_id,
      },
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price", "stock_quantity"],
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Check if quantity is valid
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check if quantity exceeds stock
    if (quantity > cartItem.Product.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    // Update quantity
    await cartItem.update({ quantity });

    // Fetch updated cart item
    const updatedCartItem = await Cart.findByPk(cartItem.cart_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price", "stock_quantity"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: updatedCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find cart item
    const cartItem = await Cart.findOne({
      where: {
        cart_id: id,
        user_id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Delete cart item
    await cartItem.destroy();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
};
