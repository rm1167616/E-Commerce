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
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 1
 *                       store_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Wireless Headphones"
 *                       main_description:
 *                         type: string
 *                         example: "High-quality wireless headphones with noise cancellation"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 99.99
 *                       stock_quantity:
 *                         type: integer
 *                         example: 50
 *                       seen_number:
 *                         type: integer
 *                         example: 120
 *                       category_id:
 *                         type: integer
 *                         example: 5
 *                       created_by:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-20T10:30:00Z"
 *                       Category:
 *                         type: object
 *                         properties:
 *                           category_id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "Electronics"
 *                       Store:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Tech Store"
 *                       ProductImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             img_path:
 *                               type: string
 *                               example: "/images/products/headphones.jpg"
 *                             is_main:
 *                               type: boolean
 *                               example: true
 *                       ProductOffers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 3
 *                             Offer:
 *                               type: object
 *                               properties:
 *                                 offer_id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: "Summer Sale"
 *                                 discount_percentage:
 *                                   type: number
 *                                   format: float
 *                                   example: 15.00
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
 *                       example: 10
 *                     has_next_page:
 *                       type: boolean
 *                       example: true
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
 *                 filters:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     min_price:
 *                       type: number
 *                       nullable: true
 *                       example: null
 *                     max_price:
 *                       type: number
 *                       nullable: true
 *                       example: null
 *                 sorting:
 *                   type: object
 *                   properties:
 *                     sort_by:
 *                       type: string
 *                       example: "name"
 *                     sort_order:
 *                       type: string
 *                       example: "ASC"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to get products by category"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/category/:categoryId", productController.getProductsByCategory);

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
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 1
 *                       store_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Wireless Headphones"
 *                       main_description:
 *                         type: string
 *                         example: "High-quality wireless headphones with noise cancellation"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 99.99
 *                       stock_quantity:
 *                         type: integer
 *                         example: 50
 *                       seen_number:
 *                         type: integer
 *                         example: 250
 *                       category_id:
 *                         type: integer
 *                         example: 5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-20T10:30:00Z"
 *                       Category:
 *                         type: object
 *                         properties:
 *                           category_id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "Electronics"
 *                       Store:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Tech Store"
 *                       ProductImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             img_path:
 *                               type: string
 *                               example: "/images/products/headphones.jpg"
 *                             is_main:
 *                               type: boolean
 *                               example: true
 *                       ProductOffers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 3
 *                             Offer:
 *                               type: object
 *                               properties:
 *                                 offer_id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: "Summer Sale"
 *                                 discount_percentage:
 *                                   type: number
 *                                   format: float
 *                                   example: 15.00
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to get featured products"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 1
 *                       store_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Wireless Headphones"
 *                       main_description:
 *                         type: string
 *                         example: "High-quality wireless headphones with noise cancellation"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 99.99
 *                       stock_quantity:
 *                         type: integer
 *                         example: 50
 *                       seen_number:
 *                         type: integer
 *                         example: 120
 *                       category_id:
 *                         type: integer
 *                         example: 5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-20T10:30:00Z"
 *                       Category:
 *                         type: object
 *                         properties:
 *                           category_id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "Electronics"
 *                       Store:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Tech Store"
 *                       ProductImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             img_path:
 *                               type: string
 *                               example: "/images/products/headphones.jpg"
 *                             is_main:
 *                               type: boolean
 *                               example: true
 *                       ProductOffers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 3
 *                             Offer:
 *                               type: object
 *                               properties:
 *                                 offer_id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: "Summer Sale"
 *                                 discount_percentage:
 *                                   type: number
 *                                   format: float
 *                                   example: 15.00
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 15
 *                     total_pages:
 *                       type: integer
 *                       example: 2
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     items_per_page:
 *                       type: integer
 *                       example: 10
 *                     has_next_page:
 *                       type: boolean
 *                       example: true
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
 *                 filters:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                       example: "headphones"
 *                     category_id:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     min_price:
 *                       type: number
 *                       nullable: true
 *                       example: null
 *                     max_price:
 *                       type: number
 *                       nullable: true
 *                       example: null
 *                 sorting:
 *                   type: object
 *                   properties:
 *                     sort_by:
 *                       type: string
 *                       example: "name"
 *                     sort_order:
 *                       type: string
 *                       example: "ASC"
 *       400:
 *         description: Search query is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Search query is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to search products"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/search", productController.searchProducts);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     store_id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Wireless Headphones"
 *                     main_description:
 *                       type: string
 *                       example: "High-quality wireless headphones with noise cancellation. Experience crystal clear sound with deep bass and comfortable ear cups for extended listening sessions."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 99.99
 *                     stock_quantity:
 *                       type: integer
 *                       example: 50
 *                     seen_number:
 *                       type: integer
 *                       example: 121
 *                     category_id:
 *                       type: integer
 *                       example: 5
 *                     created_by:
 *                       type: integer
 *                       example: 1
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-20T10:30:00Z"
 *                     Category:
 *                       type: object
 *                       properties:
 *                         category_id:
 *                           type: integer
 *                           example: 5
 *                         name:
 *                           type: string
 *                           example: "Electronics"
 *                         description:
 *                           type: string
 *                           example: "Electronic devices and accessories"
 *                     Store:
 *                       type: object
 *                       properties:
 *                         store_id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Tech Store"
 *                     ProductImages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           img_path:
 *                             type: string
 *                             example: "/images/products/headphones.jpg"
 *                           is_main:
 *                             type: boolean
 *                             example: true
 *                           status:
 *                             type: string
 *                             example: "active"
 *                     ProductAttributeValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           product_id:
 *                             type: integer
 *                             example: 1
 *                           attribute_id:
 *                             type: integer
 *                             example: 2
 *                           option_id:
 *                             type: integer
 *                             example: 7
 *                           ProductAttribute:
 *                             type: object
 *                             properties:
 *                               attribute_id:
 *                                 type: integer
 *                                 example: 2
 *                               name:
 *                                 type: string
 *                                 example: "Color"
 *                           AttributeOption:
 *                             type: object
 *                             properties:
 *                               option_id:
 *                                 type: integer
 *                                 example: 7
 *                               value:
 *                                 type: string
 *                                 example: "Black"
 *                     ProductOffers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           Offer:
 *                             type: object
 *                             properties:
 *                               offer_id:
 *                                 type: integer
 *                                 example: 2
 *                               name:
 *                                 type: string
 *                                 example: "Summer Sale"
 *                               discount_percentage:
 *                                 type: number
 *                                 format: float
 *                                 example: 15.00
 *                     Reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           review_id:
 *                             type: integer
 *                             example: 8
 *                           rating:
 *                             type: integer
 *                             example: 4
 *                           comment:
 *                             type: string
 *                             example: "Great product, very satisfied with the quality."
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-06-15T14:30:00Z"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to get product"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/store:
 *   get:
 *     summary: Get products for authenticated user's store
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name
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
 *         description: Minimum stock quantity filter
 *       - in: query
 *         name: max_stock
 *         schema:
 *           type: integer
 *         description: Maximum stock quantity filter
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
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of products
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
router.get("/store", isAuthenticated, productController.getUserStoreProducts);

// Admin routes

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products for store admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of products for the store
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as store admin
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
 *               - name
 *               - main_description
 *               - price
 *             properties:
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
 *                   type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", isAuthenticated, isAdmin, productController.createProduct);

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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                   type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/:id", isAuthenticated, isAdmin, productController.updateProduct);

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
