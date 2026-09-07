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
}: {
  children: ReactNode;
  href: string;
  title: string;
  description: string;
  continueLabel?: string;
  onTriggerClick?: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span onClick={onTriggerClick} className="contents">
          {children}
        </span>
      </DialogTrigger>

      <DialogContent className="modal-stagger max-w-sm border-border bg-card/95 backdrop-blur-xl sm:rounded-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-accent">
          <Radar className="h-6 w-6" aria-hidden="true" />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Agora não
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
