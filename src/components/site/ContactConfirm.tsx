import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactConfirm({ className }: { className?: string }) {
  return (
    <Button asChild variant="signal" size="signal" className={cn("group", className)}>
      <Link to="/contato">
        Falar com a SinalZero
        <span
          className="inline-flex size-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-primary-foreground/25 motion-reduce:transition-none"
          aria-hidden="true"
        >
          <ArrowUpRight />
        </span>
      </Link>
    </Button>
  );
}
