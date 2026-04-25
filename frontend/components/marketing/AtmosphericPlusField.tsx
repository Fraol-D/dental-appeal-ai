"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type PlusSign = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type AtmosphericPlusFieldProps = {
  className?: string;
};

const SIGN_COUNT = 80;
const REPEL_DISTANCE = 140;

function pseudoRandom(seed: number) {
  return Math.abs(Math.sin(seed * 9999.73) * 10000) % 1;
}

export function AtmosphericPlusField({ className = "" }: AtmosphericPlusFieldProps) {
  const signs = useMemo<PlusSign[]>(() => {
    return Array.from({ length: SIGN_COUNT }, (_, i) => {
      const xRand = pseudoRandom(i + 1);
      const yRand = pseudoRandom(i + 2.8);
      const sizeRand = pseudoRandom(i + 7.1);
      const size = sizeRand > 0.66 ? 24 : sizeRand > 0.33 ? 18 : 12;

      return {
        id: i,
        x: xRand * 100,
        y: yRand * 100,
        size,
      };
    });
  }, []);

  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pulse, setPulse] = useState<{ x: number; y: number; radius: number; id: number } | null>(null);
  const [radius, setRadius] = useState(150);

  return (
    <div
      className={`pointer-events-auto absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setCursor({ x, y });
      }}
      onMouseLeave={() => setCursor(null)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        const nextRadius = Math.min(radius + 70, 500);
        setRadius(nextRadius);
        setPulse({ x, y, radius: nextRadius, id: Date.now() });
      }}
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

        const inPulse = pulse ? pulseDistance <= pulse.radius / 8 : false;

        return (
          <motion.span
            key={sign.id}
            className="absolute select-none text-[rgba(46,134,193,0.12)]"
            style={{
              left: `${sign.x}%`,
              top: `${sign.y}%`,
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
              delay: inPulse ? (pulseDistance / Math.max((pulse?.radius ?? 1) / 8, 1)) * 0.1 : 0,
            }}
          >
            +
          </motion.span>
        );
      })}
    </div>
  );
}
