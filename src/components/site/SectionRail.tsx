import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { CircleDot, Compass, Crosshair, HelpCircle, Radar, Users, Workflow } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";

export const SECTIONS = [
  { href: "#topo", label: "Início", icon: Radar },
  { href: "#sobre", label: "Sobre", icon: CircleDot },
  { href: "#servicos", label: "Serviços", icon: Compass },
  { href: "#processo", label: "Processo", icon: Workflow },
  { href: "#para-quem", label: "Para quem", icon: Users },
  { href: "#solucoes", label: "Soluções", icon: Crosshair },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
];

type DockItemProps = {
  href: string;
  label: string;
  active: boolean;
  icon: typeof Radar;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  onNavigate: (href: string) => void;
};

function DockItem({ href, label, active, icon: Icon, mouseY, onNavigate }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const baseSize = 44;
  const distance = 142;

  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseSize };
    return value - rect.y - rect.height / 2;
  });

  const targetScale = useTransform(
    mouseDistance,
    [-distance, -distance * 0.5, 0, distance * 0.5, distance],
    [1, 1.14, 1.46, 1.14, 1],
  );
  const targetX = useTransform(
    mouseDistance,
    [-distance, -distance * 0.5, 0, distance * 0.5, distance],
    [0, 3, 10, 3, 0],
  );
  const scale = useSpring(targetScale, { mass: 0.16, stiffness: 275, damping: 22 });
  const x = useSpring(targetX, { mass: 0.18, stiffness: 250, damping: 24 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        width: baseSize,
        height: baseSize,
        scale,
        x,
        color: active ? "var(--color-accent)" : undefined,
        backgroundColor: active ? "transparent" : undefined,
        borderColor: active ? "transparent" : undefined,
        boxShadow: active ? "none" : undefined,
      }}
      className="dock-item"
      aria-label={label}
      aria-current={active ? "location" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[0.12rem] rounded-[0.78rem] border"
        initial={false}
        animate={
          isHovered
            ? {
                opacity: 1,
                scale: 1.08,
                borderColor: "color-mix(in oklab, var(--color-accent) 68%, transparent)",
                backgroundColor: "color-mix(in oklab, var(--color-accent) 24%, transparent)",
                boxShadow:
                  "0 0 0 1px color-mix(in oklab,var(--color-gold) 18%,transparent), 0 12px 34px -10px color-mix(in oklab,var(--color-accent) 78%,transparent)",
              }
            : {
                opacity: 0,
                scale: 0.92,
                borderColor: "transparent",
                backgroundColor: "transparent",
                boxShadow: "0 0 0 0 transparent",
              }
        }
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      />

      {active ? (
        <motion.span
          layoutId="section-rail-indicator"
          className="dock-indicator"
          transition={{
            layout: {
              duration: 0.34,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          aria-hidden="true"
        />
      ) : null}

      <motion.span
        className="relative z-[1] inline-flex"
        animate={
          isHovered
            ? {
                scale: 1.18,
                y: -1,
                filter:
                  "drop-shadow(0 0 8px color-mix(in oklab,var(--color-accent) 72%,transparent))",
              }
            : { scale: 1, y: 0, filter: "drop-shadow(0 0 0 transparent)" }
        }
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <Icon className="dock-icon" aria-hidden="true" />
      </motion.span>

      <AnimatePresence initial={false}>
        {active ? (
          <motion.span
            key="active-label"
            initial={{ opacity: 0, x: -6, filter: "blur(4px)", scale: 0.98 }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, x: -4, filter: "blur(3px)", scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="dock-active-label"
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="hover-label"
            initial={{ opacity: 0, x: -12, filter: "blur(7px)", scale: 0.92 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 5 : -12,
              filter: isHovered ? "blur(0px)" : "blur(7px)",
              scale: isHovered ? 1.08 : 0.92,
            }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
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
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
  const reducedMotion = useReducedMotion();
  const { active, navigateToSection } = useActiveSection(
    SECTIONS.map((s) => s.href),
    reducedMotion,
  );

  return (
    <motion.nav
      aria-label="Navegação rápida"
      className="section-rail fixed left-4 top-1/2 z-[80] hidden -translate-y-1/2 lg:block xl:left-7"
      initial={reducedMotion ? false : { opacity: 0, filter: "blur(5px)", x: -10, scale: 0.975 }}
      animate={{ opacity: 1, filter: "blur(0px)", x: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      <motion.div
        className="dock-outer"
        onMouseMove={(event) => mouseY.set(event.clientY)}
        onMouseLeave={() => mouseY.set(Number.POSITIVE_INFINITY)}
        style={{ pointerEvents: "auto" }}
      >
        <motion.div className="dock-panel" role="toolbar" aria-label="Navegação do site">
          {SECTIONS.map((item) => (
            <DockItem
              key={item.href}
              {...item}
              active={item.href === active}
              mouseY={mouseY}
              onNavigate={navigateToSection}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
