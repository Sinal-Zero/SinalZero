const RADAR_LOGO_SRC = "/radar-logo.svg";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <img src={RADAR_LOGO_SRC} alt="" width={28} height={28} loading="lazy" className="h-7 w-7" />
          <span className="font-display text-sm font-semibold">
            Sinal<span className="text-accent">Zero</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SinalZero. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
