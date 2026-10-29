import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text }) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Gmail SMTP is not configured on the server.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `CCTV Digital Surveillance <${EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};
