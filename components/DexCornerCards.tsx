"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Corner = "tl" | "tr" | "bl" | "br" | null;

const CORNER_ENTER = 0.22;
const CORNER_LEAVE = 0.32;
const ROTATE_MULTIPLE = 20;
const MAX_TILT = 16;
const LERP = 1;

type DexCornerCardsProps = {
  children: ReactNode;
  className?: string;
  cardClassName?: string;
};

export default function DexCornerCards({
  children,
  className,
  cardClassName,
}: DexCornerCardsProps) {
  const [activeCorner, setActiveCorner] = useState<Corner>(null);
  const activeCornerRef = useRef<Corner>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rectRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!frame || !card) return;

    const clamp = (value: number) =>
      Math.max(-MAX_TILT, Math.min(MAX_TILT, value));

    const animate = () => {
      rafRef.current = null;
      const nextX =
        currentRef.current.x +
        (targetRef.current.x - currentRef.current.x) * LERP;
      const nextY =
        currentRef.current.y +
        (targetRef.current.y - currentRef.current.y) * LERP;

      currentRef.current = { x: nextX, y: nextY };
      card.style.transform = `rotateX(${nextX.toFixed(2)}deg) rotateY(${nextY.toFixed(2)}deg)`;

      const diffX = Math.abs(targetRef.current.x - nextX);
      const diffY = Math.abs(targetRef.current.y - nextY);
      if (diffX > 0.05 || diffY > 0.05) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMove = (event: MouseEvent) => {
      lastPointRef.current = { x: event.clientX, y: event.clientY };
      if (!rectRef.current) {
        const rect = frame.getBoundingClientRect();
        rectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
      const rect = rectRef.current;
      const { x, y } = lastPointRef.current;
      const calcX = clamp(-(y - rect.top - rect.height / 2) / ROTATE_MULTIPLE);
      const calcY = clamp((x - rect.left - rect.width / 2) / ROTATE_MULTIPLE);
      targetRef.current = { x: calcX, y: calcY };

      const relX = (x - rect.left) / rect.width;
      const relY = (y - rect.top) / rect.height;
      const enterLeft = relX < CORNER_ENTER;
      const enterRight = relX > 1 - CORNER_ENTER;
      const enterTop = relY < CORNER_ENTER;
      const enterBottom = relY > 1 - CORNER_ENTER;

      let next: Corner = null;
      if (enterLeft && enterTop) next = "tl";
      else if (enterRight && enterTop) next = "tr";
      else if (enterLeft && enterBottom) next = "bl";
      else if (enterRight && enterBottom) next = "br";

      const current = activeCornerRef.current;
      const keepCurrent =
        (current === "tl" && relX < CORNER_LEAVE && relY < CORNER_LEAVE) ||
        (current === "tr" && relX > 1 - CORNER_LEAVE && relY < CORNER_LEAVE) ||
        (current === "bl" && relX < CORNER_LEAVE && relY > 1 - CORNER_LEAVE) ||
        (current === "br" &&
          relX > 1 - CORNER_LEAVE &&
          relY > 1 - CORNER_LEAVE);

      const resolved = keepCurrent ? current : next;
      if (resolved !== current) {
        activeCornerRef.current = resolved;
        setActiveCorner(resolved);
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleLeave = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      targetRef.current = { x: 0, y: 0 };
      currentRef.current = { x: 0, y: 0 };
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      activeCornerRef.current = null;
      rectRef.current = null;
      setActiveCorner(null);
    };

    const handleEnter = () => {
      const rect = frame.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const handleResize = () => {
      const rect = frame.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    frame.addEventListener("mouseenter", handleEnter);
    frame.addEventListener("mousemove", handleMove);
    frame.addEventListener("mouseleave", handleLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      frame.removeEventListener("mouseenter", handleEnter);
      frame.removeEventListener("mousemove", handleMove);
      frame.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative inline-flex" style={{ perspective: "1200px" }}>
      <div
        ref={frameRef}
        className={`relative ${className ?? "w-full"}`.trim()}
      >
        <div
          ref={cardRef}
          className={`relative w-full transition-transform duration-75 ease-out ${cardClassName ?? ""}`.trim()}
          style={{
            transform: "rotateX(0deg) rotateY(0deg)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div style={{ transform: "translateZ(35px)" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
