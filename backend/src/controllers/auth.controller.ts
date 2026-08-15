import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class AuthController {
  /**
   * POST /api/auth/login
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, "Login successful", 200);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/register
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, "Registration successful", 201);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  public async logout(req: Request, res: Response): Promise<void> {
    // In stateless JWT auth, logout is processed by client deleting the token.
    // The endpoint provides clean handshake and hook for token revocation or session cleanup.
    sendSuccess(res, { loggedOut: true }, "Logout successful", 200);
  }

  /**
   * GET /api/auth/me
   */
  public async me(req: Request, res: Response): Promise<void> {
    // req.user is guaranteed to be set by requireAuth middleware
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    sendSuccess(res, { user: req.user }, "Authenticated user retrieved", 200);
  }
}

export const authController = new AuthController();
