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
import { cards, cardImage, cardImageWidth } from "./CardList";
import { useCardHover } from "../hooks/useCardHover";

const BASE_RADIUS = 100;
const BASE_VIEWPORT_WIDTH = 1920;
const BASE_CONTAINER_HEIGHT = 900;
const AUTO_ROTATION_SPEED = 0.003;
const VELOCITY_DAMPING = 0.05;
/** Share of the remaining distance the ring covers per (60fps) frame. */
const OFFSET_EASE = 0.03;
const DRAG_SPEED = 0.02;
const TILT_DEG = -5;
/** Same as Card's CLICK_TOLERANCE: more mouse movement than this is a drag. */
const DRAG_TOLERANCE = 5;

// The ring's motion lives outside React on purpose. It changes every frame,
// and keeping it in React state re-rendered the whole carousel (13 cards, each
// with its own drei <Html> React root) on every frame and every mouse move,
// which is what made it slow. Being module-level it also survives leaving the
// page: coming back to Portfolio, the ring is where it was left.
const ring = {
  /** Where the ring is heading (dragging and auto-rotation move this). */
  target: 0,
  /** Where the ring is drawn; eases toward `target`. */
  offset: 0,
  velocity: AUTO_ROTATION_SPEED,
  dragging: false,
};

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
  if (dragPractice >= 1) return true; // retired earlier in this visit
  try {
    return localStorage.getItem(HINT_DONE_KEY) === "1";
  } catch {
    return false; // storage blocked: it is only remembered for this visit
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
  scaleFactor: number;
  /** How wide (in real pixels) card images need to be on this screen. */
  imageWidth: number;
}> = ({ scaleFactor, imageWidth }) => {
  const groupRef = useRef<THREE.Group>(null);
  const radius = BASE_RADIUS * scaleFactor;

  useFrame((_, delta) => {
    // Time in 60fps frames, so the ring turns at its intended speed on a slow
    // machine too instead of slowing down with the frame rate.
    const frames = Math.min(delta * 60, 10);
    if (!ring.dragging) {
      ring.velocity +=
        (AUTO_ROTATION_SPEED - ring.velocity) * (1 - Math.pow(1 - VELOCITY_DAMPING, frames));
      ring.target += ring.velocity * frames;
    }
    // At 60fps and above this is the original per-frame easing; below that it
    // covers the ground of the frames that were missed.
    ring.offset += (ring.target - ring.offset) * (1 - Math.pow(1 - OFFSET_EASE, Math.max(1, frames)));
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const card = child as THREE.Group;
      const baseAngle = (index * Math.PI * 2) / cards.length;
      const angle = baseAngle + ring.offset / 5;
      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      card.position.set(x, 0, z);
      card.lookAt(0, 0, 0);
      card.rotation.z = 0;
    });
  });

  // Everything visible here is DOM (the cards are drei <Html>); the WebGL
  // scene only supplies the 3D maths. A frame callback with a priority tells
  // react-three-fiber not to draw the (empty, transparent) canvas each frame.
  useFrame(() => {}, 1);

  return (
    <group ref={groupRef} rotation={[0, 0, THREE.MathUtils.degToRad(TILT_DEG)]}>
      {cards.map((c, i) => (
        <Card
          key={i}
          {...c}
          image={cardImage(c, imageWidth)}
          angle={(i * Math.PI * 2) / cards.length}
          scaleFactor={scaleFactor}
        />
      ))}
    </group>
  );
};

const Carousel3D: React.FC<{ hintEnabled?: boolean }> = ({ hintEnabled = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // Not rendered at all if it had already retired when the page mounted;
  // when it retires now, it stays mounted so the badge can fade out.
  const [hintAtMount] = useState(() => !hintIsDone());
  const [hintRetired, setHintRetired] = useState(!hintAtMount);
  useCardHover(containerRef);

  const scaleFactor = windowWidth / BASE_VIEWPORT_WIDTH;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let lastX = 0;
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
      ring.dragging = false;
      active = false;
      root.classList.remove("carousel-dragging");
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !onRing(e)) return;
      ring.dragging = true;
      active = false;
      lastX = e.clientX;
      downX = e.clientX;
      downY = e.clientY;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!ring.dragging) return;
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
      const delta = e.clientX - lastX;
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
      ring.velocity = -delta * DRAG_SPEED * 0.1;
      ring.target -= delta * DRAG_SPEED;
      lastX = e.clientX;
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
            scaleFactor={scaleFactor}
            imageWidth={cardImageWidth()}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Memoised: the home page re-renders on every scroll event, and the carousel
// (with its 13 cards) only needs to when the hint is switched on or off.
export default React.memo(Carousel3D);
