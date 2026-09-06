import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Radar 3D: antena giratória sobre um piso de varredura (estilo PPI).
 * WebGL puro (sem dependências extras). Pausa fora da viewport, respeita
 * prefers-reduced-motion (renderiza um único frame estático) e limpa toda
 * a cena no unmount para não vazar memória de GPU.
 */
export function Radar3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === "undefined") return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 3.4, 7.2);
    const baseLookAt = new THREE.Vector3(0, 0.4, 0);
    camera.lookAt(baseLookAt);

    const gold = new THREE.Color("#ffd166");
    const accent = new THREE.Color("#ffa726");
    const primary = new THREE.Color("#f57c00");

    scene.add(new THREE.AmbientLight(0x2a3550, 1.4));
    const key = new THREE.PointLight(accent, 14, 20, 2);
    key.position.set(2.2, 4, 3);
    scene.add(key);
    const rim = new THREE.PointLight(gold, 6, 16, 2);
    rim.position.set(-3, 2, -2);
    scene.add(rim);

    // Tudo fica levemente deslocado para trás/baixo, como pano de fundo
    // atrás do texto do hero — nunca disputando atenção com ele.
    const world = new THREE.Group();
    world.position.set(0.35, -0.55, -1.1);
    world.scale.setScalar(0.85);
    scene.add(world);

    // --- piso de varredura (anéis de alcance) ---
    const floor = new THREE.Group();
    world.add(floor);

    for (let i = 1; i <= 4; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(i * 0.85 - 0.012, i * 0.85, 96),
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      floor.add(ring);
    }

    // varredura cônica (textura gerada em canvas 2D)
    const sweepCanvas = document.createElement("canvas");
    sweepCanvas.width = 256;
    sweepCanvas.height = 256;
    const sctx = sweepCanvas.getContext("2d")!;
    const grad = sctx.createConicGradient(0, 128, 128);
    grad.addColorStop(0, "rgba(255,209,102,0.65)");
    grad.addColorStop(0.06, "rgba(255,167,38,0.28)");
    grad.addColorStop(0.16, "rgba(255,167,38,0)");
    grad.addColorStop(1, "rgba(255,167,38,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
    const sweepTexture = new THREE.CanvasTexture(sweepCanvas);
    sweepTexture.colorSpace = THREE.SRGBColorSpace;

    // pivô com o setor luminoso e o braço físico que o "traça" — girando
    // juntos, como o braço de um radar de vigilância real
    const sweepPivot = new THREE.Group();
    world.add(sweepPivot);

    const sweepPlane = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 96),
      new THREE.MeshBasicMaterial({
        map: sweepTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sweepPlane.rotation.x = -Math.PI / 2;
    sweepPivot.add(sweepPlane);

    const sweepArm = new THREE.Mesh(
      new THREE.BoxGeometry(3.35, 0.03, 0.045),
      new THREE.MeshBasicMaterial({ color: gold }),
    );
    sweepArm.position.set(1.68, 0.02, 0);
    sweepPivot.add(sweepArm);

    // --- pedestal central com farol pulsante ---
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.3, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0x152840, metalness: 0.6, roughness: 0.35 }),
    );
    pedestal.position.y = 0.11;
    world.add(pedestal);

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x0a1424, metalness: 0.5, roughness: 0.4 }),
    );
    mast.position.y = 0.42;
    world.add(mast);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshStandardMaterial({ color: gold, emissive: gold, emissiveIntensity: 0.7 }),
    );
    beacon.position.y = 0.74;
    world.add(beacon);

    const blip = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshBasicMaterial({ color: gold }),
    );
    blip.position.set(1.55, 0.02, 0.9);
    floor.add(blip);

    // --- render loop ---
    let raf = 0;
    let running = false;
    let rotationY = 0;
    const clock = new THREE.Clock();
    const ROTATE_SPEED = 0.42; // rad/s
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };

    const renderFrame = () => {
      renderer.render(scene, camera);
    };

    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);

      rotationY += dt * ROTATE_SPEED;
      sweepPivot.rotation.y = rotationY;

      const blipPulse = 1 + Math.sin(rotationY * 3.1) * 0.35;
      blip.scale.setScalar(blipPulse);
      const beaconPulse = 0.55 + Math.sin(rotationY * 4.2) * 0.35;
      (beacon.material as THREE.MeshStandardMaterial).emissiveIntensity = beaconPulse;

      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;
      camera.position.x = pointer.x * 1.1;
      camera.position.y = 3.4 + pointer.y * 0.5;
      camera.lookAt(baseLookAt);

      renderFrame();
    };

    const onPointerMove = (e: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointerTarget.x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 1.6;
      pointerTarget.y = ((e.clientY - bounds.top) / bounds.height - 0.5) * -1.2;
    };

    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      container.addEventListener("pointermove", onPointerMove);
    }

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (!running) renderFrame();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const shouldRun = !!entry?.isIntersecting && !reduced;
        if (shouldRun && !running) {
          running = true;
          clock.start();
          tick();
        } else if (!shouldRun && running) {
          running = false;
          window.cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "10% 0px" },
    );
    visibilityObserver.observe(container);

    if (reduced) {
      sweepPivot.rotation.y = 1.1;
      renderFrame();
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      sweepTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [contain:layout_paint]",
        className,
      )}
    >
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--color-gold)_28%,transparent),transparent_62%)] blur-3xl" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  );
}
