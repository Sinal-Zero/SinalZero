import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BlurText } from "./BlurText";

const GALLERY_ITEMS = [
  {
    title: "Prospecção",
    desc: "Sinais públicos cruzados com perfil definido. Qualificação manual antes da entrega.",
  },
  {
    title: "Calibragem",
    desc: "Definimos o ICP, volume, prazo e formato antes de qualquer execução.",
  },
  {
    title: "Entrega",
    desc: "Leads filtrados, site pronto ou produto sob medida — sem vitrine vazia.",
  },
];

export function AccordionGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="galeria" className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold">
          <BlurText text="Processo em etapas." delay={30} />
        </h2>
      </div>
      <div className="mt-10 flex flex-col gap-3">
        {GALLERY_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-card/40">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-accent/5"
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg font-medium">{item.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
