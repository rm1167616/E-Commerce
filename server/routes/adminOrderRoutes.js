const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { body, param, query } = require("express-validator");

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: min_amount
 *         schema:
 *           type: number
 *         description: Minimum total amount
 *       - in: query
 *         name: max_amount
 *         schema:
 *           type: number
 *         description: Maximum total amount
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [order_id, total_amount, created_at, status]
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
 *         description: List of all orders
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderWithUser'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 25
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     items_per_page:
 *                       type: integer
 *                       example: 5
 *                     has_next_page:
 *                       type: boolean
 *                       example: true
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/", isAuthenticated, isAdmin, orderController.getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin)
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
 *                 enum: [pending, paid, processing, shipped, delivered, cancelled]
 *                 example: "processing"
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: "Order status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/OrderWithUser'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/status",
  isAuthenticated,
  isAdmin,
  [
    param("id").isInt().withMessage("Order ID must be an integer"),
    body("status")
      .isIn([
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .withMessage("Invalid status"),
  ],
  validate,
  orderController.updateOrderStatus
);

module.exports = router;
