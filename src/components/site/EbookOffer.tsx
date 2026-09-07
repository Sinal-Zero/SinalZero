import { useState } from "react";
import { ArrowUpRight, BookOpen, Check, LockKeyhole } from "lucide-react";
import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";

const BENEFITS = [
  "Plano prático para fortalecer a presença digital",
  "Conteúdo direto para pequenas e médias empresas",
  "Pagamento seguro processado pela Stripe",
];

export function EbookOffer() {
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    if (buying) return;
    setBuying(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Não foi possível iniciar o pagamento.");
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Não foi possível iniciar o pagamento.",
      );
      setBuying(false);
    }
  };

  return (
    <section id="ebook" className="relative overflow-hidden border-y border-border bg-surface/35 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_34%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-14">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold shadow-[0_12px_30px_-24px_rgba(245,124,0,.9)]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              E-book SinalZero
            </span>
          </Reveal>

          <h2 className="mt-5 max-w-[15ch] text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.65rem]">
            <BlurText as="span" text="Fora do Balcão: 7 dias para levar seu negócio ao digital." delay={45} stepDuration={0.3} />
          </h2>

          <Reveal as="p" delay={90} className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            Um guia direto para sair da presença digital improvisada e construir uma base mais clara, encontrável e confiável para o seu negócio.
          </Reveal>

          <ul className="mt-7 grid gap-3">
            {BENEFITS.map((benefit, index) => (
              <Reveal as="li" key={benefit} delay={120 + index * 45} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span>{benefit}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-[1.6rem] border border-border/90 bg-card/78 p-6 shadow-[0_28px_80px_-44px_rgba(0,0,0,.95)] backdrop-blur-xl sm:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_24%,transparent),transparent_68%)]" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Acesso digital</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">Compre o e-book</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                O valor e os métodos de pagamento são mostrados na página segura da Stripe antes da confirmação.
              </p>

              <button
                type="button"
                onClick={startCheckout}
                disabled={buying}
                className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-accent/35 bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_16px_38px_-22px_rgba(245,124,0,.9)] transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_46px_-22px_rgba(245,124,0,.98)] hover:brightness-105 disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none"
              >
                <span>{buying ? "Abrindo pagamento..." : "Comprar agora"}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Checkout seguro processado pela Stripe
              </div>

              {error ? (
                <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
