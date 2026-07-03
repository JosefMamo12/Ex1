/**
 * Optimal Upload Timing Service
 * Analyzes platform data to recommend the best times to upload toddler content
 */

import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import type { OptimalTimeSlot, UploadTimingRecommendation } from "../types";

/**
 * Day names for display
 */
const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday"
];

/**
 * Platform-specific timing data based on industry research
 * Note: These are baseline values; actual optimization uses real analytics
 */
const PLATFORM_BASELINE_DATA: Record<string, Record<string, number[]>> = {
  YOUTUBE: {
    // Peak hours for toddler content (parents browsing)
    weekday: [7, 8, 9, 12, 17, 18, 19, 20], // Morning routine, lunch, evening
    weekend: [8, 9, 10, 11, 14, 15, 16, 19, 20], // More flexible weekend viewing
    bestDays: [5, 6, 0], // Friday, Saturday, Sunday
  },
  TIKTOK: {
    weekday: [6, 7, 8, 12, 17, 18, 19, 20, 21],
    weekend: [9, 10, 11, 14, 15, 16, 17, 20, 21],
    bestDays: [2, 4, 5], // Tuesday, Thursday, Friday
  },
  INSTAGRAM: {
    weekday: [7, 8, 12, 17, 18, 19],
    weekend: [10, 11, 14, 15, 16, 19],
    bestDays: [1, 3, 5], // Monday, Wednesday, Friday
  },
  FACEBOOK: {
    weekday: [9, 12, 13, 15, 16, 19],
    weekend: [12, 13, 14, 15, 16],
    bestDays: [3, 4, 5], // Wednesday, Thursday, Friday
  },
};

/**
 * Category-specific timing adjustments
 * Some categories perform better at certain times
 */
const CATEGORY_TIME_ADJUSTMENTS: Record<string, { peakHours: number[]; boost: number }> = {
  BEDTIME: {
    peakHours: [18, 19, 20, 21], // Evening/night
    boost: 25,
  },
  NURSERY_RHYMES: {
    peakHours: [7, 8, 9, 17, 18, 19], // Morning and evening routines
    boost: 20,
  },
  EDUCATIONAL: {
    peakHours: [9, 10, 11, 14, 15, 16], // Learning hours
    boost: 15,
  },
  MUSIC_DANCE: {
    peakHours: [10, 11, 15, 16, 17], // Active play times
    boost: 15,
  },
  COUNTING: {
    peakHours: [9, 10, 14, 15], // Focused learning times
    boost: 10,
  },
  ALPHABET: {
    peakHours: [9, 10, 14, 15], // Focused learning times
    boost: 10,
  },
};

/**
 * Service for calculating optimal upload times
 */
export class OptimalTimingService {
  /**
   * Get optimal upload time recommendations for a specific platform and category
   * @param platform - Target platform (YOUTUBE, TIKTOK, etc.)
   * @param category - Content category
   * @param timezone - User's timezone
   * @returns Upload timing recommendations
   */
  async getOptimalTimes(
    platform: string,
    category: string,
    timezone: string = "UTC"
  ): Promise<UploadTimingRecommendation> {
    logger.info(`Calculating optimal times for ${platform} - ${category}`);
    
    // First, check for stored analytics-based data
    const storedData = await this.getStoredOptimalTimes(platform, category, timezone);
    
    // Calculate scores for all time slots
    const allTimeSlots = this.calculateAllTimeSlots(platform, category, storedData);
    
    // Sort by score and get best and worst times
    const sortedSlots = [...allTimeSlots].sort((a, b) => b.score - a.score);
    const bestTimes = sortedSlots.slice(0, 5);
    const worstTimes = sortedSlots.slice(-5).reverse();
    
    // Generate insights based on the data
    const insights = this.generateInsights(platform, category, bestTimes);
    
    return {
      platform,
      category,
      timezone,
      bestTimes,
      worstTimes,
      insights,
    };
  }
  
  /**
   * Get the single best upload time for quick scheduling
   * @param platform - Target platform
   * @param category - Content category
   * @param timezone - User's timezone
   * @returns Best time slot
   */
  async getBestUploadTime(
    platform: string,
    category: string,
    timezone: string = "UTC"
  ): Promise<OptimalTimeSlot> {
    const recommendations = await this.getOptimalTimes(platform, category, timezone);
    return recommendations.bestTimes[0];
  }
  
