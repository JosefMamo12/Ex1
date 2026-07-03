/**
 * Authentication service handling user registration, login, and JWT management
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "../config/database";
import { env } from "../config/environment";
import { logger } from "../utils/logger";
import type { 
  UserRegistrationDTO, 
  UserLoginDTO, 
  AuthResponse, 
  JwtPayload 
} from "../types";

/** Salt rounds for password hashing */
const SALT_ROUNDS = 12;

/**
 * Authentication service class
 * Handles all authentication-related operations
 */
export class AuthService {
  /**
   * Register a new user
   * @param data - User registration data
   * @returns Authentication response with user and token
   * @throws Error if email already exists or validation fails
   */
  async register(data: UserRegistrationDTO): Promise<AuthResponse> {
    logger.info(`Attempting to register user: ${data.email}`);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    
    if (existingUser) {
      logger.warn(`Registration failed - email already exists: ${data.email}`);
      throw new Error("An account with this email already exists");
    }
    
    // Validate password strength
    this.validatePassword(data.password);
    
    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "CREATOR",
      },
    });
    
    logger.info(`User registered successfully: ${user.id}`);
    
    // Generate JWT token
    const accessToken = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }
  
  /**
   * Authenticate user with email and password
   * @param data - Login credentials
   * @returns Authentication response with user and token
   * @throws Error if credentials are invalid
   */
  async login(data: UserLoginDTO): Promise<AuthResponse> {
    logger.info(`Login attempt for: ${data.email}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    
    if (!user) {
      logger.warn(`Login failed - user not found: ${data.email}`);
      throw new Error("Invalid email or password");
    }
    
    // Check if account is active
    if (!user.isActive) {
      logger.warn(`Login failed - account deactivated: ${data.email}`);
      throw new Error("Account has been deactivated");
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isValidPassword) {
      logger.warn(`Login failed - invalid password for: ${data.email}`);
      throw new Error("Invalid email or password");
    }
    
    logger.info(`User logged in successfully: ${user.id}`);
    
    // Generate JWT token
    const accessToken = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }
  
  /**
   * Verify and decode a JWT token
   * @param token - JWT token to verify
   * @returns Decoded JWT payload
   * @throws Error if token is invalid or expired
   */
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }
  
  /**
   * Get user by ID
   * @param userId - User ID to lookup
   * @returns User without password hash
   * @throws Error if user not found
   */
  async getUserById(userId: string): Promise<Omit<User, "passwordHash">> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return this.sanitizeUser(user);
  }
  
  /**
   * Update user profile
   * @param userId - User ID to update
   * @param data - Fields to update
   * @returns Updated user
   */
  async updateProfile(
    userId: string, 
    data: { firstName?: string; lastName?: string }
  ): Promise<Omit<User, "passwordHash">> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        updatedAt: new Date(),
      },
    });
    
    logger.info(`User profile updated: ${userId}`);
    return this.sanitizeUser(user);
  }
  
  /**
   * Change user password
   * @param userId - User ID
   * @param currentPassword - Current password for verification
   * @param newPassword - New password to set
   * @throws Error if current password is invalid
   */
  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
    
    // Validate new password
    this.validatePassword(newPassword);
    
    // Hash and update
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, updatedAt: new Date() },
    });
    
    logger.info(`Password changed for user: ${userId}`);
  }
  
  /**
   * Generate a JWT token for a user
   * @param user - User to generate token for
   * @returns JWT token string
   */
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }
  
  /**
   * Remove sensitive fields from user object
   * @param user - User with password hash
   * @returns User without password hash
   */
  private sanitizeUser(user: User): Omit<User, "passwordHash"> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  
  /**
   * Validate password meets security requirements
   * @param password - Password to validate
   * @throws Error if password doesn't meet requirements
   */
  private validatePassword(password: string): void {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(". "));
    }
  }
}

/** Singleton instance of AuthService */
export const authService = new AuthService();
