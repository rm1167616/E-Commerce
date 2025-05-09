const nodemailer = require("nodemailer");

// Create a transporter object
/*
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
*/

/**
 * Send an OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise} - Nodemailer send result
 */
const sendOTPEmail = async (to, otp) => {
  // COMMENTED FOR DEVELOPMENT: Actual email sending is disabled
  // Instead, we'll just log the OTP to the console for testing
  console.log(`
    ========== DEVELOPMENT MODE ==========
    Email would be sent to: ${to}
    OTP Code: ${otp}
    ======================================
  `);

  // Return a resolved promise to simulate successful sending
  return Promise.resolve({
    accepted: [to],
    rejected: [],
    response: "250 Message accepted",
    messageId: `<test-${Date.now()}@localhost>`,
  });

  /*
  const mailOptions = {
    from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="font-size: 16px; color: #555;">Thank you for registering with our service. Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px;">
          <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
  */
};

module.exports = {
  sendOTPEmail,
};
