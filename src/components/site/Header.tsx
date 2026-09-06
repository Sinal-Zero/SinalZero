import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const RADAR_LOGO_SRC = "/radar-logo.svg";

const NAV = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#solucoes", label: "Soluções" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-border bg-background/92 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-transparent bg-transparent shadow-none",
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8 lg:data-[scrolled=true]:h-[4.5rem]" data-scrolled={scrolled}>
        <a href="#topo" className="group flex items-center gap-3" aria-label="SinalZero, início">
          <img
            src={RADAR_LOGO_SRC}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-500 ease-out group-hover:rotate-[18deg] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
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
        data-open={menuOpen}
        aria-label="Seções do site no celular"
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows,opacity,border-color] duration-300 ease-out md:hidden motion-reduce:transition-none",
          menuOpen
            ? "grid-rows-[1fr] border-border opacity-100"
            : "pointer-events-none grid-rows-[0fr] border-transparent opacity-0",
        )}
      >
        <ul className="mx-auto flex min-h-0 w-full max-w-6xl flex-col px-5">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              className="mobile-nav-item border-b border-border last:border-0"
              style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : "0ms" }}
            >
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-transparent"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-primary via-accent to-gold transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  );
}
