// services/contactService.ts
//
// Sends a Contact-Us submission to the tenant's company email (the address set
// in the CMS configuration → footerConfig.email).
//
// The site is a static export, but — exactly like visitor tracking — the
// browser calls the backend on its OWN origin (`/api/...`) and the serving
// layer (nginx in production, the dev rewrite locally) proxies it
// server-to-server to the upstream gateway. So there's no CORS preflight, the
// same way `visitors/track` already works from the browser.
//
// The payload mirrors the admin's own email sender (see
// latest_cms-share_/src/components/modal/email/EmailComposeModal.tsx): the
// SendGrid-style `/v2/email/general/send` route with template `awfatech-eboss`.
import myAxios from "@/lib/myAxios";
import getConfig from "@/lib/getConfig";

export interface ContactMessage {
  name: string;
  phone: string;
  email: string;
  state: string;
  subject: string;
  description: string;
}

/**
 * Send the contact message to `to` (the configured company email). Resolves on
 * success; throws on any failure so the caller can fall back (e.g. to mailto).
 */
export async function sendContactMessage(
  to: string,
  msg: ContactMessage,
): Promise<void> {
  if (!to) throw new Error("No company email configured");

  const { x_api_key_email } = await getConfig();

  // Human-readable body — the same shape the old mailto used, so whoever
  // receives it sees every field.
  const text =
    `Nama: ${msg.name}\n` +
    `Telefon: ${msg.phone}\n` +
    `Emel: ${msg.email}\n` +
    `Negeri: ${msg.state}\n\n` +
    `${msg.description}`;

  const payload = {
    username: "infomail2umy",
    from: { email: "do_not_reply@mail2u.my", name: "Awfatech eboss" },
    // Reply-To the visitor, so the company can reply straight to them.
    reply_to: [
      {
        email: msg.email || "do_not_reply@mail2u.my",
        name: msg.name || "Pelawat",
      },
    ],
    personalizations: [
      {
        to: [{ email: to, name: to }],
        dynamic_template_data: { text, logo: "" },
      },
    ],
    template_type: "awfatech-eboss",
    subject: msg.subject?.trim() || "Pertanyaan Laman Web",
  };

  // x-encrypted-key is attached by the myAxios interceptor; the email service
  // additionally expects x-api-key (provisioned per tenant in config.json).
  await myAxios.post("api/v2/email/general/send", payload, {
    headers: x_api_key_email ? { "x-api-key": x_api_key_email } : undefined,
  });
}