  /**
   * Get next optimal upload window from current time
   * @param platform - Target platform
   * @param category - Content category
   * @param timezone - User's timezone
   * @returns Next available optimal time slot
   */
  async getNextOptimalWindow(
    platform: string,
    category: string,
    timezone: string = "UTC"
  ): Promise<{ scheduledTime: Date; slot: OptimalTimeSlot }> {
    const recommendations = await this.getOptimalTimes(platform, category, timezone);
    const now = new Date();
    const currentDay = now.getUTCDay();
    const currentHour = now.getUTCHours();
    
    // Find the next best time slot that's in the future
    for (const slot of recommendations.bestTimes) {
      // Check if this slot is later today
      if (slot.dayOfWeek === currentDay && slot.hourOfDay > currentHour) {
        const scheduledTime = new Date(now);
        scheduledTime.setUTCHours(slot.hourOfDay, 0, 0, 0);
        return { scheduledTime, slot };
      }
      
      // Check future days
      let daysUntil = slot.dayOfWeek - currentDay;
      if (daysUntil <= 0 || (daysUntil === 0 && slot.hourOfDay <= currentHour)) {
        daysUntil += 7;
      }
      
      const scheduledTime = new Date(now);
      scheduledTime.setUTCDate(scheduledTime.getUTCDate() + daysUntil);
      scheduledTime.setUTCHours(slot.hourOfDay, 0, 0, 0);
      
      return { scheduledTime, slot };
    }
    
    // Fallback to first best time next week
    const slot = recommendations.bestTimes[0];
    const scheduledTime = new Date(now);
    scheduledTime.setUTCDate(scheduledTime.getUTCDate() + 7);
    scheduledTime.setUTCHours(slot.hourOfDay, 0, 0, 0);
    
    return { scheduledTime, slot };
  }
  
  /**
   * Update optimal time data based on actual content performance
   * @param analytics - Content analytics data
   */
  async updateFromAnalytics(analytics: {
    platform: string;
    category: string;
    publishedAt: Date;
    views: number;
    engagementRate: number;
  }): Promise<void> {
    const dayOfWeek = analytics.publishedAt.getUTCDay();
    const hourOfDay = analytics.publishedAt.getUTCHours();
    
    // Upsert the optimal time data
    await prisma.optimalUploadTime.upsert({
      where: {
        platform_category_dayOfWeek_hourOfDay_timezone: {
          platform: analytics.platform as "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK",
          category: analytics.category as "NURSERY_RHYMES" | "COUNTING" | "ALPHABET" | "COLORS" | "SHAPES" | "ANIMALS" | "VEHICLES" | "NATURE" | "BEDTIME" | "EDUCATIONAL" | "MUSIC_DANCE" | "STORIES",
          dayOfWeek,
          hourOfDay,
          timezone: "UTC",
        },
      },
      update: {
        avgViews: analytics.views,
        avgEngagement: analytics.engagementRate,
        sampleSize: { increment: 1 },
        score: this.calculateScore(analytics.views, analytics.engagementRate),
        updatedAt: new Date(),
      },
      create: {
        platform: analytics.platform as "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK",
        category: analytics.category as "NURSERY_RHYMES" | "COUNTING" | "ALPHABET" | "COLORS" | "SHAPES" | "ANIMALS" | "VEHICLES" | "NATURE" | "BEDTIME" | "EDUCATIONAL" | "MUSIC_DANCE" | "STORIES",
        dayOfWeek,
        hourOfDay,
        timezone: "UTC",
        score: this.calculateScore(analytics.views, analytics.engagementRate),
        avgViews: analytics.views,
        avgEngagement: analytics.engagementRate,
        sampleSize: 1,
      },
    });
    
    logger.info(`Updated optimal time data for ${analytics.platform} - ${analytics.category}`);
  }
  
  /**
   * Get stored optimal times from database
   */
  private async getStoredOptimalTimes(
    platform: string,
    category: string,
    timezone: string
  ): Promise<Map<string, { score: number; avgViews: number; avgEngagement: number }>> {
    const stored = await prisma.optimalUploadTime.findMany({
      where: {
        platform: platform as "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK",
        category: category as "NURSERY_RHYMES" | "COUNTING" | "ALPHABET" | "COLORS" | "SHAPES" | "ANIMALS" | "VEHICLES" | "NATURE" | "BEDTIME" | "EDUCATIONAL" | "MUSIC_DANCE" | "STORIES",
        timezone,
        sampleSize: { gte: 3 }, // Only use data with sufficient samples
      },
    });
    
    const map = new Map<string, { score: number; avgViews: number; avgEngagement: number }>();
    
    for (const item of stored) {
      const key = `${item.dayOfWeek}-${item.hourOfDay}`;
      map.set(key, {
        score: item.score,
        avgViews: item.avgViews ?? 0,
        avgEngagement: item.avgEngagement ?? 0,
      });
    }
    
    return map;
  }
  
