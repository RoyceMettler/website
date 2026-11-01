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
import { cards } from "./CardList";

const BASE_RADIUS = 100;
const BASE_VIEWPORT_WIDTH = 1920;
const BASE_CONTAINER_HEIGHT = 900;
const AUTO_ROTATION_SPEED = 0.003;
const VELOCITY_DAMPING = 0.05;

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
      if (dragging.current) {
        const delta = e.clientX - startX.current;
        velocityRef.current = -delta * scrollSpeed * 0.1;
        setTargetOffset((prev) => prev - delta * scrollSpeed);
        startX.current = e.clientX;
      }
    };
    const handleEnter = () => (allowDrag.current = true);
    const handleLeave = () => {
      allowDrag.current = false;
      dragging.current = false;
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full cursor-grab overflow-visible"
      style={{ height: `${BASE_CONTAINER_HEIGHT * scaleFactor}px` }}
    >
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
