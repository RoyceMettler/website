// src/components/Card.tsx

import React, { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

const BASE_WIDTH = 1800;
const BASE_HEIGHT = 1200;
const BASE_BORDER_RADIUS = 100;
const BASE_FONT_SIZE = 200;
const BASE_TEXT_SHADOW = 20;
const CLICK_TOLERANCE = 5;

export type CardProps = {
  label: string;
  image: string;
  link: string;
  external?: boolean;
  angle: number;
  scaleFactor: number;
};

const Card: React.FC<CardProps> = ({
  label,
  image,
  link,
  external = false,
  scaleFactor,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  const startPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!startPos.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (Math.hypot(dx, dy) > CLICK_TOLERANCE) {
      setIsDragging(true);
    }
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (!external) {
        e.preventDefault();
        navigate(link);
      }
    },
    [isDragging, external, navigate, link]
  );

  useFrame(() => {
    if (!meshRef.current || !imgRef.current) return;
    const worldAngle = meshRef.current.rotation.y;
    const norm = (worldAngle + Math.PI * 2) % (Math.PI * 2);
    const shiftPercent = Math.sin(norm) * 20;
    imgRef.current.style.transform = `translateX(${shiftPercent}%) scale(1.3)`;
  });

  const width = BASE_WIDTH * scaleFactor;
  const height = BASE_HEIGHT * scaleFactor;
  const borderRadius = `${BASE_BORDER_RADIUS * scaleFactor}px`;
  const fontSize = `${BASE_FONT_SIZE * scaleFactor}px`;
  const textShadow = `${BASE_TEXT_SHADOW * scaleFactor}px ${BASE_TEXT_SHADOW * scaleFactor}px ${BASE_TEXT_SHADOW * scaleFactor}px rgba(0,0,0,0.3)`;

  const content = (
    <div
      className="overflow-hidden shadow-xl w-full h-full relative select-none"
      style={{ borderRadius }}
    >
      <img
        ref={imgRef}
        src={image}
        alt={label}
        draggable={false}
        className="w-full h-full object-cover"
        style={{
          willChange: "transform",
          imageRendering: "-moz-crisp-edges",
        }}
      />
      <div
  className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none p-4"
  style={{ fontSize, textShadow }}
>
  <p className="text-center whitespace-pre-line leading-tight">
    {label}
  </p>
</div>
    </div>
  );

  return (
    <group ref={meshRef}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Html transform center>
        <a
          href={link}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onClick={onClick}
          // Hover look comes from data-hover (set by useCardHover), not from
          // :hover, which goes stale when the ring turns under a still mouse.
          className="block w-full h-full cursor-default data-[hover=true]:cursor-pointer select-none transition-transform duration-600 ease-in-out data-[hover=true]:scale-105"
          style={{ width, height }}
        >
          {content}
        </a>
      </Html>
    </group>
  );
};

export default Card;
