import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Service } from "../types";
import { SERVICES } from "../data/barberData";
import { Icon } from "./Icon";
import { Check, Info, ChevronDown, Sparkles } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Translate, useLanguage } from "../utils/LanguageContext";

interface ServiceSelectionProps {
  selectedService: Service | null;
  onSelect: (service: Service) => void;
  services?: Service[];
}

const CATEGORIES = [
  { id: "all", label: "All Offerings" },
  { id: "hair", label: "Haircuts" },
  { id: "beard", label: "Beard sculpting" },
  { id: "shave", label: "Imperial Shaves" },
  { id: "combo", label: "Exclusive Combos" }
];

// Rich, premium additional details for each service to populate the bottom sheet
const SERVICE_METADATA_EXT: Record<string, { steps: string[]; benefits: string[]; advice: string }> = {
  "sov-cut": {
    steps: ["Scalp thermal steaming", "Aromatherapy cleansing shampoo", "Precision custom shear scissoring", "Neck hot shave trim", "Finishing style wax"],
    benefits: ["Sovereign signature profile alignment", "Enhances natural head contours", "Scalp hydration and dandruff prevention"],
    advice: "Best styled with a light pomade or matte clay. Rebook every 3 to 4 weeks to retain perfect silhouette definition."
  },
  "buzz-fade": {
    steps: ["Consultation for clipper grade", "Dual clipper precision crop", "Tapered side burn blending", "Scalp exfoliating wash", "Balancing tonic splash"],
    benefits: ["Ultra low-maintenance", "Bold head and skull accentuation", "Keeps neck feeling light and fresh"],
    advice: "Requires minimal styling. Use sunscreen on scalp when outdoors. Ideal for guys seeking high elegance with minimal upkeep."
  },
  "beard-sculpt": {
    steps: ["Hot lavender beard compress", "Beard oil nourishing massage", "Comb and shear line definition", "Clipper length sculpting", "Cool hydration beard balm"],
    benefits: ["Lengthens or widens jaw aesthetics", "Eliminates wild coarse split ends", "Relieves dry under-beard itchiness"],
    advice: "Comb daily with a boar bristle brush. Apply premium cedar oil at night to sustain exquisite moisture."
  },
  "royal-shave": {
    steps: ["Dual-layer warm pre-shave cream", "Hot steam towel wrap", "Pure badger-bristle thick lathering", "Vintage straight razor close shave", "Alum block soothing spray"],
    benefits: ["Exfoliates top skin layers", "Extremely deep clean shave", "Prevents razor bumps and skin redness"],
    advice: "Wash your face with cold water for 12 hours after the session. Perfect for premium groomsmen or pre-gala prep."
  },
  "gent-combo": {
    steps: ["Premium haircut + royal straight razor shave", "Dual therapeutic thermal compresses", "Charcoal facial massage mask", "Rejuvenating ear and nose trim", "Chilled craft beverage service"],
    benefits: ["Complete executive aesthetic upgrade", "Unrivaled pure physical decompression", "Substantial multi-treatment value pricing"],
    advice: "Allow 75 minutes of uninterrupted rest. It is a full physical reset. Ideal prep for weddings, photo shoots, or major career milestones."
  },
  "royal-combo": {
    steps: ["Signature premium haircut + Imperial royal shaving cycle", "Scalp massage with natural custom botanicals", "Face and hand luxury moisturizer wrap", "Exquisite double-edge finish"],
    benefits: ["Absolute top tier styling", "Max relax experience", "Highly discounted bundled valuation"],
    advice: "Let our masters guide your style. The top visual configuration possible."
  }
};

