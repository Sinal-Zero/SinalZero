import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { OccultMenu } from "./OccultMenu";

const RADAR_LOGO_SRC = "/radar-logo.svg";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [occultMenuOpen, setOccultMenuOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScrollY = useRef(0);
  const menuState = useRef({ menuOpen: false, occultMenuOpen: false });

  useEffect(() => {
    menuState.current = { menuOpen, occultMenuOpen };
    if (menuOpen || occultMenuOpen) setHiddenOnScroll(false);
  }, [menuOpen, occultMenuOpen]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrolled(currentY > 24);
        const scrollingDown = currentY > lastScrollY.current + 8;
        const scrollingUp = currentY < lastScrollY.current - 8;
        if (scrollingDown || scrollingUp || currentY <= 120) {
          setHiddenOnScroll(
            currentY > 120 &&
              scrollingDown &&
              !menuState.current.menuOpen &&
              !menuState.current.occultMenuOpen,
          );
        }
        lastScrollY.current = currentY;
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
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,transform] duration-500 [transition-timing-function:cubic-bezier(.22,1.35,.36,1)] motion-reduce:transition-none",
        hiddenOnScroll && "-translate-y-full",
        scrolled || menuOpen
          ? "border-border bg-background/92 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-transparent bg-transparent shadow-none",
      )}
    >
      <div
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8 lg:data-[scrolled=true]:h-[4.5rem]"
        data-scrolled={scrolled}
      >
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

        <div className="flex items-center gap-3">
          <OccultMenu open={occultMenuOpen} onOpenChange={setOccultMenuOpen} />
          <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>

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
