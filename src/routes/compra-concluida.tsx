import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/compra-concluida")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({
    meta: [
      { title: "Compra concluída — SinalZero" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PurchaseComplete,
});

function PurchaseComplete() {
  const { session_id: sessionId } = Route.useSearch();
  const [state, setState] = useState<"checking" | "paid" | "pending">("checking");

  useEffect(() => {
    if (!sessionId) {
      setState("pending");
      return;
    }

    const controller = new AbortController();

    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json()) as { paid?: boolean };
        setState(response.ok && data.paid ? "paid" : "pending");
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") setState("pending");
      });

    return () => controller.abort();
  }, [sessionId]);

  const paid = state === "paid";

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-background px-5 py-16 sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,color-mix(in_oklab,var(--color-accent)_15%,transparent),transparent_34%)]" />

      <section className="relative mx-auto w-full max-w-xl rounded-[1.75rem] border border-border/90 bg-card/80 p-6 text-center shadow-[0_30px_90px_-42px_rgba(0,0,0,.95)] backdrop-blur-xl sm:p-9">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent shadow-[0_14px_34px_-24px_rgba(245,124,0,.95)]">
          {state === "checking" ? (
            <Clock3 className="h-6 w-6 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          ) : paid ? (
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          )}
        </div>

        <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
          {state === "checking" ? "Verificando pagamento" : paid ? "Pagamento confirmado" : "Pagamento em verificação"}
        </p>

        <h1 className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl">
          {state === "checking"
            ? "Só um instante."
            : paid
              ? "Compra concluída com sucesso."
              : "Ainda não conseguimos confirmar o pagamento."}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {paid
            ? "Seu pagamento foi confirmado pela Stripe. A entrega automática do e-book será vinculada a esta compra na próxima etapa da configuração."
            : state === "checking"
              ? "Estamos consultando o status da sua compra diretamente na Stripe."
              : "Se você acabou de pagar, aguarde alguns instantes. Em métodos que não confirmam na hora, a aprovação pode acontecer depois."}
        </p>

        {paid ? (
          <div className="mx-auto mt-6 flex max-w-sm items-start gap-3 rounded-xl border border-border bg-surface/55 p-4 text-left">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Não feche seus comprovantes. Assim que a automação de entrega estiver ativada, o acesso será liberado somente após confirmação real do pagamento.
            </p>
          </div>
        ) : null}

        <Link
          to="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface"
        >
          Voltar para a SinalZero
        </Link>
      </section>
    </main>
  );
}
