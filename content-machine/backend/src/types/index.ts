/**
 * Core type definitions for the Content Machine application
 */

import { 
  User, 
  Content, 
  ContentTemplate, 
  PlatformConnection,
  ContentSchedule,
  ContentAnalytics 
} from "@prisma/client";

/**
 * JWT payload structure for authenticated users
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Request object extended with authenticated user
 */
export interface AuthenticatedRequest {
  user: JwtPayload;
}

/**
 * User registration data transfer object
 */
export interface UserRegistrationDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * User login data transfer object
 */
export interface UserLoginDTO {
  email: string;
  password: string;
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  user: Omit<User, "passwordHash">;
  accessToken: string;
  expiresIn: string;
}

/**
 * Content generation request parameters
 */
export interface ContentGenerationRequest {
  templateId?: string;
  title: string;
  category: string;
  ageRange?: string;
  style?: string;
  duration?: number;
  customPrompt?: string;
  generateVoiceover?: boolean;
  generateThumbnail?: boolean;
  tags?: string[];
}

/**
 * AI generation result
 */
export interface AIGenerationResult {
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  voiceOverUrl?: string;
  script?: string;
  error?: string;
  processingTime?: number;
}

/**
 * Optimal upload time slot
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
 * Platform-specific upload timing recommendations
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
 * Content scheduling request
 */
export interface ScheduleContentRequest {
  contentId: string;
  platformConnectionId: string;
  scheduledTime: Date;
  timezone?: string;
  useOptimalTime?: boolean;
}

/**
 * Analytics summary for dashboard
 */
export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalRevenue: number;
  avgEngagementRate: number;
  topPerformingContent: ContentWithAnalytics[];
  recentTrends: TrendData[];
  platformBreakdown: PlatformStats[];
}

/**
 * Content with analytics data
 */
export interface ContentWithAnalytics extends Content {
  analytics: ContentAnalytics[];
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
 * Toddler content categories with metadata
 */
export const TODDLER_CATEGORIES = {
  NURSERY_RHYMES: {
    name: "Nursery Rhymes",
    description: "Classic and modern nursery rhymes with animations",
    suggestedDuration: 120,
    keywords: ["rhyme", "sing-along", "music", "lyrics"],
  },
  COUNTING: {
    name: "Counting & Numbers",
    description: "Learn numbers through fun counting activities",
    suggestedDuration: 90,
    keywords: ["numbers", "counting", "math", "learning"],
  },
  ALPHABET: {
    name: "Alphabet & Letters",
    description: "ABC learning with engaging visuals",
    suggestedDuration: 90,
    keywords: ["ABC", "letters", "phonics", "reading"],
  },
  COLORS: {
    name: "Colors",
    description: "Colorful adventures teaching color recognition",
    suggestedDuration: 60,
    keywords: ["colors", "rainbow", "visual", "art"],
  },
  SHAPES: {
    name: "Shapes",
    description: "Geometric fun with basic shapes",
    suggestedDuration: 60,
    keywords: ["shapes", "geometry", "visual learning"],
  },
  ANIMALS: {
    name: "Animals",
    description: "Discover animals and their sounds",
    suggestedDuration: 90,
    keywords: ["animals", "pets", "wildlife", "farm"],
  },
  VEHICLES: {
    name: "Vehicles",
    description: "Cars, trucks, and things that go",
    suggestedDuration: 90,
    keywords: ["cars", "trucks", "trains", "planes"],
  },
  NATURE: {
    name: "Nature",
    description: "Explore the natural world",
    suggestedDuration: 90,
    keywords: ["nature", "plants", "weather", "outdoors"],
  },
  BEDTIME: {
    name: "Bedtime & Lullabies",
    description: "Calming content for sleep time",
    suggestedDuration: 180,
    keywords: ["sleep", "lullaby", "calm", "relaxing"],
  },
  EDUCATIONAL: {
    name: "General Educational",
    description: "Various educational topics for toddlers",
    suggestedDuration: 120,
    keywords: ["learning", "educational", "development"],
  },
  MUSIC_DANCE: {
    name: "Music & Dance",
    description: "Interactive music and movement",
    suggestedDuration: 90,
    keywords: ["dance", "music", "movement", "exercise"],
  },
  STORIES: {
    name: "Stories",
    description: "Short animated stories for toddlers",
    suggestedDuration: 180,
    keywords: ["story", "tale", "adventure", "imagination"],
  },
} as const;

/**
 * Animation style options with descriptions
 */
export const ANIMATION_STYLES = {
  CARTOON_2D: {
    name: "2D Cartoon",
    description: "Classic flat cartoon style with bold colors",
    bestFor: ["nursery rhymes", "alphabet", "counting"],
  },
  CARTOON_3D: {
    name: "3D Cartoon",
    description: "Modern 3D animated characters",
    bestFor: ["stories", "vehicles", "animals"],
  },
  CLAY_ANIMATION: {
    name: "Clay Animation",
    description: "Stop-motion claymation style",
    bestFor: ["stories", "animals", "shapes"],
  },
  WATERCOLOR: {
    name: "Watercolor",
    description: "Soft, artistic watercolor illustrations",
    bestFor: ["bedtime", "nature", "stories"],
  },
  PIXEL_ART: {
    name: "Pixel Art",
    description: "Retro-style pixel graphics",
    bestFor: ["games", "counting", "shapes"],
  },
  REALISTIC: {
    name: "Semi-Realistic",
    description: "More realistic animated style",
    bestFor: ["animals", "nature", "educational"],
  },
  MINIMALIST: {
    name: "Minimalist",
    description: "Simple, clean geometric designs",
    bestFor: ["colors", "shapes", "counting"],
  },
  COLORFUL_ABSTRACT: {
    name: "Colorful Abstract",
    description: "Bright, abstract visual patterns",
    bestFor: ["music", "colors", "bedtime"],
  },
} as const;

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
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
