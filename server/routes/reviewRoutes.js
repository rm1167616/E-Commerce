const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const reviewController = require("../controllers/reviewController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management
 */

// Public routes

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
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
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [rating, created_at]
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of reviews for the product
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
 *                       review_id:
 *                         type: integer
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         example: 5
 *                       user_id:
 *                         type: integer
 *                         example: 3
 *                       rating:
 *                         type: integer
 *                         example: 4
 *                       comment:
 *                         type: string
 *                         example: "Great product, very satisfied with the quality."
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T14:30:00Z"
 *                       User:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     average_rating:
 *                       type: string
 *                       example: "4.5"
 *                     rating_distribution:
 *                       type: object
 *                       properties:
 *                         "1":
 *                           type: integer
 *                           example: 0
 *                         "2":
 *                           type: integer
 *                           example: 0
 *                         "3":
 *                           type: integer
 *                           example: 1
 *                         "4":
 *                           type: integer
 *                           example: 3
 *                         "5":
 *                           type: integer
 *                           example: 6
 *                     total_reviews:
 *                       type: integer
 *                       example: 10
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 10
 *                     total_pages:
 *                       type: integer
 *                       example: 1
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     items_per_page:
 *                       type: integer
 *                       example: 10
 *                     has_next_page:
 *                       type: boolean
 *                       example: false
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
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
 *                   example: "Failed to get product reviews"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/product/:productId", reviewController.getProductReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
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
 *                     review_id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     rating:
 *                       type: integer
 *                       example: 4
 *                     comment:
 *                       type: string
 *                       example: "Great product, very satisfied with the quality."
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *                     User:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                     Product:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: integer
 *                           example: 5
 *                         name:
 *                           type: string
 *                           example: "Wireless Headphones"
 *       404:
 *         description: Review not found
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
 *                   example: "Review not found"
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
 *                   example: "Failed to get review"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/:id", reviewController.getReviewById);

// Private routes (require authentication)

/**
 * @swagger
 * /api/reviews/check/{productId}:
 *   get:
 *     summary: Check if user has reviewed a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Review check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 has_reviewed:
 *                   type: boolean
 *                   example: true
 *                 review:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     review_id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     rating:
 *                       type: integer
 *                       example: 4
 *                     comment:
 *                       type: string
 *                       example: "Great product, very satisfied with the quality."
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *       401:
 *         description: Not authenticated
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
 *                   example: "No token provided, authorization denied"
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
 *                   example: "Failed to check user review"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get(
  "/check/:productId",
  isAuthenticated,
  reviewController.checkUserReview
);

/**
 * @swagger
 * /api/reviews/user:
 *   get:
 *     summary: Get all reviews by the authenticated user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of user's reviews
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
 *                       review_id:
 *                         type: integer
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         example: 5
 *                       user_id:
 *                         type: integer
 *                         example: 3
 *                       rating:
 *                         type: integer
 *                         example: 4
 *                       comment:
 *                         type: string
 *                         example: "Great product, very satisfied with the quality."
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T14:30:00Z"
 *                       Product:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "Wireless Headphones"
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 99.99
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 5
 *                     total_pages:
 *                       type: integer
 *                       example: 1
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     items_per_page:
 *                       type: integer
 *                       example: 10
 *                     has_next_page:
 *                       type: boolean
 *                       example: false
 *                     has_prev_page:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Not authenticated
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
 *                   example: "No token provided, authorization denied"
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
 *                   example: "Failed to get user reviews"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.get("/user", isAuthenticated, reviewController.getUserReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great product, very satisfied with the quality."
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                   example: "Review created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     rating:
 *                       type: integer
 *                       example: 4
 *                     comment:
 *                       type: string
 *                       example: "Great product, very satisfied with the quality."
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *                     User:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *       400:
 *         description: Invalid input data or user has already reviewed this product
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
 *                   example: "You have already reviewed this product"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "rating"
 *                       message:
 *                         type: string
 *                         example: "Rating must be between 1 and 5"
 *       401:
 *         description: Not authenticated
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
 *                   example: "No token provided, authorization denied"
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
 *                   example: "Failed to create review"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.post(
  "/",
  isAuthenticated,
  [
    body("product_id").isInt().withMessage("Product ID must be an integer"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").optional(),
  ],
  validate,
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated review: This product exceeded my expectations!"
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                   example: "Review updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 3
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "Updated review: This product exceeded my expectations!"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00Z"
 *                     User:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                     Product:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: integer
 *                           example: 5
 *                         name:
 *                           type: string
 *                           example: "Wireless Headphones"
 *       400:
 *         description: Invalid input data
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
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "rating"
 *                       message:
 *                         type: string
 *                         example: "Rating must be between 1 and 5"
 *       401:
 *         description: Not authenticated
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
 *                   example: "No token provided, authorization denied"
 *       403:
 *         description: Not authorized to update this review
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
 *                   example: "You can only update your own reviews"
 *       404:
 *         description: Review not found
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
 *                   example: "Review not found"
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
 *                   example: "Failed to update review"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.put(
  "/:id",
  isAuthenticated,
  [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").optional(),
  ],
  validate,
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Not authenticated
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
 *                   example: "No token provided, authorization denied"
 *       403:
 *         description: Not authorized to delete this review
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
 *                   example: "You can only delete your own reviews"
 *       404:
 *         description: Review not found
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
 *                   example: "Review not found"
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
 *                   example: "Failed to delete review"
 *                 error:
 *                   type: string
 *                   example: "Error message details (only in development mode)"
 */
router.delete("/:id", isAuthenticated, reviewController.deleteReview);

module.exports = router;
