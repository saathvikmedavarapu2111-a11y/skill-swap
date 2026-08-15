import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const responseBody: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(responseBody);
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
): Response {
  const responseBody: ApiResponse = {
    success: false,
    error,
    ...(details !== undefined ? { details } : {}),
  };
  return res.status(statusCode).json(responseBody);
}
