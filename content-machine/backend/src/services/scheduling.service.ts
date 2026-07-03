/**
 * Content Scheduling Service
 * Manages content scheduling, publishing, and queue management
 */

import cron from "node-cron";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { optimalTimingService } from "./optimal-timing.service";
import type { ScheduleContentRequest } from "../types";

/**
 * Service for managing content scheduling and automated publishing
 */
export class SchedulingService {
  private schedulerActive: boolean = false;
  
  /**
   * Initialize the scheduling service and start the cron job
   */
  async initialize(): Promise<void> {
    if (this.schedulerActive) {
      logger.warn("Scheduler already active");
      return;
    }
    
    // Run every minute to check for scheduled content
    cron.schedule("* * * * *", async () => {
      await this.processScheduledContent();
    });
    
    this.schedulerActive = true;
    logger.info("Content scheduling service initialized");
  }
  
  /**
   * Schedule content for publishing
   * @param userId - User scheduling the content
   * @param request - Scheduling parameters
   * @returns Created schedule record
   */
  async scheduleContent(
    userId: string,
    request: ScheduleContentRequest
  ): Promise<object> {
    // Verify content exists and belongs to user
    const content = await prisma.content.findFirst({
      where: {
        id: request.contentId,
        userId,
        status: { in: ["READY", "SCHEDULED"] },
      },
    });
    
    if (!content) {
      throw new Error("Content not found or not ready for scheduling");
    }
    
    // Verify platform connection
    const platformConnection = await prisma.platformConnection.findFirst({
      where: {
        id: request.platformConnectionId,
        userId,
        isActive: true,
      },
    });
    
    if (!platformConnection) {
      throw new Error("Platform connection not found or inactive");
    }
    
    let scheduledTime = request.scheduledTime;
    let isOptimalTime = false;
    let optimizationScore: number | undefined;
    
    // If user wants optimal time, calculate it
    if (request.useOptimalTime) {
      const optimalWindow = await optimalTimingService.getNextOptimalWindow(
        platformConnection.platform,
        content.category,
        request.timezone ?? "UTC"
      );
      scheduledTime = optimalWindow.scheduledTime;
      isOptimalTime = true;
      optimizationScore = optimalWindow.slot.score;
    }
    
    // Create the schedule
    const schedule = await prisma.contentSchedule.create({
      data: {
        userId,
        contentId: request.contentId,
        platformConnectionId: request.platformConnectionId,
        scheduledTime,
        timezone: request.timezone ?? "UTC",
        isOptimalTime,
        optimizationScore,
        status: "PENDING",
      },
      include: {
        content: true,
        platformConnection: true,
      },
    });
    
    // Update content status
    await prisma.content.update({
      where: { id: content.id },
      data: { status: "SCHEDULED" },
    });
    
    logger.info(`Content scheduled: ${schedule.id} for ${scheduledTime.toISOString()}`);
    
    return schedule;
  }
  
  /**
   * Get user's scheduled content
   * @param userId - User ID
   * @param status - Optional status filter
   * @returns List of scheduled content
   */
  async getScheduledContent(
    userId: string,
    status?: string
  ): Promise<object[]> {
    const where: Record<string, unknown> = { userId };
    if (status) {
      where.status = status;
    }
    
    return prisma.contentSchedule.findMany({
      where,
      include: {
        content: true,
        platformConnection: {
          select: {
            id: true,
            platform: true,
            channelName: true,
          },
        },
      },
      orderBy: { scheduledTime: "asc" },
    });
  }
  
