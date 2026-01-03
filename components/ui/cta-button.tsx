"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  type,
  disabled,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  // Updated gradients to use brand colors
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(147, 50%, 50%) 0%, rgba(60, 179, 113, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(147, 50%, 50%) 0%, rgba(60, 179, 113, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(147, 50%, 50%) 0%, rgba(60, 179, 113, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(147, 50%, 50%) 0%, rgba(60, 179, 113, 0) 100%)",
  };

  // Updated highlight gradient to use brand color
  const highlight =
    "radial-gradient(75% 181.16% at 50% 50%, #3CB371 0%, rgba(60, 179, 113, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const rotateDirection = (currentDirection: Direction): Direction => {
        const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
        const currentIndex = directions.indexOf(currentDirection);
        const nextIndex = clockwise
          ? (currentIndex - 1 + directions.length) % directions.length
          : (currentIndex + 1) % directions.length;
        return directions[nextIndex];
      };

      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  const Element = type ? 'button' : Tag;

  return (
    <Element
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-black hover:bg-brand-primary/10 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName,
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      type={type}
      disabled={disabled}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black/20 px-6 py-2 rounded-[inherit]",
          "hover:bg-black/80 transition-colors duration-300",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div 
        className={cn(
          "bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]",
          "transition-colors duration-300",
          hovered ? "bg-black/90" : "bg-black"
        )} 
      />
    </Element>
  );
}