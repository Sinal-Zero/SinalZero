const BAR_COLORS = ["primary", "accent", "gold", "ember"] as const;

export function LoadingWave() {
  return (
    <div className="loading-wave" role="status" aria-label="Carregando radar">
      {BAR_COLORS.map((color) => (
        <span key={color} className={`loading-bar loading-bar-${color}`} aria-hidden="true" />
      ))}
      <span className="sr-only">Carregando radar</span>
    </div>
  );
}
