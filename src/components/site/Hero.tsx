import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";
import { GradientText } from "./GradientText";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[86svh] items-center overflow-hidden pb-16 pt-24 sm:min-h-[88svh] sm:pb-20 sm:pt-28 lg:min-h-[92svh]"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
        <Reveal>
          <BlurText
            text="Seu próximo cliente já deixou um sinal"
            delay={42}
            stepDuration={0.25}
            className="mx-auto inline-flex max-w-[92vw] items-center justify-center gap-2 rounded-full border border-accent/30 bg-surface/60 px-3.5 py-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-gold shadow-[0_10px_30px_-22px_rgba(245,124,0,.75)] backdrop-blur-md sm:px-4 sm:text-xs sm:tracking-[0.22em]"
          />
        </Reveal>

        <h1 className="mx-auto mt-6 max-w-[12ch] text-balance font-display text-[clamp(2.35rem,9vw,4rem)] font-semibold leading-[1.02] sm:mt-7 sm:max-w-none sm:text-5xl lg:text-6xl">
          <BlurText
            as="span"
            text="Pare de perseguir o"
            animateBy="letters"
            delay={28}
            stepDuration={0.24}
            className="inline-flex"
          />{" "}
          <Reveal as="span" delay={120} className="inline-block">
            <GradientText className="inline-block" animationSpeed={9}>
              cliente errado.
            </GradientText>
          </Reveal>
        </h1>

        <Reveal
          as="p"
          delay={145}
          className="mx-auto mt-5 max-w-xl text-pretty px-1 text-[0.98rem] leading-7 text-muted-foreground sm:mt-6 sm:px-0 sm:text-lg sm:leading-relaxed"
        >
          Enquanto você perde tempo com listas frias e uma presença digital que não converte, a
          SinalZero encontra quem já demonstra interesse, qualifica o sinal e transforma atenção em
          conversa.
        </Reveal>
      </div>
    </section>
  );
}
