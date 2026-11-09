// src/components/Carousel3D.tsx

import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Card from "./Card";
import { cards } from "./CardList";

const BASE_RADIUS = 100;
const BASE_VIEWPORT_WIDTH = 1920;
const BASE_CONTAINER_HEIGHT = 900;
const AUTO_ROTATION_SPEED = 0.003;
const VELOCITY_DAMPING = 0.05;

// Hover hint: the ring sways right then left (damped sine, in offset units)
// to show it can be spun, until the visitor has dragged it once.
const SWAY_AMPLITUDE = 1.6;
const SWAY_PERIOD_MS = 900;
const SWAY_DECAY_MS = 450;
const SWAY_LENGTH_MS = 1600;
const swayAt = (t: number) =>
  SWAY_AMPLITUDE * Math.sin((2 * Math.PI * t) / SWAY_PERIOD_MS) * Math.exp(-t / SWAY_DECAY_MS);

function ScaleOverride({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const state = useThree();
  const [originalSetSize] = useState(() => state.setSize);

  useLayoutEffect(() => {
    state.setSize = () => {};
    return () => {
      state.setSize = originalSetSize;
    };
  }, [state, originalSetSize]);

  useEffect(() => {
    originalSetSize(width, height);
  }, [width, height, originalSetSize]);

  return null;
}

const CarouselScene: React.FC<{
  targetOffset: number;
  scaleFactor: number;
}> = ({ targetOffset, scaleFactor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useRef(0);
  const radius = BASE_RADIUS * scaleFactor;

  useFrame(() => {
    offset.current += (targetOffset - offset.current) * 0.03;
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const card = child as THREE.Group;
      const baseAngle = (index * Math.PI * 2) / cards.length;
      const angle = baseAngle + offset.current / 5;
      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      card.position.set(x, 0, z);
      card.lookAt(0, 0, 0);
      card.rotation.z = 0;
    });
  });

  return (
    <group ref={groupRef} rotation={[0, 0, THREE.MathUtils.degToRad(-5)]}>
      {cards.map((c, i) => (
        <Card
          key={i}
          {...c}
          angle={(i * Math.PI * 2) / cards.length + offset.current / 5}
          scaleFactor={scaleFactor}
        />
      ))}
    </group>
  );
};

const Carousel3D: React.FC = () => {
  const [targetOffset, setTargetOffset] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollSpeed = 0.02;
  const allowDrag = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const velocityRef = useRef(AUTO_ROTATION_SPEED);
  const lastFrameTime = useRef(performance.now());
  const animationFrameId = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(false);
  const hasDragged = useRef(false);
  const hintRef = useRef<HTMLDivElement>(null);
  const swayStart = useRef<number | null>(null);
  const swayLast = useRef(0);

  const scaleFactor = windowWidth / BASE_VIEWPORT_WIDTH;

  const animateCarousel = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastFrameTime.current) / 16.67, 2);
    lastFrameTime.current = now;

    if (!dragging.current) {
      const velocityDiff = AUTO_ROTATION_SPEED - velocityRef.current;
      velocityRef.current += velocityDiff * VELOCITY_DAMPING * deltaTime;

      let sway = 0;
      if (swayStart.current !== null) {
        const t = now - swayStart.current;
        const value = t < SWAY_LENGTH_MS ? swayAt(t) : 0;
        sway = value - swayLast.current;
        swayLast.current = value;
        if (t >= SWAY_LENGTH_MS) swayStart.current = null;
      }

      setTargetOffset((prev) => prev + velocityRef.current * deltaTime + sway);
    }

    animationFrameId.current = requestAnimationFrame(animateCarousel);
  };

  useEffect(() => {
    lastFrameTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animateCarousel);
    return () => {
      if (animationFrameId.current !== null)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const moveHint = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!hintRef.current || !el) return;
      // The wrapper is scaled with scroll; map the cursor into its own units.
      const box = el.getBoundingClientRect();
      const scale = box.width / el.offsetWidth || 1;
      const x = (e.clientX - box.left) / scale + 18;
      const y = (e.clientY - box.top) / scale + 18;
      hintRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (allowDrag.current) {
        dragging.current = true;
        startX.current = e.clientX;
      }
    };
    const handleMouseUp = () => {
      dragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (allowDrag.current) moveHint(e);
      if (dragging.current) {
        if (!hasDragged.current && Math.abs(e.clientX - startX.current) > 4) {
          hasDragged.current = true;
          setShowHint(false);
        }
        const delta = e.clientX - startX.current;
        velocityRef.current = -delta * scrollSpeed * 0.1;
        setTargetOffset((prev) => prev - delta * scrollSpeed);
        startX.current = e.clientX;
      }
    };
    const handleEnter = (e: MouseEvent) => {
      allowDrag.current = true;
      if (hasDragged.current) return;
      moveHint(e);
      setShowHint(true);
      // Sway once per hover, and not again while one is still playing.
      if (!reducedMotion && swayStart.current === null) {
        swayStart.current = performance.now();
        swayLast.current = 0;
      }
    };
    const handleLeave = () => {
      allowDrag.current = false;
      dragging.current = false;
      setShowHint(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseenter", handleEnter);
    containerRef.current?.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseenter", handleEnter);
      containerRef.current?.removeEventListener("mouseleave", handleLeave);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-grab active:cursor-grabbing overflow-visible"
      style={{ height: `${BASE_CONTAINER_HEIGHT * scaleFactor}px` }}
    >
      {/* Cursor-following "drag" hint; positioned by moveHint(). The z-index
          clears drei's <Html> cards, which use z-indexes up to 16777271. */}
      <div ref={hintRef} className="pointer-events-none absolute left-0 top-0 z-[16777272]">
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/75 px-3 py-1.5 text-sm font-medium text-white shadow-lg"
            >
              <span className="text-indigo-300">&larr;</span>
              Drag to spin
              <span className="text-indigo-300">&rarr;</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Canvas
        dpr={window.devicePixelRatio}
        camera={{ position: [0, 0, 10], fov: 32 }}
      >
        <ScaleOverride
          width={windowWidth}
          height={BASE_CONTAINER_HEIGHT * scaleFactor}
        />
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <pointLight position={[10, 10, 10]} />
          <CarouselScene
            targetOffset={targetOffset}
            scaleFactor={scaleFactor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Carousel3D;
