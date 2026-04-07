const express = require("express");
const router = express.Router();
const sendSMS = require("../utils/sendSms");

// Temporary storage for OTPs. 
// Note: In production, use Redis or a Database with a TTL index.
const otpStore = {}; 

// Helper to generate a 6-digit numeric OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/send-sms-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = generateOTP();

    // Store OTP with a 5-minute expiration
    otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendSMS(phone, `Your verification code is: ${otp}`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({ message: "Failed to process SMS request" });
  }
});

router.post("/verify-sms-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const record = otpStore[phone];

  if (!record) {
    return res.status(400).json({ message: "No OTP found for this number" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Ensure both are strings for comparison
  if (record.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  // Success: Remove the OTP after successful verification
  delete otpStore[phone];

  res.json({ success: true, message: "Phone number verified successfully" });
});

module.exports = router;