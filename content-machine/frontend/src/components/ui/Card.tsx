/**
 * Reusable Card component
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "bordered";
}

/**
 * Card component
 */
export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps): React.JSX.Element {
  const variants = {
    default: "bg-white shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-xl",
    bordered: "bg-white border-2 border-gray-100",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header component
 */
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("flex items-center justify-between mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Title component
 */
export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Card Content component
 */
export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Footer component
 */
export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}
