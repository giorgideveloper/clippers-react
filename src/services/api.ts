import axios, { AxiosInstance } from "axios";
import { Barber, Service } from "../types";
import { LanguageCode } from "../utils/LanguageContext";

// Use a relative path so the Vite dev proxy handles CORS in development,
// and the request hits the same origin when deployed on theclippers.ge.
const BASE_URL = "/booking";

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 12_000,
  withCredentials: true,
});

// Fetch CSRF once and attach to every mutating request automatically
let csrfPromise: Promise<string> | null = null;

const getOrFetchCsrf = (): Promise<string> => {
  if (!csrfPromise) {
    csrfPromise = client
      .get<{ csrfToken: string }>("/get-csrf-token/")
      .then((r) => r.data.csrfToken)
      .catch(() => "");
  }
  return csrfPromise;
};

client.interceptors.request.use(async (config) => {
  const method = (config.method ?? "get").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const csrf = await getOrFetchCsrf();
    if (csrf) {
      config.headers.set("X-CSRFToken", csrf);
    }
  }
  return config;
});

// ─── Raw API Response Shapes (Django REST Framework paginated) ──────────────

interface DRFPage<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// GET /barbery/
export interface ApiBarber {
  id: number;
  name: string;           // fallback name field
  barber_name?: string;   // Georgian
  barber_name_ru?: string;
  barber_name_eng?: string;
  image?: string;
  is_available?: boolean;
}

// GET /services/ /services-ru/ /services-eng/
export interface ApiService {
  id: number;
  service_name: string;
  category_type: string; // "1"=hair "2"=beard "3"=other
  price?: string | number;
  duration?: number;
  description?: string;
}

// GET /time/
export interface ApiWorkingHour {
  id: number;
  time: string; // "HH:MM:SS"
}

// GET /booking-times/?date=...&barbery=...
export interface ApiBookedSlot {
  id?: number;
  time_for_booking: string; // "HH:MM:SS"
}

export interface ApiBookingPayload {
  barbery: number | string;
  service: number | string;
  date: string;           // YYYY-MM-DD
  time: number | string;  // working hour ID
  customer_name: string;
  customer_phone: string;
  message?: string;
  sms_code?: string;
  created_at?: string;    // ISO datetime, required by the API
}

export interface ApiBookingResponse {
  id: number;
  status?: string;
  [key: string]: unknown;
}

// ─── Data Mappers ─────────────────────────────────────────────────────────────

const AVATAR_POOL = [
  "bg-indigo-950 text-indigo-400 border-indigo-500/30",
  "bg-emerald-950 text-emerald-400 border-emerald-500/30",
  "bg-rose-950 text-rose-400 border-rose-500/30",
  "bg-sky-950 text-sky-400 border-sky-500/30",
  "bg-violet-950 text-violet-400 border-violet-500/30",
  "bg-amber-950 text-amber-400 border-amber-500/30",
];

export function mapApiBarber(raw: ApiBarber, index: number): Barber {
  return {
    id: String(raw.id),
    // Use whichever name field the endpoint returns
    name: raw.barber_name ?? raw.name ?? `Barber ${raw.id}`,
    specialty: "Master Barber",
    rating: 5.0,
    reviewsCount: 0,
    avatarUrl: AVATAR_POOL[index % AVATAR_POOL.length],
    isAvailable: raw.is_available !== false,
    status: raw.is_available !== false ? "active" : "off-duty",
  };
}

const CATEGORY_MAP: Record<string, Service["category"]> = {
  "1": "hair",
  "2": "beard",
  "3": "combo", // "other"/general maps to combo as closest
};

export function mapApiService(raw: ApiService): Service {
  return {
    id: String(raw.id),
    name: raw.service_name,
    price: typeof raw.price === "string" ? parseFloat(raw.price) || 0 : (raw.price ?? 0),
    duration: raw.duration ?? 30,
    description: raw.description ?? "",
    category: CATEGORY_MAP[raw.category_type] ?? "hair",
    icon: "Scissors",
  };
}

// Convert "HH:MM:SS" → "09:00 AM" display string
export function formatHourDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function getHourPeriod(time: string): "morning" | "afternoon" | "evening" {
  const h = parseInt(time.split(":")[0], 10);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export interface WorkingHourSlot {
  id: number;
  rawTime: string;   // "09:00:00"
  display: string;   // "09:00 AM"
  period: "morning" | "afternoon" | "evening";
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const fetchBarbers = async (): Promise<Barber[]> => {
  const res = await client.get<DRFPage<ApiBarber>>("/barbery/");
  return res.data.results.map((b, i) => mapApiBarber(b, i));
};

export const fetchBarberById = async (id: string): Promise<Barber> => {
  const res = await client.get<ApiBarber>(`/barbery/${id}`);
  return mapApiBarber(res.data, 0);
};

export const fetchServices = async (language: LanguageCode): Promise<Service[]> => {
  const endpoint =
    language === "RU"
      ? "/services-ru/"
      : language === "EN"
      ? "/services-eng/"
      : "/services/";
  const res = await client.get<DRFPage<ApiService>>(endpoint);
  return res.data.results.map(mapApiService);
};

export const fetchWorkingHours = async (): Promise<WorkingHourSlot[]> => {
  const res = await client.get<DRFPage<ApiWorkingHour>>("/time/");
  return res.data.results.map((h) => ({
    id: h.id,
    rawTime: h.time,
    display: formatHourDisplay(h.time),
    period: getHourPeriod(h.time),
  }));
};

export const fetchBookingTimes = async (
  date: string,
  barberId: string,
  signal?: AbortSignal
): Promise<string[]> => {
  // Returns already-BOOKED raw time strings ("HH:MM:SS") for the given date + barber
  const res = await client.get<DRFPage<ApiBookedSlot>>(
    `/booking-times/?date=${date}&barbery=${barberId}`,
    { signal }
  );
  return res.data.results.map((s) => s.time_for_booking);
};

export const sendSmsCode = async (mobile: string): Promise<void> => {
  await client.post("/bookings/sms_code/", { mobile_number: mobile });
};

export const createBooking = async (
  payload: ApiBookingPayload
): Promise<ApiBookingResponse> => {
  const res = await client.post<ApiBookingResponse>("/bookings/create/", payload);
  return res.data;
};

export const createBarberBooking = async (
  payload: ApiBookingPayload,
  csrf?: string
): Promise<ApiBookingResponse> => {
  const res = await client.post<ApiBookingResponse>(
    "/bookings/create/barber/",
    payload
  );
  return res.data;
};

export const fetchAllBookings = async () => {
  const res = await client.get("/bookings/");
  return res.data;
};

export const fetchBookingById = async (id: string) => {
  const res = await client.get(`/bookings/${id}`);
  return res.data;
};

export const updateBooking = async (
  id: string,
  data: unknown,
  csrf?: string
) => {
  const res = await client.put(`/bookings/${id}`, data);
  return res.data;
};

export const deleteBooking = async (id: string, csrf?: string): Promise<void> => {
  await client.delete(`/bookings/${id}`);
};
