import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { RadarBackdrop } from "./RadarBackdrop";
import { LINKTREE_URL } from "./constants";

export function ContactCta() {
  return (
    <section id="contato" className="relative overflow-hidden border-t border-border py-28">
      <RadarBackdrop className="opacity-60" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
            Vamos ligar o radar no seu negócio?
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Conte o que você quer alcançar. A partir daí, definimos juntos o caminho mais curto até
            os próximos clientes.
          </p>
        </Reveal>
        <Reveal delay={170}>
          <a
            href={LINKTREE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_16px_40px_-16px_color-mix(in_oklab,var(--color-accent)_75%,transparent)]"
          >
            Falar com a SinalZero
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
