import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { RadarBackdrop } from "./RadarBackdrop";
import { LINKTREE_URL } from "./constants";
import radarLogo from "@/assets/sinalzero-radar.svg.asset.json";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <RadarBackdrop />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/60 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold">
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
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A SinalZero encontra e qualifica oportunidades reais para empresas que querem vender
              mais — e constrói os sites e produtos digitais que transformam esse interesse em
              conversa.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-10">
              <a
                href={LINKTREE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_16px_40px_-16px_color-mix(in_oklab,var(--color-accent)_75%,transparent)]"
              >
                Falar com a SinalZero
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="hidden justify-self-center lg:block">
          <img
            src={radarLogo.url}
            alt="Logo da SinalZero: um radar em azul-marinho com brilho laranja"
            width={340}
            height={340}
            className="h-[340px] w-[340px] drop-shadow-[0_30px_80px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
