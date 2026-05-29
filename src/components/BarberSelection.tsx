import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Barber } from "../types";
import { BARBERS } from "../data/barberData";
import { Star, ShieldAlert, Sparkles, User, Scissors, Info, Award, ShieldCheck, HelpCircle } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Translate, useLanguage } from "../utils/LanguageContext";

interface BarberSelectionProps {
  selectedBarber: Barber | null;
  onSelect: (barber: Barber) => void;
  barbers?: Barber[];
}

const BARBER_METADATA_EXT: Record<string, { bio: string; motto: string; signatureService: string; tools: string[]; achievements: string[] }> = {
  "any-barber": {
    bio: "Pristine alignment with whichever certified master craftsman has the swiftest queue opening. Best option for quick walk-ins or immediate styling slots.",
    motto: "Maximum efficiency without compromising a single strand of Royal Grooming standards.",
    signatureService: "All classic haircuts & rapid premium cleanups",
    tools: ["Gold barber taper clippers", "Dual straight razors", "Fine titanium scissor shear pairings"],
    achievements: ["Sovereign Punctuality Laurel", "Top Client Comfort Gold Star"]
  },
  "alex-vance": {
    bio: "Alex is an internationally trained master craftsman with over 11 years of experience in London and Milan. Specializing in high-fashion contours, classic scissor fades, and tailored modern profiles.",
    motto: "Precision is not mechanical. It is the architectural alignment of individual character.",
    signatureService: "Imperial Scissor Cuts & High-Fashion Contours",
    tools: ["Serrated titanium shearing tools", "Sterling vintage cutthroats", "Natural oil balms"],
    achievements: ["Metropolitan Stylist Champion 2024", "Master Craftsman License Certification"]
  },
  "marcus-sterling": {
    bio: "Marcus has crafted his legendary reputation around extreme line work and luxury beard sculpts. Famous for executing razor-sharp skin-fades and bearded jawline masterpieces.",
    motto: "Every jawline has the capacity for authority. My blades merely bring it out.",
    signatureService: "Sovereign Beard Sculpting & Razor Sharp Skin Fades",
    tools: ["High-torque custom detail clippers", "Authentic wooden cutthroat razor", "Rosewood beard combs"],
    achievements: ["National Barbering Cup Winner 2023", "Grooming Council Lifetime Elite Member"]
  },
  "elena-rostova": {
    bio: "Elena combines luxury hot towel therapies with unparalleled imperial razor glides. She is our lead specialist in premium straight razor therapies, facial refreshment, and bespoke combination rituals.",
    motto: "The royal shave is not a chore. It is a deeply restorative luxury meditation.",
    signatureService: "Imperial Shaves, Hot-Towel Massages & Combination Rituals",
    tools: ["Badger hair leather foam brushes", "Vapo thermal facial steamers", "Cold steel facial rollers"],
    achievements: ["Elite Thermal Shave Innovator Award 2024", "Spa Therapy Master Guild Member"]
  },
  "julian-croft": {
    bio: "Julian is known for his highly modern, sleek fades, texture styling, and youthful urban contours. Highly popular for textured pompadours, quiffs, and premium tapers.",
    motto: "Style never stops moving. Stay adaptive, crisp, and preserve your texture.",
    signatureService: "Textured Crop Fades, High Tapers & Street Styling",
    tools: ["Cordless magnetic motor clippers", "Texture razors", "Matte finishing clay formulas"],
    achievements: ["Top 30 Under 30 Global Groomers Winner", "Urban Street-Styling Laureate"]
  }
};

