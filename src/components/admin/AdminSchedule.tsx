import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Booking, Barber, Service } from "../../types";
import {
  Check,
  X,
  Calendar,
  Clock,
  Scissors,
  User,
  CheckCircle,
  Filter,
} from "lucide-react";
import { BottomSheet } from "../BottomSheet";

interface AdminScheduleProps {
  bookings: Booking[];
  barbers: Barber[];
  services: Service[];
  onUpdateStatus: (bookingId: string, newStatus: Booking["status"]) => void;
  onReschedule: (bookingId: string, date: string, time: string) => void;
}

const STATUS_LIST = ["pending", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  confirmed: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  completed: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  cancelled: {
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    text: "text-red-400",
    dot: "bg-red-500",
  },
};

export function AdminSchedule({
  bookings,
  barbers,
  services,
  onUpdateStatus,
  onReschedule,
}: AdminScheduleProps) {
  const [filterBarber, setFilterBarber] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const currentActive = useMemo(() => {
    if (!activeBooking) return null;
    return bookings.find((b) => b.id === activeBooking.id) ?? activeBooking;
  }, [bookings, activeBooking]);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        if (filterBarber !== "all" && b.barber.id !== filterBarber)
          return false;
        if (filterStatus !== "all" && b.status !== filterStatus) return false;
        if (filterDate && b.date !== filterDate) return false;
        return true;
      })
      .sort((a, b) => {
        const dc = b.date.localeCompare(a.date);
        return dc !== 0 ? dc : a.time.localeCompare(b.time);
      });
  }, [bookings, filterBarber, filterStatus, filterDate]);

  const grouped = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    filtered.forEach((b) => {
      (map[b.date] = map[b.date] ?? []).push(b);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const fmtDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const StatusBadge = ({ status }: { status: Booking["status"] }) => {
    const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
    const labels: Record<string, string> = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border ${s.bg} ${s.border} ${s.text}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "pending" ? "animate-pulse" : ""}`}
        />
        {labels[status]}
      </span>
    );
  };

  const activeFiltersCount = [
    filterBarber !== "all",
    filterStatus !== "all",
    !!filterDate,
  ].filter(Boolean).length;

  const handleApplyReschedule = () => {
    if (!reschedulingId || !newDate || !newTime) return;
    onReschedule(reschedulingId, newDate, newTime);
    setReschedulingId(null);
    setNewDate("");
    setNewTime("");
  };

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
            All{" "}
            <span className="text-amber-400 font-semibold font-serif">
              Bookings
            </span>
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            {filtered.length} booking{filtered.length !== 1 ? "s" : ""} — click
            a row to manage
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status */}
          <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs text-stone-200 bg-transparent focus:outline-none font-medium capitalize pr-1 cursor-pointer"
            >
              <option value="all" className="bg-stone-950">
                All Statuses
              </option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s} className="bg-stone-950 capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Barber */}
          <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 px-3 py-1.5 rounded-xl">
            <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value)}
              className="text-xs text-stone-200 bg-transparent focus:outline-none font-medium pr-1 cursor-pointer"
            >
              <option value="all" className="bg-stone-950">
                All Barbers
              </option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id} className="bg-stone-950">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs text-stone-200 bg-transparent focus:outline-none font-mono cursor-pointer"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="text-stone-500 hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {/* Clear */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setFilterBarber("all");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="text-[10px] font-mono text-amber-500 hover:text-amber-300 uppercase tracking-wider px-2 py-1.5 border border-amber-500/20 rounded-xl cursor-pointer"
            >
              Clear {activeFiltersCount}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-stone-900/20 border border-dashed border-stone-800 rounded-2xl">
          <Calendar className="w-8 h-8 text-stone-600" />
          <p className="text-sm text-stone-500 font-light">
            No bookings match the current filters.
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setFilterBarber("all");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="text-xs text-amber-500 underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, dayBookings]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-stone-900/60 border border-stone-800 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-mono font-bold text-stone-300 capitalize">
                    {fmtDate(date)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-600">
                  {dayBookings.length} booking
                  {dayBookings.length !== 1 ? "s" : ""}
                </span>
                <div className="flex-1 h-px bg-stone-850/60" />
              </div>

              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl border border-stone-850 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-900/40 border-b border-stone-850 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      <th className="text-left px-4 py-3 w-24">Time</th>
                      <th className="text-left px-4 py-3">Customer</th>
                      <th className="text-left px-4 py-3">Barber</th>
                      <th className="text-left px-4 py-3">Service</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850/40">
                    {dayBookings.map((b) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setActiveBooking(b)}
                        className="cursor-pointer hover:bg-stone-900/40 transition-colors group"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {b.time || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-stone-200 leading-tight">
                            {b.customer.name}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {b.customer.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-amber-400 uppercase">
                              {b.barber.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <span className="text-xs text-stone-300">
                              {b.barber.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-stone-300 leading-tight">
                            {b.service.name}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-amber-500">
                            ${b.service.price}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-[9px] font-mono text-stone-600 group-hover:text-amber-500 transition-colors uppercase tracking-wider">
                            →
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2.5">
                {dayBookings.map((b) => (
                  <motion.div
                    key={`mob-${b.id}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveBooking(b)}
                    className="bg-[#141416] border border-stone-850 rounded-xl p-4 cursor-pointer hover:border-stone-700 active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-stone-100">
                          {b.customer.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {b.customer.phone}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {b.time || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-stone-500" />
                        {b.barber.name}
                      </span>
                      <span className="flex items-center gap-1 col-span-2">
                        <Scissors className="w-3 h-3 text-stone-500" />
                        {b.service.name} ·{" "}
                        <span className="text-amber-500 font-mono font-bold ml-1">
                          ${b.service.price}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Management popup */}
      <BottomSheet
        isOpen={currentActive !== null}
        onClose={() => setActiveBooking(null)}
        title="Manage Appointment"
      >
        {currentActive && (
          <div className="space-y-5">
            {/* Customer card */}
            <div className="flex items-center gap-3 p-4 bg-stone-900/50 border border-stone-800 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-sm font-black text-amber-400 uppercase">
                {currentActive.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-100 leading-tight">
                  {currentActive.customer.name}
                </p>
                <p className="text-[11px] font-mono text-stone-500 truncate">
                  {currentActive.customer.phone}
                </p>
              </div>
              <StatusBadge status={currentActive.status} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-900/40 border border-stone-850 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase text-stone-500 block">
                  Date & Time
                </span>
                <p className="font-bold text-stone-200">
                  {new Date(
                    currentActive.date + "T00:00:00",
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="font-mono font-bold text-amber-400">
                  {currentActive.time}
                </p>
              </div>
              <div className="p-3 bg-stone-900/40 border border-stone-850 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase text-stone-500 block">
                  Barber
                </span>
                <p className="font-bold text-stone-200 leading-tight">
                  {currentActive.barber.name}
                </p>
              </div>
              <div className="col-span-2 p-3 bg-stone-900/40 border border-stone-850 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase text-stone-500 block">
                  Service
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-stone-200">
                    {currentActive.service.name}
                  </p>
                  <p className="font-mono font-bold text-amber-400">
                    ${currentActive.service.price}
                  </p>
                </div>
                {currentActive.customer.notes && (
                  <p className="text-[11px] text-stone-500 italic mt-1">
                    "{currentActive.customer.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Status tabs */}
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-500 font-bold block mb-2">
                Change Status
              </span>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_LIST.map((st) => {
                  const s = STATUS_STYLES[st];
                  const isActive = currentActive.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(currentActive.id, st)}
                      className={`py-2.5 px-3 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isActive
                          ? `${s.bg} ${s.border} ${s.text}`
                          : "bg-stone-900/30 border-stone-850 text-stone-500 hover:border-stone-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? s.dot : "bg-stone-700"}`}
                      />
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Confirm",
                  status: "confirmed" as const,
                  icon: <Check className="w-3.5 h-3.5 stroke-[2.5]" />,
                  style:
                    "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500 hover:text-stone-950",
                },
                {
                  label: "Complete",
                  status: "completed" as const,
                  icon: <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />,
                  style:
                    "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500 hover:text-stone-950",
                },
                {
                  label: "Cancel",
                  status: "cancelled" as const,
                  icon: <X className="w-3.5 h-3.5 stroke-[2.5]" />,
                  style:
                    "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white",
                },
              ].map((btn) => (
                <button
                  key={btn.status}
                  onClick={() => onUpdateStatus(currentActive.id, btn.status)}
                  disabled={currentActive.status === btn.status}
                  className={`h-11 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    currentActive.status === btn.status
                      ? "opacity-25 cursor-not-allowed bg-stone-900 border-stone-850 text-stone-500"
                      : btn.style
                  }`}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* Reschedule */}
            <div className="flex items-center justify-between p-3.5 bg-stone-900/30 border border-stone-850 rounded-xl">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-stone-500">
                  Reschedule
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Change date or time slot
                </p>
              </div>
              <button
                onClick={() => {
                  setReschedulingId(currentActive.id);
                  setNewDate(currentActive.date);
                  setNewTime("");
                  setActiveBooking(null);
                }}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-[10px] font-mono text-stone-300 uppercase tracking-wider cursor-pointer hover:border-amber-500/30 transition-colors"
              >
                Change Hour
              </button>
            </div>

            <button
              onClick={() => setActiveBooking(null)}
              className="w-full h-10 bg-stone-900/40 hover:bg-stone-900 border border-stone-850 rounded-xl text-xs font-mono text-stone-400 uppercase tracking-wider cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Reschedule sheet */}
      <BottomSheet
        isOpen={reschedulingId !== null}
        onClose={() => {
          setReschedulingId(null);
          setNewDate("");
          setNewTime("");
        }}
        title="Reschedule Appointment"
      >
        <div className="space-y-5">
          <p className="text-xs text-stone-400">
            Select a new date and time for this booking.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">
                New Date
              </label>
              <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 px-3 py-2.5 rounded-xl">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="text-xs text-stone-200 bg-transparent focus:outline-none font-mono w-full cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">
                New Time
              </label>
              <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 px-3 py-2.5 rounded-xl">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="text-xs text-stone-200 bg-transparent focus:outline-none font-mono w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setReschedulingId(null);
                setNewDate("");
                setNewTime("");
              }}
              className="h-11 rounded-xl bg-stone-900 border border-stone-850 text-xs font-mono text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyReschedule}
              disabled={!newDate || !newTime}
              className={`h-11 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                newDate && newTime
                  ? "bg-amber-500 border-amber-400 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-stone-900 border-stone-850 text-stone-600 cursor-not-allowed"
              }`}
            >
              Confirm Slot
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
