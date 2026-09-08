import { Fragment } from "react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlurSnapshot = { filter: string; opacity: number; y: number; scale: number };

function buildKeyframes(from: BlurSnapshot, steps: BlurSnapshot[]) {
  return {
    filter: [from.filter, ...steps.map((step) => step.filter)],
    opacity: [from.opacity, ...steps.map((step) => step.opacity)],
    y: [from.y, ...steps.map((step) => step.y)],
    scale: [from.scale, ...steps.map((step) => step.scale)],
  };
}

export function BlurText({
  text = "",
  delay = 54,
  className,
  as: Tag = "p",
  animateBy = "words",
  direction = "bottom",
  stepDuration = 0.28,
}: {
  text?: string;
  delay?: number;
  className?: string;
  as?: ElementType;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  stepDuration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  /**
   * Em modo "letters", as letras de uma mesma palavra ficam agrupadas num
   * wrapper inline-flex sem quebra — senão o navegador pode quebrar a linha
   * no meio da palavra, já que cada letra seria seu próprio item flex.
   */
  const words = useMemo(
    () => (animateBy === "letters" ? text.split(" ").map((word) => Array.from(word)) : []),
    [animateBy, text],
  );
  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : Array.from(text)),
    [animateBy, text],
  );
  const from = useMemo<BlurSnapshot>(
    () => ({
      filter: "blur(6px)",
      opacity: 0,
      y: direction === "top" ? -6 : 6,
      scale: 0.985,
    }),
    [direction],
  );
  const steps = useMemo<BlurSnapshot[]>(
    () => [
      {
        filter: "blur(1.4px)",
        opacity: 0.86,
        y: direction === "top" ? -0.75 : 0.75,
        scale: 0.998,
      },
      { filter: "blur(0px)", opacity: 1, y: 0, scale: 1 },
    ],
    [direction],
  );
  const keyframes = useMemo(() => buildKeyframes(from, steps), [from, steps]);
  const times = useMemo(
    () => Array.from({ length: steps.length + 1 }, (_, index) => index / steps.length),
    [steps.length],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -3% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (animateBy === "letters") {
    let letterIndex = 0;
    return (
      <Tag ref={ref} className={cn("blur-text", className)}>
        {words.map((letters, wordIndex) => (
          <Fragment key={`word-${wordIndex}`}>
            <span className="inline-flex flex-nowrap">
              {letters.map((char, charIndex) => {
                const index = letterIndex++;
                return (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    className="inline-block will-change-[transform,filter,opacity]"
                    initial={from}
                    animate={inView ? keyframes : from}
                    transition={{
                      duration: stepDuration * steps.length,
                      times,
                      delay: (index * delay) / 1000,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? <span aria-hidden="true">{"\u00A0"}</span> : null}
          </Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={cn("blur-text", className)}>
      {elements.map((segment, index) => {
        const renderedSegment = segment === " " || segment === "" ? " " : segment;

        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={from}
            animate={inView ? keyframes : from}
            transition={{
              duration: stepDuration * steps.length,
              times,
              delay: (index * delay) / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {renderedSegment}
            {animateBy === "words" && index < elements.length - 1 ? " " : null}
          </motion.span>
        );
      })}
    </Tag>
  );
}

export function BlurTextBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("blur-text-block", className)}>{children}</div>;
}
