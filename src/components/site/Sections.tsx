import { Radar, MonitorSmartphone, Target, LineChart, ShieldCheck, Gauge } from "lucide-react";
import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
        <BlurText as="span" text={title} delay={45} stepDuration={1} />
      </h2>
      {description ? (
        <Reveal delay={90}>
          <BlurText
            text={description}
            delay={18}
            stepDuration={1}
            className="mt-5 text-pretty leading-relaxed text-muted-foreground"
          />
        </Reveal>
      ) : null}
    </div>
  );
}

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle
        title="Sinal claro no meio do ruído."
        description="A SinalZero é uma startup de prospecção inteligente de leads e construção de produtos digitais. Trabalhamos como um radar: varremos o mercado, identificamos quem realmente tem interesse no seu serviço e entregamos essas oportunidades prontas para o contato — junto com o site ou produto que sustenta a conversa."
      />
    </section>
  );
}

const SERVICES = [
  {
    icon: Radar,
    title: "Prospecção inteligente de leads",
    text: "Identificação e qualificação de empresas e pessoas com perfil real de compra, entregues de forma organizada para o seu time.",
  },
  {
    icon: MonitorSmartphone,
    title: "Criação de sites e produtos digitais",
    text: "Sites institucionais, páginas de conversão e produtos web construídos do zero, rápidos, acessíveis e prontos para receber tráfego.",
  },
  {
    icon: LineChart,
    title: "Evolução contínua",
    text: "Melhorias sobre o que já existe: performance, SEO, novas funcionalidades e ajustes guiados pelo comportamento de quem usa.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative border-y border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle title="O que a SinalZero entrega." />

        <ul className="grid-rise mt-12 grid gap-5 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.title} delay={i * 70}>
              <article className="interactive-panel group h-full rounded-lg border border-border bg-card/70 p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-accent transition-colors duration-300 group-hover:bg-primary/25">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <BlurText
                  as="h3"
                  text={service.title}
                  delay={35}
                  stepDuration={1}
                  className="mt-6 font-display text-lg font-semibold"
                />
                <BlurText
                  text={service.text}
                  delay={14}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                />
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Calibragem",
    text: "Entendemos o objetivo, o público e os critérios do que é um bom cliente para você.",
  },
  {
    step: "02",
    title: "Varredura",
    text: "Mapeamos o mercado e filtramos apenas os sinais com potencial real de negócio.",
  },
  {
    step: "03",
    title: "Construção",
    text: "Criamos ou ajustamos o site e o produto que recebem essas oportunidades.",
  },
  {
    step: "04",
    title: "Ajuste fino",
    text: "Medimos, testamos e refinamos — a operação segue viva depois da entrega.",
  },
];

export function Process() {
  return (
    <section id="processo" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle title="Da descoberta ao contato, em quatro passos." />

      <ol className="grid-rise mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, i) => (
          <Reveal as="li" key={item.step} delay={i * 60}>
            <div className="interactive-panel relative h-full rounded-lg border border-border bg-card/50 p-6">
              <span
                className="font-display text-4xl font-semibold text-primary/35"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <BlurText
                as="h3"
                text={item.title}
                delay={35}
                stepDuration={1}
                className="mt-4 font-display text-base font-semibold"
              />
              <BlurText
                text={item.text}
                delay={14}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              />
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

const DIFFERENTIALS = [
  {
    icon: Target,
    title: "Foco em oportunidade real",
    text: "Preferimos poucos contatos certos a uma lista grande e fria.",
  },
  {
    icon: Gauge,
    title: "Performance como requisito",
    text: "Carregamento rápido, SEO e conversão fazem parte da entrega, não de uma fase futura.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e acessibilidade desde o início",
    text: "Boas práticas aplicadas na construção, não corrigidas depois.",
  },
];

export function Differentials() {
  return (
    <section className="relative border-y border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle title="Por que a SinalZero." />

        <div className="grid-rise mt-12 grid gap-10 md:grid-cols-3">
          {DIFFERENTIALS.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="group">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-gold/12 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <BlurText
                  as="h3"
                  text={item.title}
                  delay={35}
                  stepDuration={1}
                  className="mt-5 font-display text-lg font-semibold"
                />
                <BlurText
                  text={item.text}
                  delay={14}
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SOLUTIONS = [
  {
    title: "Listas de leads qualificados",
    text: "Oportunidades filtradas pelo perfil que você definiu, prontas para abordagem.",
  },
  {
    title: "Sites institucionais e páginas de conversão",
    text: "Presença digital clara, rápida e feita para gerar contato.",
  },
  {
    title: "Produtos web sob medida",
    text: "Ferramentas internas e produtos digitais construídos e mantidos com o time.",
  },
];

export function Solutions() {
  return (
    <section id="solucoes" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle
        title="Formatos de entrega."
        description="A SinalZero é uma operação nova: em vez de vitrine de cases, mostramos exatamente o que entregamos hoje."
      />

      <div className="grid-rise mt-12 grid gap-5 md:grid-cols-3">
        {SOLUTIONS.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <article className="interactive-panel group relative h-full overflow-hidden rounded-lg border border-border bg-card/60 p-7">
              <span
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-primary)_30%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <BlurText
                as="h3"
                text={item.title}
                delay={35}
                stepDuration={1}
                className="relative font-display text-lg font-semibold"
              />
              <BlurText
                text={item.text}
                delay={14}
                className="relative mt-3 text-sm leading-relaxed text-muted-foreground"
              />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
