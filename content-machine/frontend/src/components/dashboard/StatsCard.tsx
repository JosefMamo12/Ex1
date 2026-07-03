/**
 * Statistics Card component for dashboard
 */

import React from "react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Stats Card props
 */
interface StatsCardProps {
  title: string;
  value: number;
  format?: "number" | "currency" | "percentage";
  change?: number;
  icon: React.ReactNode;
  color: "pink" | "purple" | "blue" | "green" | "yellow" | "orange";
}

/**
 * Color mappings for gradient backgrounds
 */
const colorMap = {
  pink: "from-toddler-pink/20 to-toddler-pink/5",
  purple: "from-toddler-purple/20 to-toddler-purple/5",
  blue: "from-toddler-blue/20 to-toddler-blue/5",
  green: "from-toddler-green/20 to-toddler-green/5",
  yellow: "from-toddler-yellow/20 to-toddler-yellow/5",
  orange: "from-toddler-orange/20 to-toddler-orange/5",
};

const iconColorMap = {
  pink: "text-toddler-pink bg-toddler-pink/20",
  purple: "text-toddler-purple bg-toddler-purple/20",
  blue: "text-toddler-blue bg-toddler-blue/20",
  green: "text-toddler-green bg-toddler-green/20",
  yellow: "text-toddler-yellow bg-toddler-yellow/20",
  orange: "text-toddler-orange bg-toddler-orange/20",
};

/**
 * Stats Card component
 */
export function StatsCard({
  title,
  value,
  format = "number",
  change,
  icon,
  color,
}: StatsCardProps): React.JSX.Element {
  const formattedValue =
    format === "currency"
      ? formatCurrency(value)
      : format === "percentage"
        ? `${value.toFixed(1)}%`
        : formatNumber(value);

  const changeInfo =
    change !== undefined
      ? change > 0
        ? { icon: TrendingUp, color: "text-green-500", text: `+${change}%` }
        : change < 0
          ? { icon: TrendingDown, color: "text-red-500", text: `${change}%` }
          : { icon: Minus, color: "text-gray-400", text: "0%" }
      : null;

  return (
    <Card
      className={cn(
        "bg-gradient-to-br border-0 hover:shadow-xl transition-shadow duration-300",
        colorMap[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formattedValue}
          </p>
          {changeInfo && (
            <div className={cn("mt-2 flex items-center gap-1", changeInfo.color)}>
              <changeInfo.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{changeInfo.text}</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColorMap[color])}>{icon}</div>
      </div>
    </Card>
  );
}
