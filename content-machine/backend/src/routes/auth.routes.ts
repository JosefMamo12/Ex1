/**
 * Authentication routes
 */

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { 
  validate, 
  registerValidation, 
  loginValidation 
} from "../middleware/validation.middleware";

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @description Authenticate user and get token
 * @access Public
 */
router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

/**
 * @route GET /api/auth/me
 * @description Get current user profile
 * @access Private
 */
router.get(
  "/me",
  authenticate,
  authController.getProfile
);

/**
 * @route PATCH /api/auth/profile
 * @description Update user profile
 * @access Private
 */
router.patch(
  "/profile",
  authenticate,
  authController.updateProfile
);

/**
 * @route POST /api/auth/change-password
 * @description Change user password
 * @access Private
 */
router.post(
  "/change-password",
  authenticate,
  authController.changePassword
);

export default router;
