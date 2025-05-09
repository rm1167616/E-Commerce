const { OTP } = require("../models");
const { sendOTPEmail } = require("./emailService");

/**
 * Generate a random OTP code
 * @param {number} length - Length of the OTP code
 * @returns {string} - Generated OTP code
 */
const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Create and save a new OTP for the given email
 * @param {string} email - User's email address
 * @returns {Promise<string>} - Generated OTP code
 */
const createOTP = async (email) => {
  try {
    // Generate a new OTP code
    const otpCode = generateOTP();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Save OTP to database
    await OTP.create({
      email,
      otp_code: otpCode,
      expires_at: expiresAt,
    });
    
    // Send OTP email
    await sendOTPEmail(email, otpCode);
    
    return otpCode;
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
};

/**
 * Verify an OTP code for a given email
 * @param {string} email - User's email address
 * @param {string} otpCode - OTP code to verify
 * @returns {Promise<boolean>} - Whether the OTP is valid
 */
const verifyOTP = async (email, otpCode) => {
  try {
    // Find the most recent unused OTP for this email
    const otp = await OTP.findOne({
      where: {
        email,
        otp_code: otpCode,
        is_used: false,
      },
      order: [["created_at", "DESC"]],
    });
    
    // If no OTP found or it's expired, return false
    if (!otp || new Date() > new Date(otp.expires_at)) {
      return false;
    }
    
    // Mark OTP as used
    await otp.update({ is_used: true });
    
    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
};