export function BarberSelection({ selectedBarber, onSelect, barbers = BARBERS }: BarberSelectionProps) {
  const { t } = useLanguage();
  const [activeSheetBarber, setActiveSheetBarber] = useState<Barber | null>(null);

  // Filter out completely off-duty barber staff
  const visibleBarbers = React.useMemo(() => {
    return barbers.filter(b => b.status !== "off-duty");
  }, [barbers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
  };

  // Helper code to render modern, handcrafted barber avatars
  const renderAvatar = (barberId: string, avatarClass: string) => {
    switch (barberId) {
      case "any-barber":
        return (
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 bg-stone-900 border-amber-500/30`}>
            <Sparkles className="w-8 h-8 animate-pulse text-amber-400" />
            <div className="absolute inset-x-0 bottom-0 top-0 rounded-full bg-amber-550/5 animate-ping -z-10" />
          </div>
        );
      case "alex-vance":
        return (
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border bg-stone-900 border-indigo-500/20`}>
            <span className="text-xl font-serif font-bold text-indigo-350">AV</span>
            <Scissors className="absolute -bottom-1 -right-1 w-6 h-6 p-1 rounded-full bg-indigo-900 border border-indigo-400 text-indigo-300" />
          </div>
        );
      case "marcus-sterling":
        return (
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border bg-stone-900 border-emerald-500/20`}>
            <span className="text-xl font-serif font-bold text-emerald-350">MS</span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-300 flex items-center justify-center">
              <span className="text-[10px] font-bold">R</span>
            </div>
          </div>
        );
      case "elena-rostova":
        return (
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border bg-stone-900 border-rose-500/20`}>
            <span className="text-xl font-serif font-bold text-rose-350">ER</span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-900 border border-rose-400 text-rose-300 flex items-center justify-center">
              <span className="text-[10px] font-bold">C</span>
            </div>
          </div>
        );
      case "julian-croft":
        return (
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border bg-stone-900 border-sky-500/20`}>
            <span className="text-xl font-serif font-bold text-sky-350">JC</span>
            <User className="absolute -bottom-1 -right-1 w-6 h-6 p-1 rounded-full bg-sky-900 border border-sky-400 text-sky-300" />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 rounded-full bg-stone-850 flex items-center justify-center border border-stone-700">
            <User className="w-8 h-8 text-stone-500" />
          </div>
        );
    }
  };

  const openBarberSheet = (e: React.MouseEvent, barber: Barber) => {
    e.stopPropagation();
    setActiveSheetBarber(barber);
  };

  const currentSheetData = activeSheetBarber ? BARBER_METADATA_EXT[activeSheetBarber.id] : null;

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-light tracking-wide text-stone-100 uppercase">
          <Translate id="barbers_title_main" fallback="Choose Your" /> <span className="text-amber-400 font-semibold"><Translate id="barbers_title_accent" fallback="Stylist" /></span>
        </h2>
        <p className="text-sm text-stone-400 font-light">
          <Translate id="barbers_subtitle" fallback="Our team is composed of certified master barbers. Choose your preferred expert." />
        </p>
      </div>

      {/* Barbers Scroll/Grid Container (Desktop/Tablet) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {visibleBarbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          const isAnyBarber = barber.id === "any-barber";
          const isOnBreak = barber.status === "break";

          return (
            <motion.div
              key={barber.id}
              variants={itemVariants}
              whileTap={isOnBreak ? {} : { scale: 0.97 }}
              onClick={() => {
                if (!isOnBreak) {
                  onSelect(barber);
                }
              }}
              className={`relative flex flex-col md:flex-row items-center gap-5 p-5 rounded-2xl select-none transition-all duration-300 border-2 ${
                isOnBreak
                  ? "bg-stone-900/10 border-stone-900/40 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#161619] border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.18)] cursor-pointer"
                  : "bg-stone-900/45 hover:bg-stone-900/80 border-stone-850/90 hover:border-amber-500/30 cursor-pointer"
              }`}
            >
              {/* Highlight Badge for Any Available / On Break */}
              {isOnBreak ? (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-amber-550/20 border border-amber-500/25 text-amber-500 font-sans text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-md z-1">
                  {t("status_break", "On Break")}
                </span>
              ) : isAnyBarber ? (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-amber-500 text-stone-950 font-sans text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-md z-1">
                  {t("popular_fast", "Popular & Fast")}
                </span>
              ) : null}

              {/* Avatar section */}
              <div className="flex-shrink-0">
                {renderAvatar(barber.id, barber.avatarUrl)}
              </div>

              {/* Text info */}
              <div className="flex-grow text-center md:text-left space-y-1.5 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center md:justify-start">
                    <h3 className={`font-semibold tracking-wide text-base ${
                      isSelected ? "text-amber-300" : "text-stone-200"
                    }`}>
                      {t("barber_" + barber.id + "_name", barber.name)}
                    </h3>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {barber.rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        ({barber.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* High touch-target info button to open custom portfolio/biography */}
                  <button
                    onClick={(e) => openBarberSheet(e, barber)}
                    className="w-9 h-9 mx-auto md:mx-0 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 active:scale-90 transition-transform cursor-pointer"
                    title="View Bio, Motto & Tools"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {t("barber_" + barber.id + "_specialty", barber.specialty)}
                </p>

                {/* Micro-Feedback Selected Tag */}
                {isSelected && (
                  <span className="inline-block px-2.5 py-0.5 bg-amber-550/15 border border-amber-400/30 text-[10px] font-mono text-amber-400 uppercase tracking-widest rounded-md mt-1">
                    {t("selected_craftsman", "Selected Craftsman")}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Barbers Scroll/Grid Container (Mobile Snap Carousel) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex sm:hidden overflow-x-auto overflow-y-hidden gap-4 pb-4 px-1 scrollbar-none snap-x snap-mandatory -mx-4 px-4"
      >
        {visibleBarbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          const isAnyBarber = barber.id === "any-barber";
          const isOnBreak = barber.status === "break";

          return (
            <motion.div
              key={`mob-${barber.id}`}
              variants={itemVariants}
              whileTap={isOnBreak ? {} : { scale: 0.97 }}
              onClick={() => {
                if (!isOnBreak) {
                  onSelect(barber);
                }
              }}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl select-none transition-all duration-300 border-2 w-[82%] flex-shrink-0 snap-center ${
                isOnBreak
                  ? "bg-stone-900/10 border-stone-900/40 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#161619] border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.18)] cursor-pointer"
                  : "bg-stone-900/45 hover:bg-stone-900/80 border-stone-850/90 hover:border-amber-500/30 cursor-pointer"
              }`}
            >
              {/* Highlight Badge for Any Available / On Break */}
              {isOnBreak ? (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-amber-550/20 border border-amber-500/25 text-amber-500 font-sans text-[9px] font-extrabold tracking-widest uppercase rounded-full shadow-md z-1">
                  {t("status_break", "On Break")}
                </span>
              ) : isAnyBarber ? (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-amber-500 text-stone-950 font-sans text-[9px] font-extrabold tracking-widest uppercase rounded-full shadow-md z-1">
                  {t("popular_fast", "Popular & Fast")}
                </span>
              ) : null}

              {/* Avatar section */}
              <div className="flex-shrink-0">
                {renderAvatar(barber.id, barber.avatarUrl)}
              </div>

              {/* Text info */}
              <div className="flex-grow text-center space-y-1 w-full font-sans">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <h3 className={`font-semibold tracking-wide text-sm ${
                    isSelected ? "text-amber-300" : "text-stone-200"
                  }`}>
                    {t("barber_" + barber.id + "_name", barber.name)}
                  </h3>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {barber.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      ({barber.reviewsCount})
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 font-light leading-snug truncate max-w-full">
                  {t("barber_" + barber.id + "_specialty", barber.specialty)}
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={(e) => openBarberSheet(e, barber)}
                    className="px-3 py-1 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-lg flex items-center justify-center text-[10px] font-mono tracking-wide text-stone-400 hover:text-amber-400 cursor-pointer active:scale-95 gap-1.5"
                    title="View Bio & Tools"
                  >
                    <Info className="w-3 h-3 text-amber-500" /> {t("info", "Info")}
                  </button>

                  {/* Micro-Feedback Selected Tag */}
                  {isSelected && (
                    <span className="inline-block px-2 py-0.5 bg-amber-500/15 border border-amber-400/30 text-[9px] font-mono text-amber-400 uppercase tracking-widest rounded-md">
                      {t("selected", "Selected")}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dynamic Drawer Sheet for Stylists details */}
      <BottomSheet
        isOpen={activeSheetBarber !== null}
        onClose={() => setActiveSheetBarber(null)}
        title={activeSheetBarber ? `${t("stylist", "Stylist")}: ${t("barber_" + activeSheetBarber.id + "_name", activeSheetBarber.name)}` : ""}
      >
        {activeSheetBarber && currentSheetData && (
          <div className="space-y-6 text-stone-300 font-sans">
            <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
              <div className="w-16 h-16 rounded-full border border-stone-700 bg-stone-950 flex items-center justify-center text-amber-400 text-xl font-bold font-serif">
                {activeSheetBarber.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-250 text-md">{t("barber_" + activeSheetBarber.id + "_name", activeSheetBarber.name)}</h4>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-mono font-bold text-amber-400">{activeSheetBarber.rating.toFixed(1)} {t("rating_label", "Rating")}</span>
                  <span className="text-xs text-stone-500">({activeSheetBarber.reviewsCount} {t("reviews_count", "verified reviews")})</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-450">{t("creative_motto", "Creative Motto")}</h5>
              <p className="font-serif italic text-xs leading-relaxed text-stone-400 bg-stone-900/30 p-3.5 rounded-xl border border-stone-850">
                "{currentSheetData.motto}"
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-450">{t("biography_background", "Biography & Background")}</h5>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {currentSheetData.bio}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-450">{t("crafting_tools", "Crafting Tools of Selection")}</h5>
              <div className="flex flex-wrap gap-1.5">
                {currentSheetData.tools.map((tool, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 bg-stone-900 border border-stone-850 rounded-full text-[10px] font-mono text-stone-400">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-450 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {t("accreditations", "Accreditations")}
              </h5>
              <div className="space-y-1.5">
                {currentSheetData.achievements.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-2 text-xs text-stone-450">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-850">
              <button
                onClick={() => {
                  onSelect(activeSheetBarber);
                  setActiveSheetBarber(null);
                }}
                className="w-full h-12 bg-amber-500 hover:bg-amber-450 text-stone-950 font-bold font-mono text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer active:scale-[0.98] shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                {t("request_master_barber", "Request This Master Barber")}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
