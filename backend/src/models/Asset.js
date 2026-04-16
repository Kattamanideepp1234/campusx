import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["Classroom", "Laboratory", "Auditorium", "Sports Complex"], required: true },
    location: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    capacity: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    amenities: [{ type: String }],
    availability: {
      type: [
        {
          day: String,
          slots: [String],
        },
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);
