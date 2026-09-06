import { motion } from "motion/react";
import type { MotionStyle } from "motion/react";

const CARDS = [
  { eyebrow: "Dor", title: "Leads frios", tone: "ember" },
  { eyebrow: "Ruído", title: "Site invisível", tone: "primary" },
  { eyebrow: "Sinal", title: "Interesse real", tone: "gold" },
  { eyebrow: "Ação", title: "Contato pronto", tone: "accent" },
  { eyebrow: "Dor", title: "Pipeline vazio", tone: "ember" },
  { eyebrow: "Sinal", title: "Oportunidade local", tone: "gold" },
  { eyebrow: "Ação", title: "Venda possível", tone: "accent" },
  { eyebrow: "Ruído", title: "Busca sem direção", tone: "primary" },
];

export function InfiniteSpiral() {
  return (
    <div className="infinite-spiral" aria-hidden="true">
      <motion.div
        className="infinite-spiral__orbit"
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {CARDS.map((card, index) => {
          const angle = (index / CARDS.length) * 360;
          return (
            <motion.div
              key={`${card.title}-${index}`}
              className={`infinite-spiral__card infinite-spiral__card--${card.tone}`}
              style={{ "--spiral-angle": `${angle}deg` } as MotionStyle}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{
                duration: 5.5,
                delay: index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span>{card.eyebrow}</span>
              <strong>{card.title}</strong>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="infinite-spiral__core">
        <span className="infinite-spiral__pulse" />
        <span>SinalZero</span>
      </div>
    </div>
  );
}
