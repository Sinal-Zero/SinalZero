import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LINKTREE_URL } from "./constants";
import { RedirectConfirm } from "./RedirectConfirm";

export function ContactConfirm({ className }: { className?: string }) {
  return (
    <RedirectConfirm
      href={LINKTREE_URL}
      title="Vamos para o Linktree"
      description="Você será direcionado para o Linktree da SinalZero, com todos os canais de contato reunidos em um só lugar."
    >
      <Button variant="signal" size="signal" className={cn("group", className)}>
        Falar com a SinalZero
        <ArrowUpRight
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Button>
    </RedirectConfirm>
  );
}
