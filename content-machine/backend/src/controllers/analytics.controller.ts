/**
 * Analytics controller handling performance tracking and monetization insights
 */

import { Request, Response } from "express";
import { analyticsService } from "../services/analytics.service";
import { logger } from "../utils/logger";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

/**
 * Get analytics summary for dashboard
 * @route GET /api/analytics/summary
 */
export async function getAnalyticsSummary(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const days = parseInt(req.query.days as string) || 30;
    
    const summary = await analyticsService.getAnalyticsSummary(userId, days);
    
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get analytics summary";
    logger.error(`Get analytics summary error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get revenue projections
 * @route GET /api/analytics/revenue
 */
export async function getRevenueProjection(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const projection = await analyticsService.getRevenueProjection(userId);
    
    res.json({
      success: true,
      data: projection,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get revenue projection";
    logger.error(`Get revenue projection error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get content performance recommendations
 * @route GET /api/analytics/recommendations
 */
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const recommendations = await analyticsService.getRecommendations(userId);
    
    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get recommendations";
    logger.error(`Get recommendations error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Record analytics data (webhook endpoint for platforms)
 * @route POST /api/analytics/record
 */
export async function recordAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    await analyticsService.recordAnalytics({
      userId,
      contentId: req.body.contentId,
      platform: req.body.platform,
      platformPostId: req.body.platformPostId,
      views: req.body.views ?? 0,
      likes: req.body.likes ?? 0,
      comments: req.body.comments ?? 0,
      shares: req.body.shares ?? 0,
      watchTime: req.body.watchTime,
      avgWatchPercent: req.body.avgWatchPercent,
      subscriberGain: req.body.subscriberGain,
      revenue: req.body.revenue,
      impressions: req.body.impressions,
      ctr: req.body.ctr,
      demographics: req.body.demographics,
    });
    
    res.json({
      success: true,
      message: "Analytics recorded successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record analytics";
    logger.error(`Record analytics error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}
