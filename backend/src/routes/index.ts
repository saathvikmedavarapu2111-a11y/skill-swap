import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { healthRoutes } from "./health.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/", healthRoutes);

export { apiRouter };
