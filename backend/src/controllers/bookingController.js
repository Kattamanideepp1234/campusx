import mongoose from "mongoose";
import { store } from "../data/store.js";
import { Asset } from "../models/Asset.js";
import { Booking } from "../models/Booking.js";
import { generateId } from "../utils/generateId.js";
import { calculateDurationHours } from "../utils/calculateDuration.js";

const hasOverlap = (existingBooking, nextBooking) => {
  if (existingBooking.assetId !== nextBooking.assetId || existingBooking.date !== nextBooking.date) {
    return false;
  }

  const startA = existingBooking.startTime;
  const endA = existingBooking.endTime;
  const startB = nextBooking.startTime;
  const endB = nextBooking.endTime;

  return startA < endB && startB < endA;
};

const getVisibleBookings = (bookings, user) =>
  user.role === "admin"
    ? bookings
    : bookings.filter((booking) => booking.userId.toString() === user.id.toString());

export const getBookings = async (req, res) => {
  const bookings = await store.getBookings();
  const result = getVisibleBookings(bookings, req.user);

  res.json({ bookings: result });
};

export const checkAvailability = async (req, res) => {
  const { assetId, date, startTime, endTime } = req.query;

  if (!assetId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "assetId, date, startTime and endTime are required." });
  }

  const bookings = await store.getBookings();
  const isAvailable = !bookings.some((booking) => hasOverlap(booking, { assetId, date, startTime, endTime }));

  return res.json({ available: isAvailable });
};

export const createBooking = async (req, res) => {
  const { assetId, date, startTime, endTime, attendees, organizerNote } = req.body;

  if (!assetId || !date || !startTime || !endTime || !attendees) {
    return res.status(400).json({ message: "Booking details are incomplete." });
  }

  const assets = mongoose.connection.readyState === 1 ? await Asset.find().lean() : await store.getAssets();
  const asset = assets.find((item) => item._id.toString() === assetId);

  if (!asset) {
    return res.status(404).json({ message: "Selected asset not found." });
  }

  const bookings = await store.getBookings();
  const requestedBooking = { assetId, date, startTime, endTime };

  if (bookings.some((booking) => hasOverlap(booking, requestedBooking))) {
    return res.status(409).json({ message: "This slot is already booked. Please choose a different time." });
  }

  const totalAmount = asset.pricePerHour * calculateDurationHours(startTime, endTime);
  const bookingPayload = {
    _id: generateId("booking"),
    userId: req.user.id,
    assetId,
    assetTitle: asset.title,
    date,
    startTime,
    endTime,
    attendees: Number(attendees),
    totalAmount,
    status: "confirmed",
    paymentStatus: "pending",
    organizerNote: organizerNote || "",
    createdAt: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    const booking = await Booking.create(bookingPayload);
    return res.status(201).json({ message: "Booking created successfully.", booking });
  }

  await store.saveBookings([bookingPayload, ...bookings]);
  return res.status(201).json({ message: "Booking created successfully.", booking: bookingPayload });
};

export const getRevenueAnalytics = async (req, res) => {
  const bookings = await store.getBookings();
  const assets = await store.getAssets();

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const activeAssets = assets.filter((asset) => asset.isActive !== false).length;
  const occupancyRate = activeAssets ? Math.min(Math.round((confirmedBookings / activeAssets) * 100), 100) : 0;

  res.json({
    analytics: {
      totalRevenue,
      confirmedBookings,
      activeAssets,
      occupancyRate,
    },
  });
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["pending", "confirmed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid booking status." });
  }

  if (mongoose.connection.readyState === 1) {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.json({ message: "Booking status updated successfully.", booking });
  }

  const bookings = await store.getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking._id.toString() === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  bookings[bookingIndex] = { ...bookings[bookingIndex], status };
  await store.saveBookings(bookings);
  return res.json({ message: "Booking status updated successfully.", booking: bookings[bookingIndex] });
};

export const cancelBooking = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (req.user.role !== "admin" && booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You cannot cancel this booking." });
    }

    booking.status = "cancelled";
    await booking.save();
    return res.json({ message: "Booking cancelled successfully.", booking });
  }

  const bookings = await store.getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking._id.toString() === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (req.user.role !== "admin" && bookings[bookingIndex].userId.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: "You cannot cancel this booking." });
  }

  bookings[bookingIndex] = { ...bookings[bookingIndex], status: "cancelled" };
  await store.saveBookings(bookings);
  return res.json({ message: "Booking cancelled successfully.", booking: bookings[bookingIndex] });
};
