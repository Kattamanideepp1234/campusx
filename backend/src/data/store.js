import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Asset } from "../models/Asset.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { sampleAssets, sampleBookings, samplePayments, sampleUsers } from "./sampleData.js";

const cloneItems = (items) => items.map((item) => ({ ...item }));

const inMemoryStore = {
  users: cloneItems(sampleUsers),
  assets: cloneItems(sampleAssets),
  bookings: cloneItems(sampleBookings),
  payments: cloneItems(samplePayments),
};

export const isMongoReady = () => mongoose.connection.readyState === 1;

export const store = {
  async getUsers() {
    return isMongoReady() ? User.find().lean() : inMemoryStore.users;
  },
  async saveUsers(users) {
    inMemoryStore.users = users;
  },
  async getAssets() {
    return isMongoReady() ? Asset.find().sort({ createdAt: -1 }).lean() : inMemoryStore.assets;
  },
  async saveAssets(assets) {
    inMemoryStore.assets = assets;
  },
  async getBookings() {
    return isMongoReady() ? Booking.find().sort({ createdAt: -1 }).lean() : inMemoryStore.bookings;
  },
  async saveBookings(bookings) {
    inMemoryStore.bookings = bookings;
  },
  async getPayments() {
    return isMongoReady() ? Payment.find().sort({ createdAt: -1 }).lean() : inMemoryStore.payments;
  },
  async savePayments(payments) {
    inMemoryStore.payments = payments;
  },
};
