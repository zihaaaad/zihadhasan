import emailjs from "@emailjs/browser";

/**
 * Transactional email via EmailJS.
 *
 * This project is a static export (no server, no API routes), so a
 * secret-key email SDK like Resend can't be called safely from the browser -
 * the secret would end up in the client bundle for anyone to read. EmailJS is
 * built specifically for this situation: it sends email straight from the
 * browser using a public key plus a template configured on their dashboard,
 * so there's nothing secret to leak.
 *
 * Setup (one-time, in the EmailJS dashboard at emailjs.com):
 * 1. Add an email service (e.g. Gmail) - gives you a Service ID.
 * 2. Create one template with variables: {{to_email}}, {{to_name}},
 * {{subject}}, {{message}} - gives you a Template ID.
 * 3. Copy your Public Key from Account > General.
 * 4. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
 * and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local.
 *
 * Until those env vars are set, sendNotificationEmail() is a safe no-op -
 * it logs a warning and returns { success: false } instead of throwing, so
 * callers (registration approval, contact form) keep working even before
 * email is configured.
 */

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export interface SendEmailParams {
 toEmail: string;
 toName?: string;
 subject: string;
 message: string;
}

export const isEmailConfigured = () => !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export async function sendNotificationEmail(
 { toEmail, toName, subject, message }: SendEmailParams
): Promise<{ success: boolean; error?: unknown }> {
 if (!isEmailConfigured()) {
 console.warn("[email] EmailJS is not configured (missing NEXT_PUBLIC_EMAILJS_* env vars) - skipping email send.");
 return { success: false, error: "EmailJS not configured" };
 }

 try {
 await emailjs.send(
 SERVICE_ID!,
 TEMPLATE_ID!,
 {
 to_email: toEmail,
 to_name: toName || toEmail,
 subject,
 message,
 },
 { publicKey: PUBLIC_KEY! }
 );
 return { success: true };
 } catch (error) {
 console.error("[email] Failed to send notification email:", error);
 return { success: false, error };
 }
}
