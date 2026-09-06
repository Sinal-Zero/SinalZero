import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { RadarBackdrop } from "./RadarBackdrop";
import { LINKTREE_URL } from "./constants";

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
          <Button asChild variant="signal" size="signal" className="mt-9">
            <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" className="group">
              Falar com a SinalZero
              <ArrowUpRight
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
