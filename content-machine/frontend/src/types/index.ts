/**
 * Frontend type definitions for the Toddler Content Machine
 */

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "ADMIN" | "CREATOR" | "VIEWER";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: string;
}

/**
 * Content categories for toddler videos
 */
export type ContentCategory =
  | "NURSERY_RHYMES"
  | "COUNTING"
  | "ALPHABET"
  | "COLORS"
  | "SHAPES"
  | "ANIMALS"
  | "VEHICLES"
  | "NATURE"
  | "BEDTIME"
  | "EDUCATIONAL"
  | "MUSIC_DANCE"
  | "STORIES";

/**
 * Animation styles
 */
export type AnimationStyle =
  | "CARTOON_2D"
  | "CARTOON_3D"
  | "CLAY_ANIMATION"
  | "WATERCOLOR"
  | "PIXEL_ART"
  | "REALISTIC"
  | "MINIMALIST"
  | "COLORFUL_ABSTRACT";

/**
 * Content status
 */
export type ContentStatus =
  | "DRAFT"
  | "GENERATING"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED"
  | "FAILED"
  | "ARCHIVED";

/**
 * Platform types
 */
export type Platform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK";

/**
 * Content item
 */
export interface Content {
  id: string;
  userId: string;
  templateId: string | null;
  title: string;
  description: string | null;
  script: string | null;
  voiceOverUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  status: ContentStatus;
  generationPrompt: string | null;
  category: ContentCategory;
  ageRange: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Content generation request
 */
export interface ContentGenerationRequest {
  templateId?: string;
  title: string;
  category: ContentCategory;
  ageRange?: string;
  style?: AnimationStyle;
  duration?: number;
  customPrompt?: string;
  generateVoiceover?: boolean;
  generateThumbnail?: boolean;
  tags?: string[];
}

/**
 * Content template
 */
export interface ContentTemplate {
  id: string;
  name: string;
  description: string | null;
  category: ContentCategory;
  style: AnimationStyle;
  duration: number;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
}

/**
 * Category metadata
 */
export interface CategoryMeta {
  id: ContentCategory;
  name: string;
  description: string;
  suggestedDuration: number;
}

/**
 * Style metadata
 */
export interface StyleMeta {
  id: AnimationStyle;
  name: string;
  description: string;
}

/**
 * Optimal time slot
 */
export interface OptimalTimeSlot {
  dayOfWeek: number;
  dayName: string;
  hourOfDay: number;
  formattedTime: string;
  score: number;
  avgViews: number;
  avgEngagement: number;
  recommendation: string;
}

/**
 * Upload timing recommendations
 */
export interface UploadTimingRecommendation {
  platform: string;
  category: string;
  timezone: string;
  bestTimes: OptimalTimeSlot[];
  worstTimes: OptimalTimeSlot[];
  insights: string[];
}

/**
 * Content schedule
 */
export interface ContentSchedule {
  id: string;
  userId: string;
  contentId: string;
  platformConnectionId: string;
  scheduledTime: string;
  timezone: string;
  isOptimalTime: boolean;
  optimizationScore: number | null;
  status: "PENDING" | "PROCESSING" | "PUBLISHED" | "FAILED" | "CANCELLED";
  publishedAt: string | null;
  platformPostId: string | null;
  platformUrl: string | null;
  content?: Content;
  platformConnection?: {
    id: string;
    platform: Platform;
    channelName: string | null;
  };
}

/**
 * Platform connection
 */
export interface PlatformConnection {
  id: string;
  platform: Platform;
  channelId: string | null;
  channelName: string | null;
  isActive: boolean;
}

/**
 * Queue status
 */
export interface QueueStatus {
  pending: number;
  processing: number;
  published: number;
  failed: number;
  nextScheduled: string | null;
}

/**
 * Analytics summary
 */
export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalRevenue: number;
  avgEngagementRate: number;
  topPerformingContent: Content[];
  recentTrends: TrendData[];
  platformBreakdown: PlatformStats[];
}

/**
 * Trend data point
 */
export interface TrendData {
  date: string;
  views: number;
  engagement: number;
  revenue: number;
}

/**
 * Platform statistics
 */
export interface PlatformStats {
  platform: string;
  contentCount: number;
  totalViews: number;
  avgEngagement: number;
  revenue: number;
}

/**
 * Revenue projection
 */
export interface RevenueProjection {
  currentMonthRevenue: number;
  projectedMonthlyRevenue: number;
  projectedYearlyRevenue: number;
  revenueByPlatform: { platform: string; revenue: number; projected: number }[];
  growthRate: number;
  insights: string[];
}

/**
 * Recommendations
 */
export interface Recommendations {
  contentRecommendations: string[];
  timingRecommendations: string[];
  growthOpportunities: string[];
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
