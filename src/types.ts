export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
  category: "hair" | "shave" | "beard" | "combo";
  icon: string; // Lucide icon name
}

export type BarberStatus = "active" | "break" | "off-duty";

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  avatarUrl: string; // fallback or unique stylized color theme
  isAvailable: boolean; // boolean compatibility
  status?: BarberStatus; // expanded state
}

export interface BookingState {
  service: Service | null;
  barber: Barber | null;
  date: string | null; // YYYY-MM-DD
  time: string | null; // e.g., "10:30 AM"
  customer: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  service: Service;
  barber: Barber;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:30 AM"
  customer: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  status: BookingStatus;
  createdAt: string;
}

