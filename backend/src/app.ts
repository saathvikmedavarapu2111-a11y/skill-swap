import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sendError } from "./utils/response.js";

// Load environment variables
dotenv.config();

export function createApp(): Express {
  const app = express();

  // Helmet for security headers
  const helmetMiddleware = typeof helmet === "function" ? helmet : ((helmet as any).default ?? helmet);
  app.use(
    helmetMiddleware({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          process.env.NODE_ENV === "development" ||
          origin.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body Parsing Middleware
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // API Routes
  app.use("/api", apiRouter);
  app.use("/", apiRouter);

  // 404 Route Handler
  app.use((req: Request, res: Response) => {
    sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
