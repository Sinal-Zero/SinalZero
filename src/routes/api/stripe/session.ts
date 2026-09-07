import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stripe/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
          return Response.json({ paid: false }, { status: 503 });
        }

        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id");
        if (!sessionId || !sessionId.startsWith("cs_")) {
          return Response.json({ paid: false }, { status: 400 });
        }

        const stripeResponse = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
          {
            headers: { Authorization: `Bearer ${secretKey}` },
          },
        );

        if (!stripeResponse.ok) {
          return Response.json({ paid: false }, { status: 502 });
        }

        const session = (await stripeResponse.json()) as {
          payment_status?: string;
          status?: string;
        };

        return Response.json({
          paid: session.payment_status === "paid",
          complete: session.status === "complete",
        });
      },
    },
  },
});
