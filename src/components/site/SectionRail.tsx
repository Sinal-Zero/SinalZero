import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CircleDot, Compass, Crosshair, Radar, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoading } from "./LoadingWave";

const SECTIONS = [
  { href: "#topo", label: "Início", icon: Radar },
  { href: "#sobre", label: "Sobre", icon: CircleDot },
  { href: "#servicos", label: "Serviços", icon: Compass },
  { href: "#processo", label: "Processo", icon: Workflow },
  { href: "#solucoes", label: "Soluções", icon: Crosshair },
];

type DockItemProps = {
  href: string;
  label: string;
  active: boolean;
  icon: typeof Radar;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  showLoading: (duration?: number) => void;
};

function DockItem({ href, label, active, icon: Icon, mouseY, showLoading }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const hovered = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const distance = 150;
  const baseSize = 44;
  const magnification = 64;

  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseSize };
    return value - rect.y - baseSize / 2;
  });
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const size = useSpring(targetSize, { mass: 0.12, stiffness: 180, damping: 14 });

  useMotionValueEvent(hovered, "change", (value) => setIsHovered(value === 1));

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ width: size, height: size }}
      className={cn("dock-item", active && "dock-item-active")}
      aria-label={label}
      aria-current={active ? "location" : undefined}
      onMouseEnter={() => hovered.set(1)}
      onMouseLeave={() => hovered.set(0)}
      onFocus={() => hovered.set(1)}
      onBlur={() => hovered.set(0)}
      onClick={() => showLoading(400)}
    >
      {active ? (
        <motion.span
          layoutId="section-rail-indicator"
          className="dock-indicator"
          transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
          aria-hidden="true"
        />
      ) : null}
      <Icon className="dock-icon" aria-hidden="true" />
      <AnimatePresence>
        {active ? (
          <motion.span
            key="active-label"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="dock-active-label"
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="hover-label"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
            transition={{ duration: 0.2 }}
            className="dock-label"
            role="tooltip"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export function SectionRail() {
  const [active, setActive] = useState("#topo");
  const { showLoading } = useLoading();
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);

  useEffect(() => {
    const nodes = SECTIONS.map(({ href }) => document.querySelector(href)).filter(
      (node): node is Element => Boolean(node),
    );
    if (!nodes.length) return;

    let frame = 0;
    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      let nextActive = "#topo";
      nodes.forEach((node, index) => {
        const href = SECTIONS[index]?.href;
        if (href && node.getBoundingClientRect().top + window.scrollY <= marker) {
          nextActive = href;
        }
      });
      setActive((current) => (current === nextActive ? current : nextActive));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        updateActive();
        frame = 0;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Navegação rápida"
      className="section-rail fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-7"
    >
      <motion.div
        className="dock-outer"
        onMouseMove={(event) => mouseY.set(event.pageY)}
        onMouseLeave={() => mouseY.set(Number.POSITIVE_INFINITY)}
      >
        <motion.div className="dock-panel" role="toolbar" aria-label="Navegação do site">
          {SECTIONS.map((item) => (
            <DockItem
              key={item.href}
              {...item}
              active={item.href === active}
              mouseY={mouseY}
              showLoading={showLoading}
            />
          ))}
        </motion.div>
      </motion.div>
    </nav>
  );
}
