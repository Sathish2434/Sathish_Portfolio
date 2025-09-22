import emailjs from "@emailjs/browser";

// EmailJS configuration - these should be set as environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_default";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_default";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_default";

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface EmailData {
  to_name: string;
  from_name: string;
  from_email: string;
  company?: string;
  subject: string;
  message: string;
}

export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const templateParams = {
      to_name: data.to_name,
      from_name: data.from_name,
      from_email: data.from_email,
      company: data.company || "Not specified",
      subject: data.subject,
      message: data.message,
      reply_to: data.from_email,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS responded with status: ${response.status}`);
    }

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Email sending failed:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid user ID")) {
        throw new Error("Email service configuration error. Please contact support.");
      } else if (error.message.includes("Template not found")) {
        throw new Error("Email template not found. Please contact support.");
      } else if (error.message.includes("Network")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
    }
    
    throw new Error("Failed to send email. Please try again or contact me directly.");
  }
}

// Validation helper
export function validateEmailData(data: Partial<EmailData>): string[] {
  const errors: string[] = [];

  if (!data.from_name?.trim()) {
    errors.push("Name is required");
  }

  if (!data.from_email?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from_email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.subject?.trim()) {
    errors.push("Subject is required");
  }

  if (!data.message?.trim()) {
    errors.push("Message is required");
  } else if (data.message.length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return errors;
}
