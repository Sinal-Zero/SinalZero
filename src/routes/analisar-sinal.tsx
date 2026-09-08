import { useMemo, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BookOpen, Globe, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadarBackdrop } from "@/components/site/RadarBackdrop";
import { RedirectConfirm } from "@/components/site/RedirectConfirm";
import { KIWIFY_EBOOK_URL, LINKTREE_URL } from "@/components/site/constants";

const EXTERNAL_CONFIRM_CONTENT = {
  contact: {
    href: LINKTREE_URL,
    eyebrow: "Link externo",
    title: "Você será direcionado para a página de contato da SinalZero.",
    description: "Lá você poderá escolher o melhor canal para falar com a SinalZero.",
    destination: "linktr.ee/SinalZero",
    continueLabel: "Continuar",
  },
  ebook: {
    href: KIWIFY_EBOOK_URL,
    eyebrow: "Link externo",
    title: "Você será direcionado para a página do e-book.",
    description: "A compra e o acesso ao material são realizados pela plataforma Kiwify.",
    destination: "Kiwify",
    continueLabel: "Continuar para a Kiwify",
  },
} as const;

type ExternalConfirmType = keyof typeof EXTERNAL_CONFIRM_CONTENT;

export const Route = createFileRoute("/analisar-sinal")({
  component: AnalisarSinal,
});

const RADAR_LOGO_SRC = "/radar-logo.svg";

type Dimension = "presenca" | "consistencia" | "visibilidade";

type Question = {
  prompt: string;
  dimension: Dimension;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "Como você avalia a presença digital da sua empresa hoje?",
    dimension: "presenca",
    options: [
      "Quase não existe",
      "Existe, mas é fraca",
      "Está funcionando",
      "É um dos nossos pontos fortes",
    ],
  },
  {
    prompt: "Quando alguém procura sua empresa, o que normalmente encontra?",
    dimension: "visibilidade",
    options: [
      "Pouco ou nada",
      "Redes sociais",
      "Site e redes sociais",
      "Uma presença digital completa",
    ],
  },
  {
    prompt: "Hoje você sabe de onde vêm seus melhores clientes?",
    dimension: "visibilidade",
    options: ["Não", "Mais ou menos", "Sim", "Sim, e acompanhamos isso"],
  },
  {
    prompt: "Sua identidade visual e conteúdo são consistentes entre os canais?",
    dimension: "consistencia",
    options: [
      "Não, cada canal parece diferente",
      "Parcialmente, ainda há inconsistências",
      "Sim, na maior parte",
      "Sim, totalmente alinhados",
    ],
  },
  {
    prompt: "Com que frequência vocês atualizam seus canais digitais?",
    dimension: "consistencia",
    options: ["Raramente ou nunca", "De vez em quando", "Mensalmente", "Toda semana ou mais"],
  },
  {
    prompt: "Seu site e redes convertem visitantes em contatos ou clientes?",
    dimension: "presenca",
    options: [
      "Não sabemos, ou não convertem",
      "Convertem pouco",
      "Convertem razoavelmente",
      "Convertem bem, e acompanhamos isso",
    ],
  },
  {
    prompt: "Vocês medem os resultados da presença digital?",
    dimension: "visibilidade",
    options: [
      "Não medimos nada",
      "Olhamos números básicos às vezes",
      "Acompanhamos métricas regularmente",
      "Temos um processo estruturado de métricas",
    ],
  },
  {
    prompt: "Sua empresa possui um site próprio hoje?",
    dimension: "presenca",
    options: [
      "Não temos site",
      "Temos, mas está desatualizado",
      "Temos um site básico",
      "Sim, e ele funciona bem para o negócio",
    ],
  },
];

const WEBSITE_QUESTION_INDEX = QUESTIONS.length - 1;

const MAX_SCORE = QUESTIONS.length * 3;

const DIMENSION_LABEL: Record<Dimension, string> = {
  presenca: "Presença",
  consistencia: "Consistência",
  visibilidade: "Visibilidade",
};

