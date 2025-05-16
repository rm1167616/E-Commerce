const express = require("express");
const router = express.Router();
const {
  getStoreAboutPage,
  createAboutSection,
} = require("../controllers/pagesController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { body } = require("express-validator");
const multer = require("multer");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/about");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AboutSection:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         about_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Our Story"
 *         content:
 *           type: string
 *           example: "Founded in 2020, we have been committed to excellence..."
 *         img:
 *           type: string
 *           example: "https://example.com/images/story.jpg"
 *     AboutPage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         store_id:
 *           type: integer
 *           example: 1
 *         AboutSections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AboutSection'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Store pages management including about pages and sections
 */

/**
 * @swagger
 * /api/pages/about:
 *   get:
 *     summary: Get store about page and sections
 *     description: Retrieve the about page and all its sections for the authenticated user's store
 *     tags: [Pages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: About page retrieved successfully
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     store_id:
 *                       type: integer
 *                       example: 1
 *                     AboutSections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Our Story"
 *                           content:
 *                             type: string
 *                             example: "Founded in 2020, we have been committed to excellence..."
 *                           img:
 *                             type: string
 *                             example: "https://example.com/images/story.jpg"
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Store not found or About page not found
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
 *                   example: "Store not found"
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
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/pages/about/section:
 *   post:
 *     summary: Create a new about section
 *     description: Create a new section for the authenticated user's store about page. Requires admin authentication.
 *     tags: [Pages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Our Mission"
 *               content:
 *                 type: string
 *                 example: "We strive to provide the best quality products..."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (optional, max 5MB)
 *     responses:
 *       201:
 *         description: About section created successfully
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
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     about_id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Our Mission"
 *                     content:
 *                       type: string
 *                       example: "We strive to provide the best quality products..."
 *                     img:
 *                       type: string
 *                       example: "https://example.com/images/mission.jpg"
 *       400:
 *         description: Validation error
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
 *                         example: "title"
 *                       message:
 *                         type: string
 *                         example: "Title is required"
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (requires admin role)
 *       404:
 *         description: Store not found
 *       413:
 *         description: File too large
 *       415:
 *         description: Unsupported media type
 *       500:
 *         description: Server error
 */

// Get store about page
router.get("/about", isAuthenticated, getStoreAboutPage);

// Create about section (requires admin authentication)
router.post(
  "/about/section",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  createAboutSection
);

module.exports = router;
