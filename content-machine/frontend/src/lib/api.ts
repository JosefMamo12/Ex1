/**
 * API client for the Toddler Content Machine backend
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  ApiResponse,
  AuthResponse,
  Content,
  ContentGenerationRequest,
  ContentTemplate,
  CategoryMeta,
  StyleMeta,
  UploadTimingRecommendation,
  OptimalTimeSlot,
  ContentSchedule,
  QueueStatus,
  AnalyticsSummary,
  RevenueProjection,
  Recommendations,
  PaginatedResponse,
} from "@/types";

/**
 * API base URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/**
 * Create configured axios instance
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const apiClient = createApiClient();

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data.data as AuthResponse;
  },

  /**
   * Login user
   */
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data.data as AuthResponse;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse["user"]> {
    const response = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
      "/auth/me"
    );
    return response.data.data as AuthResponse["user"];
  },

  /**
   * Update user profile
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse["user"]> {
    const response = await apiClient.patch<ApiResponse<AuthResponse["user"]>>(
      "/auth/profile",
      data
    );
    return response.data.data as AuthResponse["user"];
  },
};

/**
 * Content API
 */
export const contentApi = {
  /**
   * Get content categories
   */
  async getCategories(): Promise<CategoryMeta[]> {
    const response = await apiClient.get<ApiResponse<CategoryMeta[]>>(
      "/content/categories"
    );
    return response.data.data as CategoryMeta[];
  },

  /**
   * Get animation styles
   */
  async getStyles(): Promise<StyleMeta[]> {
    const response = await apiClient.get<ApiResponse<StyleMeta[]>>(
      "/content/styles"
    );
    return response.data.data as StyleMeta[];
  },

  /**
   * Get content templates
   */
  async getTemplates(category?: string): Promise<ContentTemplate[]> {
    const params = category ? { category } : {};
    const response = await apiClient.get<ApiResponse<ContentTemplate[]>>(
      "/content/templates",
      { params }
    );
    return response.data.data as ContentTemplate[];
  },

  /**
   * Generate new content
   */
  async generate(data: ContentGenerationRequest): Promise<{
    success: boolean;
    videoUrl?: string;
    thumbnailUrl?: string;
    script?: string;
    error?: string;
  }> {
    const response = await apiClient.post<
      ApiResponse<{
        success: boolean;
        videoUrl?: string;
        thumbnailUrl?: string;
        script?: string;
        error?: string;
      }>
    >("/content/generate", data);
    return response.data.data as {
      success: boolean;
      videoUrl?: string;
      thumbnailUrl?: string;
      script?: string;
    };
  },

  /**
   * Get user's content
   */
  async getContent(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Content>> {
    const response = await apiClient.get<
      ApiResponse<Content[]> & {
        pagination: PaginatedResponse<Content>["pagination"];
      }
    >("/content", { params });
    return {
      data: response.data.data as Content[],
      pagination: response.data.pagination,
    };
  },

  /**
   * Get content by ID
   */
  async getContentById(id: string): Promise<Content> {
    const response = await apiClient.get<ApiResponse<Content>>(`/content/${id}`);
    return response.data.data as Content;
  },

  /**
   * Update content
   */
  async updateContent(
    id: string,
    data: { title?: string; description?: string; tags?: string[] }
  ): Promise<Content> {
    const response = await apiClient.patch<ApiResponse<Content>>(
      `/content/${id}`,
      data
    );
    return response.data.data as Content;
  },

  /**
   * Delete content
   */
  async deleteContent(id: string): Promise<void> {
    await apiClient.delete(`/content/${id}`);
  },
};

/**
 * Scheduling API
 */
export const schedulingApi = {
  /**
   * Get optimal upload times
   */
  async getOptimalTimes(
    platform: string,
    category: string,
    timezone?: string
  ): Promise<UploadTimingRecommendation> {
    const response = await apiClient.get<ApiResponse<UploadTimingRecommendation>>(
      "/schedule/optimal-times",
      { params: { platform, category, timezone } }
    );
    return response.data.data as UploadTimingRecommendation;
  },

  /**
   * Get next optimal upload window
   */
  async getNextOptimal(
    platform: string,
    category: string,
    timezone?: string
  ): Promise<{ scheduledTime: string; slot: OptimalTimeSlot }> {
    const response = await apiClient.get<
      ApiResponse<{ scheduledTime: string; slot: OptimalTimeSlot }>
    >("/schedule/next-optimal", { params: { platform, category, timezone } });
    return response.data.data as { scheduledTime: string; slot: OptimalTimeSlot };
  },

  /**
   * Schedule content
   */
  async scheduleContent(data: {
    contentId: string;
    platformConnectionId: string;
    scheduledTime: string;
    timezone?: string;
    useOptimalTime?: boolean;
  }): Promise<ContentSchedule> {
    const response = await apiClient.post<ApiResponse<ContentSchedule>>(
      "/schedule",
      data
    );
    return response.data.data as ContentSchedule;
  },

  /**
   * Get scheduled content
   */
  async getScheduledContent(status?: string): Promise<ContentSchedule[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<ApiResponse<ContentSchedule[]>>(
      "/schedule",
      { params }
    );
    return response.data.data as ContentSchedule[];
  },

  /**
   * Cancel schedule
   */
  async cancelSchedule(id: string): Promise<void> {
    await apiClient.delete(`/schedule/${id}`);
  },

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<QueueStatus> {
    const response = await apiClient.get<ApiResponse<QueueStatus>>(
      "/schedule/queue-status"
    );
    return response.data.data as QueueStatus;
  },
};

/**
 * Analytics API
 */
export const analyticsApi = {
  /**
   * Get analytics summary
   */
  async getSummary(days?: number): Promise<AnalyticsSummary> {
    const params = days ? { days } : {};
    const response = await apiClient.get<ApiResponse<AnalyticsSummary>>(
      "/analytics/summary",
      { params }
    );
    return response.data.data as AnalyticsSummary;
  },

  /**
   * Get revenue projection
   */
  async getRevenue(): Promise<RevenueProjection> {
    const response = await apiClient.get<ApiResponse<RevenueProjection>>(
      "/analytics/revenue"
    );
    return response.data.data as RevenueProjection;
  },

  /**
   * Get recommendations
   */
  async getRecommendations(): Promise<Recommendations> {
    const response = await apiClient.get<ApiResponse<Recommendations>>(
      "/analytics/recommendations"
    );
    return response.data.data as Recommendations;
  },
};

export { apiClient };
