import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "#topo", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#contato", label: "Contato" },
];

export function SectionRail() {
  const [active, setActive] = useState("#topo");

  useEffect(() => {
    const nodes = SECTIONS.map(({ href }) => document.querySelector(href)).filter(
      (node): node is Element => Boolean(node),
    );
    if (!nodes.length) return;

    let frame = 0;
    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      let nextActive = "#topo";

      nodes.forEach((node, index) => {
        const href = SECTIONS[index]?.href;
        if (href && node.getBoundingClientRect().top + window.scrollY <= marker) {
          nextActive = href;
        }
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
  }, []);

  return (
    <nav
      aria-label="Navegação rápida"
      className="section-rail fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-7"
    >
      <ul className="flex flex-col gap-3">
        {SECTIONS.map((item) => {
          const isActive = item.href === active;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
                data-active={isActive}
                className={cn(
                  "group flex items-center gap-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground",
                  isActive && "text-accent",
                )}
              >
                <span
                  aria-hidden="true"
                  className="section-rail-dot h-1.5 w-1.5 rounded-full bg-current"
                />
                <span className="section-rail-label">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
