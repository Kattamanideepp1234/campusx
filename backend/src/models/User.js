import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "organizer"],
      default: "user",
    },
    collegeName: { type: String, default: "CampusX Demo College" },
    phone: { type: String, default: "+91 9876543210" },
    avatar: { type: String, default: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
