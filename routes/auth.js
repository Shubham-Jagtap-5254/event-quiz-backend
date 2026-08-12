const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, resendOtp } = require("../utils/sendMsg91Otp");

router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const data = await sendOtp({
      mobile,
      otpExpiry: process.env.MSG91_OTP_EXPIRY,
    });

    const type = data?.type;
    const isSuccess = type === "success" || type === "Success" || type === 1;

    res.json({
      success: true,
      message: "OTP sent successfully",
      data,
      ...(isSuccess && { message_id: data?.message }),
    });
  } catch (error) {
    console.error("MSG91 Send OTP Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    const data = await verifyOtp({ mobile, otp });

    const type = data?.type;
    const isSuccess = type === "success" || type === "Success" || type === 1;

    if (!isSuccess) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
        data,
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
      data,
    });
  } catch (error) {
    console.error("MSG91 Verify OTP Error:", error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      message: "Invalid or expired OTP",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const data = await resendOtp({ mobile });

    res.json({
      success: true,
      message: "OTP resent successfully",
      data,
    });
  } catch (error) {
    console.error("MSG91 Resend OTP Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
