import { Service, Barber } from "../types";

export const SERVICES: Service[] = [
  {
    id: "sov-cut",
    name: "The Sovereign Cut",
    price: 50,
    duration: 40,
    description: "Signature tailor-made haircut, double hot lather shampoo wash, blow-dry finish, and sharp straight-razor neck clean.",
    category: "hair",
    icon: "Scissors"
  },
  {
    id: "buzz-fade",
    name: "Skin Fade & Edge",
    price: 40,
    duration: 30,
    description: "Ultra-precise skin-fade transition with personalized tapering and razor-sharp perimeter lining.",
    category: "hair",
    icon: "Sparkles"
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt & Steam",
    price: 40,
    duration: 30,
    description: "Detailed beard architectural sculpting, dynamic hot towel steam, premium sandalwood oil massage, and razor cheek lining.",
    category: "beard",
    icon: "Smile"
  },
  {
    id: "royal-shave",
    name: "Imperial Royal Shave",
    price: 60,
    duration: 45,
    description: "Double pass straight-razor shave, pre-shave essential oil, rich lather applied with warm badger brush, and custom face massage.",
    category: "shave",
    icon: "Zap"
  },
  {
    id: "gent-combo",
    name: "The Gentlemen's Choice",
    price: 85,
    duration: 70,
    description: "Our core combination: The Sovereign Cut meticulously paired with the Beard Sculpt & Steam. The gold standard package.",
    category: "combo",
    icon: "Crown"
  },
  {
    id: "royal-combo",
    name: "The Royal Treatment",
    price: 105,
    duration: 90,
    description: "The Ultimate Sovereign indulgence: The Sovereign Cut alongside the Imperial Royal Shave, topped with a relaxing scalp care ritual.",
    category: "combo",
    icon: "Gem"
  }
];

export const BARBERS: Barber[] = [
  {
    id: "any-barber",
    name: "Any Available Stylist",
    specialty: "Instant placement with first available master craftsman",
    rating: 4.9,
    reviewsCount: 384,
    avatarUrl: "bg-radial from-amber-600/30 to-amber-900/10 border-amber-500/40 text-amber-500",
    isAvailable: true
  },
  {
    id: "alex-vance",
    name: "Alexander Vance",
    specialty: "Classic Scissor Cuts & Fine Tapering",
    rating: 4.9,
    reviewsCount: 142,
    avatarUrl: "bg-indigo-950 text-indigo-400 border-indigo-500/30",
    isAvailable: true
  },
  {
    id: "marcus-sterling",
    name: "Marcus Sterling",
    specialty: "Precision Beard Architect & Razor Master",
    rating: 5.0,
    reviewsCount: 96,
    avatarUrl: "bg-emerald-950 text-emerald-400 border-emerald-500/30",
    isAvailable: true
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    specialty: "Modern Texturing, Layers & Color Design",
    rating: 4.8,
    reviewsCount: 110,
    avatarUrl: "bg-rose-950 text-rose-400 border-rose-500/30",
    isAvailable: true
  },
  {
    id: "julian-croft",
    name: "Julian Croft",
    specialty: "High Skin Fades & Sharp Urban Linups",
    rating: 4.7,
    reviewsCount: 81,
    avatarUrl: "bg-sky-950 text-sky-400 border-sky-500/30",
    isAvailable: true
  }
];

export const TIME_SLOTS = {
  morning: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM"],
  afternoon: ["12:00 PM", "01:00 PM", "01:45 PM", "02:30 PM", "03:15 PM", "04:00 PM"],
  evening: ["05:00 PM", "05:45 PM", "06:30 PM", "07:15 PM"]
};

// Return a deterministic list of unavailable slots to make the UI interactive
export function getUnavailableSlots(barberId: string, dateStr: string): string[] {
  // Simple deterministic generation so changing dates/barbers toggles status of slots logically
  const allSlots = [...TIME_SLOTS.morning, ...TIME_SLOTS.afternoon, ...TIME_SLOTS.evening];
  
  if (barberId === "any-barber") {
    // Almost always highly available
    return [allSlots[2], allSlots[8]];
  }
  
  const seed = (barberId.charCodeAt(0) + barberId.charCodeAt(barberId.length - 1) + new Date(dateStr).getDate()) % 10;
  
  if (seed === 0) {
    return [allSlots[0], allSlots[1], allSlots[5], allSlots[9]];
  } else if (seed === 1) {
    return [allSlots[2], allSlots[6], allSlots[7], allSlots[12]];
  } else if (seed % 2 === 0) {
    return [allSlots[1], allSlots[4], allSlots[8], allSlots[11]];
  } else {
    return [allSlots[3], allSlots[5], allSlots[7], allSlots[10]];
  }
}