const DIMENSION_STATUS = ["Frágil", "Em construção", "Sólida", "Forte"];

function statusFor(ratio: number) {
  if (ratio <= 0.28) return DIMENSION_STATUS[0];
  if (ratio <= 0.5) return DIMENSION_STATUS[1];
  if (ratio <= 0.78) return DIMENSION_STATUS[2];
  return DIMENSION_STATUS[3];
}

type Level = {
  label: string;
  description: string;
  focus: string;
  rings: number;
  intensity: number;
};

function levelFor(score: number): Level {
  const ratio = score / MAX_SCORE;
  if (ratio <= 0.28) {
    return {
      label: "Baixo",
      description:
        "Sua presença digital ainda deixa grande parte do potencial da empresa invisível para quem procura por você.",
      focus: "Foco recomendado: construir uma base digital coerente antes de investir em alcance.",
      rings: 1,
      intensity: 0.3,
    };
  }
  if (ratio <= 0.5) {
    return {
      label: "Em desenvolvimento",
      description:
        "Sua empresa já possui alguns pontos de presença, mas eles ainda não trabalham juntos de forma consistente.",
      focus: "Foco recomendado: alinhar canais e conteúdo para que passem uma única mensagem.",
      rings: 2,
      intensity: 0.55,
    };
  }
  if (ratio <= 0.78) {
    return {
      label: "Estável",
      description:
        "Sua presença digital já sustenta uma boa percepção, mas ainda existem oportunidades para ganhar consistência e alcance.",
      focus: "Foco recomendado: aumentar cadência e mensurar o que já está funcionando.",
      rings: 3,
      intensity: 0.8,
    };
  }
  return {
    label: "Forte",
    description:
      "Sua presença digital demonstra uma base sólida, com boa capacidade de ser encontrada, compreendida e lembrada.",
    focus: "Foco recomendado: manter consistência e explorar novas frentes de crescimento.",
    rings: 4,
    intensity: 1,
  };
}

