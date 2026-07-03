/**
 * Analytics Service
 * Tracks content performance and provides monetization insights
 */

import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { optimalTimingService } from "./optimal-timing.service";
import type { AnalyticsSummary, TrendData, PlatformStats } from "../types";

/**
 * Service for tracking and analyzing content performance
 */
export class AnalyticsService {
  /**
   * Get comprehensive analytics summary for a user
   * @param userId - User ID
   * @param days - Number of days to analyze (default 30)
   * @returns Analytics summary with trends and insights
   */
  async getAnalyticsSummary(
    userId: string, 
    days: number = 30
  ): Promise<AnalyticsSummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch all analytics for the period
    const analytics = await prisma.contentAnalytics.findMany({
      where: {
        userId,
        recordedAt: { gte: startDate },
      },
      include: {
        content: true,
      },
    });
    
    // Calculate totals
    const totals = analytics.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        likes: acc.likes + item.likes,
        comments: acc.comments + item.comments,
        shares: acc.shares + item.shares,
        revenue: acc.revenue + item.revenue,
        engagementSum: acc.engagementSum + (item.engagementRate ?? 0),
      }),
      { views: 0, likes: 0, comments: 0, shares: 0, revenue: 0, engagementSum: 0 }
    );
    
    // Get top performing content
    const topPerformingContent = await prisma.content.findMany({
      where: { userId },
      include: {
        analytics: {
          where: { recordedAt: { gte: startDate } },
          orderBy: { views: "desc" },
          take: 1,
        },
      },
      orderBy: {
        analytics: {
          _count: "desc",
        },
      },
      take: 5,
    });
    
    // Calculate trends over time
    const trends = await this.calculateTrends(userId, days);
    
    // Get platform breakdown
    const platformBreakdown = await this.getPlatformBreakdown(userId, startDate);
    
    return {
      totalViews: totals.views,
      totalLikes: totals.likes,
      totalComments: totals.comments,
      totalShares: totals.shares,
      totalRevenue: totals.revenue,
      avgEngagementRate: analytics.length > 0 
        ? totals.engagementSum / analytics.length 
        : 0,
      topPerformingContent: topPerformingContent.map(c => ({
        ...c,
        analytics: c.analytics,
      })),
      recentTrends: trends,
      platformBreakdown,
    };
  }
  
  /**
   * Record analytics for a piece of content
   * @param data - Analytics data to record
   */
  async recordAnalytics(data: {
    userId: string;
    contentId: string;
    platform: string;
    platformPostId?: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    watchTime?: number;
    avgWatchPercent?: number;
    subscriberGain?: number;
    revenue?: number;
    impressions?: number;
    ctr?: number;
    demographics?: object;
  }): Promise<void> {
    // Calculate engagement rate
    const engagementRate = data.views > 0
      ? (data.likes + data.comments + data.shares) / data.views
      : 0;
    
    // Create analytics record
    await prisma.contentAnalytics.create({
      data: {
        userId: data.userId,
        contentId: data.contentId,
        platform: data.platform as "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK",
        platformPostId: data.platformPostId,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        watchTime: data.watchTime ?? 0,
        avgWatchPercent: data.avgWatchPercent,
        subscriberGain: data.subscriberGain ?? 0,
        revenue: data.revenue ?? 0,
        engagementRate,
        ctr: data.ctr,
        impressions: data.impressions ?? 0,
        demographics: data.demographics as object | undefined,
      },
    });
    
    // Update optimal timing data based on this performance
    const content = await prisma.content.findUnique({
      where: { id: data.contentId },
      include: {
        schedules: {
          where: { status: "PUBLISHED" },
          take: 1,
        },
      },
    });
    
    if (content?.schedules[0]) {
      await optimalTimingService.updateFromAnalytics({
        platform: data.platform,
        category: content.category,
        publishedAt: content.schedules[0].publishedAt ?? new Date(),
        views: data.views,
        engagementRate,
      });
    }
    
    logger.info(`Analytics recorded for content: ${data.contentId}`);
  }
  
  /**
   * Get revenue projections based on current performance
   * @param userId - User ID
   * @returns Revenue projection data
   */
  async getRevenueProjection(userId: string): Promise<{
    currentMonthRevenue: number;
    projectedMonthlyRevenue: number;
    projectedYearlyRevenue: number;
    revenueByPlatform: { platform: string; revenue: number; projected: number }[];
    growthRate: number;
    insights: string[];
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Current month revenue
    const currentMonthAnalytics = await prisma.contentAnalytics.aggregate({
      where: {
        userId,
        recordedAt: { gte: startOfMonth },
      },
      _sum: { revenue: true },
    });
    
    // Last month revenue for growth calculation
    const lastMonthAnalytics = await prisma.contentAnalytics.aggregate({
      where: {
        userId,
        recordedAt: { gte: lastMonth, lt: endOfLastMonth },
      },
      _sum: { revenue: true },
    });
    
    const currentMonthRevenue = currentMonthAnalytics._sum.revenue ?? 0;
    const lastMonthRevenue = lastMonthAnalytics._sum.revenue ?? 0;
    
    // Calculate growth rate
    const growthRate = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;
    
    // Days into month for projection
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const dailyRate = daysPassed > 0 ? currentMonthRevenue / daysPassed : 0;
    
    const projectedMonthlyRevenue = dailyRate * daysInMonth;
    const projectedYearlyRevenue = projectedMonthlyRevenue * 12;
    
    // Revenue by platform
    const platformRevenue = await prisma.contentAnalytics.groupBy({
      by: ["platform"],
      where: {
        userId,
        recordedAt: { gte: startOfMonth },
      },
      _sum: { revenue: true },
    });
    
    const revenueByPlatform = platformRevenue.map(p => ({
      platform: p.platform,
      revenue: p._sum.revenue ?? 0,
      projected: ((p._sum.revenue ?? 0) / daysPassed) * daysInMonth,
    }));
    
    // Generate insights
    const insights = this.generateRevenueInsights(
      currentMonthRevenue,
      projectedMonthlyRevenue,
      growthRate,
      revenueByPlatform
    );
    
    return {
      currentMonthRevenue,
      projectedMonthlyRevenue,
      projectedYearlyRevenue,
      revenueByPlatform,
      growthRate,
      insights,
    };
  }
  
  /**
   * Get content performance recommendations
   * @param userId - User ID
   * @returns Recommendations to improve performance
   */
  async getRecommendations(userId: string): Promise<{
    contentRecommendations: string[];
    timingRecommendations: string[];
    growthOpportunities: string[];
  }> {
    // Analyze user's content performance
    const recentAnalytics = await prisma.contentAnalytics.findMany({
      where: {
        userId,
        recordedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      include: { content: true },
    });
    
    // Analyze by category
    const categoryPerformance = new Map<string, { views: number; engagement: number; count: number }>();
    
    for (const item of recentAnalytics) {
      if (item.content) {
        const existing = categoryPerformance.get(item.content.category) ?? 
          { views: 0, engagement: 0, count: 0 };
        categoryPerformance.set(item.content.category, {
          views: existing.views + item.views,
          engagement: existing.engagement + (item.engagementRate ?? 0),
          count: existing.count + 1,
        });
      }
    }
    
    const contentRecommendations: string[] = [];
    const timingRecommendations: string[] = [];
    const growthOpportunities: string[] = [];
    
    // Find best performing categories
    let bestCategory = "";
    let bestEngagement = 0;
    
    for (const [category, stats] of categoryPerformance) {
      const avgEngagement = stats.engagement / stats.count;
      if (avgEngagement > bestEngagement) {
        bestEngagement = avgEngagement;
        bestCategory = category;
      }
    }
    
    if (bestCategory) {
      contentRecommendations.push(
        `Your ${bestCategory.toLowerCase().replace("_", " ")} content performs best - consider creating more in this category`
      );
    }
    
    // Check for underperforming content
    const avgViews = recentAnalytics.reduce((sum, a) => sum + a.views, 0) / recentAnalytics.length;
    const underperforming = recentAnalytics.filter(a => a.views < avgViews * 0.5);
    
    if (underperforming.length > 0) {
      contentRecommendations.push(
        `${underperforming.length} videos are underperforming - consider optimizing titles and thumbnails`
      );
    }
    
    // Timing recommendations
    timingRecommendations.push(
      "Post consistently at the same times to build audience expectations"
    );
    timingRecommendations.push(
      "Test posting during weekend mornings for higher toddler content engagement"
    );
    
    // Growth opportunities
    growthOpportunities.push(
      "Cross-promote content between YouTube and TikTok to maximize reach"
    );
    growthOpportunities.push(
      "Create series content to encourage subscription and return viewers"
    );
    growthOpportunities.push(
      "Engage with comments to boost algorithm visibility"
    );
    
    return {
      contentRecommendations,
      timingRecommendations,
      growthOpportunities,
    };
  }
  
  /**
   * Calculate trend data over time
   */
  private async calculateTrends(userId: string, days: number): Promise<TrendData[]> {
    const trends: TrendData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const dayAnalytics = await prisma.contentAnalytics.aggregate({
        where: {
          userId,
          recordedAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: {
          views: true,
          revenue: true,
        },
        _avg: {
          engagementRate: true,
        },
      });
      
      trends.push({
        date: startOfDay.toISOString().split("T")[0],
        views: dayAnalytics._sum.views ?? 0,
        engagement: dayAnalytics._avg.engagementRate ?? 0,
        revenue: dayAnalytics._sum.revenue ?? 0,
      });
    }
    
    return trends;
  }
  
  /**
   * Get platform breakdown statistics
   */
  private async getPlatformBreakdown(
    userId: string, 
    startDate: Date
  ): Promise<PlatformStats[]> {
    const breakdown = await prisma.contentAnalytics.groupBy({
      by: ["platform"],
      where: {
        userId,
        recordedAt: { gte: startDate },
      },
      _sum: {
        views: true,
        revenue: true,
      },
      _avg: {
        engagementRate: true,
      },
      _count: {
        contentId: true,
      },
    });
    
    return breakdown.map(item => ({
      platform: item.platform,
      contentCount: item._count.contentId,
      totalViews: item._sum.views ?? 0,
      avgEngagement: item._avg.engagementRate ?? 0,
      revenue: item._sum.revenue ?? 0,
    }));
  }
  
  /**
   * Generate revenue insights based on data
   */
  private generateRevenueInsights(
    currentRevenue: number,
    projected: number,
    growthRate: number,
    platformRevenue: { platform: string; revenue: number; projected: number }[]
  ): string[] {
    const insights: string[] = [];
    
    if (growthRate > 20) {
      insights.push(`Excellent growth! Revenue up ${growthRate.toFixed(1)}% from last month`);
    } else if (growthRate > 0) {
      insights.push(`Steady growth of ${growthRate.toFixed(1)}% month-over-month`);
    } else if (growthRate < 0) {
      insights.push(`Revenue declined ${Math.abs(growthRate).toFixed(1)}% - consider increasing content frequency`);
    }
    
    // Find best platform
    const bestPlatform = platformRevenue.sort((a, b) => b.revenue - a.revenue)[0];
    if (bestPlatform) {
      insights.push(`${bestPlatform.platform} is your top revenue platform with $${bestPlatform.revenue.toFixed(2)} this month`);
    }
    
    // Monetization tips for toddler content
    insights.push("YouTube Kids monetization requires 1000 subscribers and 4000 watch hours");
    insights.push("Consider brand partnerships for additional toddler content revenue streams");
    
    return insights;
  }
}

/** Singleton instance of AnalyticsService */
export const analyticsService = new AnalyticsService();
