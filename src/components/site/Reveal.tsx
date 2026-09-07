import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteúdo quando entra na viewport, com atraso curto e previsível.
 * Usa IntersectionObserver, evita listeners de scroll e respeita reduced motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
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

    const fallback = window.setTimeout(() => setVisible(true), 1000);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.clearTimeout(fallback);
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px 10% 0px",
      },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const revealStyle = { "--reveal-delay": `${Math.min(delay, 150)}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      style={revealStyle}
      data-reveal-state={visible ? "visible" : "pending"}
      className={cn("reveal-item", className)}
    >
      {children}
    </Tag>
  );
}
