const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

// Public routes

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, price, seen_number, created_at]
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
 *         description: List of products in the category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/category/:categoryId", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: List of featured products
 *       500:
 *         description: Server error
 */
router.get("/featured", productController.getFeaturedProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, price, seen_number, created_at]
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
 *         description: Search results
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get("/search", productController.searchProducts);

// Admin routes

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (admin access)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: min_stock
 *         schema:
 *           type: integer
 *         description: Minimum stock filter
 *       - in: query
 *         name: max_stock
 *         schema:
 *           type: integer
 *         description: Maximum stock filter
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, price, stock_quantity, seen_number, created_at]
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
 *         description: List of products
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get(
  "/products",
  isAuthenticated,
  isAdmin,
  productController.getAllProducts
);

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - name
 *               - price
 *             properties:
 *               store_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               main_description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                     is_main:
 *                       type: boolean
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute_id:
 *                       type: integer
 *                     option_id:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Store or category not found
 *       500:
 *         description: Server error
 */
router.post(
  "/products",
  isAuthenticated,
  isAdmin,
  [
    body("store_id").isInt().withMessage("Store ID must be an integer"),
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock_quantity").optional().isInt({ min: 0 }).withMessage("Stock quantity must be a non-negative integer"),
    body("category_id").optional().isInt().withMessage("Category ID must be an integer"),
    body("main_description").optional(),
    body("images").optional().isArray(),
    body("attributes").optional().isArray(),
  ],
  validate,
  productController.createProduct
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               main_description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     path:
 *                       type: string
 *                     is_main:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute_id:
 *                       type: integer
 *                     option_id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Product, store, or category not found
 *       500:
 *         description: Server error
 */
router.put(
  "/products/:id",
  isAuthenticated,
  isAdmin,
  [
    body("store_id").optional().isInt().withMessage("Store ID must be an integer"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock_quantity").optional().isInt({ min: 0 }).withMessage("Stock quantity must be a non-negative integer"),
    body("category_id").optional().isInt().withMessage("Category ID must be an integer"),
    body("main_description").optional(),
    body("images").optional().isArray(),
    body("attributes").optional().isArray(),
  ],
  validate,
  productController.updateProduct
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/products/:id",
  isAuthenticated,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;
