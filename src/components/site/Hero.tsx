import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";
import { ContactConfirm } from "./ContactConfirm";
import { GradientText } from "./GradientText";
import { ScrollReveal } from "./ScrollReveal";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[88svh] items-center overflow-hidden pb-20 pt-28 lg:min-h-[92svh]"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <BlurText
            text="Seu próximo cliente já deixou um sinal"
            stepDuration={0.325}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/60 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold"
          />
        </Reveal>

        <h1 className="mt-7 text-balance font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
          <BlurText as="span" text="Pare de perseguir o" delay={90} stepDuration={0.325} />{" "}
          <GradientText className="inline-block" animationSpeed={7}>
            cliente errado.
          </GradientText>
        </h1>

        <Reveal delay={170}>
          <ScrollReveal className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Enquanto você perde tempo com listas frias e uma presença digital que não converte, a
            SinalZero encontra quem já demonstra interesse, qualifica o sinal e transforma atenção
            em conversa.
          </ScrollReveal>
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
