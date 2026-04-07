const axios = require("axios");

const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      `${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`,
      {
        messages: [
          {
            from: process.env.INFOBIP_SENDER,
            destinations: [{ to: phone }],
            text: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `App ${process.env.INFOBIP_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ SMS Sent Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Infobip SMS Error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS via Infobip");
  }
};

module.exports = sendSMS;