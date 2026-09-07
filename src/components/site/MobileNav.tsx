import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => onOpenChange(false)}
        />
        <DialogPrimitive.Content
          className="fixed right-[120px] top-16 z-[70] w-[min(80vw,320px)] rounded-2xl border border-border bg-surface/90 p-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-300 ease-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-4"
        >
          <DialogPrimitive.Close asChild>
            <button
              aria-label="Fechar menu"
              className="group absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-all hover:rotate-90 hover:bg-accent/20"
            >
              <X className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
