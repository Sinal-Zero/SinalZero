import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteúdo com fade + deslocamento vertical quando ele entra na viewport.
 * Usa IntersectionObserver (sem dependências extras) e respeita prefers-reduced-motion:
 * quem prefere menos movimento vê o conteúdo já estático e visível.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** atraso em ms para escalonar itens de uma mesma lista */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let fallback = window.setTimeout(() => setVisible(true), 1400);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.clearTimeout(fallback);
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px 6% 0px" },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const revealStyle = { "--reveal-delay": `${Math.min(delay, 180)}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      style={revealStyle}
      data-reveal-state={visible ? "visible" : "pending"}
      className={cn(
        "reveal-item",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
