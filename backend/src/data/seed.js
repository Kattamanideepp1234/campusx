import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Asset } from "../models/Asset.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { sampleAssets, sampleBookings, samplePayments, sampleUsers } from "./sampleData.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.log("MongoDB is not connected. Start MongoDB and rerun the seed command.");
    process.exit(1);
  }

  await Promise.all([
    User.deleteMany({}),
    Asset.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  await User.insertMany(sampleUsers);
  await Asset.insertMany(sampleAssets);
  await Booking.insertMany(sampleBookings);
  await Payment.insertMany(samplePayments);

  console.log("CampusX sample data seeded successfully.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
