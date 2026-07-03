/**
 * Content management routes
 */

import { Router } from "express";
import * as contentController from "../controllers/content.controller";
import { authenticate } from "../middleware/auth.middleware";
import { 
  validate, 
  contentGenerationValidation,
  uuidParam,
  paginationValidation 
} from "../middleware/validation.middleware";

const router = Router();

/**
 * @route GET /api/content/categories
 * @description Get available content categories
 * @access Public
 */
router.get("/categories", contentController.getCategories);

/**
 * @route GET /api/content/styles
 * @description Get available animation styles
 * @access Public
 */
router.get("/styles", contentController.getStyles);

/**
 * @route GET /api/content/templates
 * @description Get content templates
 * @access Public
 */
router.get("/templates", contentController.getTemplates);

/**
 * @route POST /api/content/templates
 * @description Create a custom template
 * @access Private
 */
router.post(
  "/templates",
  authenticate,
  contentController.createTemplate
);

/**
 * @route POST /api/content/generate
 * @description Generate new content using AI
 * @access Private
 */
router.post(
  "/generate",
  authenticate,
  contentGenerationValidation,
  validate,
  contentController.generateContent
);

/**
 * @route GET /api/content
 * @description Get all user content
 * @access Private
 */
router.get(
  "/",
  authenticate,
  paginationValidation,
  validate,
  contentController.getContent
);

/**
 * @route GET /api/content/:id
 * @description Get content by ID
 * @access Private
 */
router.get(
  "/:id",
  authenticate,
  uuidParam("id"),
  validate,
  contentController.getContentById
);

/**
 * @route PATCH /api/content/:id
 * @description Update content metadata
 * @access Private
 */
router.patch(
  "/:id",
  authenticate,
  uuidParam("id"),
  validate,
  contentController.updateContent
);

/**
 * @route DELETE /api/content/:id
 * @description Delete content
 * @access Private
 */
router.delete(
  "/:id",
  authenticate,
  uuidParam("id"),
  validate,
  contentController.deleteContent
);

export default router;
