import { Request, Response } from "express";
import { sendSuccess } from "../utils/response.js";

export class HealthController {
  /**
   * GET /api/health
   */
  public getHealth(req: Request, res: Response): void {
    sendSuccess(
      res,
      {
        status: "ok",
        service: "SkillSwap Authentication Backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      "SkillSwap Backend is operational",
      200
    );
  }
}

export const healthController = new HealthController();
