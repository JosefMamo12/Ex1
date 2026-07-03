/**
 * Utility functions for the frontend
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Format duration in seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get category display name
 */
export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    NURSERY_RHYMES: "Nursery Rhymes",
    COUNTING: "Counting & Numbers",
    ALPHABET: "Alphabet & Letters",
    COLORS: "Colors",
    SHAPES: "Shapes",
    ANIMALS: "Animals",
    VEHICLES: "Vehicles",
    NATURE: "Nature",
    BEDTIME: "Bedtime & Lullabies",
    EDUCATIONAL: "Educational",
    MUSIC_DANCE: "Music & Dance",
    STORIES: "Stories",
  };
  return names[category] ?? category;
}

/**
 * Get style display name
 */
export function getStyleName(style: string): string {
  const names: Record<string, string> = {
    CARTOON_2D: "2D Cartoon",
    CARTOON_3D: "3D Cartoon",
    CLAY_ANIMATION: "Clay Animation",
    WATERCOLOR: "Watercolor",
    PIXEL_ART: "Pixel Art",
    REALISTIC: "Semi-Realistic",
    MINIMALIST: "Minimalist",
    COLORFUL_ABSTRACT: "Colorful Abstract",
  };
  return names[style] ?? style;
}

/**
 * Get status display info
 */
export function getStatusInfo(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Draft", color: "gray" },
    GENERATING: { label: "Generating", color: "blue" },
    READY: { label: "Ready", color: "green" },
    SCHEDULED: { label: "Scheduled", color: "yellow" },
    PUBLISHED: { label: "Published", color: "purple" },
    FAILED: { label: "Failed", color: "red" },
    ARCHIVED: { label: "Archived", color: "gray" },
    PENDING: { label: "Pending", color: "yellow" },
    PROCESSING: { label: "Processing", color: "blue" },
    CANCELLED: { label: "Cancelled", color: "gray" },
  };
  return statusMap[status] ?? { label: status, color: "gray" };
}

/**
 * Get platform icon info
 */
export function getPlatformInfo(platform: string): { name: string; color: string } {
  const platforms: Record<string, { name: string; color: string }> = {
    YOUTUBE: { name: "YouTube", color: "#FF0000" },
    TIKTOK: { name: "TikTok", color: "#000000" },
    INSTAGRAM: { name: "Instagram", color: "#E4405F" },
    FACEBOOK: { name: "Facebook", color: "#1877F2" },
  };
  return platforms[platform] ?? { name: platform, color: "#666666" };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Calculate time until date
 */
export function getTimeUntil(date: string | Date): string {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff < 0) return "Past due";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes} minutes`;
}
