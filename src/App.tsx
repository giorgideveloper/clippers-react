import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookingState, Booking, Barber, Service, BarberStatus } from "./types";
import { ServiceSelection } from "./components/ServiceSelection";
import { BarberSelection } from "./components/BarberSelection";
import { DateTimePicker } from "./components/DateTimePicker";
import { CustomerInfoReview } from "./components/CustomerInfoReview";
import { SuccessView } from "./components/SuccessView";
import { Stepper } from "./components/Stepper";
import {
  Scissors,
  Clock,
  UserCheck,
  CalendarDays,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Lock,
} from "lucide-react";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Translate, useLanguage } from "./utils/LanguageContext";
import {
  loadBookings,
  saveBookings,
  loadBarbers,
  saveBarbers,
  loadServices,
  saveServices,
} from "./utils/storage";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function App() {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [barbers, setBarbers] = useState<Barber[]>(() => loadBarbers());
  const [services, setServices] = useState<Service[]>(() => loadServices());

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] =
    useState<boolean>(false);

  const navRef = useRef<HTMLDivElement>(null);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);

  React.useEffect(() => {
    setIsNavVisible(true);
    const el = navRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNavVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentStep, isConfirming]);

  const [bookingState, setBookingState] = useState<BookingState>({
    service: null,
    barber: null,
    date: null,
    time: null,
    customer: {
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const [inputErrors, setInputErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  // Automatically scroll to top of window when current page/step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Reset reservation flow
  const handleReset = () => {
    setBookingState({
      service: null,
      barber: null,
      date: null,
      time: null,
      customer: { name: "", phone: "", email: "", notes: "" },
    });
    setInputErrors({});
    setCurrentStep(0);
    setIsConfirming(false);
  };

  const handleSelectService = (service: any) => {
    setBookingState((prev) => ({ ...prev, service }));
  };

  const handleSelectBarber = (barber: any) => {
    setBookingState((prev) => ({ ...prev, barber }));
  };

  const handleSelectDate = (date: string) => {
    setBookingState((prev) => ({ ...prev, date }));
  };

  const handleSelectTime = (time: string) => {
    setBookingState((prev) => ({ ...prev, time }));
  };

  const handleChangeCustomerInfo = (field: string, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }));
    // Clear field-specific error as they type
    if (inputErrors[field as keyof typeof inputErrors]) {
      setInputErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step Nav validation controls
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return bookingState.service !== null;
      case 1:
        return bookingState.barber !== null;
      case 2:
        return bookingState.date !== null && bookingState.time !== null;
      case 3:
        return (
          !!bookingState.customer.name &&
          !!bookingState.customer.phone &&
          !!bookingState.customer.email
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Validate customer info step
      const errors: typeof inputErrors = {};
      const { name, phone, email } = bookingState.customer;

      if (!name || name.trim().length < 2) {
        errors.name = "Please enter your full name.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
      }

      // Check simple phone length
      if (!phone || phone.replace(/\D/g, "").length < 7) {
        errors.phone = "Please enter a valid contact phone number.";
      }

      if (Object.keys(errors).length > 0) {
        setInputErrors(errors);
        return;
      }

      // Trigger luxurious Barber Pole loading transition
      setIsConfirming(true);
      setTimeout(() => {
        setIsConfirming(false);
        setCurrentStep(4); // Success step

        // Save new booking directly into our synchronizing local DB
        const newB: Booking = {
          id: "b-" + Date.now(),
          service: bookingState.service!,
          barber: bookingState.barber!,
          date: bookingState.date!,
          time: bookingState.time!,
          customer: bookingState.customer,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        const nextList = [newB, ...bookings];
        setBookings(nextList);
        saveBookings(nextList);
      }, 1600);
    } else {
      if (isStepValid(currentStep)) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  // State operations handlers
  const handleUpdateBookingStatus = (
    bookingId: string,
    status: Booking["status"],
  ) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status } : b,
    );
    setBookings(updated);
    saveBookings(updated);
  };

  const handleRescheduleBooking = (
    bookingId: string,
    date: string,
    time: string,
  ) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, date, time } : b,
    );
    setBookings(updated);
    saveBookings(updated);
  };

  const handleUpdateBarberStatus = (barberId: string, status: BarberStatus) => {
    const updated = barbers.map((b) =>
      b.id === barberId
        ? { ...b, status, isAvailable: status === "active" }
        : b,
    );
    setBarbers(updated);
    saveBarbers(updated);
  };

  const handleAddBarber = (newBarber: {
    name: string;
    specialty: string;
    avatarUrl: string;
  }) => {
    const barberWithId: Barber = {
      ...newBarber,
      id: "barber-" + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: true,
      status: "active",
    };
    const updated = [...barbers, barberWithId];
    setBarbers(updated);
    saveBarbers(updated);
  };

  const handleUpdateService = (updatedService: Service) => {
    const updated = services.map((s) =>
      s.id === updatedService.id ? updatedService : s,
    );
    setServices(updated);
    saveServices(updated);
  };

  const handleResetDatabase = () => {
    localStorage.removeItem("sov_barber_bookings");
    localStorage.removeItem("sov_barber_staff");
    localStorage.removeItem("sov_barber_catalog");
    setBookings(loadBookings());
    setBarbers(loadBarbers());
    setServices(loadServices());
  };

  // Render the corresponding form wizard view
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceSelection
            selectedService={bookingState.service}
            onSelect={handleSelectService}
            services={services}
          />
        );
      case 1:
        return (
          <BarberSelection
            selectedBarber={bookingState.barber}
            onSelect={handleSelectBarber}
            barbers={barbers}
          />
        );
      case 2:
        return (
          <DateTimePicker
            selectedDate={bookingState.date}
            selectedTime={bookingState.time}
            selectedBarber={bookingState.barber}
            onSelectDate={handleSelectDate}
            onSelectTime={handleSelectTime}
          />
        );
      case 3:
        return (
          <CustomerInfoReview
            bookingState={bookingState}
            onChangeInfo={handleChangeCustomerInfo}
            errors={inputErrors}
          />
        );
      case 4:
        return (
          <SuccessView bookingState={bookingState} onReset={handleReset} />
        );
      default:
        return null;
    }
  };

  if (isAdmin) {
    return (
      <AdminDashboard
        bookings={bookings}
        barbers={barbers}
        services={services}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onRescheduleBooking={handleRescheduleBooking}
        onUpdateBarberStatus={handleUpdateBarberStatus}
        onAddBarber={handleAddBarber}
        onUpdateService={handleUpdateService}
        onResetDatabase={handleResetDatabase}
        onSwitchToClient={() => setIsAdmin(false)}
      />
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#0F0F10] text-[#E4E4E7] font-sans antialiased relative pt-8 pb-32 sm:py-12 px-4 md:px-8 selection:bg-amber-500 selection:text-stone-900">
      {/* Background Decorative Gold Ambient Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Salon Branding Header - Highly elegant */}
        <header className="text-center space-y-3 relative">
          {/* Quick interactive switcher */}
          <div className="flex flex-row items-center justify-between gap-3 max-w-xl mx-auto border-b border-stone-850/30 pb-3 mb-2 px-1">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 border border-amber-500/20 rounded-full font-mono text-[10px] uppercase tracking-widest text-amber-550">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <Translate
                id="exquisite_grooming"
                fallback="Exquisite Male Grooming"
              />
            </div>

            <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
              <LanguageSwitcher />

              <button
                onClick={() => setIsAdmin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider font-bold bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/30 rounded-xl cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />{" "}
                <Translate id="access_owner" fallback="Access Owner Panel" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extralight tracking-widest uppercase text-stone-100 flex items-center justify-center gap-2">
            <Translate id="brand_name" fallback="SOVEREIGN" />
            <span className="font-serif italic font-medium text-amber-400">
              <Translate id="brand_suffix" fallback="Club" />
            </span>
          </h1>

          <p className="text-xs text-stone-500 tracking-wider font-mono">
            <Translate
              id="shop_address"
              fallback="72 Regent Imperial Blvd, New York • Open Daily 09:00 AM - 08:00 PM"
            />
          </p>
        </header>

        {/* Wizard Panel */}
        <div className="bg-[#141416]/90 border border-stone-850 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Golden Thread Line across the panel */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/55 to-transparent shadow-[0_1px_5px_rgba(245,158,11,0.2)]" />

          {/* Stepper Display (hidden during Success screen) */}
          {currentStep < 4 && (
            <div className="mb-8 pb-8 border-b border-stone-850">
              <Stepper currentStep={currentStep} />
            </div>
          )}

          {/* Core Content Form Container */}
          <div className="min-h-[360px] relative">
            <AnimatePresence mode="wait">
              {isConfirming ? (
                /* Shimmering Barber Pole Spin Loading Screen */
                <motion.div
                  key="confirm-loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center space-y-5"
                >
                  <div className="relative w-16 h-36 border border-amber-500/30 rounded-full overflow-hidden bg-stone-950 flex flex-col justify-between p-1">
                    {/* Golden Barber Pole Spirals */}
                    <div className="absolute inset-x-0 h-full bg-[linear-gradient(45deg,rgba(0,0,0,0)_25%,rgba(217,119,6,0.3)_25%,rgba(217,119,6,0.3)_50%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_75%,rgba(217,119,6,0.3)_75%)] bg-[length:50px_50px] animate-[barberpole_1s_linear_infinite] rounded-full" />
                  </div>
                  <div className="text-center space-y-1 z-10">
                    <span className="block text-xs font-mono uppercase tracking-widest text-amber-400 font-bold animate-pulse">
                      Writing Ticket
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Securing VIP chair placement...
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 55 : -55 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -55 : 55 }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                >
                  {renderStepContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scroll-to-Action Hint Strip — Desktop */}
          {currentStep < 4 && !isConfirming && (
            <div className="hidden sm:flex items-center gap-4 mt-6 mb-1">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-stone-700/50 to-amber-500/30" />
              <div className="flex items-end gap-0.75 h-3.5">
                <span
                  className="w-0.75 rounded-full bg-amber-500/35 animate-bounce [animation-delay:0ms]"
                  style={{ height: "6px" }}
                />
                <span
                  className="w-0.75 rounded-full bg-amber-500/60 animate-bounce [animation-delay:80ms]"
                  style={{ height: "12px" }}
                />
                <span
                  className="w-0.75 rounded-full bg-amber-500/80 animate-bounce [animation-delay:160ms]"
                  style={{ height: "8px" }}
                />
                <span
                  className="w-0.75 rounded-full bg-amber-500/60 animate-bounce [animation-delay:240ms]"
                  style={{ height: "12px" }}
                />
                <span
                  className="w-0.75 rounded-full bg-amber-500/35 animate-bounce [animation-delay:320ms]"
                  style={{ height: "6px" }}
                />
              </div>
              <div className="flex-1 h-px bg-linear-to-l from-transparent via-stone-700/50 to-amber-500/30" />
            </div>
          )}

          {/* Stepper Navigation Actions Section - Desktop Only */}
          {currentStep < 4 && !isConfirming && (
            <div
              ref={navRef}
              className="hidden sm:flex mt-4 pt-5 border-t border-stone-800/30 flex-row items-center justify-between gap-3"
            >
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`h-12 px-6 text-xs font-mono font-black uppercase tracking-widest rounded-xl border flex items-center justify-center transition-all ${
                  currentStep === 0
                    ? "border-stone-900 bg-stone-950/20 text-stone-700 cursor-not-allowed opacity-20 pointer-events-none"
                    : "border-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-850 cursor-pointer active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                <Translate id="btn_back" fallback="Back" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={`h-12 px-8 text-xs font-mono font-black uppercase tracking-widest rounded-xl flex items-center justify-center transition-all shadow-lg ${
                  isStepValid(currentStep)
                    ? "bg-amber-500 hover:bg-amber-450 border border-amber-400 text-stone-950 shadow-amber-500/15 active:scale-95 cursor-pointer font-extrabold"
                    : "bg-stone-900 border border-stone-850 text-stone-600 cursor-not-allowed select-none"
                }`}
              >
                {currentStep === 3
                  ? t("btn_confirm_reservation", "Confirm Reservation")
                  : t("btn_continue", "Continue Progress")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        {currentStep < 4 && !isConfirming && (
          <div className="fixed bottom-0 inset-x-0 bg-[#121214]/95 border-t border-stone-850/80 backdrop-blur-lg px-4 pt-3 pb-6 z-40 flex flex-col sm:hidden">
            {/* Tiny Expandable Summary */}
            <div className="mb-2">
              <button
                onClick={() => setIsMobileSummaryExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between text-[11px] font-mono tracking-wide text-stone-400 py-1.5 px-3 bg-stone-900 border border-stone-850 rounded-lg select-none"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  <span className="font-semibold text-stone-200">
                    {bookingState.service
                      ? t(
                          "service_" + bookingState.service.id + "_name",
                          bookingState.service.name,
                        )
                      : t("step_0", "Choose Service")}
                  </span>
                  {bookingState.barber && (
                    <>
                      <span className="text-stone-600">|</span>
                      <span className="truncate">
                        Barber:{" "}
                        {t(
                          "barber_" + bookingState.barber.id + "_name",
                          bookingState.barber.name,
                        )}
                      </span>
                    </>
                  )}
                  {bookingState.date && bookingState.time && (
                    <>
                      <span className="text-stone-600">|</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {bookingState.time}
                      </span>
                    </>
                  )}
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${isMobileSummaryExpanded ? "rotate-90 text-amber-400" : ""}`}
                />
              </button>

              {/* Expandable selection table snippet */}
              <AnimatePresence>
                {isMobileSummaryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2 bg-stone-900 border border-stone-850 rounded-xl p-3 text-left space-y-2"
                  >
                    <h4 className="text-[9px] font-mono uppercase font-bold text-amber-405 text-amber-400 tracking-wider">
                      <Translate
                        id="treatment_details_title"
                        fallback="Your Treatment Details"
                      />
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-stone-950/40 p-2 rounded-lg border border-stone-850/40 col-span-2">
                        <span className="block text-stone-500 uppercase text-[8px] font-mono font-bold mb-0.5">
                          <Translate
                            id="exp_style"
                            fallback="Experience Style"
                          />
                        </span>
                        <span className="font-bold text-stone-200">
                          {bookingState.service
                            ? `${t("service_" + bookingState.service.id + "_name", bookingState.service.name)} ($${bookingState.service.price})`
                            : "Not selected yet"}
                        </span>
                      </div>
                      <div className="bg-stone-950/40 p-2 rounded-lg border border-stone-850/40">
                        <span className="block text-stone-500 uppercase text-[8px] font-mono font-bold mb-0.5">
                          <Translate
                            id="master_barber"
                            fallback="Master Barber"
                          />
                        </span>
                        <span className="font-semibold text-stone-300">
                          {bookingState.barber
                            ? t(
                                "barber_" + bookingState.barber.id + "_name",
                                bookingState.barber.name,
                              )
                            : "Not selected yet"}
                        </span>
                      </div>
                      <div className="bg-stone-950/40 p-2 rounded-lg border border-stone-850/40">
                        <span className="block text-stone-500 uppercase text-[8px] font-mono font-bold mb-0.5">
                          <Translate
                            id="arrival_time"
                            fallback="Arrival Time"
                          />
                        </span>
                        <span className="font-semibold text-stone-300">
                          {bookingState.date && bookingState.time
                            ? `${bookingState.time}`
                            : "Not selected yet"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Actions Row */}
            <div className="flex items-center gap-2">
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="w-14 h-12 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Continue / Next Button */}
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={`flex-1 h-12 text-xs font-mono font-black uppercase tracking-widest rounded-xl flex items-center justify-center transition-all shadow-lg ${
                  isStepValid(currentStep)
                    ? "bg-amber-500 border border-amber-400 text-stone-950 shadow-amber-500/10 active:scale-95 cursor-pointer font-extrabold"
                    : "bg-stone-900 border border-stone-850 text-stone-600 select-none cursor-not-allowed"
                }`}
              >
                <span>
                  {currentStep === 3
                    ? t("btn_confirm_reservation", "Confirm Reservation")
                    : t("btn_continue_short", "Continue")}
                </span>
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Scroll-hint Floating Pill — appears when nav buttons are off-screen */}
        <AnimatePresence>
          {currentStep < 4 && !isConfirming && !isNavVisible && (
            <motion.button
              key="scroll-hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() =>
                navRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                })
              }
              className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center gap-2.5 px-5 py-2.5 bg-stone-900/95 border border-amber-500/40 rounded-full backdrop-blur-md shadow-[0_4px_24px_rgba(245,158,11,0.15)] cursor-pointer hover:border-amber-400/70 hover:shadow-[0_4px_32px_rgba(245,158,11,0.25)] transition-all"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Scroll to actions
              </span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mini Trust elements at footer */}
        {currentStep < 4 && (
          <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center ">
            <div className="p-4 bg-stone-900/20 border border-stone-800/40 rounded-xl flex flex-col items-center gap-1">
              <CalendarDays className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono uppercase font-bold text-stone-450">
                <Translate id="trust_flexible" fallback="Flexible dates" />
              </span>
              <span className="text-[10px] text-stone-500 font-light">
                <Translate
                  id="trust_flexible_desc"
                  fallback="Reschedule up to 1 hr before"
                />
              </span>
            </div>
            <div className="p-4 bg-stone-900/20 border border-stone-800/40 rounded-xl flex flex-col items-center gap-1">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono uppercase font-bold text-stone-450">
                <Translate
                  id="trust_certified"
                  fallback="Certified Craftsmanship"
                />
              </span>
              <span className="text-[10px] text-stone-500 font-light">
                <Translate
                  id="trust_certified_desc"
                  fallback="Verified luxury master barbers"
                />
              </span>
            </div>
            <div className="p-4 bg-stone-900/20 border border-stone-800/40 rounded-xl flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono uppercase font-bold text-stone-450">
                <Translate id="trust_swift" fallback="Swift Execution" />
              </span>
              <span className="text-[10px] text-stone-500 font-light">
                <Translate
                  id="trust_swift_desc"
                  fallback="Punctual appointment starts"
                />
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
