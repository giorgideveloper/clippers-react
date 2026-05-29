import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent background scrolling when open to mimic native system feel
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-[6px] cursor-pointer"
          />

          {/* Swipeable Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
            drag="y"
            dragDirectionLock
            dragElastic={{ top: 0.1, bottom: 0.85 }}
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              // Close if swiped down far enough or fast enough
              if (info.offset.y > 140 || info.velocity.y > 600) {
                onClose();
              }
            }}
            className="relative w-full max-w-lg bg-[#141416]/98 border-t border-stone-800/80 rounded-t-[28px] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
          >
            {/* Grab Handle Header */}
            <div className="flex flex-col items-center pt-3 pb-3 cursor-grab active:cursor-grabbing w-full">
              <div className="w-12 h-1.5 rounded-full bg-stone-700/50" />
            </div>

            {/* Header Content */}
            <div className="px-6 pb-4 border-b border-stone-850/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest font-black text-amber-500">
                  {title || "Sovereign Detail"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-100 cursor-pointer active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Container (support vertical scroll while swipe is active on parent helper) */}
            <div 
              className="px-6 py-6 overflow-y-auto max-h-[70vh] text-stone-300 text-sm font-light leading-relaxed"
              style={{ touchAction: "pan-y" }}
              onPointerDownCapture={(e) => e.stopPropagation()}
            >
              {children}
            </div>

            {/* Secure Area Padding */}
            <div className="h-5 bg-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
