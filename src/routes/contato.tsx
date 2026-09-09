import { useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
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
    description: "Converse diretamente sobre seu negócio.",
    href: WHATSAPP_URL,
  },
  {
    id: "instagram",
    icon: Instagram,
    label: "Instagram",
    description: "Conheça o perfil e acompanhe a SinalZero.",
    href: INSTAGRAM_URL,
  },
] as const;

type LinkId = (typeof LINKS)[number]["id"];

export const Route = createFileRoute("/contato")({
  component: Contato,
});

function Contato() {
  const [confirmId, setConfirmId] = useState<LinkId | null>(null);
  const active = LINKS.find(link => link.id === confirmId) ?? null;

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-4 py-4 sm:px-6">
      <RadarBackdrop className="pointer-events-none absolute inset-0 opacity-20" />

      <div
        className="relative flex w-full flex-col overflow-hidden rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_92%,transparent),color-mix(in_oklab,var(--color-card)_88%,transparent))] px-6 py-9 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)] sm:px-8 sm:py-11"
        style={{
          width: "min(calc(100vw - 32px), 600px)",
          minHeight: "calc(100svh - 32px)",
        }}
      >
        {/* Faint inner highlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-60"
          style={{
            background:
              "radial-gradient(120% 60% at 50% 0%, color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Top nav */}
        <div className="relative flex items-center justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Voltar ao site
          </Link>
        </div>

        {/* Header */}
        <div className="relative mt-6 flex flex-col items-center text-center">
          <img
            src={RADAR_LOGO_SRC}
            alt="SinalZero"
            className="h-20 w-20 sm:h-24 sm:w-24"
          />
          <span className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-[28px]">
            Sinal<span className="text-accent">Zero</span>
          </span>
          <p className="mt-3 max-w-[36ch] text-sm text-muted-foreground">
            Presença digital mais clara, profissional e fácil de encontrar.
          </p>
          <p className="mt-1 max-w-[36ch] text-sm text-muted-foreground/80">
            Escolha como deseja falar com a SinalZero.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
            Canais ativos
          </p>
        </div>

        {/* Links */}
        <div className="relative mt-9 w-full space-y-3.5 sm:mt-10">
          {LINKS.map((link, index) => (
            <button
              key={link.id}
              type="button"
              style={{ "--sz-i": index + 5 } as CSSProperties}
              onClick={() => setConfirmId(link.id)}
              className="group flex h-[76px] w-full items-center gap-4 rounded-[20px] border border-border/90 bg-background/50 px-5 text-left transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-primary/12 text-accent transition-colors duration-200 group-hover:border-accent/35">
                <link.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="block font-display text-base font-semibold text-foreground">
                  {link.label}
                </div>
                <div className="block truncate text-sm text-muted-foreground">
                  {link.description}
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-accent"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        {/* Flexible spacer pushes footer down, like reference layout */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="relative mt-8 flex w-full items-center justify-center text-xs text-muted-foreground">
          <span>© SinalZero</span>
        </div>
      </div>

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
