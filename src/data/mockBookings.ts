import { Booking, Service, Barber } from "../types";
import { SERVICES, BARBERS } from "./barberData";

// Helper to create dates relative to today
const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const getInitialBookings = (): Booking[] => {
  const todayStr = getRelativeDateString(0);
  const yesterdayStr = getRelativeDateString(-1);
  const dayBeforeStr = getRelativeDateString(-2);
  const dayThreeAgoStr = getRelativeDateString(-3);
  const dayFourAgoStr = getRelativeDateString(-4);
  const tomorrowStr = getRelativeDateString(1);

  return [
    {
      id: "b-1",
      service: SERVICES[0], // Sovereign Cut $50
      barber: BARBERS[1], // Alexander Vance
      date: todayStr,
      time: "09:00 AM",
      customer: {
        name: "Clara Templeton",
        phone: "+1 (555) 381-9012",
        email: "clara.temp@gmail.com",
        notes: "Loves classical styling with parting. Cut it short on sides."
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    },
    {
      id: "b-2",
      service: SERVICES[2], // Beard Sculpt $40
      barber: BARBERS[2], // Marcus Sterling
      date: todayStr,
      time: "10:30 AM",
      customer: {
        name: "Harrison Vance",
        phone: "+1 (555) 902-1244",
        email: "harrison.v@vancehouse.com",
        notes: "Wants premium sandalwood scent during face massager."
      },
      status: "confirmed",
      createdAt: new Date().toISOString()
    },
    {
      id: "b-3",
      service: SERVICES[4], // Gentlemen's Choice Combo $85
      barber: BARBERS[2], // Marcus Sterling
      date: todayStr,
      time: "01:00 PM",
      customer: {
        name: "Damian Thorne",
        phone: "+1 (555) 238-0955",
        email: "dthorne@thornelaw.com",
        notes: "Strict timing requested due to executive press release."
      },
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "b-4",
      service: SERVICES[1], // Skin Fade $40
      barber: BARBERS[3], // Elena Rostova
      date: todayStr,
      time: "03:15 PM",
      customer: {
        name: "Miles Morales",
        phone: "+1 (555) 891-3810",
        email: "miles@spideynet.org",
        notes: "Taper fade style, very modern layout."
      },
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "b-5",
      service: SERVICES[4], // Gentlemen's Choice $85
      barber: BARBERS[4], // Julian Croft
      date: yesterdayStr,
      time: "05:00 PM",
      customer: {
        name: "Winston Montgomery",
        phone: "+1 (555) 123-4567",
        email: "winst_m@montgomery.co",
        notes: "Signature style, double shave finish."
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
    },
    {
      id: "b-6",
      service: SERVICES[3], // Royal Shave $60
      barber: BARBERS[2], // Marcus Sterling
      date: yesterdayStr,
      time: "12:00 PM",
      customer: {
        name: "Dominic Black",
        phone: "+1 (555) 432-1098",
        email: "d_black@noir.io",
        notes: "Keep skin moist, gets dry easily."
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
    },
    {
      id: "b-7",
      service: SERVICES[5], // Royal Treatment $105
      barber: BARBERS[1], // Alexander Vance
      date: dayBeforeStr,
      time: "02:30 PM",
      customer: {
        name: "Garrison Ford",
        phone: "+1 (555) 678-9012",
        email: "gford@rugged.org",
        notes: "Celebrate promotion. Bring cold towels."
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
    },
    {
      id: "b-8",
      service: SERVICES[0], // Sovereign Cut $50
      barber: BARBERS[3], // Elena Rostova
      date: dayThreeAgoStr,
      time: "10:30 AM",
      customer: {
        name: "Aidan Pierce",
        phone: "+1 (555) 345-6789",
        email: "apierce@chicago.net",
        notes: ""
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
    },
    {
      id: "b-9",
      service: SERVICES[1], // Skin Fade $40
      barber: BARBERS[4], // Julian Croft
      date: dayFourAgoStr,
      time: "04:00 PM",
      customer: {
        name: "Liam Neeson",
        phone: "+1 (555) 987-6543",
        email: "liam@taken.com",
        notes: "Will find you and will tip you."
      },
      status: "completed",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
    },
    {
      id: "b-10",
      service: SERVICES[3], // Royal Shave $60
      barber: BARBERS[1], // Alexander Vance
      date: dayBeforeStr,
      time: "09:45 AM",
      customer: {
        name: "Charles Xavier",
        phone: "+1 (555) 246-8101",
        email: "professor@xavier.edu",
        notes: "Very clean head shave."
      },
      status: "cancelled",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
    },
    {
      id: "b-11",
      service: SERVICES[5], // Royal Treatment $105
      barber: BARBERS[1], // Alexander Vance
      date: tomorrowStr,
      time: "10:30 AM",
      customer: {
        name: "Nate Drake",
        phone: "+1 (555) 555-0150",
        email: "nate@fortune-hunter.com",
        notes: "Needs clean edge before next global trip."
      },
      status: "confirmed",
      createdAt: new Date().toISOString()
    }
  ];
};
