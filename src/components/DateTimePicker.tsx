import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Barber } from "../types";
import { TIME_SLOTS, getUnavailableSlots } from "../data/barberData";
import { ChevronLeft, ChevronRight, Calendar, Clock, Sun, Sunset, Moon, Sparkles } from "lucide-react";

interface DateTimePickerProps {
  selectedDate: string | null; // YYYY-MM-DD
  selectedTime: string | null;
  selectedBarber: Barber | null;
  onSelectDate: (dateStr: string) => void;
  onSelectTime: (timeStr: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DateTimePicker({
  selectedDate,
  selectedTime,
  selectedBarber,
  onSelectDate,
  onSelectTime
}: DateTimePickerProps) {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [activeSlotTab, setActiveSlotTab] = useState<"morning" | "afternoon" | "evening">("morning");

  // Keep track of drag offsets for calendar page cues
  const [swipeDirection, setSwipeDirection] = useState<number>(0);

  // Format date helper: YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // Days in current month calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  // Navigate Months
  const handlePrevMonth = () => {
    setSwipeDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSwipeDirection(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Get dynamic unavailable slots for selected date
  const unavailableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate) return [];
    return getUnavailableSlots(selectedBarber.id, selectedDate);
  }, [selectedBarber, selectedDate]);

  // Generate date grid cells
  const calendarCells = useMemo(() => {
    const cells = [];
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    // 1. Preceding empty days from previous month to align weekday grid
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        num: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: ""
      });
    }

