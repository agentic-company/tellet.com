import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
  from_name?: string;
}): Promise<string> {
  try {
    const { to, subject, body, from_name } = input;

    if (!process.env.RESEND_API_KEY) {
      return JSON.stringify({ error: "Email not configured. RESEND_API_KEY is missing." });
    }

    const { data, error } = await getResend().emails.send({
      from: `${from_name || "Tellet Agent"} <agent@tellet.com>`,
      to,
      subject,
      html: body,
    });

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({ success: true, email_id: data?.id });
  } catch (err) {
    return JSON.stringify({
      error: err instanceof Error ? err.message : "Failed to send email",
    });
  }
}
