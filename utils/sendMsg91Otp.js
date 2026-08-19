const axios = require("axios");

const MSG91_BASE_URL = "https://control.msg91.com/api/v5";

const normalizeMobile = (mobile) => {
  // Remove all non-digit characters and leading +
  let normalized = String(mobile).replace(/\D/g, "");

  // If number already has a country code (11-15 digits), use as-is
  if (normalized.length >= 11) {
    return normalized;
  }

  // For 10-digit numbers, default to India country code (91)
  if (normalized.length === 10) {
    return "91" + normalized;
  }

  // For numbers shorter than 10 (e.g. Australia 8-digit local),
  // can't guess — return as-is and let MSG91 handle
  return normalized;
};

const sendOtp = async ({ mobile, templateParams, otpExpiry }) => {
  const params = {
    authkey: process.env.MSG91_AUTH_KEY,
    template_id: process.env.MSG91_TEMPLATE_ID,
    mobile: normalizeMobile(mobile),
    realTimeResponse: 1,
    ...(otpExpiry && { otp_expiry: otpExpiry }),
  };

  const response = await axios.post(
    `${MSG91_BASE_URL}/otp`,
    templateParams || {},
    {
      params,
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY,
      },
    }
  );

  return response.data;
};

const verifyOtp = async ({ mobile, otp }) => {
  const response = await axios.get(
    `${MSG91_BASE_URL}/otp/verify`,
    {
      params: {
        mobile: normalizeMobile(mobile),
        otp,
        realTimeResponse: 1,
      },
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
      },
    }
  );

  return response.data;
};

const resendOtp = async ({ mobile, retrytype = "text" }) => {
  const response = await axios.post(
    `${MSG91_BASE_URL}/otp/retry`,
    {},
    {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: normalizeMobile(mobile),
        retrytype,
        realTimeResponse: 1,
      },
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY,
      },
    }
  );

  return response.data;
};

const checkBalance = async () => {
  const response = await axios.get(
    "http://control.msg91.com/api/balance.php",
    {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        type: "106",
      },
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
      },
      timeout: 10000,
    }
  );

  return response.data;
};

module.exports = { sendOtp, verifyOtp, resendOtp, checkBalance };
