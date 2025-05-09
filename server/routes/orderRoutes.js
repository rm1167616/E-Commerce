const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { body, param, query } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order from cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_id
 *               - shipping_address
 *               - payment_method
 *             properties:
 *               store_id:
 *                 type: integer
 *                 example: 1
 *               shipping_address:
 *                 type: string
 *                 example: "123 Main St, City, Country, 12345"
 *               payment_method:
 *                 type: string
 *                 example: "credit_card"
 *               shipping_cost:
 *                 type: number
 *                 format: float
 *                 example: 5.99
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     store_id:
 *                       type: integer
 *                       example: 2
 *                     total_amount:
 *                       type: number
 *                       format: float
 *                       example: 105.98
 *                     shipping_address:
 *                       type: string
 *                       example: "123 Main St, City, Country, 12345"
 *                     shipping_cost:
 *                       type: number
 *                       format: float
 *                       example: 5.99
 *                     payment_method:
 *                       type: string
 *                       example: "credit_card"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *                     OrderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           order_id:
 *                             type: integer
 *                             example: 1
 *                           product_id:
 *                             type: integer
 *                             example: 5
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 49.99
 *                           Product:
 *                             type: object
 *                             properties:
 *                               product_id:
 *                                 type: integer
 *                                 example: 5
 *                               name:
 *                                 type: string
 *                                 example: "Wireless Headphones"
 *                               price:
 *                                 type: number
 *                                 format: float
 *                                 example: 49.99
 *       400:
 *         description: Bad request (empty cart, insufficient stock)
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  isAuthenticated,
  [
    body("store_id").isInt().withMessage("Store ID must be an integer"),
    body("shipping_address")
      .notEmpty()
      .withMessage("Shipping address is required"),
    body("payment_method").notEmpty().withMessage("Payment method is required"),
    body("shipping_cost")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Shipping cost must be a positive number"),
  ],
  validate,
  orderController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [order_id, total_amount, created_at]
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 5
 *                     total_pages:
 *                       type: integer
 *                       example: 3
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     items_per_page:
 *                       type: integer
 *                       example: 2
 *                     has_next_page:
 *                       type: boolean
 *                       example: true
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/", isAuthenticated, orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  isAuthenticated,
  [param("id").isInt().withMessage("Order ID must be an integer")],
  validate,
  orderController.getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order cancelled successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cannot cancel order with current status
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/cancel",
  isAuthenticated,
  [param("id").isInt().withMessage("Order ID must be an integer")],
  validate,
  orderController.cancelOrder
);

module.exports = router;
