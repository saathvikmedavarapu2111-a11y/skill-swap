import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.js";
import { userRepository, sanitizeUser, SafeUser } from "../data/users.js";
import { sendError } from "../utils/response.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
      tokenPayload?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware that verifies JWT and loads authenticated student user
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Authorization token required (Bearer <token>)", 401);
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      sendError(res, "Malformed authorization header", 401);
      return;
    }

    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        sendError(res, "Authentication token has expired. Please log in again.", 401);
        return;
      }
      sendError(res, "Invalid authentication token", 401);
      return;
    }

    // Never trust frontend-supplied userId; look up user strictly by decoded JWT userId
    const storedUser = userRepository.findById(payload.userId);
    if (!storedUser) {
      sendError(res, "Authenticated user not found", 401);
      return;
    }

    req.user = sanitizeUser(storedUser);
    req.tokenPayload = payload;
    next();
  } catch (error: any) {
    sendError(res, "Authentication error: " + (error.message || "Unknown error"), 500);
  }
}
