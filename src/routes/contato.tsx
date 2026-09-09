import { useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadarBackdrop } from "@/components/site/RadarBackdrop";
import { RedirectConfirm } from "@/components/site/RedirectConfirm";

const RADAR_LOGO_SRC = "/radar-logo.svg";

const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da SinalZero e gostaria de conversar sobre como melhorar a presença digital do meu negócio.";
const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=5519998265589&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const INSTAGRAM_URL = "https://www.instagram.com/sinalzero.app/";

const LINKS = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "Falar pelo WhatsApp",
    description: "Converse diretamente com a SinalZero sobre seu negócio.",
    href: WHATSAPP_URL,
    eyebrow: "CONTATO",
    title: "Você será direcionado ao WhatsApp.",
    confirmDescription:
      "Uma conversa com a SinalZero será aberta com uma mensagem inicial já preparada para você.",
    destination: "WhatsApp",
    continueLabel: "Continuar para o WhatsApp",
  },
  {
    id: "instagram",
    icon: Instagram,
    label: "Instagram",
    description: "Conheça a SinalZero e acompanhe nosso trabalho.",
    href: INSTAGRAM_URL,
    eyebrow: "REDE SOCIAL",
    title: "Você será direcionado ao Instagram da SinalZero.",
    confirmDescription: "Você poderá conhecer nosso perfil e acompanhar a SinalZero por lá.",
    destination: "Instagram",
    continueLabel: "Continuar para o Instagram",
  },
] as const;

type LinkId = (typeof LINKS)[number]["id"];

export const Route = createFileRoute("/contato")({
  component: Contato,
});

function Contato() {
  const [confirmId, setConfirmId] = useState<LinkId | null>(null);
  const active = LINKS.find((link) => link.id === confirmId) ?? null;

  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-background px-5 py-14 sm:px-8">
      <RadarBackdrop className="opacity-70" />

      <div className="relative z-10 flex w-full max-w-[600px] flex-1 flex-col items-center justify-center">
        <div className="analisar-fade relative w-full overflow-hidden rounded-[1.75rem] border border-border/80 bg-[linear-gradient(175deg,color-mix(in_oklab,var(--color-surface)_92%,transparent),color-mix(in_oklab,var(--color-card)_88%,transparent))] px-6 py-9 shadow-[0_40px_120px_-48px_rgba(0,0,0,.95)] backdrop-blur-md sm:px-9 sm:py-11">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-gold)_22%,transparent),transparent_70%)] blur-2xl" />

          <div className="analisar-stagger relative flex flex-col items-center text-center">
            <img
              style={{ "--sz-i": 0 } as CSSProperties}
              src={RADAR_LOGO_SRC}
              alt="SinalZero"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span
              style={{ "--sz-i": 1 } as CSSProperties}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-emerald-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Canais ativos
            </span>
            <h1
              style={{ "--sz-i": 2 } as CSSProperties}
              className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground"
            >
              Sinal<span className="text-accent">Zero</span>
            </h1>
            <p
              style={{ "--sz-i": 3 } as CSSProperties}
              className="mt-3 max-w-[42ch] text-pretty text-sm text-muted-foreground"
            >
              Presença digital mais clara, profissional e fácil de encontrar.
            </p>
            <p
              style={{ "--sz-i": 4 } as CSSProperties}
              className="mt-1 text-sm text-muted-foreground"
            >
              Escolha como deseja falar com a SinalZero.
            </p>
          </div>

          <div className="analisar-stagger relative mt-8 flex w-full flex-col gap-3">
            {LINKS.map((link, index) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  type="button"
                  style={{ "--sz-i": index + 5 } as CSSProperties}
                  onClick={() => setConfirmId(link.id)}
                  className="group flex h-12 w-full items-center gap-4 rounded-full border border-border/90 bg-background/50 px-7 py-3 text-left transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:h-13 sm:px-8"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-primary/12 text-accent transition-colors duration-200 group-hover:border-accent/35">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-semibold text-foreground">
                      {link.label}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-accent"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="analisar-fade relative z-10 mt-14 flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <Link
          to="/"
          className="rounded-md px-2 py-1 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Voltar ao site
        </Link>
        <span>© SinalZero</span>
      </footer>

      {active ? (
        <RedirectConfirm
          open={confirmId !== null}
          onOpenChange={(next) => setConfirmId(next ? active.id : null)}
          href={active.href}
          eyebrow={active.eyebrow}
          title={active.title}
          description={active.confirmDescription}
          destination={active.destination}
          continueLabel={active.continueLabel}
        />
      ) : null}
    </main>
  );
}
