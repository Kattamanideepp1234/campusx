import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    provider: { type: String, default: "mock" },
    status: { type: String, enum: ["success", "failed"], required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
