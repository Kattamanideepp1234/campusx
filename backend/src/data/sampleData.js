import bcrypt from "bcryptjs";
import { generateId } from "../utils/generateId.js";

const passwordHash = bcrypt.hashSync("password123", 10);

export const sampleUsers = [
  {
    _id: generateId("user"),
    name: "Aarav Mehta",
    email: "admin@campusx.com",
    password: passwordHash,
    role: "admin",
    collegeName: "CampusX Innovation University",
    phone: "+91 9988776655",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: generateId("user"),
    name: "Riya Sharma",
    email: "organizer@campusx.com",
    password: passwordHash,
    role: "organizer",
    collegeName: "CampusX Innovation University",
    phone: "+91 9911223344",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: generateId("user"),
    name: "Neel Patel",
    email: "user@campusx.com",
    password: passwordHash,
    role: "user",
    collegeName: "CampusX Community College",
    phone: "+91 9900112233",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
];

export const sampleAssets = [
  {
    _id: generateId("asset"),
    title: "Innovation Auditorium",
    type: "Auditorium",
    location: "Bengaluru",
    pricePerHour: 4500,
    capacity: 500,
    description: "A premium auditorium with stage lighting, digital podium, and surround sound for conferences and cultural events.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Projector", "Air Conditioning", "Stage Lighting", "Green Rooms"],
    availability: [
      { day: "Monday", slots: ["09:00-12:00", "14:00-18:00"] },
      { day: "Wednesday", slots: ["10:00-13:00", "15:00-19:00"] },
      { day: "Saturday", slots: ["09:00-17:00"] },
    ],
    isActive: true,
  },
  {
    _id: generateId("asset"),
    title: "AI Research Lab",
    type: "Laboratory",
    location: "Hyderabad",
    pricePerHour: 3200,
    capacity: 60,
    description: "High-performance computing lab equipped for workshops, hackathons, and AI training sessions.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1200&q=80",
    amenities: ["High-Speed WiFi", "Workstations", "24x7 Power Backup", "Smart Screens"],
    availability: [
      { day: "Tuesday", slots: ["08:00-12:00", "13:00-17:00"] },
      { day: "Thursday", slots: ["09:00-15:00"] },
      { day: "Friday", slots: ["11:00-18:00"] },
    ],
    isActive: true,
  },
  {
    _id: generateId("asset"),
    title: "Executive Seminar Hall",
    type: "Classroom",
    location: "Pune",
    pricePerHour: 1800,
    capacity: 120,
    description: "Flexible seminar hall with modular seating, ideal for bootcamps, training, and guest lectures.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Whiteboard", "AV System", "Modular Seating", "Recording Setup"],
    availability: [
      { day: "Monday", slots: ["08:00-10:00", "12:00-16:00"] },
      { day: "Friday", slots: ["09:00-12:00", "14:00-18:00"] },
      { day: "Sunday", slots: ["10:00-15:00"] },
    ],
    isActive: true,
  },
  {
    _id: generateId("asset"),
    title: "Champions Indoor Arena",
    type: "Sports Complex",
    location: "Delhi",
    pricePerHour: 5200,
    capacity: 300,
    description: "Indoor sports arena designed for exhibitions, esports tournaments, and community sports leagues.",
    image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Scoreboards", "Locker Rooms", "Parking", "LED Lighting"],
    availability: [
      { day: "Wednesday", slots: ["08:00-11:00", "13:00-18:00"] },
      { day: "Saturday", slots: ["09:00-20:00"] },
      { day: "Sunday", slots: ["09:00-16:00"] },
    ],
    isActive: true,
  },
];

export const sampleBookings = [
  {
    _id: generateId("booking"),
    userId: sampleUsers[2]._id,
    assetId: sampleAssets[0]._id,
    assetTitle: sampleAssets[0].title,
    date: "2026-04-20",
    startTime: "10:00",
    endTime: "13:00",
    attendees: 280,
    totalAmount: 13500,
    status: "confirmed",
    paymentStatus: "paid",
    organizerNote: "Event production setup starts 1 hour early.",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId("booking"),
    userId: sampleUsers[1]._id,
    assetId: sampleAssets[1]._id,
    assetTitle: sampleAssets[1].title,
    date: "2026-04-23",
    startTime: "09:00",
    endTime: "12:00",
    attendees: 45,
    totalAmount: 9600,
    status: "pending",
    paymentStatus: "pending",
    organizerNote: "Awaiting final attendee list.",
    createdAt: new Date().toISOString(),
  },
];

export const samplePayments = [
  {
    _id: generateId("payment"),
    bookingId: sampleBookings[0]._id,
    amount: 13500,
    provider: "mock",
    status: "success",
    transactionId: generateId("txn"),
    createdAt: new Date().toISOString(),
  },
];
