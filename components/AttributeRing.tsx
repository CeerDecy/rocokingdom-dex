"use client";

import { useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type AttributeItem = {
  key: string;
  logoUrl: string;
  nameCn: string;
  nameEn: string;
  battleMultiplier?: {
    offense?: Record<string, string[]>;
    defense?: Record<string, string[]>;
  };
};

type AttributeRingProps = {
  attributes: AttributeItem[];
};

export default function AttributeRing({ attributes }: AttributeRingProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<"offense" | "defense">("offense");
  const [activeAttribute, setActiveAttribute] = useState<AttributeItem | null>(
    null,
  );
  const [lockedAttribute, setLockedAttribute] = useState<AttributeItem | null>(
    null,
  );
  const [displayAttribute, setDisplayAttribute] =
    useState<AttributeItem | null>(null);
  const [isCenterVisible, setIsCenterVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringCount = attributes.length || 1;
  const radius = 330;
  const centerRadius = 56;
  const arrowHeadSize = 8;
  const lineGap = 120;
  const lineOffset = centerRadius + lineGap + arrowHeadSize;
  const lineLength = radius - lineOffset + 32;
  const angleByKey = new Map(
    attributes.map((item, index) => [item.key, (360 / ringCount) * index]),
  );

  const effectiveAttribute = activeAttribute ?? lockedAttribute;
  const offenseMultipliers = effectiveAttribute?.battleMultiplier?.offense ?? {};
  const defenseMultipliers = effectiveAttribute?.battleMultiplier?.defense ?? {};

  const offenseStrong = offenseMultipliers["2.0"] ?? [];
  const offenseWeak = offenseMultipliers["0.5"] ?? [];
  const defenseStrong = defenseMultipliers["2.0"] ?? [];
  const defenseWeak = defenseMultipliers["0.5"] ?? [];

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (effectiveAttribute) {
      setDisplayAttribute(effectiveAttribute);
      setIsCenterVisible(true);
      return;
    }

    setIsCenterVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setDisplayAttribute(null);
    }, 220);
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [effectiveAttribute]);

  return (
    <div
      className={`relative h-[660px] w-[660px] sm:h-[780px] sm:w-[780px] lg:h-[900px] lg:w-[900px] ${
        isPaused ? "attribute-ring-paused" : ""
      }`}
    >
      <div className="absolute inset-0 animate-attribute-ring">
        {displayAttribute ? (
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
              isCenterVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {mode === "offense" ? (
              <>
                {offenseStrong.map((key) => {
                  const angle = angleByKey.get(key);
                  if (angle === undefined) return null;
                  return (
                    <RingArrow
                      key={`offense-strong-${key}`}
                      angle={angle}
                      length={lineLength}
                      offset={lineOffset}
                      direction="out"
                      color="#6ee7b7"
                    />
                  );
                })}
                {offenseWeak.map((key) => {
                  const angle = angleByKey.get(key);
                  if (angle === undefined) return null;
                  return (
                    <RingArrow
                      key={`offense-weak-${key}`}
                      angle={angle}
                      length={lineLength}
                      offset={lineOffset}
                      direction="out"
                      color="#fda4af"
                    />
                  );
                })}
              </>
            ) : (
              <>
                {defenseStrong.map((key) => {
                  const angle = angleByKey.get(key);
                  if (angle === undefined) return null;
                  return (
                    <RingArrow
                      key={`defense-strong-${key}`}
                      angle={angle}
                      length={lineLength}
                      offset={lineOffset}
                      direction="in"
                      color="#6ee7b7"
                    />
                  );
                })}
                {defenseWeak.map((key) => {
                  const angle = angleByKey.get(key);
                  if (angle === undefined) return null;
                  return (
                    <RingArrow
                      key={`defense-weak-${key}`}
                      angle={angle}
                      length={lineLength}
                      offset={lineOffset}
                      direction="in"
                      color="#fda4af"
                    />
                  );
                })}
              </>
            )}
          </div>
        ) : null}
        {attributes.map((item, index) => {
          const angle = (360 / ringCount) * index;
          return (
            <div
              key={item.nameEn}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
              }}
            >
              <div className="animate-attribute-ring-reverse">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-125 sm:h-14 sm:w-14"
                      aria-label={`${item.nameCn}属性`}
                      aria-pressed={lockedAttribute?.key === item.key}
                      onClick={() => {
                        setLockedAttribute((prev) =>
                          prev?.key === item.key ? null : item,
                        );
                      }}
                      onMouseEnter={() => {
                        setIsPaused(true);
                        setActiveAttribute(item);
                      }}
                      onMouseLeave={() => {
                        setIsPaused(false);
                        setActiveAttribute(null);
                      }}
                      onFocus={() => {
                        setIsPaused(true);
                        setActiveAttribute(item);
                      }}
                      onBlur={() => {
                        setIsPaused(false);
                        setActiveAttribute(null);
                      }}
                    >
                      <img
                        src={item.logoUrl}
                        alt={`${item.nameCn}属性`}
                        className="h-12 w-12 sm:h-14 sm:w-14"
                        loading="lazy"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-28 border-black/10 bg-white/95 px-3 py-2 text-center text-sm text-black">
                    <div className="font-semibold">{item.nameCn}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                      {item.nameEn}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/85 p-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/60 shadow-[0_12px_30px_-20px_rgba(16,24,40,0.35)] backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMode("offense")}
            className={`rounded-full px-4 py-2 transition-colors ${
              mode === "offense"
                ? "bg-black text-white"
                : "text-black/60 hover:text-black"
            }`}
            aria-pressed={mode === "offense"}
          >
            进攻方
          </button>
          <button
            type="button"
            onClick={() => setMode("defense")}
            className={`rounded-full px-4 py-2 transition-colors ${
              mode === "defense"
                ? "bg-black text-white"
                : "text-black/60 hover:text-black"
            }`}
            aria-pressed={mode === "defense"}
          >
            防守方
          </button>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 sm:h-28 sm:w-28">
        {displayAttribute ? (
          <img
            src={displayAttribute.logoUrl}
            alt={`${displayAttribute.nameCn}属性`}
            className={`h-12 w-12 transition-opacity duration-200 sm:h-14 sm:w-14 ${
              isCenterVisible ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ) : null}
      </div>
    </div>
  );
}

type RingArrowProps = {
  angle: number;
  length: number;
  offset: number;
  direction: "in" | "out";
  color: string;
};

function RingArrow({
  angle,
  length,
  offset,
  direction,
  color,
}: RingArrowProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
    >
      <div
        className="relative"
        style={{
          width: `${length}px`,
          height: "12px",
          transform: `translateX(${offset}px)`,
        }}
      >
        <div
          className="absolute top-1/2 h-[4px] w-full -translate-y-1/2"
          style={{ backgroundColor: color, borderRadius: "9999px" }}
        />
        {direction === "out" ? (
          <svg
            width={14}
            height={16}
            viewBox="0 0 14 16"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[6px]"
          >
            <path
              d="M3 2 L10 8 L3 14"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : (
          <svg
            width={14}
            height={16}
            viewBox="0 0 14 16"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[6px]"
          >
            <path
              d="M10 2 L3 8 L10 14"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
