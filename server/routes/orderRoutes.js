const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getStoreOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
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
 *     summary: Create a new order
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
 *               - items
 *               - shipping_address
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               shipping_address:
 *                 type: string
 *               store_id:
 *                 type: integer
 *                 description: Optional. If not provided, will use the authenticated user's store
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store or product not found
 *       500:
 *         description: Server error
 */
router.post("/", isAuthenticated, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter orders by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", isAuthenticated, getUserOrders);

/**
 * @swagger
 * /api/orders/store:
 *   get:
 *     summary: Get store orders (store admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter orders by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of store orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Store admin access required
 *       500:
 *         description: Server error
 */
router.get("/store", isAuthenticated, isAdmin, getStoreOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (store admin only)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Store admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/:id/status", isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;
