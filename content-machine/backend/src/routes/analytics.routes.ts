/**
 * Analytics routes
 */

import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route GET /api/analytics/summary
 * @description Get analytics summary for dashboard
 * @access Private
 */
router.get(
  "/summary",
  authenticate,
  analyticsController.getAnalyticsSummary
);

/**
 * @route GET /api/analytics/revenue
 * @description Get revenue projections
 * @access Private
 */
router.get(
  "/revenue",
  authenticate,
  analyticsController.getRevenueProjection
);

/**
 * @route GET /api/analytics/recommendations
 * @description Get performance recommendations
 * @access Private
 */
router.get(
  "/recommendations",
  authenticate,
  analyticsController.getRecommendations
);

/**
 * @route POST /api/analytics/record
 * @description Record analytics data
 * @access Private
 */
router.post(
  "/record",
  authenticate,
  analyticsController.recordAnalytics
);

export default router;
