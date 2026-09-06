import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Camada decorativa: ondas radiais, órbitas e varredura de radar.
 * Puramente visual (aria-hidden). O parallax é leve, desativado em telas
 * pequenas e quando o usuário prefere menos movimento.
 */
export function RadarBackdrop({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const field = fieldRef.current;
    if (!root || !field) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (reduced) {
      root.dataset.active = "false";
      return;
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        root.dataset.active = entry?.isIntersecting ? "true" : "false";
      },
      { rootMargin: "12% 0px" },
    );
    visibilityObserver.observe(root);

    if (small) return () => visibilityObserver.disconnect();

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        field.style.setProperty("--radar-offset", `${window.scrollY * 0.035}px`);
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-active="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        ref={fieldRef}
        className="radar-field absolute left-1/2 top-1/2 aspect-square w-[min(140vw,1100px)]"
      >
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_45%_40%,color-mix(in_oklab,var(--color-gold)_38%,transparent),transparent_62%)] blur-3xl" />

        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-accent/15"
            style={{ inset: `${8 + i * 11}%` }}
          />
        ))}

        <div className="radar-sweep absolute inset-[8%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--color-accent)_22%,transparent)_28deg,transparent_60deg)] motion-reduce:animate-none" />

        <span className="radar-ping absolute left-[62%] top-[38%] h-24 w-24 rounded-full border border-gold/40 motion-reduce:animate-none" />
        <span className="absolute left-[62%] top-[38%] h-3 w-3 translate-x-[42px] translate-y-[42px] rounded-full bg-gold shadow-[0_0_24px_6px_color-mix(in_oklab,var(--color-gold)_55%,transparent)]" />
      </div>
    </div>
  );
}
