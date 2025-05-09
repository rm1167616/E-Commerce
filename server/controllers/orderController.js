const {
  Order,
  OrderItem,
  User,
  Store,
  Product,
  Cart,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * @desc    Create a new order from cart items
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      store_id,
      shipping_address,
      payment_method,
      shipping_cost = 0,
    } = req.body;

    const user_id = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Get cart items for this user and store
    const cartItems = await Cart.findAll({
      where: {
        user_id,
        store_id,
      },
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price", "stock_quantity"],
        },
      ],
      transaction,
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "No items in cart for this store",
      });
    }

    // Calculate total amount
    let total_amount = parseFloat(shipping_cost);

    // Check stock availability and calculate total
    for (const item of cartItems) {
      if (item.quantity > item.Product.stock_quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.Product.name}`,
        });
      }

      total_amount += parseFloat(item.Product.price) * item.quantity;
    }

    // Create order
    const order = await Order.create(
      {
        user_id,
        store_id,
        total_amount,
        shipping_address,
        shipping_cost,
        payment_method,
        status: "pending",
      },
      { transaction }
    );

    // Create order items
    const orderItems = [];
    for (const item of cartItems) {
      const orderItem = await OrderItem.create(
        {
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.Product.price,
          selected_attributes: item.selected_attributes,
        },
        { transaction }
      );

      orderItems.push(orderItem);

      // Update product stock
      await Product.decrement("stock_quantity", {
        by: item.quantity,
        where: { product_id: item.product_id },
        transaction,
      });
    }

    // Remove items from cart
    await Cart.destroy({
      where: {
        user_id,
        store_id,
      },
      transaction,
    });

    await transaction.commit();

    // Fetch the complete order with items
    const completeOrder = await Order.findByPk(order.order_id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: User,
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all orders for the authenticated user
 * @route   GET /api/orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      status,
      store_id,
      sort_by = "created_at",
      sort_order = "DESC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate sort parameters
    const validSortFields = ["order_id", "total_amount", "created_at"];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "DESC";

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereConditions = { user_id };

    if (status) {
      whereConditions.status = status;
    }

    if (store_id) {
      whereConditions.store_id = store_id;
    }

    // Get total count for pagination
    const totalCount = await Order.count({ where: whereConditions });

    // Get orders
    const orders = await Order.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const order = await Order.findOne({
      where: {
        order_id: id,
        user_id,
      },
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find the order
    const order = await Order.findOne({
      where: {
        order_id: id,
        user_id,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "paid", "processing"].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Update order status
    await order.update({ status: "cancelled" }, { transaction });

    // Restore product stock
    for (const item of order.OrderItems) {
      await Product.increment("stock_quantity", {
        by: item.quantity,
        where: { product_id: item.product_id },
        transaction,
      });
    }

    await transaction.commit();

    // Fetch the updated order
    const updatedOrder = await Order.findByPk(order.order_id, {
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: updatedOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/admin/orders
 * @access  Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const {
      user_id,
      store_id,
      status,
      min_amount,
      max_amount,
      start_date,
      end_date,
      sort_by = "created_at",
      sort_order = "DESC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate sort parameters
    const validSortFields = [
      "order_id",
      "total_amount",
      "created_at",
      "status",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "DESC";

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereConditions = {};

    if (user_id) {
      whereConditions.user_id = user_id;
    }

    if (store_id) {
      whereConditions.store_id = store_id;
    }

    if (status) {
      whereConditions.status = status;
    }

    if (min_amount) {
      whereConditions.total_amount = {
        ...whereConditions.total_amount,
        [Op.gte]: parseFloat(min_amount),
      };
    }

    if (max_amount) {
      whereConditions.total_amount = {
        ...whereConditions.total_amount,
        [Op.lte]: parseFloat(max_amount),
      };
    }

    if (start_date) {
      whereConditions.created_at = {
        ...whereConditions.created_at,
        [Op.gte]: new Date(start_date),
      };
    }

    if (end_date) {
      whereConditions.created_at = {
        ...whereConditions.created_at,
        [Op.lte]: new Date(end_date),
      };
    }

    // Get total count for pagination
    const totalCount = await Order.count({ where: whereConditions });

    // Get orders
    const orders = await Order.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find the order
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    await order.update({ status });

    // Fetch the updated order
    const updatedOrder = await Order.findByPk(order.order_id, {
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
