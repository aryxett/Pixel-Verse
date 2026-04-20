"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";
import { clsx } from "clsx";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: ReactNode;
  delay?: number;
}

const positionStyles: Record<TooltipPosition, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top:    "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent",
  left:   "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent",
  right:  "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent",
};

export default function Tooltip({
  content,
  position = "top",
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute z-50 pointer-events-none whitespace-nowrap",
              positionStyles[position]
            )}
          >
            <div className="relative px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium shadow-xl">
              {content}
              <span
                className={clsx(
                  "absolute w-0 h-0 border-4",
                  arrowStyles[position]
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
