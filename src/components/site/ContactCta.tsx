import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { RadarBackdrop } from "./RadarBackdrop";
import { ContactConfirm } from "./ContactConfirm";

export function ContactCta() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden border-t border-border py-24 sm:py-28"
    >
      <RadarBackdrop className="opacity-60" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          <SplitText segments="Vamos ligar o radar no seu negócio?" unit="word" stagger={50} />
        </h2>
        <Reveal delay={90}>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Conte o que você quer alcançar. A partir daí, definimos juntos o caminho mais curto até
            os próximos clientes.
          </p>
        </Reveal>
        <Reveal delay={170}>
          <div className="mt-9 flex justify-center">
            <ContactConfirm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
