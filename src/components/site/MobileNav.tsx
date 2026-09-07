import { useEffect, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
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
          aria-label="Abrir menu"
          aria-expanded={open}
          className={cn(
            "hamburger-button fixed right-3 top-3 z-[100] inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/90 bg-background/72 text-foreground shadow-[0_12px_36px_-18px_rgba(0,0,0,.75)] backdrop-blur-xl sm:right-4 sm:top-4",
            "transition-[background-color,border-color,box-shadow,transform,opacity] duration-200 ease-[cubic-bezier(.22,1,.36,1)]",
            "hover:-translate-y-0.5 hover:scale-[1.035] hover:border-accent/40 hover:bg-surface/95 hover:shadow-[0_16px_42px_-18px_rgba(0,0,0,.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
        >
          <span className="sr-only">Abrir menu</span>
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="mobile-drawer-overlay fixed inset-0 z-[80] bg-black/50 backdrop-blur-[5px]" />

        <DialogPrimitive.Content
          className="mobile-drawer-panel fixed inset-y-2 right-2 z-[90] flex w-[calc(100vw-1rem)] max-w-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-border/90 bg-surface/96 p-5 shadow-[0_30px_90px_-34px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:inset-y-3 sm:right-3 sm:w-[min(88vw,390px)] sm:p-6"
        >
          <DialogPrimitive.Title className="sr-only">Menu de navegação</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navegue pelas seções do site da SinalZero.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close asChild>
            <button
              type="button"
              aria-label="Fechar menu"
              className="drawer-close-button absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/90 bg-background/55 text-foreground shadow-sm backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:rotate-90 hover:scale-[1.04] hover:border-accent/35 hover:bg-accent/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-[1.15rem] w-[1.15rem] stroke-[1.8]" aria-hidden="true" />
            </button>
          </DialogPrimitive.Close>

          <div className="mb-7 pr-14 pt-1 sm:mb-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">Navegação</p>
            <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
              Explore as principais seções da SinalZero.
            </p>
          </div>

          <nav aria-label="Menu principal" className="mobile-drawer-stagger flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                style={{ "--stagger-index": index } as CSSProperties}
                className="mobile-drawer-link group flex min-h-12 w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 text-left text-base font-medium text-foreground transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:translate-x-1 hover:border-accent/20 hover:bg-accent/10 hover:shadow-[0_10px_28px_-22px_rgba(245,124,0,.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <span>{item.label}</span>
                <span
                  className="text-sm text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
