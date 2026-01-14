"use client";

import { useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type AttributeItem = {
  logoUrl: string;
  nameCn: string;
  nameEn: string;
};

type AttributeRingProps = {
  attributes: AttributeItem[];
};

export default function AttributeRing({ attributes }: AttributeRingProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeAttribute, setActiveAttribute] = useState<AttributeItem | null>(
    null
  );
  const [displayAttribute, setDisplayAttribute] =
    useState<AttributeItem | null>(null);
  const [isCenterVisible, setIsCenterVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringCount = attributes.length || 1;
  const radius = 330;

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (activeAttribute) {
      setDisplayAttribute(activeAttribute);
      setIsCenterVisible(true);
      return;
    }

    setIsCenterVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setDisplayAttribute(null);
    }, 220);
  }, [activeAttribute]);

  return (
    <div
      className={`relative h-[660px] w-[660px] sm:h-[780px] sm:w-[780px] lg:h-[900px] lg:w-[900px] ${isPaused ? "attribute-ring-paused" : ""}`}
    >
      <div className="absolute inset-0 animate-attribute-ring">
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
