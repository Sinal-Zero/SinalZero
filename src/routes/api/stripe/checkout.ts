import { createFileRoute } from "@tanstack/react-router";

const STRIPE_CHECKOUT_URL = "https://api.stripe.com/v1/checkout/sessions";

export const Route = createFileRoute("/api/stripe/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const priceId = process.env.STRIPE_EBOOK_PRICE_ID;

        if (!secretKey || !priceId) {
          console.error("Stripe environment variables are missing.");
          return Response.json(
            { error: "Pagamento temporariamente indisponível." },
            { status: 503 },
          );
        }

        const origin = new URL(request.url).origin;
        const body = new URLSearchParams();
        body.set("mode", "payment");
        body.set("line_items[0][price]", priceId);
        body.set("line_items[0][quantity]", "1");
        body.set("success_url", `${origin}/compra-concluida?session_id={CHECKOUT_SESSION_ID}`);
        body.set("cancel_url", `${origin}/?checkout=cancelado#ebook`);
        body.set("submit_type", "pay");
        body.set("locale", "pt-BR");
        body.set("metadata[product]", "sinalzero-ebook");

        const stripeResponse = await fetch(STRIPE_CHECKOUT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const session = (await stripeResponse.json()) as {
          id?: string;
          url?: string | null;
          error?: { message?: string };
        };

        if (!stripeResponse.ok || !session.url) {
          console.error("Stripe checkout creation failed:", session.error?.message);
          return Response.json(
            { error: "Não foi possível iniciar o pagamento. Tente novamente." },
            { status: 502 },
          );
        }

        return Response.json({ url: session.url });
      },
    },
  },
});
