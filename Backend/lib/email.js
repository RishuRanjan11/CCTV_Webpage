import axios from "axios";

const BREVO_EMAIL_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async ({ to, subject, html, text }) => {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL } = process.env;

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    throw new Error("Brevo email delivery is not configured on the server.");
  }

  try {
    await axios.post(
      BREVO_EMAIL_API_URL,
      {
        sender: {
          name: "CCTV Digital Surveillance",
          email: BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          accept: "application/json",
          "content-type": "application/json",
        },
        timeout: 10000,
      }
    );
  } catch (error) {
    console.error("Brevo email API error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    throw new Error("Brevo could not send the email. Check its sender and API key.");
  }
};
