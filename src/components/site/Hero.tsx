import { ArrowUpRight, Radar, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { RadarBackdrop } from "./RadarBackdrop";
import { LINKTREE_URL } from "./constants";

const SIGNALS = [
  { icon: Radar, label: "Prospecção ativa e contínua" },
  { icon: Target, label: "Leads qualificados, não listas frias" },
  { icon: Sparkles, label: "Produto digital incluído na entrega" },
];

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[88svh] items-center overflow-hidden pb-20 pt-28 lg:min-h-[92svh]"
    >
      <RadarBackdrop />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/60 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold">
            Prospecção inteligente de leads
          </p>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="mt-7 text-balance font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            Captamos o <span className="text-gradient-gold">sinal</span> dos seus próximos
            clientes.
          </h1>
        </Reveal>

        <Reveal delay={170}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A SinalZero encontra e qualifica oportunidades reais para empresas que querem vender
            mais — e constrói os sites e produtos digitais que transformam esse interesse em
            conversa.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-9 flex justify-center">
            <Button asChild variant="signal" size="signal">
              <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" className="group">
                Falar com a SinalZero
                <ArrowUpRight
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/60 pt-8">
            {SIGNALS.map((signal) => (
              <li
                key={signal.label}
                className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
              >
                <signal.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {signal.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
