import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  { label: "Grooming Menu", desc: "Select services" },
  { label: "Barber Craftsman", desc: "Choose expert" },
  { label: "Date & Hour", desc: "Schedule timing" },
  { label: "Credentials", desc: "Finalize booking" }
];

export function Stepper({ currentStep }: StepperProps) {
  // Safe step bound
  const displayStep = Math.min(Math.max(currentStep, 0), STEPS.length - 1);
  const activeStepInfo = STEPS[displayStep];

  return (
    <div className="space-y-4">
      {/* MOBILE MINI STEPS TRACKER (Sleek pill-dots + Label, visible on mobile) */}
      <div className="block sm:hidden space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
            Progress Status
          </span>
          <span className="text-[10px] font-mono leading-none tracking-wider text-amber-400 font-bold">
            Step {displayStep + 1} of {STEPS.length} • {activeStepInfo.label}
          </span>
        </div>

        {/* Horizontal pill segments */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => {
            const isCurrent = displayStep === idx;
            const isCompleted = displayStep > idx;

            return (
              <div
                key={`pill-${idx}`}
                className="flex-1 h-1.5 rounded-full bg-stone-850 overflow-hidden relative"
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: isCurrent || isCompleted ? "100%" : "0%",
                    backgroundColor: isCurrent ? "#F59E0B" : isCompleted ? "#D4AF37" : "#292524"
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute left-0 top-0 h-full rounded-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP/TABLET SIZED FULL STEPPER ROW (Hidden on mobile for supreme ergonomics) */}
      <div className="hidden sm:block space-y-5">
        {/* Progress Fill Bar */}
        <div className="w-full h-[3px] bg-stone-900 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
            initial={{ width: "2%" }}
            animate={{ width: `${(displayStep / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
        </div>

        {/* Expanded Row Cards */}
        <div className="grid grid-cols-4 gap-4">
          {STEPS.map((step, idx) => {
            const isActive = displayStep === idx;
            const isCompleted = displayStep > idx;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center text-center space-y-2 relative"
              >
                {/* Stepper Dot */}
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? "#F59E0B" : isCompleted ? "#D4AF37" : "#292524"
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-mono transition-all duration-300 relative z-10 ${
                      isActive
                        ? "bg-stone-950 text-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                        : isCompleted
                        ? "bg-amber-500 border-amber-400 text-stone-950 font-black"
                        : "bg-stone-900/50 text-stone-500 border-stone-800"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={14} className="stroke-[3]" />
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </motion.div>

                  {/* Ripple pulse cue */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-amber-550/15 animate-ping" />
                  )}
                </div>

                {/* Step labels */}
                <div className="space-y-0.5 select-none md:block">
                  <p className={`text-[10px] md:text-xs font-sans tracking-widest uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-amber-400 font-semibold"
                      : isCompleted
                      ? "text-stone-300"
                      : "text-stone-550"
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-stone-500 font-light hidden lg:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
