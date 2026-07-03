/**
 * Scheduling routes
 */

import { Router } from "express";
import * as schedulingController from "../controllers/scheduling.controller";
import { authenticate } from "../middleware/auth.middleware";
import { 
  validate, 
  scheduleValidation,
  optimalTimingValidation,
  uuidParam 
} from "../middleware/validation.middleware";

const router = Router();

/**
 * @route GET /api/schedule/optimal-times
 * @description Get optimal upload times for platform/category
 * @access Public
 */
router.get(
  "/optimal-times",
  optimalTimingValidation,
  validate,
  schedulingController.getOptimalTimes
);

/**
 * @route GET /api/schedule/next-optimal
 * @description Get the next optimal upload window
 * @access Public
 */
router.get(
  "/next-optimal",
  optimalTimingValidation,
  validate,
  schedulingController.getNextOptimalWindow
);

/**
 * @route GET /api/schedule/queue-status
 * @description Get publishing queue status
 * @access Private
 */
router.get(
  "/queue-status",
  authenticate,
  schedulingController.getQueueStatus
);

/**
 * @route POST /api/schedule
 * @description Schedule content for publishing
 * @access Private
 */
router.post(
  "/",
  authenticate,
  scheduleValidation,
  validate,
  schedulingController.scheduleContent
);

/**
 * @route GET /api/schedule
 * @description Get user's scheduled content
 * @access Private
 */
router.get(
  "/",
  authenticate,
  schedulingController.getScheduledContent
);

/**
 * @route PATCH /api/schedule/:id
 * @description Reschedule content
 * @access Private
 */
router.patch(
  "/:id",
  authenticate,
  uuidParam("id"),
  validate,
  schedulingController.rescheduleContent
);

/**
 * @route DELETE /api/schedule/:id
 * @description Cancel scheduled content
 * @access Private
 */
router.delete(
  "/:id",
  authenticate,
  uuidParam("id"),
  validate,
  schedulingController.cancelSchedule
);

export default router;
