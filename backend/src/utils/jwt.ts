import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || "skillswap_jwt_default_secret_fallback_2026";
};

const getJwtExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || "7d";
};

/**
 * Signs a JWT token with the user payload
 */
export function signToken(payload: JwtPayload): string {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();
  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export function verifyToken(token: string): JwtPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
}
