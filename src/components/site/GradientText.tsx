import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#F57C00", "#FFA726", "#FFD166", "#F57C00"];

export function GradientText({
  children,
  className,
  colors = DEFAULT_COLORS,
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animationDuration = Math.max(animationSpeed, 0.1) * 1000;

  useAnimationFrame((time) => {
    if (isPaused || reducedMotion) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;
    const cycleTime = elapsedRef.current % (yoyo ? animationDuration * 2 : animationDuration);
    const nextProgress = yoyo
      ? cycleTime < animationDuration
        ? (cycleTime / animationDuration) * 100
        : 100 - ((cycleTime - animationDuration) / animationDuration) * 100
      : (elapsedRef.current / animationDuration) * 100;
    progress.set(nextProgress);
  });

  useEffect(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, (value) =>
    direction === "vertical" ? `50% ${value}%` : `${value}% 50%`,
  );
  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";
  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${[...colors, colors[0] ?? DEFAULT_COLORS[0]].join(", ")})`,
    backgroundSize: direction === "vertical" ? "100% 300%" : "300% 300%",
    backgroundRepeat: "repeat",
  };
  const handleMouseEnter = useCallback(() => pauseOnHover && setIsPaused(true), [pauseOnHover]);
  const handleMouseLeave = useCallback(() => pauseOnHover && setIsPaused(false), [pauseOnHover]);

  return (
    <motion.span
      className={cn("animated-gradient-text", showBorder && "with-border", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder ? (
        <motion.span
          className="gradient-overlay"
          style={{ ...gradientStyle, backgroundPosition }}
        />
      ) : null}
      <motion.span className="text-content" style={{ ...gradientStyle, backgroundPosition }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
