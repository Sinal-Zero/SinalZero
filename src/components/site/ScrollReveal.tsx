import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  className,
}: {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const words = useMemo(() => children.split(/(\s+)/), [children]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scroller = scrollContainerRef?.current ?? window;
    const context = gsap.context(() => {
      const wordElements = element.querySelectorAll<HTMLElement>(".scroll-reveal-word");
      gsap.fromTo(
        element,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            scroller,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        wordElements,
        {
          y: -22,
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : "none",
          willChange: "transform, opacity, filter",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: "top bottom-=20%",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [baseOpacity, baseRotation, blurStrength, enableBlur, scrollContainerRef]);

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span className="scroll-reveal-word" key={`${word}-${index}`}>
            {word}
          </span>
        ),
      )}
    </div>
  );
}
