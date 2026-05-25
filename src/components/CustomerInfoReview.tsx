import React from "react";
import { BookingState } from "../types";
import { Calendar, Clock, Scissors, UserCheck, Smartphone, Mail, FileText, BadgeDollarSign } from "lucide-react";

interface CustomerInfoReviewProps {
  bookingState: BookingState;
  onChangeInfo: (field: string, value: string) => void;
  errors: { name?: string; phone?: string; email?: string };
}

export function CustomerInfoReview({ bookingState, onChangeInfo, errors }: CustomerInfoReviewProps) {
  const { service, barber, date, time, customer } = bookingState;

  // Format Date gracefully (e.g., "Monday, May 25, 2026")
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-light tracking-wide text-stone-100 uppercase">
          Review & <span className="text-amber-400 font-semibold">Confirm</span>
        </h2>
        <p className="text-sm text-stone-400">
          Double-check your luxury treatment summary and provide your details to lock in your chair.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Customer Information (LHS) */}
        <div className="lg:col-span-7 bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-6 shadow-inner">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500/80 border-b border-stone-800 pb-2">
            Your Contact Credentials
          </h3>

          <div className="space-y-5">
            {/* Name Input */}
            <div className="relative group">
              <input
                type="text"
                id="customer-name"
                value={customer.name}
                onChange={(e) => onChangeInfo("name", e.target.value)}
                className={`peer w-full bg-stone-900/50 border-b-2 py-3 px-3 rounded-t-lg text-sm text-stone-200 placeholder-transparent focus:outline-none transition-colors duration-300 ${
                  errors.name
                    ? "border-red-500/50 bg-red-950/5 focus:border-red-400"
                    : "border-stone-800 focus:border-amber-500"
                }`}
                placeholder="Full Name"
              />
              <label
                htmlFor="customer-name"
                className="absolute left-3 top-3.5 text-stone-500 text-xs tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-stone-400 peer-focus:text-[10px] peer-focus:top-1 peer-focus:text-amber-400 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-amber-400"
              >
                Full Name *
              </label>
              {errors.name && (
                <p className="text-[10px] uppercase font-bold tracking-wider text-red-500 mt-1 pl-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <input
                type="tel"
                id="customer-phone"
                value={customer.phone}
                onChange={(e) => onChangeInfo("phone", e.target.value)}
                className={`peer w-full bg-stone-900/50 border-b-2 py-3 px-3 rounded-t-lg text-sm text-stone-200 placeholder-transparent focus:outline-none transition-colors duration-300 ${
                  errors.phone
                    ? "border-red-500/50 bg-red-950/5 focus:border-red-400"
                    : "border-stone-800 focus:border-amber-500"
                }`}
                placeholder="Phone Number"
              />
              <label
                htmlFor="customer-phone"
                className="absolute left-3 top-3.5 text-stone-500 text-xs tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-stone-400 peer-focus:text-[10px] peer-focus:top-1 peer-focus:text-amber-400 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-amber-400"
              >
                Phone Number *
              </label>
              {errors.phone && (
                <p className="text-[10px] uppercase font-bold tracking-wider text-red-500 mt-1 pl-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                id="customer-email"
                value={customer.email}
                onChange={(e) => onChangeInfo("email", e.target.value)}
                className={`peer w-full bg-stone-900/50 border-b-2 py-3 px-3 rounded-t-lg text-sm text-stone-200 placeholder-transparent focus:outline-none transition-colors duration-300 ${
                  errors.email
                    ? "border-red-500/50 bg-red-950/5 focus:border-red-400"
                    : "border-stone-800 focus:border-amber-500"
                }`}
                placeholder="Email Address"
              />
              <label
                htmlFor="customer-email"
                className="absolute left-3 top-3.5 text-stone-500 text-xs tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-stone-400 peer-focus:text-[10px] peer-focus:top-1 peer-focus:text-amber-400 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-amber-400"
              >
                Email Address *
              </label>
              {errors.email && (
                <p className="text-[10px] uppercase font-bold tracking-wider text-red-500 mt-1 pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Notes Textarea */}
            <div className="relative group">
              <textarea
                id="customer-notes"
                value={customer.notes}
                onChange={(e) => onChangeInfo("notes", e.target.value)}
                rows={3}
                className="peer w-full bg-stone-900/50 border-b-2 border-stone-800 focus:border-amber-500 py-3 px-3 rounded-t-lg text-sm text-stone-200 placeholder-transparent focus:outline-none resize-none transition-colors duration-300"
                placeholder="Special Grooming Instructions"
              />
              <label
                htmlFor="customer-notes"
                className="absolute left-3 top-3.5 text-stone-500 text-xs tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-stone-400 peer-focus:text-[10px] peer-focus:top-1 peer-focus:text-amber-400 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-amber-400"
              >
                Any Special Customization / Notes
              </label>
            </div>
          </div>
        </div>

        {/* Golden Ticket Receipt Sidebar (RHS) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/20 rounded-2xl relative overflow-hidden shadow-2xl">
          
          {/* Subtle gold ticket tear effects on background */}
          <div className="absolute right-0 top-1/2 -mr-3 w-6 h-6 rounded-full bg-stone-950/90 z-2" />
          <div className="absolute left-0 top-1/2 -ml-3 w-6 h-6 rounded-full bg-stone-950/90 z-2" />
          
          <div className="space-y-4">
            {/* Ticket Header */}
            <div className="text-center border-b border-dashed border-stone-800 pb-4">
              <h4 className="text-[10px] font-mono tracking-widest font-black uppercase text-amber-500">
                Sovereign Barbershop
              </h4>
              <p className="text-[11px] text-stone-500 tracking-wide font-mono mt-1">
                MEMBERSHIP CHAIR TICKET
              </p>
            </div>

            {/* Ticket Slots */}
            <div className="space-y-3.5 pt-2">
              {/* Selected Service */}
              {service && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 mt-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/10">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      Service Package
                    </span>
                    <span className="block text-sm font-semibold text-stone-200">
                      {service.name}
                    </span>
                    <span className="block text-xs text-stone-400 font-mono">
                      {service.duration} Mins
                    </span>
                  </div>
                </div>
              )}

              {/* Selected Barber */}
              {barber && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 mt-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/10">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      Assigned Craftsman
                    </span>
                    <span className="block text-sm font-semibold text-stone-200">
                      {barber.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Selected Date & Time */}
              {date && time && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 mt-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/10">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      Scheduled Schedule
                    </span>
                    <span className="block text-xs font-semibold text-stone-200 leading-normal">
                      {formattedDate}
                    </span>
                    <span className="block text-xs font-semibold text-amber-500 font-mono mt-0.5 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {time}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Total Footer */}
          <div className="mt-8 border-t border-dashed border-stone-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Valuation Total
                </span>
                <span className="block text-xs text-stone-400 font-light mt-0.5">
                  Tax & cleanups included
                </span>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold font-mono text-amber-400">
                  ${service?.price || 0}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
