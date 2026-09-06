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
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LINKTREE_URL } from "./constants";

/**
 * CTA principal do site: abre uma confirmação antes de sair para o Linktree,
 * com o conteúdo do modal aparecendo em cascata (ícone, título, texto, ações).
 */
export function ContactConfirm({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="signal" size="signal" className={cn("group", className)}>
          Falar com a SinalZero
          <ArrowUpRight
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Button>
      </DialogTrigger>

      <DialogContent className="modal-stagger max-w-sm border-border bg-card/95 backdrop-blur-xl sm:rounded-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-accent">
          <Radar className="h-6 w-6" aria-hidden="true" />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-xl">Vamos para o Linktree</DialogTitle>
          <DialogDescription>
            Você será direcionado para o Linktree da SinalZero, com todos os canais de contato
            reunidos em um só lugar.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex-col sm:items-center sm:gap-3 sm:space-x-0">
          <a
            href={LINKTREE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "signal", size: "signal" }), "w-full sm:w-auto")}
          >
            Continuar
            <ArrowUpRight aria-hidden="true" />
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
