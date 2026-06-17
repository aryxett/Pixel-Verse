"use client";

import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

export default function SectionDivider() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 my-6 select-none pointer-events-none">
      {/* Horizontal glowing line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 dark:via-violet-500/30 to-transparent" />
      </div>
      
      {/* Center badge */}
      <div className="relative flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200/10 dark:border-white/[0.06] shadow-lg shadow-violet-500/5 backdrop-blur-md"
          style={{ 
            background: "var(--bg-secondary)",
          }}
        >
          <Gamepad2 className="w-4 h-4 text-violet-400" />
        </motion.div>
      </div>
    </div>
  );
}
