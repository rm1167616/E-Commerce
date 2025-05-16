const express = require("express");
const router = express.Router();
const {
  getPageSettings,
  updatePageSettings,
} = require("../controllers/pageSettingsController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Page Settings
 *   description: Store page appearance settings management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PageSettings:
 *       type: object
 *       properties:
 *         backgroundColor:
 *           type: string
 *           pattern: '^#[0-9A-Fa-f]{6}$'
 *           example: '#FFFFFF'
 *         primaryTextColor:
 *           type: string
 *           pattern: '^#[0-9A-Fa-f]{6}$'
 *           example: '#000000'
 *         secondaryTextColor:
 *           type: string
 *           pattern: '^#[0-9A-Fa-f]{6}$'
 *           example: '#666666'
 *         linkColor:
 *           type: string
 *           pattern: '^#[0-9A-Fa-f]{6}$'
 *           example: '#0066CC'
 *         linkHoverColor:
 *           type: string
 *           pattern: '^#[0-9A-Fa-f]{6}$'
 *           example: '#003366'
 *         headingFont:
 *           type: string
 *           example: 'Arial'
 *         headingSize:
 *           type: integer
 *           minimum: 8
 *           maximum: 72
 *           example: 24
 *         pagePadding:
 *           type: string
 *           pattern: '^[0-9]+(px|rem|em|%)$'
 *           example: '20px'
 *         paragraphFont:
 *           type: string
 *           example: 'Arial'
 *         paragraphSize:
 *           type: integer
 *           minimum: 8
 *           maximum: 72
 *           example: 16
 *         contentMaxWidth:
 *           type: string
 *           pattern: '^[0-9]+(px|rem|em|%)$'
 *           example: '1200px'
 */

/**
 * @swagger
 * /api/page-settings:
 *   get:
 *     summary: Get page settings for the authenticated user's store
 *     tags: [Page Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Page settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageSettings'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch page settings
 */

/**
 * @swagger
 * /api/page-settings:
 *   post:
 *     summary: Update page settings for the authenticated user's store
 *     tags: [Page Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PageSettings'
 *     responses:
 *       200:
 *         description: Page settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageSettings'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update page settings
 */

// Get page settings for the authenticated user's store
router.get("/", isAuthenticated, getPageSettings);

// Update page settings for the authenticated user's store
router.post("/", isAuthenticated, updatePageSettings);

module.exports = router;
