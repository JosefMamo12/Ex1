/**
 * Authentication controller handling user registration, login, and profile management
 */

import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { logger } from "../utils/logger";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import type { UserRegistrationDTO, UserLoginDTO } from "../types";

/**
 * Register a new user account
 * @route POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const data: UserRegistrationDTO = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    
    const result = await authService.register(data);
    
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    logger.error(`Registration error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Authenticate user and return JWT token
 * @route POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const data: UserLoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };
    
    const result = await authService.login(data);
    
    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    logger.error(`Login error: ${message}`);
    
    res.status(401).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get current authenticated user's profile
 * @route GET /api/auth/me
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const user = await authService.getUserById(userId);
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get profile";
    logger.error(`Get profile error: ${message}`);
    
    res.status(404).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Update user profile
 * @route PATCH /api/auth/profile
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const user = await authService.updateProfile(userId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    logger.error(`Update profile error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Change user password
 * @route POST /api/auth/change-password
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { currentPassword, newPassword } = req.body;
    
    await authService.changePassword(userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password";
    logger.error(`Change password error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}
