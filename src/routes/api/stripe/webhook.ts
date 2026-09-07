import { createFileRoute } from "@tanstack/react-router";

const SIGNATURE_TOLERANCE_SECONDS = 300;

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
            console.info("Stripe ebook payment confirmed.", {
              eventId: event.id,
              sessionId: session?.id,
              customerEmail: session?.customer_details?.email ?? null,
            });
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});