function AnalisarSinal() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [externalConfirm, setExternalConfirm] = useState<ExternalConfirmType | null>(null);

  const isResult = step >= QUESTIONS.length;
  const score = useMemo(() => answers.reduce((sum, value) => sum + value, 0), [answers]);
  const partialMax = Math.max(answers.length, 1) * 3;
  const partialIntensity = answers.length ? Math.min(1, Math.max(0.12, score / partialMax)) : 0.16;
  const level = isResult ? levelFor(score) : null;
  const intensity = level ? level.intensity : partialIntensity;
  const activeRings = level ? level.rings : Math.max(1, Math.round(partialIntensity * 4));

  const dimensionScores = useMemo(() => {
    const totals: Record<Dimension, { score: number; max: number }> = {
      presenca: { score: 0, max: 0 },
      consistencia: { score: 0, max: 0 },
      visibilidade: { score: 0, max: 0 },
    };
    QUESTIONS.forEach((question, index) => {
      totals[question.dimension].max += 3;
      const answer = answers[index];
      if (typeof answer === "number") totals[question.dimension].score += answer;
    });
    return totals;
  }, [answers]);

  const websiteAnswer = answers[WEBSITE_QUESTION_INDEX];
  const websiteQuality = typeof websiteAnswer === "number" ? websiteAnswer : null;

  const weakest = useMemo(() => {
    let dimension: Dimension = "presenca";
    let ratio = Infinity;
    (Object.keys(dimensionScores) as Dimension[]).forEach((dim) => {
      const { score: dScore, max } = dimensionScores[dim];
      const dRatio = max ? dScore / max : 0;
      if (dRatio < ratio) {
        ratio = dRatio;
        dimension = dim;
      }
    });
    return { dimension, ratio };
  }, [dimensionScores]);

  const showEbook =
    level !== null &&
    (level.label === "Baixo" ||
      level.label === "Em desenvolvimento" ||
      (level.label === "Estável" && weakest.ratio < 0.6));

  function selectAnswer(value: number) {
    setPendingIndex(value);
    window.setTimeout(() => {
      setAnswers((prev) => [...prev.slice(0, step), value]);
      setStep((prev) => prev + 1);
      setPendingIndex(null);
    }, 220);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setPendingIndex(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <RadarBackdrop className="opacity-30" />

      <Link
        to="/"
        aria-label="Voltar para SinalZero"
        className="group fixed left-3 top-3 z-[100] inline-flex h-11 items-center gap-2.5 rounded-full border border-border/90 bg-background/72 pl-2.5 pr-4 text-sm font-medium text-muted-foreground shadow-[0_12px_36px_-18px_rgba(0,0,0,.75)] backdrop-blur-xl transition-[border-color,background-color,box-shadow,transform] duration-250 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-4 sm:top-4"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 opacity-70 transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-1.5 group-hover:opacity-100"
          aria-hidden="true"
        />
        <img
          src={RADAR_LOGO_SRC}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          className="h-5 w-5 shrink-0 transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-[18deg]"
        />
        <span className="font-display text-sm font-bold tracking-tight text-foreground">
          Sinal<span className="text-accent">Zero</span>
        </span>
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-24 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:pt-20">
        <section className="flex-1">
          <div className="analisar-stagger">
            <p
              className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-accent"
              style={{ "--sz-i": 0 } as CSSProperties}
            >
              SinalZero System
            </p>
            <p
              className="mt-1.5 text-[1.65rem] font-display font-semibold leading-tight text-foreground sm:text-3xl"
              style={{ "--sz-i": 1 } as CSSProperties}
            >
              Análise de Sinal
            </p>
            {!isResult && step === 0 && (
              <p
                className="mt-3 max-w-[44ch] text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ "--sz-i": 2 } as CSSProperties}
              >
                Descubra o sinal do seu negócio em {QUESTIONS.length} perguntas rápidas — leva menos
                de um minuto.
              </p>
            )}
          </div>

          {!isResult ? (
            <div key={step} className="analisar-fade mt-8">
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground">
                  {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                </p>
                <div className="flex flex-1 gap-1.5" role="presentation">
                  {QUESTIONS.map((question, index) => (
                    <span
                      key={question.prompt}
                      className={cn(
                        "h-1 flex-1 rounded-full bg-border/70 transition-colors duration-500",
                        index < step && "bg-accent/70",
                        index === step && "bg-accent/35",
                      )}
                    />
                  ))}
                </div>
              </div>

              <h2 className="mt-4 max-w-[34ch] font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {QUESTIONS[step]?.prompt}
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {QUESTIONS[step]?.options.map((option, index) => {
                  const selected = pendingIndex === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={pendingIndex !== null}
                      onClick={() => selectAnswer(index)}
                      className={cn(
                        "group flex min-h-14 items-center justify-between rounded-xl border border-border/90 bg-surface/60 px-4 py-3.5 text-left text-sm font-medium text-foreground shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/10 hover:shadow-[0_18px_40px_-26px_rgba(245,124,0,.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default",
                        selected &&
                          "-translate-y-0.5 border-accent/70 bg-accent/15 shadow-[0_18px_40px_-24px_rgba(245,124,0,.95)]",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/80 text-[0.65rem] font-semibold text-muted-foreground transition-colors duration-200",
                            selected && "border-accent bg-accent text-accent-foreground",
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 shrink-0 text-accent opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-100",
                          selected && "opacity-100",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div key="result" className="analisar-fade mt-8">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-accent">
                Sinal identificado
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-accent sm:text-5xl">
                {level?.label}
              </h1>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
                {level?.description}
              </p>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground/80">
                {level?.focus}
              </p>

              <dl className="mt-7 grid gap-3 sm:grid-cols-3">
                {(Object.keys(dimensionScores) as Dimension[]).map((dimension, index) => {
                  const { score: dScore, max } = dimensionScores[dimension];
                  const ratio = max ? dScore / max : 0;
                  return (
                    <div
                      key={dimension}
                      className="analisar-fade rounded-xl border border-border/90 bg-surface/50 px-4 py-3.5"
                      style={{
                        "--reveal-delay": `${index * 90}ms`,
                        animationDelay: `${index * 90}ms`,
                      }}
                    >
                      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {DIMENSION_LABEL[dimension]}
                      </dt>
                      <dd className="mt-1.5 flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {statusFor(ratio)}
                        </span>
                        <span className="flex flex-1 gap-1" role="presentation">
                          {[0, 1, 2, 3].map((segment) => (
                            <span
                              key={segment}
                              className={cn(
                                "h-1 flex-1 rounded-full bg-border/70",
                                ratio >= (segment + 1) / 4 && "bg-accent/70",
                              )}
                            />
                          ))}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {websiteQuality !== null && websiteQuality < 3 && (
                <div
                  className="analisar-fade mt-8 rounded-2xl border border-accent/25 bg-accent/5 p-5 sm:p-6"
                  style={{ animationDelay: "260ms" }}
                >
                  <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    {websiteQuality === 2 ? "Próximo passo" : "Ponto de oportunidade"}
                  </p>
                  <h3 className="mt-2.5 max-w-[38ch] font-display text-lg font-semibold text-foreground sm:text-xl">
                    {websiteQuality === 0 && "Sua empresa ainda não tem um site."}
                    {websiteQuality === 1 && "Seu site atual pode estar te atrapalhando."}
                    {websiteQuality === 2 && "Seu site já existe — e pode evoluir."}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                    {websiteQuality === 0 &&
                      "Sem um site, boa parte de quem procura por você não encontra nada consistente. O próximo ganho pode estar em ter uma base digital própria."}
                    {websiteQuality === 1 &&
                      "Um site desatualizado passa uma impressão que não representa o momento atual do seu negócio."}
                    {websiteQuality === 2 &&
                      "Seu site cumpre o básico, mas ainda existe espaço para evoluir conversão, clareza e identidade."}
                  </p>
                  {websiteQuality === 0 && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground/80">
                      A SinalZero pode ajudar nessa etapa, criando um site alinhado à sua marca.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setExternalConfirm("contact")}
                    className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    {websiteQuality === 0 && "Quero criar meu site"}
                    {websiteQuality === 1 && "Quero melhorar meu site"}
                    {websiteQuality === 2 && "Evoluir meu site"}
                    <ArrowUpRight
                      className="h-4 w-4 text-accent transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}

              {websiteQuality === 3 && (
                <div
                  className="analisar-fade mt-8 rounded-2xl border border-border/90 bg-surface/50 p-5 sm:p-6"
                  style={{ animationDelay: "260ms" }}
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    Próximo passo
                  </p>
                  <h3 className="mt-2.5 max-w-[38ch] font-display text-lg font-semibold text-foreground sm:text-xl">
                    Seu próximo ganho pode estar em{" "}
                    {DIMENSION_LABEL[weakest.dimension].toLowerCase()}.
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                    Seu site já funciona bem para o negócio. O espaço de melhoria agora está em
                    fortalecer {DIMENSION_LABEL[weakest.dimension].toLowerCase()}.
                  </p>
                </div>
              )}

              {showEbook && (
                <div
                  className="analisar-fade mt-5 rounded-2xl border border-border/90 bg-surface/50 p-5 sm:p-6"
                  style={{ animationDelay: "340ms" }}
                >
                  <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Recomendação
                  </p>
                  <h3 className="mt-2.5 max-w-[38ch] font-display text-lg font-semibold text-foreground sm:text-xl">
                    Fortaleça seu sinal digital.
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                    O e-book Fora do Balcão traz um passo a passo prático para estruturar sua
                    presença digital, mesmo com pouco tempo ou equipe.
                  </p>
                  <button
                    type="button"
                    onClick={() => setExternalConfirm("ebook")}
                    className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/90 bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    Conhecer o e-book
                    <ArrowUpRight
                      className="h-4 w-4 text-accent transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-5 py-3 text-sm font-semibold text-foreground shadow-[0_14px_34px_-26px_rgba(245,124,0,.9)] transition-[background-color,border-color,box-shadow,transform] duration-250 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  Voltar para o site
                  <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground/80 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Refazer análise
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-1 items-center justify-center">
          <SignalDial intensity={intensity} rings={activeRings} label={level?.label} answerPending={pendingIndex !== null} />
        </section>
      </div>

      {externalConfirm ? (
        <RedirectConfirm
          open={externalConfirm !== null}
          onOpenChange={(next) => setExternalConfirm(next ? externalConfirm : null)}
          {...EXTERNAL_CONFIRM_CONTENT[externalConfirm]}
        />
      ) : null}
    </main>
  );
}

function SignalDial({
  intensity,
  rings,
  label,
  answerPending = false,
}: {
  intensity: number;
  rings: number;
  label?: string;
  answerPending?: boolean;
}) {
  const glow = 0.25 + intensity * 0.6;
  const orbitDots = [
    { inset: "20%", duration: "10s", size: 6, delay: "0s" },
    { inset: "34%", duration: "15s", size: 4, delay: "-4s", reverse: true },
  ];
  const particles = [
    { top: "18%", left: "72%", delay: "0s" },
    { top: "68%", left: "22%", delay: "-0.8s" },
    { top: "30%", left: "20%", delay: "-1.6s" },
    { top: "78%", left: "64%", delay: "-2.3s" },
  ];

  return (
    <div
      className="signal-dial relative aspect-square w-full max-w-[360px]"
      style={{ "--signal-intensity": intensity, "--signal-glow": glow } as CSSProperties}
      role="img"
      aria-label={label ? `Sinal atual: ${label}` : "Sinal em construção"}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-gold)_calc(var(--signal-glow)*100%),transparent),transparent_65%)] blur-2xl transition-opacity duration-700" />

      {/* tick marks */}
      <div
        className="signal-ticks absolute inset-[4%] rounded-full opacity-40 motion-reduce:animate-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, color-mix(in oklab, var(--color-accent) 55%, transparent) 0deg 1.4deg, transparent 1.4deg 30deg)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 90%, black 91%, black 96%, transparent 97%)",
          maskImage:
            "radial-gradient(circle, transparent 90%, black 91%, black 96%, transparent 97%)",
          animation: answerPending ? 'sz-pulse-soft 1.5s ease-in-out infinite' : 'none',
        }}
      />

      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full border transition-[opacity,border-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
            i < rings ? "border-accent/40 opacity-100" : "border-border/50 opacity-25",
          )}
          style={{ inset: `${8 + i * 11}%` }}
        />
      ))}

      {orbitDots.map((orbit, index) => (
        <div
          key={index}
          className={cn(
            "signal-orbit absolute rounded-full motion-reduce:animate-none",
            orbit.reverse && "signal-orbit-reverse",
          )}
          style={
            {
              inset: orbit.inset,
              animationDuration: orbit.duration,
              animationDelay: orbit.delay,
              opacity: 0.35 + intensity * 0.45,
            } as CSSProperties
          }
        >
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_2px_color-mix(in_oklab,var(--color-gold)_60%,transparent)]"
            style={{ width: orbit.size, height: orbit.size }}
          />
        </div>
      ))}

      {particles.map((particle, index) => (
        <span
          key={index}
          className="signal-particle absolute h-1 w-1 rounded-full bg-accent/70 motion-reduce:animate-none"
          style={{ top: particle.top, left: particle.left, animationDelay: particle.delay }}
        />
      ))}

      <div
        className="signal-sweep absolute inset-[6%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--color-accent)_26%,transparent)_26deg,transparent_58deg)] motion-reduce:animate-none"
        style={{ opacity: 0.35 + intensity * 0.4 }}
      />

      <span
        className="signal-trail absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/35 motion-reduce:animate-none"
        style={{ opacity: 0.2 + intensity * 0.35 }}
      />

      <span
        className="signal-pulse absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_28px_8px_color-mix(in_oklab,var(--color-gold)_55%,transparent)] motion-reduce:animate-none"
        style={{ opacity: 0.5 + intensity * 0.5 }}
      />
    </div>
  );
}
