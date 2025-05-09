const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// Import validation middleware
const { validate } = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin Categories
 *   description: Category management for admin
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin Categories]
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
 *         description: Search by category name
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get(
  "/categories",
  isAuthenticated,
  isAdmin,
  categoryController.getAllCategories
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get(
  "/categories/:id",
  isAuthenticated,
  isAdmin,
  categoryController.getCategoryById
);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin Categories]
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
 *             properties:
 *               store_id:
 *                 type: integer
 *               parent_category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               img_path:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.post(
  "/categories",
  isAuthenticated,
  isAdmin,
  [
    body("store_id").isInt().withMessage("Store ID must be an integer"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("description").optional(),
    body("img_path").optional(),
  ],
  validate,
  categoryController.createCategory
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
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
 *               img_path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put(
  "/categories/:id",
  isAuthenticated,
  isAdmin,
  [
    body("store_id")
      .optional()
      .isInt()
      .withMessage("Store ID must be an integer"),
    body("name")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("description").optional(),
    body("img_path").optional(),
  ],
  validate,
  categoryController.updateCategory
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/categories/:id",
  isAuthenticated,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
