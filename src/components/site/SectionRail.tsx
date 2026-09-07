import {
  AnimatePresence,
  motion,
  useMotionValue,
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
  onNavigate: (href: string) => void;
};

function DockItem({ href, label, active, icon: Icon, mouseY, onNavigate }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const baseSize = 44;
  const distance = 132;

  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseSize };
    return value - rect.y - rect.height / 2;
  });

  const targetScale = useTransform(
    mouseDistance,
    [-distance, -distance * 0.5, 0, distance * 0.5, distance],
    [1, 1.08, 1.28, 1.08, 1],
  );
  const targetX = useTransform(
    mouseDistance,
    [-distance, -distance * 0.5, 0, distance * 0.5, distance],
    [0, 1.5, 5, 1.5, 0],
  );
  const scale = useSpring(targetScale, { mass: 0.18, stiffness: 250, damping: 24 });
  const x = useSpring(targetX, { mass: 0.2, stiffness: 230, damping: 25 });

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
        animate={isHovered ? { rotate: 0, scale: 1.04 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, x: -7, filter: "blur(5px)", scale: 0.97 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -7,
              filter: isHovered ? "blur(0px)" : "blur(5px)",
              scale: isHovered ? 1 : 0.97,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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

  const navigateToSection = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    setActive(href);
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });

    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  };

  useEffect(() => {
    const nodes = SECTIONS.map(({ href }) => document.querySelector(href)).filter(
      (node): node is Element => Boolean(node),
    );
    if (!nodes.length) return;

    if (window.location.hash) {
      const initialHash = window.location.hash;
      const hashTarget = document.querySelector(initialHash);
      if (hashTarget) setActive(initialHash);
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(window.history.state, "", cleanUrl);
    }

    let frame = 0;
    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.33;
      let nextActive = "#topo";
      nodes.forEach((node, index) => {
        const href = SECTIONS[index]?.href;
        if (href && node.getBoundingClientRect().top + window.scrollY <= marker) nextActive = href;
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
