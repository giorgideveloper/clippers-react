import { Booking, Barber, Service } from "../types";
import { BARBERS, SERVICES } from "../data/barberData";
import { getInitialBookings } from "../data/mockBookings";

const KEY_BOOKINGS = "sov_barber_bookings";
const KEY_BARBERS = "sov_barber_staff";
const KEY_SERVICES = "sov_barber_catalog";

export function loadBookings(): Booking[] {
  try {
    const data = localStorage.getItem(KEY_BOOKINGS);
    if (!data) {
      const initial = getInitialBookings();
      saveBookings(initial);
      return initial;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load bookings, using mock defaults", e);
    return getInitialBookings();
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error("Failed to save bookings to localStorage", e);
  }
}

export function loadBarbers(): Barber[] {
  try {
    const data = localStorage.getItem(KEY_BARBERS);
    if (!data) {
      // Intialize with standard mock staff
      saveBarbers(BARBERS);
      return BARBERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load barbers, using defaults", e);
    return BARBERS;
  }
}

export function saveBarbers(barbers: Barber[]): void {
  try {
    localStorage.setItem(KEY_BARBERS, JSON.stringify(barbers));
  } catch (e) {
    console.error("Failed to save barbers", e);
  }
}

export function loadServices(): Service[] {
  try {
    const data = localStorage.getItem(KEY_SERVICES);
    if (!data) {
      saveServices(SERVICES);
      return SERVICES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load services", e);
    return SERVICES;
  }
}

export function saveServices(services: Service[]): void {
  try {
    localStorage.setItem(KEY_SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error("Failed to save services", e);
  }
}
