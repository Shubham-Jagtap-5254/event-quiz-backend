const axios = require("axios");

const MSG91_BASE_URL = "https://control.msg91.com/api/v5";

const normalizeMobile = (mobile) => {
  return String(mobile).replace(/\D/g, "");
};

const sendOtp = async ({ mobile, templateParams, otpExpiry }) => {
  const params = {
    authkey: process.env.MSG91_AUTH_KEY,
    template_id: process.env.MSG91_TEMPLATE_ID,
    mobile: normalizeMobile(mobile),
    realTimeResponse: 1,
    ...(otpExpiry && { otp_expiry: otpExpiry }),
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      authkey: process.env.MSG91_AUTH_KEY,
    },
  };

  const response = await axios.post(
    `${MSG91_BASE_URL}/otp`,
    templateParams || {},
    { params, ...config }
  );

  return response.data;
};

const verifyOtp = async ({ mobile, otp }) => {
  const response = await axios.get(`${MSG91_BASE_URL}/otp/verify`, {
    params: {
      mobile: normalizeMobile(mobile),
      otp,
      realTimeResponse: 1,
    },
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
    },
  });

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

module.exports = { sendOtp, verifyOtp, resendOtp };
