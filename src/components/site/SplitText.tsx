import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { cn } from "@/lib/utils";

export type SplitTextSegment = {
  text: string;
  className?: string;
  /** não quebra este segmento em letras (usado p.ex. em palavras com gradiente) */
  atomic?: boolean;
};

/**
 * Revela texto letra a letra (ou palavra a palavra) quando entra na viewport.
 * Segmentos podem ter classes próprias (ex.: gradiente) e ser marcados como
 * "atomic" para animar como uma única unidade, preservando efeitos visuais
 * que dependem do elemento inteiro (como text-gradient-gold).
 */
export function SplitText({
  segments,
  as: Tag = "span",
  unit = "char",
  delay = 0,
  stagger = 22,
  className,
}: {
  segments: SplitTextSegment[] | string;
  as?: ElementType;
  unit?: "char" | "word";
  /** atraso inicial em ms */
  delay?: number;
  /** intervalo entre unidades em ms */
  stagger?: number;
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

    const fallback = window.setTimeout(() => setVisible(true), 1400);
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
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const list: SplitTextSegment[] = typeof segments === "string" ? [{ text: segments }] : segments;

  let unitIndex = 0;
  const maxUnits = 26;
  const step = (i: number) => Math.min(i, maxUnits) * stagger;

  return (
    <Tag ref={ref} data-split-state={visible ? "visible" : "pending"} className={cn("inline", className)}>
      {list.map((segment, si) => {
        const tokens = segment.text.split(/(\s+)/);
        return (
          <span key={si} className={segment.className}>
            {tokens.map((token, ti) => {
              if (token === "") return null;
              if (/^\s+$/.test(token)) return token;

              if (segment.atomic || unit === "word") {
                const i = unitIndex++;
                const style = { "--split-delay": `${delay + step(i)}ms` } as CSSProperties;
                return (
                  <span key={ti} style={style} className="split-unit inline-block">
                    {token}
                  </span>
                );
              }

              return (
                <span key={ti} className="inline-block whitespace-nowrap">
                  {token.split("").map((ch, ci) => {
                    const i = unitIndex++;
                    const style = { "--split-delay": `${delay + step(i)}ms` } as CSSProperties;
                    return (
                      <span key={ci} style={style} className="split-unit inline-block">
                        {ch}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