  /**
   * Calculate time slots with scores for all days/hours
   */
  private calculateAllTimeSlots(
    platform: string,
    category: string,
    storedData: Map<string, { score: number; avgViews: number; avgEngagement: number }>
  ): OptimalTimeSlot[] {
    const slots: OptimalTimeSlot[] = [];
    const platformData = PLATFORM_BASELINE_DATA[platform] ?? PLATFORM_BASELINE_DATA["YOUTUBE"];
    const categoryAdjustment = CATEGORY_TIME_ADJUSTMENTS[category];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        const isWeekend = day === 0 || day === 6;
        const peakHours = isWeekend ? platformData.weekend : platformData.weekday;
        
        // Calculate base score
        let score = 30; // Base score
        
        // Boost for platform peak hours
        if (peakHours.includes(hour)) {
          score += 30;
        }
        
        // Boost for best days
        if (platformData.bestDays.includes(day)) {
          score += 15;
        }
        
        // Category-specific boost
        if (categoryAdjustment?.peakHours.includes(hour)) {
          score += categoryAdjustment.boost;
        }
        
        // Apply stored analytics data if available (overrides baseline)
        const stored = storedData.get(key);
        if (stored) {
          score = stored.score; // Use actual performance data
        }
        
        // Penalize very early/late hours for toddler content
        if (hour < 6 || hour > 21) {
          score -= 20;
        }
        
        // Ensure score is within bounds
        score = Math.max(0, Math.min(100, score));
        
        slots.push({
          dayOfWeek: day,
          dayName: DAY_NAMES[day],
          hourOfDay: hour,
          formattedTime: this.formatTime(hour),
          score,
          avgViews: stored?.avgViews ?? this.estimateViews(score),
          avgEngagement: stored?.avgEngagement ?? this.estimateEngagement(score),
          recommendation: this.getRecommendation(score),
        });
      }
    }
    
    return slots;
  }
  
  /**
   * Generate insights based on timing data
   */
  private generateInsights(
    platform: string,
    category: string,
    bestTimes: OptimalTimeSlot[]
  ): string[] {
    const insights: string[] = [];
    
    // Day pattern insight
    const bestDays = [...new Set(bestTimes.map(t => t.dayName))];
    insights.push(
      `Best days for ${category.toLowerCase().replace("_", " ")} content on ${platform}: ${bestDays.join(", ")}`
    );
    
    // Time pattern insight
    const avgHour = Math.round(
      bestTimes.reduce((sum, t) => sum + t.hourOfDay, 0) / bestTimes.length
    );
    insights.push(
      `Peak viewing time is around ${this.formatTime(avgHour)} when parents are most active`
    );
    
    // Category-specific insight
    const categoryInsights: Record<string, string> = {
      BEDTIME: "Bedtime content performs best in evening hours (6-9 PM) as part of wind-down routines",
      NURSERY_RHYMES: "Nursery rhymes see high engagement during morning routines and evening playtime",
      EDUCATIONAL: "Educational content peaks during traditional 'learning hours' (9 AM - 4 PM)",
      MUSIC_DANCE: "Active content like music and dance performs best during afternoon playtime",
    };
    
    if (categoryInsights[category]) {
      insights.push(categoryInsights[category]);
    }
    
    // Platform-specific insight
    const platformInsights: Record<string, string> = {
      YOUTUBE: "YouTube Kids has high engagement on weekends when families have more screen time",
      TIKTOK: "TikTok parents browse frequently during commute times and lunch breaks",
      INSTAGRAM: "Instagram Reels for kids content performs well during evening scroll sessions",
    };
    
    if (platformInsights[platform]) {
      insights.push(platformInsights[platform]);
    }
    
    return insights;
  }
  
  /**
   * Calculate score from views and engagement
   */
  private calculateScore(views: number, engagementRate: number): number {
    // Normalize views (assuming 10000 views is excellent for toddler content)
    const viewScore = Math.min(50, (views / 10000) * 50);
    // Engagement rate up to 50 points (10% engagement is excellent)
    const engagementScore = Math.min(50, (engagementRate / 0.1) * 50);
    
    return Math.round(viewScore + engagementScore);
  }
  
  /**
   * Estimate views based on score
   */
  private estimateViews(score: number): number {
    return Math.round((score / 100) * 5000 + Math.random() * 1000);
  }
  
  /**
   * Estimate engagement based on score
   */
  private estimateEngagement(score: number): number {
    return Number(((score / 100) * 0.08 + Math.random() * 0.02).toFixed(3));
  }
  
  /**
   * Format hour to readable time string
   */
  private formatTime(hour: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  }
  
  /**
   * Get recommendation text based on score
   */
  private getRecommendation(score: number): string {
    if (score >= 80) return "Excellent - Highly Recommended";
    if (score >= 60) return "Good - Recommended";
    if (score >= 40) return "Fair - Acceptable";
    if (score >= 20) return "Poor - Not Recommended";
    return "Avoid - Very Low Engagement";
  }
}

/** Singleton instance of OptimalTimingService */
export const optimalTimingService = new OptimalTimingService();
