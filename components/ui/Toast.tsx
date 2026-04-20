"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { clsx } from "clsx";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10",
  error:   "border-red-500/40     bg-red-500/10",
  warning: "border-amber-500/40   bg-amber-500/10",
  info:    "border-violet-500/40  bg-violet-500/10",
};

const toastIcons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const iconColors: Record<ToastType, string> = {
  success: "text-emerald-400",
  error:   "text-red-400",
  warning: "text-amber-400",
  info:    "text-violet-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const success = useCallback((title: string, message?: string) => toast({ type: "success", title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: "error",   title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: "warning", title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: "info",    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = toastIcons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={clsx(
                  "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl",
                  "border backdrop-blur-xl shadow-2xl min-w-[280px] max-w-sm",
                  "bg-[#12121a]/95",
                  toastStyles[t.type]
                )}
              >
                <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[t.type])} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200">{t.title}</p>
                  {t.message && <p className="text-xs text-slate-400 mt-0.5">{t.message}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
