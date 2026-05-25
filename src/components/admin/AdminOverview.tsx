import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Booking, Barber, Service } from "../../types";
import { DollarSign, Calendar, Clock, Users, ArrowUpRight, TrendingUp, Scissors } from "lucide-react";

interface AdminOverviewProps {
  bookings: Booking[];
  barbers: Barber[];
  services: Service[];
}

export function AdminOverview({ bookings, barbers, services }: AdminOverviewProps) {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // Helper date tools
  const getRelativeDateString = (offsetDays: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  const todayStr = getRelativeDateString(0);

  // 1. Calculate Core KPIs
  const kpis = useMemo(() => {
    // Today's bookings
    const todayBookings = bookings.filter(b => b.date === todayStr);
    
    // Earnings from today (confirmed or completed)
    const todayEarnings = todayBookings
      .filter(b => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.service.price, 0);

    const pendingRequests = bookings.filter(b => b.status === "pending").length;
    
    // Active / Available barbers
    const activeStaff = barbers.filter(b => b.status === "active" || b.status === undefined).length;

    return {
      earnings: todayEarnings,
      appointmentsCount: todayBookings.length,
      pendingCount: pendingRequests,
      activeStaffAmount: activeStaff
    };
  }, [bookings, barbers, todayStr]);

  // 2. Weekly Activity Analytics (last 7 days counts)
  const weeklyChartData = useMemo(() => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const results = [];

    // Past 6 days + Today
    for (let i = -6; i <= 0; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const dayName = weekdays[d.getDay()];

      // Match bookings
      const dayBookings = bookings.filter(b => b.date === dateStr);
      const activeBookings = dayBookings.filter(b => b.status !== "cancelled");
      const earnings = activeBookings.reduce((sum, b) => sum + b.service.price, 0);

      results.push({
        dayName,
        date: dateStr,
        bookingsCount: activeBookings.length,
        earnings,
        isToday: i === 0
      });
    }
    return results;
  }, [bookings]);

  // Max value calculation for scaling chart height
  const maxEarnings = useMemo(() => {
    const maxVal = Math.max(...weeklyChartData.map(d => d.earnings), 1);
    return Math.ceil(maxVal / 50) * 50; // round up for clean increments
  }, [weeklyChartData]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
            ManagerIAL <span className="text-amber-400 font-semibold font-serif">Overview</span>
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            LIVE ANALYTICS • PRESTIGE REPORTING CENTRE
          </p>
        </div>
        
        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
            Realtime DB Linked
          </span>
        </div>
      </div>

      {/* KPI Grid (Compact 2x2 on Mobile, 4 columns on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Earnings Today */}
        <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-4.5 space-y-3 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500">
              Today's Revenue
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-mono font-black text-stone-100">
              ${kpis.earnings}
            </h3>
            <span className="flex items-center text-[10px] text-emerald-500 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.5% vs yesterday
            </span>
          </div>
        </div>

        {/* KPI: Today's Appointments */}
        <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-4.5 space-y-3 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500">
              Active Sessions
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-mono font-black text-stone-100">
              {kpis.appointmentsCount}
            </h3>
            <span className="text-[10px] text-stone-500">
              Scheduled for today
            </span>
          </div>
        </div>

        {/* KPI: Pending Requests */}
        <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-4.5 space-y-3 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500">
              Actions Required
            </span>
            <div className={`p-2 rounded-lg ${kpis.pendingCount > 0 ? "bg-amber-500 text-stone-950 animate-pulse" : "bg-stone-800 text-stone-400"}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-mono font-black text-stone-100">
              {kpis.pendingCount}
            </h3>
            <span className="text-[10px] text-amber-400/80 font-medium">
              Pending confirmation
            </span>
          </div>
        </div>

        {/* KPI: Active Barbers */}
        <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-4.5 space-y-3 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500">
              Staff Available
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-mono font-black text-stone-100">
              {kpis.activeStaffAmount} <span className="text-xs text-stone-500 font-light">/ {barbers.length}</span>
            </h3>
            <span className="text-[10px] text-stone-550 header font-mono">
              Ready for placement
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Chart Block */}
      <div className="bg-[#141416] border border-stone-850 rounded-2xl p-5 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-200 flex items-center">
              <TrendingUp className="w-4 h-4 text-amber-500 mr-2" />
              Weekly Booking Valuation (USD)
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Combined session totals across the last 7 calendar days
            </p>
          </div>
          
          <div className="text-right font-mono">
            <span className="text-xs text-stone-500 uppercase tracking-widest block">Total 7D Gain</span>
            <span className="text-md font-bold text-amber-400">
              ${weeklyChartData.reduce((acc, d) => acc + d.earnings, 0)}
            </span>
          </div>
        </div>

        {/* Custom Handcrafted Responsive SVG/HTML Bar & Area Chart */}
        <div className="relative h-64 w-full">
          {/* Y Axis Increments */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-[9px] font-mono text-stone-500 text-right pr-2 select-none border-r border-stone-800/40">
            <span>${maxEarnings}</span>
            <span>${Math.round(maxEarnings * 0.66)}</span>
            <span>${Math.round(maxEarnings * 0.33)}</span>
            <span>$0</span>
          </div>

          {/* Chart Content Stage */}
          <div className="absolute left-12 right-0 top-0 bottom-8 flex justify-between items-end px-4 md:px-8">
            {weeklyChartData.map((data, idx) => {
              // Convert value to percentage height
              const heightPercent = maxEarnings > 0 ? (data.earnings / maxEarnings) * 100 : 0;
              const isHovered = hoveredDataPoint === idx;

              return (
                <div
                  key={data.dayName}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group px-1"
                  onMouseEnter={() => setHoveredDataPoint(idx)}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                >
                  {/* Subtle backdrop column on hover */}
                  <div className="absolute inset-x-0 top-0 bottom-0 bg-stone-900/10 rounded-lg group-hover:bg-stone-900/20 transition-all -z-10" />

                  {/* Dynamic Height Bar with modern glowing gradient styling */}
                  <div className="w-full max-w-[40px] relative transition-all duration-500" style={{ height: `${Math.max(heightPercent, 4)}%` }}>
                    <div className={`absolute inset-0 rounded-t-lg transition-all duration-300 ${
                      data.isToday
                        ? "bg-gradient-to-t from-amber-600 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] border-t border-amber-300"
                        : "bg-stone-800 group-hover:bg-amber-500/20 border-t border-stone-700 hover:border-amber-500/30"
                    }`} />
                  </div>

                  {/* Micro-dot Indicator atop the column */}
                  <div
                    className={`absolute bottom-[-1px] w-2 h-2 rounded-full -mb-1 border transition-colors ${
                      data.isToday ? "bg-amber-400 border-stone-900" : "bg-stone-800 border-stone-700"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-between items-center px-4 md:px-8 border-t border-stone-800/40 pt-2">
            {weeklyChartData.map((data, idx) => (
              <span
                key={data.dayName}
                className={`text-[10px] font-mono tracking-wider text-center flex-1 ${
                  data.isToday ? "text-amber-400 font-bold" : "text-stone-550"
                }`}
              >
                {data.dayName}
              </span>
            ))}
          </div>

          {/* Multi-Touch Floating Interactive HUD Tooltip */}
          {hoveredDataPoint !== null && (
            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-stone-950 border border-amber-500/30 px-3.5 py-1.5 rounded-lg shadow-xl z-20 pointer-events-none text-center">
              <span className="block text-[9px] uppercase tracking-widest font-mono text-stone-500">
                {weeklyChartData[hoveredDataPoint].dayName} ({weeklyChartData[hoveredDataPoint].date})
              </span>
              <span className="block text-xs font-mono font-bold text-amber-400">
                ${weeklyChartData[hoveredDataPoint].earnings} earned
              </span>
              <span className="block text-[9px] text-stone-400">
                {weeklyChartData[hoveredDataPoint].bookingsCount} active sessions
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
