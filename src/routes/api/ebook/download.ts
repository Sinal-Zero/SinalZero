import { createFileRoute } from "@tanstack/react-router";

const EBOOK_BUCKET = "ebooks";
const EBOOK_PATH = "fora-do-balcao.pdf";

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
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

        if (!stripeSecret || !supabaseUrl || !supabaseSecret) {
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
          console.error("Unable to validate Stripe checkout session.", stripeResponse.status);
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

        let storageOrigin: URL;
        try {
          storageOrigin = new URL(supabaseUrl);
        } catch {
          return new Response("Storage do e-book não configurado.", { status: 503 });
        }

        if (storageOrigin.protocol !== "https:") {
          return new Response("Storage do e-book não configurado.", { status: 503 });
        }

        const objectPath = `${encodeURIComponent(EBOOK_BUCKET)}/${EBOOK_PATH.split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/")}`;
        const storageUrl = new URL(`/storage/v1/object/${objectPath}`, storageOrigin);

        const fileResponse = await fetch(storageUrl, {
          headers: {
            Authorization: `Bearer ${supabaseSecret}`,
            apikey: supabaseSecret,
            Accept: "application/pdf",
          },
        });

        if (!fileResponse.ok || !fileResponse.body) {
          const detail = await fileResponse.text().catch(() => "");
          console.error("Unable to fetch private ebook from Supabase Storage.", {
            status: fileResponse.status,
            detail: detail.slice(0, 240),
          });
          return new Response("Não foi possível carregar o e-book.", { status: 502 });
        }

        return new Response(fileResponse.body, {
          headers: {
            "Content-Type": fileResponse.headers.get("content-type") || "application/pdf",
            "Content-Disposition": 'attachment; filename="fora-do-balcao-sinalzero.pdf"',
            "Cache-Control": "private, no-store, max-age=0",
            Pragma: "no-cache",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
