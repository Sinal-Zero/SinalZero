import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";
import { ContactConfirm } from "./ContactConfirm";
import { GradientText } from "./GradientText";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[84svh] items-center overflow-hidden pb-12 pt-20 sm:min-h-[86svh] sm:pb-16 sm:pt-24 lg:min-h-[90svh]"
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

        <h1 className="mx-auto mt-4 max-w-[13ch] text-balance font-display text-[clamp(2.2rem,7vw,3.75rem)] font-semibold leading-[1.05] sm:mt-5 sm:max-w-none">
          <BlurText
            as="span"
            text="Pare de perseguir o"
            animateBy="letters"
            delay={28}
            stepDuration={0.24}
            className="inline-flex"
          />{" "}
          <Reveal as="span" delay={120} className="inline-block">
            <GradientText className="inline-block block" animationSpeed={9}>
              cliente errado.
            </GradientText>
          </Reveal>
        </h1>

        <Reveal
          as="p"
          delay={145}
          className="mx-auto mt-4 max-w-[42ch] text-pretty px-2 text-[clamp(0.95rem,2.5vw,1.125rem)] leading-relaxed text-muted-foreground sm:mt-5 sm:px-4"
        >
          A SinalZero ensina o caminho no e-book Fora do Balcão e sustenta o crescimento com um SaaS que projeta sua empresa.
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-9 flex justify-center">
            <ContactConfirm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
