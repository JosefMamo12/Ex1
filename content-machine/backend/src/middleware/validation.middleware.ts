/**
 * Request validation middleware using express-validator
 */

import { Request, Response, NextFunction } from "express";
import { body, param, query, ValidationChain, validationResult } from "express-validator";

/**
 * Middleware to check validation results
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map(err => ({
        field: err.type === "field" ? err.path : "unknown",
        message: err.msg,
      })),
    });
    return;
  }
  
  next();
}

/**
 * User registration validation rules
 */
export const registerValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be 1-50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be 1-50 characters"),
];

/**
 * User login validation rules
 */
export const loginValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

/**
 * Content generation validation rules
 */
export const contentGenerationValidation: ValidationChain[] = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required (1-100 characters)"),
  body("category")
    .isIn([
      "NURSERY_RHYMES", "COUNTING", "ALPHABET", "COLORS", 
      "SHAPES", "ANIMALS", "VEHICLES", "NATURE",
      "BEDTIME", "EDUCATIONAL", "MUSIC_DANCE", "STORIES"
    ])
    .withMessage("Valid category is required"),
  body("ageRange")
    .optional()
    .matches(/^\d+-\d+$/)
    .withMessage("Age range must be in format: min-max (e.g., 0-6)"),
  body("style")
    .optional()
    .isIn([
      "CARTOON_2D", "CARTOON_3D", "CLAY_ANIMATION", "WATERCOLOR",
      "PIXEL_ART", "REALISTIC", "MINIMALIST", "COLORFUL_ABSTRACT"
    ])
    .withMessage("Invalid animation style"),
  body("duration")
    .optional()
    .isInt({ min: 15, max: 600 })
    .withMessage("Duration must be between 15 and 600 seconds"),
  body("generateVoiceover")
    .optional()
    .isBoolean()
    .withMessage("generateVoiceover must be a boolean"),
  body("generateThumbnail")
    .optional()
    .isBoolean()
    .withMessage("generateThumbnail must be a boolean"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
];

/**
 * Content scheduling validation rules
 */
export const scheduleValidation: ValidationChain[] = [
  body("contentId")
    .isUUID()
    .withMessage("Valid content ID is required"),
  body("platformConnectionId")
    .isUUID()
    .withMessage("Valid platform connection ID is required"),
  body("scheduledTime")
    .isISO8601()
    .withMessage("Valid ISO 8601 date is required")
    .custom((value) => {
      const scheduledDate = new Date(value);
      if (scheduledDate <= new Date()) {
        throw new Error("Scheduled time must be in the future");
      }
      return true;
    }),
  body("timezone")
    .optional()
    .isString()
    .withMessage("Timezone must be a string"),
  body("useOptimalTime")
    .optional()
    .isBoolean()
    .withMessage("useOptimalTime must be a boolean"),
];

/**
 * Optimal timing query validation rules
 */
export const optimalTimingValidation: ValidationChain[] = [
  query("platform")
    .isIn(["YOUTUBE", "TIKTOK", "INSTAGRAM", "FACEBOOK"])
    .withMessage("Valid platform is required"),
  query("category")
    .isIn([
      "NURSERY_RHYMES", "COUNTING", "ALPHABET", "COLORS", 
      "SHAPES", "ANIMALS", "VEHICLES", "NATURE",
      "BEDTIME", "EDUCATIONAL", "MUSIC_DANCE", "STORIES"
    ])
    .withMessage("Valid category is required"),
  query("timezone")
    .optional()
    .isString()
    .withMessage("Timezone must be a string"),
];

/**
 * UUID parameter validation
 */
export const uuidParam = (paramName: string): ValidationChain => 
  param(paramName)
    .isUUID()
    .withMessage(`Valid ${paramName} UUID is required`);

/**
 * Pagination query validation
 */
export const paginationValidation: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isString()
    .withMessage("sortBy must be a string"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be 'asc' or 'desc'"),
];
