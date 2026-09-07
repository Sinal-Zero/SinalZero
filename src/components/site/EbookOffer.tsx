import { ArrowUpRight, BookOpen, Download, Mail, ShieldCheck } from "lucide-react";

import { Reveal } from "./Reveal";
import { KIWIFY_EBOOK_URL } from "./constants";

const benefits = [
  {
    icon: BookOpen,
    title: "Aplicação prática",
    text: "Um roteiro direto para organizar a presença digital do negócio e transformar atenção em oportunidade.",
  },
  {
    icon: Download,
    title: "Acesso digital",
    text: "Após a aprovação, o conteúdo fica disponível pela experiência de entrega configurada na Kiwify.",
  },
  {
    icon: Mail,
    title: "Acesso também por e-mail",
    text: "Se o acesso imediato não funcionar como esperado, a Kiwify também envia as instruções para o e-mail informado na compra.",
  },
];

export function EbookOffer() {
  return (
    <section id="ebook" className="relative overflow-hidden border-y border-border/70 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_35%,color-mix(in_oklab,var(--color-accent)_10%,transparent),transparent_30%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14">
        <div>
          <Reveal>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">Produto digital</p>
          </Reveal>

          <Reveal delay={50}>
            <h2 className="mt-4 max-w-[13ch] text-balance font-display text-3xl font-semibold leading-[1.06] sm:text-4xl lg:text-5xl">
              Fora do Balcão: 7 dias para levar seu negócio ao digital.
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Um guia objetivo para pequenas e médias empresas que querem estruturar melhor a presença digital, ganhar clareza e começar a agir sem complicação.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={70 + index * 35}>
                <div className="h-full rounded-2xl border border-border/80 bg-surface/45 p-4 backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-accent/25 hover:bg-surface/65 hover:shadow-[0_18px_48px_-30px_rgba(245,124,0,.55)]">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={100}>
          <div className="relative overflow-hidden rounded-[1.9rem] border border-accent/20 bg-card/82 p-6 shadow-[0_28px_90px_-46px_rgba(245,124,0,.85)] backdrop-blur-xl sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1.5 text-xs font-medium text-gold">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Checkout pela Kiwify
              </div>

              <h3 className="mt-6 text-balance font-display text-2xl font-semibold sm:text-3xl">
                Comece pelo essencial e coloque sua presença digital em movimento.
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                O pagamento e a liberação do acesso são processados pela Kiwify. O arquivo original também permanece preservado no armazenamento privado da SinalZero como cópia de segurança.
              </p>

              <a
                href={KIWIFY_EBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex min-h-12 w-full items-center justify-between rounded-xl border border-accent/30 bg-accent px-4 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_18px_42px_-24px_rgba(245,124,0,.95)] transition-[transform,box-shadow,filter] duration-250 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-22px_rgba(245,124,0,.98)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80"
              >
                <span>Comprar e-book</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                Após a compra, guarde o e-mail usado no checkout: ele é a sua rota alternativa de acesso ao produto.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
