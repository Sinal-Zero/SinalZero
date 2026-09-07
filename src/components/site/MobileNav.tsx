import { useEffect, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import "./MobileNav.css";

const NAV_ITEMS = [
  { id: "topo", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Processo" },
  { id: "para-quem", label: "Para quem" },
  { id: "solucoes", label: "Soluções" },
  { id: "faq", label: "FAQ" },
];

export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const goToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className={cn(
            "hamburger-button fixed right-4 top-4 z-[90] inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface/80 shadow-lg backdrop-blur-xl",
            "transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)]",
            "hover:border-accent/35 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
        >
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="mobile-drawer-overlay fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm" />

        <DialogPrimitive.Content
          className="mobile-drawer-panel fixed right-3 top-3 z-[70] flex h-[calc(100dvh-1.5rem)] w-[min(86vw,360px)] flex-col overflow-hidden rounded-[1.6rem] border border-border bg-surface/95 p-5 shadow-2xl backdrop-blur-2xl"
        >
          <DialogPrimitive.Title className="sr-only">Menu de navegação</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navegue pelas seções do site da SinalZero.
          </DialogPrimitive.Description>

          <div className="mb-8 pr-14">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">Navegação</p>
            <p className="mt-2 text-sm text-muted-foreground">Explore as principais seções da SinalZero.</p>
          </div>

          <nav aria-label="Menu principal" className="mobile-drawer-stagger flex flex-col gap-2">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                style={{ "--stagger-index": index } as CSSProperties}
                className="mobile-drawer-link group flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 text-left text-base font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:translate-x-1 hover:border-accent/20 hover:bg-accent/10"
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </button>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
