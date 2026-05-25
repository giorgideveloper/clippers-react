import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Barber, BarberStatus } from "../../types";
import { Star, Sparkles, Plus, UploadCloud, Check, Clock, User, Trash2, Camera, Calendar } from "lucide-react";
import { BottomSheet } from "../BottomSheet";

interface AdminBarbersProps {
  barbers: Barber[];
  onUpdateBarberStatus: (barberId: string, status: BarberStatus) => void;
  onAddBarber: (newBarber: { name: string; specialty: string; avatarUrl: string; shift?: string }) => void;
}

const SPECIALTY_OPTIONS = [
  "Signature Cuts",
  "Razor Fades",
  "Beard Grooming",
  "Beard Sculpting",
  "Hot Towel Shave",
  "Classic Scissor Cuts",
  "Texturizing & Styling",
  "Color Specialist"
];

const SHIFT_OPTIONS = [
  "Morning Shift (09:00 AM - 03:00 PM)",
  "Afternoon Shift (03:00 PM - 08:00 PM)",
  "Full-Day Shift (09:00 AM - 08:00 PM)"
];

const PRESET_AVATARS = [
  { id: "gold", class: "bg-gradient-to-tr from-amber-600 via-stone-900 to-amber-900 text-amber-100 border-amber-500/35", name: "Imperial Gold" },
  { id: "emerald", class: "bg-gradient-to-tr from-emerald-600 via-stone-900 to-emerald-950 text-emerald-100 border-emerald-500/25", name: "Malachite Jade" },
  { id: "ruby", class: "bg-gradient-to-tr from-rose-700 via-stone-950 to-red-950 text-rose-100 border-rose-500/25", name: "Sovereign Ruby" },
  { id: "navy", class: "bg-gradient-to-tr from-blue-700 via-stone-900 to-slate-950 text-blue-100 border-blue-500/25", name: "Royal Sapphire" },
  { id: "charcoal", class: "bg-gradient-to-tr from-stone-700 via-stone-900 to-stone-950 text-stone-100 border-stone-800", name: "Charcoal Onyx" }
];

