const axios = require("axios");

const MSG91_BASE_URL = "https://control.msg91.com/api/v5";

const normalizeMobile = (mobile) => {
  return String(mobile).replace(/\D/g, "");
};

const sendOtp = async ({ mobile, templateParams, otpExpiry }) => {
  const response = await axios.post(
    `${MSG91_BASE_URL}/otp`,
    templateParams || { Param1: "Event App" },
    {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: normalizeMobile(mobile),
        ...(otpExpiry && { otp_expiry: otpExpiry }),
      },
      headers: {
        "Content-Type": "application/json",
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
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

module.exports = { sendOtp, verifyOtp, resendOtp };
