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
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação rápida"
      className="section-rail fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
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
                <span
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  data-rail-label="true"
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
