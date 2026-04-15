import { Router } from "express";
import { createPayment, getPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getPayments);
router.post("/", protect, createPayment);

export default router;
