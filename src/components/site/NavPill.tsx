import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV } from "./constants";
import { useLoading } from "./LoadingWave";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const INDICATOR_TRANSITION =
  "transform 620ms cubic-bezier(.18,.82,.18,1), width 220ms cubic-bezier(.22,1,.36,1), opacity 260ms ease";

/**
 * Nav em pill com indicador "water bounce": acelera até o alvo, passa um
 * pouco do destino, bate e volta — sem deformar o botão. Único momento
 * autoral de movimento do header; o resto do site usa transições discretas.
 */
export function NavPill() {
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const posRef = useRef({ x: 0, w: 0 });
  const frameRef = useRef(0);
  const { showLoading } = useLoading();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const targetFor = useCallback((index: number) => {
    const nav = navRef.current;
    const item = itemRefs.current[index];
    if (!nav || !item) return { x: 0, w: 0 };
    const navRect = nav.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    return { x: rect.left - navRect.left - 6, w: rect.width };
  }, []);

  const paint = useCallback((x: number, w: number, opacity: number, scaleX = 1) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    indicator.style.transform = `translateX(${x}px) scaleX(${scaleX})`;
    indicator.style.width = `${w}px`;
    indicator.style.opacity = String(opacity);
  }, []);

  const moveIndicator = useCallback(
    (index: number | null, instant = false) => {
      const indicator = indicatorRef.current;
      if (!indicator) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = index === null ? { x: posRef.current.x, w: 0 } : targetFor(index);

      if (instant || reduced) {
        posRef.current = target;
        indicator.style.transition = "none";
        paint(target.x, target.w, index === null ? 0 : 1);
        requestAnimationFrame(() => {
          indicator.style.transition = INDICATOR_TRANSITION;
        });
        return;
      }

      const fromX = posRef.current.x;
      const distance = target.x - fromX;
      const overshoot = clamp(distance * 0.055, -18, 18);
      const startW = posRef.current.w || target.w;
      const t0 = performance.now();
      const duration = 620;

      cancelAnimationFrame(frameRef.current);

      const spring = (t: number) => {
        if (t < 0.76) {
          const p = t / 0.76;
          return fromX + (distance + overshoot) * easeOutCubic(p);
        }
        const p = (t - 0.76) / 0.24;
        return fromX + (distance + overshoot) - overshoot * (1 - Math.pow(1 - p, 3));
      };

      const frame = (now: number) => {
        const progress = clamp((now - t0) / duration, 0, 1);
        const x = spring(progress);
        const w = startW + (target.w - startW) * easeOutCubic(progress);

        let scaleX = 1;
        if (progress > 0.68 && progress < 0.88) {
          const p = (progress - 0.68) / 0.2;
          scaleX = 1 + Math.sin(p * Math.PI) * 0.035;
        }

        posRef.current = { x, w };
        paint(x, w, index === null ? clamp(1 - progress * 3, 0, 1) : 1, scaleX);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(frame);
        } else {
          posRef.current = target;
          paint(target.x, target.w, index === null ? 0 : 1);
        }
      };

      frameRef.current = requestAnimationFrame(frame);
    },
    [paint, targetFor],
  );

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => Boolean(el),
    );
    if (sections.length !== NAV.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.indexOf(entry.target);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    moveIndicator(activeIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    moveIndicator(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const onResize = () => moveIndicator(activeIndex, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <nav
      ref={navRef}
      aria-label="Seções do site"
      className="relative hidden items-center gap-1 rounded-full border border-border/80 bg-surface/60 p-1.5 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl md:flex"
    >
      <div
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1.5 left-1.5 z-0 h-[calc(100%-0.75rem)] w-0 rounded-full bg-accent opacity-0 will-change-[transform,width,opacity]"
        style={{ transition: INDICATOR_TRANSITION }}
      />

      {NAV.map((item, index) => (
        <a
          key={item.href}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          href={item.href}
          onClick={() => {
            showLoading(500);
            setActiveIndex(index);
          }}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out",
            index === activeIndex
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
