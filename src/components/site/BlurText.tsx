import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlurSnapshot = { filter: string; opacity: number; y: number };

function buildKeyframes(from: BlurSnapshot, steps: BlurSnapshot[]) {
  return {
    filter: [from.filter, ...steps.map((step) => step.filter)],
    opacity: [from.opacity, ...steps.map((step) => step.opacity)],
    y: [from.y, ...steps.map((step) => step.y)],
  };
}

export function BlurText({
  text = "",
  delay = 70,
  className,
  as: Tag = "p",
  animateBy = "words",
  direction = "top",
  stepDuration = 0.325,
}: {
  text?: string;
  delay?: number;
  className?: string;
  as?: ElementType;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  /** Two steps at 0.325s = 0.65s total for a quick blur/fade reveal. */
  stepDuration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : Array.from(text)),
    [animateBy, text],
  );
  const from = useMemo<BlurSnapshot>(
    () => ({
      filter: "blur(10px)",
      opacity: 0,
      y: direction === "top" ? -50 : 50,
    }),
    [direction],
  );
  const steps = useMemo<BlurSnapshot[]>(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn("blur-text", className)}>
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          className="inline-block will-change-[transform,filter,opacity]"
          initial={from}
          animate={inView ? keyframes : from}
          transition={{
            duration: stepDuration * steps.length,
            times,
            delay: (index * delay) / 1000,
            ease: "easeOut",
          }}
        >
          {segment || "\u00a0"}
          {animateBy === "words" && index < elements.length - 1 ? "\u00a0" : null}
        </motion.span>
      ))}
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
