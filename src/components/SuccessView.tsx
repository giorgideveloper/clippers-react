import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookingState } from "../types";
import { Scissors, MapPin, Phone, Mail, FileCheck, RefreshCw, Calendar, Clock } from "lucide-react";

interface SuccessViewProps {
  bookingState: BookingState;
  onReset: () => void;
}

interface ConfettiItem {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

export function SuccessView({ bookingState, onReset }: SuccessViewProps) {
  const { service, barber, date, time, customer } = bookingState;
  const [particles, setParticles] = useState<ConfettiItem[]>([]);

  // Generate confetti on component mount
  useEffect(() => {
    const list: ConfettiItem[] = [];
    const colors = ["#F59E0B", "#10B981", "#34D399", "#FBBF24", "#F59E0B", "#FCD34D", "#FFFFFF"];
    
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        // Start from center horizontal
        x: Math.random() * 300 - 155, 
        // Explode upward
        y: Math.random() * -200 - 100, 
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.2,
        duration: Math.random() * 2 + 1.5,
        rotation: Math.random() * 360
      });
    }
    setParticles(list);
  }, []);

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      })
    : "";

  return (
    <div className="relative flex flex-col items-center justify-center py-6 px-4 text-center max-w-lg mx-auto">
      
      {/* Confetti Explosion System */}
      <div className="absolute top-1/3 pointer-events-none z-10 w-full flex justify-center">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.1, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.2, 1, 0.8, 0.5],
              x: p.x,
              y: p.y + 400, // fall with gravity
              rotate: p.rotation * 3
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              backgroundColor: p.color,
              width: p.size,
              height: p.size * (Math.random() > 0.5 ? 2.5 : 1), // some strips, some squares
              borderRadius: Math.random() > 0.5 ? "9999px" : "2px"
            }}
          />
        ))}
      </div>

      {/* Dynamic Handcrafted Self-Drawing Emerald Checkmark */}
      <div className="relative mb-6">
        <svg viewBox="0 0 52 52" className="w-24 h-24 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {/* Circular frame background */}
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          {/* Glow backdrop ring */}
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            fill="rgba(16,185,129,0.04)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
          />
          {/* Solid draw checklist tick */}
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 26.5l7 7 13.5-13.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Booking Status text header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 uppercase tracking-widest rounded-full">
          Grooming Reservation Concluded
        </span>
        <h2 className="text-3xl font-light tracking-wide text-stone-100 uppercase font-sans">
          Your Chair is <span className="text-amber-400 font-semibold font-serif">Reserved</span>
        </h2>
        <p className="text-sm text-stone-400 max-w-sm leading-relaxed font-light">
          Greetings, <span className="text-stone-200 font-semibold">{customer.name}</span>! Your premium session has been scheduled successfully. We look forward to offering you the ultimate sovereign grooming experience.
        </p>
      </motion.div>

      {/* Confirmation Card summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: "spring" }}
        className="w-full bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/10 rounded-2xl p-5 mt-8 text-left space-y-4"
      >
        <div className="flex justify-between items-center pb-3 border-b border-stone-800">
          <span className="text-xs text-stone-500 font-mono tracking-wider uppercase">Receipt Confirmation Summary</span>
          <span className="text-[10px] font-mono font-bold text-amber-400 py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded">
            VIP ORDER #{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider">Requested Salon</span>
            <span className="block text-xs font-semibold text-stone-200">The Sovereign Groom Co.</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider">Stylist Craftsman</span>
            <span className="block text-xs font-semibold text-stone-250">{barber?.name}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider">Scheduled Window</span>
            <span className="block text-xs font-semibold text-amber-400 font-mono flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-amber-500" /> {formattedDate}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider">Specific Time</span>
            <span className="block text-xs font-semibold text-amber-400 font-mono flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" /> {time}
            </span>
          </div>
          <div className="space-y-1 col-span-2">
            <span className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider">Grooming Selections</span>
            <span className="block text-xs text-stone-350">{service?.name} (${service?.price}, {service?.duration} mins)</span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-850 flex items-center gap-2 text-stone-500 text-[11px] leading-snug">
          <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>72 Regent Imperial Blvd, Suite 104, New York</span>
        </div>
      </motion.div>

      {/* Custom Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 flex gap-3 text-xs uppercase tracking-widest font-bold"
      >
        <button
          onClick={onReset}
          className="px-5 py-3 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 text-stone-400 hover:text-stone-200 rounded-lg flex items-center transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Book Another Session
        </button>
      </motion.div>
    </div>
  );
}
