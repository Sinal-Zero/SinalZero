import { useEffect, useState } from "react";
import { MobileNav } from "./MobileNav";

/**
 * A SectionRail continua como navegação rápida no desktop.
 * O hamburger fica disponível em todos os tamanhos de tela como menu secundário.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
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

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-px overflow-hidden bg-transparent"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-primary via-accent to-gold transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
