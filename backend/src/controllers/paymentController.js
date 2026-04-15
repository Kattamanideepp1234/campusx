import mongoose from "mongoose";
import { store } from "../data/store.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { generateId } from "../utils/generateId.js";

export const createPayment = async (req, res) => {
  const { bookingId, amount, provider = "mock", shouldFail = false } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ message: "bookingId and amount are required." });
  }

  const payments = await store.getPayments();
  const paymentPayload = {
    _id: generateId("payment"),
    bookingId,
    amount,
    provider,
    status: shouldFail ? "failed" : "success",
    transactionId: generateId("txn"),
    createdAt: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    const payment = await Payment.create(paymentPayload);
    await Booking.findOneAndUpdate(
      { _id: bookingId },
      { paymentStatus: shouldFail ? "failed" : "paid" },
      { new: true }
    );
    return res.status(201).json({ message: shouldFail ? "Payment failed." : "Payment successful.", payment });
  }

  const bookings = await store.getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking._id.toString() === bookingId);

  if (bookingIndex !== -1) {
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      paymentStatus: shouldFail ? "failed" : "paid",
    };
    await store.saveBookings(bookings);
  }

  await store.savePayments([paymentPayload, ...payments]);
  return res.status(201).json({ message: shouldFail ? "Payment failed." : "Payment successful.", payment: paymentPayload });
};

export const getPayments = async (req, res) => {
  const [payments, bookings] = await Promise.all([store.getPayments(), store.getBookings()]);
  const visibleBookings = req.user.role === "admin"
    ? bookings
    : bookings.filter((booking) => booking.userId.toString() === req.user.id.toString());
  const visibleBookingIds = new Set(visibleBookings.map((booking) => booking._id.toString()));
  const visiblePayments = payments.filter((payment) => visibleBookingIds.has(payment.bookingId.toString()));

  res.json({ payments: visiblePayments });
};
