import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";

const router = Router();

// GET /api/health
router.get("/health", (req, res) => {
  healthController.getHealth(req, res);
});

export const healthRoutes = router;
