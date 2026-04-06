const express = require('express');
const router = express.Router();
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Brevo API setup
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// In-memory OTP storage
let otpStore = {};

// 🧩 STEP 5: SEND OTP
router.post("/send-otp", async (req, res) => {
  console.log("=== SEND-OTP CALLED ===");
  console.log("Email:", req.body.email);
  console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
  console.log("SMTP_USER exists:", !!process.env.SMTP_USER);
  
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = {
    otp: otp.toString(),
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SMTP_USER,
        name: "Event Quiz Team",
      },
      to: [{ email }],
      subject: `${otp} is your verification code`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) to access the Event Quiz is:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Brevo Error:", err.response?.body || err.message);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// 🧩 STEP 6: VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found." });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP has expired." });
  }

  if (record.otp === otp.toString()) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully!" });
  }

  res.status(400).json({ success: false, message: "Invalid OTP." });
});

module.exports = router;