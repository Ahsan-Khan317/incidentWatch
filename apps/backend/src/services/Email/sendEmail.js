import { resend } from "../../configs/resend.config.js";

const sendEmail = async function ({ to, subject, html, text }) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Update this to your verified domain if necessary
      to,
      subject,
      html,
      text,
    });
    return `email is successfully sent to ${to}.`;
  } catch (error) {
    console.error("[RESEND] Error sending email:", {
      to,
      subject,
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      fullError: error,
    });
    throw error;
  }
};
export default sendEmail;
