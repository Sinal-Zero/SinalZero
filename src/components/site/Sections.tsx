import {
  BookOpen,
  Radar,
  LineChart,
  Target,
  Gauge,
  ShieldCheck,
  Clock3,
  EyeOff,
  WalletCards,
  Building2,
  Handshake,
  Globe,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { BlurText } from "./BlurText";

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-balance font-display text-2xl font-semibold sm:text-3xl">
        <BlurText as="span" text={title} delay={45} stepDuration={0.325} />
      </h2>
      {description ? (
        <Reveal
          as="p"
          delay={90}
          className="mt-5 text-pretty leading-relaxed text-muted-foreground"
        >
          {description}
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
        description="A SinalZero ajuda empresas a construir presença digital de verdade e a entender o próprio sinal de mercado. Ensinamos o caminho no e-book Fora do Balcão e sustentamos o crescimento contínuo com um SaaS que projeta sua empresa para mais clientes e aumenta o fluxo do negócio."
      />
    </section>
  );
}

const CLIENT_PAINS = [
  {
    icon: Clock3,
    title: "Seu negócio decide no escuro",
    text: "Sem sinal claro sobre o próprio mercado, cada decisão de crescimento vira tentativa e erro.",
  },
  {
    icon: EyeOff,
    title: "Sua presença não é encontrada",
    text: "Quando o cliente pesquisa, um site lento ou genérico faz sua empresa desaparecer antes do primeiro contato.",
  },
  {
    icon: WalletCards,
    title: "Crescimento fica no acaso",
    text: "Sem ferramenta e sem direção, cada tentativa de atrair cliente novo custa tempo sem previsibilidade.",
  },
];

export function ClientPains() {
  return (
    <section className="relative border-y border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <SectionTitle
          title="O problema não é falta de clientes. É excesso de ruído."
          description="A SinalZero existe para trazer clareza sobre o seu mercado e colocar a máquina de crescimento para rodar sozinha."
        />

        <ul className="grid-rise mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {CLIENT_PAINS.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <article className="interactive-panel group h-full rounded-lg border border-border bg-card/70 p-7 text-center">
                <item.icon
                  className="mx-auto h-6 w-6 text-ember transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                  aria-hidden="true"
                />
                <BlurText
                  as="h3"
                  text={item.title}
                  delay={35}
                  stepDuration={0.325}
                  className="mt-6 font-display text-lg font-semibold"
                />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PRODUCTS = [
  {
    icon: BookOpen,
    title: "E-book Fora do Balcão",
    text: "Guia direto para entender seu sinal de mercado e estruturar a presença digital do seu negócio, sem enrolação.",
  },
  {
    icon: Radar,
    title: "SaaS SinalZero",
    text: "Plataforma que projeta sua empresa para mais clientes e aumenta o fluxo de oportunidades de forma contínua.",
  },
  {
    icon: LineChart,
    title: "Acompanhamento contínuo",
    text: "Resultados medidos e ajustes guiados pelo uso real da plataforma — não um produto estático.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative border-y border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <SectionTitle title="O que a SinalZero entrega." />

        <ul className="grid-rise mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <Reveal as="li" key={product.title} delay={i * 70}>
              <article className="interactive-panel group h-full rounded-lg border border-border bg-card/70 p-7 text-center">
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/25">
                  <product.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <BlurText
                  as="h3"
                  text={product.title}
                  delay={35}
                  stepDuration={0.325}
                  className="mt-6 font-display text-lg font-semibold"
                />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.text}</p>
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
    title: "Diagnóstico",
    text: "Entendemos o momento do seu negócio e o que falta para gerar mais sinal de mercado.",
  },
  {
    step: "02",
    title: "Fundamentos",
    text: "Você aplica o e-book Fora do Balcão para estruturar a base da presença digital.",
  },
  {
    step: "03",
    title: "Ativação do SaaS",
    text: "Configuramos a plataforma para projetar sua empresa e captar fluxo de clientes continuamente.",
  },
  {
    step: "04",
    title: "Acompanhamento",
    text: "Medimos resultados e ajustamos a operação com o tempo.",
  },
];

export function Process() {
  return (
    <section id="processo" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle title="Do diagnóstico ao fluxo contínuo, em quatro passos." />

      <ol className="grid-rise mx-auto mt-12 grid max-w-5xl gap-5 text-center sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, i) => (
          <Reveal as="li" key={item.step} delay={i * 60}>
            <div className="interactive-panel group relative h-full rounded-lg border border-border bg-card/50 p-6 text-center">
              <span
                className="process-step-number font-display text-4xl font-semibold text-primary/35 transition-colors duration-500 group-hover:text-accent"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <BlurText
                as="h3"
                text={item.title}
                delay={35}
                stepDuration={0.325}
                className="mt-4 font-display text-base font-semibold"
              />
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
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
    title: "Foco em sinal real",
    text: "Preferimos decisões guiadas por sinal de mercado a apostas genéricas de marketing.",
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
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <SectionTitle title="Por que a SinalZero." />

        <div className="grid-rise mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-3">
          {DIFFERENTIALS.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="group text-center">
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-md bg-gold/12 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transition-none">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <BlurText
                  as="h3"
                  text={item.title}
                  delay={35}
                  stepDuration={0.325}
                  className="mt-5 font-display text-lg font-semibold"
                />
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHO_FOR = [
  {
    icon: Building2,
    title: "Pequenas e médias empresas",
    text: "Negócios que precisam estruturar a presença digital antes de escalar o crescimento.",
  },
  {
    icon: Handshake,
    title: "Prestadores de serviço de ticket alto",
    text: "Consultorias, agências e especialistas que precisam de fluxo constante de clientes qualificados.",
  },
  {
    icon: Globe,
    title: "Negócios sem presença digital forte",
    text: "Empresas que perdem cliente porque o site não passa confiança — ou porque ainda não existe.",
  },
];

export function WhoItsFor() {
  return (
    <section id="para-quem" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle
        title="Para quem a SinalZero faz sentido."
        description="Não somos para todo mundo. Trabalhamos melhor com quem já sabe o que vende e precisa de mais sinal, não de mais ruído."
      />

      <ul className="grid-rise mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {WHO_FOR.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 70}>
            <article className="interactive-panel group h-full rounded-lg border border-border bg-card/70 p-7 text-center">
              <item.icon
                className="mx-auto h-6 w-6 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                aria-hidden="true"
              />
              <BlurText
                as="h3"
                text={item.title}
                delay={35}
                stepDuration={0.325}
                className="mt-6 font-display text-lg font-semibold"
              />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const FAQ = [
  {
    question: "O que é o e-book Fora do Balcão?",
    answer:
      "Um guia direto para estruturar a presença digital do seu negócio e entender seu sinal de mercado, sem enrolação.",
  },
  {
    question: "O que o SaaS da SinalZero faz?",
    answer:
      "Projeta sua empresa para mais clientes e aumenta o fluxo de oportunidades de forma contínua, com acompanhamento real.",
  },
  {
    question: "Preciso comprar o e-book e o SaaS juntos?",
    answer:
      "Não. O e-book funciona sozinho para quem quer aprender e aplicar por conta própria. O SaaS é para quem quer a ferramenta rodando continuamente.",
  },
  {
    question: "Como funciona o acesso ao e-book depois da compra?",
    answer:
      "O pagamento é processado pela Kiwify, que libera o acesso digital. Se algo falhar, as instruções também chegam por e-mail.",
  },
  {
    question: "Em quanto tempo vejo resultado com o SaaS?",
    answer:
      "Depende do ponto de partida do seu negócio. O diagnóstico inicial define uma expectativa real, sem prazo genérico.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative border-y border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <SectionTitle title="Perguntas frequentes." />

        <dl className="grid-rise mx-auto mt-12 grid max-w-4xl gap-5 text-left sm:grid-cols-2">
          {FAQ.map((item, i) => (
            <Reveal as="div" key={item.question} delay={i * 55}>
              <div className="interactive-panel h-full rounded-lg border border-border bg-card/60 p-6">
                <dt className="font-display text-base font-semibold">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

const SOLUTIONS = [
  {
    title: "E-book Fora do Balcão",
    text: "Aprenda no seu ritmo a estruturar presença digital e entender seu sinal de mercado.",
  },
  {
    title: "SaaS SinalZero",
    text: "Plataforma contínua que projeta sua empresa e aumenta o fluxo de clientes.",
  },
  {
    title: "E-book + SaaS",
    text: "Combine aprendizado e ferramenta para sair do zero e manter o crescimento contínuo.",
  },
];

export function Solutions() {
  return (
    <section id="solucoes" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle
        title="Formatos de entrega."
        description="A SinalZero é uma operação nova: em vez de vitrine de cases, mostramos exatamente o que entregamos hoje."
      />

      <div className="grid-rise mx-auto mt-12 grid max-w-5xl gap-5 text-center md:grid-cols-3">
        {SOLUTIONS.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <article className="interactive-panel group relative h-full overflow-hidden rounded-lg border border-border bg-card/60 p-7 text-center">
              <span
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-primary)_30%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <BlurText
                as="h3"
                text={item.title}
                delay={35}
                stepDuration={0.325}
                className="relative font-display text-lg font-semibold"
              />
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
