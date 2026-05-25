import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Booking, Barber, Service, BarberStatus } from "../../types";
import { AdminOverview } from "./AdminOverview";
import { AdminSchedule } from "./AdminSchedule";
import { AdminBarbers } from "./AdminBarbers";
import { AdminServices } from "./AdminServices";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Translate, useLanguage } from "../../utils/LanguageContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Settings,
  CornerUpLeft,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
  Sparkles,
  MapPin,
  Trash2,
  Lock
} from "lucide-react";

interface AdminDashboardProps {
  bookings: Booking[];
  barbers: Barber[];
  services: Service[];
  onUpdateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  onRescheduleBooking: (bookingId: string, date: string, time: string) => void;
  onUpdateBarberStatus: (barberId: string, status: BarberStatus) => void;
  onAddBarber: (newBarber: { name: string; specialty: string; avatarUrl: string }) => void;
  onUpdateService: (service: Service) => void;
  onResetDatabase: () => void;
  onSwitchToClient: () => void;
}

type TabType = "overview" | "schedule" | "barbers" | "services" | "settings";

export function AdminDashboard({
  bookings,
  barbers,
  services,
  onUpdateBookingStatus,
  onRescheduleBooking,
  onUpdateBarberStatus,
  onAddBarber,
  onUpdateService,
  onResetDatabase,
  onSwitchToClient
}: AdminDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Tabs declaration
  const NAVIGATION_ITEMS = [
    { id: "overview", label: t("nav_overview", "Overview"), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "schedule", label: t("nav_schedule", "Live Schedule"), icon: <Calendar className="w-4 h-4" /> },
    { id: "barbers", label: t("nav_barbers", "Barber Staff"), icon: <Users className="w-4 h-4" /> },
    { id: "services", label: t("nav_services", "Service Catalog"), icon: <Scissors className="w-4 h-4" /> },
    { id: "settings", label: t("nav_settings", "Settings Hub"), icon: <Settings className="w-4 h-4" /> }
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminOverview
            bookings={bookings}
            barbers={barbers}
            services={services}
          />
        );
      case "schedule":
        return (
          <AdminSchedule
            bookings={bookings}
            barbers={barbers}
            services={services}
            onUpdateStatus={onUpdateBookingStatus}
            onReschedule={onRescheduleBooking}
          />
        );
      case "barbers":
        return (
          <AdminBarbers
            barbers={barbers}
            onUpdateBarberStatus={onUpdateBarberStatus}
            onAddBarber={onAddBarber}
          />
        );
      case "services":
        return (
          <AdminServices
            services={services}
            onUpdateService={onUpdateService}
          />
        );
      case "settings":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
                Settings & <span className="text-amber-400 font-semibold font-serif">Controls</span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                CLEANUP WORKSPACE, RE-POPULATE SIMULATED DATABASES
              </p>
            </div>

            <div className="bg-[#141416]/95 border border-stone-850 rounded-2xl p-6 space-y-6 max-w-2xl shadow-xl">
              
              {/* Reset database card option */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-stone-200">
                    Wipe State & Re-populate Default Database
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    This completely wipes existing appointments, catalogs, and staff availability status from your current local preview cache, then restores the pristine defaults. Excellent for verifying empty states and starting a clean test.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onResetDatabase();
                      setActiveTab("overview");
                    }}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-stone-100 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Reset DB To Pristine State
                  </button>
                </div>
              </div>

              {/* Shop info card */}
              <div className="pt-6 border-t border-stone-850 space-y-3">
                <h3 className="text-sm font-semibold text-stone-200">
                  Business Location & Contact Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-400">
                  <div className="p-3 bg-stone-900/40 rounded-lg border border-stone-850">
                    <span className="block font-mono text-[9px] uppercase font-bold text-stone-550 mb-0.5">Physical Salon</span>
                    <span>72 Regent Imperial Blvd, New York</span>
                  </div>
                  <div className="p-3 bg-stone-900/40 rounded-lg border border-stone-850">
                    <span className="block font-mono text-[9px] uppercase font-bold text-stone-550 mb-0.5">Manager Desk Hotline</span>
                    <span>+1 (212) 555-0104</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#E4E4E7] flex flex-col md:flex-row relative overflow-x-hidden selection:bg-amber-400 selection:text-stone-900">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      {/* DESKTOP SIDEBAR (visible on md+) */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#141416] border-r border-stone-850/60 p-6 flex-shrink-0 z-30">
        <div className="space-y-8">
          
          {/* Logo Brand Brand */}
          <div className="space-y-1">
            <span className="font-mono text-[9px] tracking-widest font-bold uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              <Translate id="admin_control_desk" fallback="ADMIN CONTROL DESK" />
            </span>
            <h1 className="text-xl font-light tracking-widest uppercase text-stone-100 pt-1">
              <Translate id="admin_brand_sovereign" fallback="SOVEREIGN" /> <span className="font-serif italic font-medium text-amber-500"><Translate id="brand_suffix" fallback="Club" /></span>
            </h1>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1.5 flex flex-col">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs uppercase tracking-wide font-bold flex items-center justify-between group transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/10 border border-amber-400"
                      : "text-stone-400 hover:text-stone-250 hover:bg-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-605 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back switch bottom link block */}
        <div className="pt-6 border-t border-stone-850 space-y-4">
          <LanguageSwitcher horizontal={true} />
          <button
            onClick={onSwitchToClient}
            className="w-full py-2.5 font-mono text-[10px] tracking-widest font-black uppercase rounded-lg border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CornerUpLeft className="w-3.5 h-3.5" /> <Translate id="btn_client_chair" fallback="Book Client chair" />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER DOCK */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#141416]/98 border-b border-stone-850 z-40 sticky top-0 backdrop-blur-md">
        <div className="space-y-0.5">
          <h1 className="text-sm font-light tracking-widest uppercase text-stone-100 flex items-center gap-1">
            <Translate id="admin_brand_sovereign" fallback="Sovereign" /> <span className="font-serif italic text-amber-400 font-bold"><Translate id="admin_suffix" fallback="Admin" /></span>
          </h1>
          <span className="text-[8px] font-mono tracking-wider uppercase text-stone-500 block"><Translate id="console_center" fallback="Console center" /></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selection dropdown on mobile */}
          <LanguageSwitcher />

          {/* Client Booking Button */}
          <button
            onClick={onSwitchToClient}
            className="p-1.5 h-[33px] px-2 rounded-xl border border-stone-800 bg-stone-900/60 text-stone-400 hover:bg-stone-900 flex items-center justify-center"
            title="Book Client Chair"
          >
            <CornerUpLeft className="w-4 h-4 text-stone-400" />
          </button>

          {/* Toggle drawer button */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 h-[33px] px-2 rounded-xl border border-stone-800 text-amber-400 bg-stone-900 flex items-center justify-center"
            title="Open Drawer"
          >
            {isMobileDrawerOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* MOBILE HAMBURGER DRAWER DISPLAY (Slide custom with framer motion) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Sliding Drawer card */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-[#141416] border-l border-stone-850 p-6 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-2 border-b border-stone-850">
                  <span className="text-[10px] font-mono uppercase font-black tracking-widest text-stone-400">
                    <Translate id="nav_links" fallback="Navigational Links" />
                  </span>
                  <button onClick={() => setIsMobileDrawerOpen(false)}>
                    <X className="w-4.5 h-4.5 text-stone-500" />
                  </button>
                </div>

                <nav className="space-y-2 flex flex-col">
                  {NAVIGATION_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id as TabType)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-black flex items-center gap-3 transition-all ${
                          isActive
                            ? "bg-amber-500 text-stone-950 border border-amber-400"
                            : "text-stone-400 hover:text-stone-250 hover:bg-stone-900"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Client seat bottom trigger for drawer */}
              <div className="pt-6 border-t border-stone-850 space-y-4">
                <LanguageSwitcher horizontal={true} />
                <button
                  onClick={onSwitchToClient}
                  className="w-full py-3 text-[10px] uppercase font-bold tracking-widest font-mono rounded-xl border border-stone-800 text-stone-300 flex items-center justify-center gap-1.5"
                >
                  <CornerUpLeft className="w-4 h-4" /> <Translate id="btn_client_chair" fallback="Book Client chair" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CORE WORKSPACE / VIEW STAGE CONTROLLERS */}
      <main className="flex-grow p-4.5 md:p-8 space-y-6 max-h-screen overflow-y-auto w-full">
        {renderActiveTabContent()}
      </main>

      {/* MOBILE CONVENIENCE BOTTOM NAV BAR (Thumb-friendly app bar design standard) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-[#141416]/95 border-t border-stone-850 backdrop-blur-md flex items-center justify-around px-2 py-1 z-35">
        {NAVIGATION_ITEMS.slice(0, 4).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={`bottom-${item.id}`}
              onClick={() => handleTabChange(item.id as TabType)}
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-lg transition-colors ${
                isActive ? "text-amber-400" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {item.icon}
              <span className="text-[8px] font-mono uppercase tracking-tight font-black mt-1">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
