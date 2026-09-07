import { createFileRoute } from "@tanstack/react-router";

const SIGNATURE_TOLERANCE_SECONDS = 300;
const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

function parseStripeSignature(header: string) {
  const values = new Map<string, string[]>();

  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2);
    if (!key || !value) continue;
    const list = values.get(key) ?? [];
    list.push(value);
    values.set(key, list);
  }

  return {
    timestamp: values.get("t")?.[0] ?? "",
    signatures: values.get("v1") ?? [],
  };
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

async function hmacSha256Hex(secret: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const { timestamp, signatures } = parseStripeSignature(signatureHeader);
  if (!timestamp || signatures.length === 0) return false;

  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - numericTimestamp);
  if (age > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((signature) => timingSafeEqualHex(signature, expected));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEbookEmail({
  to,
  name,
  downloadUrl,
}: {
  to: string;
  name?: string | null;
  downloadUrl: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "SinalZero";

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo delivery environment variables are missing.");
  }

  const safeName = name?.trim() ? escapeHtml(name.trim()) : "cliente";
  const safeDownloadUrl = escapeHtml(downloadUrl);

  const response = await fetch(BREVO_SEND_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to, name: name || undefined }],
      subject: "Seu e-book da SinalZero está pronto",
      htmlContent: `
        <div style="margin:0;background:#11110f;padding:32px 16px;font-family:Arial,sans-serif;color:#f7f2ea">
          <div style="max-width:560px;margin:0 auto;border:1px solid #2e2a24;border-radius:20px;background:#191815;padding:32px">
            <p style="margin:0 0 12px;color:#f59b42;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">SinalZero</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15">Seu e-book está pronto.</h1>
            <p style="margin:0 0 22px;color:#c9c2b8;line-height:1.65">Olá, ${safeName}. Seu pagamento foi confirmado e o acesso ao <strong>Fora do Balcão</strong> já está liberado.</p>
            <a href="${safeDownloadUrl}" style="display:inline-block;border-radius:12px;background:#f57c00;color:#17120d;text-decoration:none;font-weight:700;padding:14px 20px">Baixar o e-book</a>
            <p style="margin:22px 0 0;color:#8f887e;font-size:12px;line-height:1.6">Este link valida a compra na Stripe antes de liberar o arquivo.</p>
          </div>
        </div>
      `,
      textContent: `Olá, ${name?.trim() || "cliente"}. Seu pagamento foi confirmado. Baixe o e-book Fora do Balcão em: ${downloadUrl}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo rejected ebook email (${response.status}): ${detail.slice(0, 300)}`);
  }
}

type StripeCheckoutSession = {
  id?: string;
  payment_status?: string;
  metadata?: Record<string, string | null> | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

type StripeEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: StripeCheckoutSession;
  };
};

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("STRIPE_WEBHOOK_SECRET is missing.");
          return Response.json({ error: "Webhook unavailable." }, { status: 503 });
        }

        const signatureHeader = request.headers.get("stripe-signature");
        if (!signatureHeader) {
          return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
        }

        const rawBody = await request.text();
        const validSignature = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret);

        if (!validSignature) {
          console.warn("Rejected Stripe webhook with invalid signature.");
          return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
        }

        let event: StripeEvent;
        try {
          event = JSON.parse(rawBody) as StripeEvent;
        } catch {
          return Response.json({ error: "Invalid webhook body." }, { status: 400 });
        }

        if (
          event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded"
        ) {
          const session = event.data?.object;
          const isEbook = session?.metadata?.product === "sinalzero-ebook";
          const isPaid = session?.payment_status === "paid";

          if (isEbook && isPaid) {
            const sessionId = session?.id;
            const customerEmail = session?.customer_details?.email;

            if (!sessionId || !customerEmail) {
              console.error("Paid ebook session is missing fulfillment data.", {
                eventId: event.id,
                hasSessionId: Boolean(sessionId),
                hasCustomerEmail: Boolean(customerEmail),
              });
              return Response.json({ error: "Missing fulfillment data." }, { status: 500 });
            }

            const origin = new URL(request.url).origin;
            const downloadUrl = `${origin}/api/ebook/download?session_id=${encodeURIComponent(sessionId)}`;

            try {
              await sendEbookEmail({
                to: customerEmail,
                name: session?.customer_details?.name,
                downloadUrl,
              });
            } catch (error) {
              console.error("E-book email delivery failed.", {
                eventId: event.id,
                sessionId,
                message: error instanceof Error ? error.message : "Unknown error",
              });
              return Response.json({ error: "Fulfillment failed." }, { status: 500 });
            }

            console.info("Stripe ebook fulfilled.", {
              eventId: event.id,
              sessionId,
            });
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});
