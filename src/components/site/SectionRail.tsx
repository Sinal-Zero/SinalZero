import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CircleDot, Compass, Crosshair, HelpCircle, Radar, Users, Workflow } from "lucide-react";

const SECTIONS = [
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
};

function DockItem({ href, label, active, icon: Icon, mouseY }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const hovered = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const distance = 165;
  const baseSize = 44;
  const magnification = 50;

  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseSize };
    return value - rect.y - baseSize / 2;
  });
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const size = useSpring(targetSize, { mass: 0.28, stiffness: 145, damping: 24 });

  useMotionValueEvent(hovered, "change", (value) => setIsHovered(value === 1));

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        width: size,
        height: size,
        color: active ? "var(--color-accent)" : undefined,
        backgroundColor: active ? "transparent" : undefined,
        borderColor: active ? "transparent" : undefined,
        boxShadow: active ? "none" : undefined,
      }}
      className="dock-item"
      aria-label={label}
      aria-current={active ? "location" : undefined}
      onMouseEnter={() => hovered.set(1)}
      onMouseLeave={() => hovered.set(0)}
      onFocus={() => hovered.set(1)}
      onBlur={() => hovered.set(0)}
    >
      {active ? (
        <motion.span
          layoutId="section-rail-indicator"
          className="dock-indicator"
          transition={{
            layout: {
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          aria-hidden="true"
        />
      ) : null}
      <Icon className="dock-icon" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.span
            key="active-label"
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -3 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="dock-active-label"
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="hover-label"
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -3 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
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
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
  const reducedMotion = useReducedMotion();

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
    <motion.nav
      aria-label="Navegação rápida"
      className="section-rail fixed left-4 top-1/2 z-[80] hidden -translate-y-1/2 lg:block xl:left-7"
      initial={reducedMotion ? false : { opacity: 0, filter: "blur(3px)", x: -8, scale: 0.99 }}
      animate={{ opacity: 1, filter: "blur(0px)", x: 0, scale: 1 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
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
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
