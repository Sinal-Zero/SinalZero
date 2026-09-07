import type { ReactNode } from "react";
import { ArrowUpRight, Radar } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RedirectConfirm({
  children,
  href,
  title,
  description,
  continueLabel = "Continuar",
  onTriggerClick,
  open,
  onOpenChange,
}: {
  children?: ReactNode;
  href: string;
  title: string;
  description: string;
  continueLabel?: string;
  onTriggerClick?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? (
        <DialogTrigger asChild>
          <span onClick={onTriggerClick} className="contents">
            {children}
          </span>
        </DialogTrigger>
      ) : null}

      <DialogContent className="modal-stagger redirect-confirm max-w-sm border-accent/15 bg-card/92 shadow-[0_32px_100px_-36px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:rounded-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/15 bg-primary/12 text-accent shadow-[0_12px_34px_-22px_rgba(245,124,0,.9)]">
          <Radar className="h-6 w-6" aria-hidden="true" />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-xl leading-tight">{title}</DialogTitle>
          <DialogDescription className="mx-auto max-w-[32ch] text-pretty leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex-col sm:items-center sm:gap-3 sm:space-x-0">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "signal", size: "signal" }),
              "group w-full sm:w-auto",
            )}
          >
            {continueLabel}
            <ArrowUpRight className="contact-arrow-fly" aria-hidden="true" />
          </a>

          <DialogClose asChild>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-[color,opacity,transform] duration-200 hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Agora não
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
