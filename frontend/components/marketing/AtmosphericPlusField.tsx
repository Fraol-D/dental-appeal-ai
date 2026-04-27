"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { usePlusInteractionState } from "./plusInteractionStore";

type PlusSign = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type AtmosphericPlusFieldProps = {
  className?: string;
};

const CELL_SIZE = 92;
const REPEL_DISTANCE = 140;
const CLICK_PULSE_RADIUS = 150;

function pseudoRandom(seed: number) {
  return Math.abs(Math.sin(seed * 9999.73) * 10000) % 1;
}

export function AtmosphericPlusField({ className = "" }: AtmosphericPlusFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 1, height: 1 });
  const { mouse, click } = usePlusInteractionState();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      setBounds({
        left: rect.left,
        top: rect.top,
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds, true);
    };
  }, []);

  const cursor = mouse
    ? {
        x: mouse.x - bounds.left,
        y: mouse.y - bounds.top,
      }
    : null;

  const pulse = click
    ? {
        x: click.x - bounds.left,
        y: click.y - bounds.top,
        id: click.id,
      }
    : null;

  const signs = useMemo<PlusSign[]>(() => {
    const columns = Math.max(1, Math.floor(bounds.width / CELL_SIZE));
    const rows = Math.max(1, Math.floor(bounds.height / CELL_SIZE));
    const cellWidth = bounds.width / columns;
    const cellHeight = bounds.height / rows;

    const mapped: PlusSign[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const id = row * columns + col;
        const sizeRand = pseudoRandom(id + 7.1);
        const size = sizeRand > 0.66 ? 24 : sizeRand > 0.33 ? 18 : 12;
        const safeXOffset = Math.max(0, cellWidth / 2 - size / 2 - 6);
        const safeYOffset = Math.max(0, cellHeight / 2 - size / 2 - 6);
        const offsetX = (pseudoRandom(id + 1.3) * 2 - 1) * safeXOffset;
        const offsetY = (pseudoRandom(id + 2.7) * 2 - 1) * safeYOffset;
        const centerX = (col + 0.5) * cellWidth;
        const centerY = (row + 0.5) * cellHeight;

        mapped.push({
          id,
          x: centerX + offsetX,
          y: centerY + offsetY,
          size,
        });
      }
    }

    return mapped;
  }, [bounds.height, bounds.width]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {signs.map((sign) => {
        let offsetX = 0;
        let offsetY = 0;

        if (cursor) {
          const dx = sign.x - cursor.x;
          const dy = sign.y - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < REPEL_DISTANCE && distance > 0.01) {
            const strength = ((REPEL_DISTANCE - distance) / REPEL_DISTANCE) * 25;
            offsetX = (dx / distance) * strength;
            offsetY = (dy / distance) * strength;
          }
        }

        const pulseDistance = pulse
          ? Math.sqrt(Math.pow(sign.x - pulse.x, 2) + Math.pow(sign.y - pulse.y, 2))
          : Number.POSITIVE_INFINITY;

        const inPulse = pulse ? pulseDistance <= CLICK_PULSE_RADIUS : false;

        return (
          <motion.span
            key={sign.id}
            className="absolute select-none text-[rgba(46,134,193,0.22)]"
            style={{
              left: `${sign.x}px`,
              top: `${sign.y}px`,
              fontSize: `${sign.size}px`,
              lineHeight: 1,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              x: offsetX,
              y: offsetY,
              opacity: inPulse ? [1, 0, 1] : 1,
              scale: inPulse ? [1, 0.35, 1] : 1,
            }}
            transition={{
              duration: inPulse ? 0.45 : 0.28,
              ease: [0.16, 1, 0.3, 1],
              delay: inPulse ? (pulseDistance / CLICK_PULSE_RADIUS) * 0.1 : 0,
            }}
          >
            +
          </motion.span>
        );
      })}
    </div>
  );
}
