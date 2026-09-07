import { useEffect, useState } from "react";

/**
 * Rastreia qual seção está ativa pelo scroll e expõe navegação suave até ela.
 * Compartilhado entre a dock desktop (SectionRail) e a barra mobile.
 */
export function useActiveSection(hrefs: string[], reducedMotion: boolean | null) {
  const [active, setActive] = useState(hrefs[0] ?? "#topo");

  const navigateToSection = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    setActive(href);
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });

    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  };

  useEffect(() => {
    const nodes = hrefs
      .map((href) => document.querySelector(href))
      .filter((node): node is Element => Boolean(node));
    if (!nodes.length) return;

    if (window.location.hash) {
      const initialHash = window.location.hash;
      const hashTarget = document.querySelector(initialHash);
      if (hashTarget) setActive(initialHash);
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(window.history.state, "", cleanUrl);
    }

    let frame = 0;
    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.33;
      let nextActive = hrefs[0] ?? "#topo";
      nodes.forEach((node, index) => {
        const href = hrefs[index];
        if (href && node.getBoundingClientRect().top + window.scrollY <= marker) nextActive = href;
      });
      setActive((current) => (current === nextActive ? current : nextActive));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        updateActive();
        frame = 0;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { active, navigateToSection };
}
