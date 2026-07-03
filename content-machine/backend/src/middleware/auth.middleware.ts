/**
 * Authentication middleware for protecting routes
 */

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { logger } from "../utils/logger";
import type { JwtPayload } from "../types";

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: "No authorization header provided",
      });
      return;
    }
    
    // Check for Bearer token format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        success: false,
        error: "Invalid authorization format. Use: Bearer <token>",
      });
      return;
    }
    
    const token = parts[1];
    
    // Verify token
    const payload = authService.verifyToken(token);
    
    // Attach user to request
    (req as AuthenticatedRequest).user = payload;
    
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    logger.warn(`Authentication failed: ${message}`);
    
    res.status(401).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Middleware to require specific user roles
 * @param allowedRoles - Array of roles that can access the route
 * @returns Express middleware function
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }
    
    if (!allowedRoles.includes(user.role)) {
      logger.warn(`Access denied for user ${user.userId} - required roles: ${allowedRoles.join(", ")}`);
      res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
      return;
    }
    
    next();
  };
}

/**
 * Optional authentication - attaches user if token present but doesn't require it
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1];
        const payload = authService.verifyToken(token);
        (req as AuthenticatedRequest).user = payload;
      }
    }
    
    next();
  } catch {
    // Token invalid or expired, continue without user
    next();
  }
}
