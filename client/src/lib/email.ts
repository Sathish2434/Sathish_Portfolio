import emailjs from "@emailjs/browser";

// EmailJS configuration - these should be set as environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

// Initialize EmailJS once with the public key (recommended pattern)
emailjs.init({ publicKey: PUBLIC_KEY });

// Validate EmailJS configuration
function validateEmailJSConfig(): void {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS is not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your environment variables."
    );
  }
}

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
    // Validate configuration before attempting to send
    validateEmailJSConfig();

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
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS responded with status: ${response.status}`);
    }

    console.log("Email sent successfully:", response);
  } catch (error: any) {
    console.error("Email sending failed:", error);
    
    // Provide more specific error messages
    if (error?.text) {
      // Handle EmailJSResponseStatus errors
      if (error.text.includes("Public Key is invalid")) {
        throw new Error(
          "EmailJS Public Key is invalid. Please check your VITE_EMAILJS_PUBLIC_KEY environment variable. " +
          "You can find your Public Key at https://dashboard.emailjs.com/admin/account"
        );
      } else if (error.text.includes("Service not found")) {
        throw new Error(
          "EmailJS Service ID is invalid. Please check your VITE_EMAILJS_SERVICE_ID environment variable."
        );
      } else if (error.text.includes("Template not found")) {
        throw new Error(
          "EmailJS Template ID is invalid. Please check your VITE_EMAILJS_TEMPLATE_ID environment variable."
        );
      }
    }
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid user ID") || error.message.includes("Public Key")) {
        throw new Error(
          "EmailJS configuration error. Please verify your EmailJS credentials. " +
          "Visit https://dashboard.emailjs.com/admin/account to find your Public Key."
        );
      } else if (error.message.includes("Template not found")) {
        throw new Error("Email template not found. Please contact support.");
      } else if (error.message.includes("Network")) {
        throw new Error("Network error. Please check your connection and try again.");
      } else if (error.message.includes("not configured")) {
        throw error; // Re-throw configuration errors as-is
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
