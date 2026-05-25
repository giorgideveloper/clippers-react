import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, LANGUAGES, LanguageCode, LanguageOption } from "../utils/LanguageContext";
import { ChevronDown, Globe, Check } from "lucide-react";
import { BottomSheet } from "./BottomSheet";

interface LanguageSwitcherProps {
  className?: string;
  horizontal?: boolean; // If true, renders inline segment pills instead of dropdown
}

export function LanguageSwitcher({ className = "", horizontal = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsDropdownOpen(false);
    setIsMobileSheetOpen(false);
  };

  // 1. HORIZONTAL SEGMENT CONTROL MODE (Perfect for sidebar embedding or inside mobile hambuger menu)
  if (horizontal) {
    return (
      <div className={`space-y-2 text-left ${className}`}>
        <span className="block text-[9px] font-mono uppercase tracking-widest text-[#d4af37]/80 font-bold">
          {t("language_selection", "Select Language")}
        </span>
        <div className="relative flex p-1 bg-stone-950/80 rounded-xl border border-stone-850/80">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`relative flex-1 py-2 text-center text-xs font-mono font-bold tracking-wide rounded-lg transition-colors z-10 flex items-center justify-center gap-1.5 cursor-pointer uppercase select-none ${
                  isSelected ? "text-stone-950 font-black" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeLangSegTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg -z-10 shadow-md shadow-amber-400/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{lang.flag}</span>
                <span>{lang.code}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. STANDARD HYBRID RESPONSIVE SWITCHER (Dropdown on Desktop, BottomSheet on Mobile)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => {
          // On mobile, trigger BottomSheet, on desktop trigger dropdown
          if (window.innerWidth < 768) {
            setIsMobileSheetOpen(true);
          } else {
            setIsDropdownOpen(!isDropdownOpen);
          }
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-900/90 hover:bg-stone-850/90 border border-stone-800 hover:border-amber-500/40 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer active:scale-95 group text-stone-200"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center text-xs select-none">
          {currentLang.flag}
        </div>
        <span className="font-bold text-stone-300 group-hover:text-amber-400 transition-colors uppercase">
          {currentLang.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {/* DESKTOP DROPDOWN WITH BACKDROP BLUR (Glassmorphism) */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2.5 w-44 bg-stone-900/95 border border-stone-800/90 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Thread accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            
            <div className="p-1 px-1.5 py-1.5 space-y-1">
              <span className="block text-[8px] font-mono text-stone-550 uppercase tracking-widest pl-3 pb-1 pt-0.5">
                {t("language", "Language")}
              </span>
              
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                        : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/40 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm select-none">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE COMPACT BOTTOM SHEET */}
      <BottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        title={t("language_selection", "Select Language")}
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-400 text-left">
            Choose your preferred digital lounge dialect for the Sovereign experience.
          </p>

          <div className="space-y-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={`sheet-${lang.code}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#141416] border-amber-500 text-stone-100"
                      : "bg-stone-900/60 border-stone-850 hover:border-stone-800 text-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center text-lg shadow-inner select-none">
                      {lang.flag}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{lang.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono uppercase">{lang.code}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                      <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3.5]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-800" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsMobileSheetOpen(false)}
              className="w-full h-12 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-400 rounded-xl text-xs font-mono uppercase tracking-widest cursor-pointer"
            >
              {t("btn_back", "Back")}
            </button>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}

// 3. STATIC HIGH-CONTRAST COMPACT SLIDING BUTTON BAR FOR VERTICAL MENUS
export function LanguageSegmentControl({ className = "" }: { className?: string }) {
  return <LanguageSwitcher horizontal={true} className={className} />;
}
