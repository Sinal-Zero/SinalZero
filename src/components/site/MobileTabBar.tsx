import { useReducedMotion } from "motion/react";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTIONS } from "./SectionRail";
import { cn } from "@/lib/utils";

/**
 * Barra de navegação rápida para telas menores que lg, onde a SectionRail
 * (dock vertical) não cabe. Mesmo rastreamento de seção ativa, layout
 * horizontal fixo no rodapé, com scroll interno para caber todos os itens.
 */
export function MobileTabBar() {
  const reducedMotion = useReducedMotion();
  const { active, navigateToSection } = useActiveSection(
    SECTIONS.map((s) => s.href),
    reducedMotion,
  );

  return (
    <nav
      aria-label="Navegação rápida"
      className="mobile-tab-bar fixed inset-x-0 bottom-0 z-[70] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mobile-tab-bar-scroll flex items-center gap-1 overflow-x-auto px-3 py-2 sm:justify-center sm:gap-2">
        {SECTIONS.map((item) => {
          const isActive = item.href === active;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => navigateToSection(item.href)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "mobile-tab-item flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-200",
                isActive ? "text-accent" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