export function ServiceSelection({ selectedService, onSelect, services = SERVICES }: ServiceSelectionProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSheetService, setActiveSheetService] = useState<Service | null>(null);

  const filteredServices = activeCategory === "all"
    ? services
    : services.filter(s => s.category === activeCategory);

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

  const toggleAccordion = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid selecting card when opening accordion
    setExpandedId(prev => (prev === id ? null : id));
  };

  const openDetailSheet = (e: React.MouseEvent, service: Service) => {
    e.stopPropagation(); // Avoid triggering card selection
    setActiveSheetService(service);
  };

  const matchedMetadata = activeSheetService ? SERVICE_METADATA_EXT[activeSheetService.id] : null;

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-light tracking-wide text-stone-100 uppercase">
          <Translate id="services_title_main" fallback="Select Haircut &" /> <span className="text-amber-400 font-semibold"><Translate id="services_title_accent" fallback="Treatment Packages" /></span>
        </h2>
        <p className="text-sm text-stone-400 font-light">
          <Translate id="services_subtitle" fallback="Choose from our carefully curated menu of luxury grooming treatments." />
        </p>
      </div>

      {/* Category Tabs: Swipeable on Mobile, Wrapped on Desktop */}
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max pb-2.5 pt-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`h-11 px-5 text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer select-none border ${
                  isActive
                    ? "bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/25"
                    : "bg-stone-900/40 text-stone-400 border-stone-850 hover:text-stone-200 hover:bg-stone-800/45"
                }`}
              >
                {t("cat_" + cat.id, cat.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid with 3D hover actions for desktop list dynamics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          const isExpanded = expandedId === service.id;

          return (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(service)}
              className={`relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer overflow-hidden select-none border-2 transition-all duration-305 ${
                isSelected
                  ? "bg-[#161619] border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.18)]"
                  : "bg-stone-900/45 hover:bg-stone-900/80 border-stone-850/90 hover:border-amber-500/30"
              }`}
            >
              {/* Corner Accent for selected */}
              {isSelected && (
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
              )}

              <div className="space-y-4">
                {/* Header Icon + Price */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    isSelected ? "bg-amber-500 text-stone-950" : "bg-stone-800/80 text-amber-400"
                  }`}>
                    <Icon name={service.icon} size={22} className="stroke-[1.85]" />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details Sheet Info Button - highly thumb clickable */}
                    <button
                      onClick={(e) => openDetailSheet(e, service)}
                      className="w-10 h-10 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 cursor-pointer active:scale-95 transition-transform"
                      title="View Detailed Ritual Information"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <div className="text-right">
                      <span className="block text-xl font-bold font-mono text-amber-400">
                        ${service.price}
                      </span>
                      <span className="block text-[10px] text-stone-400 font-mono tracking-tight uppercase">
                        {service.duration} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name & Short Description */}
                <div className="space-y-1.5 font-sans">
                  <h3 className={`font-semibold tracking-wide text-base ${
                    isSelected ? "text-amber-300" : "text-stone-100"
                  }`}>
                    {t("service_" + service.id + "_name", service.name)}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    {t("service_" + service.id + "_desc", service.description)}
                  </p>
                </div>

                {/* Inline Hardware-Accelerated Accordion */}
                <div className="pt-2 border-t border-stone-850/65 font-sans">
                  <button
                    onClick={(e) => toggleAccordion(e, service.id)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-stone-450 hover:text-stone-200 cursor-pointer py-1 font-mono"
                  >
                    <span>{t("ritual_outline_label", "Ritual Outline")}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: { type: "spring", stiffness: 150, damping: 20 }, opacity: { duration: 0.15 } }}
                        className="overflow-hidden"
                      >
                        <div className="py-2.5 space-y-1.5 max-w-full">
                          {SERVICE_METADATA_EXT[service.id]?.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-[11px] text-stone-400 font-light">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 flex-shrink-0" />
                              <span className="truncate">{step}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Selection Checkmark / Button Anchor */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                  {isSelected ? t("chair_reserved", "Chair Reserved") : t("select_experience", "Select Experience")}
                </span>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? "bg-amber-400 border-amber-400 text-stone-950 scale-110 shadow-md shadow-amber-400/20"
                    : "border-stone-700 text-transparent"
                }`}>
                  <Check size={13} className="stroke-[3]" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Services Compact list (Mobile Accordions) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:hidden flex-col gap-2.5"
      >
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          const isExpanded = expandedId === service.id;

          return (
            <motion.div
              key={`mob-serv-${service.id}`}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(service)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#161619] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.12)]"
                  : "bg-stone-900/40 hover:bg-stone-900/60 border-stone-850"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left Side: Icon & Title & Price details */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                    isSelected ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-amber-500"
                  }`}>
                    <Icon name={service.icon} size={15} className="stroke-[2]" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold tracking-wide text-xs ${
                      isSelected ? "text-amber-300" : "text-stone-200"
                    }`}>
                      {t("service_" + service.id + "_name", service.name)}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold font-mono text-amber-450">${service.price}</span>
                      <span className="text-[10px] text-stone-500 font-mono">• {service.duration} mins</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action & Expand Trigger */}
                <div className="flex items-center gap-1.5 font-sans">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(prev => (prev === service.id ? null : service.id));
                    }}
                    className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-850 flex items-center justify-center text-stone-400 hover:text-amber-400 cursor-pointer active:scale-90 transition-transform"
                    title="View Outline Steps"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-amber-400" : ""}`} />
                  </button>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected ? "bg-amber-400 border-amber-400 text-stone-950" : "border-stone-700"
                  }`}>
                    {isSelected && <Check size={11} className="stroke-[3.5]" />}
                  </div>
                </div>
              </div>

              {/* Accordion dropdown inline details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2.5 mt-2 border-t border-stone-850/60 text-left space-y-2">
                      <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                        {t("service_" + service.id + "_desc", service.description)}
                      </p>
                      
                      <div className="bg-stone-950/40 rounded-lg p-2 border border-stone-850/40 font-sans">
                        <span className="block text-[9px] font-mono uppercase font-bold text-stone-500 tracking-wider mb-1">
                          {t("ritual_outline_label", "Ritual Outline")}:
                        </span>
                        <div className="grid grid-cols-1 gap-1">
                          {SERVICE_METADATA_EXT[service.id]?.steps.slice(0, 3).map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-stone-500">
                              <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                              <span className="truncate">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailSheet(e, service);
                        }}
                        className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 py-0.5 select-none"
                      >
                        <Info className="w-3 h-3" /> {t("explore_details_label", "Explore full treatment details")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dynamic Detail Bottom Sheets instead of standard confirmation Dialogs */}
      <BottomSheet
        isOpen={activeSheetService !== null}
        onClose={() => setActiveSheetService(null)}
        title={activeSheetService ? `${t("service_" + activeSheetService.id + "_name", activeSheetService.name)} ${t("ritual", "Ritual")}` : ""}
      >
        {activeSheetService && matchedMetadata && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
              <div>
                <span className="block text-[10px] font-mono text-stone-500 uppercase tracking-widest">{t("pricing_rate", "Pricing Rate")}</span>
                <p className="text-2xl font-black text-amber-400 font-mono">${activeSheetService.price}</p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono text-stone-500 uppercase tracking-widest">{t("duration", "Duration")}</span>
                <p className="text-md font-bold text-stone-200 font-mono">{activeSheetService.duration} {t("minutes_suffix", "minutes")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t("ritual_steps_title", "The Imperial Treatment Steps")}
              </h4>
              <ul className="space-y-2 bg-stone-900/30 rounded-xl p-4 border border-stone-850">
                {matchedMetadata.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-400 font-light">
                    <span className="font-mono text-amber-550 font-bold min-w-4 font-mono">0{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-300">{t("key_benefits", "Key Benefits")}</h4>
              <div className="grid grid-cols-1 gap-1.5">
                {matchedMetadata.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2 text-xs text-stone-400">
                    <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-300">{t("styling_advice", "Styling Advice")}</h4>
              <p className="bg-[#18181b] p-3.5 rounded-xl border border-stone-850 font-serif italic text-xs leading-relaxed text-stone-450">
                "{matchedMetadata.advice}"
              </p>
            </div>

            {/* Select Experience CTA inside Comfortable Thumb-Zone at bottom of bottom-sheet */}
            <div className="pt-4 border-t border-stone-850">
              <button
                onClick={() => {
                  onSelect(activeSheetService);
                  setActiveSheetService(null);
                }}
                className="w-full h-12 bg-amber-500 hover:bg-amber-450 text-stone-950 font-bold font-mono text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer active:scale-[0.98] shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" /> {t("select_this_experience", "Select This Experience")}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
