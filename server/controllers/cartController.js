const { Cart, CartItem, Product, Store } = require("../models");
const { Op } = require("sequelize");

// Helper function to get store from auth user
const getStoreFromAuth = async (user_id) => {
  const store = await Store.findOne({
    where: { created_by: user_id }
  });

  if (!store) {
    throw new Error("Store not found for this user");
  }

  return store;
};

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    // Build where conditions
    const whereConditions = {
      user_id: req.user.user_id,
      store_id: store.store_id // Only get cart items for this store
    };

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Cart.count({ where: whereConditions });

    // Get cart items with pagination
    const cartItems = await Cart.findAll({
      where: whereConditions,
      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "price",
            "stock_quantity",
            "img_path",
          ],
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );

    res.status(200).json({
      success: true,
      count: cartItems.length,
      total_amount: totalAmount,
      data: cartItems,
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    // Check if product exists and belongs to the store
    const product = await Product.findOne({
      where: {
        product_id,
        store_id: store.store_id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this store",
      });
    }

    // Check if product is in stock
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // Get or create cart
    let [cart] = await Cart.findOrCreate({
      where: {
        user_id: req.user.user_id,
        store_id: store.store_id,
      },
    });

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;

      // Check if new quantity exceeds stock
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
        });
      }

      await existingItem.update({ quantity: newQuantity });
    } else {
      // Add new item to cart
      await CartItem.create({
        cart_id: cart.cart_id,
        product_id,
        quantity,
      });
    }

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: {
        cart_id: cart.cart_id,
      },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "name",
                "price",
                "stock_quantity",
                "img_path",
              ],
            },
          ],
        },
      ],
    });

    // Calculate total
    const total = updatedCart.CartItems.reduce((sum, item) => {
      return sum + item.quantity * item.Product.price;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        cart_id: updatedCart.cart_id,
        items: updatedCart.CartItems,
        total,
      },
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:id
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id: itemId,
      },
      include: [
        {
          model: Cart,
          where: {
            user_id: req.user.user_id,
          },
        },
        {
          model: Product,
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Check if new quantity exceeds stock
    if (cartItem.Product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // Update quantity
    await cartItem.update({ quantity });

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: {
        cart_id: cartItem.Cart.cart_id,
      },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "name",
                "price",
                "stock_quantity",
                "img_path",
              ],
            },
          ],
        },
      ],
    });

    // Calculate total
    const total = updatedCart.CartItems.reduce((sum, item) => {
      return sum + item.quantity * item.Product.price;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        cart_id: updatedCart.cart_id,
        items: updatedCart.CartItems,
        total,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:id
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id: itemId,
      },
      include: [
        {
          model: Cart,
          where: {
            user_id: req.user.user_id,
          },
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Delete item
    await cartItem.destroy();

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: {
        cart_id: cartItem.Cart.cart_id,
      },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "name",
                "price",
                "stock_quantity",
                "img_path",
              ],
            },
          ],
        },
      ],
    });

    // Calculate total
    const total = updatedCart.CartItems.reduce((sum, item) => {
      return sum + item.quantity * item.Product.price;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: {
        cart_id: updatedCart.cart_id,
        items: updatedCart.CartItems,
        total,
      },
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
