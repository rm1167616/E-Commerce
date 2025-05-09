const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { body, param } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               selected_attributes:
 *                 type: object
 *                 example: {"color": "Black", "size": "Medium"}
 *     responses:
 *       201:
 *         description: Item added to cart
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
 *                   example: "Item added to cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     store_id:
 *                       type: integer
 *                       example: 2
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     selected_attributes:
 *                       type: object
 *                       example: {"color": "Black", "size": "Medium"}
 *                     added_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *                     Product:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: integer
 *                           example: 5
 *                         name:
 *                           type: string
 *                           example: "Wireless Headphones"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 49.99
 *                         stock_quantity:
 *                           type: integer
 *                           example: 50
 *                     Store:
 *                       type: object
 *                       properties:
 *                         store_id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Tech Store"
 *       200:
 *         description: Cart item quantity updated
 *       400:
 *         description: Invalid input or not enough stock
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  isAuthenticated,
  [
    body("product_id").isInt().withMessage("Product ID must be an integer"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("selected_attributes").optional(),
  ],
  validate,
  cartController.addToCart
);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *     responses:
 *       200:
 *         description: User's cart items
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
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           cart_id:
 *                             type: integer
 *                             example: 1
 *                           user_id:
 *                             type: integer
 *                             example: 3
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           product_id:
 *                             type: integer
 *                             example: 5
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           selected_attributes:
 *                             type: object
 *                             example: {"color": "Black", "size": "Medium"}
 *                           added_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-06-15T14:30:00Z"
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
 *                               stock_quantity:
 *                                 type: integer
 *                                 example: 50
 *                           Store:
 *                             type: object
 *                             properties:
 *                               store_id:
 *                                 type: integer
 *                                 example: 2
 *                               name:
 *                                 type: string
 *                                 example: "Tech Store"
 *                     stores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           store_name:
 *                             type: string
 *                             example: "Tech Store"
 *                           items:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/CartItem'
 *                           store_total:
 *                             type: number
 *                             format: float
 *                             example: 99.98
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_items:
 *                           type: integer
 *                           example: 3
 *                         total_amount:
 *                           type: number
 *                           format: float
 *                           example: 149.97
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/", isAuthenticated, cartController.getCartItems);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
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
 *                   example: "Cart item updated"
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid quantity or exceeds stock
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  isAuthenticated,
  [
    param("id").isInt().withMessage("Cart item ID must be an integer"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  validate,
  cartController.updateCartItem
);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart
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
 *                   example: "Item removed from cart"
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  isAuthenticated,
  [param("id").isInt().withMessage("Cart item ID must be an integer")],
  validate,
  cartController.removeCartItem
);

module.exports = router;
