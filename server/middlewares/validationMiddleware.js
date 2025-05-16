const { body, validationResult } = require("express-validator");

/**
 * Middleware to validate request data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("phone_number")
    .optional()
    .isMobilePhone()
    .withMessage("Must be a valid phone number"),

  body("birthday").optional().isDate().withMessage("Must be a valid date"),
];

/**
 * Validation rules for user login
 */
const loginValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for page settings
 */
const pageSettingsValidationRules = [
  body("backgroundColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Background color must be a valid hex color code"),
  body("primaryTextColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Primary text color must be a valid hex color code"),
  body("secondaryTextColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Secondary text color must be a valid hex color code"),
  body("linkColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Link color must be a valid hex color code"),
  body("linkHoverColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Link hover color must be a valid hex color code"),
  body("headingFont")
    .optional()
    .notEmpty()
    .withMessage("Heading font cannot be empty"),
  body("headingSize")
    .optional()
    .isInt({ min: 8, max: 72 })
    .withMessage("Heading size must be between 8 and 72"),
  body("pagePadding")
    .optional()
    .matches(/^[0-9]+(px|rem|em|%)$/)
    .withMessage("Page padding must be a valid CSS size value"),
  body("paragraphFont")
    .optional()
    .notEmpty()
    .withMessage("Paragraph font cannot be empty"),
  body("paragraphSize")
    .optional()
    .isInt({ min: 8, max: 72 })
    .withMessage("Paragraph size must be between 8 and 72"),
  body("contentMaxWidth")
    .optional()
    .matches(/^[0-9]+(px|rem|em|%)$/)
    .withMessage("Content max width must be a valid CSS size value"),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  pageSettingsValidationRules,
};
