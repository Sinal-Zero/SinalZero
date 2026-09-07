import { useEffect, useState, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINKTREE_URL } from "./constants";
import { RedirectConfirm } from "./RedirectConfirm";
import "./MobileNav.css";

export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [contactConfirmOpen, setContactConfirmOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const handleContactClick = () => {
    onOpenChange(false);
    window.setTimeout(() => setContactConfirmOpen(true), 180);
  };

  return (
    <>
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
          <DialogPrimitive.Overlay className="mobile-drawer-overlay fixed inset-0 z-[80] bg-black/50 backdrop-blur-[6px]" />

          <DialogPrimitive.Content
            className="mobile-drawer-panel fixed inset-y-2 right-2 z-[90] flex w-[calc(100vw-1rem)] max-w-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-border/90 bg-surface/94 p-5 shadow-[0_30px_90px_-34px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:inset-y-3 sm:right-3 sm:w-[min(88vw,390px)] sm:p-6"
          >
            <DialogPrimitive.Title className="sr-only">Contato</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Acesse os canais de contato da SinalZero.
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

            <div className="flex min-h-0 flex-1 flex-col justify-center pr-1">
              <div className="mobile-drawer-stagger">
                <div style={{ "--stagger-index": 0 } as CSSProperties}>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    Contato
                  </p>
                  <h2 className="mt-3 max-w-[14ch] font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                    Vamos conversar sobre o próximo passo.
                  </h2>
                  <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
                    Acesse os canais oficiais da SinalZero em um só lugar.
                  </p>
                </div>

                <div className="mt-7" style={{ "--stagger-index": 1 } as CSSProperties}>
                  <button
                    type="button"
                    onClick={handleContactClick}
                    className="group flex min-h-12 w-full items-center justify-between rounded-xl border border-accent/25 bg-accent/10 px-4 py-3.5 text-left text-base font-semibold text-foreground shadow-[0_14px_34px_-26px_rgba(245,124,0,.9)] transition-[background-color,border-color,box-shadow,transform,filter] duration-250 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/15 hover:shadow-[0_20px_44px_-24px_rgba(245,124,0,.95)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    <span>Entrar em contato</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-accent transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <RedirectConfirm
        open={contactConfirmOpen}
        onOpenChange={setContactConfirmOpen}
        href={LINKTREE_URL}
        title="Vamos para o Linktree"
        description="Você será direcionado para o Linktree da SinalZero, com todos os canais de contato reunidos em um só lugar."
      />
    </>
  );
}
