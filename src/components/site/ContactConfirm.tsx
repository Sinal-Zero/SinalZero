import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactConfirm({ className }: { className?: string }) {
  return (
    <Button asChild variant="signal" size="signal" className={cn("group", className)}>
      <Link to="/contato">
        Falar com a SinalZero
        <ArrowUpRight
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Link>
    </Button>
  );
}
