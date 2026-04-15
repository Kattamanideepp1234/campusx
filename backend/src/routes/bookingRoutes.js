import { Router } from "express";
import {
  cancelBooking,
  checkAvailability,
  createBooking,
  getBookings,
  getRevenueAnalytics,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getBookings);
router.get("/availability/check", checkAvailability);
router.get("/analytics/revenue", protect, authorize("admin"), getRevenueAnalytics);
router.post("/", protect, createBooking);
router.patch("/:id/status", protect, authorize("admin"), updateBookingStatus);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
