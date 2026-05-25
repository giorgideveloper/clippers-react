import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Booking, Barber, Service } from "../../types";
import { TIME_SLOTS } from "../../data/barberData";
import { Check, X, Calendar, Clock, Scissors, User, ChevronDown, CheckCircle, Timer, AlertCircle, RefreshCw, Smartphone, Mail, FileText } from "lucide-react";
import { BottomSheet } from "../BottomSheet";

interface AdminScheduleProps {
  bookings: Booking[];
  barbers: Barber[];
  services: Service[];
  onUpdateStatus: (bookingId: string, newStatus: Booking["status"]) => void;
  onReschedule: (bookingId: string, date: string, time: string) => void;
}

const STATUS_LIST = ["pending", "confirmed", "completed", "cancelled"] as const;

export function AdminSchedule({ bookings, barbers, services, onUpdateStatus, onReschedule }: AdminScheduleProps) {
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  // Drawer / Rescheduling state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string>("");

  // Target booking details Bottom Sheet state
  const [activeBookingDetails, setActiveBookingDetails] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchBarber = selectedBarberFilter === "all" || b.barber.id === selectedBarberFilter;
      const matchDate = b.date === selectedDateFilter;
      return matchBarber && matchDate;
    });
  }, [bookings, selectedBarberFilter, selectedDateFilter]);

  // Hours sorting list
  const allHours = useMemo(() => {
    return [...TIME_SLOTS.morning, ...TIME_SLOTS.afternoon, ...TIME_SLOTS.evening];
  }, []);

  const handleApplyReschedule = (bookingId: string) => {
    if (!newTime) return;
    onReschedule(bookingId, selectedDateFilter, newTime);
    setReschedulingId(null);
    setNewTime("");
  };

  // Find updated booking details dynamically so sheet stays reactive to clicks/toggles
  const currentActiveDetails = useMemo(() => {
    if (!activeBookingDetails) return null;
    const found = bookings.find(b => b.id === activeBookingDetails.id);
    return found || activeBookingDetails;
  }, [bookings, activeBookingDetails]);

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return (
          <motion.span
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-[10px] uppercase font-mono font-bold rounded"
          >
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Completed
          </motion.span>
        );
      case "confirmed":
        return (
          <motion.span
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#d4af37]/10 border border-[#d4af37]/30 text-amber-400 text-[10px] uppercase font-mono font-bold rounded"
          >
            <Check className="w-3 h-3 text-amber-500" /> Confirmed
          </motion.span>
        );
      case "cancelled":
        return (
          <motion.span
            key="cancelled"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-mono font-bold rounded"
          >
            <X className="w-3 h-3 text-red-500" /> Cancelled
          </motion.span>
        );
      case "pending":
      default:
        return (
          <motion.span
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-mono font-bold rounded animate-pulse"
          >
            <Timer className="w-3 h-3 text-amber-500" /> Pending
          </motion.span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header controls layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
            Live <span className="text-amber-400 font-semibold font-serif">Agendas</span>
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            MANAGE APPOINTMENTS • CLICK CARD FOR LARGE QUICK STATUS ACTION SHEET
          </p>
        </div>

        {/* Dynamic Navigation Select / Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector input */}
          <div className="bg-stone-900/60 border border-stone-850 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="text-xs text-stone-200 bg-transparent focus:outline-none uppercase font-mono"
            />
          </div>

          {/* Barber filter selector */}
          <div className="bg-stone-900/60 border border-stone-850 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            <select
              value={selectedBarberFilter}
              onChange={(e) => setSelectedBarberFilter(e.target.value)}
              className="text-xs text-stone-200 bg-transparent focus:outline-none font-medium capitalize"
            >
              <option value="all" className="bg-stone-950 text-stone-250">All Barber Staff</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id} className="bg-stone-950 text-stone-250">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid containing Desktop Grid view alongside compact Mobile list view */}
      <div className="space-y-4">
        
        {/* DESKTOP TIMETABLE VIEW (visible on lg+) */}
        <div className="hidden lg:block bg-[#141416]/60 border border-stone-850 rounded-2xl overflow-hidden shadow-inner">
          <div className="grid grid-cols-12 bg-stone-900/40 border-b border-stone-850 py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
            <div className="col-span-2">Time Slot</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Assigned Barber</div>
            <div className="col-span-2">Service (Price)</div>
            <div className="col-span-2 text-right">Status Badge</div>
          </div>

          <div className="divide-y divide-stone-850/60 font-light text-left">
            {allHours.map((hour) => {
              // Find matching booking
              const matchedBk = filteredBookings.find(b => b.time === hour);

              return (
                <div
                  key={hour}
                  onClick={() => {
                    if (matchedBk) setActiveBookingDetails(matchedBk);
                  }}
                  className={`grid grid-cols-12 items-center py-4 px-4 text-sm transition-all duration-150 ${
                    matchedBk
                      ? "bg-stone-900/10 hover:bg-stone-900/30 cursor-pointer"
                      : "hover:bg-stone-900/5"
                  }`}
                >
                  {/* Hour Indicator */}
                  <div className="col-span-2 font-mono text-xs font-bold text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-550" />
                    {hour}
                  </div>

                  {/* Customer Information Column */}
                  <div className="col-span-3 text-left">
                    {matchedBk ? (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-stone-200">{matchedBk.customer.name}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{matchedBk.customer.email}</p>
                        <p className="text-[10px] text-stone-550 font-mono">{matchedBk.customer.phone}</p>
                        {matchedBk.customer.notes && (
                          <span className="block text-[10px] italic text-amber-500/60 max-w-xs truncate" title={matchedBk.customer.notes}>
                            "{matchedBk.customer.notes}"
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-stone-700 italic">No bookings scheduled</span>
                    )}
                  </div>

                  {/* Barber Column */}
                  <div className="col-span-3">
                    {matchedBk ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700 text-[10px] text-amber-400 font-bold uppercase">
                          {matchedBk.barber.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-stone-300 font-medium">{matchedBk.barber.name}</span>
                      </div>
                    ) : (
                      <span className="text-stone-850">—</span>
                    )}
                  </div>

                  {/* Service Package Column */}
                  <div className="col-span-2">
                    {matchedBk ? (
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-stone-300">{matchedBk.service.name}</p>
                        <p className="text-[11px] font-mono font-bold text-amber-400">${matchedBk.service.price} • {matchedBk.service.duration}m</p>
                      </div>
                    ) : (
                      <span className="text-stone-850">—</span>
                    )}
                  </div>

                  {/* Status & Dashboard interactive Operations details */}
                  <div className="col-span-2 text-right flex flex-col items-end gap-2 pr-1">
                    {matchedBk ? (
                      <div className="space-y-1.5 flex flex-col items-end">
                        <div>{getStatusBadge(matchedBk.status)}</div>
                        <span className="text-[9px] font-mono text-stone-500 block uppercase tracking-wider group-hover:text-amber-500 transition-colors">
                          Click to Manage
                        </span>
                      </div>
                    ) : (
                      <span className="text-stone-850">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE AGENDA LIST VIEW */}
        <div className="block lg:hidden space-y-3.5">
          {allHours.map((hour) => {
            const matchedBk = filteredBookings.find(b => b.time === hour);

            return (
              <div
                key={`mob-${hour}`}
                onClick={() => {
                  if (matchedBk) setActiveBookingDetails(matchedBk);
                }}
                className={`p-4 rounded-xl border transition-all ${
                  matchedBk
                    ? "bg-[#141416]/95 border-stone-850 hover:bg-stone-900/40 cursor-pointer active:scale-98"
                    : "bg-stone-900/15 border-stone-900/40 opacity-75"
                }`}
              >
                {/* Header matching status & Hour */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-850/55">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black text-amber-405 text-amber-500">
                    <Clock className="w-3.5 h-3.5" />
                    {hour}
                  </div>
                  {matchedBk ? (
                    <div>{getStatusBadge(matchedBk.status)}</div>
                  ) : (
                    <span className="text-[10px] uppercase font-mono text-stone-700">Empty Window</span>
                  )}
                </div>

                {matchedBk ? (
                  <div className="space-y-3">
                    {/* Customer & Specialties */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-200">
                          {matchedBk.customer.name}
                        </h4>
                        <span className="font-mono text-[10px] bg-amber-500/10 border border-amber-500/15 py-0.5 px-2 text-amber-500 rounded-md">
                          Details ➔
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-medium flex items-center">
                        <Scissors className="w-3.5 h-3.5 mr-1.5 text-amber-550 text-amber-500" />
                        {matchedBk.service.name} (${matchedBk.service.price} • {matchedBk.service.duration}m)
                      </p>
                      <p className="text-xs text-stone-400 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
                        Craftsman: <span className="text-stone-300 ml-1 font-semibold">{matchedBk.barber.name}</span>
                      </p>
                      {matchedBk.customer.notes && (
                        <p className="text-[11px] text-amber-500/80 italic pl-5 truncate">
                          "{matchedBk.customer.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-605 text-stone-500 font-light italic text-left">
                    Open for guest bookings or walking appointments.
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Dynamic quick Action bottom sheet for status management */}
      <BottomSheet
        isOpen={currentActiveDetails !== null}
        onClose={() => setActiveBookingDetails(null)}
        title="Manage Appointment Ticket"
      >
        {currentActiveDetails && (
          <div className="space-y-6">
            
            {/* Segmented Control (Sliding Tab) Indicator at the very top */}
            <div className="space-y-1.5 text-left">
              <span className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-505 text-amber-500">
                Segmented Pipeline Phase
              </span>
              <div className="relative flex p-1 bg-stone-950 rounded-xl border border-stone-850/80">
                {STATUS_LIST.map((st) => {
                  const isSelected = currentActiveDetails.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateStatus(currentActiveDetails.id, st)}
                      className={`relative flex-1 py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-colors z-10 capitalize cursor-pointer select-none ${
                        isSelected ? "text-stone-950" : "text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeStatusSlidTab"
                          className="absolute inset-0 bg-amber-400 rounded-lg -z-10 shadow-md shadow-amber-400/10"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structured Card Booking Details */}
            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-xl text-left space-y-4">
              {/* Customer Profile Row */}
              <div className="flex items-center gap-3 pb-3 border-b border-stone-900">
                <div className="w-12 h-12 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-sm font-serif font-black text-amber-400">
                  {currentActiveDetails.customer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-100">{currentActiveDetails.customer.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono bg-stone-900 border border-stone-850 py-0.5 px-2 rounded text-stone-500">
                      ID: {currentActiveDetails.id}
                    </span>
                    {getStatusBadge(currentActiveDetails.status)}
                  </div>
                </div>
              </div>

              {/* Data parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                
                {/* Email link */}
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-stone-500 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block text-[8.5px] uppercase font-mono text-stone-550">Email Connection</span>
                    <span className="font-mono text-stone-300">{currentActiveDetails.customer.email}</span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-stone-500 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block text-[8.5px] uppercase font-mono text-stone-550">Contact Phone</span>
                    <span className="font-mono text-stone-300">{currentActiveDetails.customer.phone}</span>
                  </div>
                </div>

                {/* Date / Hour Row */}
                <div className="flex items-start gap-2.5 border-t border-stone-900 pt-3 col-span-1 sm:col-span-2">
                  <Clock className="w-4 h-4 text-stone-500 mt-0.5" />
                  <div className="space-y-0.5 text-left">
                    <span className="block text-[8.5px] uppercase font-mono text-stone-550">Selected Booking Slot</span>
                    <span className="font-bold text-stone-200">
                      {new Date(currentActiveDetails.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })} at <span className="text-amber-400 font-mono">{currentActiveDetails.time}</span>
                    </span>
                  </div>
                </div>

                {/* Service row info */}
                <div className="flex items-start gap-2.5 border-t border-stone-900 pt-3 col-span-1 sm:col-span-2">
                  <Scissors className="w-4 h-4 text-stone-500 mt-0.5" />
                  <div className="flex-1 space-y-0.5 text-left">
                    <span className="block text-[8.5px] uppercase font-mono text-stone-550">Sovereign Service & Stylist</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-200">{currentActiveDetails.service.name}</span>
                      <span className="font-mono font-bold text-amber-405 text-amber-500">${currentActiveDetails.service.price}</span>
                    </div>
                    <span className="text-[11px] block text-stone-500">
                      Barber Staff Artist: <span className="text-stone-350 font-bold">{currentActiveDetails.barber.name}</span>
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {currentActiveDetails.customer.notes && (
                  <div className="flex items-start gap-2.5 border-t border-stone-900 pt-3 col-span-1 sm:col-span-2">
                    <FileText className="w-4 h-4 text-stone-500 mt-0.5" />
                    <div className="space-y-0.5 text-left">
                      <span className="block text-[8.5px] uppercase font-mono text-stone-550">Special Directions</span>
                      <p className="text-xs text-stone-400 italic font-light leading-relaxed">
                        "{currentActiveDetails.customer.notes}"
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Comfort Rescheduling quick trigger section */}
            <div className="flex items-center justify-between p-3.5 bg-stone-900/30 border border-stone-850 rounded-xl text-xs text-left">
              <div className="space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-550">Reschedule Session</span>
                <span className="text-stone-400">Need to offset this appointment?</span>
              </div>
              <button
                onClick={() => {
                  setReschedulingId(currentActiveDetails.id);
                  setActiveBookingDetails(null);
                }}
                className="px-3.5 py-1.5 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-lg text-[10px] font-mono text-stone-450 uppercase tracking-wider font-extrabold cursor-pointer hover:border-amber-500/30 text-stone-300"
              >
                Change Hour
              </button>
            </div>

            {/* Color-Coded Highly Tactile Status Action Buttons */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-500 text-left">
                Tactile Action Suite
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Accept / Confirm */}
                <button
                  type="button"
                  onClick={() => onUpdateStatus(currentActiveDetails.id, "confirmed")}
                  disabled={currentActiveDetails.status === "confirmed"}
                  className={`h-12 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer active:scale-95 ${
                    currentActiveDetails.status === "confirmed"
                      ? "bg-stone-900/30 border border-stone-900 text-stone-605 text-stone-620 opacity-30 cursor-not-allowed"
                      : "bg-[#d4af37]/10 hover:bg-[#d4af37] border border-[#d4af37]/20 text-amber-400 hover:text-stone-950 font-black shadow-lg shadow-amber-550/10"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Confirm Chair
                </button>

                {/* Complete */}
                <button
                  type="button"
                  onClick={() => onUpdateStatus(currentActiveDetails.id, "completed")}
                  disabled={currentActiveDetails.status === "completed"}
                  className={`h-12 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer active:scale-95 ${
                    currentActiveDetails.status === "completed"
                      ? "bg-stone-900/30 border border-stone-900 text-stone-605 text-stone-620 opacity-30 cursor-not-allowed"
                      : "bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-505/20 text-emerald-400 hover:text-stone-950 font-black shadow-lg shadow-emerald-555/5"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 stroke-[3]" /> Complete Seat
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => onUpdateStatus(currentActiveDetails.id, "cancelled")}
                  disabled={currentActiveDetails.status === "cancelled"}
                  className={`h-12 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer active:scale-95 ${
                    currentActiveDetails.status === "cancelled"
                      ? "bg-stone-900/30 border border-stone-900 text-stone-605 text-stone-620 opacity-30 cursor-not-allowed"
                      : "bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-stone-100 font-black shadow-lg"
                  }`}
                >
                  <X className="w-4 h-4 stroke-[3]" /> Cancel Booking
                </button>
              </div>
            </div>

            {/* Back Close button inside thumb reach */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveBookingDetails(null)}
                className="w-full h-11 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-400 font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Close Panel
              </button>
            </div>

          </div>
        )}
      </BottomSheet>

      {/* Premium Swipeable Reschedule Bottom Sheet */}
      <BottomSheet
        isOpen={reschedulingId !== null}
        onClose={() => {
          setReschedulingId(null);
          setNewTime("");
        }}
        title="Reschedule Session Hour"
      >
        <div className="space-y-5">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs text-stone-400">
              Please choose a new treatment time slot for this VIP appointment.
            </p>
          </div>

          {/* Grid of times to pick from */}
          <div className="grid grid-cols-3 gap-2 py-2">
            {allHours.map((slot) => {
              const isSelected = newTime === slot;
              const worksWithConflicts = filteredBookings.some(b => b.time === slot && b.id !== reschedulingId);

              return (
                <button
                  key={`resched-${slot}`}
                  disabled={worksWithConflicts}
                  onClick={() => setNewTime(slot)}
                  className={`py-3.5 px-1 font-mono text-xs rounded-xl border transition-all ${
                    worksWithConflicts
                      ? "opacity-30 bg-red-950/10 border-red-500/10 text-red-500 line-through cursor-not-allowed"
                      : isSelected
                      ? "bg-amber-500 text-stone-950 font-extrabold border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-stone-900 text-stone-300 border-stone-850 hover:border-amber-500/45 cursor-pointer"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Action buttons in direct comfort Thumb-Zone */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone-850/60">
            <button
              onClick={() => {
                setReschedulingId(null);
                setNewTime("");
              }}
              className="w-full sm:flex-1 h-12 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-400 rounded-xl text-xs font-bold font-mono tracking-widest uppercase cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              disabled={!newTime}
              onClick={() => handleApplyReschedule(reschedulingId)}
              className={`w-full sm:flex-1 h-12 rounded-xl text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center active:scale-95 transition-transform ${
                newTime
                  ? "bg-amber-500 border border-amber-400 text-stone-950 hover:bg-amber-450 cursor-pointer shadow-lg shadow-amber-550/10"
                  : "bg-stone-900 text-stone-605 border-stone-850 cursor-not-allowed opacity-50"
              }`}
            >
              Confirm New Slot
            </button>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
