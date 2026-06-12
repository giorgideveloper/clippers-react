import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, X, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface SmsModalProps {
  phone: string;
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
  onClose: () => void;
}

export function SmsModal({
  phone,
  isOpen,
  isSubmitting,
  error,
  onSubmit,
  onClose,
}: SmsModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset digits when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 120);
    }
  }, [isOpen]);

  const handleChange = (idx: number, value: string) => {
    // Accept only digits; handle paste of full code
    const sanitized = value.replace(/\D/g, "");
    if (sanitized.length > 1) {
      // Paste handling — distribute across boxes
      const arr = sanitized.slice(0, 4).split("");
      const next = ["", "", "", ""].map((_, i) => arr[i] ?? "");
      setDigits(next);
      const focus = Math.min(arr.length, 3);
      inputRefs.current[focus]?.focus();
      return;
    }
    const next = [...digits];
    next[idx] = sanitized;
    setDigits(next);
    if (sanitized && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = digits.join("");
    if (code.length === 4) onSubmit(code);
  };

  const maskedPhone =
    phone.length > 4
      ? phone.slice(0, -4).replace(/\d/g, "•") + phone.slice(-4)
      : phone;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sms-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="sms-modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[#141416] border border-stone-800 rounded-2xl p-7 shadow-2xl relative overflow-hidden">
              {/* Amber top bar */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              {/* Close button */}
              {!isSubmitting && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-5 text-center">
                {/* Icon */}
                <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-amber-400" />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-stone-100 tracking-wide">
                    SMS Verification
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Enter the 4-digit code sent to{" "}
                    <span className="text-amber-400 font-mono font-semibold">
                      {maskedPhone}
                    </span>
                  </p>
                </div>

                {/* 4-digit input */}
                <div className="flex gap-3 justify-center">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={d}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className={`w-13 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 bg-stone-900/60 text-stone-100 outline-none transition-all
                        ${d ? "border-amber-500 shadow-sm shadow-amber-500/20" : "border-stone-700"}
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : "focus:border-amber-400"}
                      `}
                      style={{ width: "3.25rem" }}
                    />
                  ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={digits.join("").length < 4 || isSubmitting}
                  className={`w-full h-11 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer
                    ${
                      digits.join("").length === 4 && !isSubmitting
                        ? "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