    // 2. Days of active month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        num: i,
        isCurrentMonth: true,
        dateStr: formatDateString(currentYear, currentMonth, i)
      });
    }

    // 3. Trailing blank days from next month
    const totalCells = cells.length;
    const remainingSlots = 42 - totalCells; // Standard 6-row calendar
    for (let i = 1; i <= remainingSlots; i++) {
      cells.push({
        num: i,
        isCurrentMonth: false,
        dateStr: ""
      });
    }

    return cells;
  }, [currentYear, currentMonth, daysInMonth, firstDayIndex]);

  // Check if a date cell is in the past
  const isPastDate = (dateStr: string) => {
    if (!dateStr) return true;
    const cellDate = new Date(dateStr + "T00:00:00");
    const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < todayNoTime;
  };

  // Detect and set correct active slot tab based on selectedTime (if any)
  React.useEffect(() => {
    if (selectedTime) {
      if (TIME_SLOTS.morning.includes(selectedTime)) {
        setActiveSlotTab("morning");
      } else if (TIME_SLOTS.afternoon.includes(selectedTime)) {
        setActiveSlotTab("afternoon");
      } else if (TIME_SLOTS.evening.includes(selectedTime)) {
        setActiveSlotTab("evening");
      }
    }
  }, [selectedTime]);

  // Generate next 10 days for mobile Weekly Calendar Strip
  const weeklyStripDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dayNum = d.getDate();
      const weekdayStr = WEEKDAYS[d.getDay()]; // e.g. "Sun"
      const monthStr = MONTHS[d.getMonth()].slice(0, 3); // e.g. "Jan"
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dateStr = `${year}-${month}-${String(dayNum).padStart(2, "0")}`;
      days.push({ dayNum, weekdayStr, monthStr, dateStr });
    }
    return days;
  }, [today]);

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-light tracking-wide text-stone-100 uppercase">
          Set <span className="text-amber-400 font-semibold">Date & Time</span>
        </h2>
        <p className="text-sm text-stone-400 font-light">
          Select an available date, then choose a time slot that fits your schedule perfectly.
        </p>
      </div>

      {/* Desktop/Tablet Grid View */}
      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Section (LHS) */}
        <div className="lg:col-span-7 bg-stone-900/40 border border-stone-850 rounded-2xl p-5 shadow-inner">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-850/65">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm font-semibold text-stone-200 tracking-wide font-sans">
                {MONTHS[currentMonth]} {currentYear}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-850 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="w-10 h-10 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-850 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels (Immutable columns) */}
          <div className="grid grid-cols-7 text-center mb-2">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-[11px] font-mono tracking-wider font-bold text-stone-500 uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Swipeable Calendar Day Grid */}
          <div className="relative overflow-hidden rounded-xl">
            <motion.div
              key={`${currentMonth}-${currentYear}`}
              custom={swipeDirection}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                // If dragged right beyond threshold, previous month
                if (info.offset.x > 65) {
                  handlePrevMonth();
                } 
                // If dragged left, next month
                else if (info.offset.x < -65) {
                  handleNextMonth();
                }
              }}
              whileTap={{ cursor: "grabbing" }}
              className="grid grid-cols-7 gap-1 text-center cursor-grab active:cursor-grabbing select-none"
            >
              {calendarCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <span
                      key={`empty-${idx}`}
                      className="aspect-square flex items-center justify-center text-[11px] text-stone-750 font-light pointer-events-none opacity-20"
                    >
                      {cell.num}
                    </span>
                  );
                }

                const isPast = isPastDate(cell.dateStr);
                const isSelected = selectedDate === cell.dateStr;
                
                // Highlight today's date
                const todayStr = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
                const isToday = todayStr === cell.dateStr;

                return (
                  <motion.button
                    key={`day-${cell.dateStr}`}
                    disabled={isPast}
                    whileTap={isPast ? {} : { scale: 0.94 }}
                    onClick={() => {
                      onSelectDate(cell.dateStr);
                      // Clear selected time if they change dates
                      onSelectTime("");
                    }}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-colors relative cursor-pointer border ${
                      isPast
                        ? "text-stone-700 border-transparent cursor-not-allowed opacity-30 line-through"
                        : isSelected
                        ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/25 border-amber-400"
                        : isToday
                        ? "text-amber-450 bg-stone-900/40 border-stone-800 hover:border-amber-500/30"
                        : "text-stone-300 border-transparent hover:bg-stone-850 hover:text-amber-400"
                    }`}
                  >
                    <span className="font-mono text-xs">{cell.num}</span>
                    
                    {/* Tiny visual cue for events */}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                    )}
                    {isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-0.5 rounded-full bg-stone-950" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <p className="text-[10px] text-stone-500 font-mono tracking-wide text-center mt-4">
            ← Drag horizontally to swipe months →
          </p>
        </div>

        {/* Time Slots Section (RHS) */}
        <div className="lg:col-span-5 h-full flex flex-col">
          {!selectedDate ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-stone-900/10 border border-dashed border-stone-800 rounded-2xl text-center space-y-3 min-h-[290px]">
              <div className="p-3 bg-stone-900/40 text-stone-600 rounded-full">
                <Calendar className="w-6 h-6 text-stone-500" />
              </div>
              <p className="text-xs text-stone-450 font-light">
                Select a styling date on the left list to pull available craftsman slots.
              </p>
            </div>
          ) : (
            <div className="bg-stone-900/45 border border-stone-850 rounded-2xl p-5 space-y-5 shadow-inner">
              <div className="flex items-center gap-2 pb-3 mb-1 border-b border-stone-850/65">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-stone-200 tracking-wider uppercase">
                  Available Slots
                </span>
                <span className="ml-auto text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 py-0.5 px-2.5 rounded-lg border border-amber-500/15">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" })}
                </span>
              </div>

              {/* Segmented Tab Controls for Time Periods - ultra friendly for one-thumb selection */}
              <div className="grid grid-cols-3 bg-stone-950 p-1 rounded-xl border border-stone-850 relative">
                {(["morning", "afternoon", "evening"] as const).map((period) => {
                  const isActive = activeSlotTab === period;
                  const getTabLabel = () => {
                    switch (period) {
                      case "morning": return { label: "Morning", icon: <Sun className="w-3.5 h-3.5" /> };
                      case "afternoon": return { label: "Afternoon", icon: <Sunset className="w-3.5 h-3.5" /> };
                      case "evening": return { label: "Evening", icon: <Moon className="w-3.5 h-3.5" /> };
                    }
                  };
                  const opt = getTabLabel();

                  return (
                    <button
                      key={period}
                      onClick={() => setActiveSlotTab(period)}
                      className={`relative z-10 py-2.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none ${
                        isActive
                          ? "text-stone-950 font-extrabold bg-amber-500 shadow-md shadow-amber-500/20"
                          : "text-stone-450 hover:text-stone-200"
                      }`}
                    >
                      {opt.icon}
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Displayed Slots Grid with Spring Transitions */}
              <div className="min-h-[160px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlotTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-1"
                  >
                    {TIME_SLOTS[activeSlotTab].map((slot) => {
                      const isUnavailable = unavailableSlots.includes(slot);
                      const isSelected = selectedTime === slot;

                      return (
                        <motion.button
                          key={slot}
                          disabled={isUnavailable}
                          whileTap={isUnavailable ? {} : { scale: 0.95 }}
                          onClick={() => onSelectTime(slot)}
                          className={`h-12 w-full rounded-xl flex items-center justify-center font-mono text-[11px] font-semibold tracking-wide border transition-all cursor-pointer ${
                            isUnavailable
                              ? "bg-stone-950/20 text-stone-700 border-transparent opacity-20 pointer-events-none line-through"
                              : isSelected
                              ? "bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-lg shadow-amber-500/25 scale-102"
                              : "bg-stone-900/40 border-stone-850 text-stone-300 hover:border-amber-500/35 hover:text-amber-400 hover:bg-stone-850"
                          }`}
                        >
                          {slot}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Status cue */}
              <div className="text-[10px] tracking-wide font-mono text-stone-500 uppercase flex items-center justify-center gap-1 bg-[#151517] py-2 rounded-xl border border-stone-850/60 max-w-full">
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                <span>Selected: {selectedTime ? `${selectedTime} Slot` : "No hour selected"}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Only Touch-Ergonomic View (Single-Screen Scroll Killer) */}
      <div className="block sm:hidden space-y-5">
        {/* Horizontal Calendar Weekly Strip */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 uppercase tracking-widest text-left">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Select Styling Date
          </div>
          
          <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none snap-x -mx-4 px-4">
            {weeklyStripDays.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              const dateObj = new Date(item.dateStr + "T00:00:00");
              const isToday = formatDateString(today.getFullYear(), today.getMonth(), today.getDate()) === item.dateStr;

              return (
                <motion.button
                  key={`strip-${item.dateStr}`}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    onSelectDate(item.dateStr);
                    onSelectTime("");
                  }}
                  className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer snap-center relative ${
                    isSelected
                      ? "bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/25"
                      : "bg-stone-900/40 border-stone-850 text-stone-300 hover:border-amber-500/30"
                  }`}
                >
                  <span className="text-[8px] uppercase tracking-wide opacity-70 font-semibold">{item.weekdayStr}</span>
                  <span className="text-base font-bold font-mono tracking-tight mt-0.5">{item.dayNum}</span>
                  <span className="text-[7.5px] uppercase tracking-wider font-mono opacity-60">{item.monthStr}</span>
                  
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Multi-Period Time Slots Horizontal scrolling lists */}
        {!selectedDate ? (
          <div className="p-6 bg-stone-900/10 border border-dashed border-stone-850 rounded-xl text-center space-y-2">
            <Calendar className="w-5 h-5 text-stone-605 mx-auto text-stone-600" />
            <p className="text-[11px] text-stone-500">Pick an available styling date above to see appointment slots.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 Border-b border-stone-900">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 uppercase tracking-widest text-left">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Choose Arrival Time
              </div>
              <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/15 text-amber-400 py-0.5 px-2 rounded-lg">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" })}
              </span>
            </div>

            {/* Morning Section */}
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-450 uppercase tracking-wider">
                <Sun className="w-3 h-3 text-amber-500" /> Morning Slots
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-4 px-4">
                {TIME_SLOTS.morning.map((slot) => {
                  const isUnavailable = unavailableSlots.includes(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={`mob-mrn-${slot}`}
                      disabled={isUnavailable}
                      onClick={() => onSelectTime(slot)}
                      className={`py-2 px-4 rounded-xl flex-shrink-0 font-mono text-[11px] font-semibold border transition-all ${
                        isUnavailable
                          ? "bg-stone-950/20 text-stone-700 border-transparent opacity-20 pointer-events-none line-through"
                          : isSelected
                          ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm shadow-amber-500/25"
                          : "bg-stone-900/40 border-stone-850 text-stone-300 hover:border-amber-500/30"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-450 uppercase tracking-wider">
                <Sunset className="w-3 h-3 text-amber-500" /> Afternoon Slots
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-4 px-4">
                {TIME_SLOTS.afternoon.map((slot) => {
                  const isUnavailable = unavailableSlots.includes(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={`mob-aft-${slot}`}
                      disabled={isUnavailable}
                      onClick={() => onSelectTime(slot)}
                      className={`py-2 px-4 rounded-xl flex-shrink-0 font-mono text-[11px] font-semibold border transition-all ${
                        isUnavailable
                          ? "bg-stone-950/20 text-stone-700 border-transparent opacity-20 pointer-events-none line-through"
                          : isSelected
                          ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm shadow-amber-500/25"
                          : "bg-stone-900/40 border-stone-850 text-stone-300 hover:border-amber-500/30"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening Section */}
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-450 uppercase tracking-wider">
                <Moon className="w-3 h-3 text-amber-500" /> Evening Slots
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-4 px-4">
                {TIME_SLOTS.evening.map((slot) => {
                  const isUnavailable = unavailableSlots.includes(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={`mob-eve-${slot}`}
                      disabled={isUnavailable}
                      onClick={() => onSelectTime(slot)}
                      className={`py-2 px-4 rounded-xl flex-shrink-0 font-mono text-[11px] font-semibold border transition-all ${
                        isUnavailable
                          ? "bg-stone-950/20 text-stone-700 border-transparent opacity-20 pointer-events-none line-through"
                          : isSelected
                          ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm shadow-amber-500/25"
                          : "bg-stone-900/40 border-stone-850 text-stone-300 hover:border-amber-500/30"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
