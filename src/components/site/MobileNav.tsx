import { useEffect, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINKTREE_URL, NAV } from "./constants";
import { useLoading } from "./LoadingWave";

/**
 * Menu off-canvas do celular: painel desliza da direita sobre um backdrop
 * com blur, e o conteúdo da página encolhe atrás dele (ver .page-shell em
 * styles.css). Itens do menu entram em cascata quando o painel abre.
 */
export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { showLoading } = useLoading();
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface/80 text-foreground shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:bg-accent/10 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <Menu
            className={cn(
              "absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none",
              open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
            aria-hidden="true"
          />
          <X
            className={cn(
              "absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
            )}
            aria-hidden="true"
          />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm motion-reduce:transition-none lg:hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "duration-300",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-[70] flex w-[min(84vw,360px)] flex-col border-l border-border bg-surface shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.65)] outline-none lg:hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-[380ms] ease-out motion-reduce:transition-none",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Menu de navegação</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Links para as seções do site e contato.
          </DialogPrimitive.Description>

          <div className="flex h-20 items-center justify-between px-6">
            <span className="font-display text-base font-semibold tracking-tight">
              Sinal<span className="text-accent">Zero</span>
            </span>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <nav
            aria-label="Seções do site"
            className="mobile-drawer-stagger flex-1 overflow-y-auto px-6 pt-2"
          >
            <ul className="flex flex-col">
              {NAV.map((item, i) => (
                <li
                  key={item.href}
                  style={{ "--stagger-index": i } as CSSProperties}
                  className="border-b border-border/70 last:border-0"
                >
                  <DialogPrimitive.Close asChild>
                    <a
                      href={item.href}
                      onClick={() => showLoading(700)}
                      className="group flex items-center justify-between py-4 text-base font-medium text-foreground transition-colors duration-300 hover:text-accent hover:pl-1"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </a>
                  </DialogPrimitive.Close>
                </li>
              ))}
            </ul>

            <div className="mt-8" style={{ "--stagger-index": NAV.length } as CSSProperties}>
              <DialogPrimitive.Close asChild>
                <a
                  href={LINKTREE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_12px_30px_-18px_color-mix(in_oklab,var(--color-primary)_80%,transparent)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-accent"
                >
                  Falar com a SinalZero
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </DialogPrimitive.Close>
            </div>
          </nav>

          <p className="px-6 py-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} SinalZero. Todos os direitos reservados.
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
