const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const offerController = require("../controllers/offerController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer management
 */

// Public routes

/**
 * @swagger
 * /api/offers/active:
 *   get:
 *     summary: Get active offers
 *     tags: [Offers]
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of offers to return
 *     responses:
 *       200:
 *         description: List of active offers
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
 *                       offer_id:
 *                         type: integer
 *                         example: 1
 *                       store_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Summer Sale"
 *                       description:
 *                         type: string
 *                         example: "Get amazing discounts on all summer products"
 *                       discount_percentage:
 *                         type: number
 *                         format: float
 *                         example: 15.00
 *                       start_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-01T00:00:00Z"
 *                       end_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-08-31T23:59:59Z"
 *                       offer_img:
 *                         type: string
 *                         example: "/images/offers/summer-sale.jpg"
 *                       seen_number:
 *                         type: integer
 *                         example: 120
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-15T10:30:00Z"
 *                       Store:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Tech Store"
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
 *                   example: "Failed to get active offers"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/active", offerController.getActiveOffers);

/**
 * @swagger
 * /api/offers/product/{productId}:
 *   get:
 *     summary: Get offers for a specific product
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         default: "true"
 *         description: Filter active offers only
 *     responses:
 *       200:
 *         description: List of offers for the product
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
 *                     type: object
 *                     properties:
 *                       offer_id:
 *                         type: integer
 *                         example: 1
 *                       store_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Summer Sale"
 *                       description:
 *                         type: string
 *                         example: "Get amazing discounts on all summer products"
 *                       discount_percentage:
 *                         type: number
 *                         format: float
 *                         example: 15.00
 *                       start_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-01T00:00:00Z"
 *                       end_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-08-31T23:59:59Z"
 *                       offer_img:
 *                         type: string
 *                         example: "/images/offers/summer-sale.jpg"
 *                       seen_number:
 *                         type: integer
 *                         example: 120
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-15T10:30:00Z"
 *                       Store:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Tech Store"
 *                 product_id:
 *                   type: integer
 *                   example: 5
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
 *                   example: "Failed to get product offers"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/product/:productId", offerController.getProductOffers);

/**
 * @swagger
 * /api/offers/{id}:
 *   get:
 *     summary: Get an offer by ID
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer details
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
 *                     offer_id:
 *                       type: integer
 *                       example: 1
 *                     store_id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Summer Sale"
 *                     description:
 *                       type: string
 *                       example: "Get amazing discounts on all summer products"
 *                     discount_percentage:
 *                       type: number
 *                       format: float
 *                       example: 15.00
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-01T00:00:00Z"
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-08-31T23:59:59Z"
 *                     offer_img:
 *                       type: string
 *                       example: "/images/offers/summer-sale.jpg"
 *                     seen_number:
 *                       type: integer
 *                       example: 121
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-15T10:30:00Z"
 *                     Store:
 *                       type: object
 *                       properties:
 *                         store_id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Tech Store"
 *                     ProductOffers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           product_id:
 *                             type: integer
 *                             example: 5
 *                           offer_id:
 *                             type: integer
 *                             example: 1
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
 *                                 example: 99.99
 *                               main_description:
 *                                 type: string
 *                                 example: "High-quality wireless headphones with noise cancellation"
 *       404:
 *         description: Offer not found
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
 *                   example: "Offer not found"
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
 *                   example: "Failed to get offer"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/:id", offerController.getOfferById);

// Admin routes

/**
 * @swagger
 * /api/admin/offers:
 *   get:
 *     summary: Get all offers (admin access)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by offer name
 *       - in: query
 *         name: min_discount
 *         schema:
 *           type: number
 *         description: Minimum discount percentage filter
 *       - in: query
 *         name: max_discount
 *         schema:
 *           type: number
 *         description: Maximum discount percentage filter
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         description: Filter active offers only
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, discount_percentage, start_date, end_date, seen_number, created_at]
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
 *         description: List of offers
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/offers", isAuthenticated, isAdmin, offerController.getAllOffers);

/**
 * @swagger
 * /api/admin/offers:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offers]
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
 *               - discount_percentage
 *             properties:
 *               store_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_percentage:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               offer_img:
 *                 type: string
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
router.post(
  "/offers",
  isAuthenticated,
  isAdmin,
  [
    body("store_id").isInt().withMessage("Store ID must be an integer"),
    body("name").notEmpty().withMessage("Name is required"),
    body("discount_percentage")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),
    body("description").optional(),
    body("start_date")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("end_date")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("offer_img").optional(),
    body("product_ids").optional().isArray(),
  ],
  validate,
  offerController.createOffer
);

/**
 * @swagger
 * /api/admin/offers/{id}:
 *   put:
 *     summary: Update an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
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
 *               description:
 *                 type: string
 *               discount_percentage:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               offer_img:
 *                 type: string
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Offer or store not found
 *       500:
 *         description: Server error
 */
router.put(
  "/offers/:id",
  isAuthenticated,
  isAdmin,
  [
    body("store_id")
      .optional()
      .isInt()
      .withMessage("Store ID must be an integer"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("discount_percentage")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),
    body("description").optional(),
    body("start_date")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("end_date")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("offer_img").optional(),
    body("product_ids").optional().isArray(),
  ],
  validate,
  offerController.updateOffer
);

/**
 * @swagger
 * /api/admin/offers/{id}:
 *   delete:
 *     summary: Delete an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/offers/:id",
  isAuthenticated,
  isAdmin,
  offerController.deleteOffer
);

/**
 * @swagger
 * /api/admin/offers/{id}/products:
 *   post:
 *     summary: Add products to an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_ids
 *             properties:
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Products added to offer successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
router.post(
  "/offers/:id/products",
  isAuthenticated,
  isAdmin,
  [
    body("product_ids")
      .isArray()
      .withMessage("Product IDs must be an array")
      .notEmpty()
      .withMessage("Product IDs array cannot be empty"),
  ],
  validate,
  offerController.addProductsToOffer
);

/**
 * @swagger
 * /api/admin/offers/{id}/products:
 *   delete:
 *     summary: Remove products from an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_ids
 *             properties:
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Products removed from offer successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Offer not found or no products found in the offer
 *       500:
 *         description: Server error
 */
router.delete(
  "/offers/:id/products",
  isAuthenticated,
  isAdmin,
  [
    body("product_ids")
      .isArray()
      .withMessage("Product IDs must be an array")
      .notEmpty()
      .withMessage("Product IDs array cannot be empty"),
  ],
  validate,
  offerController.removeProductsFromOffer
);

module.exports = router;