export function AdminBarbers({ barbers, onUpdateBarberStatus, onAddBarber }: AdminBarbersProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [shiftHours, setShiftHours] = useState("Full-Day Shift (09:00 AM - 08:00 PM)");
  const [customAvatar, setCustomAvatar] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("gold");
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Specialties handler
  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Submit handler
  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Barber name is required.");
      return;
    }
    if (selectedSpecialties.length === 0) {
      setValidationError("Please select at least one specialty.");
      return;
    }
    setValidationError("");

    // Determine final avatar output
    let avatarUrl = "";
    if (customAvatar) {
      avatarUrl = customAvatar;
    } else {
      const preset = PRESET_AVATARS.find(p => p.id === selectedPreset);
      avatarUrl = preset ? preset.class : PRESET_AVATARS[0].class;
    }

    const specialtyStr = selectedSpecialties.join(" & ");

    // Trigger parent callback
    onAddBarber({
      name,
      specialty: specialtyStr,
      avatarUrl,
      shift: shiftHours
    });

    // Success Screen Micro-animation
    setShowSuccess(true);

    setTimeout(() => {
      // Auto close and reset
      setShowSuccess(false);
      setIsAddOpen(false);
      setName("");
      setSelectedSpecialties([]);
      setShiftHours("Full-Day Shift (09:00 AM - 08:00 PM)");
      setCustomAvatar("");
      setSelectedPreset("gold");
    }, 2200);
  };

  const getStatusColor = (status: BarberStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-500 text-emerald-400 border-emerald-400/20";
      case "break":
        return "bg-amber-500 text-amber-400 border-amber-400/20";
      case "off-duty":
        return "bg-stone-500 text-stone-500 border-stone-850";
      default:
        return "bg-emerald-500 text-emerald-400 border-emerald-400/20";
    }
  };

  const renderBarberAvatar = (barber: Barber) => {
    const url = barber.avatarUrl || "";
    const isImage = url.startsWith("data:") || url.includes("/") || url.includes("http");

    if (isImage) {
      return (
        <img
          src={url}
          alt={barber.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-stone-800"
          referrerPolicy="no-referrer"
        />
      );
    }

    const classVal = url || "bg-gradient-to-tr from-amber-600 via-stone-900 to-amber-900 text-amber-200 border-amber-500/20";
    return (
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border text-lg font-serif font-black ${classVal}`}>
        {barber.name.split(" ").map(n => n[0]).join("")}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
            Barber <span className="text-amber-400 font-semibold font-serif">Staff Management</span>
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            MANAGE SHIFT COVERAGE, ASSIGN MASTER WORKERS & REVIEWS
          </p>
        </div>

        {/* Add Barber Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 h-11 bg-amber-500 hover:bg-amber-450 border border-amber-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-550/10 cursor-pointer select-none transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Stylist
        </button>
      </div>

      {/* Grid of Stylists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barbers.map((barber) => {
          const currentStatus = barber.status || "active";
          const isAnyBarber = barber.id === "any-barber";
          // Fetch custom shift from local model/definition if any
          const barberShift = (barber as any).shift || "Full-Day Shift (09:00 AM - 08:00 PM)";

          return (
            <div
              key={barber.id}
              className={`p-5 rounded-2xl bg-[#141416]/90 border transition-all duration-300 relative overflow-hidden ${
                currentStatus === "off-duty"
                  ? "border-stone-900/60 opacity-60"
                  : "border-stone-850 hover:border-amber-500/20 shadow-xl"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                
                {/* Visual Avatar fallback representation */}
                <div className="flex-shrink-0 flex justify-center sm:block">
                  <div className="relative">
                    {renderBarberAvatar(barber)}
                    {/* Tiny blinking active circle dot */}
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-stone-850 z-10 ${
                      currentStatus === "active"
                        ? "bg-emerald-500"
                        : currentStatus === "break"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-stone-550"
                    }`} />
                  </div>
                </div>

                {/* Barber metadata */}
                <div className="flex-grow space-y-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-1.5 pb-1">
                    <h3 className="font-semibold text-stone-200 tracking-wide text-base">
                      {barber.name}
                    </h3>
                    
                    {/* Rating label */}
                    {!isAnyBarber && (
                      <div className="flex items-center justify-center sm:justify-start gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-mono font-black text-amber-400">
                          {barber.rating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          ({barber.reviewsCount})
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 leading-snug">
                    {barber.specialty}
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-1.5 font-mono text-[9px] text-stone-500">
                    <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-850 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" /> {barberShift}
                    </span>
                    <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
                      Standard Seat: Salon #{Math.floor(Math.random() * 5 + 1)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Status Switch Control Panel */}
              <div className="mt-5 pt-3.5 border-t border-stone-850/65 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block text-center sm:text-left">
                  Set Availability Status
                </span>

                {/* Tactile status trigger row */}
                <div className="flex items-center justify-center gap-1 bg-stone-950 p-1.5 rounded-xl border border-stone-900">
                  {(["active", "break", "off-duty"] as BarberStatus[]).map((st) => {
                    const isSelected = currentStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={() => onUpdateBarberStatus(barber.id, st)}
                        className={`px-3 py-1 text-[10px] font-mono tracking-wide font-medium uppercase rounded-lg transition-all ${
                          isSelected
                            ? st === "active"
                              ? "bg-emerald-500 text-stone-950 font-black"
                              : st === "break"
                              ? "bg-amber-500 text-stone-950 font-black"
                              : "bg-stone-800 text-stone-300 font-bold"
                            : "text-stone-500 hover:text-stone-300 hover:bg-stone-900/50"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Slide-Up Bottom Sheet for Adding New Barber */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => {
          if (!showSuccess) {
            setIsAddOpen(false);
            setValidationError("");
          }
        }}
        title="Add New Stylist Craftsman"
      >
        <div className="relative min-h-[500px]">
          {/* Main Form content */}
          <form onSubmit={handleSaveBarber} className="space-y-6 text-left pb-16">
            
            {/* Input Name field - large elegant styling with floating design fallback */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">
                Barber Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Alistair Cunningham"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError && e.target.value) setValidationError("");
                  }}
                  className="w-full h-14 pl-12 pr-4 bg-stone-950 border border-stone-850 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-amber-500 placeholder-stone-600 transition-colors"
                />
              </div>
            </div>

            {/* Shift hours selections */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">
                Working Shift / Hours
              </span>
              <div className="grid grid-cols-1 gap-2">
                {SHIFT_OPTIONS.map((opt) => {
                  const isSel = shiftHours === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setShiftHours(opt)}
                      className={`h-11 px-4 text-left rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                        isSel
                          ? "bg-amber-500/10 border-amber-400 text-amber-400 font-bold"
                          : "bg-stone-950 border-stone-900 text-stone-400 hover:border-stone-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className={`w-4.5 h-4.5 ${isSel ? "text-amber-500" : "text-stone-505"}`} /> {opt}
                      </span>
                      {isSel && <Check className="w-4 h-4 text-amber-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialties Badges Multi-select area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">
                  Select Specialties Badges
                </span>
                <span className="text-[10px] text-stone-550 font-mono">
                  {selectedSpecialties.length} selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {SPECIALTY_OPTIONS.map((spec) => {
                  const isSel = selectedSpecialties.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        toggleSpecialty(spec);
                        if (validationError) setValidationError("");
                      }}
                      className={`py-2 px-3 text-xs rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSel
                          ? "bg-amber-500 text-stone-950 font-bold border-amber-400"
                          : "bg-stone-950 hover:bg-stone-900 border-stone-850 hover:border-stone-800 text-stone-400"
                      }`}
                    >
                      {spec}
                      {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar Section - Upload or Preset Theme selection */}
            <div className="space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">
                Visual Avatar representation
              </span>

              {/* Flex block holding Drag upload vs presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Drag Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative h-36 ${
                    isDragging
                      ? "border-amber-504 bg-amber-500/5"
                      : customAvatar
                      ? "border-amber-500/40 bg-stone-950"
                      : "border-stone-850 bg-stone-950 hover:border-stone-800"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {customAvatar ? (
                    <div className="relative">
                      <img
                        src={customAvatar}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border border-amber-500/20"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomAvatar("");
                        }}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-stone-100 flex items-center justify-center shadow-lg"
                        title="Remove uploaded image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 flex flex-col items-center">
                      <div className="p-2 bg-stone-900 rounded-lg text-amber-500 border border-stone-850">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] text-stone-400 font-medium">
                        Drag photo or <span className="text-amber-400 underline">browse</span>
                      </p>
                      <p className="text-[8px] text-stone-600 font-mono uppercase">PNG, JPG, WEBP • Max 2MB</p>
                    </div>
                  )}
                </div>

                {/* Preset Monogram Selectors */}
                <div className="space-y-2.5 p-4 bg-stone-900/40 border border-stone-850 rounded-xl flex flex-col justify-center">
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    Or Pick Premium Monogram Color Theme
                  </span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_AVATARS.map((p) => {
                      const isSel = selectedPreset === p.id && !customAvatar;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(p.id);
                            setCustomAvatar("");
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-serif font-black relative border transition-transform ${p.class} ${
                            isSel ? "scale-110 shadow-lg ring-2 ring-amber-500/60" : "opacity-60 hover:opacity-100"
                          }`}
                          title={p.name}
                        >
                          {name ? name.split(" ").map(n => n[0]).join("").slice(0, 2) : "BC"}
                          {isSel && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-505 bg-amber-500 text-stone-950 flex items-center justify-center border border-stone-900 text-[8px] font-sans">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[8.5px] text-stone-550 leading-relaxed pt-0.5">
                    Generates a majestic initials crest using our signature royal typography styles.
                  </p>
                </div>

              </div>
            </div>

            {/* Input validation notice */}
            {validationError && (
              <p className="text-xs text-red-500 font-mono text-center pt-1">
                ⚠️ {validationError}
              </p>
            )}

            {/* Bottom Action Submits */}
            <div className="pt-4 border-t border-stone-900 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setValidationError("");
                }}
                className="w-full sm:flex-1 h-12 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-400 hover:text-stone-250 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 h-12 bg-amber-500 hover:bg-amber-450 border border-amber-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl shadow-lg shadow-amber-550/10 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                Enroll Craftsman
              </button>
            </div>

          </form>

          {/* Satisfying Barber Added successfully Micro-animation overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#121214] z-50 flex flex-col items-center justify-center p-6 text-center select-none rounded-[20px]"
              >
                {/* Golden Spinning Conic Circle mimicking high-end luxury clockwork */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-[-10px] rounded-full border-2 border-dashed border-amber-500/20"
                  />
                  
                  <motion.div
                    initial={{ scale: 0.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.35)]"
                  >
                    <Check className="w-10 h-10 text-stone-950 stroke-[3.5]" />
                  </motion.div>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 py-0.5 px-2 rounded-full font-bold">
                    System Registry OK
                  </span>
                  <h3 className="text-xl font-light text-stone-100 uppercase tracking-widest pt-1">
                    Craftsman <span className="font-serif italic font-medium text-amber-400">Added</span>
                  </h3>
                  <p className="text-xs text-stone-400 max-w-xs font-light pt-2 leading-relaxed">
                    Stylist <span className="text-stone-200 font-bold">{name}</span> has been enrolled. High tier booking slots initialized.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </BottomSheet>

    </div>
  );
}
