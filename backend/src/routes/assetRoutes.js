import { Router } from "express";
import {
  createAsset,
  deleteAsset,
  getAssetById,
  getAssets,
  updateAsset,
} from "../controllers/assetController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAssets);
router.get("/:id", getAssetById);
router.post("/", protect, authorize("admin"), createAsset);
router.put("/:id", protect, authorize("admin"), updateAsset);
router.delete("/:id", protect, authorize("admin"), deleteAsset);

export default router;
