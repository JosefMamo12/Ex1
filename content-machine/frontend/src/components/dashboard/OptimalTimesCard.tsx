/**
 * Optimal Upload Times display card
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Clock, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OptimalTimeSlot } from "@/types";

/**
 * Optimal Times Card props
 */
interface OptimalTimesCardProps {
  platform: string;
  category: string;
  bestTimes: OptimalTimeSlot[];
  insights: string[];
  loading?: boolean;
}

/**
 * Score badge color based on score value
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  if (score >= 40) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

/**
 * Optimal Times Card component
 * Displays recommended upload times with scores
 */
export function OptimalTimesCard({
  platform,
  category,
  bestTimes,
  insights,
  loading = false,
}: OptimalTimesCardProps): React.JSX.Element {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-toddler-purple" />
            Best Times to Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-toddler-purple" />
          Best Times to Upload
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-lg">{platform}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-lg">{category}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Best times list */}
        <div className="space-y-3 mb-6">
          {bestTimes.slice(0, 5).map((slot, index) => (
            <div
              key={`${slot.dayOfWeek}-${slot.hourOfDay}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all",
                index === 0
                  ? "bg-gradient-to-r from-toddler-green/20 to-toddler-blue/10 border border-toddler-green/30"
                  : "bg-gray-50 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                {index === 0 && (
                  <div className="p-1.5 bg-toddler-yellow rounded-lg">
                    <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {slot.dayName} at {slot.formattedTime}
                  </p>
                  <p className="text-xs text-gray-500">{slot.recommendation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-lg",
                    getScoreColor(slot.score)
                  )}
                >
                  {slot.score}%
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    ~{Math.round(slot.avgViews).toLocaleString()} views
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-toddler-purple" />
            <h4 className="font-medium text-gray-900">Insights</h4>
          </div>
          <ul className="space-y-2">
            {insights.slice(0, 3).map((insight, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-toddler-purple" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
