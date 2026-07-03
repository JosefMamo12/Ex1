/**
 * Main Dashboard page
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  Plus,
  Video,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { OptimalTimesCard } from "@/components/dashboard/OptimalTimesCard";
import { useAuthStore } from "@/lib/store";
import { getGreeting, formatNumber, formatCurrency } from "@/lib/utils";

/**
 * Mock data for demonstration
 * In production, this would come from API
 */
const mockStats = {
  totalViews: 245892,
  totalLikes: 18234,
  totalComments: 4521,
  totalRevenue: 1847.32,
  viewsChange: 12.5,
  likesChange: 8.3,
  commentsChange: -2.1,
  revenueChange: 15.8,
};

const mockOptimalTimes = {
  platform: "YouTube",
  category: "Nursery Rhymes",
  bestTimes: [
    {
      dayOfWeek: 6,
      dayName: "Saturday",
      hourOfDay: 9,
      formattedTime: "9:00 AM",
      score: 92,
      avgViews: 4500,
      avgEngagement: 0.078,
      recommendation: "Excellent - Highly Recommended",
    },
    {
      dayOfWeek: 0,
      dayName: "Sunday",
      hourOfDay: 10,
      formattedTime: "10:00 AM",
      score: 88,
      avgViews: 4200,
      avgEngagement: 0.072,
      recommendation: "Excellent - Highly Recommended",
    },
    {
      dayOfWeek: 5,
      dayName: "Friday",
      hourOfDay: 17,
      formattedTime: "5:00 PM",
      score: 85,
      avgViews: 3800,
      avgEngagement: 0.068,
      recommendation: "Excellent - Highly Recommended",
    },
    {
      dayOfWeek: 3,
      dayName: "Wednesday",
      hourOfDay: 18,
      formattedTime: "6:00 PM",
      score: 78,
      avgViews: 3200,
      avgEngagement: 0.062,
      recommendation: "Good - Recommended",
    },
    {
      dayOfWeek: 1,
      dayName: "Monday",
      hourOfDay: 7,
      formattedTime: "7:00 AM",
      score: 72,
      avgViews: 2800,
      avgEngagement: 0.055,
      recommendation: "Good - Recommended",
    },
  ],
  insights: [
    "Weekend mornings (9-11 AM) have the highest engagement for nursery rhymes",
    "Friday evening uploads perform exceptionally well as parents prepare for weekends",
    "Avoid uploading between 2-5 PM on weekdays - lowest toddler screen time",
  ],
};

const mockRecentContent = [
  {
    id: "1",
    title: "ABC Song - Learn the Alphabet!",
    status: "PUBLISHED",
    views: 12450,
    thumbnail: "🔤",
  },
  {
    id: "2",
    title: "Count to 10 with Animals",
    status: "SCHEDULED",
    views: 0,
    thumbnail: "🔢",
  },
  {
    id: "3",
    title: "Colors of the Rainbow",
    status: "READY",
    views: 0,
    thumbnail: "🌈",
  },
];

/**
 * Dashboard Page component
 */
export default function DashboardPage(): React.JSX.Element {
  const { user } = useAuthStore();
  const greeting = getGreeting();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.firstName ?? "Creator"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's how your content is performing
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button leftIcon={<Plus className="w-5 h-5" />}>
            Create New Video
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Views"
          value={mockStats.totalViews}
          change={mockStats.viewsChange}
          icon={<Eye className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Likes"
          value={mockStats.totalLikes}
          change={mockStats.likesChange}
          icon={<Heart className="w-6 h-6" />}
          color="pink"
        />
        <StatsCard
          title="Comments"
          value={mockStats.totalComments}
          change={mockStats.commentsChange}
          icon={<MessageCircle className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Revenue"
          value={mockStats.totalRevenue}
          format="currency"
          change={mockStats.revenueChange}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Content & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/create"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-toddler-pink/10 to-toddler-purple/10 hover:from-toddler-pink/20 hover:to-toddler-purple/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center mb-2">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    New Video
                  </span>
                </Link>
                <Link
                  href="/dashboard/content"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-toddler-blue/10 to-toddler-green/10 hover:from-toddler-blue/20 hover:to-toddler-green/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-toddler-blue to-toddler-green flex items-center justify-center mb-2">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    My Content
                  </span>
                </Link>
                <Link
                  href="/dashboard/schedule"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-toddler-yellow/10 to-toddler-orange/10 hover:from-toddler-yellow/20 hover:to-toddler-orange/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-toddler-yellow to-toddler-orange flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Schedule
                  </span>
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-toddler-green/10 to-toddler-blue/10 hover:from-toddler-green/20 hover:to-toddler-blue/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-toddler-green to-toddler-blue flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Analytics
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-toddler-purple" />
                Recent Content
              </CardTitle>
              <Link
                href="/dashboard/content"
                className="text-sm text-toddler-purple hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-toddler-pink/30 to-toddler-purple/30 flex items-center justify-center text-2xl">
                      {content.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {content.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            content.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : content.status === "SCHEDULED"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {content.status}
                        </span>
                        {content.views > 0 && (
                          <span className="text-xs text-gray-500">
                            {formatNumber(content.views)} views
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Optimal Times */}
        <div>
          <OptimalTimesCard
            platform={mockOptimalTimes.platform}
            category={mockOptimalTimes.category}
            bestTimes={mockOptimalTimes.bestTimes}
            insights={mockOptimalTimes.insights}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