  /**
   * Cancel a scheduled content
   * @param userId - User ID
   * @param scheduleId - Schedule ID to cancel
   */
  async cancelSchedule(userId: string, scheduleId: string): Promise<void> {
    const schedule = await prisma.contentSchedule.findFirst({
      where: {
        id: scheduleId,
        userId,
        status: "PENDING",
      },
    });
    
    if (!schedule) {
      throw new Error("Schedule not found or cannot be cancelled");
    }
    
    await prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: "CANCELLED" },
    });
    
    // Update content status back to ready
    await prisma.content.update({
      where: { id: schedule.contentId },
      data: { status: "READY" },
    });
    
    logger.info(`Schedule cancelled: ${scheduleId}`);
  }
  
  /**
   * Reschedule content to a new time
   * @param userId - User ID
   * @param scheduleId - Schedule ID to update
   * @param newTime - New scheduled time
   * @param useOptimalTime - Whether to use optimal time instead
   */
  async rescheduleContent(
    userId: string,
    scheduleId: string,
    newTime?: Date,
    useOptimalTime?: boolean
  ): Promise<object> {
    const schedule = await prisma.contentSchedule.findFirst({
      where: {
        id: scheduleId,
        userId,
        status: "PENDING",
      },
      include: {
        content: true,
        platformConnection: true,
      },
    });
    
    if (!schedule) {
      throw new Error("Schedule not found or cannot be rescheduled");
    }
    
    let scheduledTime = newTime ?? schedule.scheduledTime;
    let isOptimalTime = false;
    let optimizationScore: number | undefined;
    
    if (useOptimalTime) {
      const optimalWindow = await optimalTimingService.getNextOptimalWindow(
        schedule.platformConnection.platform,
        schedule.content.category,
        schedule.timezone
      );
      scheduledTime = optimalWindow.scheduledTime;
      isOptimalTime = true;
      optimizationScore = optimalWindow.slot.score;
    }
    
    const updated = await prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: {
        scheduledTime,
        isOptimalTime,
        optimizationScore,
        updatedAt: new Date(),
      },
      include: {
        content: true,
        platformConnection: true,
      },
    });
    
    logger.info(`Schedule rescheduled: ${scheduleId} to ${scheduledTime.toISOString()}`);
    
    return updated;
  }
  
  /**
   * Process scheduled content that's due for publishing
   * This is called by the cron job every minute
   */
  private async processScheduledContent(): Promise<void> {
    const now = new Date();
    
    // Find all pending schedules that are due
    const dueSchedules = await prisma.contentSchedule.findMany({
      where: {
        status: "PENDING",
        scheduledTime: { lte: now },
      },
      include: {
        content: true,
        platformConnection: true,
        user: true,
      },
    });
    
    for (const schedule of dueSchedules) {
      await this.publishContent(schedule);
    }
  }
  
  /**
   * Publish content to the specified platform
   * @param schedule - Schedule record with content and platform info
   */
  private async publishContent(schedule: {
    id: string;
    content: { id: string; title: string; videoUrl: string | null; description: string | null; tags: string[] };
    platformConnection: { id: string; platform: string; accessToken: string };
    retryCount: number;
  }): Promise<void> {
    logger.info(`Publishing content: ${schedule.content.id} to ${schedule.platformConnection.platform}`);
    
    // Mark as processing
    await prisma.contentSchedule.update({
      where: { id: schedule.id },
      data: { status: "PROCESSING" },
    });
    
    try {
      // Platform-specific publishing logic
      let platformPostId: string | undefined;
      let platformUrl: string | undefined;
      
      switch (schedule.platformConnection.platform) {
        case "YOUTUBE":
          const ytResult = await this.publishToYouTube(
            schedule.content,
            schedule.platformConnection.accessToken
          );
          platformPostId = ytResult.videoId;
          platformUrl = ytResult.url;
          break;
          
        case "TIKTOK":
          const ttResult = await this.publishToTikTok(
            schedule.content,
            schedule.platformConnection.accessToken
          );
          platformPostId = ttResult.videoId;
          platformUrl = ttResult.url;
          break;
          
        default:
          throw new Error(`Unsupported platform: ${schedule.platformConnection.platform}`);
      }
      
      // Update schedule as published
      await prisma.contentSchedule.update({
        where: { id: schedule.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          platformPostId,
          platformUrl,
        },
      });
      
      // Update content status
      await prisma.content.update({
        where: { id: schedule.content.id },
        data: { status: "PUBLISHED" },
      });
      
      logger.info(`Content published successfully: ${schedule.content.id}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to publish content: ${errorMessage}`);
      
      // Handle retry logic
      if (schedule.retryCount < 3) {
        await prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: {
            status: "PENDING",
            retryCount: schedule.retryCount + 1,
            errorMessage,
            // Retry in 5 minutes
            scheduledTime: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
      } else {
        await prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: {
            status: "FAILED",
            errorMessage,
          },
        });
        
        await prisma.content.update({
          where: { id: schedule.content.id },
          data: { status: "FAILED" },
        });
      }
    }
  }
  
  /**
   * Publish content to YouTube
   * In production, this would use the YouTube Data API v3
   */
  private async publishToYouTube(
    content: { title: string; videoUrl: string | null; description: string | null; tags: string[] },
    accessToken: string
  ): Promise<{ videoId: string; url: string }> {
    // YouTube API integration would go here
    // Using @googleapis/youtube package
    
    logger.info(`Publishing to YouTube: ${content.title}`);
    
    // Placeholder - in production:
    // 1. Upload video using resumable upload
    // 2. Set video metadata (title, description, tags)
    // 3. Set as "made for kids" content
    // 4. Return video ID and URL
    
    const videoId = `yt_${Date.now()}`;
    return {
      videoId,
      url: `https://youtube.com/watch?v=${videoId}`,
    };
  }
  
  /**
   * Publish content to TikTok
   * In production, this would use the TikTok API
   */
  private async publishToTikTok(
    content: { title: string; videoUrl: string | null; description: string | null; tags: string[] },
    accessToken: string
  ): Promise<{ videoId: string; url: string }> {
    // TikTok API integration would go here
    
    logger.info(`Publishing to TikTok: ${content.title}`);
    
    // Placeholder - in production:
    // 1. Upload video using TikTok Content Posting API
    // 2. Set video description and hashtags
    // 3. Return video ID and URL
    
    const videoId = `tt_${Date.now()}`;
    return {
      videoId,
      url: `https://tiktok.com/@user/video/${videoId}`,
    };
  }
  
  /**
   * Get publishing queue status
   * @param userId - User ID
   * @returns Queue statistics
   */
  async getQueueStatus(userId: string): Promise<{
    pending: number;
    processing: number;
    published: number;
    failed: number;
    nextScheduled: Date | null;
  }> {
    const [pending, processing, published, failed, nextSchedule] = await Promise.all([
      prisma.contentSchedule.count({ where: { userId, status: "PENDING" } }),
      prisma.contentSchedule.count({ where: { userId, status: "PROCESSING" } }),
      prisma.contentSchedule.count({ where: { userId, status: "PUBLISHED" } }),
      prisma.contentSchedule.count({ where: { userId, status: "FAILED" } }),
      prisma.contentSchedule.findFirst({
        where: { userId, status: "PENDING" },
        orderBy: { scheduledTime: "asc" },
        select: { scheduledTime: true },
      }),
    ]);
    
    return {
      pending,
      processing,
      published,
      failed,
      nextScheduled: nextSchedule?.scheduledTime ?? null,
    };
  }
}

/** Singleton instance of SchedulingService */
export const schedulingService = new SchedulingService();
