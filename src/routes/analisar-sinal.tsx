import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadarBackdrop } from "@/components/site/RadarBackdrop";

export const Route = createFileRoute("/analisar-sinal")({
  component: AnalisarSinal,
});

type Question = {
  prompt: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "Como você avalia a presença digital da sua empresa hoje?",
    options: [
      "Quase não existe",
      "Existe, mas é fraca",
      "Está funcionando",
      "É um dos nossos pontos fortes",
    ],
  },
  {
    prompt: "Quando alguém procura sua empresa, o que normalmente encontra?",
    options: [
      "Pouco ou nada",
      "Redes sociais",
      "Site e redes sociais",
      "Uma presença digital completa",
    ],
  },
  {
    prompt: "Hoje você sabe de onde vêm seus melhores clientes?",
    options: ["Não", "Mais ou menos", "Sim", "Sim, e acompanhamos isso"],
  },
];

const MAX_SCORE = QUESTIONS.length * 3;

type Level = {
  label: string;
  description: string;
  rings: number;
  intensity: number;
};

function levelFor(score: number): Level {
  if (score <= 2) {
    return {
      label: "Baixo",
      description:
        "Sua presença digital ainda deixa grande parte do potencial da empresa invisível para quem procura por você.",
      rings: 1,
      intensity: 0.3,
    };
  }
  if (score <= 4) {
    return {
      label: "Em desenvolvimento",
      description:
        "Sua empresa já possui alguns pontos de presença, mas eles ainda não trabalham juntos de forma consistente.",
      rings: 2,
      intensity: 0.55,
    };
  }
  if (score <= 7) {
    return {
      label: "Estável",
      description:
        "Sua presença digital já sustenta uma boa percepção, mas ainda existem oportunidades para ganhar consistência e alcance.",
      rings: 3,
      intensity: 0.8,
    };
  }
  return {
    label: "Forte",
    description:
      "Sua presença digital demonstra uma base sólida, com boa capacidade de ser encontrada, compreendida e lembrada.",
    rings: 4,
    intensity: 1,
  };
}

function AnalisarSinal() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const isResult = step >= QUESTIONS.length;
  const score = useMemo(() => answers.reduce((sum, value) => sum + value, 0), [answers]);
  const partialMax = Math.max(answers.length, 1) * 3;
  const partialIntensity = answers.length ? Math.min(1, Math.max(0.12, score / partialMax)) : 0.18;
  const level = isResult ? levelFor(score) : null;
  const intensity = level ? level.intensity : partialIntensity;
  const activeRings = level ? level.rings : Math.max(1, Math.round(partialIntensity * 4));

  function selectAnswer(value: number) {
    const next = [...answers.slice(0, step), value];
    setAnswers(next);
    setStep(step + 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <RadarBackdrop className="opacity-40" />

      <Link
        to="/"
        className="fixed left-3 top-3 z-[100] inline-flex h-11 items-center gap-2 rounded-full border border-border/90 bg-background/72 px-4 text-sm font-medium text-muted-foreground shadow-[0_12px_36px_-18px_rgba(0,0,0,.75)] backdrop-blur-xl transition-colors duration-200 hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-4 sm:top-4"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para o site
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-24 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:pt-20">
        <section className="flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
            SINALZERO SYSTEM
          </p>
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Análise de Sinal
          </p>

          {!isResult ? (
            <div key={step} className="analisar-fade mt-6">
              {step === 0 && (
                <>
                  <h1 className="max-w-[18ch] font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                    Descubra o sinal do seu negócio.
                  </h1>
                  <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
                    Responda algumas perguntas rápidas e identifique onde sua presença digital está
                    forte, instável ou deixando oportunidades escapar.
                  </p>
                </>
              )}

              <div className="mt-8">
                <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground">
                  {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                </p>
                <h2 className="mt-3 max-w-[32ch] font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {QUESTIONS[step]?.prompt}
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step]?.options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(index)}
                      className="group flex min-h-14 items-center justify-between rounded-xl border border-border/90 bg-surface/60 px-4 py-3.5 text-left text-sm font-medium text-foreground shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/10 hover:shadow-[0_18px_40px_-26px_rgba(245,124,0,.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>{option}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div key="result" className="analisar-fade mt-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                SINAL IDENTIFICADO
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-gradient-gold sm:text-5xl">
                {level?.label}
              </h1>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
                {level?.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
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
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border/90 bg-surface/60 px-5 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-accent/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Refazer análise
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-1 items-center justify-center">
          <SignalDial intensity={intensity} rings={activeRings} label={level?.label} />
        </section>
      </div>
    </main>
  );
}

function SignalDial({
  intensity,
  rings,
  label,
}: {
  intensity: number;
  rings: number;
  label?: string;
}) {
  const glow = 0.25 + intensity * 0.6;

  return (
    <div
      className="signal-dial relative aspect-square w-full max-w-[340px]"
      style={{ "--signal-intensity": intensity, "--signal-glow": glow } as React.CSSProperties}
      role="img"
      aria-label={label ? `Sinal atual: ${label}` : "Sinal em construção"}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-gold)_calc(var(--signal-glow)*100%),transparent),transparent_65%)] blur-2xl transition-opacity duration-700" />

      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full border transition-[opacity,border-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
            i < rings ? "border-accent/40 opacity-100" : "border-border/50 opacity-30",
          )}
          style={{ inset: `${6 + i * 11}%` }}
        />
      ))}

      <div
        className="signal-sweep absolute inset-[6%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--color-accent)_26%,transparent)_26deg,transparent_58deg)] motion-reduce:animate-none"
        style={{ opacity: 0.35 + intensity * 0.4 }}
      />

      <span
        className="signal-pulse absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_28px_8px_color-mix(in_oklab,var(--color-gold)_55%,transparent)] motion-reduce:animate-none"
        style={{ opacity: 0.5 + intensity * 0.5 }}
      />
    </div>
  );
}
