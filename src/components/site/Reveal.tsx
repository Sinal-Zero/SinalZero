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
 * Revela o conteúdo uma única vez com fade, blur e deslocamento curto.
 * Usa IntersectionObserver e respeita prefers-reduced-motion.
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

    const fallback = window.setTimeout(() => setVisible(true), 900);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        window.clearTimeout(fallback);
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const revealStyle = {
    "--reveal-delay": `${Math.min(Math.max(delay, 0), 180)}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      style={revealStyle}
      data-reveal-state={visible ? "visible" : "pending"}
      className={cn(
        "opacity-0 translate-y-5 scale-[0.988] blur-[7px] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:var(--reveal-delay)] data-[reveal-state=visible]:translate-y-0 data-[reveal-state=visible]:scale-100 data-[reveal-state=visible]:opacity-100 data-[reveal-state=visible]:blur-0 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
