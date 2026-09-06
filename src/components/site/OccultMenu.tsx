import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Menu reservado para futuras entradas; a navegação principal permanece no header. */
export function OccultMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    document.body.classList.toggle("occult-menu-open", open);
    return () => document.body.classList.remove("occult-menu-open");
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={open ? "Fechar menu oculto" : "Abrir menu oculto"}
          className="group hidden h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface/70 text-muted-foreground shadow-[0_8px_24px_-18px_rgba(0,0,0,0.8)] transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-accent md:inline-flex"
        >
          <Menu
            className={cn(
              "absolute h-4 w-4 transition-all duration-500 [transition-timing-function:cubic-bezier(.22,1.35,.36,1)] motion-reduce:transition-none",
              open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
            aria-hidden="true"
          />
          <PanelRightClose
            className={cn(
              "absolute h-4 w-4 transition-all duration-500 [transition-timing-function:cubic-bezier(.22,1.35,.36,1)] motion-reduce:transition-none",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
            )}
            aria-hidden="true"
          />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-background/65 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-500 motion-reduce:transition-none" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-[70] flex w-[min(86vw,390px)] origin-right flex-col border-l border-border bg-surface/95 p-8 shadow-[-32px_0_80px_-38px_rgba(0,0,0,0.9)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-right-8 duration-500 [transition-timing-function:cubic-bezier(.22,1.35,.36,1)] motion-reduce:transition-none">
          <DialogPrimitive.Title className="flex items-center gap-3 font-display text-lg font-semibold">
            <PanelRightOpen className="h-5 w-5 text-accent" aria-hidden="true" />
            Menu oculto
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              aria-label="Fechar menu oculto"
              className="absolute right-7 top-7 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,transform] duration-300 hover:rotate-90 hover:bg-accent/10 hover:text-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </DialogPrimitive.Close>

          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-full border border-dashed border-accent/30 px-5 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Em breve
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
