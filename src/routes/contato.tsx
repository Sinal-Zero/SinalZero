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
    <main className="min-h-[100svh] flex flex-col items-center justify-start px-4 sm:px-6 bg-background relative">
      <RadarBackdrop className="absolute inset-0 pointer-events-none opacity-20" />
      <div className="flex-1 flex-col w-full max-w-[560px] items-center py-12">
        {/* Logo */}
        <img
          src={RADAR_LOGO_SRC}
          alt="SinalZero"
          className="h-10 w-10 mb-2"
        />
        {/* Brand */}
        <span className="font-display text-2xl font-bold tracking-tight">
          Sinal<span className="text-accent">Zero</span>
        </span>
        {/* Description */}
        <p className="mt-2 max-w-[38ch] text-center text-sm text-muted-foreground">
          Presença digital mais clara, profissional e fácil de encontrar.
        </p>
        {/* Status */}
        <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
          Canais ativos
        </p>
        {/* Spacer */}
        <div className="mt-8 flex-1 w-full"></div>
        {/* Links */}
        <div className="w-full space-y-4">
          {LINKS.map((link, index) => (
            <button
              key={link.id}
              type="button"
              style={{ "--sz-i": index + 5 } as CSSProperties}
              onClick={() => setConfirmId(link.id)}
              className="group flex h-12 w-full items-center px-5 py-3 rounded-xl border border-border/90 bg-background/50 text-left transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:-translate-y-0.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-primary/12 text-accent transition-colors duration-200 group-hover:border-accent/35">
                <link.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="block font-display text-base font-semibold text-foreground">
                  {link.label}
                </div>
                <div className="block text-sm text-muted-foreground">
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
        {/* Footer */}
        <div className="mt-6 flex w-full items-center justify-between text-xs text-muted-foreground">
          <Link to="/" className="rounded-md px-2 py-1 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
            Voltar ao site
          </Link>
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