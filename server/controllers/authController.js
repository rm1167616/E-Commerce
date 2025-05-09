const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { createOTP, verifyOTP } = require("../utils/otpService");

/**
 * Register a new user (Step 1: Create unverified user and send OTP)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone_number, gender, birthday } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (existingUser.is_verified) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      } else {
        // If user exists but is not verified, send a new OTP
        await createOTP(email);
        return res.status(200).json({
          success: true,
          message: "A new verification code has been sent to your email",
          data: {
            email,
            requiresVerification: true,
          },
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new unverified user
    const newUser = await User.create({
      name,
      email,
      password_hash,
      phone_number,
      gender,
      birthday,
      role: "client", // Default to client role
      is_verified: false, // User is not verified yet
    });

    // Generate and send OTP
    const otpCode = await createOTP(email);

    // Return user data (without token) and include OTP in development mode
    res.status(201).json({
      success: true,
      message:
        "Registration initiated. Please verify your email with the code we sent.",
      data: {
        email: newUser.email,
        requiresVerification: true,
        // Include OTP in response for development purposes
        ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Verify OTP and complete user registration (Step 2)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark user as verified
    await user.update({ is_verified: true });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      // Generate and send a new OTP
      const otpCode = await createOTP(email);

      return res.status(403).json({
        success: false,
        message:
          "Email not verified. A new verification code has been sent to your email.",
        data: {
          email,
          requiresVerification: true,
          // Include OTP in response for development purposes
          ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
        },
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password_hash"] }, // Exclude password hash from response
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Resend OTP verification code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Generate and send a new OTP
    const otpCode = await createOTP(email);

    res.status(200).json({
      success: true,
      message: "Verification code has been resent to your email",
      data: {
        email,
        // Include OTP in response for development purposes
        ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resending verification code",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  register,
  verifyRegistration,
  login,
  getProfile,
  resendOTP,
};
