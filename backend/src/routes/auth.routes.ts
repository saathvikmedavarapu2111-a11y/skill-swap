import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validateBody(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

// POST /api/auth/login
router.post("/login", validateBody(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  authController.logout(req, res);
});

// GET /api/auth/me (Protected: requires valid JWT)
router.get("/me", requireAuth, (req, res) => {
  authController.me(req, res);
});

export const authRoutes = router;
