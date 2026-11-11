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
import Card from "./Card";
import DragCursor from "./DragCursor";
import { cards } from "./CardList";
import { useCardHover } from "../hooks/useCardHover";

const BASE_RADIUS = 100;
const BASE_VIEWPORT_WIDTH = 1920;
const BASE_CONTAINER_HEIGHT = 900;
const AUTO_ROTATION_SPEED = 0.003;
const VELOCITY_DAMPING = 0.05;
const TILT_DEG = -5;
/** Same as Card's CLICK_TOLERANCE: more mouse movement than this is a drag. */
const DRAG_TOLERANCE = 5;

// The "Drag or click" hint is only there to show that the ring can be dragged.
// Once the visitor has really dragged it (about a second of dragging, or
// about 600px, or a mix of the two) it retires for good, remembered in
// localStorage so it doesn't come back on later visits.
const HINT_DONE_KEY = "carousel-drag-hint-done";
const HINT_DONE_MS = 1000;
const HINT_DONE_PX = 600;
/** 0..1: how much real dragging has been done since the site was loaded. */
let dragPractice = 0;

const hintIsDone = () => {
  try {
    return localStorage.getItem(HINT_DONE_KEY) === "1";
  } catch {
    return false; // storage blocked: the hint just lasts for this visit
  }
};

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
    <group ref={groupRef} rotation={[0, 0, THREE.MathUtils.degToRad(TILT_DEG)]}>
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

const Carousel3D: React.FC<{ hintEnabled?: boolean }> = ({ hintEnabled = true }) => {
  const [targetOffset, setTargetOffset] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollSpeed = 0.02;
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const velocityRef = useRef(AUTO_ROTATION_SPEED);
  const lastFrameTime = useRef(performance.now());
  const animationFrameId = useRef<number | null>(null);
  // Not rendered at all if it had already retired when the page mounted;
  // when it retires now, it stays mounted so the badge can fade out.
  const [hintAtMount] = useState(() => !hintIsDone());
  const [hintRetired, setHintRetired] = useState(!hintAtMount);
  useCardHover(containerRef);

  const scaleFactor = windowWidth / BASE_VIEWPORT_WIDTH;

  const animateCarousel = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastFrameTime.current) / 16.67, 2);
    lastFrameTime.current = now;

    if (!dragging.current) {
      const velocityDiff = AUTO_ROTATION_SPEED - velocityRef.current;
      velocityRef.current += velocityDiff * VELOCITY_DAMPING * deltaTime;
      setTargetOffset((prev) => prev + velocityRef.current * deltaTime);
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
    const root = document.documentElement;
    let downX = 0;
    let downY = 0;
    let active = false; // this press has moved past the click tolerance
    let lastMoveAt = 0;
    let retired = hintIsDone();

    // A drag has to start on the ring itself: on a card, or in the narrow gap
    // right beside one. Hit-tested rather than measured, so anything drawn
    // over the cards (the intro card, the navbar) doesn't count.
    const onRing = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container || !(e.target instanceof Element) || !container.contains(e.target)) return false;
      if (e.target.closest("a")) return true;
      const cardAt = (x: number) => {
        const el = document.elementFromPoint(x, e.clientY);
        return !!el && container.contains(el) && !!el.closest("a");
      };
      const reach = window.innerWidth * 0.04;
      return cardAt(e.clientX - reach) || cardAt(e.clientX + reach);
    };

    const endDrag = () => {
      dragging.current = false;
      active = false;
      root.classList.remove("carousel-dragging");
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !onRing(e)) return;
      dragging.current = true;
      active = false;
      startX.current = e.clientX;
      downX = e.clientX;
      downY = e.clientY;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      // The button came up somewhere we couldn't see (outside the window).
      if ((e.buttons & 1) === 0) return endDrag();
      // Past the click tolerance it is a drag for sure: show the grabbing
      // cursor (everywhere, until release).
      const now = performance.now();
      if (!active && Math.hypot(e.clientX - downX, e.clientY - downY) > DRAG_TOLERANCE) {
        active = true;
        lastMoveAt = now;
        root.classList.add("carousel-dragging");
      }
      const delta = e.clientX - startX.current;
      if (active && !retired) {
        // Time counts only while the mouse is moving (pauses are capped).
        dragPractice += Math.min(now - lastMoveAt, 100) / HINT_DONE_MS + Math.abs(delta) / HINT_DONE_PX;
        lastMoveAt = now;
        if (dragPractice >= 1) {
          retired = true;
          try {
            localStorage.setItem(HINT_DONE_KEY, "1");
          } catch {
            // storage blocked: retired for this visit only
          }
          setHintRetired(true);
        }
      }
      velocityRef.current = -delta * scrollSpeed * 0.1;
      setTargetOffset((prev) => prev - delta * scrollSpeed);
      startX.current = e.clientX;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", endDrag);
    window.addEventListener("dragend", endDrag);

    return () => {
      endDrag();
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", endDrag);
      window.removeEventListener("dragend", endDrag);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-visible"
      style={{ height: `${BASE_CONTAINER_HEIGHT * scaleFactor}px` }}
    >
      {hintAtMount && (
        <DragCursor
          targetRef={containerRef}
          tiltDeg={TILT_DEG}
          enabled={hintEnabled && !hintRetired}
        />
      )}
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
