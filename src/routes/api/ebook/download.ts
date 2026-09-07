import { createFileRoute } from "@tanstack/react-router";

type StripeSession = {
  payment_status?: string;
  status?: string;
  metadata?: Record<string, string | null> | null;
};

export const Route = createFileRoute("/api/ebook/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const stripeSecret = process.env.STRIPE_SECRET_KEY;
        const ebookFileUrl = process.env.EBOOK_FILE_URL;

        if (!stripeSecret || !ebookFileUrl) {
          console.error("E-book delivery environment variables are missing.");
          return new Response("Entrega temporariamente indisponível.", { status: 503 });
        }

        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id");
        if (!sessionId || !sessionId.startsWith("cs_")) {
          return new Response("Compra inválida.", { status: 400 });
        }

        const stripeResponse = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
          {
            headers: { Authorization: `Bearer ${stripeSecret}` },
          },
        );

        if (!stripeResponse.ok) {
          return new Response("Não foi possível validar a compra.", { status: 502 });
        }

        const session = (await stripeResponse.json()) as StripeSession;
        const authorized =
          session.status === "complete" &&
          session.payment_status === "paid" &&
          session.metadata?.product === "sinalzero-ebook";

        if (!authorized) {
          return new Response("Pagamento não confirmado.", { status: 403 });
        }

        let sourceUrl: URL;
        try {
          sourceUrl = new URL(ebookFileUrl);
        } catch {
          return new Response("Arquivo do e-book não configurado.", { status: 503 });
        }

        if (sourceUrl.protocol !== "https:") {
          return new Response("Arquivo do e-book não configurado.", { status: 503 });
        }

        const fileResponse = await fetch(sourceUrl, {
          headers: { Accept: "application/pdf" },
        });

        if (!fileResponse.ok || !fileResponse.body) {
          console.error("Unable to fetch configured ebook file.", fileResponse.status);
          return new Response("Não foi possível carregar o e-book.", { status: 502 });
        }

        return new Response(fileResponse.body, {
          headers: {
            "Content-Type": fileResponse.headers.get("content-type") || "application/pdf",
            "Content-Disposition": 'attachment; filename="fora-do-balcao-sinalzero.pdf"',
            "Cache-Control": "private, no-store, max-age=0",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
