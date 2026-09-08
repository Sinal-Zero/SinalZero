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

      <div className="relative z-10 flex w-full max-w-[560px] flex-1 flex-col items-center">
        <div className="analisar-stagger flex flex-col items-center text-center">
          <img
            style={{ "--sz-i": 0 } as CSSProperties}
            src={RADAR_LOGO_SRC}
            alt="SinalZero"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <h1
            style={{ "--sz-i": 1 } as CSSProperties}
            className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Sinal<span className="text-accent">Zero</span>
          </h1>
          <p
            style={{ "--sz-i": 2 } as CSSProperties}
            className="mt-3 max-w-[42ch] text-pretty text-sm text-muted-foreground"
          >
            Presença digital mais clara, profissional e fácil de encontrar.
          </p>
          <p
            style={{ "--sz-i": 3 } as CSSProperties}
            className="mt-1 text-sm text-muted-foreground"
          >
            Escolha abaixo como deseja falar com a SinalZero.
          </p>
        </div>

        <div className="analisar-stagger mt-10 flex w-full flex-col gap-3.5">
          {LINKS.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                type="button"
                style={{ "--sz-i": index + 4 } as CSSProperties}
                onClick={() => setConfirmId(link.id)}
                className="group flex min-h-[4.5rem] w-full items-center gap-4 rounded-2xl border border-border/90 bg-surface/60 px-5 py-4 text-left shadow-[0_18px_50px_-32px_rgba(0,0,0,.9)] backdrop-blur-md transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-primary/12 text-accent">
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
