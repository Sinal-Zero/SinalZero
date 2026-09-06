import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const BAR_COLORS = ["primary", "accent", "gold", "ember"] as const;

export function LoadingWave({ large = false }: { large?: boolean }) {
  return (
    <div className={cn("loading-wave", large && "loading-wave-large")} aria-hidden="true">
      {BAR_COLORS.map((color) => (
        <span key={color} className={`loading-bar loading-bar-${color}`} />
      ))}
    </div>
  );
}

type LoadingContextValue = { showLoading: (duration?: number) => void };
const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [landingLoading, setLandingLoading] = useState(true);
  const [demandLoading, setDemandLoading] = useState(false);
  const demandTimer = useRef<number | null>(null);

  useEffect(() => {
    const landingTimer = window.setTimeout(() => setLandingLoading(false), 2000);
    return () => window.clearTimeout(landingTimer);
  }, []);

  const showLoading = useCallback((duration = 900) => {
    setDemandLoading(true);
    if (demandTimer.current) window.clearTimeout(demandTimer.current);
    demandTimer.current = window.setTimeout(() => {
      setDemandLoading(false);
      demandTimer.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    const onLoadingRequest = (event: Event) => {
      const duration = (event as CustomEvent<{ duration?: number }>).detail?.duration;
      showLoading(duration);
    };
    window.addEventListener("sinalzero:loading", onLoadingRequest);
    return () => {
      window.removeEventListener("sinalzero:loading", onLoadingRequest);
      if (demandTimer.current) window.clearTimeout(demandTimer.current);
    };
  }, [showLoading]);

  const visible = landingLoading || demandLoading;

  return (
    <LoadingContext.Provider value={{ showLoading }}>
      {children}
      <div
        className={cn("global-loading", visible && "global-loading-visible")}
        data-landing={landingLoading}
        aria-hidden={!visible}
        aria-busy={visible}
      >
        <div className="global-loading-panel">
          <LoadingWave large />
          <span className="sr-only" role="status">
            Carregando radar
          </span>
        </div>
      </div>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used inside LoadingProvider");
  return context;
}
