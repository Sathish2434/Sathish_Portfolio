import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ✅ This matches YOUR EmailJS template placeholders exactly
type EmailPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

// ✅ Export default — because YOU import sendEmail as default
export default async function sendEmail(data: EmailPayload) {
  const missingVars: string[] = [];
  if (!SERVICE_ID) missingVars.push("VITE_EMAILJS_SERVICE_ID");
  if (!TEMPLATE_ID) missingVars.push("VITE_EMAILJS_TEMPLATE_ID");
  if (!PUBLIC_KEY) missingVars.push("VITE_EMAILJS_PUBLIC_KEY");
  
  if (missingVars.length > 0) {
    throw new Error(
      `EmailJS environment variables are missing: ${missingVars.join(", ")}. ` +
      `Please add them to your .env file. See .env.example for reference.`
    );
  }

  // ✅ Send using EXACT keys that match your EmailJS template placeholders
  const templateParams = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    company: data.company,
    subject: data.subject,
    message: data.message,
  };

  // ✅ Step 2 — Add logs BEFORE sending
  console.log("SERVICE", SERVICE_ID);
  console.log("TEMPLATE", TEMPLATE_ID);
  console.log("PUBLIC", PUBLIC_KEY);
  console.log("TEMPLATE PARAMS", templateParams);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    // ✅ EmailJS success status
    if (response.status !== 200) {
      throw new Error("Email not sent. Status != 200");
    }

    return response;
  } catch (error: any) {
    // ✅ Step 1 — Add this console log inside your sendEmail catch
    console.error("RAW EMAILJS ERROR:", error);
    throw new Error(error?.text || error?.message || "Email sending failed");
  }
}
