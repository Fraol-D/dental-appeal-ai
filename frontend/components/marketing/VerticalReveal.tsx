"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type VerticalRevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function VerticalReveal({ children, className = "", delay = 0 }: VerticalRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0.6 }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
