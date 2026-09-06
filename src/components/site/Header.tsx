import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import radarLogo from "@/assets/sinalzero-radar.svg.asset.json";

const NAV = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#solucoes", label: "Soluções" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300", scrolled || menuOpen ? "border-border bg-background/92 backdrop-blur-md" : "border-transparent bg-transparent")}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#topo" className="group flex items-center gap-3" aria-label="SinalZero, início">
          <img
            src={radarLogo.url}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            Sinal<span className="text-accent">Zero</span>
          </span>
        </a>

        <nav aria-label="Seções do site" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Seções do site no celular"
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows,opacity,border-color] duration-300 ease-out md:hidden motion-reduce:transition-none",
          menuOpen ? "grid-rows-[1fr] border-border opacity-100" : "pointer-events-none grid-rows-[0fr] border-transparent opacity-0",
        )}
      >
        <ul className="mx-auto flex min-h-0 w-full max-w-6xl flex-col px-5">
          {NAV.map((item) => (
            <li key={item.href} className="border-b border-border last:border-0">
              <a href={item.href} onClick={() => setMenuOpen(false)} className="block py-4 text-sm font-medium text-foreground transition-colors hover:text-accent">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
