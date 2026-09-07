import { LINKTREE_URL } from "./constants";

const RADAR_LOGO_SRC = "/radar-logo.svg";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface/40 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-border/60 pb-10 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={RADAR_LOGO_SRC}
              alt="SinalZero"
              width={28}
              height={28}
              loading="lazy"
              className="h-7 w-7"
            />
            <span className="font-display text-base font-bold tracking-tight">
              Sinal<span className="text-accent">Zero</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
            <a href="#topo" className="transition-colors hover:text-foreground">
              Início
            </a>
            <a href="#sobre" className="transition-colors hover:text-foreground">
              Sobre
            </a>
            <a href="#servicos" className="transition-colors hover:text-foreground">
              Produtos
            </a>
            <a href="#processo" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <a href="#ebook" className="transition-colors hover:text-foreground">
              E-book
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
            <a
              href={LINKTREE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent transition-colors hover:text-gold"
            >
              Canais Oficiais
            </a>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistemas 100% Operacionais</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} SinalZero. Todos os direitos reservados.</p>
          <p className="text-[11px]">
            Prospecção inteligente &amp; Engenharia de produtos digitais.
          </p>
        </div>
      </div>
    </footer>
  );
}
