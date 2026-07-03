/**
 * Scheduling controller handling content scheduling and optimal timing
 */

import { Request, Response } from "express";
import { schedulingService } from "../services/scheduling.service";
import { optimalTimingService } from "../services/optimal-timing.service";
import { logger } from "../utils/logger";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import type { ScheduleContentRequest } from "../types";

/**
 * Schedule content for publishing
 * @route POST /api/schedule
 */
export async function scheduleContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const request: ScheduleContentRequest = {
      contentId: req.body.contentId,
      platformConnectionId: req.body.platformConnectionId,
      scheduledTime: new Date(req.body.scheduledTime),
      timezone: req.body.timezone,
      useOptimalTime: req.body.useOptimalTime,
    };
    
    const schedule = await schedulingService.scheduleContent(userId, request);
    
    res.status(201).json({
      success: true,
      message: "Content scheduled successfully",
      data: schedule,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to schedule content";
    logger.error(`Schedule content error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get user's scheduled content
 * @route GET /api/schedule
 */
export async function getScheduledContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { status } = req.query;
    
    const schedules = await schedulingService.getScheduledContent(
      userId, 
      status as string | undefined
    );
    
    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get scheduled content";
    logger.error(`Get scheduled content error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Cancel a scheduled content
 * @route DELETE /api/schedule/:id
 */
export async function cancelSchedule(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    await schedulingService.cancelSchedule(userId, id);
    
    res.json({
      success: true,
      message: "Schedule cancelled successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel schedule";
    logger.error(`Cancel schedule error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Reschedule content
 * @route PATCH /api/schedule/:id
 */
export async function rescheduleContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    const schedule = await schedulingService.rescheduleContent(
      userId,
      id,
      req.body.scheduledTime ? new Date(req.body.scheduledTime) : undefined,
      req.body.useOptimalTime
    );
    
    res.json({
      success: true,
      message: "Content rescheduled successfully",
      data: schedule,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reschedule content";
    logger.error(`Reschedule content error: ${message}`);
    
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get queue status
 * @route GET /api/schedule/queue-status
 */
export async function getQueueStatus(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const status = await schedulingService.getQueueStatus(userId);
    
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get queue status";
    logger.error(`Get queue status error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get optimal upload times for a platform and category
 * @route GET /api/schedule/optimal-times
 */
export async function getOptimalTimes(req: Request, res: Response): Promise<void> {
  try {
    const { platform, category, timezone } = req.query;
    
    const recommendations = await optimalTimingService.getOptimalTimes(
      platform as string,
      category as string,
      (timezone as string) ?? "UTC"
    );
    
    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get optimal times";
    logger.error(`Get optimal times error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get the next optimal upload window
 * @route GET /api/schedule/next-optimal
 */
export async function getNextOptimalWindow(req: Request, res: Response): Promise<void> {
  try {
    const { platform, category, timezone } = req.query;
    
    const nextWindow = await optimalTimingService.getNextOptimalWindow(
      platform as string,
      category as string,
      (timezone as string) ?? "UTC"
    );
    
    res.json({
      success: true,
      data: nextWindow,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get next optimal window";
    logger.error(`Get next optimal window error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}
