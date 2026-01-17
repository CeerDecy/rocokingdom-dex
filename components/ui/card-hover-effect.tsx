"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const Card = ({
  className,
  size = "default",
  children,
}: {
  className?: string;
  size?: "default" | "compact";
  children: React.ReactNode;
}) => {
  const bodyPadding = size === "compact" ? "p-1" : "p-4";
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        size === "compact" ? "p-3" : "p-4",
        "border duration-200",
        "bg-neutral-50 dark:bg-neutral-800",
        "border-neutral-200/[0.5] dark:border-white/[0.1]",
        "group-hover:border-neutral-300/[0.6] dark:group-hover:border-primary/[0.8]",
        className,
      )}
    >
      <div className="relative">
        <div className={bodyPadding}>{children}</div>
      </div>
    </div>
  );
};

export const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center",
        "rounded-[6px]",
        "text-zinc-600 dark:text-zinc-200",
        "size-[48px] mb-[20px] bg-red-200",
        "text-[24px]",
        "bg-[#e3e3e5] dark:bg-[#1e1e20]",
        "transition-all duration-300 dark:group-hover:text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-zinc-600 dark:text-zinc-200",
        "font-bold tracking-wide mt-4",
        className,
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 tracking-wide leading-relaxed text-sm",
        "text-zinc-500 dark:text-zinc-300/[0.8]",
        className,
      )}
    >
      {children}
    </p>
  );
};

export const HoverEffect = ({
  items,
  className,
  variant = "grid",
}: {
  items: {
    title: string;
    description?: string;
    link?: string;
    icon: ReactNode;
    onClick?: () => void;
    active?: boolean;
  }[];
  className?: string;
  variant?: "grid" | "filter";
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isFilter = variant === "filter";

  return (
    <div
      className={cn(
        isFilter
          ? "flex flex-wrap gap-3"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            "relative isolate group block h-full",
            isFilter ? "w-auto p-0" : "w-full p-2",
          )}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="z-[-1] absolute inset-0 h-full w-full bg-neutral-200/[0.3] dark:bg-neutral-500/[0.5] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          {isFilter ? (
            <button
              type="button"
              onClick={item.onClick}
              className="w-auto text-left"
            >
              <Card
                size="compact"
                className={cn(
                  "w-auto bg-white/80",
                  item.active
                    ? "border-neutral-300/[0.6]"
                    : "border-neutral-200/[0.5]",
                )}
              >
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <CardIcon className="mb-0 size-9 bg-transparent">
                        {item.icon}
                      </CardIcon>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-auto rounded-full border border-black/10 bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60"
                      side="top"
                    >
                      {item.title}
                    </HoverCardContent>
                  </HoverCard>
                  <span className="sr-only">{item.title}</span>
                </div>
              </Card>
            </button>
          ) : (
            <Card>
              <CardIcon>{item.icon}</CardIcon>
              <CardTitle>{item.title}</CardTitle>
              {item.description ? (
                <CardDescription>{item.description}</CardDescription>
              ) : null}
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};
